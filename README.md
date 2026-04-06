# HoneyHive
*A decoupled full-stack architecture leveraging Large Language Models (LLMs) and automated browser orchestration for real-time market data synthesis and multi-retailer price optimisation.*

## Live Deployment
[![Live Demo](https://img.shields.io/badge/Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://honey-hive-frontend.vercel.app/)
[![API Status](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://honey-hive-api.onrender.com)

> **Note:** **Click the badges above** to access the live environments. Alternatively, you can use these direct links: [Live Demo (Vercel)](https://honey-hive-frontend.vercel.app/) | [API (Render)](https://honey-hive-api.onrender.com). 
> 
> The backend is hosted on a Render free instance. If the site has been inactive, the initial request may require up to 30-50 seconds to "spin up" the server.

### HoneyHive Tech Stack

**![Frontend](https://img.shields.io/badge/Frontend-Client-blue?style=for-the-badge&logo=window-maximize&logoColor=white)**
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5.2-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_5.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**![Backend](https://img.shields.io/badge/Backend-Server-red?style=for-the-badge&logo=server&logoColor=white)**
![Python](https://img.shields.io/badge/Python_3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite_3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

**![Data & AI](https://img.shields.io/badge/Data_&_AI-Intelligence-purple?style=for-the-badge&logo=google-cloud&logoColor=white)**
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)
![SerpApi](https://img.shields.io/badge/SerpApi-556AEC?style=for-the-badge&logo=google&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [AI Usage & Reflection](#ai-usage--reflection)
- [System Requirements & Specifications](#system-requirements--specifications)
- [Architecture & System Modelling](#architecture--system-modelling)
- [Git Workflow & Version Control](#git-workflow--version-control)
- [Testing Strategy & Quality Assurance](#testing-strategy--quality-assurance)
- [Release Changelog](#release-changelog)
- [Contributors](#contributors)
- [License](#license)

## About the Project

**What the project does?**
HoneyHive is a full-stack web application designed to streamline the online shopping experience. It aggregates live product data, enforces strict user-defined budgets, generates professional technical verdicts, and autonomously scrapes the web for valid discount codes.

**Why it exists (problem it solves)?**
Modern comparison sites are often bloated with fake or expired coupons, unverified reviews, and sponsored listings that ignore your actual budget. Honey-Hive bypasses these limitations by using generative AI to provide instant, unbiased pros and cons, while a custom headless-browser engine hunts for active voucher codes hidden behind modern Client-Side Rendering (CSR) layers.

**Who it’s for?**
Deal hunters, budget-conscious consumers, and tech-savvy shoppers who want absolute clarity and the best possible value without manually checking dozens of retail websites.

## Features

- **Live Search & Deal Aggregation:** Queries Google Shopping data in real-time to normalise market prices across UK retailers.
- **Intelligent Price Interceptor:** A custom server-side engine that strictly enforces user budget parameters (minimum and maximum limits) before data reaches the client.
- **AI-Powered Product Analysis:** Integrates the Google Gemini 2.5 Flash LLM to generate instant, structured technical verdicts, pros, cons, and vendor trust scores.
- **Battle Mode:** A side-by-side comparison interface allowing users to evaluate technical specifications, prices, and AI trust scores to find the absolute best deal.
- **Persistent User Vault:** Secure authentication system using FastAPI and SQLite that saves search history and tracked deals across sessions.

## Tech Stack

- **Frontend:** React 19 / Vite / TypeScript / Tailwind CSS
- **Backend:** Python 3.9+ / FastAPI / SQLAlchemy / Uvicorn
- **Database:** SQLite (Local Development)
- **Version Control:** Git & GitHub
- **APIs & Tools:** Google Gemini API, SerpApi, Playwright, BeautifulSoup4

## Getting Started

### Prerequisites

- Node.js v18 or higher
- Python v3.9 or higher
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/elee1149-courswork-2025-hive.git

# Navigate to the project folder
cd elee1149-courswork-2025-hive

# 1. Backend Setup
cd backend
python -m venv venv

# Activate the virtual environment
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

# Install Python dependencies and Playwright browsers
pip install -r requirements.txt
playwright install chromium

# Set up Backend Environment Variables
cp app/.env.example app/.env
# Open app/.env and insert your SERPAPI_KEY and GEMINI_API_KEY

# 2. Frontend Setup
cd ../frontend
npm install --legacy-peer-deps

# Set up Frontend Environment Variables
cp .env.example .env
```

### Usage

To run the application locally, you will need two separate terminal windows.

**Terminal 1 (Backend Server):**
```bash
# Ensure you are in the backend directory with your venv activated
cd backend
python run.py
```
*(The FastAPI server will start on http://localhost:8000)*

**Terminal 2 (Frontend Server):**
```bash
# Ensure you are in the frontend directory
cd frontend
npm run dev
```
*(The React application will be available at http://localhost:5173)*

## Screenshots

| Home Screen | Playbook | Results Screen |
| :---: | :---: | :---: |
| ![Search Interface](assets/Home.png) | ![Comparison View](assets/Help.png) | ![Coupon Scraper](assets/Results.png) |
| **Details Screen** | **Login and Sign-Up** | **History Screen** |
| ![Price Interceptor](assets/Details.png) | ![Gemini Verdict](assets/Auth.png) | ![Saved Deals](assets/History.png) |
| **Battle Mode** | **Coupons Modal** | **Filters Modal** |
| ![Mobile View](assets/Comparison.png) | ![UI Theme](assets/Coupons.png) | ![Safe States](assets/Filters.png) |

### Project Structure

```text
elee1149-courswork-2025-hive/
│
├── backend/                # Python/FastAPI Application
│   ├── app/                # API routes, database models, and scraper logic
│   ├── honeyhive.db        # SQLite Database
│   ├── requirements.txt    # Backend dependencies
│   └── run.py              # Backend entry point
│
├── frontend/               # React/Vite Application
│   ├── src/                # UI Components, Views, and Styling
│   ├── index.html          # HTML entry point
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.js  # UI Theme configuration
│
├── CHANGELOG.md            # Version history and semantic commits
├── Requirements.md         # Requirements Specification
├── SystemModelling.md      # UML diagrams & Architectural decisions
├── Workflow.md             # Development workflow and SDLC lifecycle
├── GenAIReflection.md      # Detailed AI usage reflection and prompt log
└── README.md               # Project README
```

## AI Usage & Reflection

Some parts of this project were developed with the help of AI tools (e.g., Google Gemini). All AI-generated content was reviewed, modified where necessary, and has been appropriately cited.

A detailed critical reflection, including representative prompts, evaluation of AI suggestions, encountered limitations, and the influence on our software engineering decision-making, can be found in the dedicated documentation file:

**[View GenAI Reflection](./GenAIReflection.md)**

## System Requirements & Specifications

This project adheres to strict functional and non-functional requirements to ensure a robust and scalable architecture. The documentation outlines the core user stories, use cases, and the hybrid extraction and redirection logic powering the HoneyHive platform.

**[View Requirements Specification](./Requirements.md)**

---

## Architecture & System Modelling

To bridge the gap between concept and implementation, comprehensive system modelling was conducted prior to development. This document details the architectural design, system context mapping, and database schema models that dictate the decoupled data flow between the React frontend and FastAPI backend.

**[View System Modelling](./SystemModelling.md)**

---

## Git Workflow & Version Control

Maintaining a clean and traceable codebase is critical for effective team collaboration. Our version control strategy documents the strict branching protocols, pull request review requirements, and continuous integration standards utilised to prevent deployment conflicts.

**[View Git Workflow](./Workflow.md)**

---

## Testing Strategy & Quality Assurance

Ensuring the security and reliability of the HoneyHive platform is a primary objective. This document outlines our QA protocols, automated testing frameworks, and the specific mitigation strategies implemented to resolve critical application vulnerabilities discovered during the development lifecycle.

**[View Testing Strategy](./Testing.md)**

---

## Release Changelog

A meticulous record of all structural changes, feature merges, and bug fixes is maintained to provide full traceability of the software's evolution from initial scaffolding to final production deployment.

**[View Release Changelog](./CHANGELOG.md)**

## Contributors

| Contributor | Student ID | Contribution |
| :--- | :--- | :--- |
| **SriVigneswaran7** | 001419849 | Built the complete React frontend and integrated the SQLite persistence layer. Developed the core backend search engine, orchestrating real-time data via SerpApi and Gemini AI. Managed dual-environment routing for deployment  and directed the end-to-end SDLC documentation-finalising all requirements, system models, Git workflows, and release changelogs. |
| **[Teammate 2 Name]** | | Developed the backend extraction logic and Playwright coupon engine. Built the Coupons UI. Authored the Testing Strategy, and resolved application vulnerabilities. |
| **[Teammate 3 Name]** | | Designed and implemented the FastAPI database schema, persistence layer, and SQLAlchemy models for user authentication and history tracking. |
| **vez767** | 001416539 | Contributed to initial UI prototyping for History and Sign-Up screens. Developed early client-side sorting logic and assisted with frontend-backend integration scaffolding for the said screens. |
| **brahemrifi9** | 001390181 | Assisted with initial drafts of System Modelling and context generation for the project README. |

## License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.
