/**
 * Simulated AI response generators.
 *
 * No network calls are made. Each generator applies deterministic heuristics to
 * the user's own input so every tool produces meaningful, input-aware output
 * out of the box. Outputs are always labelled as simulated in the UI.
 */

export const SIMULATION_LATENCY = 900;

export function sleep(ms = SIMULATION_LATENCY) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function lines(text: string): string[] {
  return text
    .split(/\n|•|;|(?<=\.)\s+/)
    .map((l) => l.replace(/^[-*\d.)\s]+/, "").trim())
    .filter((l) => l.length > 2);
}

function sentenceCase(text: string) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* ---------------------------------------------------------------- Email --- */

export type EmailTone = "Formal" | "Friendly" | "Persuasive";

export type EmailInput = {
  recipient: string;
  subject: string;
  tone: EmailTone;
  length: "Concise" | "Standard" | "Detailed";
  cta: string;
  context: string;
};

export type EmailDraft = { subject: string; body: string };

const GREETING: Record<EmailTone, (name: string) => string> = {
  Formal: (n) => `Dear ${n},`,
  Friendly: (n) => `Hi ${n},`,
  Persuasive: (n) => `Hello ${n},`,
};

const OPENER: Record<EmailTone, string> = {
  Formal: "I hope this message finds you well. I am writing to follow up on the points below.",
  Friendly: "Hope your week is going well! Wanted to share a quick update on a few things.",
  Persuasive: "I wanted to reach out while this is still timely, because I think there's a clear win here.",
};

const SIGNOFF: Record<EmailTone, string> = {
  Formal: "Kind regards,",
  Friendly: "Thanks so much,",
  Persuasive: "Looking forward to it,",
};

export function generateEmail(input: EmailInput): EmailDraft {
  const name = input.recipient.split(/[@<\s]/)[0] || "there";
  const points = lines(input.context);
  const subject =
    input.subject.trim() ||
    (points[0] ? sentenceCase(points[0]).slice(0, 68) : "Quick follow-up");

  const bulletBlock = points.length
    ? points
        .slice(0, input.length === "Concise" ? 3 : input.length === "Standard" ? 5 : 8)
        .map((p) => `• ${sentenceCase(p)}`)
        .join("\n")
    : "• [Add the key points you want to cover]";

  const middle =
    input.length === "Detailed"
      ? "\n\nFor context, each of these has been reviewed against our current timeline, and I have noted where a decision from your side would unblock the next step.\n"
      : "\n";

  const body = [
    GREETING[input.tone](sentenceCase(name)),
    "",
    OPENER[input.tone],
    "",
    bulletBlock,
    middle.trim(),
    input.cta,
    "",
    SIGNOFF[input.tone],
    "[Your name]",
  ]
    .filter((l) => l !== undefined)
    .join("\n");

  return { subject, body };
}

/* --------------------------------------------------------------- Meeting -- */

