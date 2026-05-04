#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="$ROOT/.venv"

# Create virtual environment once
if [ ! -d "$VENV" ]; then
  echo "Creating Python virtual environment..."
  python3 -m venv "$VENV"
fi

source "$VENV/bin/activate"

# Install rendercv[full] if the sentinel file is absent.
# Checking `pip show rendercv` is not sufficient — the base package can be present
# without the [full] extras (typer, typst, rendercv-fonts, …) that are required to render.
SENTINEL="$VENV/.rendercv_full_installed"
if [ ! -f "$SENTINEL" ]; then
  echo "Installing rendercv[full]..."
  pip3 install "rendercv[full]"
  touch "$SENTINEL"
fi

# Generate cv.yaml from content collections
echo "Generating public/cv.yaml..."
pnpm --prefix "$ROOT" generate:cv

# Render PDF directly to public/resume.pdf
# --pdf-path is resolved relative to the input file's directory, so use an absolute path.
echo "Rendering PDF..."
cd "$ROOT"
rendercv render public/cv.yaml --pdf-path "$ROOT/public/resume.pdf"

echo "Done — public/resume.pdf updated."
