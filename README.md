# Audit App

Next.js 14 · TypeScript · Tailwind CSS · Supabase

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env.local` and fill in your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Run the dev server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000/new-audit](http://localhost:3000/new-audit)

## Supabase Requirements

**Database** — run in SQL Editor:
```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  project_type text not null,
  structural_system text not null,
  file_path text,
  status text default 'queued',
  created_at timestamptz default now()
);
```

**Storage** — create a private bucket named `project-files`, then add these policies:
```sql
create policy "Allow anon uploads" on storage.objects
for insert to anon with check (bucket_id = 'project-files');

create policy "Allow anon reads" on storage.objects
for select to anon using (bucket_id = 'project-files');
```

## Project Structure

```
src/
  app/
    page.tsx              # Redirects to /new-audit
    new-audit/
      page.tsx            # Main page
  components/
    AuditForm.tsx         # Form logic, upload, DB insert
    DropZone.tsx          # Drag-and-drop PDF input
  lib/
    supabase.ts           # Supabase client
  types/
    project.ts            # TypeScript types
```
