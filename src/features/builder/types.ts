export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date';

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  password?: boolean; // min 8 chars & at least one number
}

export interface DerivedConfig {
  enabled: boolean;
  parentIds: string[];
  formula: string; // expression evaluated with field values
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[]; // for select/radio
  defaultValue?: any;
  validation?: ValidationRules;
  derived?: DerivedConfig;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string; // ISO
  fields: FormField[];
}
