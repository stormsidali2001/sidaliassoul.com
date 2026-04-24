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

## Not one graduation project, but actually two!

In Algeria, we don't just pick one; we’re required to complete both a master's thesis and an engineering project at the same time.



Both my master's and engineering theses are about IMRAD classification, but each one focuses on a different angle of it. 

## But what does IMRAD even mean?

Before moving forward you need to understand something about research papers.

Research papers are about presenting scientific findings, which can't be mixed with other kinds of human literature. That's why IMRAD comes in.

IMRaD stands for Introduction, Methods, Results, and Discussion. It provides a formal and well-defined logical framework for presenting research findings.

Each section serves a different goal:

- **Introduction:** Sets the stage by identifying a research gap and stating the study's specific goals.
- **Methods:** Details the exact steps and materials used so the experiment can be reproduced by others.
- **Results:** Reports the raw data and findings objectively through text, tables, and figures.
- **Discussion:** Explains what the findings actually mean and how they fit into the bigger picture of the field.



## Master's Thesis:

Given the vast number of scientific papers published daily, there is a growing need for classifiers that enable researchers and students to filter, search, and query literature based on specific IMRaD sections (Introduction, Methods, Results, Discussion, and an extra Related Work label).

That's where my master's thesis entitled **"Leveraging BERT and Data Augmentation for Robust Classification of IMRAD Sections in Research Papers"** comes in!



The research question that I sought to answer with this thesis is the following:

Can a BERT model, enhanced through data augmentation and robust preprocessing techniques (including outlier detection and data cleaning), achieve highly accurate and generalizable classification of IMRAD sections in scientific papers, outperforming traditional machine learning approaches?

### State of Art

In a master's thesis, before diving into your own approach, you have to survey the current research and see what the state of the art looks like. 

So I spent a significant amount of time searching for relevant papers, reading, filtering, and carefully selecting four pivotal studies that I reviewed and compared in terms of data size, annotation method, models used, and accuracy. 

I also studied a wide range of relevant topics, including classic NLP techniques, traditional machine learning classifiers (TF-IDF, BoW, Word2Vec, Naïve Bayes, and SVM), and modern deep learning advances (pre-trained models like BERT and GPT, LLMs, and prompt engineering).

### Experimentation Pipeline

- Data collection from Hugging Face (~530k rows, enriched with my new “Related Work” label), followed by exploration, cleaning (removal of non-natural language elements), and balancing down to ~25k rows

- Traditional baseline (Logistic Regression + TF-IDF) hitting 63.78% accuracy

- Initial BERT fine-tuning reaching F1-score 0.7309

- LLM-based outlier detection/cleaning + data augmentation (generating synthetic paragraphs to expand to ~100k rows)

- Final fine-tuned BERT model achieving F1-score 0.9172, showing massive progressive gains over the baseline

### Contributions

A robust, transferable IMRAD classification framework combining transfer learning, advanced preprocessing, and data augmentation; a valuable new annotated dataset; clear proof that it beats traditional methods; and practical insights that push automated scientific text processing forward.



## Research Part:

### Dataset Preparation

Before jumping into the research and development of my engineering project, I faced a hurdle that almost made me give up on the theme. 

I sat in doubt and perplexity after discovering that there are no research papers or public datasets providing sentence-level labels for IMRD introduction moves and sub-moves.

Things went a bit smoother for my master's thesis because I found a lot of research papers and publicly annotated datasets that provide "I," "I","M","R" and "D" labels for paragraphs extracted from various papers. One of these is the "**unarXive"** dataset.

However, because the research part of my engineering thesis focused specifically on IMRD introductions, I wasn't able to find a suitable, ready-made dataset that provides sentence-level annotations capturing the rhetorical moves and sub-moves within an introduction.

### Phase 1: Baseline Model (V1)

- **Data Generation:** Due to the absence of a suitable dataset, I utilized Gemini Pro LLM to generate annotated data. I start by filtering the unarxive dataset by introductions, and extracting a small subset of it. Afterwards, we split the introdoctions into  
- 

### Phase 2: Model Refinement (V2)

### Phase 3: Model Enhancement and Dataset Augmentation (V3)

## Conclusion

