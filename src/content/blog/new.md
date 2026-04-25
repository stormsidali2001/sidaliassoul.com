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

IMRaD stands for Introduction, Methods, Results, and Discussion. It provides a formal and well-defined logical framework for presenting research findings:

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

Although the experimentation section is typically optional in a master's thesis, I decided to include it anyway. Here is a clear summary of the end-to-end experimental pipeline I built:

- Data collection from Hugging Face (~530k rows, enriched with my new “Related Work” label), followed by exploration, cleaning (removal of non-natural language elements), and balancing down to ~25k rows
- Traditional baseline (Logistic Regression + TF-IDF) hitting 63.78% accuracy
- Initial BERT fine-tuning reaching F1-score 0.7309
- LLM-based outlier detection/cleaning + data augmentation (generating synthetic paragraphs to expand to ~100k rows)
- Final fine-tuned BERT model achieving F1-score 0.9172, showing massive progressive gains over the baseline

### Contributions

The key findings of the thesis are as follows:

- Establishment of a robust and transferable IMRAD classification framework that combines transfer learning, advanced preprocessing, and data augmentation.
- Creation of a new annotated dataset (approximately 100k rows) published on Hugging Face.
- Training of a high-accuracy fine-tuned BERT classifier.

## Engineering Thesis

In my graduation thesis, 'Leveraging Gemini Pro and BERT for Automated IMRaD Classification: A Novel Dataset and SaaS Platform,' I worked on a project spanning two core areas: **NLP deep learning research** and **systems engineering**.



Yes, I know. It would have been much easier for me to just carry on with the same theme as my master's thesis and do a single research and engineering study. 

**However**, I'm not the kind of person who gives up on something easily. My supervisor challenged me with the analysis of introductions, and despite all the hurdles I faced due to the lack of a suitable dataset, I wasn't going to drop the theme that easily.

Before I dive into the granular details of the research and development phases later in this post, here is a brief summary of my key contributions to both the research and engineering parts of the project: 



### Research Contributions:

- Established a Gemini Pro data pipeline including baseline generation, prompt refinement, outlier detection, and data augmentation, validating outputs with Random Forest, Logistic Regression, SVM, KNN, and Naive Bayes classifiers.
- Synthesized a custom 169,000 sentence dataset and fine-tuned four hierarchical BERT models, driving accuracy from a 44.61% baseline to a surprising 98.21% peak F1 score.



### Engineering Contribution:

- Architected a scalable 8-node microservices ecosystem comprising Nginx (gateway), Spring Cloud Eureka (discovery), Next.js (frontend and API), a FastAPI PDF extractor, TensorFlow Serving, FastAPI with LangChain (AI analysis), and Express.js with MongoDB (user data) decoupled by a Redis message broker.
- Directed the complete software development life cycle, authoring comprehensive technical documentation across requirements analysis and specification, system design, and implementation to ship a scalable, production-ready platform.



## Research Part:

### Dataset Preparation

Before jumping into the research and development of my engineering project, I faced a hurdle that almost made me give up on the theme. 

I sat in doubt and perplexity after discovering that there are no research papers or public datasets providing sentence-level labels for IMRD introduction moves and sub-moves.

Things went a bit smoother for my master's thesis because I found a lot of research papers and publicly annotated datasets that provide "I," "M," "R," and "D" labels for paragraphs extracted from various papers. One of these is the "**unarXive"** dataset.

```
[ Unarxive Dataset ]
      (Labels: I,M,R,D,W)
               |
               | Filter &
               | Cleaning
               v
       [ Filtered Results ]

-------------------------------
| Text (Excerpt) | Label |
|-------------------|---------|
| "Food recom..." | I |
| "Previous stu..." | R |
| "As discussed..." | D |
| "Initially..." | I |
| "The method..." | M |
| "Furthermore..." | R |
| "Results show..." | D |
-------------------------------

         CHALLENGES:
* Section-level annotations only.
* Lack of sentence-level
  granularity.
```

However, because the research part of my engineering thesis focused specifically on IMRaD introductions, I wasn't able to find a suitable, ready-made dataset that provides sentence-level annotations capturing the rhetorical moves and sub-moves within an introduction.



As I couldn't find public data or afford a human annotator, I designed a three-phase approach (V1->V2->V3) to **overcome** the lack of a sentence-level granular dataset and to create a custom one tailored to our specific needs.    



### Phase 1: Baseline Model (V1)

The way I approached this problem is incremental. I started with a baseline model involving the following workflow:

- I selected random introductions from the cleaned and filtered unarXive dataset.
- I split the introductions into their individual sentences.
- I fed every individual sentence into a Gemini LLM instance while guiding it with a well-crafted classification prompt.
- Then I used the generated data to fine-tune a BERT model for classification. 

- This model achieved an accuracy of 44.61%, demonstrating potential (because the accuracy is slightly higher than a random guess for three classes) but highlighting the need for improvement.

