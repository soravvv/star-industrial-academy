# Star Industrial Academy — Landing Page

A responsive, single-page React landing page for Star Industrial Academy, built
with Vite and CSS Modules from the supplied desktop (1440px) and mobile (390px)
design references.

- **Live site:** https://star-industrial-academy.vercel.app
- **Stack:** React 18 (functional components + hooks), Vite 5, CSS Modules, Vitest
- **No runtime dependencies** beyond React. No UI kit, no remote fonts, no trackers.

---

## Quick start

Requires Node.js 18+ and Python 3 (only for the local registration API).

```bash
npm install
npm run api      # terminal 1 — local registration API on http://localhost:8765
npm run dev      # terminal 2 — site on http://localhost:5173
```

| Command           | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Development server with hot reload (port 5173, fixed) |
| `npm run api`     | Starts the local registration API (port 8765)         |
| `npm test`        | Runs the unit tests once                              |
| `npm run build`   | Production build into `dist/`                         |
| `npm run preview` | Serves the production build locally                   |

> The dev server is pinned to port **5173** because the local API only accepts
> cross-origin requests from `http://localhost:5173`.

---

## Project structure

```
src/
├── main.jsx                  Entry point: mounts <App/>, loads global CSS
├── App.jsx                   Page outline: skip link, header, sections, footer
├── config.js                 Chooses the registration endpoint (see below)
├── content/
│   └── siteContent.js        ALL page copy, links and program data
├── components/               One folder per component: Name.jsx + Name.module.css
│   ├── Header/               Logo, primary nav, accessible mobile menu
│   ├── Hero/                 <h1>, CTAs, highlights ribbon, hero artwork
│   ├── Section/              Shared wrapper: anchor id, <h2>, tone, layout
│   ├── Benefits/             "Why Star" cards
│   ├── Programs/             Three learning-path cards
│   ├── HowItWorks/           Numbered steps (<ol>)
│   ├── Registration/         Section + RegistrationForm (controlled form)
│   ├── Faq/                  Native <details>/<summary> accordion
│   ├── Footer/               Brand line, links, copyright
│   └── Icon/                 Decorative inline SVG icons
├── hooks/
│   └── useRegistrationForm.js  Form state, validation timing, submit flow
├── lib/                      Plain JavaScript, no React — easy to unit-test
│   ├── validation.js         Field rules (mirror the API's rules)
│   ├── registrationApi.js    fetch wrapper: timeout, error mapping, local mode
│   └── cx.js                 Tiny className joiner
├── styles/
│   ├── tokens.css            Design tokens: colours, type, spacing, radii
│   ├── base.css              Global element defaults + focus ring
│   ├── layout.module.css     Shared .container / .cardGrid / .card
│   └── buttons.module.css    Shared .primary / .text button styles
└── assets/                   Logo (SVG) and hero image (WebP)
local-api/                    Supplied registration API (unchanged) + sample request
docs/                         Acceptance test log and screenshots
```

### How the pieces fit

- **Content is data.** Every heading, paragraph, link and program lives in
  `src/content/siteContent.js`. To change wording, edit that file only.
- **Program names have one source.** `PROGRAM_NAMES` is derived from
  `PROGRAMS`, and feeds both the Programs cards and the form dropdown. The same
  three names are also the API's allow-list, so keep them in sync with
  `local-api/server.py`.
- **Logic is separated from markup.**
  `lib/validation.js` and `lib/registrationApi.js` → pure, tested functions.
  `hooks/useRegistrationForm.js` → React state built on them.
  `RegistrationForm.jsx` → only renders.
- **Styling is token-driven and DRY.** Components reference CSS variables from
  `tokens.css` and `composes:` shared classes from `layout.module.css` and
  `buttons.module.css` instead of repeating declarations.

---

## Responsive breakpoints

Styles are written **mobile-first**: base rules target small phones, and
`min-width` media queries add layout as space grows.

| Name    | Width       | What changes                                                                                         |
| ------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| Mobile  | 0 – 767px   | Compact 64px header with menu button; everything single-column; benefit icon beside its title        |
| Tablet  | ≥ 768px     | 80px header with inline nav; cards in 3 columns; ribbon in one row; wider gutters and section spacing |
| Desktop | ≥ 1024px    | Hero becomes two columns (copy + artwork); registration becomes two columns (intro + form)            |

