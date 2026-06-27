# Playwright Automation Suite

A professional end-to-end test automation suite built with [Playwright](https://playwright.dev/),
covering authentication, navigation, shopping cart, product listing, search, and full E2E user journeys.

Built as part of a structured QA learning roadmap to demonstrate modern automation practices
aligned with MNC/GLC QA Engineer role requirements.

---

## What This Suite Tests

| Module | File | Tests | Coverage |
|---|---|---|---|
| Login & Authentication | `login.spec.js` | 7 | Valid login, wrong password, empty fields, locked user, error dismissal |
| Navigation | `navigation.spec.js` | 6 | Page load, burger menu, menu items, logout, cart navigation |
| Cart & Checkout | `cart.spec.js` | 12 | Add/remove items, checkout form validation, full checkout flow |
| Products | `products.spec.js` | 10 | Product listing, sorting, detail page, add to cart |
| Search & Filter | `search.spec.js` | 10 | Sort options, price validation, uniqueness, image verification |
| E2E User Journeys | `e2e.spec.js` | 6 | Complete purchase flow, auth scenarios, cart persistence |
| **Total** | | **51** | |

---

## Tech Stack

- **Test Framework:** [Playwright](https://playwright.dev/) v1.x
- **Language:** JavaScript (Node.js)
- **Test Runner:** Playwright Test
- **Browser:** Chromium
- **Credential Management:** dotenv
- **CI/CD Ready:** Auth state management via Playwright storageState

---

## Project Structure
playwright-automation-suite/

├── tests/

│     ├── auth.setup.js        # Handles login once, saves session

│     ├── login.spec.js        # Authentication test cases

│     ├── navigation.spec.js   # Navigation and menu test cases

│     ├── cart.spec.js         # Cart and checkout test cases

│     ├── products.spec.js     # Product listing and sorting test cases

│     ├── search.spec.js       # Search and filter test cases

│     └── e2e.spec.js          # Full end-to-end user journey tests

├── .auth/                     # Auto-generated auth state (gitignored)

├── .env                       # Credentials (gitignored — never committed)

├── playwright.config.js       # Playwright configuration

└── package.json
---

## Key Technical Highlights

**Authentication State Management**
Login is performed once via `auth.setup.js` and the session is saved to `.auth/user.json`.
All subsequent tests load this saved state — eliminating repeated login steps across 51 tests
and reducing total suite runtime significantly.

**Selector Strategy**
Selectors follow a strict priority order for reliability:
1. `data-test` attributes (testing-specific, never changes with UI redesign)
2. `#id` selectors (unique per page)
3. Text content via `getByText()` or `getByRole()`
4. CSS classes only as last resort

**Dynamic DOM Handling**
TC-E2E-005 demonstrates handling of dynamic locator collections — re-querying elements
after each interaction to avoid stale locator references when the DOM updates.

**Negative Testing Coverage**
Every module includes negative test cases — empty fields, invalid inputs, locked accounts,
and unauthenticated access attempts — not just happy path scenarios.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/raviefabie/playwright-automation-suite.git

# Navigate to project folder
cd playwright-automation-suite

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Configuration

Create a `.env` file in the project root:
BASE_URL=https://www.saucedemo.com

STANDARD_USER=standard_user

LOCKED_USER=locked_out_user

PROBLEM_USER=problem_user

PASSWORD=secret_sauce
> Note: Sauce Demo credentials are publicly documented at [saucedemo.com](https://www.saucedemo.com).
> No sensitive credentials are required.

### Running Tests

```bash
# Run full suite (all 51 tests)
npx playwright test

# Run a specific file
npx playwright test tests/login.spec.js

# Run in headed mode (watch browser)
npx playwright test --headed

# Run and view HTML report
npx playwright test --reporter=html
npx playwright show-report
```

---

## Test Results

All 51 tests pass consistently across the full suite:
auth.setup.js       →   1  setup task

login.spec.js       →   7  tests  ✓

navigation.spec.js  →   6  tests  ✓

cart.spec.js        →   12 tests  ✓

products.spec.js    →   10 tests  ✓

search.spec.js      →   10 tests  ✓

e2e.spec.js         →   5  tests  ✓

─────────────────────────────────

Total               →   51 tests  — all passing
---

## What I Learned Building This

- Playwright project architecture and configuration
- Authentication state management with `storageState`
- Selector strategy and reliability hierarchy
- Negative testing patterns for forms and authentication
- Dynamic DOM handling with re-queried locators
- End-to-end flow design across multiple pages
- Secure credential management with dotenv

---

## Author

**Syafiq** — QA Engineer  
[LinkedIn](https://www.linkedin.com/in/muhammad-syafiq-talib-5bbb98194/)

---

## Roadmap

- [ ] Add GitHub Actions CI/CD workflow
- [ ] Add Postman API test collection
- [ ] Add visual regression testing
- [ ] Expand to Firefox and WebKit browsers