```
[ unarxive dataset ]
  ↳ Cleaned & filtered
          |
          v
  [ Introductions ]
          |
       (split)
          v
    [ Sentences ]
          |
          v
   [ Gemini LLMs ] <--- [ Classification Prompt ]
          |
      (outputs)
          v
   [ Predictions ]
    ↳ Sentence -> Move 3
    ↳ Sentence -> Move 1
    ↳ Sentence -> Move 2
```



LLMs are generalists by design; they are meant to deal with any kind of situation. So, how can we leverage them on specific tasks like classification? That's where prompt engineering comes in. 

A prompt is basically a set of instructions written in raw natural text. It allows us to restrict how the LLM acts, or specialize it for a specific task like classification, summarization, etc.

In this version, i used a fairly simple prompt to instruct each Gemini Pro instance to classify a given sentence into its corresponding IMRAD move.

### Phase 2: Model Refinement (V2)

In the second version of the pipeline, I decided to focus on enhancing the prompt. 

I thought to myself, 'What if the reason behind that low accuracy is that Gemini Pro **didn't have enough context about the introduction**? Maybe I should **embed the whole introduction in the prompt**.' 

In addition to that, instead of classifying only the moves, the enhanced prompt will allow Gemini to **classify both moves and submoves in one go**. 

The comparative table below explains the steps that were taken.


|  |  |  |
| ------------------------ | ----------------------------- | -------------------------------------------------------------- |
| **Feature** | **Initial Prompts** | **Enhanced Prompts** |
| **Input** | A single sentence. | A single introduction. |
| **Classification Scope** | Classifies only moves. | Classifies both moves and submoves in one go. |
| **Output** | A single sentence prediction. | A list of sentence predictions (with move and submove labels). |


  
The reason behind these last two changes was to increase the overall annotation speed and give Gemini Pro a better understanding of every move by knowing the corresponding submoves. 

Since using a heavy model like BERT for simple benchmarking is both time-consuming and resource-intensive, I opted for basic ML classifiers paired with TF-IDF vectorization to check the quality of the new dataset. The results were surprising!


|  |  |
| ---------------------- | ------------ |
| **Classifier** | **Accuracy** |
| Random Forest | **60.7 %** |
| Logistic Regression | 60.0 % |
| Neural Network (Keras) | 57.5 % |
| Naive Bayes | 55.6 % |
| K-Nearest Neighbors | 54.0 % |
| Decision Tree | 51.6 % |


Every single one of them managed to outperform the previous BERT model. That was a clear sign that I was making progress; the prompt enhancement was fruitful.

### Phase 3: Model Enhancement and Dataset Augmentation (V3)

For my final model, i generated a custom dataset of 169k sentences by creating a custoom pipeline that was built on top of the V2 generated data and including: Gemini based outlier detection, Gemini data augmentation then fine tuning 4 customo bert models.



The final generated data was used to fine-tune four hierarchical, specialized BERT models.

Believe me when I tell you that I was bursting with joy when I saw the validation and training accuracy graphs increasing in parallel. 

When the F1 score hit 0.98 for overall move classification and exceeded 0.89 for submove classification, I was literally screaming, "Yes, yes! It's not overfitting, and the F1 score is above 98%!"  


```
```
   [ START ]
           |
           v
+-----------------------+
| DATA REFINEMENT |
|-----------------------|
| - V2 Data (IMRaD) |
| - Outlier Detection |
+-----------------------+
           |
           v
+-----------------------+
| DATA AUGMENTATION |
|-----------------------|
| - Generate Sentences |
| - Tailored Prompts |
+-----------------------+
           |
           v
+-----------------------+
| COMBINE & ANNOTATE |
| (169k Sentences) |
+-----------------------+
           |
           v
+-----------------------+
| MODEL TRAINING |
|-----------------------|
| 1. BERT 1: |
| Overall Move |
| Classifier |
|  |
| 2. Sub-move Training: |
| - Filter Move 0 |
| -> BERT 2 |
| - Filter Move 1 |
| -> BERT 3 |
| - Filter Move 2 |
| -> BERT 4 |
+-----------------------+
           |
           v
+-----------------------+
| EVALUATION |
|-----------------------|
| - Overall: F1 > 0.98 |
| - Sub-move: F1 > 0.89 |
+-----------------------+
           |
           v
        [ END ]
```
```

–next slide__________

- This  previous pipeline is powered by a series of carefully designed prompts for Gemini Pro. 
- 

  


- The base prompt is the same prompt used in v2 but with an extra ingredient
  - In addition To listing all the moves and the sub moves in the prompt I also provided many examples for every sub move.

  


- Both the outlier detection and the data augmentation prompts extend from the base prompt while adding additional adjustments.
- Basicly the outlier detection prompt instructs gemini to flag previous predictions as outliers or correct them if they are wrong.
- And the data augmentation prompt instructs gemini to generate more sentences for each move while respecting the defined rules.



&nbsp;

## Conclusion

