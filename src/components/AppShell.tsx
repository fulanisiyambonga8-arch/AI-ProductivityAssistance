import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  ListChecks,
  CalendarClock,
  Search,
  MessagesSquare,
  Menu,
  X,
  Info,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard Overview", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Notes Summarizer", icon: ListChecks },
  { to: "/planner", label: "AI Task Planner", icon: CalendarClock },
  { to: "/research", label: "AI Research Assistant", icon: Search },
  { to: "/chat", label: "AI Chatbot", icon: MessagesSquare },
] as const;

export const DISCLAIMER =
  "AI-generated outputs are produced using automated algorithms. Please review, edit, and verify all content before sending or implementing.";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-2 py-3">
        <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent font-display text-sm font-bold text-primary-foreground">
          AI
        </div>
        <div>
          <p className="font-display text-sm font-bold leading-none">Productivity Assistant</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Workplace automation</p>
        </div>
      </div>

      <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
        Workspace
      </p>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            activeOptions={{ exact: to === "/" }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent"
            activeProps={{
              className:
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium bg-sidebar-accent text-foreground shadow-sm ring-1 ring-border",
            }}
          >
            <Icon className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl glass-tile p-3 ring-1 ring-border">
        <p className="font-display text-xs font-semibold">Sandbox Mode</p>
        <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
          Outputs are simulated for preview. Verify before use.
        </p>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = NAV.find((n) => (n.to === "/" ? pathname === "/" : pathname.startsWith(n.to)));

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="ambient-glow absolute -top-32 -left-24 size-[520px] rounded-full bg-primary/40 blur-3xl" />
        <div className="ambient-glow-slow absolute top-40 -right-24 size-[460px] rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-[420px] rounded-full bg-brand-soft/30 blur-3xl" />
      </div>

      <div className="relative flex h-screen">
        {/* Desktop sidebar */}
        <aside
          className={`hidden shrink-0 flex-col gap-1 border-r border-hairline bg-sidebar p-4 backdrop-blur-2xl md:flex ${
            collapsed ? "w-0 overflow-hidden border-r-0 p-0" : "w-64"
          }`}
        >
          {!collapsed && <SidebarContent />}
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <button
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            />
            <aside className="absolute inset-y-0 left-0 flex w-72 flex-col gap-1 border-r border-hairline bg-background/95 p-4 backdrop-blur-2xl">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg glass-tile ring-1 ring-border"
                aria-label="Close navigation"
              >
                <X className="size-4" aria-hidden />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 border-b border-hairline bg-glass px-4 py-4 backdrop-blur-2xl md:px-8">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid size-9 place-items-center rounded-lg glass-tile ring-1 ring-border md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-4" aria-hidden />
            </button>
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="hidden size-9 place-items-center rounded-lg glass-tile ring-1 ring-border md:grid"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="size-4" aria-hidden />
            </button>

            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">AI-Productivity-Assistant</p>
              <p className="truncate font-display text-lg font-bold leading-tight">
                {active?.label ?? "Dashboard Overview"}
              </p>
            </div>

            <div className="ml-auto hidden w-64 items-center gap-2 rounded-xl glass-tile px-3 py-2 ring-1 ring-border sm:flex">
              <Search className="size-4 text-muted-foreground" aria-hidden />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                placeholder="Search tools, tasks, notes…"
                aria-label="Search"
              />
            </div>
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-primary text-xs font-semibold text-primary-foreground">
              SF
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-5 md:p-8">
            {children}

            <footer className="mt-6 flex items-start gap-3 rounded-2xl glass-panel px-4 py-3">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <p className="text-[12px] leading-snug text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Responsible AI Disclaimer:
                </span>{" "}
                {DISCLAIMER}
              </p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
