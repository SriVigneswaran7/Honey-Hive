# Agile Learning & Software Development Life Cycle (SDLC)

This document outlines the software engineering methodologies, project management frameworks, and iterative learning processes applied during the development of the Honey-Hive platform.

## Overview

The development of Honey-Hive was driven by a hybrid Agile methodology integrated within a standard Software Development Life Cycle (SDLC). This approach allowed the team to remain flexible, rapidly prototype complex integrations (such as Generative AI and headless browser orchestration), and continuously refine the product based on testing feedback and technical constraints.

---

## Software Development Life Cycle (SDLC) Phases

Our project followed a structured lifecycle to ensure high-quality delivery, transitioning from conceptualization to a live, decoupled full-stack deployment.

### 1. Planning & Requirements Analysis
* **Objective:** Define the core problem (inefficient deal hunting, fake coupons) and establish project scope.
* **Activities:**
    * Conducted market research on existing comparison tools.
    * Defined core User Stories and epics (e.g., "As a budget-conscious shopper, I want to filter products strictly by my maximum price").
    * Evaluated technical feasibility for integrating the Google Gemini LLM and Playwright within a Python backend.
* **Output:** [Requirements Specification Document](./Requirements.md)

### 2. System Design & Architecture
* **Objective:** Blueprint the technical foundation and data flow.
* **Activities:**
    * Designed a decoupled architecture separating the React frontend from the FastAPI backend.
    * Created UML class diagrams, database schemas for the SQLite persistence layer, and sequence diagrams detailing the multi-API data synthesis.
    * Established UI/UX design guidelines focusing on Glassmorphism and CLS reduction.
* **Output:** [System Modelling Document](./SystemModelling.md)

### 3. Implementation (Development)
* **Objective:** Translate design documents into functional, modular code.
* **Activities:**
    * **Frontend:** Scaffolded with Vite, React, and Tailwind; built reusable components and state management.
    * **Backend:** Set up FastAPI routing, implemented the Server-Side Price Interceptor, and integrated the SQLAlchemy ORM.
    * **Integration:** Connected SerpApi for live data, structured Gemini AI prompts for technical verdicts, and engineered the Playwright scraper to bypass cookie consents.

### 4. Testing & Quality Assurance
* **Objective:** Ensure system reliability, security, and accurate data rendering.
* **Activities:**
    * **Unit Testing:** Validated individual backend utility functions (e.g., regex price parsing).
    * **Integration Testing:** Ensured smooth data handoffs between the React client and FastAPI server.
    * **Edge-Case Testing:** Simulated API rate-limiting to test graceful degradation and fallback states.
    * **Security Testing:** Verified `pbkdf2_sha256` password hashing and session management integrity.
* **Output:** [Testing Strategy & QA Log](./Testing.md)

### 5. Deployment & Maintenance
* **Objective:** Release the application to production environments and monitor stability.
* **Activities:**
    * Configured distinct `.env` pipelines for local development and production.
    * Deployed the frontend to Vercel for fast edge delivery.
    * Deployed the backend to Render, configuring dynamic server spin-up parameters.

---

## Agile Methodology & Iterative Learning

To manage the complexity of the project, we adopted Agile principles, working in iterative cycles (Sprints) rather than a rigid Waterfall approach.

### Sprint Structure
Development was divided into time-boxed sprints, each focusing on delivering a functional, demonstrable piece of the application:
1.  **Sprint 1:** Foundation (UI scaffolding, Database schema setup, Basic API routing).
2.  **Sprint 2:** Core Features (SerpApi integration, User Authentication, Search History).
3.  **Sprint 3:** AI & Automation (Gemini LLM integration, Playwright coupon scraper).
4.  **Sprint 4:** Polish & Deploy (Error handling, UI refinement, Cloud deployment).

### Continuous Integration & Version Control
* **Branching Strategy:** Utilised strict feature-branching (`feature/auth`, `bugfix/scraper-timeout`).
* **Pull Requests:** Enforced peer reviews before merging into the `main` branch to prevent integration conflicts and maintain code quality.
* **Output:** [Git Workflow Document](./Workflow.md)

### Iterative Reflection & Adaptation
The integration of AI and automated scraping presented unique challenges that required an Agile mindset:
* **Prompt Engineering:** Initial Gemini prompts yielded unstructured responses that broke the frontend UI. We iteratively refined the prompts to strictly return structured JSON payloads.
* **Scraper Resilience:** Early versions of the Playwright scraper failed when encountering varying cookie consent banners. Through iterative testing, we developed dynamic waiting strategies and targeted DOM selectors to improve extraction reliability.

By treating every roadblock as an opportunity for Agile learning, the team successfully navigated the technical uncertainties of AI and browser automation, culminating in a robust final product.