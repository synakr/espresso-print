import {
  Download,
  MapPin,
  QrCode,
  Laptop,
  Mail,
  MessageCircle,
  Printer,
  Zap,
  CheckCircle2,
  Megaphone,
  Store,
  ArrowUpRight,
  Monitor,
  FileText,
  Clock,
} from "lucide-react";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ed] px-4 py-4 text-[#14232c] sm:px-8 sm:py-6">
      <div className="mx-auto flex min-h-[96vh] max-w-[1040px] flex-col">

        {/* Navigation */}
        <LandingNavigation />

        {/* Main Content */}
        <div className="my-auto space-y-7 py-6 sm:space-y-8">
          <HeroWithCenterActions />
          <VisualBenefitsGrid />
        </div>

        {/* Vendor Support Footer */}
        <VendorSupportFooter />

      </div>
    </main>
  );
}

function LandingNavigation() {
  return (
    <nav
      className="flex w-full items-center justify-between border-b border-[#e2ded2] pb-3"
      aria-label="Main navigation"
    >
      <a
        href="/"
        className="inline-flex items-center gap-2 font-display text-[17px] font-extrabold tracking-tight text-[#14232c] no-underline"
      >
        <span>
          espresso<strong className="text-[#07866b]">print</strong>
        </span>
      </a>

      <div className="flex items-center gap-2">
        <a
          href="/v/demo"
          className="text-xs font-semibold text-[#5b6e76] transition-colors hover:text-[#07866b]"
        >
          Customer Demo
        </a>
      </div>
    </nav>
  );
}

function HeroWithCenterActions() {
  return (
    <section className="text-center">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f6f0] px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#07866b]">
        Empowering Local Print Shops &amp; Cyber Cafés
      </div>

      <h1 className="mx-auto mt-3 max-w-[700px] text-[34px] font-black leading-[1.08] tracking-tight text-[#102434] sm:text-[46px]">
        Supercharge Your Print Shop.
      </h1>

      <p className="mx-auto mt-2.5 max-w-[560px] text-xs leading-relaxed text-[#5b6e76] sm:text-[14px]">
        No more taking files over WhatsApp or email. Let nearby customers send print jobs right to your counter.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href="/download"
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#07866b] px-6 text-[13px] font-bold text-white no-underline shadow-sm transition-all hover:bg-[#06725b] hover:shadow-md active:scale-[0.98]"
        >
          <Download size={17} />
          <span>Download App (Windows)</span>
        </a>
      </div>
    </section>
  );
}

