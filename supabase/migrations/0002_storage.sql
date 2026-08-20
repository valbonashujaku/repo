-- Storage bucket for site-visit photos (Section K of the data dictionary).
-- Private bucket: photos are only reachable via signed URLs / RLS-checked
-- access, never publicly listable.

insert into storage.buckets (id, name, public)
values ('company-photos', 'company-photos', false)
on conflict (id) do nothing;

-- Path convention: `${mapper_id}/${company_id}-...`. Policies below key off
-- the first path segment being the uploading mapper's own auth.uid(), and
-- separately grant admins full access.

create policy "company_photos_mapper_insert"
on storage.objects for insert
with check (
  bucket_id = 'company-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "company_photos_mapper_select_own"
on storage.objects for select
using (
  bucket_id = 'company-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "company_photos_admin_all"
on storage.objects for all
using (bucket_id = 'company-photos' and public.is_admin())
with check (bucket_id = 'company-photos' and public.is_admin());
