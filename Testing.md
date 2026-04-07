## Feature Testing: AI-Assisted Unified Search & Extraction

### 1. Feature Overview
The **Unified Search & Extraction Engine** is the core functional component of the HoneyHive platform. It spans the frontend UI (`Results.tsx`, `Home.tsx`) and the backend API (`extract.py`, `search.py`). 

This feature handles user inputs (either raw text or direct URLs), leverages the Gemini AI to parse context, attempts direct DOM scraping, and utilizes a SerpAPI fallback chain if anti-bot protections are encountered. Finally, it aggregates comparative pricing data.

### 2. Testing Methodology
Due to the highly volatile nature of external web scraping (where DOM structures change and anti-bot measures adapt), strict automated unit testing on the scraping functions leads to brittle, "flaky" tests. 

Therefore, our testing approach for this feature relies on **Integration Testing** and **Structured Manual End-to-End (E2E) Testing**. We specifically test the *resilience of the fallback chains* and the *boundary enforcement* of the price filters.

### 3. Structured Test Cases

#### 3.1. Positive Path Testing (Happy Paths)

| Test ID | Scenario | Input / Action | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FT-01** | Standard Text Query | Search: `"Sony WH-1000XM5"` | `parse_input()` cleans the text; `unified_search()` returns a JSON array of competitor products. | API returns 6 results; UI renders product cards successfully. | ✅ Pass |
| **FT-02** | Direct URL Extraction | Search: `https://www.currys.co.uk/products/asus-vivobook-s16-oled-s3607ca-16-laptop-pc-intel-core-ultra-5-1-tb-ssd-silver-10284282.html` | `fetch_url_title()` extracts the title from the `<title>` tag; comparative search runs based on the extracted string. | Original item is pinned at the top; competitors are appended. | ✅ Pass |
| **FT-03** | Price Boundary Constraints | Search: `"PS5"`, Min: `300`, Max: `400` | The `unified_search` loop strictly ignores any scraped results where `parsed_price < 300` or `parsed_price > 400`. | All returned results are strictly between £300 and £400. | ✅ Pass |

### 3.2. Negative Path & Fallback Testing (Edge Cases)

| Test ID | Scenario | Input / Action | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FT-04** | Anti-Bot Block (Fallback Failure) | Search URL: `https://www.temu.com/nl-en/a-stylish-yet--shirt-featuring...` (Temu Product) | `universal_scrape()` encounters a 403 block. `serpapi_search_fallback` is triggered and successfully extracts the JSON data. | Both the direct scrape and SerpAPI fallback failed to resolve the highly dynamic Temu URL, resulting in missing product data. | ❌ Fail |
| **FT-05** | Total Extraction Failure | Search URL of an offline or un-scrapable obscure domain. | Both `universal_scrape` and `serpapi_search_fallback` fail. `extract.py` catches the final exception and parses the URL slug. | UI displays the item with "Check Site" as the price, preventing a 500 Server Error. | ✅ Pass |
| **FT-06** | Invalid / Nonsense Input | Search: `"asdfghjkl123"` | Gemini AI fails to parse meaning; Google Search returns 0 shopping results. | API returns `[]`. UI gracefully displays a "No deals found" state. | ✅ Pass |
| **FT-07** | Inverted Price Logic | Min: `500`, Max: `100` | Frontend (`Filters.tsx`) or Backend should handle the logical error gracefully. | The dataset returns empty `[]` because no price can satisfy both conditions simultaneously. | ✅ Pass |

### 4. Engineering Judgement & Trade-offs
During the testing of this feature, several critical software engineering trade-offs were identified and managed:

1. **Scraping Timeouts:** * *Issue:* The `requests` module in `universal_scrape` could hang indefinitely if a retailer's server is unresponsive.
   * *Resolution:* A strict `timeout=5` parameter was enforced. If a store fails to respond within 5 seconds, the test confirms the system gracefully abandons that specific scrape rather than freezing the user's request.
