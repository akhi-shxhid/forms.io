import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFormBySlug } from '@/lib/formsApi';
import type { FormField } from '@/features/builder/types';
import { buildValuesFromDefaults, computeDerivedValue, ValuesMap } from '@/features/builder/derived';
import { validateAll } from '@/features/builder/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function PublicForm() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [fields, setFields] = useState<FormField[]>([]);
  const [values, setValues] = useState<ValuesMap>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formId, setFormId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!slug) return;
      const data = await getFormBySlug(slug);
      const f = (data?.schema?.fields || []) as FormField[];
      if (mounted) {
        setFields(f);
        setFormId(data?.id || '');
        setValues(buildValuesFromDefaults(f));
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  useEffect(() => {
    const next = { ...values };
    for (const f of fields) {
      if (f.derived?.enabled && f.derived.formula) {
        const v = computeDerivedValue(f.derived.formula, next);
        next[f.id] = v ?? '';
      }
    }
    setValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.map(f => f.derived?.formula).join('|'), JSON.stringify(values)]);

  const onChange = (id: string, v: any) => setValues((prev) => ({ ...prev, [id]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const vmap = validateAll(fields, values);
    setErrors(vmap);
    const hasErrors = Object.values(vmap).some((arr) => arr.length > 0);
    
    if (!hasErrors && formId) {
      setSubmitting(true);
      try {
        const { error } = await supabase
          .from('submissions')
          .insert({
            form_id: formId,
            data: values
          });
        
        if (error) throw error;
        
        toast({ 
          title: 'Form submitted successfully!', 
          description: 'Thank you for your submission.' 
        });
        
        // Reset form
        setValues(buildValuesFromDefaults(fields));
        setErrors({});
      } catch (error: any) {
        toast({ 
          title: 'Submission failed', 
          description: error.message || 'Please try again later.' 
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const renderField = (f: FormField) => {
    const err = errors[f.id]?.[0];
    const common = <Label className="brutal-label">{f.label}{f.required ? ' *' : ''}</Label>;
    switch (f.type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <div>
            {common}
            <Input className="brutal-input" type={f.type === 'text' ? 'text' : f.type === 'number' ? 'number' : 'date'} value={values[f.id] ?? ''} onChange={(e) => onChange(f.id, e.target.value)} disabled={!!f.derived?.enabled} />
            {err && <p className="text-destructive mt-1">{err}</p>}
          </div>
        );
      case 'textarea':
        return (
          <div>
            {common}
            <Textarea className="brutal-input" value={values[f.id] ?? ''} onChange={(e) => onChange(f.id, e.target.value)} disabled={!!f.derived?.enabled} />
            {err && <p className="text-destructive mt-1">{err}</p>}
          </div>
        );
      case 'select':
        return (
          <div>
            {common}
            <select className="brutal-input w-full h-10 px-3" value={values[f.id] ?? ''} onChange={(e) => onChange(f.id, e.target.value)} disabled={!!f.derived?.enabled}>
              <option value="">Select...</option>
              {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            {err && <p className="text-destructive mt-1">{err}</p>}
          </div>
        );
      case 'radio':
        return (
          <div>
            {common}
            <div className="flex flex-wrap gap-4">
              {(f.options || []).map((o) => (
                <label key={o} className="flex items-center gap-2">
                  <input type="radio" name={f.id} value={o} checked={values[f.id] === o} onChange={() => onChange(f.id, o)} disabled={!!f.derived?.enabled} />
                  <span>{o}</span>
                </label>
              ))}
            </div>
            {err && <p className="text-destructive mt-1">{err}</p>}
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-end gap-2">
            <Checkbox checked={!!values[f.id]} onCheckedChange={(v) => onChange(f.id, Boolean(v))} disabled={!!f.derived?.enabled} />
            <Label className="brutal-label">{f.label}</Label>
            {err && <p className="text-destructive mt-1">{err}</p>}
          </div>
        );
    }
  };

  return (
    <section className="brutal-card animate-enter">
      <h1 className="text-3xl font-black mb-4">Public Form</h1>
      {fields.length === 0 ? (
        <p className="text-muted-foreground">This form is empty or unavailable.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map((f) => (<div key={f.id}>{renderField(f)}</div>))}
          <div className="pt-4">
            <Button variant="brutal" size="xl" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
