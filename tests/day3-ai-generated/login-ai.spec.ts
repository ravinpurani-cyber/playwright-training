/* AI-GENERATED — Review required */
// Generated: Claude Sonnet 4 │ Reviewed by: Ravin Purani │ Date: 2026-05-15

import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {

  test.beforeEach(async ({ page }) => {
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

  test('should show error toast for invalid credentials', async ({ page }) => {
    // Arrange
    await page.getByRole('textbox', { name: 'Email' }).fill('invalid@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');

    // Act
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Assert
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('should not login when form fields are empty', async ({ page }) => {
    // Act — click Sign In without filling any fields
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Assert — should stay on login page
    await expect(page).toHaveURL(/.*login/);

    // Assert — inline validation messages appear
    await expect(page.getByText('Enter a valid email')).toBeVisible();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

});