2. **AI Rate Limiting:** * *Issue:* Rapid, concurrent testing of FT-01 triggered `429 Too Many Requests` errors from the Gemini API in `search.py`.
   * *Resolution:* Implemented a `time.sleep(0.5)` buffer in the AI request cycle and developed a regex-based fallback to clean strings locally if the AI fails.
3. **Data Type Parsing:** * *Issue:* Retailers format prices differently (e.g., `£1,200.00`, `1200`, `£1200`).
   * *Resolution:* Testing revealed sorting errors. The implementation was updated to strictly strip `£` and `,` characters, casting the result to a `float` before applying `min_price` and `max_price` logic.

# Functional Testing: User Flows & Application State


## 1. Overview
While Feature Testing evaluated the core Python scraping engine, **Functional Testing** validates the system's business logic, user interface state management, and frontend-to-backend API integrations. 

This testing phase ensures that the React/TypeScript frontend (routing, context, local storage) interacts correctly with the FastAPI backend and provides a seamless, error-tolerant experience for the user.

## 2. Test Cases

### 2.1. Authentication & Security Flows
These tests validate the logic in `auth_service.py`, `security.py`, and the frontend `Login.tsx` / `Signup.tsx` components.

| Test ID | Scenario | Input / Action | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FCT-01** | Valid User Signup | Fill `Signup.tsx` form with valid email and matching passwords; accept terms. | Backend hashes password (`pbkdf2_sha256`); creates `User` and `UserProfile` records; UI redirects to login/home. | Record created successfully; user redirected. | ✅ Pass |
| **FCT-02** | Invalid Login Handling | Enter incorrect password in `Login.tsx`. | Backend returns `AuthResult(False, "Invalid password")`. UI displays a red error popup. | Error popup appears and automatically unmounts after exactly 3000ms. | ❌ Failed |
| **FCT-03** | Protected Route Access | Navigate to `/history` without being logged in (`localStorage.isLoggedIn !== 'true'`). | `useEffect` hook intercepts the render and forces a redirect to the Home or Login page. | User is immediately redirected to `/` via `react-router-dom`. | ✅ Pass |

### 2.2. Product Filtering & UI State
These tests validate the derived state logic inside `Results.tsx` and `Filters.tsx`.

| Test ID | Scenario | Input / Action | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FCT-04** | Client-Side Price Filtering | Open Filter Modal, set `minPrice` to £100 and `maxPrice` to £200. Apply. | `filteredProducts` state updates immediately without triggering a new backend API call. Items outside range vanish. | Array filters correctly; UI reflects the exact subset of products. | ✅ Pass |
| **FCT-05** | UI Theme Persistence | Click the Sun/Moon icon in the Navigation bar; refresh the page. | Toggles the `dark` class on the `documentElement`. The choice is saved to `localStorage.theme` and applied on page reload (`App.tsx`). | Dark mode persists perfectly across full page reloads and routing. | ✅ Pass |

### 2.3. "Battle Mode" Comparison & AI Trust
Validating the integration between `Comparison.tsx` and the `/api/trust` endpoint.

| Test ID | Scenario | Input / Action | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FCT-06** | Array Length Constraints | Click the "+" button on 3 different products in `Results.tsx`. | The state array strictly enforces a length of 2. Adding a 3rd item removes the oldest item from the array (FIFO). | Array maintains exactly 2 items; UI prevents over-cluttering. | ✅ Pass |
| **FCT-07** | AI Trust Evaluation | Open Compare Modal with two distinct stores (e.g., "Amazon" and "UnknownTech"). | UI enters a loading state (`isComparingLoading`); API calls Gemini to evaluate trust; returns JSON mapping of 'High', 'Moderate', or 'Low'. | UI dynamically renders green/amber/red trust badges based on AI payload. | ✅ Pass |

### 2.4. Live Coupon Engine
Validating the `Coupons.tsx` modal and clipboard APIs.

