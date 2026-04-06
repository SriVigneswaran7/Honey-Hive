# Honey-Hive: GenAI Reflection & Evaluation

## Overview
This document outlines the transparent use, critical evaluation, and integration of Generative AI tools in the development of the Honey-Hive platform. It highlights specific development phases where AI was utilised as an assistive aid, detailing the prompt engineering process, the evaluation of the resulting outputs, and the engineering logic applied when rejecting or heavily modifying AI-generated code to fit the system's architecture.

### Phase 1: Backend Architecture & Data Parsing (Python)

**1. Location:** `backend/app/search.py` (unified_search)
* **Prompt:** "Write a Python script to filter SerpApi shopping results based on a min and max price."
* **Result:** AI provided a script that filtered prices on the client-side using JavaScript after fetching all results.
* **Modification/Rejection:** **Rejected.** The architecture was modified to perform Server-Side filtering (the "Price Interceptor"). The API was forced to append `tbs=mr:1,price:1...` to the SerpApi request to limit payload size and prevent front-end manipulation.

**2. Location:** `backend/app/search.py` (unified_search loop)
* **Prompt:** "How to extract a float from a price string like '£1,200.50'?"
* **Result:** AI suggested `float(price_string.replace('£', ''))`.
* **What was wrong:** The AI failed to handle commas in thousands, which caused application crashes on high-ticket products (e.g., laptops). The codebase was modified to utilise a robust regex: `float(re.sub(r'[^\d.]', '', raw_price))`.

**3. Location:** `backend/app/search.py` (generate_ai_insights)
* **Prompt:** "Parse the JSON response from the Gemini API."
* **Result:** AI provided `json.loads(response.text)`.
* **What was wrong:** Gemini occasionally wraps its JSON output in Markdown blocks (```json ... ```). A custom regex `re.search(r'\{.*\}', text_output, re.DOTALL)` was engineered to safely extract the raw JSON before parsing, preventing runtime crashes.

**4. Location:** `backend/app/search.py` (generate_ai_insights exception block)
* **Prompt:** "How to handle a 429 Too Many Requests error from Gemini?"
* **Result:** AI suggested raising an `HTTPException(status_code=500)` to the frontend.
* **Rejection:** **Rejected.** This breaks the user experience. A "Graceful Degradation" policy was implemented. If AI fails, the backend intercepts the error and returns a generic, formatted fallback summary derived from the URL snippet instead of crashing.

**5. Location:** `backend/app/extract.py` (run_extraction)
* **Prompt:** "Write a regex to extract the Amazon ASIN from a product URL."
* **Result:** AI provided `r'/dp/([A-Z0-9]{10})'`.
* **Modification:** The AI's regex was too narrow and missed alternative Amazon routing formats. The expression was expanded to `r'/(?:dp|gp/product)/([A-Z0-9]{10})'` to ensure maximum compatibility with variable link-sharing formats.

**6. Location:** `backend/app/extract.py` (universal_scrape)
* **Prompt:** "Scrape the product title and image from an e-commerce URL."
* **Result:** AI wrote a script reliant entirely on scraping standard `<h1>` and `<img>` tags.
* **What was wrong:** Modern e-commerce sites use dynamic classes. The scraper was modified to prioritise Open Graph metadata (`og:title`, `og:image`) before falling back to standard DOM tags, increasing extraction accuracy across varied domains.

**7. Location:** `backend/app/extract.py` (run_extraction fallback)
* **Prompt:** "If scraping fails entirely, how can the product name be extracted from the URL?"
* **Result:** AI suggested integrating a heavy NLP (Natural Language Processing) library to analyse the URL text.
* **Rejection:** **Rejected.** This was overly complex for a 5-second timeout window. A lightweight string parsing algorithm was implemented that splits the URL path, isolates the longest hyphenated slug, and formats it into readable text.

**8. Location:** `backend/app/coupons.py` (scrape_coupon_sites_playwright)
* **Prompt:** "Use Playwright to bypass cookie consent banners on coupon sites."
* **Result:** AI suggested clicking a button with the class `.cc-accept`.
* **Modification:** Cookie banners vary significantly across domains. A comprehensive array of 15+ CSS and text-based selectors (e.g., `button:has-text("Accept All")`, `[id*="accept"]`) was engineered to ensure the headless browser was not blocked by UI overlays.

