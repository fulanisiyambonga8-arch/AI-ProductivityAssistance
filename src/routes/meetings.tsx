import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkle } from "lucide-react";
import { Field, Panel, ToolIntro, inputClass } from "@/components/ToolIntro";
import { PromptInspector } from "@/components/PromptInspector";
import { buildMeetingPrompt } from "@/lib/prompts";
import { sleep, summarizeMeeting, type MeetingSummary } from "@/lib/mock-ai";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get an executive summary, owned action items, decisions made and dated milestones.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn transcripts into an auditable record: summary, action items, decisions and deadlines.",
      },
    ],
  }),
  component: MeetingTool,
});

const TABS = ["Executive Summary", "Action Items", "Key Decisions", "Deadlines"] as const;

const SAMPLE = `Sprint review, 10 Oct. Onele will finalise the launch copy by Friday.
We agreed the launch scope is locked for Q3.
Thuliswa to send the budget request to finance before Wednesday.
Decided to postpone the analytics dashboard to Q4.
Sisipho will review client feedback and prepare a summary deck for Monday.
Deadline: security sign-off due 20 Oct.`;

function MeetingTool() {
  const [notes, setNotes] = useState(SAMPLE);
  const [result, setResult] = useState<MeetingSummary | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Executive Summary");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    await sleep();
    setResult(summarizeMeeting(notes));
    setLoading(false);
  }

  function toggle(id: string) {
    setResult((r) =>
      r
        ? { ...r, actionItems: r.actionItems.map((a) => (a.id === id ? { ...a, done: !a.done } : a)) }
        : r,
    );
  }

  return (
    <div>
      <ToolIntro
        tone="accent"
        eyebrow="Meeting Notes Summarizer"
        title="Notes into an auditable record"
        description="Paste a transcript or your shorthand notes. Every action item gets an owner and a date, and decisions keep their original wording."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <Panel className="lg:col-span-2">
          <Field label="Raw meeting notes or transcript">
            <textarea
              rows={14}
              className={`${inputClass} resize-none leading-relaxed`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your notes here…"
            />
          </Field>
          <button
            onClick={run}
            disabled={loading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 font-display text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
          >
            <Sparkle className={`size-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
            {loading ? "Analysing…" : "Summarize notes"}
          </button>
          <PromptInspector template={buildMeetingPrompt(notes)} />
        </Panel>

        <Panel className="lg:col-span-3">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  tab === t
                    ? "bg-accent text-accent-foreground"
                    : "glass-tile text-muted-foreground ring-1 ring-border"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {!result ? (
            <div className="mt-4 rounded-2xl ai-surface p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Structured results appear here once you summarize your notes.
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl ai-surface p-4">
              {tab === "Executive Summary" && (
                <p className="text-sm leading-relaxed text-foreground/85 text-pretty">{result.summary}</p>
              )}

              {tab === "Action Items" && (
                <ul className="space-y-2">
                  {result.actionItems.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-start gap-3 rounded-xl glass-tile p-3 ring-1 ring-border"
                    >
                      <input
                        type="checkbox"
                        checked={a.done}
                        onChange={() => toggle(a.id)}
                        className="mt-0.5 size-4 accent-[oklch(0.507_0.086_165)]"
                        aria-label={`Mark done: ${a.task}`}
                      />
                      <div className="min-w-0">
                        <p
                          className={`text-[13px] leading-snug ${a.done ? "text-muted-foreground line-through" : "text-foreground/85"}`}
                        >
                          {a.task}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Owner: {a.owner} · Due: {a.due}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {tab === "Key Decisions" && (
                <ul className="space-y-2">
                  {result.decisions.map((d, i) => (
                    <li key={i} className="rounded-xl glass-tile p-3 text-[13px] ring-1 ring-border">
                      {d}
                    </li>
                  ))}
                </ul>
              )}

              {tab === "Deadlines" && (
                <ul className="space-y-2">
                  {result.deadlines.map((d, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 rounded-xl glass-tile p-3 ring-1 ring-border"
                    >
                      <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                        {d.date}
                      </span>
                      <span className="text-[13px] text-foreground/85">{d.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
