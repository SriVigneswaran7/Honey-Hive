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

---

## 3. Engineering Judgement & Trade-offs

During functional testing, we encountered architectural decisions that required weighing performance against complexity:

1. **Client-Side vs. Server-Side Filtering:** * *Observation (FCT-04):* We currently perform price and store filtering purely on the client side inside `Results.tsx` (`filteredProducts = products.filter(...)`).
   * *Trade-off:* This results in zero latency for the user when adjusting filters, making the UI feel incredibly responsive. However, the limitation is that if we eventually scale to fetching hundreds of products, fetching them all at once will bloat the initial payload. For our current scope (aggregating ~6-10 results per scrape), client-side filtering is the optimal engineering choice.
2. **Local Storage for Session Management:**
   * *Observation (FCT-03):* We rely on `localStorage.getItem('isLoggedIn')` to manage frontend routing guards.
   * *Trade-off:* While this is highly performant and stateless, it is technically susceptible to simple manipulation (a user manually setting the key in DevTools). Since our backend endpoints (like `/auth/history`) still validate the actual user email before returning sensitive data, we accepted this frontend limitation to keep the architecture streamlined and avoid the overhead of implementing HTTP-only refresh cookies for this coursework prototype.