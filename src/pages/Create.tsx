import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addField, deleteField, moveFieldDown, moveFieldUp, updateField } from '@/features/builder/builderSlice';
import { FormField, FieldType } from '@/features/builder/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { saveForm } from '@/lib/formsStorage';
import { createForm } from '@/lib/formsApi';

const FIELD_TYPES: FieldType[] = ['text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date'];

export default function Create() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const fields = useSelector((s: RootState) => s.builder.fields);
  const [formName, setFormName] = useState<string>('Untitled Form');

  const onAddField = (type: FieldType) => {
    const id = crypto.randomUUID();
    const base: FormField = {
      id,
      type,
      label: `${type.toUpperCase()} Field`,
      required: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
      defaultValue: type === 'checkbox' ? false : '',
      validation: {},
      derived: { enabled: false, parentIds: [], formula: '' },
    };
    dispatch(addField(base));
  };

  const onSave = async () => {
    const name = formName.trim();
    if (!name) {
      toast({ title: 'Enter a form name', description: 'Please name your form before saving.' });
      return;
    }
    try {
      const saved = await createForm({ name, fields, isPublic: false });
      toast({ title: 'Form saved', description: `Saved as "${saved.name}"` });
    } catch (err) {
      const saved = saveForm({ name, fields });
      toast({ title: 'Form saved locally', description: `Saved as "${saved.name}"` });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <section className="lg:col-span-1 brutal-card">
        <h2 className="text-2xl font-black mb-4">Form Setup</h2>
        <div className="space-y-3 mb-4">
          <div>
            <Label className="brutal-label">Form Name</Label>
            <Input className="brutal-input" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g., Contact Form" />
          </div>
        </div>
        <h3 className="text-xl font-black mb-2">Add Field</h3>
        <div className="grid grid-cols-2 gap-3">
          {FIELD_TYPES.map((t) => (
            <Button key={t} variant="brutal" size="sm" onClick={() => onAddField(t)}>
              {t}
            </Button>
          ))}
        </div>
        <div className="mt-6">
          <Button variant="brutal" size="xl" onClick={onSave} className="w-full">Save Form</Button>
        </div>
      </section>

      <section className="lg:col-span-3 brutal-card">
        <h2 className="text-2xl font-black mb-6">Fields</h2>
        {fields.length === 0 && (
          <p className="text-muted-foreground">No fields yet. Add a field to get started.</p>
        )}
        <div className="space-y-6">
          {fields.map((f, idx) => (
            <div key={f.id} className="p-4 border-4 border-foreground bg-card shadow-[8px_8px_0_hsl(var(--brutal-shadow-color))]">
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-black uppercase">{f.type}</span>
                  <div className="flex gap-2">
                    <Button variant="brutal" size="sm" onClick={() => dispatch(moveFieldUp(f.id))} disabled={idx===0}>Up</Button>
                    <Button variant="brutal" size="sm" onClick={() => dispatch(moveFieldDown(f.id))} disabled={idx===fields.length-1}>Down</Button>
                    <Button variant="destructive" size="sm" onClick={() => dispatch(deleteField(f.id))}>Delete</Button>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label className="brutal-label">Label</Label>
                  <Input className="brutal-input" value={f.label} onChange={(e) => dispatch(updateField({ id: f.id, changes: { label: e.target.value } }))} />
                </div>
                <div className="flex items-end gap-2">
                  <Checkbox id={`req-${f.id}`} checked={f.required} onCheckedChange={(val) => dispatch(updateField({ id: f.id, changes: { required: Boolean(val) } }))} />
                  <Label htmlFor={`req-${f.id}`} className="brutal-label">Required</Label>
                </div>
                {['select','radio'].includes(f.type) && (
                  <div className="sm:col-span-2">
                    <Label className="brutal-label">Options (comma-separated)</Label>
                    <Input className="brutal-input" value={(f.options||[]).join(', ')} onChange={(e) => dispatch(updateField({ id: f.id, changes: { options: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) } }))} />
                  </div>
                )}
                {f.type !== 'checkbox' && (
                  <div>
                    <Label className="brutal-label">Default Value</Label>
                    <Input className="brutal-input" value={f.defaultValue ?? ''} onChange={(e) => dispatch(updateField({ id: f.id, changes: { defaultValue: e.target.value } }))} />
                  </div>
                )}

                {/* Validation */}
                <div>
                  <Label className="brutal-label">Min Length</Label>
                  <Input className="brutal-input" type="number" value={f.validation?.minLength ?? ''} onChange={(e) => dispatch(updateField({ id: f.id, changes: { validation: { ...f.validation, minLength: e.target.value ? Number(e.target.value) : undefined } } }))} />
                </div>
                <div>
                  <Label className="brutal-label">Max Length</Label>
                  <Input className="brutal-input" type="number" value={f.validation?.maxLength ?? ''} onChange={(e) => dispatch(updateField({ id: f.id, changes: { validation: { ...f.validation, maxLength: e.target.value ? Number(e.target.value) : undefined } } }))} />
                </div>
                <div className="flex items-end gap-2">
                  <Checkbox id={`email-${f.id}`} checked={!!f.validation?.email} onCheckedChange={(val) => dispatch(updateField({ id: f.id, changes: { validation: { ...f.validation, email: Boolean(val) } } }))} />
                  <Label htmlFor={`email-${f.id}`} className="brutal-label">Email</Label>
                </div>
                <div className="flex items-end gap-2">
                  <Checkbox id={`pwd-${f.id}`} checked={!!f.validation?.password} onCheckedChange={(val) => dispatch(updateField({ id: f.id, changes: { validation: { ...f.validation, password: Boolean(val) } } }))} />
                  <Label htmlFor={`pwd-${f.id}`} className="brutal-label">Password Rule</Label>
                </div>

                {/* Derived */}
                <div className="sm:col-span-2">
                  <div className="flex items-end gap-2 mb-2">
                    <Checkbox id={`derived-${f.id}`} checked={!!f.derived?.enabled} onCheckedChange={(val) => dispatch(updateField({ id: f.id, changes: { derived: { ...(f.derived||{parentIds:[], formula:''}), enabled: Boolean(val) } } }))} />
                    <Label htmlFor={`derived-${f.id}`} className="brutal-label">Derived Field</Label>
                  </div>
                  {f.derived?.enabled && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="brutal-label">Parents</Label>
                        <Select value={f.derived.parentIds.join(',')} onValueChange={(val) => dispatch(updateField({ id: f.id, changes: { derived: { ...f.derived!, parentIds: val.split(',').filter(Boolean) } } }))}>
                          <SelectTrigger className="brutal-input"><SelectValue placeholder="Pick parents" /></SelectTrigger>
                          <SelectContent>
                            {fields.filter(x => x.id !== f.id).map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs mt-1 text-muted-foreground">Select one parent; multi-select via comma not supported in MVP.</p>
                      </div>
                      <div className="sm:col-span-1">
                        <Label className="brutal-label">Formula</Label>
                        <Textarea className="brutal-input" rows={2} placeholder="e.g., helpers.age(fields['dob'])" value={f.derived.formula} onChange={(e) => dispatch(updateField({ id: f.id, changes: { derived: { ...f.derived!, formula: e.target.value } } }))} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
