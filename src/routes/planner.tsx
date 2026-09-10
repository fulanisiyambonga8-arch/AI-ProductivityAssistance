import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkle, Trash2 } from "lucide-react";
import { Field, Panel, ToolIntro, inputClass } from "@/components/ToolIntro";
import { PromptInspector } from "@/components/PromptInspector";
import { buildPlannerPrompt } from "@/lib/prompts";
import { planTasks, sleep, type Priority, type ScheduledTask } from "@/lib/mock-ai";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Turn an unstructured task list into a prioritised, time-blocked daily or weekly schedule inside your working hours.",
      },
      { property: "og:title", content: "AI Task Planner & Scheduler" },
      {
        property: "og:description",
        content: "Prioritised time blocks ranked by urgency and impact, editable card by card.",
      },
    ],
  }),
  component: PlannerTool,
});

const SAMPLE = `Approve Q3 budget proposal — client waiting
Review client feedback deck
Prepare Monday stand-up notes
Tidy shared drive folders
Draft renewal email for Northwind
Book the team offsite venue`;

const PRIORITY_CLASS: Record<Priority, string> = {
  High: "bg-primary/15 text-primary",
  Medium: "bg-accent/15 text-accent",
  Low: "bg-muted text-muted-foreground",
};

function PlannerTool() {
  const [tasks, setTasks] = useState(SAMPLE);
  const [timeframe, setTimeframe] = useState<"Daily Schedule" | "Weekly Plan">("Daily Schedule");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [schedule, setSchedule] = useState<ScheduledTask[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    await sleep();
    setSchedule(planTasks({ tasks, timeframe, start, end }));
    setLoading(false);
  }

  function update(id: string, patch: Partial<ScheduledTask>) {
    setSchedule((s) => (s ? s.map((t) => (t.id === id ? { ...t, ...patch } : t)) : s));
  }

  function remove(id: string) {
    setSchedule((s) => (s ? s.filter((t) => t.id !== id) : s));
  }

  const days = schedule ? Array.from(new Set(schedule.map((s) => s.day))) : [];

  return (
    <div>
      <ToolIntro
        eyebrow="AI Task Planner / Scheduler"
        title="A day that reflects priority"
        description="Paste whatever the list looks like in your head. Items are ranked High, Medium or Low on urgency and impact, then placed inside your working hours."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <Panel className="lg:col-span-2">
          <Field label="Task list (one per line)">
            <textarea
              rows={10}
              className={`${inputClass} resize-none leading-relaxed`}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder="Everything on your plate…"
            />
          </Field>

          <div className="mt-3">
            <Field label="Timeframe">
              <div className="flex gap-1.5">
                {(["Daily Schedule", "Weekly Plan"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeframe(t)}
                    className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                      timeframe === t
                        ? "bg-primary text-primary-foreground"
                        : "glass-tile text-muted-foreground ring-1 ring-border"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Working hours from">
              <input
                type="time"
                className={inputClass}
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </Field>
            <Field label="until">
              <input
                type="time"
                className={inputClass}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </Field>
          </div>

          <button
            onClick={run}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            <Sparkle className={`size-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
            {loading ? "Planning…" : "Build schedule"}
          </button>

          <PromptInspector template={buildPlannerPrompt({ tasks, timeframe, start, end })} />
        </Panel>

        <Panel className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Prioritised schedule · editable
            </p>
            <span className="text-[11px] text-muted-foreground">
              {timeframe} · {start}–{end}
            </span>
          </div>

          {!schedule || schedule.length === 0 ? (
            <div className="mt-4 rounded-2xl ai-surface p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Your prioritised time blocks will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {days.map((day) => (
                <div key={day}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {day}
                  </p>
                  <div className="space-y-2">
                    {schedule
                      .filter((s) => s.day === day)
                      .map((s) => (
                        <div key={s.id} className="rounded-xl ai-surface p-3">
                          <div className="flex items-center gap-3">
                            <input
                              value={s.time}
                              onChange={(e) => update(s.id, { time: e.target.value })}
                              className="w-14 shrink-0 bg-transparent text-[11px] font-medium text-muted-foreground outline-none"
                              aria-label="Start time"
                            />
                            <span
                              className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${PRIORITY_CLASS[s.priority]}`}
                            >
                              {s.priority.toUpperCase()}
                            </span>
                            <input
                              value={s.task}
                              onChange={(e) => update(s.id, { task: e.target.value })}
                              className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground/85 outline-none"
                              aria-label="Task"
                            />
                            <span className="shrink-0 text-[11px] text-muted-foreground">
                              {s.duration}
                            </span>
                            <button
                              onClick={() => remove(s.id)}
                              className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                              aria-label={`Remove ${s.task}`}
                            >
                              <Trash2 className="size-3.5" aria-hidden />
                            </button>
                          </div>
                          <p className="mt-1 pl-[4.6rem] text-[11px] text-muted-foreground">
                            {s.rationale}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
