# Honey-Hive System Modelling

## 1. Overview

This document presents the **system modelling** for the **ELEE1149 group coursework project**. The system, named **Honey-Hive**, is a web-based product comparison and review assistant that allows a user to input either a **product name** or a **product URL**, retrieve matching product offers, and generate **AI-assisted product insights**.

The modelling in this document reflects both the **current implementation** and the **intended system design** described in the project requirements.

The current implementation already includes:

- **Flask backend API**
- **Product search workflow**
- **Amazon URL extraction**
- **Google Shopping queries via SerpAPI**
- **AI-generated product insights using Gemini**

The purpose of this modelling document is to demonstrate how the system aligns with **software engineering principles** by clearly communicating:

- **System structure**
- **System behaviour**
- **Design decisions**
- **Component responsibilities**

---

## 2. System Context

The system is designed as a **web application** consisting of **three main architectural layers**.

### 2.1 Presentation Layer

The **frontend interface** provides the interaction point for the user.

**Responsibilities include:**

- Collecting **user input**
- Sending **requests to the backend**
- Displaying **product comparison results**
- Presenting **AI-generated insights**

---

### 2.2 Application Layer

The **Flask backend API** acts as the **central processing component**.

**Responsibilities include:**

- Handling **API routing**
- Performing **input validation**
- Executing **business logic**
- Orchestrating interactions with **external services**

---

### 2.3 Service Layer

The system relies on **external APIs** to provide **product search** and **AI processing capabilities**.

**External services include:**

- **SerpAPI** — used for retrieving **product search results**
- **Gemini AI** — used for generating **structured AI-based product insights**

---

### 2.4 Primary User Goal

The **primary user goal** is to quickly compare a product by entering either:

**A product search query**

Example:

```
Sony WH-1000XM5 headphones
```

or

**A direct product URL**

Example:

```
Amazon product link
```

The system retrieves **matching product offers** and optionally generates **AI-assisted product insights**.

---

## 3. Architectural Style and Design Justification

The system follows a **client–server architecture** with a **modular backend design**.

The architecture separates the system into **clearly defined responsibilities**.

| Layer | Responsibility |
|------|------|
| Frontend | Collect user input and present results |
| Backend API | Process requests and perform routing logic |
| External Services | Provide search results and AI processing |

This architectural separation improves:

- **Maintainability**
- **Scalability**
- **System clarity**

---

## 3.1 Architectural Justification

### Separation of Concerns

The **frontend** is responsible for presentation and interaction, while the **backend** performs processing and decision-making. This separation reduces coupling and improves **system maintainability**.

### Modularity

The backend logic is divided into **specialised modules**, allowing individual components to be developed, tested, and maintained independently.

| Module       | Responsibility                                    |
| ------------ | ------------------------------------------------- |
| `server.py`  | API routing and request handling                  |
| `search.py`  | Search optimisation, shopping search, AI insights |
| `extract.py` | Amazon product link extraction                    |

This modular structure improves maintainability and readability.

Scalability

External APIs such as SerpAPI and Gemini AI are used to offload heavy processing tasks.

Benefits include:

Reduced computational load on the local server

Faster response times

Ability to scale without implementing complex scraping infrastructure

Reliability

The backend performs validation checks and exception handling when communicating with external services. This prevents system crashes when external API responses fail.

Maintainability

Separating the system into small, specialised modules makes it easier for developers to modify individual features without affecting other components.

3.2 Architectural Decisions and Requirement Alignment

The architectural decisions in the Honey-Hive system are closely aligned with both functional and non-functional requirements.

External API Integration

The system relies on external APIs such as SerpAPI and Gemini to perform product search and AI-based analysis. This architectural decision supports the scalability requirement by delegating computationally intensive operations such as large-scale product search and natural language processing to specialised external services.

Modular Backend Design

Separating the backend into independent modules (`search.py`, `extract.py`, and AI insight generation) improves maintainability and extensibility. Each module has a clearly defined responsibility and can be modified or replaced without affecting other components of the system.

Client–Server Architecture

The separation between frontend and backend enables the system to support multiple clients in the future. The backend API acts as a reusable service layer that could support web interfaces, mobile clients, or additional integrations.

Fault Tolerance

External API calls are encapsulated within backend modules. Error handling and validation logic in the backend layer ensure that failures in external services do not cause system-wide crashes.

These architectural decisions collectively support system scalability, reliability, and maintainability while allowing rapid integration of external data sources.

4. High-Level System Architecture

```mermaid
flowchart TD

User --> Frontend

subgraph Presentation Layer
Frontend
end

subgraph Application Layer
Backend
SearchModule
ExtractionModule
AIReviewModule
end

subgraph External Services
SerpAPI
GeminiAPI
end

Frontend --> Backend

Backend --> SearchModule
Backend --> ExtractionModule
Backend --> AIReviewModule

SearchModule --> SerpAPI
SearchModule --> GeminiAPI

ExtractionModule --> SerpAPI

AIReviewModule --> GeminiAPI
AIReviewModule --> SerpAPI

Backend --> Frontend
```
Explanation

The user interacts with the frontend interface.

The frontend sends a request to the Flask backend.

The backend determines how to process the input.

The backend communicates with external services.

Results are returned to the frontend in JSON format.

5. Functional Decomposition

The backend system is divided into functional components.

5.1 Server Layer

Responsible for:

handling API requests

validating input

routing requests to appropriate modules

returning JSON responses

5.2 Search Module