**9. Location:** `backend/app/coupons.py` (clean_codes)
* **Prompt:** "Extract all capitalised words from the HTML that might be discount codes."
* **Result:** AI provided a standard uppercase regex match.
* **What was wrong:** This scraped generic HTML tags and English prepositions (e.g., "THE", "DIV", "SPAN"). A strict `JUNK_CODES` exclusion set and a `MIN_CODE_LENGTH` constraint were implemented to drastically reduce false positives.

**10. Location:** `backend/app/coupons.py` (rank_codes_with_ai)
* **Prompt:** "The Gemini API JSON response for coupon ranking keeps getting cut off. How can this be fixed?"
* **Result:** AI suggested increasing the `maxOutputTokens` parameter.
* **Modification:** Increasing tokens failed to solve the core issue of unpredictable LLM truncation. A string manipulation fallback (`last_complete = text.rfind('},')`) was engineered to cleanly close broken JSON arrays, preserving valid data rather than discarding the entire response.

---

### Phase 2: Database & Authentication (FastAPI/SQLite)

**11. Location:** `backend/app/main.py` (Auth Routes)
* **Prompt:** "Create a secure user authentication system for FastAPI."
* **Result:** AI generated a highly complex JWT (JSON Web Token) system requiring refresh tokens and strict header authorisation.
* **Rejection:** **Rejected.** Testing revealed this caused "Ghost User" hydration mismatches during Vercel-to-Render API calls. The architecture was pivoted to a **Simplified Email-Persistence Model** utilising query parameters, trading unnecessary enterprise complexity for absolute functional reliability.

**12. Location:** `backend/app/db.py` (Database Engine)
* **Prompt:** "Setup SQLAlchemy with an SQLite database for FastAPI."
* **Result:** AI provided standard setup: `create_engine("sqlite:///./test.db")`.
* **What was wrong:** FastAPI handles requests concurrently on different threads, causing SQLite to throw a `ProgrammingError`. The engine initialisation was modified to include `connect_args={"check_same_thread": False}`.

**13. Location:** `backend/app/models.py` (User Table)
* **Prompt:** "If a user is deleted, how should their search history be deleted?"
* **Result:** AI suggested writing a custom Python function to loop through and manually delete related database rows.
* **Modification:** This is inefficient and highly prone to orphan data. The manual route was rejected and SQLAlchemy's native ORM constraints were utilised by adding `cascade="all, delete-orphan"` to the table relationships.

**14. Location:** `backend/app/security.py` (hash_password)
* **Prompt:** "What is the best way to hash passwords in Python?"
* **Result:** AI suggested using the `bcrypt` library.
* **Modification:** `bcrypt` can cause deployment compilation issues on Render due to underlying C-dependencies. The library was swapped for `passlib` implementing the `pbkdf2_sha256` scheme, ensuring seamless cloud deployment without sacrificing cryptographic security.

---

### Phase 3: Frontend UI & State Management (React/TypeScript)

**15. Location:** `frontend/src/Results.tsx` (toggleCompare)
* **Prompt:** "Create a function to add products to a 'Battle Mode' comparison queue."
* **Result:** AI suggested a standard `.push()` array method.
* **What was wrong:** The UI layout breaks if more than two items are compared. The state logic was modified to act as a strict FIFO (First-In, First-Out) queue, slicing the array (`[selectedForCompare[1], product]`) to guarantee a maximum queue length of 2.

**16. Location:** `frontend/src/Results.tsx` (filteredProducts)
* **Prompt:** "Apply store filters and price sorting to the products array."
* **Result:** AI suggested creating two separate `useEffect` hooks that updated multiple state arrays independently.
* **Rejection:** **Rejected.** This caused excessive component re-rendering and layout shifting. A single **Derived State** variable was implemented, utilising chained `.filter().sort()` methods to ensure zero-lag DOM updates.

**17. Location:** `frontend/src/Results.tsx` (fetchProducts)
* **Prompt:** "How can the app be prevented from re-fetching data when navigating back from the Details page?"
* **Result:** AI suggested implementing a complex Global Context API (Redux/Zustand).
* **Modification:** This was deemed over-engineering. `sessionStorage` was utilised with dynamically generated cache keys (`honeyhive_results_${query}`) to temporarily store SerpApi payloads, drastically reducing API load times and bandwidth consumption.

