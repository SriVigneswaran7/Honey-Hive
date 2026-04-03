# Requirements Specification: Honey-Hive

## 1. Introduction & Software Process Model
Honey-Hive is an AI-assisted product comparison platform designed to streamline the deal-hunting process for consumers. To navigate the complexities of integrating third-party APIs alongside AI-generated insights, we adopted an **Iterative and Incremental Development Model**. 

Given the prompt-driven nature of this coursework, an iterative approach was essential. It allowed us to build the core backend architecture first (FastAPI and SerpApi integration), test the outputs, and then progressively layer on complex features like the custom Price Interceptor and the React-based Glassmorphic frontend. This ensured our engineering decisions remained flexible and aligned with our evolving technical constraints.

## 2. Functional Requirements (FR)
Functional requirements define the core behaviour and features the system must provide. To demonstrate sound engineering judgement, these requirements have been categorised using the **MoSCoW** prioritisation technique (Must have, Should have, Could have, Won't have).

| ID | Category | Requirement Description | Priority | Traceability (Implementation) |
| :--- | :--- | :--- | :--- | :--- |
| **FR-01** | Live Search | The system must query the SerpApi (Google Shopping) engine to retrieve and normalise real-time product market data. | Must | `backend/app/search.py`, `frontend/src/Home.tsx` |
| **FR-02** | Strict Filtering | The system must enforce absolute budget limits (Min/Max price) using a custom regex-based **Price Interceptor** to override standard API inaccuracies. | Must | `backend/app/search.py`, `frontend/src/Results.tsx` |
| **FR-03** | AI Data Parsing | The system must leverage the Gemini 2.5 Flash API to extract product specifications and generate summaritive reviews from raw market data. | Must | `backend/app/extract.py`, `frontend/src/Details.tsx` |
| **FR-04** | Battle Mode | The system must provide a side-by-side comparison interface, allowing users to queue products in a persistent state for evaluation. | Must | `frontend/src/Results.tsx`, `frontend/src/Details.tsx` |
| **FR-05** | Authentication | The system must support secure user registration and login using secure database validation and local session state. | Must | `backend/app/auth_service.py`, `frontend/src/Signup.tsx`, `frontend/src/Login.tsx` |
| **FR-06** | History Persistence| The system must automatically save logged-in users' search queries and deal counts to a relational database (SQLite via SQLAlchemy). | Must | `backend/app/main.py`, `frontend/src/History.tsx`, `backend/honeyhive.db` |
| **FR-07** | AI Trust Score | The system should calculate and display a vendor reliability rating to protect users from untrustworthy third-party sellers. | Should | `backend/app/search.py` |
| **FR-08** | Coupon Engine | The system must dynamically scrape live coupon aggregators and use AI to rank promotional codes for the specific product. | Must | `backend/app/discount_scraper.py`, `frontend/src/Coupons.tsx` |
| **FR-09** | User Assistance | The system must provide an accessible Help Screen Modal via the global navigation bar to guide users on platform features. | Must | `frontend/src/Home.tsx` |
| **FR-10** | Password Recovery | The system would allow users to securely reset forgotten passwords via an SMTP email token. | Won't | *Descoped due to time constraints* |
| **FR-11** | Admin Dashboard | The system would include an RBAC dashboard for tracking user metrics. | Won't | *Descoped due to time constraints* |

## 3. Non-Functional Requirements (NFR)
Non-functional requirements dictate the system's quality attributes, performance benchmarks, and architectural constraints.

| ID | Category | Requirement Description | Priority | Traceability |
| :--- | :--- | :--- | :--- | :--- |
| **NFR-01** | Performance | The asynchronous FastAPI backend must process and return standard search payloads in under 5 seconds to prevent user drop-off. | High | `backend/app/main.py` (Uvicorn) |
| **NFR-02** | UX / Interface | The frontend must employ a high-fidelity **Glassmorphic design system** featuring translucent layers, ambient glows, and full Dark/Light mode support. | High | `frontend/tailwind.config.js`, `frontend/src/index.css` |
| **NFR-03** | Visual Stability | The system must completely eliminate layout shifting during data fetches by deploying structured Skeleton Loading (Ghost) component states. | High | `frontend/src/Results.tsx` |
| **NFR-04** | Security | All user passwords must be salted and cryptographically hashed using the `pbkdf2_sha256` algorithm prior to database insertion. | High | `backend/app/security.py` |
| **NFR-05** | Maintainability | The backend codebase must follow a modular, decoupled architecture (separating routing, database models, and external API extraction) to allow for scalable future development. | Medium | `backend/app/models.py`, `backend/app/db.py`, `backend/app/extract.py` |
| **NFR-06** | AI Transparency | In strict compliance with university academic regulations, all code developed with Generative AI assistance must be explicitly cited in the source files and the repository documentation. | High | `README.md` |

## 4. User Requirements (UR)
These represent the system capabilities from the end-user's perspective, guiding our frontend design choices.

| ID | Name | User Goal Description | Priority |
| :--- | :--- | :--- | :--- |
| **UR-01** | Seamless Discovery | As a user, I want to search for a product (e.g., "Sony Headphones") and instantly see a grid of offers from various retailers. | High |
| **UR-02** | Budget Accuracy | As a user, I want to set a maximum price and trust that the system will strictly filter out anything above my budget. | High |
| **UR-03** | Direct Comparison | As a user, I want to select multiple products and place them in a 'Battle Mode' to easily compare their specifications and AI reviews. | High |
| **UR-04** | Data Retention | As a user, I want to be able to log in and view my past search history so I do not lose track of previous deals. | Medium |
| **UR-05** | Savings | As a user, I want the platform to automatically notify me if there is a valid discount code for the item I am looking at. | Medium |

## 5. Requirement Traceability Matrix
To ensure comprehensive testing and to validate that our engineering decisions directly address user needs, the following matrix maps our User Requirements through to functional implementation and verification.

| User Req | Functional Req | Architectural Component | Verification Method (Testing Strategy) |
| :--- | :--- | :--- | :--- |
| **UR-01** | **FR-01, FR-03** | `search.py` Router & `extract.py` Gemini Parser | Integration test simulating a standard search query payload; verify JSON normalisation. |
| **UR-02** | **FR-02** | Python Regex Price Interceptor (`search.py`) | Unit test feeding the interceptor an array of mock products where 50% exceed the `max_price` parameter. |
| **UR-03** | **FR-04** | React State (`Results.tsx`, `Details.tsx`) | End-to-End (E2E) UI test verifying that selected products persist in the UI across user interactions. |
| **UR-04** | **FR-05, FR-06** | SQLAlchemy DB (`models.py`) / Local Session Auth | Automated test verifying that a search query is successfully committed to the SQLite `history` table only if a valid user email match in the database is present. |