| Test ID | Scenario | Input / Action | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FCT-08** | No Coupons Found | Click "Find Discount Codes" on a store with no active codes. | Modal displays a loading spinner, then degrades gracefully to a "No codes found right now" message instead of an empty list. | Graceful UI degradation works correctly. | ✅ Pass |
| **FCT-09** | Clipboard API Execution | Click "Copy" on a fetched discount code inside the modal. | `navigator.clipboard.writeText` executes; button turns green and text changes to "Copied!"; reverts after 2 seconds. | Code copies to system clipboard; UI feedback works perfectly. | ✅ Pass |
| **FCT-10** | Live Coupon Scraper (OOM) | Execute coupon search via UI in the live deployment (Render). | Playwright engine exceeds 512MB free-tier RAM limit; triggers an Out-Of-Memory (OOM) crash. | UI handles API timeout gracefully; accepted constraint to maintain zero-cost hosting for prototype. | ⚠️ Env Limit |

---

## 3. Engineering Judgement & Trade-offs

During functional testing, we encountered architectural decisions that required weighing performance against complexity:

1. **Client-Side vs. Server-Side Filtering:** * *Observation (FCT-04):* We currently perform price and store filtering purely on the client side inside `Results.tsx` (`filteredProducts = products.filter(...)`).
   * *Trade-off:* This results in zero latency for the user when adjusting filters, making the UI feel incredibly responsive. However, the limitation is that if we eventually scale to fetching hundreds of products, fetching them all at once will bloat the initial payload. For our current scope (aggregating ~6-10 results per scrape), client-side filtering is the optimal engineering choice.
2. **Local Storage for Session Management:**
   * *Observation (FCT-03):* We rely on `localStorage.getItem('isLoggedIn')` to manage frontend routing guards.
   * *Trade-off:* While this is highly performant and stateless, it is technically susceptible to simple manipulation (a user manually setting the key in DevTools). Since our backend endpoints (like `/auth/history`) still validate the actual user email before returning sensitive data, we accepted this frontend limitation to keep the architecture streamlined and avoid the overhead of implementing HTTP-only refresh cookies for this coursework prototype.
3. **Live Deployment Coupon Scraper Constraints:**
   * *Observation (FCT-10):* The automated coupon scraper fails to execute in the live deployment environment, despite functioning perfectly during local development.
   * *Trade-off:* The custom headless browser engine (Playwright) requires significant system resources to spin up Chromium instances, navigate Client-Side Rendering (CSR), and bypass cookie banners. Our live backend is deployed on a Render free-tier instance, which imposes a strict 512 MB RAM limit. This hard constraint leads to out-of-memory (OOM) crashes when the heavy scraping process is triggered. We accepted this limitation to maintain zero-cost cloud hosting for the coursework prototype, prioritizing a free, accessible demonstration of the core architecture over upgrading to a paid tier for full live environment parity.
# Security Testing & Vulnerability Assessment

## 1. Overview

The Security Testing phase evaluates the HoneyHive platform against common web application vulnerabilities, guided by the principles of the OWASP Top 10. Given that the system processes user credentials, search histories, and interacts with third-party AI and scraping services, ensuring robust protection of data flows and backend logic is essential.

This phase focuses on validating:

* **Authentication and access control mechanisms**
* **Injection attack prevention (e.g., SQL Injection)**
* **API boundary enforcement and request validation**
* **Server-side request handling risks (e.g., SSRF)**
* **Third-party dependency vulnerabilities (Software Supply Chain Security)**
* **Rate limiting and brute-force protection**

---

## 2. Structured Test Cases

