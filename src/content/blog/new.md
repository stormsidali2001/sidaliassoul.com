---
title: "Reflections on My Engineering and Masters Thesis: Building an AI Powered
  IMRaD Analysis SaaS Platform"
description: In this reflection I share how I completed both my master's thesis
  and engineering project on IMRAD classification. From building a 169k-sentence
  dataset and fine-tuning BERT models to a 98.21 percent F1 score, to launching
  a full microservices SaaS platform. This post details the complete technical
  journey.
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



## Dataset Preparation

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



## Phase 1: Baseline Model (V1)

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

## Phase 2: Model Refinement (V2)

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

## Phase 3: Model Enhancement and Dataset Augmentation (V3)

For my final model, i generated a custom dataset of 169k sentences by creating a custoom pipeline that was built on top of the V2 generated data and including: Gemini based outlier detection, Gemini data augmentation then fine tuning 4 customo bert models.



The final generated data was used to fine-tune four hierarchical, specialized BERT models.

Believe me when I tell you that I was bursting with joy when I saw the validation and training accuracy graphs increasing in parallel. 

When the F1 score hit 0.98 for overall move classification and exceeded 0.89 for submove classification, I was literally screaming, "Yes, yes! It's not overfitting, and the F1 score is above 98%!"  


![ZPFFJXin48VlVeeflO3KLfkqGX2aYZ-GYWCW9RIdN2QxasI4rux6iujerNUlxLYA8fhIvBJZMN_V_Bm-3ugYNMlDErrHIz3pND2fCU69tHe5My1QkMTzWLy6u1BhfwNupZLNtdg1z-DX-gSLBmr9gHxdNwoElTDxR0akXD6MmfH_4WmgyzkOp3ScafILlOE3QrI42ItOHH-d1n4x-Z64L3uppYk1y7Ab8vZ6LN8r1R0u9qiD.png](/ZPFFJXin48VlVeeflO3KLfkqGX2aYZ-GYWCW9RIdN2QxasI4rux6iujerNUlxLYA8fhIvBJZMN_V_Bm-3ugYNMlDErrHIz3pND2fCU69tHe5My1QkMTzWLy6u1BhfwNupZLNtdg1z-DX-gSLBmr9gHxdNwoElTDxR0akXD6MmfH_4WmgyzkOp3ScafILlOE3QrI42ItOHH-d1n4x-Z64L3uppYk1y7Ab8vZ6LN8r1R0u9qiD.png)



This previous pipeline was powered by a series of carefully designed prompts for Gemini Pro.

```
[ V2 Prompt ]
        +
 [ Moves & Sub-moves ]
     examples
        |
        v
    (extends)
        |
        +--> [ AI Outlier Detection ]
        |
        +--> [ AI Data Augmentation ]

```

The **base prompt** is the same one I used in V2, but with an extra ingredient. 

In addition to listing all the moves and submoves, I also provided multiple examples for every single submove to better guide the model.

Both the **outlier detection** and **data augmentation** prompts **extend** from this **base prompt**, just with some extra adjustments added on top.

Essentially, the outlier detection prompt instructs Gemini to audit previous predictions, flagging them as outliers or correcting them if they're wrong. 

The data augmentation prompt then handles the heavy lifting, instructing Gemini to generate more sentences for each move while strictly respecting the rules I defined.

## A Microservices Based Such platform:

After publishing the final four **hierarchical classification BERT models**, I decided to create a SaaS platform that makes full use of these models and helps researchers and students easily analyze the rhetorical structure of scientific paper introductions.



The **IMRaD Analysis Platform** offers the following key features:

- Upload a research paper (PDF) or manually paste introduction text
- Automatic sentence segmentation and classification of IMRaD moves and sub-moves with confidence scores
- Clean and intuitive visual interface for viewing analysis results
- User feedback system allowing corrections to predictions to help improve the model
- Premium features including detailed summaries and AI-generated author thought process
- Full user account management with Stripe subscription handling
- Comprehensive administrator tools for managing users, reviewing feedback, and monitoring platform statistics

### Microservices Breakdown

![component_diagram (1).png](</component_diagram (1).png>)

Let’s break down the key microservices in our platform.

The entry point of the entire system is the **API Gateway**. It is responsible for forwarding and load-balancing user requests to the active instances of our internal microservices.

All microservices automatically self-register into the **Eureka Discovery Server**, which acts like a dynamic index that keeps track of all running instances of each service.

Next, we have the **Next.js microservice**, which actually consists of two parts:

- A frontend responsible for rendering all the individual pages
- A backend that handles:
  - Authentication and authorization
  - Subscription management using the Stripe third-party service
  - Acting as a composition service that calls and aggregates results from multiple internal microservices
  - Sending transactional emails via the Resend third-party API
  - Persisting data using a PostgreSQL database

Then we have the **TensorFlow Serving microservice**, which provides optimized, production-grade access to our fine-tuned BERT models.

The **AI Moves and Sub-moves microservice** handles batch predictions for moves and sub-moves by delegating requests to TensorFlow Serving. It also communicates with the Gemini API to generate the introduction summary and the author’s hypothetical thought process behind switching between the different moves and sub-moves while writing the introduction.

The **User Data microservice** is responsible for storing user predictions and managing feedback. It uses MongoDB as its database.

Finally, **Redis** serves as both an in-memory database and a message broker, enabling asynchronous communication between the different microservices.

## Data Models

Here's a quick look at the data model of our platform.

### Next.js Microservice

**Next.js Microservice:** The Next.js api microservices takes responsability on two entities: **User** and **subscription**.

![class_diagram.png](/class_diagram.png)

**User Data Microservice:** The User Data microservice is responsible for three entities: **Introduction**, **Sentence**, and **Feedback**.

![VL9FQ_f04BtdKonUVuXw-n52i5OAGdlAjPT9TenBihCoEv5AwNTlObnYKicUPj-RURpvi_K2B8sj8ryPEWE3LRKXbEiPbMCvkGUYgC7xlO6o_UmDOo76aM9JdkGXYvn6ZsUrMQyVK0QgElJ_EefkEkf0mautlSXtfDhtpvyWLfcmeR876ezyq6EiO0H1_IAnshV1lH99a0hqiNetNfBi_azx6Yx8K6BMv1_kWg-EZaPtTApU.png](/VL9FQ_f04BtdKonUVuXw-n52i5OAGdlAjPT9TenBihCoEv5AwNTlObnYKicUPj-RURpvi_K2B8sj8ryPEWE3LRKXbEiPbMCvkGUYgC7xlO6o_UmDOo76aM9JdkGXYvn6ZsUrMQyVK0QgElJ_EefkEkf0mautlSXtfDhtpvyWLfcmeR876ezyq6EiO0H1_IAnshV1lH99a0hqiNetNfBi_azx6Yx8K6BMv1_kWg-EZaPtTApU.png)



Even though the **User** and **Introduction** entities are located in different microservices and use totally different databases, they are related in a one-to-many relationship (a user can have many introductions) and linked via a foreign key "introductionId" within the introduction document.



## Conclusion



If you’ve reached this far, I’d like to thank you for your time and patience in reading about these memories from almost two years ago.

After months of studying NLP, leafing through research papers, and listening to podcasts about it during my walks, I went from having no dataset to creating a 169k-sentence annotated dataset, fine-tuning four hierarchical BERT models to a 98.21% F1-score, and building a complete microservices platform.

I hope you found this helpful and informative. If you have any questions or suggestions, feel free to reach out. You'll find all my social media links on the [Contact Page](/contact).

