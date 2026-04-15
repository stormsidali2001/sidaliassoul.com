---
name: Sidali Assoul
headline: Software Engineer | Full Stack Developer | Master in Computer Science
location: Bejaia, Algeria
email: assoulsidali@gmail.com
phone: "+213561536838"
website: https://www.linkedin.com/in/sidali-assoul
social_networks:
  - network: LinkedIn
    username: sidali-assoul
  - network: GitHub
    username: stormsidali2001
---

## Summary

Full-stack engineer obsessed with understanding the core gist of your business before touching the keyboard. I build scalable SaaS platforms and AI microservices that stay stable in production—leveraging Clean Architecture, DDD, and high-performance engineering.

## Experience

### Full Stack Engineer (Freelance)
**Upwork Client** | *Jan 2024 - Jan 2026* | United Arab Emirates (Remote)

- Architected a multi-tenant logistics hub (110+ model schema) enabling merchants to synchronize orders and providing shipping companies with dedicated tools to manage fulfillment
- Led a developer team of 4, conducted technical interviews, and performed code reviews across 2 production codebases
- Built an eCommerce sync engine (Shopify, WooCommerce); leveraged the Strategy pattern for pluggable, non-breaking store integrations
- Implemented financial infrastructure using Stripe Connect for merchant and carrier wallets, on-demand withdrawals, and automated payouts
- **Tech stack:** Laravel 12, Next.js 15, TypeScript, MySQL, Stripe API, Puppeteer

### Backend Engineer
**Addinfo** | *Apr 2023 - Nov 2023* | Paris, France (Remote)

- Architected a multi-tenant SaaS with a high-throughput NestJS core and multi-provider OAuth (Google, GitHub, GitLab, Azure)
- Designed a scan ingestion engine mapping complex JSON snapshots across 50+ relational tables with automated deduplication
- Built Git integrations (GitHub, GitLab, Azure) using OAuth and automated CI/CD workflow/secret injection
- Eliminated analytics latency from ~3s to <100ms by implementing Write-time Aggregation (Materialized View strategy) for high-volume statistics, while utilizing application-level caching and SQL query refinement
- Integrated a real-time memory monitoring interceptor across all production endpoints to detect heap usage spikes, and personally resolved identified memory leaks after receiving automated alerts
- Launched a standalone Certification Microservice featuring Stripe payment integration, LinkedIn OAuth, and a Puppeteer-based PDF generation engine for automated diploma issuance
- **Tech Stack:** NestJS, TypeScript, PostgreSQL (TypeORM & Prisma), Supabase, React, Next.js, Docker, Stripe, Puppeteer, Cypress, GitHub/GitLab/Azure APIs

### Software Engineer
**CreaTech dz** | *Sep 2022 - Mar 2023* | Algiers, Algeria

- Architected a multi-tenant Events Marketplace (NestJS, TypeScript, TypeORM, MySQL) with Twilio SMS-OTP onboarding, RBAC guards, partner approval workflow, and geo-tagged discovery for organizers and sellers
- Built full revenue engine: Stripe webhook payments, frequency-based loyalty system, SaaS tier subscriptions, moderator permissions, and CMS (blogs/guides), plus Docker CI/CD and automated cleanup
- Engineered Ecole at Home LMS backend automating virtual-school operations (NestJS + TypeORM): tri-role identity, teacher availability mapping, and RxJS-resilient Zoom scheduler eliminating manual bookings
- Delivered end-to-end student experience: Stripe payments, automated Zoom-to-Vimeo recording pipeline, transactional emails, and dedicated upcoming/past course portals
- **Tech Stack:** NestJS, TypeScript, TypeORM, MySQL, Stripe, Twilio, Zoom, Vimeo, Nodemailer, Docker, RxJS, Passport.js, Google Cloud Run

### Full Stack Engineer
**Data Intuition** | *May 2022 - Aug 2022* | Algiers, Algeria

- Maintained and modernized three legacy production platforms built with Express.js and EJS, ensuring 99.9% uptime during transitions
- Implemented critical feature updates and resolved security vulnerabilities in high-traffic administrative portals

## Education

### Master of Science (M.S.) in Computer Science
**Higher School of Computer Science (ESI-SBA)** | *Sep 2019 - Sep 2024* | Sidi Bel Abbes, Algeria

- **Master's Thesis:** "[Leveraging Gemini Pro and BERT for Automated IMRaD Classification: A Novel Dataset and SaaS Platform](https://github.com/stormsidali2001/graduation_IMRAD_introduction_analysis_SaaS)". ([Notebooks](https://github.com/stormsidali2001/graduation_IMRAD_introduction_analysis_SaaS/tree/main/notebooks)). Architected a scalable 7-node distributed system (Next.js, FastAPI, TF Serving, Express.js, Eureka) to automate the rhetorical classification of semantic moves and sub-moves within the introduction sections of scientific papers.
- **Key Contributions & Pipeline:** Addressed the lack of sentence-level IMRaD datasets by engineering a 3-phase Gemini Pro pipeline (baseline generation, prompt refinement, and outlier detection/augmentation). Synthesized and validated a custom 169k-sentence dataset, boosting baseline accuracy from 44.61% to >94% (Peak F1: 98.21%) by fine-tuning 4 hierarchical BERT models.

## Projects

### [Contracts Management System](https://github.com/stormsidali2001/contracts-management)
Designed during an internship at Béjaïa's harbor company (BMT), this real-time contracts and organizational management dashboard empowers juridicals, admins, and employees. Built with Clean Architecture, Domain-Driven Design (DDD), and Event-Driven Design, the platform features a Feature-Sliced Next.js frontend and a NestJS backend leveraging Redis Pub/Sub to horizontally scale WebSockets, fully validated by comprehensive unit and integration tests.

### [Chess Game Engine](https://github.com/stormsidali2001/react-chess-game-from-scratch)
A scalable TypeScript chess engine (DDD + Hexagonal Architecture) featuring a Polymorphic Move Strategy and deep-cloning Rules Engine to handle complex state transitions and edge cases within a Turborepo monorepo.

### [vgath 8086](https://github.com/idrisT11/8086-Online-IDE)
An open-source Intel 8086 emulator and assembler for the browser (Vanilla JS), developed as a 2nd-year university final project in a team of 6, featuring instruction set simulation and interactive debugging.

