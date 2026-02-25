# Requirements Specification: Honey-Hive

## 1. Functional Requirements (FR)
| ID | Category | Requirement Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-01** | Input Handling | The system shall provide a text input field for users to paste a product URL for processing. | High |
| **FR-02** | Data Scraping | The Python backend shall extract the product name, price, and specs from the provided URL. | High |
| **FR-03** | Market Comparison | The system shall query at least 3 alternative retailers for identical or similar products. | High |
| **FR-04** | Coupon Discovery | The app shall search for and display active discount codes or promo links for the specific product. | Medium |
| **FR-05** | Review Analysis | The system shall provide a summarized "Sentiment Score" (Pros/Cons) based on aggregated user reviews. | Medium |
| **FR-06** | UI/UX Display | The JavaScript frontend shall render the comparison data in a clean, filterable table format. | High |

## 2. Non-Functional Requirements (NFR)
| ID | Category | Requirement Description | Priority |
| :--- | :--- | :--- | :--- |
| **NFR-01** | Performance | The "Link to Result" processing time must not exceed 10 seconds. | Medium |
| **NFR-02** | Security | All data interchange between the frontend and backend must be encrypted via HTTPS/TLS. | High |
| **NFR-03** | Scalability | The backend architecture shall allow for new retail sites to be added via modular scrapers. | Medium |
| **NFR-04** | Reliability | The system shall handle "Invalid URL" errors gracefully without crashing the web app. | High |

## 3. User Requirements (UR)
| ID | Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **UR-01** | Product Submission | The user must be able to paste a URL from a supported retail site into a central search bar. | High |
| **UR-02** | Automated Extraction | The system must automatically extract and display the product title, image, price, and specs. | High |
| **UR-03** | Price Comparison | The system must search for the same product across at least 3 other retail platforms and list their prices. | High |
| **UR-04** | Review Summarization| The system should provide a summarized "Sentiment Analysis" based on customer reviews. | Medium |
| **UR-05** | Discount Detection | The system must search for and display applicable promo codes or active discounts for the product. | Medium |
| **UR-06** | Responsive Dashboard | The user must see all comparison data on a single dashboard that works on both mobile and desktop. | High |
| **UR-07** | Error Handling | The system must notify the user if a link is broken, unsupported, or if no alternatives were found. | High |

## 4. Technical Implementation Workflow (Image Handling Example)
| Step | Component | Action |
| :--- | :--- | :--- |
| **Extraction** | Python (Scraper) | Identifies the `src` attribute of the main product image tag. |
| **Transfer** | JSON / API | Passes the image URL string from the server to the browser. |
| **Rendering** | JavaScript/React | Sets the `src` attribute of an `<img>` tag in the HTML. |