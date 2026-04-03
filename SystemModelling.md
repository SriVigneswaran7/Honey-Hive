# Honey-Hive: System Modelling & Architecture

## 1. Overview
This document outlines the formal system modelling for the **Honey-Hive** platform. It demonstrates the structural and behavioural design of the application, reflecting a mature software engineering approach. 

Honey-Hive is an AI-assisted product comparison platform. To meet the non-functional requirements for high performance and scalability, the architecture transitions away from monolithic, synchronous frameworks (such as Flask) in favour of a highly decoupled, asynchronous **FastAPI** backend and a **React (Vite)** frontend. This design natively supports non-blocking I/O operations, which is critical when orchestrating multiple external services like SerpApi and Google's Gemini LLM.

The models below articulate our system structure, dynamic behaviour, data persistence, and the engineering justifications behind these choices.

---

## 2. High-Level System Architecture (Container Model)
The system employs a strict **Client–Server Architecture**, divided into four distinct logical zones: Presentation, Application, Data, and External Services. 

The following UML Component Diagram illustrates how these layers interact. We utilise a Left-to-Right (`LR`) flow with heavily weighted data-paths to accurately represent the typical lifecycle of a web request.

```mermaid
flowchart LR
    %% -----------------------------------------
    %% INDUSTRIAL MODERN THEME DEFINITIONS
    %% -----------------------------------------
    classDef default fill:#1e293b,stroke:#475569,stroke-width:2px,color:#f8fafc,rx:6,ry:6,font-family:sans-serif;
    
    %% Accent Nodes (Dark backgrounds, thick neon borders)
    classDef client fill:#0f172a,stroke:#3b82f6,stroke-width:3px,color:#f8fafc,rx:8,ry:8;
    classDef server fill:#0f172a,stroke:#f59e0b,stroke-width:3px,color:#f8fafc,rx:8,ry:8;
    classDef data fill:#0f172a,stroke:#10b981,stroke-width:3px,color:#f8fafc,rx:8,ry:8;
    classDef external fill:#0f172a,stroke:#8b5cf6,stroke-width:3px,color:#f8fafc,rx:8,ry:8;
    classDef userNode fill:#334155,stroke:#cbd5e1,stroke-width:3px,color:#f8fafc,rx:50,ry:50;
    
    %% -----------------------------------------
    %% SYSTEM ARCHITECTURE
    %% -----------------------------------------
    U((User)):::userNode
    
    subgraph Presentation["Presentation Layer"]
        FE["React UI / Vite"]:::client
    end
    
    subgraph Application["Application Server Layer"]
        API["FastAPI Router"]:::server
        Auth["Auth Service"]:::server
        Search["Price Interceptor"]:::server
        AI["AI Insights"]:::server
        Coup["Coupon Engine"]:::server
    end
    
    subgraph Persistence["Persistence Layer"]
        ORM["SQLAlchemy ORM"]:::data
        DB[("SQLite Database")]:::data
    end
    
    subgraph ThirdParty["Third-Party Providers"]
        Serp["SerpApi Engine"]:::external
        Gemini["Gemini 2.5 Flash"]:::external
    end
    
    %% -----------------------------------------
    %% DATA FLOW (THICK ARROWS)
    %% -----------------------------------------
    U ==>|Browser Interaction| FE
    FE ==>|REST API JSON| API
    
    API ==> Auth
    API ==> Search
    API ==> AI
    API ==> Coup
    
    Auth <==> ORM
    ORM <==> DB
    
    Search ==> Serp
    AI ==> Gemini
    
    %% -----------------------------------------
    %% HEAVY ROUTING AND CONTAINER STYLES
    %% -----------------------------------------
    %% Forces all connecting lines to be thick, industrial slate-grey
    linkStyle default stroke:#64748b,stroke-width:4px,fill:none;
    
    %% Styles the background containers to look like technical blueprints
    style Presentation fill:#020617,stroke:#334155,stroke-width:2px,stroke-dasharray:5,5
    style Application fill:#020617,stroke:#334155,stroke-width:2px,stroke-dasharray:5,5
    style Persistence fill:#020617,stroke:#334155,stroke-width:2px,stroke-dasharray:5,5
    style ThirdParty fill:#020617,stroke:#334155,stroke-width:2px,stroke-dasharray:5,5
```

