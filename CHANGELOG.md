# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to Semantic Versioning.

## [1.2.0] - 2026-04-07
### Added
- **Live Technical Documentation:** Configured `TypeDoc` and `pdoc` to generate comprehensive static HTML documentation for both the React frontend and FastAPI backend, deployed securely via GitHub Pages.
- **Inline Codebase Documentation:** Implemented extensive JSDoc comments across all frontend UI components and Google-style docstrings across backend routing, extraction logic, and AI orchestration scripts.
- **Agile Lifecycle Records:** Added `SoftwareLifecycle.md` to document sprint reflections, team dynamics, and SDLC progression.
- **UI Component Sandbox:** Integrated Storybook for isolated frontend component testing and visualisation.

### Changed
- **Dependency Parity:** Appended documentation generators (`pdoc`) to the backend `requirements.txt` to ensure 1:1 environment replication for future developers.
- **README Finalisation:** Updated the project structure tree, added live GitHub Pages documentation badges, and refined the Table of Contents for the final repository handoff.
- **GenAI Reflection Finalisation:** Completed a massive 24-part integration detailing the complete AI usage reflection, engineering evaluation, and prompt history.

### Fixed
- **Deployment Blocker:** Resolved a critical Python `IndentationError` in the `main.py` application entry point and `search.py` caused by misaligned docstring implementations, restoring the Render API production deployment.

## [1.1.0] - 2026-04-06
### Added
- **SVG Modelling Assets:** Replaced code-based Mermaid diagrams with high-fidelity SVG assets for **System Architecture**, **Sequence Flows**, and **ER Data Modelling** to ensure visual stability.
- **AI Usage Reflection:** Authored a comprehensive **GenAI Reflection** document, critically evaluating LLM implementation and documenting the "Human in the Loop" decision-making process.
- **Formalised Testing Suite:** Documented rigorous **Feature** and **Functional** test cases, including resilience analysis for anti-bot blocks and UI state persistence.
- **Self-Documentation Strategy:** Initiated a full-stack documentation effort utilising **TSDoc** and Python **Docstrings** to fulfill high-maintainability requirements (NFR-08).

### Changed
- **Architectural Auth Pivot:** Executed a critical refactor of the persistence model, replacing the unstable JWT-based system with a **Simplified Email-Persistence Model** to achieve 100% functional reliability for history tracking.
- **Streamlined History Logic:** Re-engineered the backend `/auth/history` routes and frontend fetch logic to use unique email query parameters, eliminating hydration mismatches during dual deployments.
- **Repository Structure:** Refactored the core project structure and file references in `Requirements.md` for improved readability and alignment with the finalised file tree.

### Fixed
- **Dependency Security:** Patched a high-severity **esbuild** vulnerability in the frontend pipeline using npm overrides to secure the software supply chain without breaking the Vite build.
- **Environment Sanitisation:** Successfully removed sensitive `SECRET_KEY` dependencies from the `.env` templates and the Render production environment.
- **Redundant API Processing:** Resolved a "double-parsing" bug in the `Details` and `Results` components where duplicate `response.json()` calls were causing promise collisions.

## [1.0.0] - 2026-04-03
### Added
- **Dynamic Deployment Architecture:** Engineered a dual-environment deployment pipeline using `VITE_API_URL`. The frontend now dynamically routes between local development (`localhost`) and the live Render cloud API, achieving total environment parity and database isolation.
- **Help Modal & UI Polish:** Implemented an interactive bento-grid playbook guide, unified the global glassmorphism theme, and updated skeleton loading cards.
- **Price Interceptor:** Engineered an ironclad backend interceptor with native SERP API parameters, including comprehensive minimum and maximum price support.
- **Documentation:** Finalised the System Modelling diagrams, UML sequence models, Requirements Specification, and Traceability Matrix.

### Changed
- **State & Routing:** Refactored React states (`History.tsx`) for proper hydration, optimised AI insight routing, and updated backend dependencies to support FastAPI robustly.
- **Scraping Engine:** Updated dependency requirements for the `playwright` scraper and enhanced the Amazon link analysis logic.

### Fixed
- **Dependency Conflicts:** Resolved React 19 peer-dependency build failures and Vercel deployment blockers via custom `.npmrc` configuration.
- **UI Synchronisation:** Fixed modal rendering issues, corrected z-index overlapping, and synchronised UI components across the frontend architecture.
- **State Management:** Prevented duplicate search history entries caused by React Strict Mode rendering cycles.

---

## [0.2.0] - 2026-03-20
### Added
- **Unified Backend:** Integrated an SQLite database with FastAPI authentication endpoints to handle persistent user registration and session management.
- **User History:** Engineered authentication routing to successfully persist search queries through complex login and signup redirect flows.
- **Core UI Views:** Built out the primary application interfaces, including the Discovery view, Results page, Details page, and a dedicated History UI featuring persistent dark mode support.
- **Coupon Engine:** Implemented fully functional coupon extraction and routing capabilities.

### Changed
- **UI Overhaul:** Executed major stylistic overhauls across `Home.tsx`, `Results.tsx`, `Details.tsx`, and `Signup.tsx` to include seamless page transitions and skeleton loaders.
- **AI Integration:** Transitioned to dynamic AI trust and rating integration for enhanced real-time product comparison.
- **Database Models:** Updated SQLAlchemy database models to ensure strict Python 3.9 compatibility.

### Fixed
- Resolved minor routing state issues and local storage typographical errors.
- Cleaned up obsolete Python cache files (`__pycache__`) and thoroughly removed sensitive environment variables from source control.

---

## [0.1.0] - 2026-02-27
### Added
- **Repository Initialisation:** Established core project structure and GitHub Classroom workflow.
- **Frontend Scaffold:** Configured Vite, TypeScript (`tsconfig`), and Tailwind CSS to establish the foundational frontend architecture.
- **Routing & Theming:** Set up initial application routing, built the base Home UI, and implemented the foundational dark mode toggle.
- **Documentation:** Drafted the initial functional and non-functional requirements alongside the preliminary high-level system architecture diagrams.