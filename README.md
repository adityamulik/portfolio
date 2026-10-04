# Aditya Mulik

Personal site for hiring managers and a public evidence record of platform engineering work.

Production currently deploys from `main`. This rebuild lives on a feature branch until it is merged.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, static export to `out/` for Netlify.

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

## Writing (internal)

The `/writing` page stays blank until a published post exists. To add one, put a file in `content/writing/`:

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

`draft: true` keeps a post off the production build. Experience, case studies and evidence live in `content/`.

## Deploy

`netlify.toml` builds with `npm run build` and publishes `out/`. Enable Deploy Previews on pull requests so feature branches never replace [adityamulik.com](https://www.adityamulik.com) until `main` is updated.