### 2.1 Component Responsibilities
By mapping our logical components to our physical file tree, we ensure strict traceability between design and implementation.

* **Frontend (`frontend/src/`):** Manages user state, authentication persistence (via `localStorage`), and renders the Glassmorphic UI. Components like `Results.tsx` and `Comparison.tsx` are strictly responsible for presentation, containing no business logic.
* **API Router (`backend/app/main.py` & `run.py`):** Acts as the primary entry point, managed by Uvicorn. It handles middleware, CORS policy, and routes incoming HTTP requests to specialised service modules.
* **Search & Interceptor (`backend/app/search.py`):** Handles SerpApi communication. Critically, it contains our custom regex-based **Price Interceptor**, enforcing strict user budget constraints before data is ever returned to the client.
* **AI Extraction (`backend/app/extract.py` & `backend/app/search.py`):** Passes normalised market data to Gemini 2.5 Flash to distil unstructured product reviews into structured pros, cons, and vendor trust scores.
* **Coupon Engine (`backend/app/coupons.py`):** Dynamically scrapes live promotional codes using Playwright and BeautifulSoup, falling back to Google Search, before ranking them with AI.

---

## 3. Dynamic System Behaviour (Sequence Model)
To understand the system's runtime behaviour, we map the flow of data through the architecture. This diagram uses lifeline activations (the solid vertical blocks on the transaction lines) to explicitly demonstrate processing states and system bottlenecks during an authenticated search.

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'fontFamily': 'sans-serif',
    'background': 'transparent',
    'actorBkg': '#0f172a',
    'actorBorder': '#3b82f6',
    'actorTextColor': '#f8fafc',
    'actorLineColor': '#475569',
    'signalColor': '#94a3b8',
    'signalTextColor': '#f8fafc',
    'noteBkgColor': '#0f172a',
    'noteBorderColor': '#f59e0b',
    'noteTextColor': '#f59e0b',
    'activationBorderColor': '#f59e0b',
    'activationBkgColor': '#0f172a',
    'sequenceNumberColor': '#0f172a'
  }
}}%%
sequenceDiagram
    autonumber
    
    participant U as User
    participant FE as React (UI)
    participant API as FastAPI
    participant DB as SQLite
    participant Serp as SerpApi
    participant Gem as Gemini Flash

    U->>FE: Enters query "Headphones" (Max £100)
    activate FE
    FE->>FE: Mount Skeleton Loaders
    
    FE->>API: GET /api/search (User Email)
    activate API
    
    API->>DB: Query User by Email
    activate DB
    DB-->>API: User Validated
    deactivate DB
    
    API->>Serp: Fetch Google Shopping Data
    activate Serp
    Serp-->>API: Raw JSON Payload
    deactivate Serp
    
    %% Clean, glowing system event note
    Note over API: Price Interceptor Logic executes.<br/>Strips all results > £100 constraint.
    
    API->>Gem: Dispatch top 3 candidates
    activate Gem
    Gem-->>API: AI Insights & Trust Score
    deactivate Gem
    
    API->>DB: Log transaction to History Table
    activate DB
    DB-->>API: Commit Successful
    deactivate DB
    
    API-->>FE: Return Cleaned JSON Array
    deactivate API
    
    FE->>FE: Unmount Skeletons, Render Data
    FE-->>U: Display Formatted Results
    deactivate FE
