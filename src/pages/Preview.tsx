import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getForm } from '@/lib/formsStorage';
import { FormField } from '@/features/builder/types';
import { buildValuesFromDefaults, computeDerivedValue, ValuesMap } from '@/features/builder/derived';
import { validateAll } from '@/features/builder/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { getFormBySlug, getFormById } from '@/lib/formsApi';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Demo form fields
const DEMO_FIELDS: FormField[] = [
  {
    id: 'demo-name',
    type: 'text',
    label: 'Full Name',
    required: true,
    defaultValue: '',
    validation: { minLength: 2 },
    derived: { enabled: false, parentIds: [], formula: '' }
  },
  {
    id: 'demo-email',
    type: 'text',
    label: 'Email Address',
    required: true,
    defaultValue: '',
    validation: { email: true },
    derived: { enabled: false, parentIds: [], formula: '' }
  },
  {
    id: 'demo-age',
    type: 'number',
    label: 'Age',
    required: false,
    defaultValue: '',
    validation: {},
    derived: { enabled: false, parentIds: [], formula: '' }
  },
  {
    id: 'demo-dob',
    type: 'date',
    label: 'Date of Birth',
    required: false,
    defaultValue: '',
    validation: {},
    derived: { enabled: false, parentIds: [], formula: '' }
  },
  {
    id: 'demo-country',
    type: 'select',
    label: 'Country',
    required: true,
    options: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Other'],
    defaultValue: '',
    validation: {},
    derived: { enabled: false, parentIds: [], formula: '' }
  },
  {
    id: 'demo-experience',
    type: 'radio',
    label: 'Experience Level',
    required: true,
    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    defaultValue: '',
    validation: {},
    derived: { enabled: false, parentIds: [], formula: '' }
  },
  {
    id: 'demo-newsletter',
    type: 'checkbox',
    label: 'Subscribe to newsletter',
    required: false,
    defaultValue: false,
    validation: {},
    derived: { enabled: false, parentIds: [], formula: '' }
  },
  {
    id: 'demo-message',
    type: 'textarea',
    label: 'Additional Comments',
    required: false,
    defaultValue: '',
    validation: { maxLength: 500 },
    derived: { enabled: false, parentIds: [], formula: '' }
  },
  {
    id: 'demo-calculated-age',
    type: 'number',
    label: 'Calculated Age (from DOB)',
    required: false,
    defaultValue: '',
    validation: {},
    derived: { 
      enabled: true, 
      parentIds: ['demo-dob'], 
      formula: 'helpers.age(fields["demo-dob"])' 
    }
  }
];

export default function Preview() {
  const qs = useQuery();
  const paramId = qs.get('formId');
  const isDemo = qs.get('demo') === 'true';
  const builderFields = useSelector((s: RootState) => s.builder.fields);

  const slug = qs.get('slug');
  const id = qs.get('id');
  const [fields, setFields] = useState<FormField[]>(() => {
    if (isDemo) return DEMO_FIELDS;
    if (paramId) {
      const f = getForm(paramId);
      return f?.fields || [];
    }
    return builderFields;
  });

  const [values, setValues] = useState<ValuesMap>(() => buildValuesFromDefaults(fields));
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setValues(buildValuesFromDefaults(fields));
  }, [fields]);

  useEffect(() => {
    // recompute derived fields
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

  const { toast } = useToast();

  useEffect(() => {
    if (isDemo) {
      setFields(DEMO_FIELDS);
      return;
    }
    if (!slug && !id && !paramId) {
      setFields(builderFields);
      return;
    }
    // load from localStorage id
    if (paramId) {
      const f = getForm(paramId);
      setFields(f?.fields || []);
      return;
    }
    // load from Supabase by slug or id
    (async () => {
      try {
        if (slug) {
          const db = await getFormBySlug(slug);
          setFields((db?.schema?.fields as FormField[]) || []);
        } else if (id) {
          const db = await getFormById(id!);
          setFields((db?.schema?.fields as FormField[]) || []);
        }
      } catch (err: any) {
        toast({ title: 'Could not load form', description: err.message || 'Unknown error' });
      }
    })();
  }, [slug, id, paramId, builderFields, toast, isDemo]);

  const onChange = (id: string, v: any) => {
    setValues((prev) => ({ ...prev, [id]: v }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vmap = validateAll(fields, values);
    setErrors(vmap);
    const hasErrors = Object.values(vmap).some((arr) => arr.length > 0);
    if (!hasErrors) {
      if (isDemo) {
        toast({ title: 'Demo Form Submitted!', description: 'This is just a demo. In a real form, data would be saved.' });
      } else {
        toast({ title: 'Form Submitted!', description: 'Your form data has been validated successfully.' });
      }
    }
  };

  const renderField = (f: FormField) => {
    const common = (
      <>
        <Label className="brutal-label">{f.label}{f.required ? ' *' : ''}</Label>
      </>
    );

    const err = errors[f.id]?.[0];

    switch (f.type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <div>
            {common}
            <Input
              className="brutal-input"
              type={f.type === 'text' ? 'text' : f.type === 'number' ? 'number' : 'date'}
              value={values[f.id] ?? ''}
              onChange={(e) => onChange(f.id, e.target.value)}
              disabled={!!f.derived?.enabled}
            />
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
              {(f.options || []).map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
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
    <section className="brutal-card">
      <h2 className="text-2xl font-black mb-6">{isDemo ? 'Demo Form - All Field Types' : 'Preview'}</h2>
      {isDemo && (
        <div className="mb-6 p-4 bg-accent/20 border-2 border-accent">
          <p className="font-bold">🎯 This is a comprehensive demo showcasing all available field types:</p>
          <p className="text-sm text-muted-foreground mt-1">Text, Number, Date, Select, Radio, Checkbox, Textarea, and Derived fields</p>
        </div>
      )}
      {fields.length === 0 ? (
        <p className="text-muted-foreground">No fields configured. Build your form in Create.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.id}>{renderField(f)}</div>
          ))}
          <div className="pt-4">
            <Button variant="brutal" size="xl" type="submit">Submit</Button>
          </div>
        </form>
      )}
    </section>
  );
}
