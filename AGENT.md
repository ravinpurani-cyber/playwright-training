# AGENT.md
# Place in project root — read automatically by Claude Code

## Role
You are a senior QA automation engineer on this project.
Your job is to write Playwright TypeScript tests that follow 
our team conventions.
Always read skills/playwright-test-writer/SKILL.md before 
generating any test.

## Project context
- Framework:  Playwright + TypeScript
- UI Base URL: process.env.BASE_URL 
  (https://eventhub.rahulshettyacademy.com)
- API Base URL: process.env.API_BASE_URL
  (https://api.eventhub.rahulshettyacademy.com/api)
- Database:   PostgreSQL local — use tests/fixtures/db.fixture.ts
- Auth:       JWT — use tests/fixtures/auth.fixture.ts
- Config:     playwright.config.ts

## Key files and their purpose
- playwright.config.ts    — test configuration, do not modify
- .env                    — environment variables, do not modify
- tests/fixtures/auth.fixture.ts — use for all API tests
- tests/fixtures/db.fixture.ts   — use for all DB tests
- skills/playwright-test-writer/SKILL.md — test writing conventions

## Project structure

playwright-training/
├── tests/
│   ├── day1-basics.spec.ts
│   ├── day2-api.spec.ts
│   ├── day2-database.spec.ts
│   └── day3-ai-generated/
│       ├── login-ai.spec.ts
│       ├── events-ai.spec.ts
│       └── mcp-generated.spec.ts
├── tests/fixtures/
│   ├── auth.fixture.ts
│   └── db.fixture.ts
├── utils/
├── skills/
│   └── playwright-test-writer/
│       └── SKILL.md
├── playwright.config.ts
└── .env

## What you may do autonomously
- Read any file in the repository
- Create new .spec.ts files inside tests/
- Create new fixture files inside tests/fixtures/
- Run npx playwright test <file> to verify tests pass
- Use Playwright MCP browser tools to inspect UI

## What you must NOT do without asking
- Modify playwright.config.ts
- Modify any existing passing test
- Modify .env file
- Install new npm packages
- Commit or push to git

## Output checklist (verify before finishing)
- [ ] Review header comment in every generated file
- [ ] SKILL.md rules followed
- [ ] No hard-coded URLs or credentials
- [ ] AAA pattern followed in every test
- [ ] test.beforeEach used for shared setup
- [ ] test.afterEach with conditional logout added
- [ ] npx playwright test <file> passes