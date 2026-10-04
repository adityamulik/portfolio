# Aditya Mulik

Personal site for hiring managers and a public evidence record of production AI/ML and distributed-systems work.

Live production currently deploys from `main`. This rebuild lives on a feature branch until it is merged.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · static export to `out/` for Netlify.

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
```

writes a static site to `out/`.

## Writing

Add `content/writing/your-slug.md`:

```yaml
---
title: "Title"
date: "2026-10-04"
summary: "One or two sentences."
tags:
  - production
draft: false
---
```

`draft: true` keeps a post off the production build.

Experience, case studies, and evidence cards are TypeScript in `content/`.

## Deploy

`netlify.toml` builds with `npm run build` and publishes `out/`. Enable Deploy Previews on pull requests so feature branches never replace [adityamulik.com](https://www.adityamulik.com) until `main` is updated.
