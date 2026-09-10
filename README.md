# AI-Productivity-Assistant

**AI Workplace Productivity Assistant** — a modern, responsive web application that helps professionals automate repetitive workplace tasks with AI-assisted drafting, summarizing, planning and research.

## Project Overview

Knowledge workers lose hours every week to the same handful of chores: writing routine emails, turning messy meeting notes into action items, re-ordering a task list into a realistic day, and skimming articles for the two facts that matter. AI-Productivity-Assistant collapses those chores into five focused tools inside one dashboard.

Every tool follows the same principle: the AI produces a first draft, and the human stays accountable for what ships. Outputs are always editable, missing information appears as explicit `[placeholders]` rather than invented detail, the underlying prompt is visible for every tool, and a Responsible AI disclaimer is present on every screen.

## Features

### Dashboard layout
- Collapsible sidebar navigation (drawer on mobile, collapse toggle on desktop).
- Header with project branding, global search and the active tool title.
- Persistent Responsible AI disclaimer footer: *"AI-generated outputs are produced using automated algorithms. Please review, edit, and verify all content before sending or implementing."*

### 1. Smart Email Generator
Context/bullet-point input, tone selection (Formal, Friendly, Persuasive), recipient and subject fields, and a custom prompt settings toggle for length and call-to-action type. Output is an editable subject line and body with one-click **Copy to Clipboard** and **Regenerate**.

### 2. Meeting Notes Summarizer
Paste a raw transcript or shorthand notes. Results appear in a tabbed view: Executive Summary, Action Items (checkbox list with owners and due dates), Key Decisions, and Deadlines & Milestones.

### 3. AI Task Planner / Scheduler
Unstructured task list input, Daily Schedule vs Weekly Plan selector, and a working-hours range picker. Output is a prioritised schedule with explicit High / Medium / Low indicators derived from urgency-and-impact logic, rendered as editable time-block cards with a stated rationale per item.

### 4. AI Research Assistant
Accepts article text, a URL reference or a research question. Produces bulleted key takeaways, an insights-and-recommendation card with a confidence rating, an explicit "verify before you use this" checklist, and an editable summary container.

### 5. AI Chatbot Interface
Interactive chat stream with prompt history, pre-built prompt starters ("Review this draft for clarity", "Suggest 3 icebreakers for a client kickoff"), editable assistant responses, and copy / regenerate / clear actions per message.

### Prompt engineering
Each tool builds a structured prompt template with an explicit **Role**, **Task**, **Context** (user input, clearly delimited), **Constraints** (shared responsible-AI guardrails plus tool-specific boundaries) and an **Output format** contract. Templates live in `src/lib/prompts.ts` and are inspectable in the UI via the "View prompt" panel on every tool.

### Simulated AI logic
`src/lib/mock-ai.ts` contains deterministic, input-aware response generators so every tool works out of the box in the preview with no API key or network call. Swapping in a real model means replacing these generator functions with a server call that sends the same prompt templates.

## Tools & Technologies Used

| Area | Technology |
| --- | --- |
| Framework | React 19 + TanStack Start / TanStack Router |
| Build tool | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first design tokens in `src/styles.css`) |
| UI components | shadcn/ui (Radix primitives) |
| Icons | Lucide React |
| Notifications | Sonner |
| Data layer | TanStack Query |

## Setup Instructions

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd AI-Productivity-Assistant

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open the app
#    http://localhost:8080

# 5. Create a production build
npm run build

# 6. Preview the production build locally
npm run preview
```

## Project Structure

```
src/
  components/
    AppShell.tsx        # sidebar, header, disclaimer footer
    PromptInspector.tsx # "View prompt" panel
    ToolIntro.tsx       # shared panel / field primitives
    ui/                 # shadcn/ui components
  lib/
    prompts.ts          # structured prompt templates
    mock-ai.ts          # simulated AI response generators
  routes/
    index.tsx           # Dashboard Overview
    email.tsx           # Smart Email Generator
    meetings.tsx        # Meeting Notes Summarizer
    planner.tsx         # AI Task Planner / Scheduler
    research.tsx        # AI Research Assistant
    chat.tsx            # AI Chatbot Interface
  styles.css            # design tokens and theme
```

## Responsible AI Practices

- A disclaimer is visible on every screen, not buried in settings.
- All AI output is editable before it can be copied or acted on.
- Prompts instruct the model never to invent names, figures or dates; gaps are marked `[placeholder]`.
- The research tool separates source claims from model inference and lists what must be verified.
- The chatbot declines impersonation and misleading-content requests by prompt design.
- The full prompt behind each output is visible to the user.

## Team Members

- Siyambonga Fulani
- Onele Kalipa
- Thuliswa Ntame
- Sisipho Majwede
