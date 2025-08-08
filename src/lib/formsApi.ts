import { supabase } from '@/integrations/supabase/client';
import type { FormField } from '@/features/builder/types';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
const random = () => Math.random().toString(36).slice(2, 7);

export type DbForm = {
  id: string;
  user_id: string;
  name: string;
  schema: any;
  is_public: boolean;
  share_slug: string | null;
  created_at: string;
  updated_at: string;
};

export async function createForm(params: { name: string; fields: FormField[]; isPublic?: boolean }) {
  const { name, fields, isPublic } = params;
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');
  const baseSlug = slugify(name) || 'form';
  const share_slug = `${baseSlug}-${random()}`;
  const { data, error } = await supabase
    .from('forms')
    .insert({
      user_id: userData.user.id as any,
      name,
      schema: ({ fields } as any),
      is_public: Boolean(isPublic),
      share_slug,
    } as any)
    .select('*')
    .single();
  if (error) throw error;
  return data as DbForm;
}

export async function listForms() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [] as DbForm[];
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as DbForm[];
}

export async function getFormBySlug(slug: string) {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('share_slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as DbForm | null;
}

export async function togglePublic(id: string, makePublic: boolean) {
  let patch: any = { is_public: makePublic };
  if (makePublic) {
    // ensure slug exists
    const { data: current } = await supabase.from('forms').select('name, share_slug').eq('id', id).maybeSingle();
    const slug = current?.share_slug ?? `${slugify(current?.name || 'form')}-${random()}`;
    patch.share_slug = slug;
  }
  const { data, error } = await supabase.from('forms').update(patch).eq('id', id).select('*').single();
  if (error) throw error;
  return data as DbForm;
}

export async function getFormById(id: string) {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as DbForm | null;
}