```

### 3.1 Behavioural Justification
This sequence highlights two critical engineering decisions:
1.  **Optimistic UI:** The frontend renders Skeleton states immediately (Step 2) before the backend completes its processing. This ensures zero layout shift and provides a highly responsive perceived performance.
2.  **Server-Side Filtering:** The Price Interceptor logic occurs entirely on the backend (Step 7) rather than the frontend. This minimises the size of the JSON payload transmitted over the network and prevents clients from reverse-engineering restricted search results.

---

## 4. Data Modelling (Entity-Relationship Model)
The system requires persistent storage for user accounts and search history. We utilise a relational model managed by **SQLAlchemy** (`backend/app/models.py`) to map Python objects to our **SQLite** database (`backend/honeyhive.db`).

```mermaid
%%{init: {
  'theme': 'dark',
  'themeVariables': {
    'fontFamily': 'sans-serif',
    'background': 'transparent',
    'lineColor': '#f59e0b'
  }
}}%%
erDiagram
    %% Relationship links defined first to optimise Mermaid's automatic spacing
    USERS ||--o{ USER_INPUTS : "performs"
    USER_INPUTS ||--o| PRODUCT_SNAPSHOTS : "captures"
    USER_INPUTS ||--o| COUPON_RESULTS : "generates"

    USERS {
        Integer id PK
        String email UK "Indexed"
        String password_hash
        DateTime created_utc
    }

    USER_INPUTS {
        Integer id PK
        Integer user_id FK "Indexed"
        String product_url
        DateTime created_utc
    }

    PRODUCT_SNAPSHOTS {
        Integer id PK
        Integer user_input_id FK "Indexed"
        String title
        Float price
        String site
    }
    
    COUPON_RESULTS {
        Integer id PK
        Integer user_input_id FK "Indexed"
        String matched_domain
        Text coupons_json
    }
```

### 4.1 Data Architecture Decisions
* **Referential Integrity:** The `user_inputs` table employs a Foreign Key (`user_id`) bound to the `users` table. This guarantees that relational data remains consistent and allows for cascading deletions (via `cascade="all, delete-orphan"`) if a user account is removed.
* **Security:** Plain text passwords are never stored. The `password_hash` column stores cryptographically salted hashes using the `pbkdf2_sha256` algorithm, mitigating the risk of credential exposure in the event of a database compromise.

---

## 5. Architectural Style and Design Justification
The architectural design of Honey-Hive is strictly aligned with the functional and non-functional requirements of the project. To achieve a highly maintainable and scalable system, we evaluated the trade-offs of our chosen stack:

### 5.1 Why FastAPI over Flask?
While initial requirements proposed a Flask backend, the system was upgraded to FastAPI. Because Honey-Hive relies heavily on two external APIs (SerpApi and Gemini), a synchronous framework like Flask would block the main thread while waiting for Google to respond. FastAPI’s native `async/await` support allows the server to handle concurrent user requests even while waiting for LLM generation, drastically improving horizontal scalability.

### 5.2 Fault Tolerance and Boundary Protection
External services are inherently unreliable. Our architecture encapsulates the SerpApi and Gemini calls within dedicated modules (`search.py` and `extract.py`). We implement rigorous `try/except` blocks and input validation via Pydantic schemas. If Gemini goes down, the system gracefully degrades—returning the product search results with a generic, professional fallback message rather than crashing the entire application.

### 5.3 Modularity and Extensibility
By decoupling the application into a Presentation Layer (React) and an Application Layer (FastAPI), we achieve high extensibility. Should the project require a mobile application in the future, the React Native codebase could plug directly into the existing FastAPI routing layer without requiring a single line of backend code to be rewritten.

### 5.4 Hybrid Extraction & Redirection Logic
To balance broad market coverage with high-fidelity accuracy, Honey-Hive utilizes a dual-path logic for product redirection and data sourcing:

* **Discovery Path (Keyword-based):** For general queries (e.g., "Standard Headphones"), the system prioritizes **Market Aggregation**. The primary "Buy" action redirects users to **Google Shopping** results. This architectural choice provides the widest possible range of price comparisons and vendor options without the overhead of maintaining custom scrapers for every individual boutique retailer.
* **Precision Path (Direct Link):** When processing a specific, high-intent URL (facilitated via the `extract.py` module), the system shifts to **Deep Extraction**. In this mode, the scraper bypasses aggregators to interface directly with the vendor's **Document Object Model (DOM)**. This enables the retrieval of granular data—including exact SKU pricing and technical specifications—directing the user straight to the final product checkout page.