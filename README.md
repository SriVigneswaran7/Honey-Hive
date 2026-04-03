# 🍯 HoneyHive

Smart price comparison for UK shoppers. Paste a product URL or type a search — HoneyHive finds the best deals across the web, surfaces AI-generated insights, rates seller trust, and hunts for discount codes.

![Python](https://img.shields.io/badge/Python-3.11+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite)

---

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
- [Contributors](#contributors)
- [License](#license)

---

## About the Project

Online shoppers in the UK often waste time checking multiple websites manually to find the best price for a product. HoneyHive automates this end-to-end.

A user pastes a product URL (from Amazon, Currys, Argos, Temu, or any retailer) or types a product name. HoneyHive extracts the product details, searches for competing listings across UK retailers, generates an AI-powered technical review, rates seller trustworthiness, and attempts to find active discount codes — all in one place.

It is built for UK consumers who want to shop smarter without jumping between tabs.

---

## Features

- Accepts both product URLs and plain text searches
- Extracts product title, price, and image from any retailer link
- Compares prices across up to 6 UK retailers via Google Shopping
- Filters results by minimum and maximum price
- Generates AI product summaries, pros, and cons using Google Gemini
- Rates each seller as High, Moderate, or Low trust
- Finds and ranks active discount codes for the detected store
- Saves search history for logged-in users
- Supports dark mode with system preference detection

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router v7
- **Backend:** FastAPI, SQLAlchemy, Uvicorn
- **Database:** SQLite
- **AI & Search:** Google Gemini 2.5 Flash, SerpAPI (Google Shopping, Amazon, Google Organic)
- **Scraping:** BeautifulSoup4, Playwright
- **Auth:** passlib (PBKDF2-SHA256 password hashing)
- **Version Control:** Git & GitHub

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- A SerpAPI account and API key — [serpapi.com](https://serpapi.com)
- A Google Gemini API key — [aistudio.google.com](https://aistudio.google.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/honeyhive.git
cd honeyhive

# --- Backend ---
cd backend
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows
pip install -r requirements.txt
playwright install chromium
cp .env.example .env            # then add your API keys

# --- Frontend ---
cd ../frontend
npm install --legacy-peer-deps
cp .env.example .env            # then set VITE_API_URL=http://localhost:8000
```

---

## Usage

```bash
# Start the backend (from the backend/ folder)
uvicorn app.main:app --reload

# Start the frontend in a separate terminal (from the frontend/ folder)
npm run dev
```

Open `http://localhost:5173` in your browser.

On first run the backend automatically creates the SQLite database and seeds a demo account:

```
Email:    demo@honeyhive.local
Password: DemoPass123!
```

---

## Screenshots



---

## Project Structure

```
honeyhive/
│
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app and all API routes
│   │   ├── models.py         # SQLAlchemy ORM models
│   │   ├── search.py         # SerpAPI search, AI insights, trust scoring
│   │   ├── extract.py        # Universal product URL extraction
│   │   ├── coupons.py        # Coupon finder and ranker
│   │   ├── auth_service.py   # Login authentication logic
│   │   ├── security.py       # Password hashing
│   │   ├── config.py         # Environment variable config
│   │   ├── db.py             # Database engine and session
│   │   ├── deps.py           # FastAPI dependency injection
│   │   ├── users_repo.py     # User database queries
│   │   └── seed.py           # Demo user seeding on startup
│   ├── .env.example
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Root component and routing
│   │   ├── Home.tsx          # Landing page and search bar
│   │   ├── Results.tsx       # Comparison results grid
│   │   ├── Details.tsx       # AI review and coupon detail page
│   │   ├── Comparison.tsx    # Side-by-side comparison view
│   │   ├── Filters.tsx       # Price filter controls
│   │   ├── History.tsx       # User search history dashboard
│   │   ├── Login.tsx         # Login page
│   │   ├── Signup.tsx        # Signup page
│   │   ├── Coupons.tsx       # Coupon display component
│   │   └── Help.tsx          # User guide page
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── .gitignore
├── README.md
└── SystemModelling.md
```

---

## Contributors

Name 1 – Role
Name 2 – Role
Name 3 - Role
Name 4 - Role
Brahemrifi9 - Documentation Lead

---

## License

This project is submitted as coursework for **ELEE1149** at the University of Greenwich. All rights reserved unless otherwise stated.
