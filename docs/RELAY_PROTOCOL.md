# Cloud Communication Protocol

> [!NOTE]
> **Status: DEPRECATED & REPLACED BY SUPABASE DIRECT FLOW**
> 
> The standalone WebSocket relay server (`relay/` package and `vendorRelay.ts`) was deprecated and removed from the codebase in commit `f25140d`. The project now uses Supabase Storage + Postgres RPCs + Supabase Realtime directly.
> 
> This document summarizes the active Supabase RPC protocol for reference, while archiving the legacy protocol contract below.

---

## Active Protocol: Supabase Storage & RPCs

### 1. Vendor Station Resolution
- **Customer -> Supabase:**
  ```sql
  select id, shop_name, prop_name, address, offer
  from public.vendor_profiles
  where slug = :slug and accepting_jobs = true;
  ```

### 2. Job Reservation
- **Customer -> Supabase (RPC):**
  ```typescript
  supabase.rpc("reserve_guest_print_job", {
    p_vendor_slug: slug,
    p_original_name: file.name,
    p_mime_type: file.type,
    p_file_size: file.size,
    p_print_settings: settings,
  });
  ```
- **Returns:** `{ job_id: UUID, vendor_id: UUID, storage_path: string }`
- **Initial Status:** `'uploading'`

### 3. Encrypted File Upload
- **Customer -> Supabase Storage:**
  ```typescript
  supabase.storage
    .from("print-jobs")
    .upload(storage_path, file, { contentType: file.type, upsert: false });
  ```

### 4. Job Completion
- **Customer -> Supabase (RPC):**
  ```typescript
  supabase.rpc("complete_guest_print_job", {
    p_job_id: job_id,
  });
  ```
- **Updates Status:** `'pending'`

### 5. Realtime Notification
- **Supabase -> Vendor Desktop (Realtime):**
  - Event: `postgres_changes` on table `public.print_jobs` where `vendor_id = :vendor_id`.
  - Vendor downloads file from `print-jobs` bucket, verifies file integrity, updates status to `'queued'`, and prints locally.

### 6. Storage Purge
- **Vendor Desktop -> Supabase Storage:**
  - On print confirmation, removes `storage_path` immediately via `supabase.storage.from("print-jobs").remove([storage_path])`.
  - Updates job status to `'printed'`.

---

## Historical Reference: Legacy WebSocket Relay Protocol (Deprecated)

*For historical reference only. The standalone relay server has been removed.*

### Connection
- Vendor URL: `ws://localhost:47832/ws?role=vendor`
- Customer URL: `ws://localhost:47832/ws?role=customer&slug=<vendor-slug>`

### Messages
- `vendor:auth`: Vendor authenticates with Supabase access token.
- `print:start`: Customer declares filename, mimeType, and size.
- `print:ready`: Relay acknowledges and provides chunk size (256 KB).
- Binary chunks: Sent over WebSocket.
- `print:end`: Customer marks completion of transmission.
- `print:accepted`: Vendor accepts job into local queue.
- `print:result`: Vendor reports final print success/failure.
