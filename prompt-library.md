# Prompt Library — EventHub Playwright Automation

## How to use this library
Copy any prompt below, fill in the bracketed placeholders,
and paste into Claude Code or Claude.ai with the SKILL.md 
attached for best results.

---

## Prompt 1 — Master Test Generation

You are an expert QA automation engineer specialising
in Playwright TypeScript.
Read skills/playwright-test-writer/SKILL.md first.
Generate a complete, runnable Playwright test file for:
APPLICATION: EventHub — ticket booking web application
BASE URL: https://eventhub.rahulshettyacademy.com
FEATURE: [Feature name]
TEST CASES TO COVER:

[Happy path]
[Error/edge case]
[Boundary condition]

---

## Prompt 2 — Screenshot to Test

I am attaching a screenshot of [page name] from EventHub.
Read skills/playwright-test-writer/SKILL.md first.
Analyse the UI elements visible and generate:

1. A complete Playwright test covering the main user flow
2. Three edge-case tests for form validation
3. Recommended data-testid attributes to add to the HTML

Base URL: https://eventhub.rahulshettyacademy.com

---

## Prompt 3 — API Test Generation

Read skills/playwright-test-writer/SKILL.md first.
Generate Playwright API tests for this endpoint:
METHOD: [GET/POST/PUT/DELETE]
URL: [endpoint]
AUTH: Bearer token via auth.fixture.ts
REQUEST BODY: [if applicable]
EXPECTED RESPONSE: [status code + body structure]
Include Zod schema validation for the response.

---

## Prompt 4 — Fix Failing Test

The following Playwright test is failing.
Read the error and fix it following our SKILL.md conventions.
TEST FILE: [paste test code]
ERROR: [paste error message]
APP URL: https://eventhub.rahulshettyacademy.com
Do not change passing assertions — only fix the failure.

---

## Prompt 5 — MCP Autonomous Generation

Using the Playwright MCP browser tools:

Navigate to [URL]
Analyse all interactive UI elements
Generate a complete test file at [path]

Follow all conventions in skills/playwright-test-writer/SKILL.md.
Run the tests after generating and fix any failures.