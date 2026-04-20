---
title: IMRaD Classification SaaS
description: "Master's thesis: 7-node distributed system using Gemini Pro + BERT for rhetorical classification of scientific papers. 169k-sentence dataset, 98.21% peak F1."
github: https://github.com/stormsidali2001/graduation_IMRAD_introduction_analysis_SaaS
stack: [Next.js, FastAPI, BERT, Gemini Pro, TF Serving]
featured: true
order: 2
---

Master's thesis: architected a scalable 7-node distributed system (Next.js, FastAPI, TF Serving, Express.js, Eureka) to automate the rhetorical classification of semantic moves and sub-moves within the introduction sections of scientific papers. Addressed the lack of sentence-level IMRaD datasets by engineering a 3-phase Gemini Pro pipeline (baseline generation, prompt refinement, and outlier detection/augmentation). Synthesized and validated a custom 169k-sentence dataset, boosting baseline accuracy from 44.61% to >94% (Peak F1: 98.21%) by fine-tuning 4 hierarchical BERT models.
