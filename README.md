# CV Maker — Lebenslauf builder for the German job market

A privacy-first, browser-based CV / Lebenslauf builder tuned for **German hiring conventions**: DIN 5008 A4 layout, photo support, date-of-birth field, DE/EN bilingual UI, and ten carefully typeset templates. Everything runs locally in your browser — your data never leaves the device unless you explicitly export it.

> **License:** [PolyForm Noncommercial 1.0.0](LICENSE) — source-available, free for personal, educational, and nonprofit use. **Commercial use is not permitted.** See [License & Commercial use](#license--commercial-use).

---

## Table of contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Quality gates](#quality-gates)
- [Contact](#contact)
- [Support the project (endorsement)](#support-the-project-endorsement)
- [Contributing](#contributing)
- [License & Commercial use](#license--commercial-use)

---

## Features

- **10 A4 templates** — single-column, sidebar, and accent variants; German section labels by default (Berufserfahrung, Ausbildung, Kenntnisse…)
- **DIN 5008 / Lebenslauf conventions** — photo block, DOB field, German date formatting, Ortsvorwahl-aware phone validation
- **Live preview** — WYSIWYG A4 canvas with resizable split pane
- **Export anywhere**
  - **PDF** (pixel-perfect, DOM-captured via `html-to-image` + `jsPDF`)
  - **ATS PDF** (text-based single-column PDF optimised for applicant-tracking scanners)
  - **DOCX** (rebuilt via the `docx` library — fully editable in Word)
  - **JSON** (portable schema for backup / re-import)
- **Undo / redo** — 20-state history (via `zundo`)
- **Version snapshots** — save named CV versions, import/export as JSON
- **Appearance customization** — accent color with WCAG-enforced contrast, font pairing, photo shape, section order
- **Bilingual UI** — full DE/EN translations with compile-time parity enforcement
- **Dark / light mode** — system-aware via `next-themes`
- **Offline-capable** — all state persists to `localStorage`; no account, no backend required
- **Accessible** — WCAG 2.2 AA: 4.5:1 contrast, 44×44 touch targets, keyboard-navigable resize handle, error boundaries around every template

## Screenshots

> _Add screenshots of the editor, live preview, and a finished PDF to `docs/` and link them here._

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript (strict) |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| State | Zustand + Zundo (undo/redo) + persist middleware |
| Validation | Zod 4 |
| Drag & drop | `@dnd-kit` |
| PDF | `jsPDF` + `html-to-image` + `pdf-lib` |
| DOCX | `docx` |
| Routing | React Router 7 |
| Tests | Vitest + happy-dom |
| Hosting | Firebase Hosting |

## Quick start

```bash
# 1. Clone
git clone https://github.com/ibhf13/cv_maker.git
cd cv_maker

# 2. Install
npm install

# 3. (Optional) Configure env — see below
cp .env.example .env

# 4. Run the dev server
npm run dev
```

Open <http://localhost:5173> and start filling in your Lebenslauf. Data auto-saves to `localStorage` every keystroke.

## Environment variables

All vars are optional — the app runs fully offline without any of them. Copy [`.env.example`](.env.example) to `.env` and fill in the ones you need.

| Variable | Purpose |
|---|---|
| `VITE_GITHUB_REPO_URL` | Enables the ★ GitHub button in the endorsement dialog and contact section. Example: `https://github.com/ibhf13/cv_maker` |
| `VITE_SUPPORT_URL` | Enables the ☕ Buy-me-a-coffee button. Any donation URL (Ko-fi, BuyMeACoffee, GitHub Sponsors, PayPal.me…) |
| `VITE_CONTACT_FORM_ENDPOINT` | Optional [FormSubmit](https://formsubmit.co) (or compatible) endpoint for the in-app contact form. If unset, the form falls back to a `mailto:` link. |
| `VITE_FIREBASE_*` | Firebase keys (analytics / hosting only — no CV data is ever uploaded). Leave blank for local development. |

## Project structure

```
src/
├── features/
│   ├── editor/        # CV form editor (tabs: personal, summary, experience, …)
│   ├── preview/       # Live A4 preview + resize handle
│   ├── templates/     # 10 CV templates + shared section renderers
│   ├── toolbar/       # Undo/redo, download menu, reset dialog
│   ├── export/        # PDF, ATS PDF, DOCX, JSON pipelines (lazy-loaded)
│   ├── versions/      # Named snapshots, JSON import/export
│   ├── endorsement/   # ★ + ☕ dialog
│   └── landing/       # Marketing landing page + contact form
├── components/        # Shared UI (shadcn primitives, error boundary, …)
├── hooks/             # use-cv-selectors, use-cv-field, use-cv-period, …
├── lib/               # Pure utils: Zod schema, i18n, completeness score, …
├── stores/            # Zustand store (cvData + ui state + undo/redo)
└── pages/             # Route-level pages
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run type-check` | `tsc --noEmit` |
| `npm run test` | Run all Vitest suites |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run deploy` | Build + deploy to Firebase Hosting |

## Quality gates

Before sending a PR, please make sure all four pass:

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

## Contact

Have a question, a bug report, or a feature idea? Here are all the ways to reach out:

- 📧 **Email** — [ibrahim.klusmann@gmail.com](mailto:iebo.testt@gmail.com?subject=CV%20Maker) — fastest for private questions
- 📧 **Email** — [ibrahim.klusmann@gmail.com](mailto:@gmail.com?subject=CV%20Maker) — fastest for private questions
- 💬 **In-app contact form** — click **Contact** on the [landing page](./src/features/landing/contact-section.tsx); delivered via FormSubmit (or `mailto:` fallback)
- 🐛 **Bug / feature** — [open an issue](https://github.com/ibhf13/cv_maker/issues/new)
- 💡 **Discussion** — [GitHub Discussions](https://github.com/ibhf13/cv_maker/discussions)
- 🇩🇪 **Deutsch willkommen** — Fragen auf Deutsch sind ausdrücklich willkommen.

## Support the project (endorsement)

This project is free and built in my spare time. If it saved you an afternoon of wrestling with Word templates, a small gesture goes a long way:

- ⭐ **Star the repo** — [github.com/ibhf13/cv_maker](https://github.com/ibhf13/cv_maker) — the cheapest way to say thanks and helps others discover it
- ☕ **Buy me a coffee** — set `VITE_SUPPORT_URL` (Ko-fi / BuyMeACoffee / GitHub Sponsors) or ask for the link via the contact form
- 🗣️ **Share it** — post it to a friend, a Slack, a job-seeker subreddit
- 🐛 **Report a bug** — a clear issue is worth more than a coffee
- 🌍 **Translate** — help extend beyond DE / EN by adding a new label map in [`src/lib/editor-labels.*.ts`](src/lib/editor-labels.de.ts)

The ★ / ☕ buttons are wired up directly inside the app — look for the Endorsement dialog in the toolbar and the Contact section on the landing page.

## Contributing

PRs are welcome! Please:

1. Open an issue first for non-trivial changes so we can agree on scope.
2. Add a test for new logic (`lib/` → unit test, store → mutation test, template → smoke test, export → integration test).
3. Make sure all [quality gates](#quality-gates) pass.
4. Keep commits focused; write the _why_, not the _what_.

By submitting a contribution you agree that it will be released under the project's license ([PolyForm Noncommercial 1.0.0](LICENSE)).

## License & Commercial use

This project is released under the **[PolyForm Noncommercial License 1.0.0](LICENSE)** — a source-available, OSI-adjacent license designed specifically for software. The full text lives in [LICENSE](LICENSE). In plain English:

### ✅ Permitted — free, forever

- **Personal use** — build your own CV, hack on the code, run it locally
- **Education** — use it in a classroom, bootcamp, or course
- **Research & study** — academic and scientific use
- **Nonprofits & public institutions** — charities, public schools, public research orgs, government bodies, public health / safety / environment organisations
- **Modification & redistribution** — fork it, change it, share it, as long as you keep this license and the copyright notice

### ❌ Not permitted without a separate commercial license

- Hosting it as a paid or ad-supported SaaS
- Bundling it into a commercial product
- Offering it as a service to paying clients
- Any use "primarily intended for or directed towards commercial advantage or monetary compensation"

### 💼 Want to use it commercially?

Reach out via [iebo.testt@gmail.com](mailto:iebo.testt@gmail.com?subject=CV%20Maker%20commercial%20license) — commercial licenses are available on reasonable terms, including for small businesses and startups.

### Why PolyForm Noncommercial and not MIT / CC BY-NC?

- **MIT** would allow anyone to repackage and sell the work without contributing back.
- **CC BY-NC** is written for creative works, not software — it doesn't cover patents and institutions often refuse it.
- **PolyForm Noncommercial 1.0.0** was drafted by software-licensing lawyers specifically for this case: clear definitions, explicit safe harbours for nonprofits and educational institutions, explicit patent grant, and [SPDX-recognised](https://spdx.org/licenses/PolyForm-Noncommercial-1.0.0.html).

---

**Copyright © 2026 ibhf13.** Made with ☕ in Germany.
