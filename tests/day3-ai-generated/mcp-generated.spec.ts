/* AI-GENERATED — Review required */
// Generated: Claude Sonnet 4.6 (MCP browser analysis) │ Date: 2026-05-22

import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {

  test.beforeEach(async ({ page }) => {
    // Arrange — navigate and confirm the login page loaded
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Sign in to EventHub' })).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Arrange
    await page.getByRole('textbox', { name: 'Email' }).fill(process.env.USER_EMAIL!);
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.USER_PASSWORD!);

    // Act
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Assert
    await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com');
    await expect(page.getByRole('heading', { name: 'Discover & Book Amazing Events' })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Arrange
    await page.getByRole('textbox', { name: 'Email' }).fill('invalid@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');

    // Act
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Assert
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('should show inline validation when form is submitted empty', async ({ page }) => {
    // Act — submit without filling any fields
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Assert — stays on login page and shows validation messages
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByText('Enter a valid email')).toBeVisible();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test('should navigate to registration page via Register link', async ({ page }) => {
    // Act
    await page.getByRole('link', { name: 'Register' }).click();

    // Assert
    await expect(page).toHaveURL(/.*register/);
  });

});
