# Requirements

## 1. Project Overview
This project is a web-based application that allows users to paste a product URL from a supported online retailer.  
The system extracts product information, compares prices across alternative retailers, identifies available discounts, and presents a simplified review sentiment summary to support informed purchasing decisions.

---

## 2. Assumptions and Scope
- The system will support a limited number of predefined retail websites agreed by the team.
- The application will not attempt to bypass paywalls, CAPTCHAs, or anti-bot protections.
- Coupon discovery will rely on publicly available sources and may not guarantee results for all products.
- Review analysis will provide a lightweight sentiment summary rather than a full machine-learning solution.
- The system is intended as a proof-of-concept, not a commercial-grade product.

---

## 3. Functional Requirements (FR)

| ID | Requirement Name | Description | Priority | Acceptance Criteria |
|----|-----------------|-------------|----------|---------------------|
| FR-01 | Product URL Input | The system must provide a text input field where users can paste a product URL from a supported retailer. | High | User can submit a valid URL; empty or malformed URLs return a clear error message. |
| FR-02 | Product Data Extraction | The backend must extract the product name, price, and key specifications from the provided URL. | High | For supported retailers, the system returns product name, price, and at least three specifications. |
| FR-03 | Price Comparison | The system must retrieve prices for identical or similar products from at least three alternative retailers. | High | Comparison results include retailer name, price, and a clickable product link. |
| FR-04 | Coupon Detection | The system should search for and display active discount codes or promotional links related to the product or retailer. | Medium | If available, at least one valid discount is displayed; otherwise, a “No discounts found” message is shown. |
| FR-05 | Review Sentiment Summary | The system should provide a summarized sentiment overview of user reviews in the form of pros and cons. | Medium | Output includes a sentiment score and 2–4 bullet-pointed pros and cons, or a clear fallback message if unavailable. |
| FR-06 | Results Presentation | The frontend must display comparison results in a clean, readable, and filterable table. | High | Users can sort or filter results by price and retailer and access external links. |
| FR-07 | Error Handling | The system must handle unsupported retailers, broken links, or scraping failures without crashing. | High | The user receives an informative error message and can submit a new URL. |

---

## 4. Non-Functional Requirements (NFR)

| ID | Requirement Name | Description | Priority | Acceptance Criteria |
|----|------------------|-------------|----------|---------------------|
| NFR-01 | Performance | The system should return results within a reasonable response time under normal conditions. | Medium | At least 80% of valid requests complete within 10 seconds during testing. |
| NFR-02 | Security | All communication between frontend and backend must be secured using HTTPS/TLS. | High | The application rejects unencrypted HTTP requests in deployment. |
| NFR-03 | Scalability | The backend architecture must support adding new retailers with minimal changes. | Medium | New retailers can be integrated by adding a new scraper module without modifying core logic. |
| NFR-04 | Reliability | The system must remain stable during invalid inputs or partial backend failures. | High | Scraping or API failures return structured error responses without system crashes. |

---

## 5. Initial Traceability Notes
- FR-01 and FR-06 relate directly to frontend user interface components.
- FR-02 to FR-05 map to backend services and external data sources.
- FR-07 and NFR-04 address system robustness and user experience during failure scenarios.
- NFR-02 and NFR-03 support long-term maintainability and deployment considerations.
