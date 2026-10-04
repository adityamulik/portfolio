---
title: "Platforms for LLMs"
date: "2025-12-01"
summary: "Notes accompanying my InfoQ article on the platform layer that turns isolated LLM features into shared infrastructure."
tags:
  - llms
  - platforms
  - infoq
draft: false
---

I published an article on InfoQ about **platforms for LLMs**: the unglamorous layer that sits under chat UIs—intent routing, prompt versioning, token accounting, tool contracts, and grounding.

Production LLM systems fail in boring ways. A prompt change ships without a version. Tokens are unmetered. An agent answers from memory instead of inventory. None of those are model problems. They are platform problems.

The public article is the primary citation for that argument.
Use the [Evidence](/evidence/) page for the outbound proof link
(replace the InfoQ URL in `content/evidence.ts` if it still points at the homepage).
Related engineering notes live in the [LLM platform primitives](/work/llm-platform-primitives/)
case study and the [MCP production toolkit](https://github.com/adityamulik/mcp-production-toolkit)
repository.

This post is the in-repo companion so the writing section is not an empty shelf while longer pieces live on InfoQ and conference sites.
