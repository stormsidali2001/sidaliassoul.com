---
title: new
description: new
pubDate: 2026-04-23
updatedDate: 2026-04-23
tags:
  - ai
  - programming
  - tutorial
published: false
---
## Introduction

## How did everything start?

It's March 2024, and I've totally lost track of time, as I've been fully indulged in a long-term freelancing mission with an interesting Upwork client. 

Then, I was soon to find out that I was running out of time! I needed to start working on my graduation project.

But wait, I haven't even chosen a theme. No, but worse, I haven't even chosen a suitable supervisor for it.

So just after finishing my part-time freelancing hours, I started leafing through the themes list, looking for an interesting one that could capture my curiosity and satisfy my knowledge hunger (I was craving NLP, btw).

After a few hours of research and contemplation, I stumbled upon an interesting article entitled "**Writing support system: IMRD text analysis**." 

I thought to myself, "A 'writing support system' implies that the project might involve some software design, which is something I've always loved, and 'text analysis' means finally having a chance to fulfill my craving for NLP with a project that actually looks interesting."

The project was at a laboratory in the university where I've been studying, ESI-SBA, known as the "Higher School of Computer Science Sidi Bel Abbès." I have a lot of nice memories about the supervisor as well, as he taught me two modules in the past: File Systems and Data Structures in my second year and Data Analysis in my fourth year. So, going with that supervisor was just a no-brainer for me.

I looked up his teaching schedule and found out he was teaching the 4th-year students at 9:00 AM, so I asked a friend to let him know I was genuinely interested in the theme he suggested and that I wanted to meet him to discuss my application for the project.

As soon as he got out of class, I thanked my friend and approached the supervisor to discuss the details. My request was met with a warm approval; he explained the problem briefly and sent me some PDFs to dive deeper into it.

I immediately went to the university reading room and started skimming through the documents the supervisor sent, full of eagerness and joy, completely losing myself in a flow state. Finally, "I'm going to work on a serious NLP research project!"



The initial project requirements were about analysing IMRD introductions, and extracting a bunch of sementic contexes known as  

### ...............



&nbsp;

## Research Part:

### Dataset Preparation

Before jumping straight to research and building our models, I've been sitting in perplexity and doubt after discovering that there is no research paper and/or publicly labeled dataset for IMRD introduction's moves and sub-moves at the sentence level or granularity.

Things went a bit smoother for my master's thesis because I found a lot of research papers and publicly annotated datasets that provide "I," "I","M","R" and "D" labels for paragraphs extracted from various papers. One of these is the "**unarXive"** dataset.

However, because the research for my engineering thesis focused specifically on IMRD introductions, I wasn't able to find a suitable, ready-made dataset that provides sentence-level annotations capturing the rhetorical moves and sub-moves within an introduction.

### Phase 1: Baseline Model (V1)

- **Data Generation:** Due to the absence of a suitable dataset, I utilized Gemini Pro LLM to generate annotated data. I start by filtering the unarxive dataset by introductions, and extracting a small subset of it. Afterwards, we split the introdoctions into  
- 

### Phase 2: Model Refinement (V2)

### Phase 3: Model Enhancement and Dataset Augmentation (V3)

## Conclusion

