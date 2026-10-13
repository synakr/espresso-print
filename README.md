# QR Print Bridge (espresso-print)

QR Print Bridge is a Windows-first print station for stationery shops and cybercafés. A vendor runs a desktop app and displays a stable QR code on their counter. Customers scan it on their phones, upload a document (PDF, PNG, JPG), and the vendor desktop app receives and prints the file locally using Windows printers.

## Product Rules

- **Cross-network printing:** Customer and vendor can be on different networks (mobile data, separate Wi-Fi).
- **Pure cloud bridge:** Supabase handles vendor authentication, Postgres metadata, private temporary file storage, and Realtime notifications. No standalone relay server is needed.
- **Privacy & cleanup:** Customer files in Supabase Storage are deleted immediately after confirmed printing. Abandoned uploads are subject to a 24-hour expiration fallback.
- **Physical printer:** The vendor's computer prints through its locally configured Windows printer using native Electron printing and canvas-based PDF rendering.
- **Permanent vendor identity:** Each vendor has a permanent slug (`/v/<vendor-slug>`), enabling physical QR posters that survive restarts and re-logins.
- **Promotional features:** Vendors can configure shop details (proprietor name, shop name, address) and active customer promotional offers that display directly on the customer's upload page.

## Current Implementation Status

- **Monorepo architecture:** Separate npm workspaces for `@qr-print/guest` and `@qr-print/vendor-desktop`.
- **Supabase cloud flow:** Guest file reservation (`reserve_guest_print_job`), private Storage upload, completion RPC (`complete_guest_print_job`), and Realtime desktop notifications are implemented and active.
- **Vendor desktop:** Electron + React application with modularized panels (Auth, Header, Welcome & Offer Banner, QR Panel with physical poster preview, Printer Settings, and Live Jobs Queue).
- **Local printing:** High-fidelity PDF rendering via `pdfjs-dist` in an offscreen window, plus native printable QR poster generator.
- **Storage cleanup:** Files are removed from the private Supabase Storage bucket immediately upon print completion.

See also:
- [`AGENTS.md`](AGENTS.md) — instructions and rules for coding agents
- [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md) — source of truth for product goals and architecture
- [`docs/CURRENT_STATUS.md`](docs/CURRENT_STATUS.md) — detailed implementation progress and checklist
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system architecture and data flows
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — local setup, scripts, and troubleshooting
- [`docs/SUPABASE.md`](docs/SUPABASE.md) — database schema, RLS policies, and RPC definitions

## Project Structure

```text
espresso-print/
├── guest/                     # Customer-facing web app (React + Vite + Tailwind CSS)
│   ├── index.html
│   ├── src/
│   │   ├── guest.tsx          # Guest root router (/ -> landing, /v/:slug -> upload)
│   │   ├── components/
│   │   │   ├── landing/       # Marketing landing page (brand, benefits, download link)
│   │   │   └── upload/        # Customer upload flow, vendor offer banner & status
│   │   ├── lib/supabase.ts    # Supabase client
│   │   └── ui/guest.css
│   └── vite.config.ts
├── vendor-desktop/            # Vendor desktop application (Electron + React + Vite)
│   ├── electron/
│   │   ├── main.cjs           # Electron main process & IPC handlers
│   │   ├── preload.cjs        # Context bridge for print host API
│   │   ├── server.cjs         # Local express bridge & print job orchestrator
│   │   ├── pdf-print.html     # Offscreen PDF renderer (pdfjs-dist)
│   │   ├── qr-print.html      # Printable QR poster window
│   │   └── qr-print-preload.cjs
│   ├── src/
│   │   ├── main.tsx
│   │   ├── lib/
│   │   │   ├── supabase.ts    # Supabase client
│   │   │   └── vendorJobs.ts  # Realtime subscription, 60s fallback polling & storage cleanup
│   │   └── ui/                # Modular UI components (AuthScreen, QrPanel, WelcomeBanner, etc.)
│   └── vite.config.ts
├── supabase/
│   └── migrations/            # Versioned SQL migrations (tables, storage policies, RPCs)
├── docs/                      # Technical documentation
└── package.json               # Root npm workspace manifest
```

## Environment Variables

Copy `.env.example` to `.env` in the repository root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
VITE_GUEST_BASE_URL=https://espresso-print.akhram.dev/
```

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`: Public Supabase project credentials. Never put the `service-role` secret key in Vite environment variables.
- `VITE_GUEST_BASE_URL`: The HTTPS domain where the guest web app is hosted (e.g. Vercel deployment). Used by the desktop app to generate permanent QR codes and shareable links.

## Development

From project root:

```powershell
# Install all dependencies across workspaces
npm install

# Start the vendor desktop app in development mode (Electron + Vite)
npm run dev

# Run the guest customer web app locally in another terminal
npm run dev --workspace guest
```

### Build & Typecheck

```powershell
# Typecheck both workspaces
npm run typecheck

# Build the guest web app (dist/ in guest/)
npm run build:guest

# Build the desktop renderer (dist/ in vendor-desktop/)
npm run build:desktop

# Package the Windows desktop application (.exe installer)
npm run package
```

## Supabase Setup

1. Run the migrations in `supabase/migrations/` in order via the Supabase Dashboard SQL Editor:
   - `202610120001_storage_jobs.sql`
   - `202610120002_vendor_profile_select_grants.sql`
2. Verify in Supabase Storage that the `print-jobs` bucket is created, configured as **Private**, and allows `application/pdf`, `image/jpeg`, `image/png` up to 25 MB.
3. Ensure Realtime is enabled for the `public.print_jobs` table in Database -> Publications.
