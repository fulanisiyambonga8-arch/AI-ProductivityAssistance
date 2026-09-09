import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ListChecks, CalendarClock, Search, MessagesSquare, ShieldCheck } from "lucide-react";
import { Panel, ToolIntro } from "@/components/ToolIntro";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard Overview — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "An AI workspace that drafts emails, summarizes meetings, plans your day, and researches topics — with a human review step built in.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Automate routine workplace tasks: email drafting, meeting summaries, task planning, research briefs and chat support.",
      },
    ],
  }),
  component: Overview,
});

const KPIS = [
  { label: "Time saved today", value: "3h 12m", note: "▲ 18% vs yesterday", tone: "accent" },
  { label: "Tasks automated", value: "47", note: "▲ 6 this week", tone: "accent" },
  { label: "Emails drafted", value: "12", note: "3 pending review", tone: "brand" },
  { label: "Meetings summarized", value: "8", note: "2 action items open", tone: "muted" },
] as const;

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    eyebrow: "Smart Email Generator",
    title: "Draft & polish in one pass",
    body: "Turn bullet points into a tone-matched email with subject line, call-to-action and an editable draft.",
  },
  {
    to: "/meetings",
    icon: ListChecks,
    eyebrow: "Meeting Notes Summarizer",
    title: "Notes into an auditable record",
    body: "Executive summary, owned action items, decisions made and dated milestones — from raw transcripts.",
  },
  {
    to: "/planner",
    icon: CalendarClock,
    eyebrow: "AI Task Planner",
    title: "A day that reflects priority",
    body: "Unstructured lists become time-blocked schedules ranked by urgency and impact, inside your working hours.",
  },
  {
    to: "/research",
    icon: Search,
    eyebrow: "AI Research Assistant",
    title: "Decision-ready briefs",
    body: "Key takeaways, labelled inferences, a recommendation, and an explicit list of what still needs verifying.",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    eyebrow: "AI Chatbot",
    title: "A co-pilot for the in-between",
    body: "Prompt starters, editable replies and full prompt history for the small asks that break your focus.",
  },
] as const;

function Overview() {
  return (
    <div>
      <ToolIntro
        eyebrow="Dashboard Overview"
        title="Good morning, Siyambonga"
        description="Five AI tools that absorb the repetitive parts of knowledge work — drafting, summarizing, planning and researching — while keeping a human in the loop on every output."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl glass-panel p-4">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{k.value}</p>
            <p
              className={`mt-1 text-[11px] font-medium ${
                k.tone === "accent"
                  ? "text-accent"
                  : k.tone === "brand"
                    ? "text-primary"
                    : "text-muted-foreground"
              }`}
            >
              {k.note}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {TOOLS.map(({ to, icon: Icon, eyebrow, title, body }) => (
          <Link key={to} to={to} className="group">
            <Panel className="h-full transition-shadow group-hover:shadow-lg">
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {eyebrow}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-bold text-balance">{title}</h2>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">{body}</p>
            </Panel>
          </Link>
        ))}

        <Panel className="h-full">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
              <ShieldCheck className="size-4" aria-hidden />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                Responsible AI
              </p>
              <h2 className="mt-1 font-display text-lg font-bold text-balance">
                Built for review, not blind trust
              </h2>
            </div>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li>• Every output is editable before it leaves the app.</li>
            <li>• Missing facts appear as [placeholders], never invented.</li>
            <li>• Each tool exposes the exact prompt behind its output.</li>
            <li>• Research briefs list what still needs verifying.</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
