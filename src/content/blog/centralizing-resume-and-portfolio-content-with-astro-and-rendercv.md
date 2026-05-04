---
title: "Centralizing Resume and Portfolio Edits: One Source of Truth for Your Website and CV"
description: "How I wired Astro content collections to rendercv so a single edit updates both my personal website and my PDF resume automatically."
pubDate: 2026-05-04
tags:
  - automation
  - tooling
  - productivity
published: false
---

<!-- DRAFT — bullet points to expand into full article -->

## The problem

- The personal website already had structured content collections for experience, projects, and education — each stored as a Markdown file with typed frontmatter (role, company, location, start/end dates, stack, highlights as bullet points in the body).
- The PDF resume was a completely separate artifact: a hand-edited `cv.yaml` file consumed by [rendercv](https://github.com/rendercv/rendercv), a Python tool that compiles YAML into a typeset PDF.
- Whenever a job entry or project was updated on the website, the same change had to be repeated manually in the YAML. Two files, two sources of truth, inevitable drift.

## The goal

- Make `src/content/` the single source of truth.
- A single command regenerates `public/cv.yaml` from the live content collections and re-renders `public/resume.pdf`.
- No manual editing of YAML — ever.

## Step 1: Add skills and personal details to `src/consts.ts`

- `AUTHOR` and `SITE_URL` were already exported from `src/consts.ts` and used across the site.
- Added a `SKILLS` constant alongside them so skills live in one place and are available to both the website UI and the CV generator:

```ts
// src/consts.ts
export const SKILLS = [
  { label: 'Languages', details: 'Python, PHP, Java, SQL, TypeScript, JavaScript, C++' },
  { label: 'Frameworks and Libraries', details: 'NestJS, Django, FastAPI, Laravel' },
  { label: 'Backend and Infrastructure', details: 'AWS, GCP, Kubernetes, Docker, MySQL, PostgreSQL, GitHub Actions' },
] as const;
```

## Step 2: Write `scripts/generate-cv.ts`

- A Node.js script that reads the three content collections (`experience`, `projects`, `education`) and emits `public/cv.yaml` in the exact schema rendercv expects.
- Runs as plain TypeScript using Node's built-in `--experimental-strip-types` flag (no transpiler needed; the project already requires Node ≥ 22.12).
- Imports `AUTHOR`, `SITE_URL`, and `SKILLS` directly from `src/consts.ts` — no hardcoded strings.

**Frontmatter parsing** — reads raw Markdown files and splits on the `---` fences:
```ts
function parseFrontmatter(src: string) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('No frontmatter block found');
  return { data: yaml.load(m[1]) as Record<string, any>, body: m[2].trim() };
}
```

**Date formatting** — rendercv uses `YYYY-MM` strings, not full ISO dates. Handles both `Date` objects and `"YYYY-MM-DD"` strings safely:
```ts
function ym(date: Date | string | undefined) {
  if (!date) return undefined;
  const s = date instanceof Date ? date.toISOString() : String(date);
  return s.slice(0, 7);
}
```

**Bullet point extraction** — the markdown body of each content file is a list of highlights. Parsed with a simple filter:
```ts
function bullets(body: string) {
  return body.split('\n').filter(l => /^- /.test(l)).map(l => l.replace(/^- /, ''));
}
```

**Education degree split** — rendercv separates `degree` (`Master's`) from `area` (`Computer Science`). The content stores them combined (`"Master's in Computer Science"`), so they are split on ` in `:
```ts
const m = String(data.degree).match(/^(.+?)\s+in\s+(.+)$/i);
return {
  degree: m ? m[1] : data.degree,
  area:   m ? m[2] : data.degree,
};
```

**GitHub username extraction** — derived from the full URL already stored in `AUTHOR.github`:
```ts
const githubUsername = AUTHOR.github.split('/').pop();
```

**`package.json` script** — runs the TypeScript file directly with no build step:
```json
"generate:cv": "node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/generate-cv.ts"
```

## Step 3: Write `scripts/render-resume.sh`

- A bash script that automates the full pipeline end-to-end: Python venv, rendercv install, YAML generation, PDF rendering.
- Uses a sentinel file (`.venv/.rendercv_full_installed`) to skip installation on subsequent runs — checking `pip show rendercv` alone is not sufficient because the base package can be present without the `[full]` extras (`typst`, `typer`, `rendercv-fonts`, etc.) that are required to render.

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="$ROOT/.venv"

if [ ! -d "$VENV" ]; then
  python3 -m venv "$VENV"
fi

source "$VENV/bin/activate"

SENTINEL="$VENV/.rendercv_full_installed"
if [ ! -f "$SENTINEL" ]; then
  pip3 install "rendercv[full]"
  touch "$SENTINEL"
fi

pnpm --prefix "$ROOT" generate:cv

rendercv render public/cv.yaml --pdf-path "$ROOT/public/resume.pdf"
```

- `--pdf-path` must be an **absolute** path. rendercv resolves it relative to the input file's directory (`public/`), not the working directory, so passing `public/resume.pdf` would create `public/public/resume.pdf`.
- `rendercv[full]` is required (not `rendercv`). The base package installs but silently fails at render time with a message asking you to reinstall with `[full]`.

**`package.json` script:**
```json
"render:resume": "bash scripts/render-resume.sh"
```

## What the full pipeline looks like

```
pnpm render:resume
│
├── .venv exists? → skip creation
├── .venv/.rendercv_full_installed exists? → skip pip install
├── node --experimental-strip-types scripts/generate-cv.ts
│     reads src/content/experience/*.md
│     reads src/content/projects/*.md
│     reads src/content/education/*.md
│     reads src/consts.ts  (AUTHOR, SITE_URL, SKILLS)
│     └── writes public/cv.yaml
└── rendercv render public/cv.yaml --pdf-path /abs/path/public/resume.pdf
      └── writes public/resume.pdf
```

## `.gitignore` additions

```
.venv/
rendercv_output/
*_rendercv_output/
```

rendercv also emits `.typ`, `.html`, `.md`, and `.png` preview files into a `rendercv_output/` folder alongside the PDF. These are build artifacts and should not be committed.

## Dependencies added

- `js-yaml` — YAML parsing and serialization in the generator script (frontmatter in, CV YAML out)
- `@types/js-yaml` — TypeScript types for js-yaml

Both are `devDependencies` since they are only used by the build script, not the Astro site itself.
