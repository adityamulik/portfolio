---
title: "How writing lands on this site"
date: "2026-10-04"
summary: "Posts live as Markdown in this repo. Add a file, push, and the next build publishes it—no CMS."
tags:
  - meta
  - writing
draft: false
---

This site is a static Next.js export. Articles are files under `content/writing/`.

## Front matter

```yaml
title: "Your title"
date: "2026-10-04"
summary: "One or two sentences for the index and social cards."
tags:
  - production
  - agents
draft: false
```

Set `draft: true` to keep a post off the production build.

## Body

Write normal Markdown: headings, lists, links, and fenced code. The `/writing/` index picks up every non-draft file automatically on `npm run build`.

That is the entire publishing workflow: edit in git, review the pull request, merge when you are ready.
