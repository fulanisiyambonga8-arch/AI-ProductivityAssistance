export function ToolIntro({
  eyebrow,
  title,
  description,
  tone = "brand",
}: {
  eyebrow: string;
  title: string;
  description: string;
  tone?: "brand" | "accent";
}) {
  return (
    <div className="mb-5">
      <p
        className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
          tone === "brand" ? "text-primary" : "text-accent"
        }`}
      >
        {eyebrow}
      </p>
      <h1 className="mt-1 text-2xl font-bold text-balance">{title}</h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
        {description}
      </p>
    </div>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-3xl glass-panel p-5 md:p-6 ${className}`}>{children}</section>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl glass-tile ring-1 ring-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-ring";