Content is centred at a max width of **1120px** (per the brand guide). CSS
variables can't be used inside `@media`, so the two widths are repeated as
literals; they are documented at the top of `src/styles/tokens.css`.

Verified at **375px, 768px and 1440px** — see `docs/ACCEPTANCE_TEST_LOG.csv`.

---

## Registration form and API

### Behaviour

- Controlled inputs: full name, email, program (dropdown), consent checkbox.
- Validation runs on submit, then live as the user corrects fields.
- Errors are linked to their fields with `aria-invalid` + `aria-describedby`,
  and focus moves to the first invalid field.
- The submit button is disabled (and reads "Submitting…") while a request is
  in flight; requests time out after 10 seconds.
- On success the confirmation receives focus so screen readers announce it.
- Network failures, 4xx and 5xx each show a clear, non-technical message, and
  the user's input is kept so they can retry.

### API contract

`POST /api/register` with JSON:

```json
{ "fullName": "Taylor Example", "email": "taylor@example.test", "program": "Quality Fundamentals", "consent": true }
```

| Status | Meaning                                          |
| ------ | ------------------------------------------------ |
| 201    | Accepted — body includes `requestId`             |
| 400    | Malformed JSON                                   |
| 422    | Invalid fields (name, email, program or consent) |

`GET /health` → `{"status": "ok"}`. The supplied server binds to
`127.0.0.1:8765`, allows CORS only from `http://localhost:5173`, and stores
nothing.

### Which endpoint is used (`src/config.js`)

| Situation                                  | Endpoint                               |
| ------------------------------------------ | -------------------------------------- |
| `VITE_REGISTRATION_API_URL` is set         | That URL                               |
| `npm run dev`, variable not set            | `http://localhost:8765/api/register`   |
| Production build, variable not set         | **None — local confirmation mode**     |

See `.env.example`. No secrets are used or required.

### Hosted (Vercel/Netlify) limitations — please read

The supplied API is a **localhost-only test receiver**; no production endpoint
was provided. A deployed site can't (and must not) call `localhost`, so the
hosted build runs in **local confirmation mode**:

- the form still validates everything in the browser;
- a visible notice says details are not sent anywhere;
- on submit, **no network request is made** and the confirmation says plainly
  that nothing was sent or stored.

To connect a real backend later, set `VITE_REGISTRATION_API_URL` to an approved
HTTPS endpoint in the hosting provider's environment settings and redeploy.
That server must accept CORS from the site's domain.

---

## Assets

| File                         | Use                       | Notes                                              |
| ---------------------------- | ------------------------- | -------------------------------------------------- |
| `src/assets/star_logo.svg`   | Header logo               | Vector, 564 bytes; Vite inlines it into the bundle |
| `src/assets/industrial_hero.webp` | Hero artwork         | 900×680 WebP, 10.8 KB; fingerprinted by Vite       |
| `public/favicon.svg`         | Browser tab icon          | The logo mark cropped from `star_logo.svg`         |

All are the client's original assets (`ASSET_USAGE.txt`): no third-party marks.
Images carry explicit `width`/`height` to prevent layout shift.

---

## Accessibility

- Semantic landmarks: `header`, `nav` (×2, labelled), `main`, `section`
  (each labelled by its heading), `article`, `footer`; one `h1`, then `h2`/`h3`.
- "Skip to main content" link as the first tab stop.
- Mobile menu: real `<button>` with `aria-expanded` / `aria-controls`; closes on
  link selection, on Escape (returning focus to the button), and when resized
  to desktop.
- FAQ uses native `<details>`/`<summary>`: keyboard and screen-reader support
  without custom JavaScript.
- Visible focus ring everywhere (switches to sunrise on the dark section).
- Respects `prefers-reduced-motion`.

---

## Deployment (Vercel)

1. Push this repository to GitHub.
2. In Vercel: **Add New → Project → Import** the repository.
3. Framework preset: **Vite** (build `npm run build`, output `dist`) — detected automatically.
4. Leave `VITE_REGISTRATION_API_URL` unset (see limitations above) and deploy.

Netlify works the same way: build command `npm run build`, publish directory `dist`.
