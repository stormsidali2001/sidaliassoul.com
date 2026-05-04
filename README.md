# sidaliassoul.com

Personal website and blog built with [Astro](https://astro.build).

## Project structure

```text
├── public/              Static assets served as-is (images, fonts, cv.yaml, resume.pdf)
├── scripts/
│   └── generate-cv.mjs  Reads content collections and writes public/cv.yaml
├── src/
│   ├── components/
│   ├── content/
│   │   ├── blog/        Markdown blog posts
│   │   ├── education/   Education entries (one .md per degree)
│   │   ├── experience/  Work experience entries (one .md per role)
│   │   └── projects/    Project entries (one .md per project)
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Commands

| Command               | Action                                           |
| :-------------------- | :----------------------------------------------- |
| `pnpm install`        | Install dependencies                             |
| `pnpm dev`            | Start local dev server at `localhost:4321`       |
| `pnpm build`          | Build production site to `./dist/`               |
| `pnpm preview`        | Preview the production build locally             |
| `pnpm generate:cv`    | Regenerate `public/cv.yaml` from content collections |
| `pnpm render:resume`  | Generate `cv.yaml` and render `public/resume.pdf`    |

## Generating and rendering the resume

The resume PDF is generated from the content collections using [rendercv](https://github.com/rendercv/rendercv).

```sh
pnpm render:resume
```

This single command:
1. Creates a `.venv` Python virtual environment if one does not exist
2. Installs rendercv into it (skipped on subsequent runs)
3. Reads `src/content/experience/`, `src/content/projects/`, and `src/content/education/` and writes `public/cv.yaml`
4. Renders the PDF and writes it directly to `public/resume.pdf`

> **Note:** The skills section and personal details (name, email, website, GitHub) are hardcoded in `scripts/generate-cv.mjs`. Edit that file directly to update them.
