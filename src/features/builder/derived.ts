import { FormField } from './types';

export type ValuesMap = Record<string, any>;

function age(val: string | Date | null | undefined): number | null {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  const diff = Date.now() - d.getTime();
  const years = diff / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(years);
}

const helpers = { age };

export function computeDerivedValue(formula: string, values: ValuesMap) {
  try {
    // Provide a safe-ish sandbox with helpers and values only
    // eslint-disable-next-line no-new-func
    const fn = new Function('fields', 'helpers', `return (${formula});`);
    return fn(values, helpers);
  } catch (e) {
    return undefined;
  }
}

export function buildValuesFromDefaults(fields: FormField[]) {
  const vals: ValuesMap = {};
  for (const f of fields) {
    vals[f.id] = f.defaultValue ?? (f.type === 'checkbox' ? false : '');
  }
  return vals;
}
