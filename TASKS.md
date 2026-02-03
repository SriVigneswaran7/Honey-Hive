# Tasks / Backlog

## Database
- Create schema for:
  - user accounts (optional)
  - user submissions (URLs, keywords)
  - cached product results (offers, timestamps)
- Implement storage + retrieval APIs

## UI
- Core pages:
  - URL/keyword search page (main)
  - Results dashboard (table + filters)
- Optional pages:
  - Login / Signup
  - Help screen
  - Dark mode toggle

## Backend Algorithms / Services
- URL validation + retailer detection
- Retailer scraper modules:
  - extract title, price, image, features
- Matching/comparison logic:
  - find similar products across retailers
  - return top 3+ offers
- Coupons service (best-effort)
- Review summary (best-effort)

## Security
- Input sanitisation (URL + keyword)
- Parameterised DB queries (prevent SQL injection)
- Output escaping (prevent XSS)
- Avoid command execution from user input (prevent command injection)

## Communication
- Define API endpoints and JSON schemas:
  - /extract
  - /compare
  - /search
  - /history (if caching)
- Document API in README or docs
