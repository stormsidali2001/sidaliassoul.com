---
role: Backend Engineer
company: Addinfo
location: Paris, France (Remote)
startDate: 2023-04-01
endDate: 2023-11-01
stack: [NestJS, TypeScript, PostgreSQL, Supabase, React, Next.js, Docker, Stripe, Puppeteer, Cypress]
order: 2
---

- Architected a multi-tenant SaaS with a high-throughput NestJS core and multi-provider OAuth (Google, GitHub, GitLab, Azure)
- Designed a scan ingestion engine mapping complex JSON snapshots across 50+ relational tables with automated deduplication
- Built Git integrations (GitHub, GitLab, Azure) using OAuth and automated CI/CD workflow/secret injection
- Eliminated analytics latency from ~3s to <100ms by implementing Write-time Aggregation (Materialized View strategy) for high-volume statistics, while utilizing application-level caching and SQL query refinement
- Integrated a real-time memory monitoring interceptor across all production endpoints to detect heap usage spikes, and personally resolved identified memory leaks after receiving automated alerts
- Launched a standalone Certification Microservice featuring Stripe payment integration, LinkedIn OAuth, and a Puppeteer-based PDF generation engine for automated diploma issuance
