---
title: "Fixing Google Search Console SEO Issues: Trailing Slashes and Canonical Tags"
description: "How I diagnosed and fixed 'Alternative page with proper canonical tag' and 'Page with redirect' issues in an Astro static site by enforcing consistent trailing slashes across canonical URLs and internal links."
pubDate: 2026-04-27
tags: ["webdev", "performance", "web"]
published: false
---

<!-- DRAFT NOTE: The fixes are listed below as a reference. You are the one who will write the full article around them. This file is a structured outline, not a finished post. -->

## Context

Google Search Console flagged the following critical coverage issues for sidaliassoul.com (report date: 2026-04-27):

| Issue | Source | Pages affected |
|---|---|---|
| Alternative page with proper canonical tag | Website | 4 |
| Page with redirect | Website | 1 |
| Discovered, currently not indexed | Google systems | 5 |
| Crawled, currently not indexed | Google systems | 1 |

The root cause: Astro builds static pages as `/blog/post/index.html`, so the hosting (Vercel) serves and redirects to URLs with trailing slashes (e.g., `/blog/post/`). But the site was generating canonical tags and internal links *without* trailing slashes, creating a mismatch Google's crawler treated as duplicate pages and redirect chains.

---

## Fixes Applied

### 1. Enforce trailing slashes at the framework level

**File:** `astro.config.mjs`

**Before:**
```js
export default defineConfig({
  site: siteBase,
  // no trailingSlash setting
```

**After:**
```js
export default defineConfig({
  site: siteBase,
  trailingSlash: 'always',
```

---

### 2. Normalize canonical URL to always include trailing slash

**File:** `src/components/BaseHead.astro`

**Before:**
```js
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
```

**After:**
```js
const rawPathname = Astro.url.pathname;
const canonicalPathname = rawPathname.endsWith('/') ? rawPathname : `${rawPathname}/`;
const canonicalURL = new URL(canonicalPathname, Astro.site);
```

---

### 3. Fix footer navigation links

**File:** `src/components/Footer.astro`

**Before:**
```html
<a href="/blog">Blog</a>
<a href="/topics">Topics</a>
<a href="/resume">Resume</a>
<a href="/contact">Contact</a>
```

**After:**
```html
<a href="/blog/">Blog</a>
<a href="/topics/">Topics</a>
<a href="/resume/">Resume</a>
<a href="/contact/">Contact</a>
```

---

### 4. Fix header navigation links (desktop and mobile)

**File:** `src/components/Header.astro`

**Before:**
```html
<HeaderLink href="/blog">Blog</HeaderLink>
<HeaderLink href="/resume">Resume</HeaderLink>
<HeaderLink href="/contact">Contact</HeaderLink>
```

**After:**
```html
<HeaderLink href="/blog/">Blog</HeaderLink>
<HeaderLink href="/resume/">Resume</HeaderLink>
<HeaderLink href="/contact/">Contact</HeaderLink>
```
*(Applied to both desktop nav and mobile menu.)*

---

### 5. Fix related articles component links

**File:** `src/components/RelatedArticles.astro`

**Before:**
```html
<a href="/blog">All articles</a>
<a href={`/blog/${post.id}`}>...</a>
```

**After:**
```html
<a href="/blog/">All articles</a>
<a href={`/blog/${post.id}/`}>...</a>
```

---

### 6. Fix series card component links

**File:** `src/components/SeriesCard.astro`

**Before:**
```html
<a href={`/blog/${post.id}`}>...</a>
```

**After:**
```html
<a href={`/blog/${post.id}/`}>...</a>
```

---

### 7. Fix article tag links and canonical note in blog post layout

**File:** `src/layouts/BlogPost.astro`

**Before:**
```html
<a href={`/blog/topics/${tag}`}>...</a>
<a href={`${SITE_URL}/blog/${entry.id}`}>...</a>
```

**After:**
```html
<a href={`/blog/topics/${tag}/`}>...</a>
<a href={`${SITE_URL}/blog/${entry.id}/`}>...</a>
```

---

### 8. Fix topic card links on the topics page

**File:** `src/pages/topics.astro`

**Before:**
```html
<a href={`/blog/topics/${name}`}>...</a>
```

**After:**
```html
<a href={`/blog/topics/${name}/`}>...</a>
```

---

### 9. Fix topic tag links on the blog index

**File:** `src/pages/blog/index.astro`

**Before:**
```html
<a href={`/blog/topics/${topic}`}>...</a>
```

**After:**
```html
<a href={`/blog/topics/${topic}/`}>...</a>
```

---

### 10. Fix topic filter links on the topic listing page

**File:** `src/pages/blog/topics/[topic].astro`

**Before:**
```html
<a href={`/blog/topics/${t}`}>...</a>
```

**After:**
```html
<a href={`/blog/topics/${t}/`}>...</a>
```

---

## Diagnosing the "Crawled, currently not indexed" article

The article `reflections-on-my-engineering-and-masters-thesis-...` was flagged as crawled but not indexed. Three issues were identified and fixed directly in the `.md` file.

### 11. Fix image alt text (meaningless filenames)

**File:** `src/content/blog/reflections-on-my-engineering-and-masters-thesis-....md`

Two images had UUID-style filenames as their alt text, and two had bare filenames. All were replaced with descriptive text.

**Before:**
```md
![ZPFFJXin48VlVeeflO3K...png](/ZPFFJXin...)
![VL9FQ_f04BtdKon...png](/VL9FQ_...)
![component_diagram (1).png](</component_diagram (1).png>)
![class_diagram.png](/class_diagram.png)
```

**After:**
```html
<img src="..." alt="Training and validation accuracy curves for the fine-tuned BERT move classifier, showing the F1 score progressively reaching 98.21%" ... />
<img src="..." alt="Class diagram of the User Data microservice showing Introduction, Sentence, and Feedback entities and their one-to-many relationships" ... />
<img src="..." alt="Microservices architecture component diagram showing all 8 nodes: Nginx API gateway, Eureka discovery server, Next.js frontend and API, FastAPI PDF extractor, TensorFlow Serving, FastAPI LangChain AI analysis service, Express.js user data microservice, and Redis message broker" ... />
<img src="..." alt="Class diagram of the Next.js microservice showing the User and Subscription entities and their relationship" ... />
```

---

### 12. Add width, height, and lazy loading to images

Markdown image syntax gives no way to set dimensions, causing Cumulative Layout Shift (CLS) — a Core Web Vitals metric Google measures. Switched to inline HTML `<img>` tags with exact pixel dimensions and `loading="lazy"`.

**Before:** no width, height, or loading attributes on any image

**After (example):**
```html
<img src="/class_diagram.png" alt="..." width="693" height="1056" loading="lazy" />
```

Dimensions per image:
- Training accuracy graph: 903x673
- Component diagram: 1485x836
- Next.js class diagram: 693x1056
- User Data class diagram: 885x191

Note: inline HTML is valid in `.md` files processed by Astro's remark pipeline, but `loading="lazy"` will be stripped by sanitizing renderers such as GitHub. It works correctly for this site's use case.

---

### 13. Fix /contact link without trailing slash in article body

**File:** `src/content/blog/reflections-on-my-engineering-and-masters-thesis-....md`

**Before:**
```md
[Contact Page](/contact)
```

**After:**
```md
[Contact Page](/contact/)
```
