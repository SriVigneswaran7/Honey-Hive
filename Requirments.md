## Update: Requirements Refinement (from team discussion)

### Functional Requirements (FR)

| ID | Requirement Name | Description | Priority | Acceptance Criteria |
|---|---|---|---|---|
| FR-01 | URL Input | Provide a text input field for users to paste a product URL. | High | Submitting empty/invalid URL shows validation error. |
| FR-02 | URL Validation | Validate that the pasted link is well-formed and from a supported retailer. | High | Unsupported retailer returns a clear message; app remains usable. |
| FR-03 | Product Extraction | Extract product title, price, image URL, and key features/specs from a supported product page. | High | Response contains title + price + image + >=3 features (when available). |
| FR-04 | Price Comparison | Find and list prices for identical/similar products from at least 3 alternative retailers. | High | Results show >=3 offers (or “not found”), each with retailer name, price and link. |
| FR-05 | Keyword Search | Allow searching for products by keywords (not only by URL). | Medium | Keyword search returns a list of matching products with links. |
| FR-06 | Coupon Discovery | Search for and display discount codes or promo links where available. | Medium | If no codes found, show “No discounts found”. |
| FR-07 | Review Summary | Provide a simple pros/cons summary and optional sentiment score from reviews (if accessible). | Medium | Output includes pros/cons bullets or “No review data available”. |
| FR-08 | Results UI | Display comparison results in a clean, filterable table view. | High | User can sort/filter by price and click outbound links. |
| FR-09 | Authentication | Provide login/signup features if user accounts are enabled (optional scope). | Low/Optional | User can create account, log in/out; otherwise feature is removed from scope. |
| FR-10 | Help & Settings | Provide a basic help/info screen and UI settings (e.g., dark mode). | Low | Help page exists; dark mode toggle persists for session/user. |

### Non-Functional Requirements (NFR)

| ID | Requirement Name | Description | Priority | Acceptance Criteria |
|---|---|---|---|---|
| NFR-01 | Performance | For supported sites, processing should usually complete within 10 seconds. | Medium | 80% of requests complete <=10s in test runs. |
| NFR-02 | Reliability | Invalid URLs and scraping failures must not crash the app. | High | Failures return structured error + UI displays message; app stays responsive. |
| NFR-03 | Security: Input Sanitisation | User input (URLs, keywords) must be sanitised/validated before use. | High | URL/keyword validation blocks obvious malicious inputs and logs errors safely. |
| NFR-04 | Security: Web App Protections | System should mitigate common web vulnerabilities (XSS, SQL injection). | High | User input is escaped/parameterised; no raw SQL concatenation. |
| NFR-05 | Data Storage | Store user submissions (e.g., URLs) and past comparison results for caching and history. | Medium | Submissions can be saved and retrieved; caching reduces repeat processing. |
| NFR-06 | Extensibility | Retailer-specific extraction must be modular to add new sites easily. | Medium | New retailer added as a module without rewriting core logic. |
| NFR-07 | Communication | Frontend/backend communication must use a clear API contract and structured JSON responses. | High | API endpoints documented; consistent response schema for success/failure. |

### Notes on Scope Control
- Authentication (FR-09) is **optional** and should only be included if time allows.
- Review summary (FR-07) is best treated as **best-effort** due to data access constraints.
