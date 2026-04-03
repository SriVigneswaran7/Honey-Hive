# Version Control & Workflow Strategy

This document outlines the Git workflow, branching strategy, and commit conventions used during the development of Honey-Hive.

## 1. Commit Conventions
[cite_start]We utilized the **Conventional Commits (v1.0.0)** standard to maintain a readable and automated history[cite: 174].
* `feat:` - A new feature
* `fix:` - A bug fix
* `refactor:` - Code changes that neither fix a bug nor add a feature
* `docs:` - Documentation updates

## 2. Project Evolution (Commit Graph)
*Expand the section below to view the complete Git log of our team's active development phase, demonstrating parallel feature branching, structured merges, and consistent integration into the `main` branch.*

<details>
<summary><b>Click to expand full 160-commit history graph</b></summary>

```text
*   commit d56bfc2fe6a06da40ad0d488a6a19c40f705bbb5 (HEAD -> main, origin/main, origin/HEAD)
|\  Merge: 88f0b70 0b6d312
| | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | Date:   Fri Apr 3 12:33:57 2026 +0100
| | 
| |     Merge pull request #55 from UniOfGreenwich/feat/help-modal
| |     
| |     fix: correct React hook ordering in history component
| | 
| * commit 0b6d3127b7b0af96fab4bcffd5fdd19ff2cc2311 (origin/feat/help-modal, feat/help-modal)
| | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | Date:   Fri Apr 3 12:31:38 2026 +0100
| | 
| |     refactor: changed the states
| | 
* | commit 88f0b7091d48d8abe4130fd3549336ce2b29f7f9
|\| Merge: e629428 6fe74e2
| | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | Date:   Fri Apr 3 11:53:44 2026 +0100
| | 
| |     Merge pull request #54 from UniOfGreenwich/feat/help-modal
| |     
| |     feat: production deployment setup
| | 
| * commit 6fe74e26d8ef103f8afadf941b5b5f948896b687
| | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | Date:   Fri Apr 3 05:20:19 2026 +0100
| | 
| |     fix: vercel deployment and react 19 dependency conflicts
| | 
| * commit 083faecb9da45aea2b215e47ced61650bfb09f86
| | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | Date:   Fri Apr 3 04:14:26 2026 +0100
| | 
| |     hore: connect frontend to live Render API
| | 
| * commit d9e91f78c513348f05a74736e67561718a7dedc9
| | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | Date:   Fri Apr 3 03:53:49 2026 +0100
| | 
| |     chore: update requirements for playwright scraper
| |   
* |   commit e629428370833d4576ba704a040421b5d9728265
|\ \  Merge: 69ad5bf cffdae2
| | | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | | Date:   Fri Apr 3 05:45:15 2026 +0100
| | | 
| | |     Merge pull request #53 from UniOfGreenwich/docs-readme
| | |     
| | |     docs: document hybrid extraction and redirection logic and .gitignore…
| | | 
| * | commit cffdae2040d40d1a999cab233a69fcf71c41500e
|/ /  Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| |   Date:   Fri Apr 3 05:44:28 2026 +0100
| |   
| |       docs: document hybrid extraction and redirection logic and .gitignore update
| | 
* | commit 69ad5bfbe4f8f558bfee60f557cb0be2853d6a0e
|\| Merge: b3d3302 ed7118e
| | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | Date:   Fri Apr 3 03:09:41 2026 +0100
| | 
| |     Merge pull request #52 from UniOfGreenwich/feat/help-modal
| |     
| |     feat: implement interactive playbook guide and modal UI refinements
| | 
| * commit ed7118e7f2c6b8abe4b6d29a744de88cdd36e14e
| | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | Date:   Fri Apr 3 03:06:13 2026 +0100
| | 
| |     feat: implement interactive bento-grid playbook guide
| | 
| * commit 048a86a55c3fe27b939510f59b37ed91e5b00aec
|/  Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
|   Date:   Fri Apr 3 02:37:51 2026 +0100
|   
|       feat: created help modal and fixed exixting modals
|   
*   commit b3d3302c4fae92dfb80615082eab4b51be23e9fb
|\  Merge: c5ab0b9 d9a1d00
| | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | Date:   Fri Apr 3 01:30:01 2026 +0100
| | 
| |     Merge pull request #45 from UniOfGreenwich/system-modelling
| |     
| |     docs: implement industrial-standard system architecture and UML models
| | 
| * commit d9a1d00a568a71e3891d82873fa044a968bc411c (origin/system-modelling, system-modelling)
| | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | Date:   Fri Apr 3 01:27:29 2026 +0100
| | 
| |     docs: Updated SystemModelling.md
| | 
| * commit 86720eb5de172c9b62e23a18cf10e0b9df702980
| | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | Date:   Sun Mar 29 14:30:39 2026 +0100
| | 
| |     Enhance UML diagrams and sequence model
| |     
| |     Updated UML diagrams and sequence model for clarity and accuracy.
| | 
| * commit 2372a9a4608d68d0ce5aa7c1e9d291a3b3a18943
| | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | Date:   Sun Mar 29 05:31:10 2026 +0100
| | 
| |     Enhance UML diagrams and improve descriptions
| |     
| |     Updated UML diagrams and descriptions for clarity and readability.
| | 
| * commit 6215dda678327bb6dc4574c7712544fb081e805e
| | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | Date:   Sun Mar 29 05:20:56 2026 +0100
| | 
| |     Revise Honey-Hive system modelling and architecture
| |     
| |     Updated the Honey-Hive system modelling document to reflect architectural changes and provide a clearer overview of the system's structure and behavior.
| | 
| * commit 5e16f41dd493e2ee6abb6c5b8250d1bc79d83147
| | Author: brahemrifi9 <ib1183z@gre.ac.uk>
| | Date:   Thu Mar 12 21:01:14 2026 +0000
| | 
| |     docs: format system overview and context with markdown
| | 
| * commit 164504a19c9cfc92b58564a0d8e28b2084ab9f1b
| | Author: brahemrifi9 <ib1183z@gre.ac.uk>
| | Date:   Thu Mar 12 20:57:15 2026 +0000
| | 
| |     docs: format system overview and context with markdown
| | 
| * commit 058872e3099167f24b2a71a7cd313cc074248e2e
| | Author: brahemrifi9 <ib1183z@gre.ac.uk>
| | Date:   Thu Mar 12 20:26:56 2026 +0000
| | 
| |     docs: add 3.2 and functional decomposition
| | 
| * commit b469a9c3531e94b31e6ed3e0d6ef75171bda9d5e
| | Author: brahemrifi9 <ib1183z@gre.ac.uk>
| | Date:   Thu Mar 12 20:07:01 2026 +0000
| | 
| |     docs: add high-level system architecture diagram
| | 
| * commit eba4983948d1cc76e8f8ea8cae069cbae54c5e74
| | Author: brahemrifi9 <ib1183z@gre.ac.uk>
| | Date:   Wed Mar 11 12:16:02 2026 +0000
| | 
| |     docs: add system overview
| |   
* |   commit c5ab0b9313027af10b99fa3db7e46956da0a4d21
|\ \  Merge: 8d93125 b84d3b8
| | | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | | Date:   Fri Apr 3 01:20:34 2026 +0100
| | | 
| | |     Merge pull request #46 from UniOfGreenwich/docs-requirements
| | |     
| | |     docs: Add requirements specification for Honey-Hive
| | | 
| * | commit b84d3b8c0153f8190ee5898d21d8542fb2456394 (origin/docs-requirements, docs-requirements)
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Fri Apr 3 01:14:39 2026 +0100
| | | 
| | |     docs: updated Requirements.md
| | |   
| * |   commit 65e581bbd2a7ec83f614248b019ec176f835edce
| |\ \  Merge: 8152c59 fcb10d5
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Tue Mar 31 15:02:49 2026 +0100
| | | | 
| | | |     Merge branch 'main' of https://github.com/UniOfGreenwich/elee1149-courswork-2025-hive into docs-requirements
| | | | 
| * | | commit 8152c59e82de13bd7608fcf2163a4842c275f748
| | | | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | | | Date:   Tue Mar 31 14:50:53 2026 +0100
| | | | 
| | | |     Update requirements for coupon engine and password recovery
| | | | 
| * | | commit 067012576777841ca5e0aadf5da4e2e67a5e5def
| | | | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | | | Date:   Sun Mar 29 05:05:10 2026 +0100
| | | | 
| | | |     Update functional and non-functional requirements
| | | | 
| * | | commit 9ca1880c693517ff4de9378b027a3d18c5d09011
| | | | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | | | Date:   Sun Mar 29 04:53:38 2026 +0100
| | | | 
| | | |     Revise Requirements Specification and Add Traceability Matrix
| | | |     
| | | |     Updated the requirements specification to include an introduction, reorganized functional and non-functional requirements, and added a requirement traceability matrix.
| | | | 
| * | | commit 441a553ec468ba24cc23287e844074a0c7c2baba
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Fri Feb 27 09:29:22 2026 +0000
| | | | 
| | | |     docs: clean branch - removed implementation folders
| | | | 
| * | | commit e950c1ce499ab6a9bc647083f57c0a18e3e16b84
|  / /  Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | |   Date:   Fri Feb 27 09:17:49 2026 +0000
| | |   
| | |       docs: initial requirements specification for Honey-Hive
| | |   
* | |   commit 8d93125ec34c3b40f0d0de4b276f249353970fc0
|\ \ \  Merge: a90732b a7260ff
| | | | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | | | Date:   Fri Apr 3 00:54:04 2026 +0100
| | | | 
| | | |     Merge pull request #50 from UniOfGreenwich/feat/fixes
| | | |     
| | | |     feat: complete AI overhaul, UI polish, and repo restructuring
| | | | 
| * | | commit a7260ff96df60030bda315d30400cdb38de45e1b (origin/feat/fixes, feat/fixes)
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Fri Apr 3 00:46:47 2026 +0100
| | | | 
| | | |     ui: unify glass theme, fix skeleton height, and remove pro tip
| | | | 
| * | | commit b3ca86752989a325a95c945dfdaaef33bec80bac
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Fri Apr 3 00:07:49 2026 +0100
| | | | 
| | | |     feat: created run.py for easier execution of backend
| | | | 
| * | | commit b0e051aba27291d3193a62e4c48490e63a1de090
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Thu Apr 2 23:56:45 2026 +0100
| | | | 
| | | |     feat: optimise AI insights and fix flash routing
| | | | 
| * | | commit 0ba94154ba31fd3e811b5baca9fe6b290d37632f
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Thu Apr 2 23:51:15 2026 +0100
| | | | 
| | | |     fix: resolve modal issues and sync UI components
| | | | 
| * | | commit a66d24d1b65e415d1fabc2bf605475a1b3c4b2aa
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Thu Apr 2 23:51:07 2026 +0100
| | | | 
| | | |     fix: resolve modal issues and sync UI components
| | | | 
| * | | commit f6a33e3a886edb1dc20f2335ba6f861b3d42410f
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Thu Apr 2 21:30:06 2026 +0100
| | | | 
| | | |     chore: cleaned up comments
| | | | 
| * | | commit 50397be9c8b5ce151082715fb88c198e35e06a89
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Thu Apr 2 21:15:12 2026 +0100
| | | | 
| | | |     fix: structure changes
| | | | 
| * | | commit a2bf5c78574f65b63686e70ecb7861acc6af3368
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Thu Apr 2 20:25:58 2026 +0100
| | | | 
| | | |     docs: deleted stray file
| | | | 
| * | | commit 9e18aa4b724e833cba3dbcf604272b3167a62ba4
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Thu Apr 2 20:24:26 2026 +0100
| | | | 
| | | |     Refactor code structure for improved readability and maintainability
| | | | 
* | | | commit a90732bf908338ceaf4a5f171c1f7c87dd4586ba
|\| | | Merge: fe307b8 c49d3e5
| | | | Author: Isaam25 <Isaamimran256@gmail.com>
| | | | Date:   Thu Apr 2 18:49:07 2026 +0100
| | | | 
| | | |     Merge pull request #49 from UniOfGreenwich/feat/fixes
| | | |     
| | | |     more fixes
| | | | 
| * | | commit c49d3e517dca5adacddc878271b7d419a2fd56e4
| | | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | | Date:   Thu Apr 2 18:28:31 2026 +0100
| | | | 
| | | |     fixed coupons port
| | | | 
| * | | commit f5af0042f2afe1a86e66c2c14e92f50c1cf9f838
| | | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | | Date:   Thu Apr 2 18:08:24 2026 +0100
| | | | 
| | | |     more fixes
| | | | 
* | | | commit fe307b880ca2d9ce338014968ce953118a1c754b
|\| | | Merge: 1c25ddf 81545fc
| | | | Author: Isaam25 <Isaamimran256@gmail.com>
| | | | Date:   Thu Apr 2 08:30:49 2026 +0100
| | | | 
| | | |     Merge pull request #48 from UniOfGreenwich/feat/fixes
| | | |     
| | | |     Fixed:functioning
| | | | 
| * | | commit 81545fc33b72c108e994a857708c94e49aac886a
|/ / /  Author: Ketchup256 <Isaamxbox@gmail.com>
| | |   Date:   Thu Apr 2 08:27:50 2026 +0100
| | |   
| | |       Fixed:functioning
| | |   
* | |   commit 1c25ddf3c193da077ce12c37cd257a1b3c3bfe42
|\ \ \  Merge: fcb10d5 978e0f3
| |/ /  Author: Isaam25 <Isaamimran256@gmail.com>
|/| |   Date:   Thu Apr 2 02:52:03 2026 +0100
| | |   
| | |       Merge pull request #47 from UniOfGreenwich/feat/coupons
| | |       
| | |       Coupons
| | |   
| * |   commit 978e0f31c5c0963c413b309692285810c46dcdb7 (origin/feat/coupons)
| |\ \  Merge: 19a26f6 fcb10d5
| |/ /  Author: Isaam25 <Isaamimran256@gmail.com>
|/| |   Date:   Thu Apr 2 02:44:49 2026 +0100
| | |   
| | |       Merge branch 'main' into feat/coupons
| | |   
* | |   commit fcb10d5ee75c9f29927e7f484588f198287d869a
|\ \ \  Merge: 2ae3e91 ddf462a
| | | | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | | | Date:   Fri Mar 20 15:47:05 2026 +0000
| | | | 
| | | |     Merge pull request #44 from UniOfGreenwich/feature/unified-backend
| | | |     
| | | |     Feature/unified backend
| | | | 
| * | | commit ddf462a8a7e7e8878f752367f0b71aac14f6e3de (origin/feature/unified-backend, feature/unified-backend)
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Fri Mar 20 15:45:21 2026 +0000
| | | | 
| | | |     ui: updated skeleton cards
| | | | 
| * | | commit daef3154f23522a7c4942bdcb21110dff2ef2eae
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Fri Mar 20 15:31:21 2026 +0000
| | | | 
| | | |     auth: persist search query state through signup redirect flow
| | | | 
| * | | commit 4594ce184b0289c58ecfa22fa82f659245feab1e
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Fri Mar 20 15:30:02 2026 +0000
| | | | 
| | | |     auth: persist search query state through login redirect flow
| | | | 
| * | | commit fa048c81626c563809cb1ae090f6fda96f14adc5
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Fri Mar 20 15:29:54 2026 +0000
| | | | 
| | | |     ui: dropdown update
| | | | 
| * | | commit e505d5944659b943c03cd4086ce648fd4a2c716a
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Fri Mar 20 15:29:26 2026 +0000
| | | | 
| | | |     ui: polish product details layout and ai review data handling
| | | | 
| * | | commit 9caaa0677300e3b685f95fad18402489f2fa1c6c
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Fri Mar 20 15:29:14 2026 +0000
| | | | 
| | | |     ui: overhaul filter modal with hybrid price search and store filtering
| | | | 
| * | | commit 0e0f73f693700e0c5f51e61557470d1fd2afdca4
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Fri Mar 20 15:28:49 2026 +0000
| | | | 
| | | |     backend: implement ironclad price interceptor and native serpapi params
| | | | 
| * | | commit 012635587e990b761062755ac5cf84f0c30130d0
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Fri Mar 20 15:28:32 2026 +0000
| | | | 
| | | |     backend: update search endpoint to support min/max price params
| | | | 
| * | | commit f97fb431e7acceec9a2427c78cc38a664fe71f6c
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Wed Mar 18 00:49:44 2026 +0000
| | | | 
| | | |     fix: prevent duplicate search history entries caused by React Strict Mode
| | | | 
* | | | commit 2ae3e918bf559362cbf881d70ef7a9d804e631bf
|\| | | Merge: ad12800 b73d5fa
| | | | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | | | Date:   Wed Mar 18 00:36:40 2026 +0000
| | | | 
| | | |     Merge pull request #43 from UniOfGreenwich/feature/unified-backend
| | | |     
| | | |     Feature/unified backend
| | | | 
| * | | commit b73d5fa6653685edb499fdca643fd5efba94f374
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Wed Mar 18 00:05:18 2026 +0000
| | | | 
| | | |     feat: implement persistent user registration
| | | | 
| * | | commit b989bb10de44bf23fb951839b233fe1541189ca6
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Wed Mar 18 00:05:08 2026 +0000
| | | | 
| | | |     feat: connect search results to port 8000 and user history
| | | | 
| * | | commit 51e0a6990eb62661cc55420ff4738bfa1a4e0dcc
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Wed Mar 18 00:04:51 2026 +0000
| | | | 
| | | |     feat: update auth logic to use FastAPI and save user email
| | | | 
| * | | commit 4cce1558ed172aeded06dd77fd45a9b877390273
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Wed Mar 18 00:04:31 2026 +0000
| | | | 
| | | |     feat: replace dummy data with real backend history fetch
| | | | 
| * | | commit afb1a835ab90d628101651f668f328ca8fac3239
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Wed Mar 18 00:04:01 2026 +0000
| | | | 
| | | |     fix: update AI review endpoint to unified backend port
| | | | 
| * | | commit 0b5415566fff9ecbabfc6946544e8f392a82a513
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Tue Mar 17 20:24:42 2026 +0000
| | | | 
| | | |     refactor: update user repository for optional type hinting
| | | | 
| * | | commit e6f861ad8ffcf83045bb8d9f251f95cbb60a5126
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Tue Mar 17 20:24:28 2026 +0000
| | | | 
| | | |     feat: update DB models for Python 3.9 compatibility
| | | | 
| * | | commit 797989c5391272bacfb5ee1d290718170cb38538
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Tue Mar 17 20:24:04 2026 +0000
| | | | 
| | | |     feat: implement unified FastAPI backend with AI search routes
| | | | 
| * | | commit a25f7b4fc30edc672fbf7b61d84ac5cd81515b1e
|/ / /  Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | |   Date:   Tue Mar 17 20:23:46 2026 +0000
| | |   
| | |       chore: update backend dependencies for FastAPI and AI
| | |   
* | |   commit ad128005167ad9d7c87f8fc41cfa1016f0afcdf5
|\ \ \  Merge: 6a28ac6 0fa32e7
| | | | Author: Sri Vigneswaran <sa7543b@greenwich.ac.uk>
| | | | Date:   Tue Mar 17 18:53:08 2026 +0000
| | | | 
| | | |     Merge pull request #38 from UniOfGreenwich/feature/database
| | | |     
| | | |     Feature/database
| | | | 
| * | | commit 0fa32e7cc8368de6bbc860e952688260990af544 (origin/feature/database, feature/database)
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Tue Mar 17 18:39:16 2026 +0000
| | | | 
| | | |     chore: full git cache flush to drop database
| | | | 
| * | | commit e7e4881cef92af8f086a88bbea7cafecc5f708c6
| | | | Author: Hachem512 <hn1990d@gre.ac.uk>
| | | | Date:   Fri Mar 13 16:55:36 2026 +0000
| | | | 
| | | |     Remove Python cache files
| | | | 
| * | | commit 2b11c89647d6a554d0a63a259fb3a4d0f01844c4
| | | | Author: Hachem512 <hn1990d@gre.ac.uk>
| | | | Date:   Fri Mar 13 15:41:56 2026 +0000
| | | | 
| | | |     Update .gitignore for python
| | | |   
| * | |   commit 89b63fc8ba4ee9d01edfae7336fe7e7197b69899
| |\ \ \  Merge: b848fed 920fedf
| | | | | Author: Hachem512 <hn1990d@gre.ac.uk>
| | | | | Date:   Fri Mar 13 15:19:04 2026 +0000
| | | | | 
| | | | |     Merge main into feature/database witout touching extract.py
| | | | | 
| * | | | commit b848fed3d0bc2badb25de31e92f80d60dc27ccf3
| | | | | Author: Hachem512 <hn1990d@gre.ac.uk>
| | | | | Date:   Fri Mar 13 14:23:55 2026 +0000
| | | | | 
| | | | |     implement signup and product link storage with FastAPI backend
| | | | | 
| * | | | commit e15435bf402b57d71fdf2d9785a3d8b03bf914cd
| | | | | Author: Hachem512 <hn1990d@gre.ac.uk>
| | | | | Date:   Sun Mar 8 13:15:46 2026 +0000
| | | | | 
| | | | |     Fix authentication flow and verify DB/login endpoints
| | | | | 
| * | | | commit 9b289e1cedb66a3f9ecf2d751c909f456546e362
| | | | | Author: Hachem512 <hn1990d@gre.ac.uk>
| | | | | Date:   Sun Mar 8 12:14:08 2026 +0000
| | | | | 
| | | | |     Implemented database schema and authentication lookup (Step 2 & 3). Added SQLAlchemy models and login verification.
| | | | | 
| * | | | commit bc81fffb85f8ebf83266aa3f035cb977d2118b8b
| | | | | Author: Hachem512 <hn1990d@gre.ac.uk>
| | | | | Date:   Mon Mar 2 20:20:41 2026 +0000
| | | | | 
| | | | |     Database schema implemented and verified with proof endpoint
| | | | |   
* | | | |   commit 6a28ac685d4ea8d906c47e5978c7749b7f5a3500
|\ \ \ \ \  Merge: 920fedf 17d59cf
| |_|/ / /  Author: vez767 <wa3960f@greenwich.ac.uk>
|/| | | |   Date:   Sat Mar 14 12:52:04 2026 +0000
| | | | |   
| | | | |       Merge pull request #39 from UniOfGreenwich/feature/frontend-search-filter
| | | | |       
| | | | |       feat(search): integrate live API scraping and client-side glassmorphi…
| | | | | 
| * | | | commit 17d59cf7cc444d2ea248dd861215a12412f803e3 (origin/feature/frontend-search-filter)
|/ / / /  Author: vez767 <wa3960f@greenwich.ac.uk>
| | | |   Date:   Sat Mar 14 12:45:11 2026 +0000
| | | |   
| | | |       feat(search): integrate live API scraping and client-side glassmorphism filters
| | | | 
| | * | commit 19a26f642392ab4be9df26271bf68a7fb75668aa
| | | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | | Date:   Thu Apr 2 02:16:44 2026 +0100
| | | | 
| | | |     Fix:removed pycache
| | | | 
| | * | commit 77391c0bac05277a288d185aa9211a06807545b2
| | | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | | Date:   Mon Mar 16 06:04:34 2026 +0000
| | | | 
| | | |     Coupons
| | | | 
| | * | commit d1e7c3dc832997453f5eaf0efef08ca301ebc307 (origin/feature/login-validation)
| |/ /  Author: vez767 <wa3960f@greenwich.ac.uk>
|/| |   Date:   Thu Mar 12 19:30:48 2026 +0000
| | |   
| | |       feat(auth): integrate sqlite database and flask authentication endpoints
| | |   
* | |   commit 920fedffd0486e5265a569b109780873dcac89ac
|\ \ \  Merge: 1b2ead0 e9bec3b
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Thu Mar 12 14:54:16 2026 +0000
| | | | 
| | | |     Merge pull request #35 from UniOfGreenwich/feat/frontend-2
| | | |     
| | | |     perf: lazy load AI trust scores and enhance comparison UI
| | | | 
| * | | commit e9bec3b86eb58a93c0bee4289dd3d22da24a8d30 (origin/feat/frontend-2, feat/frontend-2)
| | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | Date:   Thu Mar 12 14:52:10 2026 +0000
| | | | 
| | | |     perf: implement lazy loading for AI scores, add skeleton UI, and fix modal z-index
| | | | 
* | | | commit 1b2ead0426bb2d2b217c57d502b4176a15a4fce2
|\| | | Merge: d4f8be4 37df0e1
| |_|/  Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
|/| |   Date:   Wed Mar 11 17:19:32 2026 +0000
| | |   
| | |       Merge pull request #34 from UniOfGreenwich/feat/frontend-2
| | |       
| | |       feat: UI polish and dynamic AI trust/rating integration for comparison
| | | 
| * | commit 37df0e1956e4b5ab4f08a842492374c7b0559edd
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Wed Mar 11 17:15:35 2026 +0000
| | | 
| | |     feat: UI polish and dynamic AI trust/rating integration for comparison
| | | 
* | | commit d4f8be4905f8babd876a87b44768faec7142e9a0
|\| | Merge: b387e35 050ee97
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Tue Mar 10 21:22:26 2026 +0000
| | | 
| | |     Merge pull request #33 from UniOfGreenwich/feat/frontend-2
| | |     
| | |     feat: complete authentication flow and global UI/UX polish
| | | 
| * | commit 050ee9701d1577329677987277d5309cd212bb02
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Tue Mar 10 21:19:16 2026 +0000
| | | 
| | |     feat: wire up auth pages to backend and add navigation keys
| | | 
| * | commit 4421402339f984c4a09914e646d90ab51682a95e
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Tue Mar 10 21:17:55 2026 +0000
| | | 
| | |     feat: add skeleton loaders and global page transitions
| | | 
* | | commit b387e35630a1d4ad4489a132f9c7a391c36dfe67
|\| | Merge: 0ef8ccd bde290f
| | | Author: Isaam25 <Isaamimran256@gmail.com>
| | | Date:   Tue Mar 10 11:26:13 2026 +0000
| | | 
| | |     Merge pull request #32 from UniOfGreenwich/feat/frontend-2
| | |     
| | |     feat: comprehensive UI overhaul and seamless auth routing
| | | 
| * | commit bde290f9410697d0592fe58791eb9f77dc874b83
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Tue Mar 10 11:22:18 2026 +0000
| | | 
| | |     style: major UI changes for History.tsx and minor routing changes
| | | 
| * | commit bff6396e4979694bf2e86a1112c20067dff2bf38
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Tue Mar 10 11:21:14 2026 +0000
| | | 
| | |     style: major UI changes for Signup.tsx and implement routing state
| | | 
| * | commit b2eee9a6c932c8877fc8e1b85f1e6ecb06c9a8e3
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Tue Mar 10 02:24:12 2026 +0000
| | | 
| | |     feat: standardised Login UI and implement seamless auth state persistence
| | | 
| * | commit 71a60b61182a2983c368bc899da1503f8489feef
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Tue Mar 10 00:47:47 2026 +0000
| | | 
| | |     style: major UI overhaul for Details.tsx
| | | 
| * | commit aa80cb11473a4eb5d65cd1837de9295b0aee8845
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Tue Mar 10 00:47:17 2026 +0000
| | | 
| | |     style: major UI overhaul for Results.tsx
| | | 
| * | commit f5ff3d8d93d0e9034cf627c99b8e06519b1dd75e
|/ /  Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| |   Date:   Tue Mar 10 00:19:10 2026 +0000
| |   
| |       style: major UI overhaul for Home.tsx and global styles
| |   
* |   commit 0ef8ccd019a8b5c73c96b8dbfdb51c0435f5fa29 (feat/frontend)
|\ \  Merge: c411c3b c90838f
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Mon Mar 9 21:19:54 2026 +0000
| | | 
| | |     Merge pull request #31 from UniOfGreenwich/feat/search-engine
| | |     
| | |     feat: Upgraded search pipeline, caching, and Amazon routin
| | | 
| * | commit c90838f0c4acff57ed5b3a3f5b7d9745b3dedf77 (origin/feat/search-engine, feat/search-engine)
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Mon Mar 9 21:17:55 2026 +0000
| | | 
| | |     feat: Upgraded search pipeline, caching, and Amazon routin
| | | 
* | | commit c411c3bec19b6563a118d628527617a34c5aa670
|\| | Merge: 56251f7 65c4307
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Mon Mar 9 18:35:21 2026 +0000
| | | 
| | |     Merge pull request #29 from UniOfGreenwich/feat/search-engine
| | |     
| | |     Feat/search engine
| | | 
| * | commit 65c430732156fab59f99989c83d7d70ef09893c9
| | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | Date:   Mon Mar 9 01:06:44 2026 +0000
| | | 
| | |     Feat:workflow established
| | |   
| * |   commit 92a7d0a826a265eed32475d66d3e70610c6c4e37
| |\ \  Merge: 831c6e4 56251f7
| |/ /  Author: Ketchup256 <Isaamxbox@gmail.com>
|/| |   Date:   Mon Mar 9 00:20:03 2026 +0000
| | |   
| | |       Resolved merge conflicts from main
| | |   
* | |   commit 56251f761abf3b1e04deaf497dc1475a0b8cbaa0
|\ \ \  Merge: a415723 e5f7c54
| | | | Author: vez767 <wa3960f@greenwich.ac.uk>
| | | | Date:   Sun Mar 8 17:42:17 2026 +0000
| | | | 
| | | |     Merge pull request #27 from UniOfGreenwich/feature/home-page-profile-popUp-screen
| | | |     
| | | |     Feature/home page profile pop up screen
| | | | 
| * | | commit e5f7c54c26ef706ebbaedbb8412be44a77749716 (origin/feature/home-page-profile-popUp-screen)
| | | | Author: vez767 <wa3960f@greenwich.ac.uk>
| | | | Date:   Sun Mar 8 17:22:55 2026 +0000
| | | | 
| | | |     feat(ui): replicate profile popover on results screen
| | | | 
| * | | commit 7bc6ff84546b7b88c1c835a1eb634232646ae70e
| | | | Author: vez767 <wa3960f@greenwich.ac.uk>
| | | | Date:   Sun Mar 8 17:18:25 2026 +0000
| | | | 
| | | |     feat(ui): implement profile popover and personalized greeting on home screen
| | | |   
* | | |   commit a4157233d91e66ab08e5c9930aeb1af29a281479
|\ \ \ \  Merge: f591c06 af9e358
| | | | | Author: vez767 <wa3960f@greenwich.ac.uk>
| | | | | Date:   Sun Mar 8 15:36:57 2026 +0000
| | | | | 
| | | | |     Merge pull request #26 from UniOfGreenwich/connection
| | | | |     
| | | | |     Connection
| | | | |   
| * | | |   commit af9e358654b5e922546f3edeb1451f1d92e918a8 (origin/connection)
| |\ \ \ \  Merge: d16492d f591c06
| |/ / / /  Author: Isaam25 <Isaamimran256@gmail.com>
|/| | | |   Date:   Sun Mar 8 15:35:21 2026 +0000
| | | | |   
| | | | |       Merge branch 'main' into connection
| | | | |   
* | | | |   commit f591c06051946309652eee544f556417598be9ec
|\ \ \ \ \  Merge: 99332bd a79e7e8
| | |/ / /  Author: vez767 <wa3960f@greenwich.ac.uk>
| |/| | |   Date:   Sun Mar 8 15:17:27 2026 +0000
| | | | |   
| | | | |       Merge pull request #25 from UniOfGreenwich/feature/history-page
| | | | |       
| | | | |       feat(history): build search history UI and establish routing (mock data)
| | | | | 
| * | | | commit a79e7e849c86946c59f347ade67fe58d43ae84c3 (origin/feature/history-page)
|/ / / /  Author: vez767 <wa3960f@greenwich.ac.uk>
| | | |   Date:   Sun Mar 8 15:13:07 2026 +0000
| | | |   
| | | |       feat(history): build search history UI and establish routing (mock data)
| | | |   
* | | |   commit 99332bd2f2a6fba5063fdf72d4b990b44e17c05b
|\ \ \ \  Merge: fe01f22 9405956
| | | | | Author: vez767 <wa3960f@greenwich.ac.uk>
| | | | | Date:   Sun Mar 8 14:50:47 2026 +0000
| | | | | 
| | | | |     Merge pull request #23 from UniOfGreenwich/feature/signup-page
| | | | |     
| | | | |     feat(auth): integrate complete signup flow with forced terms validation
| | | | |   
| * | | |   commit 94059567e825fa9cedf86bb295fd413076e5e932 (origin/feature/signup-page)
| |\ \ \ \  Merge: 8c2de40 fe01f22
| |/ / / /  Author: vez767 <wa3960f@greenwich.ac.uk>
|/| | | |   Date:   Sun Mar 8 14:50:30 2026 +0000
| | | | |   
| | | | |       Merge branch 'main' into feature/signup-page
| | | | |   
* | | | |   commit fe01f220eb9d2ad7baa41d0213c6acb04a954743
|\ \ \ \ \  Merge: 25bce88 26df5d1
| | | | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | | | Date:   Sun Mar 8 10:40:45 2026 +0000
| | | | | | 
| | | | | |     Merge pull request #22 from UniOfGreenwich/chore/comment-updates
| | | | | |     
| | | | | |     chore: clean up file comments
| | | | | | 
| * | | | | commit 26df5d1f9ff6d584b3c066131d863df55aba6cb3 (origin/chore/comment-updates, chore/comment-updates)
| | | | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | | | Date:   Sun Mar 8 10:38:30 2026 +0000
| | | | | | 
| | | | | |     chore: clean up file comments
| | | | | |   
* | | | | |   commit 25bce883e0d439c4aef59c6499e400ab50081886
|\ \ \ \ \ \  Merge: d9be7e9 8554ab3
| |/ / / / /  Author: Isaam25 <Isaamimran256@gmail.com>
|/| | | | |   Date:   Sun Mar 8 03:31:38 2026 +0000
| | | | | |   
| | | | | |       Merge pull request #17 from UniOfGreenwich/link-extraction
| | | | | |       
| | | | | |       Link extraction
| | | | | | 
| * | | | | commit 8554ab374a1e58578211485d8ce2cb8632bf47f0 (origin/link-extraction)
| | | | | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | | | | Date:   Tue Mar 3 21:43:54 2026 +0000
| | | | | | 
| | | | | |     Fix:Naming
| | | | | | 
| * | | | | commit 73325043d55c8ca0ecb843a43d90b82cb431ecb4
| | | | | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | | | | Date:   Tue Mar 3 21:40:48 2026 +0000
| | | | | | 
| | | | | |     fix:syntax error
| | | | | | 
| * | | | | commit f21778c17df5d976cbc39cbc9d5e9ab967ffe0e0
| | | | | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | | | | Date:   Tue Mar 3 21:39:35 2026 +0000
| | | | | | 
| | | | | |     feat:Amazon link analysis
| | | | | | 
| * | | | | commit 81535c3336f803796bf1a6875fcce4b1099432de (link-extraction)
| | | | | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | | | | Date:   Sun Mar 1 23:00:29 2026 +0000
| | | | | | 
| | | | | |     feat:features and specs
| | | | | | 
| * | | | | commit bfb147e2842b122e59f4234c16c9fd19deff68bc
| | | | | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | | | | Date:   Sun Mar 1 22:46:34 2026 +0000
| | | | | | 
| | | | | |     feat:features and specs
| | | | | | 
| * | | | | commit b0206a2c119b9ccc333eb80e8492dd6a4846d6c2
| | | | | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | | | | Date:   Sun Mar 1 21:34:05 2026 +0000
| | | | | | 
| | | | | |     feat:SERPAPI test
| | | | | | 
| * | | | | commit 0119c295d8a62dadddd09596d684576a20bce5e8
| | |_|_|/  Author: Ketchup256 <Isaamxbox@gmail.com>
| |/| | |   Date:   Sun Mar 1 00:39:24 2026 +0000
| | | | |   
| | | | |       Feat:Link-analysis
| | | | | 
| | * | | commit 8c2de40bb81a1016adee035439fbb744c58c3058
| | | | | Author: vez767 <wa3960f@greenwich.ac.uk>
| | | | | Date:   Sun Mar 8 14:44:16 2026 +0000
| | | | | 
| | | | |     resloving merge conflict issues
| | | | | 
| | * | | commit 4382db5203d38b2b68902fabe0d10b96617a1db8
| | | | | Author: vez767 <wa3960f@greenwich.ac.uk>
| | | | | Date:   Sun Mar 8 14:36:40 2026 +0000
| | | | | 
| | | | |     Merge main into feat/signup
| | | | | 
| | * | | commit ec18918a35937eda6b0897c78312245fd3aeb81f
| | | | | Author: vez767 <wa3960f@greenwich.ac.uk>
| | | | | Date:   Sun Mar 8 14:08:21 2026 +0000
| | | | | 
| | | | |     feat(auth): integrate complete signup flow with forced terms validation
| | | | | 
| | | * | commit d16492d3900323e1b05b9be7f0e12ad6368f6e4b
| | | | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | | | Date:   Sun Mar 8 05:06:43 2026 +0000
| | | | | 
| | | | |     fix:removed sensitive info
| | | | | 
| | | * | commit 05c7c81c812e16ab03e485f54a29137c6b9516e6
| | | | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | | | Date:   Sun Mar 8 05:05:07 2026 +0000
| | | | | 
| | | | |     git ignore
| | | | | 
| | | * | commit 101600d8af9f87f4cf5ba066b00567503ab1b5e3
| | | | | Author: Ketchup256 <Isaamxbox@gmail.com>
| | | | | Date:   Sun Mar 8 04:50:21 2026 +0000
| | | | | 
| | | | |     remove package.json
| | | | | 
| | | * | commit 843404f00e7e6f54e3949686d31aecf0741df633
| |_|/ /  Author: Ketchup256 <Isaamxbox@gmail.com>
|/| | |   Date:   Sun Mar 8 04:47:48 2026 +0000
| | | |   
| | | |       Feat:Connection between backend and frontend
| | | |   
* | | |   commit d9be7e902503d13b27701ad6d53797478c0bb220
|\ \ \ \  Merge: 41fbd0d 7671509
| | | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | | Date:   Sun Mar 8 01:45:03 2026 +0000
| | | | | 
| | | | |     Merge pull request #21 from UniOfGreenwich/feat/product-details
| | | | |     
| | | | |     feat: product details page UI and python integration
| | | | | 
| * | | | commit 76715096fe0c735d1c974e8d7d237a5d00cfd8de (origin/feat/product-details, feat/product-details)
| | | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | | Date:   Sun Mar 8 01:35:54 2026 +0000
| | | | | 
| | | | |     feat: backend ready Details Page with python integration
| | | | |   
* | | | |   commit 41fbd0d12e65e1dd80c16243fa62c5665d9c9ebd
|\ \ \ \ \  Merge: e182017 665c66d
| |/ / / /  Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
|/| | | |   Date:   Sun Mar 8 01:41:01 2026 +0000
| | | | |   
| | | | |       Merge pull request #20 from UniOfGreenwich/feat/results-page
| | | | |       
| | | | |       feat: implemented backend-ready results page
| | | | | 
| * | | | commit 665c66d6830ad66393ed908f33e03d607500592e (origin/feat/results-page, feat/results-page)
| | | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | | Date:   Sun Mar 8 01:25:35 2026 +0000
| | | | | 
| | | | |     feat: backend ready Results Page layout
| | | | | 
| * | | | commit 2e29dd738b42c7c76cf2d52728c5cceb4ce0c94c
| | |/ /  Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| |/| |   Date:   Sat Mar 7 22:25:02 2026 +0000
| | | |   
| | | |       feat: build out discovery view and navigation state handling
| | | |   
* | | |   commit e182017c53d2aa7ad51dafecc92d78df00a9b487
|\ \ \ \  Merge: 0331264 6c3ae5b
| | | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | | Date:   Sat Mar 7 23:37:21 2026 +0000
| | | | | 
| | | | |     Merge pull request #19 from UniOfGreenwich/feat/frontend
| | | | |     
| | | | |     Refactor: Unify Auth Logic and Resolve Routing Conflicts
| | | | |   
| * | | |   commit 6c3ae5b242fedd62e5f9f89d7ec4d8b91d564492 (origin/feat/frontend)
| |\ \ \ \  Merge: b46174a 0331264
| |/ / / /  Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
|/| | | |   Date:   Sat Mar 7 22:47:37 2026 +0000
| | | | |   
| | | | |       fix: correct localStorage typo and resolve conflicts
| | | | |   
* | | | |   commit 0331264e74936fbdd0c6d1dc3e5f425d52adbf8c
|\ \ \ \ \  Merge: e24ff44 df22ab7
| | | | | | Author: vez767 <wa3960f@greenwich.ac.uk>
| | | | | | Date:   Sat Mar 7 21:11:50 2026 +0000
| | | | | | 
| | | | | |     Merge pull request #18 from UniOfGreenwich/frontend-vez767
| | | | | |     
| | | | | |     signup ui
| | | | | | 
| * | | | | commit df22ab74d445024d966b23720efafc47d6d1cbf5
| | | | | | Author: vez767 <wa3960f@greenwich.ac.uk>
| | | | | | Date:   Sat Mar 7 21:09:04 2026 +0000
| | | | | | 
| | | | | |     feat(auth): implement signup ui with terms modal and tailwind styling
| | | | | | 
| * | | | | commit afc8844ea331e0cdb10555d3b6dae036a27e3799
| | |/ / /  Author: vez767 <wa3960f@greenwich.ac.uk>
| |/| | |   Date:   Sat Mar 7 21:02:54 2026 +0000
| | | | |   
| | | | |       feat(auth): add signup route and link from login handoff
| | | | |   
* | | | |   commit e24ff4476e3155c88a729d301a0cf26a6cbb3d64
|\ \ \ \ \  Merge: 7cf73b9 06f77e4
| |_|_|/ /  Author: Isaam25 <Isaamimran256@gmail.com>
|/| | | |   Date:   Tue Mar 3 10:58:45 2026 +0000
| | | | |   
| | | | |       Merge pull request #8 from UniOfGreenwich/feat/frontend
| | | | |       
| | | | |       Feat/frontend
| | | | | 
| | | * | commit b46174a558d1efb8f8ead6f9e208f33eaaf298ad
| | | | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | | | Date:   Sat Mar 7 22:03:31 2026 +0000
| | | | | 
| | | | |     feat: upgraded Home and Login logic with persistent Auth and History access
| | | | | 
| | | * | commit d632a0f2c72715e0cd01476cf74e5e3a100f42c1
| | |/ /  Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | |   Date:   Sat Mar 7 22:01:45 2026 +0000
| | | |   
| | | |       refactor: upgraded app routing and finalised core entry points
| | | | 
| | * | commit 11c8a3659549676cfb740486ebd6334441df7790
| |/ /  Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | |   Date:   Sat Mar 7 13:27:08 2026 +0000
| | |   
| | |       feat: complete Home and Login UI with Tailwind setup
| | | 
| * | commit 06f77e441f8ca836c691a15a168db222129b9778
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Sun Mar 1 01:38:10 2026 +0000
| | | 
| | |     feat: implement login routing, and set root gitignore
| | | 
| * | commit 8b2d4673f9cc0613b0e3c352b447e4899814592c
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Fri Feb 27 20:35:55 2026 +0000
| | | 
| | |     feat: implement dark mode UI and styled search bar
| | | 
| * | commit 8f7602f58f29b7c058b50188a121ea4729e8cda0
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Fri Feb 27 18:22:24 2026 +0000
| | | 
| | |     feat: setup routing and home UI
| | | 
| * | commit e73e63f3b65bb9eb6e84ba952c91389d06f1a050
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Fri Feb 27 08:15:20 2026 +0000
| | | 
| | |     chore: move requirements to dedicated docs branch
| | | 
| * | commit 10e56f4c25b18a51587efb604b222f8d75436a4f
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Wed Feb 25 18:36:08 2026 +0000
| | | 
| | |     test: initial setup working
| | | 
| * | commit aef42e726fce277b0569d0da1be25124aa40a5bf
| | | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | | Date:   Wed Feb 25 17:39:57 2026 +0000
| | | 
| | |     docs: add initial requirements draft and project structure
| | | 
| * | commit 853d46530ca246de89c177bba0f1c9f354651430
|/ /  Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| |   Date:   Wed Feb 25 16:59:13 2026 +0000
| |   
| |       feat: configure vite and tsconfig, successfully launch dev server
| | 
| * commit 831c6e4af9ffb9f2caf981b2e375181639ad792c
| | Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
| | Date:   Sat Mar 7 21:25:05 2026 +0000
| | 
| |     feat: upgrade search logic with real time AI-driven product analysis
| | 
| * commit 8ec022eb3b6b63b52b4f1c3f0729511b35bfab4b
|/  Author: SriVigneswaran7 <sa7543b@greenwich.ac.uk>
|   Date:   Wed Mar 4 12:51:27 2026 +0000
|   
|       feat: add UK shopping search engine
| 
* commit 7cf73b98ea40ad1492ced4f94ab7130076bd95e9
| Author: Ketchup256 <Isaamxbox@gmail.com>
| Date:   Tue Feb 3 12:37:02 2026 +0000
| 
|     Revert "Add initial functional and non-functional requirements"
|     
|     This reverts commit b34546eac2c7912f9e24edfac5b4bca659e3e8c6.
| 
* commit a3e5746bd643aa01165a1eb6493ef38b01dafb1f
| Author: Ketchup256 <Isaamxbox@gmail.com>
| Date:   Tue Feb 3 12:36:54 2026 +0000
| 
|     Revert "Delete .github/backend/requirments.md"
|     
|     This reverts commit 4663c4fd8ffe5de64fdfad92e96f0549d4a83de1.
| 
* commit b37a6f906201e648c7970218fd1834a04a2d3972
| Author: Ketchup256 <Isaamxbox@gmail.com>
| Date:   Tue Feb 3 12:36:48 2026 +0000
| 
|     Revert "Add initial functional and non-functional requirements"
|     
|     This reverts commit a6776fe21a611e598b7bd377ab7356fef151ce6e.
| 
* commit 7bbede42e139f19e59066145b142299b2023332e
| Author: Ketchup256 <Isaamxbox@gmail.com>
| Date:   Tue Feb 3 12:36:11 2026 +0000
| 
|     Revert "Add backlog tasks and refine requirements"
|     
|     This reverts commit aaf9be8b5067c26e0e2e1e8b9e5ce8269271ace4.
| 
* commit aaf9be8b5067c26e0e2e1e8b9e5ce8269271ace4
| Author: brahemrifi9 <ib1183z@gre.ac.uk>
| Date:   Tue Feb 3 11:50:44 2026 +0000
| 
|     Add backlog tasks and refine requirements
| 
* commit a6776fe21a611e598b7bd377ab7356fef151ce6e
| Author: brahemrifi9 <ib1183z@gre.ac.uk>
| Date:   Tue Feb 3 11:49:46 2026 +0000
| 
|     Add initial functional and non-functional requirements
| 
* commit 4663c4fd8ffe5de64fdfad92e96f0549d4a83de1
| Author: brahemrifi9 <ib1183z@gre.ac.uk>
| Date:   Tue Feb 3 11:48:01 2026 +0000
| 
|     Delete .github/backend/requirments.md
| 
* commit b34546eac2c7912f9e24edfac5b4bca659e3e8c6
| Author: brahemrifi9 <ib1183z@gre.ac.uk>
| Date:   Tue Feb 3 11:45:17 2026 +0000
| 
|     Add initial functional and non-functional requirements
| 
* commit 6b6c1566e3a4a938ad290ee5e8ef751a166a5ee5
| Author: hn1990d <hn1990d@gre.ac.uk>
| Date:   Tue Jan 27 13:07:05 2026 +0000
| 
|     Add HIVE full stack starter
| 
* commit 8c109bddb7e0cdc23cf7175c3626109e6eaea5eb
| Author: github-classroom[bot] <66690702+github-classroom[bot]@users.noreply.github.com>
| Date:   Tue Jan 13 11:29:03 2026 +0000
| 
|     Setting up GitHub Classroom Feedback
| 
* commit 21c6c5a22d6a7cf7ccc80f3ff4eff5733feb3367 (origin/feedback)
| Author: github-classroom[bot] <66690702+github-classroom[bot]@users.noreply.github.com>
| Date:   Tue Jan 13 11:29:03 2026 +0000
| 
|     GitHub Classroom Feedback
| 
* commit d01a048791e3832d7d15180db833ab12663f9abc
  Author: github-classroom[bot] <66690702+github-classroom[bot]@users.noreply.github.com>
  Date:   Thu Dec 18 10:50:29 2025 +0000
  
      Initial commit
</details>
