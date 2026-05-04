---
title: The Solution to Deploying Resume Projects Without Bearing the Cost
description: Avoid paying a fortune to the cloud just to display your portfolio.
  Learn how to mock API calls in Next.js to deploy complex, microservices-based
  resume projects for free.
pubDate: 2026-05-04
updatedDate: 2026-05-04
tags:
  - career
  - programming
  - tutorial
published: true
---
When submitting proposals on Upwork or job applications, I noticed something interesting.

Clients require adding your project links to the resume or the cover letter.

Well, that works for simple projects, but my graduation project was literally a microservices-based app with 8 nodes, including 4 inference BERT models running on a "TensorFlow Serving" Docker container.

![component_diagram (1).png](</component_diagram (1).png>)

I have already written a full blog article detailing everything about it [here](/blog/reflections-on-my-engineering-and-masters-thesis-building-an-ai-powered-imrad-analysis-saas-platform/)

I thought in my head, "I'm not spending money or taking the risk of getting DDoS attacks from someone just for a preview project.



&nbsp;

That's why I decided to take a middle ground approach and mock the microservices calls and registry services at the Next.js API level.



So instead of deploying all of the microservices nodes, I just deployed the Next.js app on Vercel and mocked all the microservices calls.

As the Next.js API was the main orchestrator and the API composition service, I had to mock all the following:

1. The local Postgres database connection.
2. Microservice instances lock up at the Eureka Discovery Server: service name to a list of IP addresses and ports.
3. External API calls: Resend and Stripe.
4. PDF extractor FastAPI microservice calls: This one was relatively simple, as it just receives a scientific paper, parses it, and then extracts the introduction section via some deterministic rules.
5. AI IMRad moves and sub-moves FastAPI microservice calls. Mocking this one was also relatively easy, as I had only to mock a single function that takes a bunch of introduction sentences as an input and outputs the classification predictions.
6. The User Data microservice is responsible for storing introductions, predictions, and user feedback in a MongoDB database. This one was a bit tricky because I had to run my seeders in non-preview mode, with all the microservices running locally on my machine. Then, I logged in as an admin, downloaded the feedback as JSON, placed it in the public directory of my Next.js app, and used it to mock the data stored in the User Data microservice.
7. Authentication and authorization: Well, obviously this one took me a bit of time, as I was using NextAuth, so I had to create a wrapper around the session calls and then return a mock session of three test users: "Premium User," "Admin," and "Visitor." (somebody who is not authenticated).

In Preview mode, when a recruiter tries to log in, he will see this page.

![Screenshot 2026-05-04 at 10.23.16 AM.png](</Screenshot 2026-05-04 at 10.23.16 AM.png>)

Instead of being asked to enter his credentials, he would need to just select a role among the three listed ones, then he will get logged in instantly.

After logging in, I added this banner to emphasize again that he is in preview mode and to allow him to easily switch to another role in case he wanted to.

![Screenshot 2026-05-04 at 10.26.34 AM.png](</Screenshot 2026-05-04 at 10.26.34 AM.png>)



If you want to explore the project preview, you can find it [here](https://graduation-imrad-introduction-analy.vercel.app/).

I'm curious to know whether you're deploying all of your resume projects and then putting their links on your resume. Please let me know in the comments section!



&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;