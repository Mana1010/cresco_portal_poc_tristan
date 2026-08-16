# Cresco Portal Core POC

A Frappe Framework build-out of the Cresco Portal Core POC, proving that the
design in `Cresco_Platform_POC_V3_1_11.html` (a standalone React/JSX
prototype) can be developed on Frappe + Vue 3 + Tailwind CSS.

**Version 0.1.0** — see [`requirements/Version 0.1.0 - Cresco Portal Core POC Design.md`](requirements/Version%200.1.0%20-%20Cresco%20Portal%20Core%20POC%20Design.md)
for the original spec, and [`requirements/planning/`](requirements/planning/)
for the implementation plan and the full Q&A that resolved every ambiguity
in that spec before/while building.

## Scope

**Built in v0.1.0:**
- Doctypes: **Client**, **Staff**, **Project** (+ child tables **Project
  Deliverable**, **Project Document Register**, **Project Transmittal**),
  **Risk Register**.
- Portal pages (Vue 3 + Tailwind CSS): **Projects** list, **Project Detail**
  (Overview + Documents tabs), **Risk Register**.
- A one-time import that reproduces the POC's own seed data and generation
  logic (deliverables, document register, transmittals) from
  `requirements/Cresco_Platform_POC_V3_1_11.html` itself, rather than
  re-typing it by hand.

**Deliberately out of scope this version** (present in the POC but not
requested for v0.1.0 — rendered as disabled/placeholder nav links instead):
Dashboard, KPI Analytics, the AI Layer, Inspections, Programme/Org Chart,
Operations tooling, Client-facing portal, and the Project Detail Labs / QA
Chain / Transmittals / Variations tabs. Full rationale for every scope call
is in [`requirements/planning/v0.1.0-open-questions.md`](requirements/planning/v0.1.0-open-questions.md).

## Repo layout

```
cresco_portal_poc/
├── cresco_portal_poc/
│   ├── cresco_portal_poc/doctype/   # Client, Staff, Project (+children), Risk Register
│   ├── data_import/                 # extract_poc_data.js + run_import.py (see below)
│   ├── portal/utils.py              # shared auth/context helpers for the portal pages
│   ├── public/{css,js}/             # compiled Tailwind CSS, portal_tokens.js, Vue mount scripts
│   ├── templates/includes/          # shared sidebar/topbar Jinja partials
│   └── www/                         # the 3 portal pages (projects/, risk_register.py/.html)
├── requirements/                    # original POC design doc, screenshots, POC HTML, planning docs
├── tailwind.config.js
└── package.json                     # only used for `npm run build:css`
```

## Local setup

This app was built inside an existing bench (`~/frappe-bench-16`, Frappe
v16) on WSL2 Ubuntu. `bench` isn't on the default PATH there — it's a pipx
install, and Node comes from `nvm` rather than the Windows Node on
`/mnt/c/...`. Every command below assumes:

```bash
source ~/.nvm/nvm.sh && nvm use 24
export PATH=$HOME/.local/bin:$PATH
cd ~/frappe-bench-16
```

### Get the app + create a site

```bash
bench get-app https://github.com/Mana1010/cresco_portal_poc_tristan --branch main
bench new-site cresco-portal-poc.local --mariadb-root-password <your-root-pw>
bench --site cresco-portal-poc.local install-app cresco_portal_poc
bench --site cresco-portal-poc.local migrate
```

### Rebuild the Tailwind CSS (only needed if you edit `.src.css` or add new
Tailwind classes to a template)

```bash
cd apps/cresco_portal_poc
npm install
npm run build:css
cd ../..
bench build --app cresco_portal_poc
```

### Import the POC's seed data

Re-extracts everything straight from the POC HTML (idempotent — safe to
re-run, existing records are skipped):

```bash
node apps/cresco_portal_poc/cresco_portal_poc/data_import/extract_poc_data.js \
  > apps/cresco_portal_poc/cresco_portal_poc/data_import/import_data.json
bench --site cresco-portal-poc.local execute cresco_portal_poc.data_import.run_import.execute
```

This creates 25 Clients, 33 Staff (with a Reports To hierarchy and a
computed Lens field), 50 Projects (with Deliverables/Document
Register/Transmittals generated per-project), and 12 Risk Register rows.

### Run it

```bash
bench start
```

If this bench's `default_site` isn't already `cresco-portal-poc.local`, either
run `bench use cresco-portal-poc.local` first, or add a hosts entry so you
can reach it by name instead of switching the shared default.

Go to `http://localhost:8000/projects`.

**Login:**
- Any staff account, e.g. `glenn.frewin@cresco-poc.demo` / `cresco-poc-2026`
  (same password for all 33 seeded staff — pattern is
  `firstname.lastname@cresco-poc.demo`). These are **Website Users with no
  desk access** — by design, they can only reach the 3 portal pages, not
  `/app` or `/desk`.
- `Administrator` / `admin` for full desk access (to browse/edit doctype
  records directly, inspect data, etc.).

## Notes for anyone continuing this

- **Tier** on Project is computed (not stored input) — see
  `cresco_portal_poc/cresco_portal_poc/doctype/project/project.py`. It
  reproduces the POC's own `gTier`/`gFee` logic exactly (Tier Factor ×
  Volume Factor, and Fee, each mapped to a tier, final Tier = the more
  severe of the two). Verified against the POC's own rendered values for
  all 50 imported projects.
- **Lens** on Staff is computed (read-only) — walks `Reports To` up to the
  nearest manager who owns one of the POC's "Four Lenses" (Business
  Manager → Cost, Operations Manager → Time, Engineering Manager →
  Quality, G&I Manager → Scale), or `None` at the top of the tree. See
  `cresco_portal_poc/cresco_portal_poc/doctype/staff/staff.py`.
- **Payment** on Project is a random placeholder (per the open-questions
  Q7 decision) — the POC's own data has no real field driving this value.
  Intended to become a summary of a future linked Payment doctype.
- Two Frappe gotchas hit and worked around during development, in case
  they bite again:
  - A hyphenated `www/` filename (`risk-register.py`) silently breaks
    Frappe's dotted-module import for `get_context` — Python can't import
    a module with a hyphen in its name. Fixed by naming the file
    `risk_register.py` and adding a `website_route_rules` entry to keep
    the friendly `/risk-register` URL.
  - Scripts declared via the `web_include_js` hook load *after* a page's
    own `{% block content %}`, so a page's Vue mount script can't rely on
    a globally-hooked Vue bundle being ready yet. Each portal page instead
    includes Vue + the shared token script explicitly, in order, right
    before its own mount script.
  - `role_home_page` is set for the `Cresco Portal User` role so staff
    logins land on `/projects` directly — Frappe otherwise tries `/desk`
    first regardless of desk access, 403s, then falls back to `/me`.

## License

mit