export type ActionItem = { id: string; task: string; owner: string; due: string; done: boolean };
export type MeetingSummary = {
  summary: string;
  actionItems: ActionItem[];
  decisions: string[];
  deadlines: { label: string; date: string }[];
};

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function summarizeMeeting(notes: string): MeetingSummary {
  const items = lines(notes);
  const actionKeywords = /(will|to do|todo|action|follow up|send|prepare|draft|review|schedule|assign|owner)/i;
  const decisionKeywords = /(decided|agreed|approved|confirmed|signed off|resolved|chose)/i;
  const dateMatch = /(\d{1,2}\s?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*|mon|tue|wed|thu|fri|next week|friday|monday|eod|q[1-4])/i;

  const actionItems: ActionItem[] = items
    .filter((l) => actionKeywords.test(l))
    .slice(0, 8)
    .map((l, i) => {
      const owner = l.match(/\b([A-Z][a-z]{2,})\b/)?.[1] ?? "Unassigned";
      const due = l.match(dateMatch)?.[0] ?? DAY_NAMES[(i + 1) % 5];
      return {
        id: `action-${i}`,
        task: sentenceCase(l),
        owner,
        due: sentenceCase(due),
        done: false,
      };
    });

  const decisions = items.filter((l) => decisionKeywords.test(l)).slice(0, 5).map(sentenceCase);

  const deadlines = items
    .filter((l) => dateMatch.test(l))
    .slice(0, 5)
    .map((l) => ({
      label: sentenceCase(l.slice(0, 70)),
      date: sentenceCase(l.match(dateMatch)?.[0] ?? "TBC"),
    }));

  const summary = items.length
    ? `The discussion covered ${items.length} points, centred on ${sentenceCase(items[0]).replace(/\.$/, "")}. ${
        decisions.length
          ? `${decisions.length} decision${decisions.length > 1 ? "s were" : " was"} recorded`
          : "No formal decisions were recorded"
      }, and ${actionItems.length} action item${actionItems.length === 1 ? "" : "s"} require follow-up. Verify owners and dates before circulating.`
    : "No notes supplied yet — paste a transcript or your raw meeting notes to generate a structured record.";

  return {
    summary,
    actionItems: actionItems.length
      ? actionItems
      : [
          {
            id: "action-empty",
            task: "[No explicit action items detected — add owners manually]",
            owner: "Unassigned",
            due: "TBC",
            done: false,
          },
        ],
    decisions: decisions.length ? decisions : ["[No explicit decisions detected in the notes]"],
    deadlines: deadlines.length ? deadlines : [{ label: "[No dated milestones detected]", date: "TBC" }],
  };
}

/* --------------------------------------------------------------- Planner -- */

export type Priority = "High" | "Medium" | "Low";
export type ScheduledTask = {
  id: string;
  time: string;
  duration: string;
  task: string;
  priority: Priority;
  rationale: string;
  day: string;
};

function classify(task: string): { priority: Priority; rationale: string } {
  const t = task.toLowerCase();
  if (/(urgent|asap|today|deadline|client|blocker|approve|submit|overdue|present)/.test(t)) {
    return { priority: "High", rationale: "Deadline-bound or blocking someone else's work." };
  }
  if (/(review|prepare|draft|plan|meet|call|research|write|follow up)/.test(t)) {
    return { priority: "Medium", rationale: "Important, but the timing can move within the week." };
  }
  return { priority: "Low", rationale: "Maintenance work — safe to batch into a low-energy block." };
}

const ORDER: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };

export function planTasks(input: {
  tasks: string;
  timeframe: "Daily Schedule" | "Weekly Plan";
  start: string;
  end: string;
}): ScheduledTask[] {
  const raw = lines(input.tasks);
  if (!raw.length) return [];

  const startHour = Number(input.start.split(":")[0] || 9);
  const endHour = Number(input.end.split(":")[0] || 17);
  const slotHours = Math.max(1, Math.floor((endHour - startHour) / Math.max(1, Math.min(raw.length, 6))));

  const classified = raw
    .map((task, i) => ({ task: sentenceCase(task), ...classify(task), i }))
    .sort((a, b) => ORDER[a.priority] - ORDER[b.priority] || a.i - b.i);

  return classified.map((item, i) => {
    const perDay = input.timeframe === "Weekly Plan" ? Math.ceil(classified.length / 5) : classified.length;
    const dayIndex = input.timeframe === "Weekly Plan" ? Math.floor(i / Math.max(1, perDay)) : 0;
    const slotIndex = input.timeframe === "Weekly Plan" ? i % Math.max(1, perDay) : i;
    const hour = Math.min(endHour - 1, startHour + slotIndex * slotHours);
    return {
      id: `slot-${i}`,
      time: `${String(hour).padStart(2, "0")}:00`,
      duration: `${slotHours}h`,
      task: item.task,
      priority: item.priority,
      rationale: item.rationale,
      day: input.timeframe === "Weekly Plan" ? DAY_NAMES[Math.min(4, dayIndex)] : "Today",
    };
  });
}

/* -------------------------------------------------------------- Research -- */

export type ResearchBrief = {
  takeaways: string[];
  insights: string[];
  recommendation: string;
  confidence: "Low" | "Medium" | "High";
  verify: string[];
  summary: string;
};

