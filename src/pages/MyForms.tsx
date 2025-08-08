import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createForm, listForms as listDbForms, togglePublic, type DbForm } from '@/lib/formsApi';
import { FormField } from '@/features/builder/types';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Share, Download, Calendar, Users } from 'lucide-react';

export default function MyForms() {
  const { toast } = useToast();
  const [forms, setForms] = useState<DbForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Record<string, number>>({});

  const load = async () => {
    try {
      const data = await listDbForms();
      setForms(data);
      
      // Load submission counts for each form
      const submissionCounts: Record<string, number> = {};
      for (const form of data) {
        try {
          const { count } = await supabase
            .from('submissions')
            .select('*', { count: 'exact', head: true })
            .eq('form_id', form.id);
          submissionCounts[form.id] = count || 0;
        } catch (error) {
          submissionCounts[form.id] = 0;
        }
      }
      setSubmissions(submissionCounts);
      
      if ((data || []).length === 0) {
        // Create a demo form for first-time users
        const demoFields: FormField[] = [
          { id: crypto.randomUUID(), type: 'text', label: 'Full Name', required: true, defaultValue: '', validation: {}, derived: { enabled: false, parentIds: [], formula: '' } },
          { id: crypto.randomUUID(), type: 'text', label: 'Email', required: true, defaultValue: '', validation: { email: true }, derived: { enabled: false, parentIds: [], formula: '' } },
          { id: crypto.randomUUID(), type: 'textarea', label: 'Message', required: false, defaultValue: '', validation: {}, derived: { enabled: false, parentIds: [], formula: '' } },
        ];
        try {
          await createForm({ name: 'Demo Contact Form', fields: demoFields, isPublic: true });
          const refreshed = await listDbForms();
          setForms(refreshed);
          toast({ title: 'Demo form created', description: 'We added a demo form to get you started.' });
        } catch (_) {}
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onShare = async (id: string) => {
    const updated = await togglePublic(id, true);
    setForms((prev) => prev.map((f) => (f.id === id ? updated : f)));
    if (updated.share_slug) {
      const url = `${window.location.origin}/f/${updated.share_slug}`;
      await navigator.clipboard.writeText(url);
      toast({ title: 'Share link copied', description: url });
    }
  };

  const onDownload = (schema: any, name: string) => {
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_').toLowerCase()}_schema.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="brutal-card">
      <h2 className="text-2xl font-black mb-6">My Forms</h2>
      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : forms.length === 0 ? (
        <p className="text-muted-foreground">No forms yet. Create one!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((f) => (
            <Card key={f.id} className="brutal-card">
              <CardHeader>
                <CardTitle className="text-xl font-black">{f.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(f.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {submissions[f.id] || 0} responses
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    f.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {f.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Link to={`/preview?id=${f.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Preview
                    </Button>
                  </Link>
                  {f.is_public && f.share_slug ? (
                    <Link to={`/f/${f.share_slug}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Share className="h-3 w-3" />
                        Public
                      </Button>
                    </Link>
                  ) : null}
                  <Button 
                    variant="brutal" 
                    size="sm" 
                    onClick={() => onShare(f.id)}
                    className="flex items-center gap-1"
                  >
                    <Share className="h-3 w-3" />
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDownload(f.schema, f.name)}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
