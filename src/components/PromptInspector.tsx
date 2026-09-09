import { useState } from "react";
import { ChevronDown, Code2 } from "lucide-react";
import type { PromptTemplate } from "@/lib/prompts";

export function PromptInspector({ template }: { template: PromptTemplate }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 rounded-xl glass-tile ring-1 ring-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
        aria-expanded={open}
      >
        <Code2 className="size-3.5 text-accent" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {template.title}
        </span>
        <ChevronDown
          className={`ml-auto size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="space-y-3 border-t border-border px-3 py-3">
          {template.sections.map((s) => (
            <div key={s.label}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                {s.label}
              </p>
              <pre className="mt-1 whitespace-pre-wrap font-sans text-[12.5px] leading-relaxed text-foreground/80">
                {s.body}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