function VisualBenefitsGrid() {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">

      {/* Card 1: Smart Printing */}
      <div className="group relative overflow-hidden rounded-3xl border border-[#dcece4] bg-gradient-to-br from-[#f1fbf6] via-white to-[#e4f6ed] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#07866b]/10 sm:p-6">

        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#07866b]/[0.07] transition-transform duration-500 group-hover:scale-125" />

        <div className="relative flex items-center justify-between">
          <span className="rounded-full border border-[#cce9db] bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#07866b]">
            Work Smarter
          </span>

          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#07866b] text-white shadow-lg shadow-[#07866b]/20 transition-transform duration-300 group-hover:rotate-[-6deg]">
            <Printer size={22} strokeWidth={1.8} />
          </div>
        </div>

        <div className="relative mt-7 flex h-[116px] items-center justify-center overflow-hidden rounded-2xl border border-white bg-white/70">
          <div className="relative w-[78%] rounded-xl border border-[#e0eae4] bg-white p-3 shadow-sm transition-transform duration-300 group-hover:scale-[1.03]">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#e5f7ee] text-[#07866b]">
                <Zap size={17} />
              </div>
              <div className="flex-1">
                <div className="h-2 w-20 rounded-full bg-[#233c39]/15" />
                <div className="mt-2 h-1.5 w-14 rounded-full bg-[#233c39]/10" />
              </div>
              <CheckCircle2 size={19} className="text-[#07866b]" />
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8f0eb]">
              <div className="h-full w-full rounded-full bg-[#07866b]" />
            </div>
          </div>
        </div>

        <div className="relative mt-5">
          <h3 className="text-xl font-extrabold leading-tight tracking-tight text-[#153a30]">
            Printing, Made Effortless.
          </h3>
          <p className="mt-2.5 text-[13px] leading-[1.8] text-[#59756a]">
            Let automation handle the routine. Receive customer print jobs
            digitally and streamline your printing workflow with fewer manual steps.
          </p>
        </div>

        <div className="relative mt-5 flex items-center gap-2 border-t border-[#dcece4] pt-4 text-[11px] font-bold text-[#07866b]">
          <CheckCircle2 size={15} />
          <span>A smoother printing workflow</span>
        </div>
      </div>

      {/* Card 2: Free Marketing */}
      <div className="group relative overflow-hidden rounded-3xl border border-[#e9dfd0] bg-gradient-to-br from-[#fff9ee] via-white to-[#f8edda] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#b77927]/10 sm:p-6">

        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#d69a36]/[0.10] transition-transform duration-500 group-hover:scale-125" />

        <div className="relative flex items-center justify-between">
          <span className="rounded-full border border-[#f0dfbc] bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a36a16]">
            At Zero Cost
          </span>

          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#d99a35] text-white shadow-lg shadow-[#d99a35]/25 transition-transform duration-300 group-hover:rotate-[6deg]">
            <Megaphone size={22} strokeWidth={1.8} />
          </div>
        </div>

        <div className="relative mt-7 flex h-[116px] items-center justify-center overflow-hidden rounded-2xl border border-white bg-white/70">
          <div className="w-[84%] rounded-xl border border-[#efe6d7] bg-white p-3 shadow-sm transition-transform duration-300 group-hover:scale-[1.03]">
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0d4] text-[#b77927]">
                <Store size={21} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-extrabold text-[#4a3821]">
                  Your Print Shop
                </div>
                <div className="mt-1 text-[9px] text-[#9a7b52]">
                  Discover local services
                </div>
              </div>
              <ArrowUpRight size={17} className="text-[#b77927]" />
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="rounded-md bg-[#fff4df] px-2 py-1 text-[9px] font-bold text-[#a36a16]">
                Local visibility
              </span>
              <span className="rounded-md bg-[#f6f2e9] px-2 py-1 text-[9px] text-[#88765d]">
                Online presence
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-5">
          <h3 className="text-xl font-extrabold leading-tight tracking-tight text-[#49351c]">
            Get Discovered. Pay Nothing.
          </h3>
          <p className="mt-2.5 text-[13px] leading-[1.8] text-[#857052]">
            We help promote your print shop on our website at no marketing
            cost to you, helping more nearby customers discover your services.
          </p>
        </div>

        <div className="relative mt-5 flex items-center gap-2 border-t border-[#eee2cd] pt-4 text-[11px] font-bold text-[#a36a16]">
          <CheckCircle2 size={15} />
          <span>Website promotion at no cost</span>
        </div>
      </div>

      {/* Card 3: Connected Workflow */}
      <div className="group relative overflow-hidden rounded-3xl border border-[#dce4f4] bg-gradient-to-br from-[#f0f5ff] via-white to-[#e9efff] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#5578cb]/10 sm:p-6">

        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#5578cb]/[0.08] transition-transform duration-500 group-hover:scale-125" />

        <div className="relative flex items-center justify-between">
          <span className="rounded-full border border-[#d8e2f8] bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#4867ad]">
            Stay Organized
          </span>

          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#4867ad] text-white shadow-lg shadow-[#4867ad]/20 transition-transform duration-300 group-hover:rotate-[6deg]">
            <Monitor size={22} strokeWidth={1.8} />
          </div>
        </div>

        <div className="relative mt-7 flex h-[116px] items-center justify-center overflow-hidden rounded-2xl border border-white bg-white/70">
          <div className="w-[84%] rounded-xl border border-[#e1e7f4] bg-white p-3 shadow-sm transition-transform duration-300 group-hover:scale-[1.03]">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-extrabold text-[#2a3e70]">
                Print Queue
              </div>
              <span className="rounded-md bg-[#e9f8ef] px-2 py-1 text-[9px] font-bold text-[#07866b]">
                Ready
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-[#5578cb]" />
                <div className="h-1.5 flex-1 rounded-full bg-[#e6eaf3]" />
                <CheckCircle2 size={13} className="text-[#07866b]" />
              </div>
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-[#5578cb]" />
                <div className="h-1.5 w-1/2 rounded-full bg-[#e6eaf3]" />
                <Clock size={13} className="text-[#a0aac0]" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-5">
          <h3 className="text-xl font-extrabold leading-tight tracking-tight text-[#23365f]">
            Every Job, In Sync.
          </h3>
          <p className="mt-2.5 text-[13px] leading-[1.8] text-[#647493]">
            Keep customer submissions and printing tasks organized from your
            desktop, making it easier to manage incoming work at your counter.
          </p>
        </div>

        <div className="relative mt-5 flex items-center gap-2 border-t border-[#dce4f4] pt-4 text-[11px] font-bold text-[#4867ad]">
          <CheckCircle2 size={15} />
          <span>Organized jobs, less hassle</span>
        </div>
      </div>

    </section>
  );
}
function VendorSupportFooter() {
  return (
    <footer className="mt-6 border-t border-[#e2ded2] pt-5 pb-3">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="text-sm font-extrabold text-[#14232c]">
            Need help with EspressoPrint?
          </p>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-[#6b7f88]">
            Vendors can contact our developer team for website issues,
            technical difficulties, or assistance using the platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <a
            href="mailto:YOUR_DEVELOPER_EMAIL@example.com?subject=EspressoPrint%20Vendor%20Support"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#07866b] px-4 text-xs font-bold text-white no-underline transition-colors hover:bg-[#06725b]"
          >
            <Mail size={15} />
            Contact Developer Team
          </a>

          <a
            href="mailto:YOUR_DEVELOPER_EMAIL@example.com?subject=EspressoPrint%20Technical%20Issue"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#d8e2dc] bg-white px-4 text-xs font-bold text-[#14232c] no-underline transition-colors hover:bg-[#f0f9f5]"
          >
            <MessageCircle size={15} />
            Report an Issue
          </a>
        </div>
      </div>

      <p className="mt-5 text-center text-[10px] text-[#8b958f]">
        © {new Date().getFullYear()} EspressoPrint. All rights reserved.
      </p>
    </footer>
  );
}