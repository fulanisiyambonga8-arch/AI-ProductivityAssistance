import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, RefreshCw, SendHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Panel, ToolIntro } from "@/components/ToolIntro";
import { PromptInspector } from "@/components/PromptInspector";
import { buildChatPrompt } from "@/lib/prompts";
import { chatReply, PROMPT_STARTERS, sleep } from "@/lib/mock-ai";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "A workplace co-pilot with prompt starters, editable replies and full conversation history for the small asks that break your focus.",
      },
      { property: "og:title", content: "AI Chatbot for workplace tasks" },
      {
        property: "og:description",
        content: "Ask for a rewrite, an agenda or a priority call — with editable answers you stay in control of.",
      },
    ],
  }),
  component: ChatTool,
});

type Msg = { id: string; role: "user" | "assistant"; text: string };

function ChatTool() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || loading) return;
    setLastPrompt(message);
    setInput("");
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: message }]);
    setLoading(true);
    await sleep(700);
    setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "assistant", text: chatReply(message) }]);
    setLoading(false);
    inputRef.current?.focus();
  }

  function edit(id: string, text: string) {
    setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, text } : msg)));
  }

  async function regenerate() {
    if (!lastPrompt) return;
    setLoading(true);
    await sleep(700);
    setMessages((m) => [
      ...m,
      { id: `a-${Date.now()}`, role: "assistant", text: chatReply(lastPrompt) },
    ]);
    setLoading(false);
  }

  return (
    <div>
      <ToolIntro
        eyebrow="AI Chatbot"
        title="A co-pilot for the in-between"
        description="Prompt starters for common workplace asks, replies you can edit in place, and a visible prompt structure behind every answer."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <Panel className="flex min-h-[32rem] flex-col lg:col-span-3">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 && (
              <div className="rounded-2xl ai-surface p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Start with a prompt starter, or ask anything about your work.
                </p>
              </div>
            )}

            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-[13px] text-primary-foreground text-pretty">
                    {m.text}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="max-w-[90%]">
                  <textarea
                    value={m.text}
                    onChange={(e) => edit(m.id, e.target.value)}
                    rows={m.text.split("\n").length + 1}
                    className="w-full resize-none rounded-2xl rounded-bl-md glass-tile px-3.5 py-2 text-[13px] leading-relaxed text-foreground/85 outline-none ring-1 ring-border"
                    aria-label="Assistant response (editable)"
                  />
                  <div className="mt-1 flex gap-2">
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(m.text);
                        toast.success("Response copied");
                      }}
                      className="flex items-center gap-1 rounded-lg glass-tile px-2 py-1 text-[11px] font-medium ring-1 ring-border"
                    >
                      <Copy className="size-3" aria-hidden /> Copy
                    </button>
                    <button
                      onClick={regenerate}
                      className="flex items-center gap-1 rounded-lg glass-tile px-2 py-1 text-[11px] font-medium ring-1 ring-border"
                    >
                      <RefreshCw className="size-3" aria-hidden /> Regenerate
                    </button>
                    <button
                      onClick={() => setMessages((prev) => prev.filter((x) => x.id !== m.id))}
                      className="flex items-center gap-1 rounded-lg glass-tile px-2 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border"
                    >
                      <Trash2 className="size-3" aria-hidden /> Clear
                    </button>
                  </div>
                </div>
              ),
            )}

            {loading && (
              <p className="animate-pulse text-[13px] text-muted-foreground">Thinking…</p>
            )}
            <div ref={endRef} />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {PROMPT_STARTERS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="rounded-full glass-tile px-2.5 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground"
              >
                {p}
              </button>
            ))}
          </div>

          <form
            className="mt-3 flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask anything about your work…"
              className="flex-1 resize-none rounded-xl glass-tile px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-ring"
              aria-label="Message"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
              aria-label="Send message"
            >
              <SendHorizontal className="size-4" aria-hidden />
            </button>
          </form>
        </Panel>

        <Panel className="lg:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            Prompt history
          </p>
          {messages.filter((m) => m.role === "user").length === 0 ? (
            <p className="mt-2 text-[13px] text-muted-foreground">
              Your previous prompts will be listed here so you can reuse them.
            </p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {messages
                .filter((m) => m.role === "user")
                .map((m) => (
                  <li key={m.id}>
                    <button
                      onClick={() => send(m.text)}
                      className="w-full rounded-xl glass-tile px-3 py-2 text-left text-[12px] text-foreground/80 ring-1 ring-border transition-colors hover:text-foreground"
                    >
                      {m.text}
                    </button>
                  </li>
                ))}
            </ul>
          )}
          <PromptInspector template={buildChatPrompt(lastPrompt || input)} />
        </Panel>
      </div>
    </div>
  );
}
