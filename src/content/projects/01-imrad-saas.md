---
title: IMRaD Classification SaaS
description: "Master's thesis: 8-node microservices architecture using Gemini Pro + BERT for rhetorical classification of scientific papers. 169k-sentence dataset, 98.21% peak F1."
github: https://github.com/stormsidali2001/graduation_IMRAD_introduction_analysis_SaaS
stack: [Next.js, FastAPI, BERT, Gemini Pro, TF Serving]
featured: true
order: 2
---

- Architected a scalable 8-node microservices architecture comprising Nginx (gateway), Spring Cloud Eureka (discovery), Next.js (frontend and API), a FastAPI PDF extractor, TensorFlow Serving, FastAPI with LangChain (AI analysis), and Express.js with MongoDB (user data) decoupled by a Redis message broker
- Addressed the lack of sentence-level IMRaD datasets by building a 3-phase Gemini Pro pipeline (baseline generation, prompt refinement, and outlier detection/augmentation)
- Synthesized and validated a custom 169k-sentence dataset, boosting baseline accuracy from 44.61% to >94% (Peak F1: 98.21%) by fine-tuning 4 hierarchical BERT models
