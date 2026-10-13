# Security Requirements

## Authentication and Authorization

- **Vendor Identity:** Vendors authenticate via Supabase Auth with secure tokens persisted in local storage.
- **Tenant Isolation:** Every job in `public.print_jobs` strictly references `vendor_id`. Row Level Security (RLS) ensures vendors can only `select`, `update`, and `delete` their own jobs (`using (vendor_id = auth.uid())`).
- **Profile Privacy:** Anonymous users can query `public.vendor_profiles` only when `accepting_jobs = true`. Only the authenticated vendor can update their profile.

## Storage Security & Upload Safeguards

- **Private Bucket Only:** The `print-jobs` bucket is strictly private (`public = false`). Direct public URLs or directory listings are forbidden.
- **Strict Allowed MIME Types:** Enforced at bucket level and inside Postgres RPCs to `application/pdf`, `image/jpeg`, and `image/png`.
- **Upload Size Bound:** Maximum file size is strictly capped at 25 MB (`26,214,400 bytes`).
- **Cryptographic Storage Paths:** Storage paths are generated server-side by `reserve_guest_print_job` as `<vendor_id>/<job_id>/<sanitized_filename>`. Guessing paths across vendors is impossible.
- **Conditional Upload Policy:** Anonymous clients can only insert into the bucket if `public.can_upload_guest_print_job(name)` confirms an active job is reserved in `uploading` status for that exact path.
- **Verification on Completion:** `complete_guest_print_job` requires the file to physically exist in `storage.objects` before promoting the job to `pending`, preventing phantom queue injection.

## Print Safety & Input Sanitization

- **Untrusted Client Input:** All customer print settings and filenames are treated as untrusted input.
- **Filename Sanitization:** Filenames are sanitized on reservation (`regexp_replace(replace(p_original_name, chr(92), '/'), '^.*/', '')`) and on the desktop (`sanitizeFileName`).
- **Option Clamping:** Copies are clamped between 1 and 99; orientation, color, collate, paper size, and page ranges are validated before passing to the Windows print pipeline.
- **Magic Number Verification:** The desktop host verifies binary file signatures (`isSupportedSignature`) before processing any downloaded file.

## QR Counter Security & Abuse Prevention

A permanent counter QR code can be photographed and triggered remotely. To mitigate abuse:
- The vendor can toggle `accepting_jobs` off at any time, instantly rejecting new upload reservations.
- File size, supported formats, and strict database constraints limit surface area.

## Secret Management

- **Zero Service-Role Exposure:** The Supabase `service-role` secret key is never embedded in browser bundles, guest HTML/JS, or Electron renderer code.
- **Scoped Public Keys:** Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are packaged in client applications.
- **Automated Cleanup Secrets:** The scheduled GitHub Actions cleanup workflow will store the `service-role` key strictly in encrypted GitHub repository secrets.

## Retention & Customer Document Deletion

- **Immediate Deletion:** As soon as a job successfully submits to the local Windows printer, `vendorJobs.ts` triggers immediate removal from Supabase Storage via `supabase.storage.from("print-jobs").remove([storage_path])`.
- **24-Hour Expiration Fallback:** Abandoned or failed uploads have an `expires_at` column defaulted to `now() + interval '24 hours'`, targeted by scheduled cleanup.
