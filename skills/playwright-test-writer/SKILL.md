# skills/playwright-test-writer/SKILL.md

## What this skill does
Generates production-ready Playwright TypeScript test files 
for the EventHub application.
Read this file in full before writing any test code.

**Coverage note**: Always handle edge cases such as missing environment variables, network failures, missing DOM elements, and selector fallbacks. Test only with explicitly defined conditions; do not assume UI structure.

## Generation checklist (execute in order)
1. Add review header with current date and engineer name at file top
2. Set imports: always `import { test, expect } from '@playwright/test'` plus custom fixtures if needed
3. Validate all required process.env variables exist; throw descriptive Error if missing
4. Wrap tests in test.describe() with meaningful name
5. Add test.beforeEach if shared setup (login/navigation) needed
6. Implement tests following selector priority order (see below)
7. Use AAA structure (Arrange → Act → Assert) with blank lines between sections
8. Add test.afterEach with conditional cleanup (logout)

## Non-negotiable rules
1. Prefer selectors in this order; only use lower-priority selectors after attempting and failing to locate elements with all higher-priority selectors programmatically. Document attempted selectors in a comment before using a lower-priority selector:
   - getByRole() — tied to accessibility, most reliable
   - getByLabel() — form fields with explicit labels
   - getByPlaceholder() — inputs without labels
   - getByTestId() — data-testid attributes
   - getByText() — visible text content only
   - locator('css') — CSS selectors as last resort

2. ALWAYS wrap each test file in test.describe() with a meaningful name.

3. ALWAYS add the review header at top of every generated file. Fill in the engineer name and current date:
   ```
   /* AI-GENERATED — Review required │ Engineer: ${process.env.PROCESS_ENV_ENGINEER_NAME || 'Unknown'} │ Date: 2026-05-28 */
   ```
   Use the current date in YYYY-MM-DD format. For engineer name, use the environment variable `PROCESS_ENV_ENGINEER_NAME` if set; otherwise use 'Unknown'.

4. NEVER hard-code URLs. Prefer process.env.BASE_URL when present; otherwise rely on Playwright's baseURL config. Example usage:
   ```
   const base = process.env.BASE_URL ?? '';
   await page.goto(base + '/login');
   ```

5. NEVER hard-code credentials — always use process.env variables. If a required variable is undefined, throw a descriptive Error at module top. Example:
   ```
   const email = process.env.USER_EMAIL;
   if (!email) throw new Error('USER_EMAIL must be set');
   ```

6. ALWAYS follow AAA structure: Arrange → Act → Assert with blank lines between sections.

7. ALWAYS import { test, expect } from '@playwright/test' in generated files. If you must use custom fixtures from another module, still import '@playwright/test' for core types and import the fixture module separately (e.g., `import { test as fixtureTest } from './fixtures'`).

8. Test names MUST follow exactly: 'should <action> when <condition>' (lowercase 'should', single space, use present-tense verb for action). For complex conditions, use commas within the condition clause, e.g., 'should save draft when network slow, autosave enabled'.

9. Use test.beforeEach for shared login/navigation setup.

10. Use test.afterEach with conditional logout for cleanup.

## File naming convention
Replace [N] with a two-digit day index. Use '01' for the first generated file for this feature. Example filename: tests/day01-login.spec.ts

- UI tests:  tests/day[N]-[feature].spec.ts
- API tests: tests/day[N]-api.spec.ts
- DB tests:  tests/day[N]-database.spec.ts
- AI tests:  tests/day3-ai-generated/[feature]-ai.spec.ts

## Output format
Return ONLY the TypeScript file content.
No explanations, no markdown fences, no preamble — just the file.

## Worked example
INPUT: 'Test that login works with valid credentials'

OUTPUT:
/* AI-GENERATED — Review required │ Engineer: Unknown │ Date: 2026-05-28 */
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login successfully when valid credentials provided',
  async ({ page }) => {
    // Arrange
    const email = process.env.USER_EMAIL!;
    const password = process.env.USER_PASSWORD!;

    // Act
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Assert
    await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com');
    await expect(page.getByRole('heading',
      { name: 'Discover & Book Amazing Events' })).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const logoutButton = page.getByRole('button', { name: 'Logout' });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    }
  });

});