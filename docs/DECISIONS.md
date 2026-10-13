# Architecture Decisions

## D1 — Windows Desktop Printing

**Decision:** Retain Electron on Windows as the print station host application.  
**Reason:** Physical printer access, Windows spooling APIs, and silent driver printing remain strictly local to the print shop.

## D2 — Permanent Vendor QR

**Decision:** Base public customer upload URLs on a permanent unique vendor slug (`/v/<slug>`).  
**Reason:** Shop counter signs and printed posters survive vendor app restarts, logins, logouts, and software updates without needing re-printing.

## D3 — Supabase Storage

**Decision:** Use a private Supabase Storage bucket (`print-jobs`) for file transfers.  
**Reason:** Avoids the operational cost, infrastructure overhead, and maintenance of maintaining custom public file-transfer relay servers.

## D4 — Database as Source of Truth

**Decision:** Store all job metadata, status transitions, and error states in Postgres (`public.print_jobs`).  
**Reason:** Realtime messages can be missed or delivered out of order during network interruptions. Authoritative state guarantees resilience.

## D5 — Realtime Plus Recovery

**Decision:** Use Supabase Realtime for instant notification with an automatic 60-second polling fallback while disconnected and a full recovery query upon reconnect.  
**Reason:** Ensures real-time responsiveness under normal operation while preventing job loss during temporary network disconnects.

## D6 — Temporary File Retention & Cleanup

**Decision:** Delete files from Supabase Storage immediately after confirmed local printing, backed by a 24-hour scheduled GitHub Actions fallback for abandoned uploads.  
**Reason:** Minimizes customer document retention, respects customer privacy, and stays within free/low-tier storage quotas.

## D7 — Customer Print Options

**Decision:** Accept customer print preferences (copies, orientation, color, collate, duplex, paper size, page ranges).  
**Constraint:** The desktop application must validate and normalize options before passing them to the Windows printer. Unsupported options must not cause silent failures.

## D8 — Approval Workflow Streamlining

**Decision:** Temporarily eliminate manual approve/reject modal interactions and route valid cloud jobs directly into the local print queue.  
**Reason:** Streamlines counter throughput and eliminates UI friction during early validation while the full auto-approval safety policies are refined.

## D9 — Monorepo Architecture

**Decision:** Organize the codebase into npm workspaces (`guest` for the customer web app and `vendor-desktop` for the Electron app).  
**Reason:** Ensures clean separation of web and desktop dependencies, separate build targets, and streamlined local development.

## D10 — Removal of Standalone Relay Server

**Decision:** Completely remove the legacy Node.js WebSocket relay package (`relay/`) and `vendorRelay.ts`.  
**Reason:** Pure Supabase Storage + Realtime architecture provides superior reliability, lower complexity, and zero server hosting overhead.

## D11 — Vendor Profile Customization & Customer Offers

**Decision:** Store shop personalization (`prop_name`, `shop_name`, `address`, `offer`) on `public.vendor_profiles`, manageable directly in the desktop app's Welcome Banner and visible on the customer's upload card.  
**Reason:** Enhances customer trust, promotes shop branding, and allows shop owners to market discounts and services right at the counter.

## D12 — Offscreen Canvas-Based PDF Printing

**Decision:** Render PDF documents via `pdfjs-dist` to HTML5 canvas inside an offscreen Electron `BrowserWindow` (`pdf-print.html`) and print via `webContents.print`.  
**Reason:** Guarantees consistent document layout, precise margins, and reliable silent printing across various Windows printer drivers.

## D13 — Dedicated Printable QR Poster Generator

**Decision:** Provide a dedicated printable poster window (`qr-print.html`) accessible via "Print QR" in the desktop UI.  
**Reason:** Allows vendors to immediately print physical counter signage on their local printer without third-party design tools.
