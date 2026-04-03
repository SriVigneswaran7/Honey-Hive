# Version Control & Workflow Strategy

This document outlines the Git workflow, branching strategy, and commit conventions used during the development of Honey-Hive.

## 1. Commit Conventions
We utilised the **Conventional Commits (v1.0.0)** standard to maintain a readable and automated history.
* `feat:` - A new feature
* `fix:` - A bug fix
* `refactor:` - Code changes that neither fix a bug nor add a feature
* `docs:` - Documentation updates

## 2. Project Evolution (Commit Graph)
*Expand the section below to view the complete Git log of our team's active development phase, demonstrating parallel feature branching, structured merges, and consistent integration into the `main` branch.*

<details>
<summary><b>Click to expand full 160-commit history graph</b></summary>

```text
*   45e38ff | 2026-04-03 22:55:12 | Merge pull request #56 from UniOfGreenwich/fix/history-persistence-refactor  (HEAD -> main, origin/main, origin/HEAD)
|\  
| * a0359aa | 2026-04-03 19:41:31 | refactor: auth and coupons to use dynamic API_BASE  (origin/fix/history-persistence-refactor, fix/history-persistence-refactor)
| * 9c84e5e | 2026-04-03 19:17:58 | fix: history persistence and env variables 
| * 7e5a363 | 2026-04-03 18:37:08 | chore: minor chnage 
| * e53459f | 2026-04-03 18:15:01 | refactor: update AI review endpoint to use dynamic API base 
| * 5effd5f | 2026-04-03 18:14:51 | refactor: migrate history fetch to environment-aware API base 
| * 690bee7 | 2026-04-03 18:14:39 | fix: integrate user email in search API for history saving 
| * 3f7cc3d | 2026-04-03 18:14:22 | feat: enable history tracking and dynamic API routing 
| * 7b21f3c | 2026-04-03 18:14:09 | chore: add vite/client types for environment variables 
| * 87a0371 | 2026-04-03 18:13:57 | refactor: use absolute path for SQLite database persistence 
|/  
| * d0cd96a | 2026-04-03 18:17:56 | Refactor contributors list formatting  (origin/docs-readme)
| * 98b8c8c | 2026-04-03 18:16:35 | Fix formatting of README.md table of contents 
| * c101a28 | 2026-04-03 18:15:36 | Add Brahemrifi9 as Documentation Lead 
| * d44ef87 | 2026-04-03 18:11:33 | Update project title in README.md 
| * c2fc6b2 | 2026-04-03 18:10:54 | Revise README for HoneyHive project 
| * 411966e | 2026-04-03 17:06:43 | docs: Update Workflow.md  (docs-readme)
| * 17dce59 | 2026-04-03 16:59:06 | docs: added Workflow.md 
| * 3c4ffba | 2026-04-03 16:43:44 | docs: add structured project changelog 
|/  
*   d56bfc2 | 2026-04-03 12:33:57 | Merge pull request #55 from UniOfGreenwich/feat/help-modal 
|\  
| * 0b6d312 | 2026-04-03 12:31:38 | refactor: changed the states  (origin/feat/help-modal, feat/help-modal)
* | 88f0b70 | 2026-04-03 11:53:44 | Merge pull request #54 from UniOfGreenwich/feat/help-modal 
|\| 
| * 6fe74e2 | 2026-04-03 05:20:19 | fix: vercel deployment and react 19 dependency conflicts 
| * 083faec | 2026-04-03 04:14:26 | hore: connect frontend to live Render API 
| * d9e91f7 | 2026-04-03 03:53:49 | chore: update requirements for playwright scraper 
* |   e629428 | 2026-04-03 05:45:15 | Merge pull request #53 from UniOfGreenwich/docs-readme 
|\ \  
| * | cffdae2 | 2026-04-03 05:44:28 | docs: document hybrid extraction and redirection logic and .gitignore update 
|/ /  
* | 69ad5bf | 2026-04-03 03:09:41 | Merge pull request #52 from UniOfGreenwich/feat/help-modal 
|\| 
| * ed7118e | 2026-04-03 03:06:13 | feat: implement interactive bento-grid playbook guide 
| * 048a86a | 2026-04-03 02:37:51 | feat: created help modal and fixed exixting modals 
|/  
*   b3d3302 | 2026-04-03 01:30:01 | Merge pull request #45 from UniOfGreenwich/system-modelling 
|\  
| * d9a1d00 | 2026-04-03 01:27:29 | docs: Updated SystemModelling.md  (origin/system-modelling, system-modelling)
| * 86720eb | 2026-03-29 14:30:39 | Enhance UML diagrams and sequence model 
| * 2372a9a | 2026-03-29 05:31:10 | Enhance UML diagrams and improve descriptions 
| * 6215dda | 2026-03-29 05:20:56 | Revise Honey-Hive system modelling and architecture 
| * 5e16f41 | 2026-03-12 21:01:14 | docs: format system overview and context with markdown 
| * 164504a | 2026-03-12 20:57:15 | docs: format system overview and context with markdown 
| * 058872e | 2026-03-12 20:26:56 | docs: add 3.2 and functional decomposition 
| * b469a9c | 2026-03-12 20:07:01 | docs: add high-level system architecture diagram 
| * eba4983 | 2026-03-11 12:16:02 | docs: add system overview 
* |   c5ab0b9 | 2026-04-03 01:20:34 | Merge pull request #46 from UniOfGreenwich/docs-requirements 
|\ \  
| * | b84d3b8 | 2026-04-03 01:14:39 | docs: updated Requirements.md  (origin/docs-requirements, docs-requirements)
| * |   65e581b | 2026-03-31 15:02:49 | Merge branch 'main' of https://github.com/UniOfGreenwich/elee1149-courswork-2025-hive into docs-requirements 
| |\ \  
| * | | 8152c59 | 2026-03-31 14:50:53 | Update requirements for coupon engine and password recovery 
| * | | 0670125 | 2026-03-29 05:05:10 | Update functional and non-functional requirements 
| * | | 9ca1880 | 2026-03-29 04:53:38 | Revise Requirements Specification and Add Traceability Matrix 
| * | | 441a553 | 2026-02-27 09:29:22 | docs: clean branch - removed implementation folders 
| * | | e950c1c | 2026-02-27 09:17:49 | docs: initial requirements specification for Honey-Hive 
|  / /  
* | |   8d93125 | 2026-04-03 00:54:04 | Merge pull request #50 from UniOfGreenwich/feat/fixes 
|\ \ \  
| * | | a7260ff | 2026-04-03 00:46:47 | ui: unify glass theme, fix skeleton height, and remove pro tip  (origin/feat/fixes, feat/fixes)
| * | | b3ca867 | 2026-04-03 00:07:49 | feat: created run.py for easier execution of backend 
| * | | b0e051a | 2026-04-02 23:56:45 | feat: optimise AI insights and fix flash routing 
| * | | 0ba9415 | 2026-04-02 23:51:15 | fix: resolve modal issues and sync UI components 
| * | | a66d24d | 2026-04-02 23:51:07 | fix: resolve modal issues and sync UI components 
| * | | f6a33e3 | 2026-04-02 21:30:06 | chore: cleaned up comments 
| * | | 50397be | 2026-04-02 21:15:12 | fix: structure changes 
| * | | a2bf5c7 | 2026-04-02 20:25:58 | docs: deleted stray file 
| * | | 9e18aa4 | 2026-04-02 20:24:26 | Refactor code structure for improved readability and maintainability 
* | | | a90732b | 2026-04-02 18:49:07 | Merge pull request #49 from UniOfGreenwich/feat/fixes 
|\| | | 
| * | | c49d3e5 | 2026-04-02 18:28:31 | fixed coupons port 
| * | | f5af004 | 2026-04-02 18:08:24 | more fixes 
* | | | fe307b8 | 2026-04-02 08:30:49 | Merge pull request #48 from UniOfGreenwich/feat/fixes 
|\| | | 
| * | | 81545fc | 2026-04-02 08:27:50 | Fixed:functioning 
|/ / /  
* | |   1c25ddf | 2026-04-02 02:52:03 | Merge pull request #47 from UniOfGreenwich/feat/coupons 
|\ \ \  
| |/ /  
|/| |   
| * |   978e0f3 | 2026-04-02 02:44:49 | Merge branch 'main' into feat/coupons  (origin/feat/coupons)
| |\ \  
| |/ /  
|/| |   
* | |   fcb10d5 | 2026-03-20 15:47:05 | Merge pull request #44 from UniOfGreenwich/feature/unified-backend 
|\ \ \  
* \ \ \   2ae3e91 | 2026-03-18 00:36:40 | Merge pull request #43 from UniOfGreenwich/feature/unified-backend 
|\ \ \ \  
| | | * | 19a26f6 | 2026-04-02 02:16:44 | Fix:removed pycache 
| | | * | 77391c0 | 2026-03-16 06:04:34 | Coupons 
| | | * | d1e7c3d | 2026-03-12 19:30:48 | feat(auth): integrate sqlite database and flask authentication endpoints  (origin/feature/login-validation)
| | | | | *   868aefd | 2026-03-31 14:52:17 | WIP on feature/unified-backend: ddf462a ui: updated skeleton cards  (refs/stash)
| | | |_|/|\  
| | |/| | | | 
| | | | | | * c7be773 | 2026-03-31 14:52:17 | untracked files on feature/unified-backend: ddf462a ui: updated skeleton cards 
| | | | | * 217d674 | 2026-03-31 14:52:17 | index on feature/unified-backend: ddf462a ui: updated skeleton cards 
| | | |_|/  
| | |/| |   
| | * | | ddf462a | 2026-03-20 15:45:21 | ui: updated skeleton cards  (origin/feature/unified-backend, feature/unified-backend)
| | * | | daef315 | 2026-03-20 15:31:21 | auth: persist search query state through signup redirect flow 
| | * | | 4594ce1 | 2026-03-20 15:30:02 | auth: persist search query state through login redirect flow 
| | * | | fa048c8 | 2026-03-20 15:29:54 | ui: dropdown update 
| | * | | e505d59 | 2026-03-20 15:29:26 | ui: polish product details layout and ai review data handling 
| | * | | 9caaa06 | 2026-03-20 15:29:14 | ui: overhaul filter modal with hybrid price search and store filtering 
| | * | | 0e0f73f | 2026-03-20 15:28:49 | backend: implement ironclad price interceptor and native serpapi params 
| | * | | 0126355 | 2026-03-20 15:28:32 | backend: update search endpoint to support min/max price params 
| | * | | f97fb43 | 2026-03-18 00:49:44 | fix: prevent duplicate search history entries caused by React Strict Mode 
| |/ / /  
| * | | b73d5fa | 2026-03-18 00:05:18 | feat: implement persistent user registration 
| * | | b989bb1 | 2026-03-18 00:05:08 | feat: connect search results to port 8000 and user history 
| * | | 51e0a69 | 2026-03-18 00:04:51 | feat: update auth logic to use FastAPI and save user email 
| * | | 4cce155 | 2026-03-18 00:04:31 | feat: replace dummy data with real backend history fetch 
| * | | afb1a83 | 2026-03-18 00:04:01 | fix: update AI review endpoint to unified backend port 
| * | | 0b54155 | 2026-03-17 20:24:42 | refactor: update user repository for optional type hinting 
| * | | e6f861a | 2026-03-17 20:24:28 | feat: update DB models for Python 3.9 compatibility 
| * | | 797989c | 2026-03-17 20:24:04 | feat: implement unified FastAPI backend with AI search routes 
| * | | a25f7b4 | 2026-03-17 20:23:46 | chore: update backend dependencies for FastAPI and AI 
|/ / /  
* | |   ad12800 | 2026-03-17 18:53:08 | Merge pull request #38 from UniOfGreenwich/feature/database 
|\ \ \  
| * | | 0fa32e7 | 2026-03-17 18:39:16 | chore: full git cache flush to drop database  (origin/feature/database, feature/database)
| * | | e7e4881 | 2026-03-13 16:55:36 | Remove Python cache files 
| * | | 2b11c89 | 2026-03-13 15:41:56 | Update .gitignore for python 
| * | | 89b63fc | 2026-03-13 15:19:04 | Merge main into feature/database witout touching extract.py 
| |\| | 
| * | | b848fed | 2026-03-13 14:23:55 | implement signup and product link storage with FastAPI backend 
| * | | e15435b | 2026-03-08 13:15:46 | Fix authentication flow and verify DB/login endpoints 
| * | | 9b289e1 | 2026-03-08 12:14:08 | Implemented database schema and authentication lookup (Step 2 & 3). Added SQLAlchemy models and login verification. 
| * | | bc81fff | 2026-03-02 20:20:41 | Database schema implemented and verified with proof endpoint 
* | | |   6a28ac6 | 2026-03-14 12:52:04 | Merge pull request #39 from UniOfGreenwich/feature/frontend-search-filter 
|\ \ \ \  
| |_|/ /  
|/| | |   
| * | | 17d59cf | 2026-03-14 12:45:11 | feat(search): integrate live API scraping and client-side glassmorphism filters  (origin/feature/frontend-search-filter)
|/ / /  
* | |   920fedf | 2026-03-12 14:54:16 | Merge pull request #35 from UniOfGreenwich/feat/frontend-2 
|\ \ \  
| * | | e9bec3b | 2026-03-12 14:52:10 | perf: implement lazy loading for AI scores, add skeleton UI, and fix modal z-index  (origin/feat/frontend-2, feat/frontend-2)
* | | | 1b2ead0 | 2026-03-11 17:19:32 | Merge pull request #34 from UniOfGreenwich/feat/frontend-2 
|\| | | 
| |_|/  
|/| |   
| * | 37df0e1 | 2026-03-11 17:15:35 | feat: UI polish and dynamic AI trust/rating integration for comparison 
* | | d4f8be4 | 2026-03-10 21:22:26 | Merge pull request #33 from UniOfGreenwich/feat/frontend-2 
|\| | 
| * | 050ee97 | 2026-03-10 21:19:16 | feat: wire up auth pages to backend and add navigation keys 
| * | 4421402 | 2026-03-10 21:17:55 | feat: add skeleton loaders and global page transitions 
* | | b387e35 | 2026-03-10 11:26:13 | Merge pull request #32 from UniOfGreenwich/feat/frontend-2 
|\| | 
| * | bde290f | 2026-03-10 11:22:18 | style: major UI changes for History.tsx and minor routing changes 
| * | bff6396 | 2026-03-10 11:21:14 | style: major UI changes for Signup.tsx and implement routing state 
| * | b2eee9a | 2026-03-10 02:24:12 | feat: standardised Login UI and implement seamless auth state persistence 
| * | 71a60b6 | 2026-03-10 00:47:47 | style: major UI overhaul for Details.tsx 
| * | aa80cb1 | 2026-03-10 00:47:17 | style: major UI overhaul for Results.tsx 
| * | f5ff3d8 | 2026-03-10 00:19:10 | style: major UI overhaul for Home.tsx and global styles 
|/ /  
* |   0ef8ccd | 2026-03-09 21:19:54 | Merge pull request #31 from UniOfGreenwich/feat/search-engine  (feat/frontend)
|\ \  
| * | c90838f | 2026-03-09 21:17:55 | feat: Upgraded search pipeline, caching, and Amazon routin  (origin/feat/search-engine, feat/search-engine)
* | | c411c3b | 2026-03-09 18:35:21 | Merge pull request #29 from UniOfGreenwich/feat/search-engine 
|\| | 
| * | 65c4307 | 2026-03-09 01:06:44 | Feat:workflow established 
| * |   92a7d0a | 2026-03-09 00:20:03 | Resolved merge conflicts from main 
| |\ \  
| |/ /  
|/| |   
* | |   56251f7 | 2026-03-08 17:42:17 | Merge pull request #27 from UniOfGreenwich/feature/home-page-profile-popUp-screen 
|\ \ \  
| * | | e5f7c54 | 2026-03-08 17:22:55 | feat(ui): replicate profile popover on results screen  (origin/feature/home-page-profile-popUp-screen)
| * | | 7bc6ff8 | 2026-03-08 17:18:25 | feat(ui): implement profile popover and personalized greeting on home screen 
* | | |   a415723 | 2026-03-08 15:36:57 | Merge pull request #26 from UniOfGreenwich/connection 
|\ \ \ \  
| * \ \ \   af9e358 | 2026-03-08 15:35:21 | Merge branch 'main' into connection  (origin/connection)
| |\ \ \ \  
| |/ / / /  
|/| | | |   
* | | | |   f591c06 | 2026-03-08 15:17:27 | Merge pull request #25 from UniOfGreenwich/feature/history-page 
|\ \ \ \ \  
| | |/ / /  
| |/| | |   
| * | | | a79e7e8 | 2026-03-08 15:13:07 | feat(history): build search history UI and establish routing (mock data)  (origin/feature/history-page)
|/ / / /  
* | | |   99332bd | 2026-03-08 14:50:47 | Merge pull request #23 from UniOfGreenwich/feature/signup-page 
|\ \ \ \  
| * \ \ \   9405956 | 2026-03-08 14:50:30 | Merge branch 'main' into feature/signup-page  (origin/feature/signup-page)
| |\ \ \ \  
| |/ / / /  
|/| | | |   
* | | | |   fe01f22 | 2026-03-08 10:40:45 | Merge pull request #22 from UniOfGreenwich/chore/comment-updates 
|\ \ \ \ \  
| * | | | | 26df5d1 | 2026-03-08 10:38:30 | chore: clean up file comments  (origin/chore/comment-updates, chore/comment-updates)
* | | | | |   25bce88 | 2026-03-08 03:31:38 | Merge pull request #17 from UniOfGreenwich/link-extraction 
|\ \ \ \ \ \  
| |/ / / / /  
|/| | | | |   
| * | | | | 8554ab3 | 2026-03-03 21:43:54 | Fix:Naming  (origin/link-extraction)
| * | | | | 7332504 | 2026-03-03 21:40:48 | fix:syntax error 
| * | | | | f21778c | 2026-03-03 21:39:35 | feat:Amazon link analysis 
| * | | | | 81535c3 | 2026-03-01 23:00:29 | feat:features and specs  (link-extraction)
| * | | | | bfb147e | 2026-03-01 22:46:34 | feat:features and specs 
| * | | | | b0206a2 | 2026-03-01 21:34:05 | feat:SERPAPI test 
| * | | | | 0119c29 | 2026-03-01 00:39:24 | Feat:Link-analysis 
| | |_|_|/  
| |/| | |   
| | * | | 8c2de40 | 2026-03-08 14:44:16 | resloving merge conflict issues 
| | * | | 4382db5 | 2026-03-08 14:36:40 | Merge main into feat/signup 
| | * | | ec18918 | 2026-03-08 14:08:21 | feat(auth): integrate complete signup flow with forced terms validation 
| | | * | d16492d | 2026-03-08 05:06:43 | fix:removed sensitive info 
| | | * | 05c7c81 | 2026-03-08 05:05:07 | git ignore 
| | | * | 101600d | 2026-03-08 04:50:21 | remove package.json 
| | | * | 843404f | 2026-03-08 04:47:48 | Feat:Connection between backend and frontend 
| |_|/ /  
|/| | |   
* | | |   d9be7e9 | 2026-03-08 01:45:03 | Merge pull request #21 from UniOfGreenwich/feat/product-details 
|\ \ \ \  
| * | | | 7671509 | 2026-03-08 01:35:54 | feat: backend ready Details Page with python integration  (origin/feat/product-details, feat/product-details)
* | | | |   41fbd0d | 2026-03-08 01:41:01 | Merge pull request #20 from UniOfGreenwich/feat/results-page 
|\ \ \ \ \  
| |/ / / /  
|/| | | |   
| * | | | 665c66d | 2026-03-08 01:25:35 | feat: backend ready Results Page layout  (origin/feat/results-page, feat/results-page)
| * | | | 2e29dd7 | 2026-03-07 22:25:02 | feat: build out discovery view and navigation state handling 
| | |/ /  
| |/| |   
* | | |   e182017 | 2026-03-07 23:37:21 | Merge pull request #19 from UniOfGreenwich/feat/frontend 
|\ \ \ \  
| * \ \ \   6c3ae5b | 2026-03-07 22:47:37 | fix: correct localStorage typo and resolve conflicts  (origin/feat/frontend)
| |\ \ \ \  
| |/ / / /  
|/| | | |   
* | | | |   0331264 | 2026-03-07 21:11:50 | Merge pull request #18 from UniOfGreenwich/frontend-vez767 
|\ \ \ \ \  
| * | | | | df22ab7 | 2026-03-07 21:09:04 | feat(auth): implement signup ui with terms modal and tailwind styling 
| * | | | | afc8844 | 2026-03-07 21:02:54 | feat(auth): add signup route and link from login handoff 
| | |/ / /  
| |/| | |   
* | | | |   e24ff44 | 2026-03-03 10:58:45 | Merge pull request #8 from UniOfGreenwich/feat/frontend 
|\ \ \ \ \  
| |_|_|/ /  
|/| | | |   
| | | * | b46174a | 2026-03-07 22:03:31 | feat: upgraded Home and Login logic with persistent Auth and History access 
| | | * | d632a0f | 2026-03-07 22:01:45 | refactor: upgraded app routing and finalised core entry points 
| | |/ /  
| | * / 11c8a36 | 2026-03-07 13:27:08 | feat: complete Home and Login UI with Tailwind setup 
| |/ /  
| * | 06f77e4 | 2026-03-01 01:38:10 | feat: implement login routing, and set root gitignore 
| * | 8b2d467 | 2026-02-27 20:35:55 | feat: implement dark mode UI and styled search bar 
| * | 8f7602f | 2026-02-27 18:22:24 | feat: setup routing and home UI 
| * | e73e63f | 2026-02-27 08:15:20 | chore: move requirements to dedicated docs branch 
| * | 10e56f4 | 2026-02-25 18:36:08 | test: initial setup working 
| * | aef42e7 | 2026-02-25 17:39:57 | docs: add initial requirements draft and project structure 
| * | 853d465 | 2026-02-25 16:59:13 | feat: configure vite and tsconfig, successfully launch dev server 
|/ /  
| * 831c6e4 | 2026-03-07 21:25:05 | feat: upgrade search logic with real time AI-driven product analysis 
| * 8ec022e | 2026-03-04 12:51:27 | feat: add UK shopping search engine 
|/  
* 7cf73b9 | 2026-02-03 12:37:02 | Revert "Add initial functional and non-functional requirements" 
* a3e5746 | 2026-02-03 12:36:54 | Revert "Delete .github/backend/requirments.md" 
* b37a6f9 | 2026-02-03 12:36:48 | Revert "Add initial functional and non-functional requirements" 
* 7bbede4 | 2026-02-03 12:36:11 | Revert "Add backlog tasks and refine requirements" 
* aaf9be8 | 2026-02-03 11:50:44 | Add backlog tasks and refine requirements 
* a6776fe | 2026-02-03 11:49:46 | Add initial functional and non-functional requirements 
* 4663c4f | 2026-02-03 11:48:01 | Delete .github/backend/requirments.md 
* b34546e | 2026-02-03 11:45:17 | Add initial functional and non-functional requirements 
* 6b6c156 | 2026-01-27 13:07:05 | Add HIVE full stack starter 
* 8c109bd | 2026-01-13 11:29:03 | Setting up GitHub Classroom Feedback 
* 21c6c5a | 2026-01-13 11:29:03 | GitHub Classroom Feedback  (origin/feedback)
* d01a048 | 2025-12-18 10:50:29 | Initial commit 
</details>