# Current Status

## Target Architecture

- **Workspace:** Monorepo using npm workspaces (`guest/` and `vendor-desktop/`).
- **Desktop:** Electron 33 + React 18 + TypeScript (Windows).
- **Auth / Database:** Supabase Auth + Postgres.
- **File Storage:** Private Supabase Storage bucket (`print-jobs`).
- **Notifications:** Supabase Realtime with automatic reconnect recovery & 60s fallback polling.
- **Guest Page:** Vercel-hosted static single page application.
- **Cleanup:** Immediate deletion upon print completion + 24-hour GitHub Actions fallback for abandoned files.

## Implementation Progress

| Feature / Milestone | Status | Details |
| --- | --- | --- |
| **Monorepo Structure** | Completed | Clean separation of `@qr-print/guest` and `@qr-print/vendor-desktop`. |
| **Supabase Migrations** | Completed | `202610120001_storage_jobs.sql` and `202610120002_vendor_profile_select_grants.sql` define tables, policies, and RPCs. |
| **Guest Upload Flow** | Completed | Calls `reserve_guest_print_job`, uploads directly to private Storage, and calls `complete_guest_print_job`. |
| **Vendor Job Retrieval** | Completed | Supabase Realtime channel with 60s fallback polling and reconnect state reconciliation. |
| **Vendor Shop Profile & Offers** | Completed | Vendors configure shop name, proprietor, address, and live offers in the desktop banner; surfaced on guest upload card. |
| **Printable QR Poster** | Completed | Dedicated high-res printable poster preview window (`qr-print.html`) with native print dialog. |
| **Local Windows Printing** | Completed | High-fidelity canvas rendering of PDFs via `pdfjs-dist` (`pdf-print.html`) and direct printing via `webContents.print`. |
| **Storage Object Cleanup** | Completed | Files are removed from the Supabase Storage bucket immediately when the print job succeeds. |
| **Deduplication Safeguards** | Completed | Deduplicated at database level, in `vendorJobs.ts` processing map, and inside Electron host queue. |
| **Relay Deprecation** | Completed | Standalone relay server and `vendorRelay.ts` removed from codebase. |
| **Guest Landing Page** | Completed | Accessible at `/` with product overview, benefits, and download links. |
| **Customer Print Settings UI** | Pending | Backend RPC and desktop printing support options, but the guest form currently passes `{}`. |
| **GitHub Actions Cleanup** | Pending | 24-hour expiration fallback script/workflow for abandoned uploads not yet created. |
| **Production Guest Deployment** | Pending | `vercel.json` configured; production deployment verification needed. |
| **Windows Installer Packaging** | Pending | `npm run package` configured with `electron-builder`; needs verification in clean environment. |
| **Cross-Network End-to-End Test** | Pending | Real phone on mobile data printing to vendor on another network requires testing. |

## Detailed Checklist

- [x] Initial Supabase schema, private Storage bucket, and ownership RLS migrations
- [x] Customer upload to Storage and job creation RPCs
- [x] Vendor job retrieval and Realtime notifications
- [x] Startup/reconnect recovery and 60-second disconnected-only polling
- [x] Apply Windows print settings and canvas PDF rendering
- [x] Deduplicate jobs across Realtime and polling events
- [x] Delete files from Storage after successful printing
- [x] Custom shop profile details (`prop_name`, `shop_name`, `address`) and customer promotional offers
- [x] Dedicated printable QR poster generator in Electron
- [x] Customer landing page for web visitors at `/`
- [ ] Add guest print settings configuration UI to the customer upload card
- [ ] Add GitHub Actions fallback cleanup for files older than 24 hours
- [ ] Deploy guest page to Vercel and verify live DNS/HTTPS
- [ ] Build and test the Windows NSIS installer
- [ ] Complete cross-network end-to-end test on live hardware

## Definition of Done

A customer scans the permanent counter QR, views the vendor's profile and active offers, uploads a supported file (PDF/JPG/PNG ≤ 25 MB), and configures print settings. The vendor desktop app receives the job via Realtime, downloads the document, prints it locally, and deletes the file from Supabase Storage. Duplicate submissions, reconnect disconnects, and oversized files are handled safely.
