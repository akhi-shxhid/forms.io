import { FormField } from './types';
import { ValuesMap } from './derived';

export function validateFieldValue(field: FormField, value: any): string[] {
  const errors: string[] = [];
  const v = value ?? '';

  if (field.required) {
    const isEmpty =
      (typeof v === 'string' && v.trim() === '') ||
      (Array.isArray(v) && v.length === 0) ||
      (typeof v === 'boolean' && v === false && field.type !== 'checkbox');
    if (isEmpty) errors.push(`${field.label} is required`);
  }

  if (typeof v === 'string' && field.validation) {
    const { minLength, maxLength, email, password } = field.validation;
    if (minLength && v.length < minLength) errors.push(`${field.label} must be at least ${minLength} characters`);
    if (maxLength && v.length > maxLength) errors.push(`${field.label} must be at most ${maxLength} characters`);
    if (email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(v)) errors.push(`${field.label} must be a valid email`);
    }
    if (password) {
      const hasLen = v.length >= 8;
      const hasNum = /\d/.test(v);
      if (!(hasLen && hasNum)) errors.push(`${field.label} must be 8+ chars and include a number`);
    }
  }

  return errors;
}

export function validateAll(fields: FormField[], values: ValuesMap) {
  const map: Record<string, string[]> = {};
  for (const f of fields) {
    map[f.id] = validateFieldValue(f, values[f.id]);
  }
  return map;
}
