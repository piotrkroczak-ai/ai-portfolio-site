# Local Website Generation Project

Professional website generation project built and tested locally with VS Code and AI-assisted coding.

The goal of this project is to test the creation of a professional website from different types of input documents, including PDF files, images, written instructions, forms, and structured content.

This project is also used to evaluate how well an AI coding model can:
- understand multi-format inputs
- concatenate and structure information
- create coherent website pages and subpages
- generate and improve forms
- respect an existing structure
- respond to adjustment requests
- apply corrections and modifications
- improve the quality, consistency, and professionalism of the final website

## Project Goals

The project is designed as a practical test environment for AI-assisted website creation.

Main objectives:

- Create a professional website running locally
- Use a LinkedIn profile or professional PDF as content source
- Add an About section
- Build a career journey section
- Prepare future portfolio links
- Test subpages and navigation
- Test form creation
- Evaluate design consistency
- Check how well the model handles corrections and iterations
- Create a AI digital twin with AI router key

## Run

From the project folder:

```bash
npm install
npm run dev

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenRouter (AI chatbot integration / Gemma 4 31B (free))
- VS Code / Cursor
- AI coding model: GPT-5.2 Codex High / GPT-5.3

## Project Structure

```bash
.
├── README.md
├── .gitignore
├── .env
├── Profile.pdf
├── picture.png
└── website/
    ├── app/
    │   ├── api/
    │   │   └── chat/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    │
    ├── components/
    │   └── VirtualMeChat.tsx
    │
    ├── data/
    │   └── public-profile.json
    │
    ├── lib/
    │   └── chat.ts
    │
    ├── public/
    │
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── eslint.config.mjs
    ├── postcss.config.mjs
    ├── next-env.d.ts
    ├── AGENTS.md
    ├── CLAUDE.md
    └── README.md