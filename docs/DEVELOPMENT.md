# Development Setup and Troubleshooting

## Project Structure

This repository is structured as an npm monorepo with two primary packages:

- **Root:** Workspace orchestration, shared devDependencies (Tailwind v4), Supabase migrations, and documentation.
- **`guest/` (`@qr-print/guest`):**
  - Customer web application (React 18 + Vite + Tailwind CSS).
  - Contains the marketing landing page at `/` and the customer upload station at `/v/<slug>`.
  - Deploys as static HTML/JS/CSS to Vercel (`vercel.json` configured).
- **`vendor-desktop/` (`@qr-print/vendor-desktop`):**
  - Electron 33 desktop app for Windows print shop counters.
  - `electron/main.cjs`: Electron main process, IPC handlers, and window management.
  - `electron/server.cjs`: Local Express bridge, print settings normalization, and Windows print orchestration.
  - `electron/pdf-print.html`: Offscreen canvas PDF renderer powered by `pdfjs-dist`.
  - `electron/qr-print.html`: Dedicated printable counter QR sheet generator.
  - `src/lib/vendorJobs.ts`: Supabase Realtime consumer, download pipeline, and Storage cleanup.
  - `src/ui/`: Modular React components (`AuthScreen`, `StationHeader`, `WelcomeBanner`, `QrPanel`, `SettingsPanel`, `JobsPanel`, `PreviewDialog`).
- **`supabase/migrations/`:**
  - `202610120001_storage_jobs.sql`: Tables, private bucket creation, storage policies, and RPC definitions.
  - `202610120002_vendor_profile_select_grants.sql`: Public select grants and RPC signature refinement.

## Environment Variables

Copy `.env.example` to `.env` in the repository root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
VITE_GUEST_BASE_URL=https://espresso-print.akhram.dev/
```

- Vite automatically exposes variables prefixed with `VITE_` to both workspaces.
- `VITE_GUEST_BASE_URL`: Base URL used to construct the vendor's permanent QR code and links (e.g., `https://<domain>/v/<slug>`).
- **Security Rule:** Never include the Supabase `service-role` key in `.env` or any client-accessible files.

## Running Locally

### 1. Install Dependencies

From the repository root:

```powershell
npm install
```

### 2. Run Vendor Desktop Application

```powershell
npm run dev
```

This concurrently starts:
1. The Vite dev server for `vendor-desktop` on `http://localhost:5173`.
2. The Electron application once the local dev server is ready.

### 3. Run Guest Web Application (In Another Terminal)

```powershell
npm run dev --workspace guest
```

This launches the customer web application on a local port (e.g., `http://localhost:5174`). You can test the customer flow by visiting:
- Landing page: `http://localhost:5174/`
- Shop upload station: `http://localhost:5174/v/<vendor-slug>`

## Building & Typechecking

```powershell
# Typecheck both workspaces
npm run typecheck

# Build the guest web bundle (outputs to guest/dist)
npm run build:guest

# Build the desktop web bundle (outputs to vendor-desktop/dist)
npm run build:desktop

# Package the Windows desktop application (.exe installer in vendor-desktop/release/)
npm run package
```

## Supabase Database Setup

1. In your Supabase dashboard, open the **SQL Editor**.
2. Run the SQL files in `supabase/migrations/` in sequence:
   - `202610120001_storage_jobs.sql`
   - `202610120002_vendor_profile_select_grants.sql`
3. Verify that the `print-jobs` bucket exists under **Storage** and is marked **Private**.
4. In **Database -> Publications**, ensure that the `print_jobs` table is included in the `supabase_realtime` publication.

## Troubleshooting

### "This print station is currently unavailable" on Guest Page
1. Ensure the vendor is signed in on the desktop app.
2. Confirm the vendor's `vendor_profiles` row exists in Postgres with `accepting_jobs = true`.
3. Check that the URL slug matches the vendor profile's `slug` column.

### Windows Packaging Error (`winCodeSign` symlink error)
If `npm run package` fails with a symlink creation error during electron-builder cache extraction:
1. Enable **Developer Mode** in Windows Settings (*Settings > Privacy & security > For developers > Developer Mode*), or run PowerShell as Administrator.
2. Clear the electron-builder cache in `%LOCALAPPDATA%\electron-builder\cache`.
3. Re-run `npm run package`.

### No Default Printer Detected
1. Open Windows **Printers & scanners** settings and configure a default printer.
2. In the vendor desktop app under **Print Settings**, click the **Refresh** button.
