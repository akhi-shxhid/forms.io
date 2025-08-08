import { FormSchema } from '@/features/builder/types';

const STORAGE_KEY = 'forms';

export function listForms(): FormSchema[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as FormSchema[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveForm(schema: Omit<FormSchema, 'id' | 'createdAt'>): FormSchema {
  const existing = listForms();
  const full: FormSchema = {
    ...schema,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([full, ...existing]));
  return full;
}

export function getForm(id: string): FormSchema | undefined {
  return listForms().find((f) => f.id === id);
}
