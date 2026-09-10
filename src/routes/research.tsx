import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Sparkle } from "lucide-react";
import { toast } from "sonner";
import { Field, Panel, ToolIntro, inputClass } from "@/components/ToolIntro";
import { PromptInspector } from "@/components/PromptInspector";
import { buildResearchPrompt } from "@/lib/prompts";
import { researchBrief, sleep, type ResearchBrief } from "@/lib/mock-ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Condense articles, links or research questions into key takeaways, labelled insights, a recommendation and a verification checklist.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Decision-ready briefs that separate what the source says from what the model inferred.",
      },
    ],
  }),
  component: ResearchTool,
});

const SAMPLE = `Teams that adopted structured focus blocks reported roughly 22% higher weekly output.
Async written briefs cut recurring meeting time by about half in the surveyed organisations.
Tool adoption alone showed no measurable effect without a change in meeting cadence.
Managers underestimated context-switching costs by a wide margin.`;

function ResearchTool() {
  const [topic, setTopic] = useState("Remote-work productivity practices");
  const [source, setSource] = useState(SAMPLE);
  const [brief, setBrief] = useState<ResearchBrief | null>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    await sleep();
    const result = researchBrief({ topic, source });
    setBrief(result);
    setSummary(result.summary);
    setLoading(false);
  }

  async function copy() {
    await navigator.clipboard.writeText(summary);
    toast.success("Summary copied to clipboard");
  }

  return (
    <div>
      <ToolIntro
        tone="accent"
        eyebrow="AI Research Assistant"
        title="Decision-ready briefs"
        description="Drop in an article, a link or a question. You get takeaways, clearly labelled inferences, one recommendation, and a list of what still needs verifying."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <Panel className="lg:col-span-2">
          <Field label="Research topic or question">
            <input
              className={inputClass}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What are you trying to find out?"
            />
          </Field>
          <div className="mt-3">
            <Field label="Article text or URL reference">
              <textarea
                rows={12}
                className={`${inputClass} resize-none leading-relaxed`}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Paste the article text, or a link…"
              />
            </Field>
          </div>
          <button
            onClick={run}
            disabled={loading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 font-display text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
          >
            <Sparkle className={`size-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
            {loading ? "Reading…" : "Generate brief"}
          </button>
          <PromptInspector template={buildResearchPrompt({ topic, source })} />
        </Panel>

        <div className="space-y-5 lg:col-span-3">
          {!brief ? (
            <Panel>
              <div className="rounded-2xl ai-surface p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Your research brief will appear here.
                </p>
              </div>
            </Panel>
          ) : (
            <>
              <Panel>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                  Key takeaways
                </p>
                <ul className="mt-2 space-y-1.5 text-[13px] text-foreground/85">
                  {brief.takeaways.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span className="text-pretty">{t}</span>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    Insights & recommendation
                  </p>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent ring-1 ring-accent/20">
                    Confidence: {brief.confidence}
                  </span>
                </div>
                <ul className="mt-2 space-y-1.5 text-[13px] text-foreground/85">
                  {brief.insights.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span className="text-pretty">{t}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 rounded-xl ai-surface p-3">
                  <p className="text-[11px] font-semibold text-primary">Recommendation</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-foreground/85 text-pretty">
                    {brief.recommendation}
                  </p>
                </div>
                <div className="mt-3 rounded-xl glass-tile p-3 ring-1 ring-border">
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    Verify before you use this
                  </p>
                  <ul className="mt-1 space-y-1 text-[12px] text-muted-foreground">
                    {brief.verify.map((v, i) => (
                      <li key={i}>• {v}</li>
                    ))}
                  </ul>
                </div>
              </Panel>

              <Panel>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                    Editable summary
                  </p>
                  <button
                    onClick={copy}
                    className="flex items-center gap-1.5 rounded-lg glass-tile px-2.5 py-1.5 text-[11px] font-semibold ring-1 ring-border"
                  >
                    <Copy className="size-3.5" aria-hidden /> Copy
                  </button>
                </div>
                <textarea
                  rows={5}
                  className={`${inputClass} mt-2 resize-none leading-relaxed`}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  aria-label="Editable summary"
                />
              </Panel>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
