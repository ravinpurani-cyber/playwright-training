import { test as base, request as requestContext } from '@playwright/test';

// Define the shape of our custom fixtures
type AuthFixtures = {
  authToken: string;
  authenticatedRequest: Awaited<ReturnType<typeof requestContext.newContext>>;
};

// Extend Playwright's base test with our custom fixtures
export const test = base.extend<AuthFixtures>({

  // Fixture 1 — provides auth token
  authToken: async ({}, use) => {
    const ctx = await requestContext.newContext();
    const response = await ctx.post(`${process.env.API_BASE_URL}/auth/login`, {
      data: {
        email:    process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD,
      },
    });
    const body = await response.json();
    await use(body.token);  // provide token to the test
    await ctx.dispose();    // cleanup after test
  },

  // Fixture 2 — provides pre-authenticated request context
  authenticatedRequest: async ({ authToken }, use) => {
    const ctx = await requestContext.newContext({
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    await use(ctx);       // provide authenticated context to test
    await ctx.dispose();  // cleanup after test
  },

});

export { expect } from '@playwright/test';