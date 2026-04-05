# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to Semantic Versioning.

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