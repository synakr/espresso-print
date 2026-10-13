# Supabase Setup & Database Schema

## Overview

The backend is built entirely on Supabase services:
- **Supabase Auth:** Email/password vendor authentication and persistent session management.
- **Postgres:** Tables `public.vendor_profiles` and `public.print_jobs`.
- **Private Storage:** Bucket `print-jobs` for secure temporary file staging.
- **Supabase Realtime:** Publication `supabase_realtime` broadcasting job events to desktop subscribers.

---

## Migrations

The migrations reside in `supabase/migrations/` and should be applied in order:

1. `202610120001_storage_jobs.sql` — Schema definition, `print-jobs` bucket, triggers, RLS policies, and RPC functions.
2. `202610120002_vendor_profile_select_grants.sql` — Public select grants on `vendor_profiles`, table grants on `print_jobs`, and updated return signature for `reserve_guest_print_job`.

---

## Database Tables

### 1. `public.vendor_profiles`

Linked 1:1 with `auth.users` on `id`.

| Column | Type | Constraints / Default | Description |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key, `references auth.users(id) on delete cascade` | Vendor user ID |
| `slug` | `text` | `not null unique` | Permanent unique URL slug (e.g. `vendor-4a2...`) |
| `display_name`| `text` | `not null default 'Print Vendor'` | Fallback display name |
| `accepting_jobs` | `boolean` | `not null default true` | Shop availability toggle |
| `prop_name` | `text` | `null` | Proprietor name |
| `shop_name` | `text` | `null` | Shop name |
| `address` | `text` | `null` | Complete shop address |
| `offer` | `text` | `null` | Active customer promotional offers (max 500 chars) |
| `created_at` | `timestamptz`| `not null default now()` | Profile creation timestamp |

**Triggers:**
- `on_auth_user_created` on `auth.users`: Executes `handle_new_user()` to automatically create a profile with a deterministic slug upon vendor signup.

**RLS Policies:**
- `"Public can view accepting vendor profiles"`: `for select to anon, authenticated using (accepting_jobs = true)`.
- `"Vendors can manage their profile"`: `for update to authenticated using (id = auth.uid()) with check (id = auth.uid())`.

---

### 2. `public.print_jobs`

Stores the lifecycle of all customer print requests.

| Column | Type | Constraints / Default | Description |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key, `default gen_random_uuid()` | Unique job identifier |
| `vendor_id` | `uuid` | `not null references public.vendor_profiles(id) on delete cascade` | Assigned print shop |
| `storage_path`| `text` | `not null unique` | Path in `print-jobs` bucket (`<vendor_id>/<job_id>/<filename>`) |
| `original_name`| `text` | `not null` | Sanitized original filename |
| `mime_type` | `text` | `check (mime_type in ('application/pdf', 'image/jpeg', 'image/png'))` | File type |
| `file_size` | `bigint` | `check (file_size between 1 and 26214400)` | File byte length (max 25 MB) |
| `print_settings`| `jsonb`| `not null default '{}'::jsonb check (jsonb_typeof(print_settings) = 'object')` | Customer print preferences |
| `status` | `text` | `not null default 'uploading' check (status in ('uploading', 'pending', 'queued', 'printing', 'printed', 'failed', 'rejected'))` | Job status lifecycle |
| `error_message` | `text` | `null` | Detailed error if status is `failed` |
| `result_message`| `text` | `null` | Operational message if status is `printed` or `rejected` |
| `created_at` | `timestamptz`| `not null default now()` | Creation timestamp |
| `updated_at` | `timestamptz`| `not null default now()` | Last update timestamp (auto-updated by trigger) |
| `expires_at` | `timestamptz`| `not null default (now() + interval '24 hours')` | Expiration deadline for cleanup |

**Indexes:**
- `print_jobs_vendor_status_idx`: `on public.print_jobs (vendor_id, status, created_at desc)`
- `print_jobs_expiry_idx`: `on public.print_jobs (expires_at) where status <> 'printed'`

**RLS Policies:**
- `"Vendors can view their print jobs"`: `for select to authenticated using (vendor_id = auth.uid())`
- `"Vendors can update their print jobs"`: `for update to authenticated using (vendor_id = auth.uid())`
- `"Vendors can delete their print jobs"`: `for delete to authenticated using (vendor_id = auth.uid())`

---

## Security Definer RPC Functions

### `reserve_guest_print_job`
- **Arguments:**
  - `p_vendor_slug`: text
  - `p_original_name`: text
  - `p_mime_type`: text
  - `p_file_size`: bigint
  - `p_print_settings`: jsonb (default `{}`)
- **Returns:** `table (job_id uuid, vendor_id uuid, storage_path text)`
- **Behavior:**
  1. Validates slug, file size (1 B to 25 MB), sanitized name, and supported MIME type.
  2. Confirms vendor exists and has `accepting_jobs = true`.
  3. Inserts a new row with `status = 'uploading'`.
  4. Returns generated `job_id`, `vendor_id`, and `storage_path`.
- **Permissions:** `grant execute to anon, authenticated`.

### `complete_guest_print_job`
- **Arguments:** `p_job_id uuid`
- **Returns:** `public.print_jobs`
- **Behavior:**
  1. Updates `status` from `'uploading'` to `'pending'`.
  2. Ensures an actual corresponding file exists in `storage.objects` for bucket `'print-jobs'`.
  3. Raises an exception if no file was uploaded.
- **Permissions:** `grant execute to anon, authenticated`.

### `can_upload_guest_print_job`
- **Arguments:** `p_storage_path text`
- **Returns:** `boolean`
- **Behavior:** Checks whether a print job row exists with `storage_path = p_storage_path` and `status = 'uploading'`.
- **Usage:** Used in the `storage.objects` insertion policy to restrict anonymous uploads to pre-reserved paths.

---

## Storage Bucket Configuration

- **Bucket ID:** `print-jobs`
- **Public:** `false` (Private)
- **File size limit:** 25 MB (`26214400 bytes`)
- **Allowed MIME types:** `application/pdf`, `image/jpeg`, `image/png`

**Storage RLS Policies:**
- `"Guest uploads reserved print jobs"`: `for insert to anon, authenticated with check (bucket_id = 'print-jobs' and public.can_upload_guest_print_job(name))`
- `"Vendors can read their print files"`: `for select to authenticated using (bucket_id = 'print-jobs' and (storage.foldername(name))[1] = auth.uid()::text)`
- `"Vendors can delete their print files"`: `for delete to authenticated using (bucket_id = 'print-jobs' and (storage.foldername(name))[1] = auth.uid()::text)`

---

## Setup Instructions

1. Open your **Supabase Project Dashboard**.
2. Go to **SQL Editor** > **New query**.
3. Copy and run the contents of `supabase/migrations/202610120001_storage_jobs.sql`.
4. Copy and run the contents of `supabase/migrations/202610120002_vendor_profile_select_grants.sql`.
5. Under **Database** > **Publications**, confirm that `print_jobs` is added to the `supabase_realtime` publication.
6. Populate your root `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
