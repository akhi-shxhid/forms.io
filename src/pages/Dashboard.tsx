import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { listForms as listDbForms, type DbForm } from '@/lib/formsApi';
import { FileText, Plus, Eye, Users, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { toast } = useToast();
  const [forms, setForms] = useState<DbForm[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await listDbForms();
      setForms(data);
    } catch (error) {
      toast({ title: 'Error loading forms', description: 'Could not load your forms' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const totalForms = forms.length;
  const publicForms = forms.filter(f => f.is_public).length;
  const recentForms = forms.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="brutal-card">
        <h1 className="text-4xl font-black mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your forms.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="brutal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalForms}</div>
            <p className="text-xs text-muted-foreground">Forms created</p>
          </CardContent>
        </Card>

        <Card className="brutal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Forms</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publicForms}</div>
            <p className="text-xs text-muted-foreground">Publicly shared</p>
          </CardContent>
        </Card>

        <Card className="brutal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forms.filter(f => new Date(f.created_at).getMonth() === new Date().getMonth()).length}</div>
            <p className="text-xs text-muted-foreground">Forms created</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="brutal-card">
        <h2 className="text-2xl font-black mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/create">
            <Button variant="brutal" size="lg" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Form
            </Button>
          </Link>
          <Link to="/preview?demo=true">
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Demo
            </Button>
          </Link>
          <Link to="/myforms">
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Manage Forms
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Forms */}
      <div className="brutal-card">
        <h2 className="text-2xl font-black mb-4">Recent Forms</h2>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : recentForms.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No forms created yet</p>
            <Link to="/create">
              <Button variant="brutal">Create Your First Form</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentForms.map((form) => (
              <Card key={form.id} className="border-2 border-foreground">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{form.name}</CardTitle>
                  <CardDescription>
                    Created {new Date(form.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link to={`/preview?id=${form.id}`}>
                      <Button variant="outline" size="sm">Preview</Button>
                    </Link>
                    {form.is_public && form.share_slug && (
                      <Link to={`/f/${form.share_slug}`}>
                        <Button variant="outline" size="sm">Public</Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}