export function researchBrief(input: { topic: string; source: string }): ResearchBrief {
  const chunks = lines(input.source);
  const topic = input.topic.trim() || "the supplied material";
  const isUrl = /^https?:\/\//i.test(input.source.trim());

  const takeaways = (chunks.length ? chunks.slice(0, 5) : [`No source text supplied for ${topic}`]).map(
    (c) => sentenceCase(c).slice(0, 180),
  );

  return {
    summary: chunks.length
      ? `${sentenceCase(topic)} — condensed from ${chunks.length} passage${chunks.length === 1 ? "" : "s"}. The material converges on practical process change rather than new tooling, and the strongest signals sit in the first third of the source.`
      : `Paste an article, a URL or a research question to generate a brief on ${topic}.`,
    takeaways,
    insights: [
      `The recurring theme across the source is that ${topic.toLowerCase()} succeeds or fails on execution cadence, not on strategy.`,
      "Two or more passages make overlapping claims — treat the repetition as emphasis, not as independent evidence.",
      isUrl
        ? "The source was supplied as a link; content behind the link was not retrieved in this simulation."
        : "Quantitative claims in the text are unsourced and should be traced before reuse.",
    ],
    recommendation: chunks.length
      ? `Pilot one narrow change tied to ${topic.toLowerCase()} for two weeks, measure a single metric, and expand only if the effect holds.`
      : "[Recommendation will appear once source material is supplied]",
    confidence: chunks.length > 4 ? "Medium" : "Low",
    verify: [
      "Original figures and dates against the primary source",
      "Whether cited claims apply to your industry and team size",
      "Any named organisations or people before quoting them",
    ],
  };
}

/* ------------------------------------------------------------------ Chat -- */

export const PROMPT_STARTERS = [
  "Review this draft for clarity",
  "Suggest 3 icebreakers for a client kickoff",
  "Turn these notes into an agenda",
  "Rewrite this update to be 30% shorter",
  "What should I prioritise tomorrow?",
];

export function chatReply(message: string): string {
  const m = message.toLowerCase();

  if (/icebreaker|kickoff/.test(m)) {
    return [
      "Three openers that work for a client kickoff:",
      "1. Ask what a great outcome looks like for them in 90 days — it sets scope and tone at once.",
      "2. Share one specific thing you admired in their work, then invite them to do the same about the project.",
      "3. Ask what the team wants to avoid repeating from a past project — it surfaces risks early.",
      "",
      "Want these tailored to a specific client or industry?",
    ].join("\n");
  }

  if (/clarity|review|draft|edit|shorter|rewrite/.test(m)) {
    return [
      "Here's how I'd tighten it:",
      "1. Lead with the ask — move the request into the first sentence.",
      "2. Replace hedges (\"just\", \"maybe\", \"I think\") with a direct statement.",
      "3. Cut any sentence that restates the previous one; that is usually a third of a draft.",
      "",
      "Paste the text and I'll apply these directly.",
    ].join("\n");
  }

  if (/prioriti|tomorrow|plan|schedule|task/.test(m)) {
    return [
      "Prioritise on urgency × impact:",
      "1. High — anything with an external deadline or that blocks a colleague. Do it in your first focus block.",
      "2. Medium — important work you control the timing on. Slot it after lunch.",
      "3. Low — batch admin into one 30-minute window at the end of the day.",
      "",
      "Drop your task list into the Task Planner and I'll lay it against your working hours.",
    ].join("\n");
  }

  if (/agenda|notes|meeting|summar/.test(m)) {
    return [
      "A workable agenda structure:",
      "1. Decision needed (5 min) — state it up front so the meeting has a purpose.",
      "2. Context and options (15 min).",
      "3. Decision, owner, date (5 min) — nothing leaves the room unassigned.",
      "",
      "Paste the raw notes into Meeting Notes Summarizer for action items and decisions.",
    ].join("\n");
  }

  return [
    `Here's how I'd approach "${message.trim().slice(0, 80)}":`,
    "1. Define the outcome in one sentence before writing anything.",
    "2. Pull only the facts you can verify — mark the rest as open questions.",
    "3. Draft fast, then cut 20%.",
    "",
    "This is a simulated response — review it before acting on it.",
  ].join("\n");
}
