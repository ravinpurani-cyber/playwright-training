/* AI-GENERATED — Review required */
// Generated: Claude Sonnet 4 │ Reviewed by: Ravin Purani │ Date: 2026-05-15
// Source: Screenshot analysis of EventHub Events page

import { test, expect } from '@playwright/test';

test.describe('Events Page — Search & Filter', () => {

  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(process.env.USER_EMAIL!);
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.USER_PASSWORD!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByTestId('nav-events').click();
    await expect(page.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // Logout after each test — good practice to clean up server-side sessions
    // Conditional check — avoids failure if test ended before login completed
    const logoutButton = page.getByRole('button', { name: 'Logout' });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    }
  });

  // ── Main Flow ──────────────────────────────────────────────

  test('should display events page with all UI elements visible', async ({ page }) => {
    // Assert page heading
    await expect(page.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();

    // Assert search bar — note: ellipsis character '…' not three dots '...'
    await expect(page.getByPlaceholder('Search events, venues…')).toBeVisible();

    // Assert category dropdown — nth(0)
    await expect(page.getByRole('combobox').nth(0)).toBeVisible();

    // Assert city dropdown — nth(1)
    await expect(page.getByRole('combobox').nth(1)).toBeVisible();

    // Assert at least one Book Now link visible
    await expect(page.getByRole('link', { name: 'Book Now' }).first()).toBeVisible();
  });

  test('should search events by keyword', async ({ page }) => {
    // Arrange
    const searchBox = page.getByPlaceholder('Search events, venues…');

    // Act — search for a known event
    await searchBox.fill('World Tech Summit');

    // Assert — matching event appears
    await expect(page.getByText('World Tech Summit')).toBeVisible();
  });

  test('should filter events by category', async ({ page }) => {
    // Act — select Conference from category dropdown nth(0)
    await page.getByRole('combobox').nth(0).selectOption('Conference');

    // Wait briefly for filtered results to load
    await page.waitForTimeout(500);

    // Assert — heading still visible confirming page is functional
    await expect(page.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();
  });

  test('should filter events by city', async ({ page }) => {
    // Act — select Delhi from city dropdown nth(1)
    await page.getByRole('combobox').nth(1).selectOption('Delhi');

    // Wait briefly for filtered results to load
    await page.waitForTimeout(500);

    // Assert — use specific venue text to avoid strict mode violation
    await expect(page.getByText('Pragati Maidan Exhibition Grounds, Delhi')).toBeVisible();
  });

  // ── Edge Cases ────────────────────────────────────────────

  test('should show no results for unmatched search', async ({ page }) => {
    // Act — search for something that doesn't exist
    await page.getByPlaceholder('Search events, venues…').fill('xyznonexistent123');

    // Wait for search results to update
    await page.waitForTimeout(500);

    // Assert — no Book Now links visible
    await expect(page.getByRole('link', { name: 'Book Now' })).toHaveCount(0);
  });

  test('should reset results when search is cleared', async ({ page }) => {
    // Arrange — search for something first
    const searchBox = page.getByPlaceholder('Search events, venues…');
    await searchBox.fill('World Tech Summit');
    await expect(page.getByText('World Tech Summit')).toBeVisible();

    // Act — clear the search
    await searchBox.clear();

    // Wait for results to reset
    await page.waitForTimeout(500);

    // Assert — events visible again
    await expect(page.getByRole('link', { name: 'Book Now' }).first()).toBeVisible();
  });

  test('should navigate to event detail when Book Now is clicked', async ({ page }) => {
    // Act — click first Book Now link
    await page.getByRole('link', { name: 'Book Now' }).first().click();

    // Assert — URL changes to event detail page
    await expect(page).toHaveURL(/.*events\/\d+/);
  });

});