| Test ID | Scenario | Input / Action | Expected Result | Actual Result & Resolution | Status | 
| :--- | :--- | :--- | :--- | :--- | :--- | 
| **ST-01** | SQL Injection (SQLi) Prevention | Enter `' OR 1=1 --` in email and `DROP TABLE users;` in password | Backend should treat input as plain text and prevent query manipulation | **Pass.** SQLAlchemy ORM parameterised queries successfully prevented execution of injected SQL. | ✅ Pass | 
| **ST-02** | Secure Password Storage | Register user with password `MySecret123!` and inspect database | Password must not be stored in plaintext | **Pass.** Password stored as a salted `pbkdf2_sha256` hash (~87 chars), ensuring strong cryptographic protection. | ✅ Pass | 
| **ST-03** | Insecure Direct Object Reference (IDOR) | Request `/auth/history?email=<other_user_email>` | Backend should validate ownership and reject unauthorized access | **Fail.** JWT authentication was removed due to Vercel deployment conflicts. Endpoint currently lacks subject validation, allowing cross-user data access. | ❌ Fail | 
| **ST-04** | API Key Exposure Prevention | Inspect frontend build and network traffic | API keys must remain server-side only | **Pass.** `GEMINI_API_KEY` and `SERPAPI_KEY` are securely stored in backend environment variables. | ✅ Pass | 
| **ST-05** | Dependency Vulnerability Scan | Run `npm audit` on frontend dependencies | No high/critical vulnerabilities | **Initial Fail.** ReDoS vulnerability in `picomatch`. **Resolved** via `npm audit fix`. | ✅ Pass (Fixed) | 
| **ST-06** | Sub-dependency Security Handling | Resolve `esbuild` vulnerability without breaking Vite build | Maintain secure dependency tree without breaking app | **Initial Fail.** Fix required breaking upgrade. **Resolved** using `overrides` in `package.json`. | ✅ Pass (Fixed) | 
| **ST-07** | Server-Side Request Forgery (SSRF) | Inject URL via `/api/search?q=https://webhook.site/<id>` and `/api/search?q=http://127.0.0.1` | Backend should block or sanitise external/internal URL requests | **Partial Fail.** Outbound requests were triggered (confirmed via webhook), indicating SSRF. However, internal access attempts failed or fell back to safe logic, and no sensitive data was exposed. | ⚠️ Partial | 
| **ST-08** | Rate Limiting & Brute-Force Protection | Send 50+ rapid automated login requests to `/auth/login` with invalid credentials | Backend should throttle requests and return `HTTP 429 Too Many Requests` | **Fail.** No rate limiting is enforced on the authentication endpoints. The server processed all requests without restriction. | ❌ Fail |

---

## 3. Engineering Judgement & Trade-offs

Security engineering requires balancing protection, usability, and development constraints. The following design decisions reflect these trade-offs:

### 3.1 ORM-Based Query Protection

* **Observation (ST-01):** The application uses SQLAlchemy ORM instead of raw SQL queries.
* **Judgement:** This abstraction inherently mitigates SQL Injection risks by enforcing parameterised queries, eliminating the need for manual sanitisation logic.

### 3.2 IDOR Vulnerability (Critical Risk)

* **Observation (ST-03):** The `/auth/history` endpoint allows users to retrieve data using an arbitrary email parameter.
* **Issue:** JWT authentication was initially implemented but had to be removed due to deployment conflicts and compatibility issues with the Vercel hosting environment. Consequently, the backend does not currently validate a user's authenticated identity against the requested email.
* **Impact:** This results in unauthorized cross-user data access, representing a **high-severity access control flaw**.
* **Trade-off:** Fixing this requires implementing a Vercel-compatible authentication mechanism and strict server-side authorization checks across all protected routes. Due to project scope constraints and the deployment blockers encountered, this has been documented as a known critical issue.

### 3.3 Server-Side Request Forgery (SSRF)

* **Observation (ST-07):** The `/api/search` endpoint processes user input containing URLs and passes it directly into a scraping function (`requests.get()`).
* **Validation:** Outbound requests were successfully triggered and captured using webhook testing, confirming SSRF behaviour.
* **Impact Analysis:**
  * External requests can be triggered by user input.
  * Internal probing (e.g., `127.0.0.1`) is partially possible.
  * No direct sensitive data exposure due to limited HTML parsing.
  * No cloud metadata endpoints present (reducing severity).
* **Conclusion:** This represents a **Low–Medium severity vulnerability** in the current architecture, with the potential to escalate significantly if raw responses are returned in future features, the app is deployed in a cloud environment, or internal services are introduced.
* **Trade-off:** Allowing flexible URL-based search improves user experience but introduces risk due to insufficient input validation.

### 3.4 CORS Configuration & CSRF Risk

* **Observation:** The backend uses:

  ```python
  allow_origins=["*"]