# Project Context

## Product

QR Print Bridge (espresso-print) is a Windows-first print station application tailored for stationery shops, copy centers, and cybercafés.

Customers scan a permanent vendor QR code using any mobile browser, upload PDF/JPG/PNG documents, and submit them directly to the vendor's print station. The vendor's Windows desktop application receives jobs in real-time, displays live queue statuses, and prints locally using Windows printers.

## Product Requirements

- **Zero customer friction:** No mobile app installation, account creation, or messaging channels needed.
- **Permanent QR per vendor:** Unique public slug (`/v/<vendor-slug>`) ensures physical counter posters remain valid indefinitely across restarts.
- **Vendor personalization & offers:** Vendors configure shop name, proprietor name, address, and live customer offers/promotions directly from the desktop app.
- **Physical QR poster generator:** Desktop app provides a built-in print preview to print counter-ready QR posters.
- **Private storage & auto-cleanup:** Uploads are stored in a private Supabase Storage bucket and deleted immediately upon successful print completion.
- **Postgres as source of truth:** All job statuses (`uploading`, `pending`, `queued`, `printing`, `printed`, `failed`, `rejected`) and metadata are recorded in Postgres.
- **Realtime with recovery:** Supabase Realtime drives job alerts, backed by full recovery fetches on reconnect and 60-second fallback polling while disconnected.
- **Multi-network capability:** Customers on mobile data can submit jobs without being connected to the shop's local Wi-Fi.
- **Low operational cost:** Serverless architecture (Vercel guest hosting + Supabase free/low tier + local desktop printing). Standalone relay servers have been eliminated.

## Architecture Status

The project has transitioned to a monorepo containing:
1. `guest/`: Mobile-optimized customer web application with marketing landing page (`/`) and upload station (`/v/<slug>`).
2. `vendor-desktop/`: Electron + React application handling vendor authentication, profile & promotional offer management, printable QR sheet creation, and Windows printing.
3. `supabase/`: Database migrations, security definer RPCs, and private storage policies.

The standalone WebSocket relay server has been completely removed in favor of direct Supabase Storage + Realtime architecture.

## Abuse Prevention & Security

- Permanent QR codes do not prove physical customer presence; vendor availability controls (`accepting_jobs = true`) determine whether new jobs are permitted.
- Security definer RPCs (`reserve_guest_print_job` and `complete_guest_print_job`) validate file types, size bounds (max 25 MB), and ensure objects exist before queuing.
- Restrictive Row Level Security (RLS) ensures vendors can only access and delete their own files and jobs.

## Development Philosophy

- Concise, high-value explanations.
- Small, independently verifiable steps.
- Preserve existing working code and printing workflows.
- Keep documentation strictly synchronized with active implementation.
- Distinguish between implemented code, locally tested functionality, and remote deployment tasks.
