#!/usr/bin/env node
// Reads Astro content collections and writes public/cv.yaml for rendercv.
// Run with: pnpm generate:cv
// Skills are hardcoded here since there is no content collection for them.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { AUTHOR, SITE_URL, SKILLS } from '../src/consts.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT = path.join(ROOT, 'src/content');
const OUTPUT = path.join(ROOT, 'public/cv.yaml');

function parseFrontmatter(src: string) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('No frontmatter block found');
  return { data: yaml.load(m[1]) as Record<string, any>, body: m[2].trim() };
}

function bullets(body: string) {
  return body
    .split('\n')
    .filter((l) => /^- /.test(l))
    .map((l) => l.replace(/^- /, ''));
}

// Slice to YYYY-MM. Handles both Date objects and "YYYY-MM-DD" strings.
function ym(date: Date | string | undefined) {
  if (!date) return undefined;
  const s = date instanceof Date ? date.toISOString() : String(date);
  return s.slice(0, 7);
}

function readCollection(name: string) {
  return fs
    .readdirSync(path.join(CONTENT, name))
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) =>
      parseFrontmatter(fs.readFileSync(path.join(CONTENT, name, f), 'utf8'))
    );
}

const experience = readCollection('experience').map(({ data, body }) => ({
  company: data.company,
  position: data.role,
  location: data.location,
  start_date: ym(data.startDate),
  end_date: ym(data.endDate),
  highlights: bullets(body),
}));

const projects = readCollection('projects').map(({ data, body }) => {
  const entry: Record<string, any> = {
    name: data.title,
    url: data.github,
    highlights: bullets(body),
  };
  if (data.description) entry.summary = data.description;
  return entry;
});

const education = readCollection('education').map(({ data }) => {
  const m = String(data.degree).match(/^(.+?)\s+in\s+(.+)$/i);
  return {
    institution: data.institution,
    area: m ? m[2] : data.degree,
    degree: m ? m[1] : data.degree,
    end_date: ym(data.endDate),
  };
});

const githubUsername = AUTHOR.github.split('/').pop();

const doc = {
  cv: {
    name: AUTHOR.name,
    headline: AUTHOR.jobTitle,
    email: AUTHOR.email,
    website: `${SITE_URL}/`,
    social_networks: [{ network: 'GitHub', username: githubUsername }],
    sections: {
      skills: SKILLS,
      experience,
      projects,
      education,
    },
  },
  design: { theme: 'engineeringresumes' },
};

fs.writeFileSync(OUTPUT, yaml.dump(doc, { lineWidth: -1 }), 'utf8');
console.log(`Generated: ${OUTPUT}`);