**18. Location:** `frontend/src/Details.tsx` (fetchRecent `useEffect`)
* **Prompt:** "Fetch the user's history from the backend to display in the profile dropdown."
* **Result:** AI placed the API `fetch()` inside a standard `useEffect` that triggered automatically on page mount.
* **Modification:** This wasted bandwidth for users who never opened the menu. `showProfileMenu` was added to the dependency array, establishing a **Lazy Hydration** model that only queries the database upon direct UI interaction.

**19. Location:** `frontend/src/Coupons.tsx` (CouponModal rendering)
* **Prompt:** "Create a centrally positioned popup modal for the discount codes."
* **Result:** AI utilised absolute CSS positioning (`absolute top-1/2 left-1/2`) inside the `<main>` tag.
* **What was wrong:** This caused severe z-index clipping issues against the glassmorphic background layers. The AI's CSS was overridden, and React's `createPortal` was utilised to teleport the modal directly to `document.body`, cleanly bypassing the DOM hierarchy.

**20. Location:** `frontend/src/App.tsx` (Dark Mode Initialisation)
* **Prompt:** "Implement a dark mode toggle based on system preferences."
* **Result:** AI placed the preference check inside the Home component's render cycle.
* **What was wrong:** This caused a harsh "white flash" on initial load for dark-mode users. The logic was shifted to a root-level `useEffect` in `App.tsx` that intercepts the `documentElement.classList` before the UI paints.

**21. Location:** `frontend/src/Login.tsx` (handleLogin redirect)
* **Prompt:** "Redirect the user after a successful login."
* **Result:** AI suggested `Maps('/')` to blindly send users back to the homepage.
* **Modification:** This degraded the user experience if authentication occurred from a specific product page. React Router's `location.state` was implemented to capture the origin point, utilising `Maps(from, { replace: true })` to hand the user seamlessly back to their active search.

---

### Phase 4: DevOps, Infrastructure & SDLC

**22. Location:** `frontend/vite.config.ts`
* **Prompt:** "How to connect a React frontend to a FastAPI backend?"
* **Result:** AI suggested hardcoding `const API_URL = "http://localhost:8000"`.
* **Rejection:** **Rejected.** This logic would immediately fail upon Vercel deployment. `import.meta.env.VITE_API_URL` was implemented alongside dynamic environment variables to ensure 100% Environment Parity between local testing and production clusters.

**23. Location:** `backend/run.py`
* **Prompt:** "Create an entry point script to run Uvicorn."
* **Result:** AI provided `uvicorn.run("app.main:app", port=8000)`.
* **What was wrong:** Cloud hosts like Render inject dynamic port assignments during runtime. Binding to a static port causes the deployment container to fail. The script was modified to use `os.environ.get("PORT", 8000)`.

**24. Location:** `frontend/.npmrc` (Dependency Overrides)
* **Prompt:** "Vercel deployment is failing due to an esbuild and React 19 peer-dependency conflict."
* **Result:** AI suggested downgrading the entire project architecture to React 18.
* **Rejection:** **Rejected.** Downgrading the core library introduces massive technical debt. Instead, a safe supply-chain resolution was forced using an `overrides` configuration in `package.json` to secure the build pipeline without sacrificing the modern technology stack.

**25. Title:** Resolving Git Merge Conflicts
* **Prompt:** "The `main` branch contains outdated logic, but the `docs-readme` branch contains finalised documentation. How should they be merged?"
* **Result:** AI suggested a standard `git merge origin/main --force` which would have destructively overwritten manual documentation work.
* **Modification:** The automated merge strategy was rejected. AI was utilised to identify specific file divergence, and a **Surgical Pull** (`git checkout [branch] -- [file]`) was executed to meticulously stitch gold-standard Python logic into the repository without compromising Markdown assets.

**26. Title:** System Architecture Tooling (Mermaid vs SVG)
* **Prompt:** "Generate UML diagrams for the project documentation."
* **Result:** AI generated heavy Mermaid.js code blocks.
* **Modification:** While accurate, large Mermaid blocks in Markdown files frequently cause GitHub rendering glitches and bloat the text. The AI's structural logic was utilised to independently design and export static, high-fidelity **SVG assets**, ensuring absolute visual stability and a professional aesthetic.