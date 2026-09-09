# AI Workplace Companion

Build a modern, responsive web application called AI Workplace Productivity Assistant (AI-Productivity-Assistant) that helps professionals automate workplace tasks using AI. The application must feature a high-end, clean, modern, and professional SaaS dashboard aesthetic using React, Tailwind CSS, Lucide React icons, and Shadcn UI components.




Ensure the prompt structures and UI components specifically hit all evaluation rubrics: Problem Relevance, Prompt Engineering Quality, Functionality, Innovation, Responsible AI Practices, and Presentation Quality.




1. Dashboard Architecture & Navigation

Layout Structure:




Sidebar navigation with a collapsible toggle for mobile and desktop views.

Header with project branding, search bar, and active tool title.

Footer/Banner with a prominent Responsible AI Disclaimer: "Disclaimer: AI-generated outputs are produced using automated algorithms. Please review, edit, and verify all content before sending or implementing."

Sidebar Menu Navigation:




Dashboard Overview

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner / Scheduler

AI Research Assistant

AI Chatbot Interface

2. Detailed Core Feature Implementation

A. Smart Email Generator (Problem Relevance & Functionality)

Input UI:




Context / Bullet points text area.

Tone selection dropdown (Formal, Friendly, Persuasive).

Recipient / Subject input fields.

Custom prompt settings toggle (e.g., length, call-to-action type).

Output UI:




Editable text area with AI-generated email subject and body.

One-click "Copy to Clipboard" and "Regenerate" buttons.

B. Meeting Notes Summarizer (Functionality & Innovation)

Input UI: Text area to paste raw meeting notes or transcripts.

Output UI: Structured tabbed view or categorized card layout containing:




Executive Summary

Extracted Action Items (with checkbox lists and assigned dates)

Key Decisions Made

Deadlines & Milestones

C. AI Task Planner / Scheduler (Prompt Engineering & Innovation)

Input UI:




Unstructured task list input.

Timeframe selector (Daily Schedule vs. Weekly Plan).

Working hours range picker.

Output UI:




Prioritized task schedule with explicit priority indicators (High, Medium, Low based on urgency/impact logic).

Drag-to-edit or editable schedule cards with time blocks.

D. AI Research Assistant (Presentation Quality & Relevance)

Input UI: Article text, URL reference, or research topic query field.

Output UI:




Bulleted key takeaways.

AI-generated insights and recommendations card.

Editable summary text container.

E. AI Chatbot Interface (Functionality & Presentation)

Chat UI:




Interactive chat stream supporting prompt history.

Pre-built prompt starters (e.g., "Review this draft for clarity", "Suggest 3 icebreakers for a client kickoff").

Editable chat message responses and clear response action buttons.

3. Prompt Engineering Quality & Simulated AI Logic

Build structured client-side prompt templates for each tool with specific role definitions, task boundaries, context formatting, and explicit output constraints.

Integrate simulated/mock AI response generators using structured mock data so every tool works out-of-the-box in the preview UI.

4. Repository Documentation File (README.md)

Include a generated README.md file within the code repository containing:




Project Name: AI-Productivity-Assistant

Project Overview: Brief description addressing how the tool solves modern workplace inefficiency through AI-driven task automation.

Features: Detailed breakdown of the 5 key tools and dashboard layout.

Tools & Technologies Used: Frameworks, styling libraries, and UI components used.

Setup Instructions: Step-by-step terminal commands for local installation and execution.

Team Members:




Siyambonga Fulani

Onele Kalipa

Thuliswa Ntame

Sisipho Majwede

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fc093071-39a5-45ed-ab17-c9868908b33e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
