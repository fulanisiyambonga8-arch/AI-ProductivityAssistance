/**
 * Structured client-side prompt templates.
 *
 * Every template follows the same engineering pattern:
 *   ROLE        — who the model is acting as
 *   TASK        — the single job to perform
 *   CONTEXT     — user-supplied, clearly delimited
 *   CONSTRAINTS — explicit boundaries and refusals
 *   OUTPUT      — exact output contract
 *
 * These are rendered in the UI ("View prompt") so users can see and audit
 * exactly what would be sent to a model.
 */

export type PromptSection = { label: string; body: string };

export type PromptTemplate = {
  id: string;
  title: string;
  sections: PromptSection[];
};

const SHARED_GUARDRAILS = [
  "Never invent names, figures, dates or commitments that are not present in the supplied context.",
  "If required information is missing, insert a clearly marked [placeholder] instead of guessing.",
  "Do not include personal data beyond what the user supplied.",
  "Flag anything the human must verify before acting.",
].join("\n- ");

export function buildEmailPrompt(input: {
  recipient: string;
  subject: string;
  tone: string;
  length: string;
  cta: string;
  context: string;
}): PromptTemplate {
  return {
    id: "email",
    title: "Smart Email Generator prompt",
    sections: [
      {
        label: "Role",
        body: "You are a senior workplace communications specialist writing on behalf of a professional. You write in the sender's voice, never as an AI assistant.",
      },
      {
        label: "Task",
        body: `Draft one complete email (subject line + body) to ${input.recipient || "[recipient]"} about "${input.subject || "[subject]"}".`,
      },
      {
        label: "Context (verbatim from user)",
        body: input.context.trim() || "[no context supplied]",
      },
      {
        label: "Style contract",
        body: `Tone: ${input.tone}. Length: ${input.length}. Closing call-to-action: ${input.cta}.`,
      },
      { label: "Constraints", body: `- ${SHARED_GUARDRAILS}` },
      {
        label: "Output format",
        body: "Subject: <one line, max 70 characters>\n\n<greeting>\n<body paragraphs>\n<call to action>\n<sign-off>",
      },
    ],
  };
}

export function buildMeetingPrompt(notes: string): PromptTemplate {
  return {
    id: "meeting",
    title: "Meeting Notes Summarizer prompt",
    sections: [
      {
        label: "Role",
        body: "You are a meeting analyst who converts raw transcripts and shorthand notes into an auditable record.",
      },
      {
        label: "Task",
        body: "Extract an executive summary, action items with owners and due dates, key decisions, and deadlines/milestones.",
      },
      { label: "Context (raw notes)", body: notes.trim() || "[no notes supplied]" },
      {
        label: "Constraints",
        body: `- ${SHARED_GUARDRAILS}\n- Attribute every action item to a named owner found in the notes, or "Unassigned".\n- Preserve original wording for decisions; do not soften or reinterpret them.`,
      },
      {
        label: "Output format",
        body: 'JSON: { "summary": string, "actionItems": [{ "task", "owner", "due" }], "decisions": string[], "deadlines": [{ "label", "date" }] }',
      },
    ],
  };
}

export function buildPlannerPrompt(input: {
  tasks: string;
  timeframe: string;
  start: string;
  end: string;
}): PromptTemplate {
  return {
    id: "planner",
    title: "AI Task Planner prompt",
    sections: [
      {
        label: "Role",
        body: "You are an executive scheduling strategist applying an urgency × impact prioritisation model.",
      },
      {
        label: "Task",
        body: `Turn an unstructured task list into a ${input.timeframe.toLowerCase()} inside working hours ${input.start}–${input.end}.`,
      },
      { label: "Context (task list)", body: input.tasks.trim() || "[no tasks supplied]" },
      {
        label: "Prioritisation logic",
        body: "HIGH = deadline-bound or blocking others. MEDIUM = important but movable. LOW = maintenance or batchable. Place HIGH items in the first focus block of the day.",
      },
      {
        label: "Constraints",
        body: `- ${SHARED_GUARDRAILS}\n- Never schedule outside the stated working hours.\n- Leave at least one recovery gap per half-day.`,
      },
      {
        label: "Output format",
        body: 'JSON array of { "time", "duration", "task", "priority": "High"|"Medium"|"Low", "rationale" }',
      },
    ],
  };
}

export function buildResearchPrompt(input: { topic: string; source: string }): PromptTemplate {
  return {
    id: "research",
    title: "AI Research Assistant prompt",
    sections: [
      {
        label: "Role",
        body: "You are a research analyst producing decision-ready briefs for busy professionals.",
      },
      {
        label: "Task",
        body: `Summarise and interpret material on "${input.topic || "[topic]"}".`,
      },
      { label: "Context (article / URL / query)", body: input.source.trim() || "[no source supplied]" },
      {
        label: "Constraints",
        body: `- ${SHARED_GUARDRAILS}\n- Separate what the source states from your own inference; label inferences explicitly.\n- State clearly when a claim could not be verified from the supplied material.`,
      },
      {
        label: "Output format",
        body: 'JSON: { "takeaways": string[], "insights": string[], "recommendation": string, "confidence": "Low"|"Medium"|"High", "verify": string[] }',
      },
    ],
  };
}

export function buildChatPrompt(message: string): PromptTemplate {
  return {
    id: "chat",
    title: "AI Chatbot prompt",
    sections: [
      {
        label: "Role",
        body: "You are a workplace productivity co-pilot. You are concise, practical and never pretend to have access to systems you do not have.",
      },
      { label: "Task", body: "Answer the user's workplace request with an actionable response." },
      { label: "Context (message)", body: message.trim() || "[empty message]" },
      {
        label: "Constraints",
        body: `- ${SHARED_GUARDRAILS}\n- Decline requests to impersonate a real person or to produce misleading content.\n- Prefer a short answer plus optional next steps over long prose.`,
      },
      {
        label: "Output format",
        body: "A short direct answer, then up to three numbered next steps when useful.",
      },
    ],
  };
}

export function renderPrompt(template: PromptTemplate): string {
  return template.sections
    .map((s) => `## ${s.label}\n${s.body}`)
    .join("\n\n");
}
