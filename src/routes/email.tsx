import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, RefreshCw, Sparkle } from "lucide-react";
import { toast } from "sonner";
import { Field, Panel, ToolIntro, inputClass } from "@/components/ToolIntro";
import { PromptInspector } from "@/components/PromptInspector";
import { buildEmailPrompt } from "@/lib/prompts";
import { generateEmail, sleep, type EmailTone } from "@/lib/mock-ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Turn bullet points into a tone-matched professional email with subject line, call-to-action and an editable draft.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Draft tone-matched workplace emails from a few bullet points, then edit before sending.",
      },
    ],
  }),
  component: EmailTool,
});

const TONES: EmailTone[] = ["Formal", "Friendly", "Persuasive"];
const LENGTHS = ["Concise", "Standard", "Detailed"] as const;
const CTAS = [
  "Could we schedule a 30-minute call this week?",
  "Please let me know if you approve by Friday.",
  "Reply with any changes and I'll finalise it.",
  "No action needed — sharing for visibility.",
];

function EmailTool() {
  const [recipient, setRecipient] = useState("Priya Raman <priya@nova.io>");
  const [subject, setSubject] = useState("Q3 Roadmap Sign-off");
  const [tone, setTone] = useState<EmailTone>("Formal");
  const [length, setLength] = useState<(typeof LENGTHS)[number]>("Concise");
  const [cta, setCta] = useState(CTAS[0]);
  const [advanced, setAdvanced] = useState(false);
  const [context, setContext] = useState(
    "Confirm the launch date of 14 October\nRequest budget approval for the additional support hours\nPropose a short review call before sign-off",
  );

  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [loading, setLoading] = useState(false);

  const template = buildEmailPrompt({ recipient, subject, tone, length, cta, context });

  async function generate() {
    setLoading(true);
    await sleep();
    const draft = generateEmail({ recipient, subject, tone, length, cta, context });
    setDraftSubject(draft.subject);
    setDraftBody(draft.body);
    setLoading(false);
  }

  async function copy() {
    await navigator.clipboard.writeText(`Subject: ${draftSubject}\n\n${draftBody}`);
    toast.success("Draft copied to clipboard");
  }

  return (
    <div>
      <ToolIntro
        eyebrow="Smart Email Generator"
        title="Draft & polish in one pass"
        description="Give it the context, pick a tone, and get a complete email you can edit before it ever leaves your hands."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <Panel className="lg:col-span-2">
          <div className="space-y-3">
            <Field label="Recipient">
              <input
                className={inputClass}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="name@company.com"
              />
            </Field>
            <Field label="Subject">
              <input
                className={inputClass}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What is this about?"
              />
            </Field>
            <Field label="Tone">
              <div className="flex gap-1.5">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                      tone === t
                        ? "bg-primary text-primary-foreground"
                        : "glass-tile text-muted-foreground ring-1 ring-border"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Context / bullet points">
              <textarea
                rows={6}
                className={`${inputClass} resize-none leading-relaxed`}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="One point per line…"
              />
            </Field>

            <div className="flex items-center justify-between rounded-xl glass-tile px-3 py-2.5 ring-1 ring-border">
              <span className="text-[11px] font-medium text-muted-foreground">
                Custom prompt settings
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={advanced}
                onClick={() => setAdvanced((v) => !v)}
                className={`relative h-5 w-9 rounded-full transition-colors ${advanced ? "bg-primary" : "bg-muted"}`}
              >
                <span
                  className={`absolute top-0.5 size-4 rounded-full bg-card transition-all ${advanced ? "left-4.5" : "left-0.5"}`}
                />
              </button>
            </div>

            {advanced && (
              <div className="space-y-3">
                <Field label="Length">
                  <div className="flex gap-1.5">
                    {LENGTHS.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLength(l)}
                        className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                          length === l
                            ? "bg-accent text-accent-foreground"
                            : "glass-tile text-muted-foreground ring-1 ring-border"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Call to action">
                  <select
                    className={inputClass}
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                  >
                    {CTAS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            )}

            <button
              onClick={generate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              <Sparkle className={`size-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
              {loading ? "Drafting…" : "Generate draft"}
            </button>
          </div>

          <PromptInspector template={template} />
        </Panel>

        <Panel className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Generated draft · editable
            </p>
            <div className="flex gap-2">
              <button
                onClick={copy}
                disabled={!draftBody}
                className="flex items-center gap-1.5 rounded-lg glass-tile px-2.5 py-1.5 text-[11px] font-semibold ring-1 ring-border disabled:opacity-50"
              >
                <Copy className="size-3.5" aria-hidden /> Copy
              </button>
              <button
                onClick={generate}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground disabled:opacity-50"
              >
                <RefreshCw className="size-3.5" aria-hidden /> Regenerate
              </button>
            </div>
          </div>

          {draftBody ? (
            <div className="mt-3 rounded-2xl ai-surface p-4">
              <input
                className="w-full bg-transparent font-display text-sm font-semibold outline-none"
                value={draftSubject}
                onChange={(e) => setDraftSubject(e.target.value)}
                aria-label="Draft subject"
              />
              <textarea
                rows={16}
                className="mt-2 w-full resize-none bg-transparent text-sm leading-relaxed text-foreground/85 outline-none"
                value={draftBody}
                onChange={(e) => setDraftBody(e.target.value)}
                aria-label="Draft body"
              />
            </div>
          ) : (
            <div className="mt-3 rounded-2xl ai-surface p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Your draft will appear here — fully editable before you copy or send it.
              </p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
