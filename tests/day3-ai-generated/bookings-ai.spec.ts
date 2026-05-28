/* AI-GENERATED — Review required │ Engineer: Ravin Purani │ Date: 2026-05-28 */

import { test, expect, type Page } from '@playwright/test';

// Serial within file — bookings mutate shared user state, parallel runs would collide.
test.describe.configure({ mode: 'serial' });

// Helper — books one ticket for the always-available "World Tech Summit" featured event.
// Waits for the POST /bookings response so the booking is persisted before the caller
// navigates away — Confirm Booking doesn't redirect, so without this the next page load
// can race the booking creation.
async function bookFeaturedEvent(page: Page) {
  await page.goto('/events/1');
  await page.getByRole('textbox', { name: 'Full Name*' }).fill('Ravin Purani');
  await page.getByRole('textbox', { name: 'Email*' }).fill(process.env.USER_EMAIL!);
  await page.getByRole('textbox', { name: 'Phone Number*' }).fill('+91 9876543210');

  const responsePromise = page.waitForResponse(
    (r) => r.url().includes('/bookings') && r.request().method() === 'POST' && r.ok(),
  );
  await page.getByRole('button', { name: 'Confirm Booking' }).click();
  await responsePromise;
}

// Helper — click a button that fires a confirm() dialog and accept it deterministically.
// Using waitForEvent is more reliable than page.once because we explicitly await both
// the dialog appearing and the accept resolving before continuing.
async function clickAndAcceptDialog(page: Page, button: ReturnType<Page['getByRole']>) {
  const dialogPromise = page.waitForEvent('dialog').then((d) => d.accept());
  await button.click();
  await dialogPromise;
}

// Helper — clear bookings from a clean baseline (no-op if already empty).
// Bookings are fetched async after the page shell renders, so we have to wait for
// either the empty-state heading or a booking card before checking count. Otherwise
// .count() returns 0 prematurely and we'd skip the clear when bookings actually exist.
async function clearAllBookings(page: Page) {
  await page.goto('/bookings');
  await expect(page.getByRole('heading', { name: 'My Bookings' })).toBeVisible();

  const emptyState = page.getByRole('heading', { name: 'No bookings yet' });
  const firstCancel = page.getByRole('main').getByRole('button', { name: 'Cancel Booking' }).first();
  await Promise.race([
    emptyState.waitFor({ state: 'visible' }),
    firstCancel.waitFor({ state: 'visible' }),
  ]);

  if (await emptyState.isVisible()) return;

  await clickAndAcceptDialog(page, page.getByRole('button', { name: 'Clear all bookings' }));
  await expect(emptyState).toBeVisible({ timeout: 10000 });
}

test.describe('My Bookings Page', () => {

  test.beforeEach(async ({ browserName, page }) => {
    // Cross-project collision guard — EventHub uses one shared user account, so two
    // parallel browser projects creating/clearing bookings would stomp on each other.
    test.skip(browserName !== 'chromium', 'Mutates shared user state — chromium only.');

    // Arrange — login
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(process.env.USER_EMAIL!);
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.USER_PASSWORD!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('heading', { name: 'Discover & Book Amazing Events' })).toBeVisible();

    // Arrange — start every test from a clean bookings slate
    await clearAllBookings(page);
  });

  test.afterEach(async ({ page }) => {
    // Close any custom dialog left open by the test so the Logout click isn't intercepted.
    const openDialog = page.getByRole('dialog');
    if (await openDialog.isVisible().catch(() => false)) {
      await openDialog.getByRole('button', { name: 'Close' }).click().catch(() => {});
    }
    const logout = page.getByRole('button', { name: 'Logout' });
    if (await logout.isVisible().catch(() => false)) {
      await logout.click();
    }
  });

  test('should display empty state when user has no bookings', async ({ page }) => {
    // Arrange — already on /bookings via beforeEach

    // Act — nothing to do; we expect the empty state

    // Assert — scope to main to avoid the same link in the footer
    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { name: 'My Bookings' })).toBeVisible();
    await expect(main.getByRole('heading', { name: 'No bookings yet' })).toBeVisible();
    await expect(main.getByRole('link', { name: 'Browse Events' })).toBeVisible();
  });

  test('should display booking card when a booking has been created', async ({ page }) => {
    // Arrange
    await bookFeaturedEvent(page);

    // Act
    await page.goto('/bookings');

    // Assert — booking card surfaces the event, status, ticket count and total
    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { name: 'World Tech Summit' }).first()).toBeVisible();
    await expect(main.getByText('confirmed').first()).toBeVisible();
    await expect(main.getByText('1 ticket').first()).toBeVisible();
    await expect(main.getByText('$1,500').first()).toBeVisible();
    await expect(main.getByRole('button', { name: 'Cancel Booking' }).first()).toBeVisible();
  });

  test('should navigate to booking detail when View Details is clicked', async ({ page }) => {
    // Arrange
    await bookFeaturedEvent(page);
    await page.goto('/bookings');

    // Act
    await page.getByRole('link', { name: 'View Details' }).first().click();

    // Assert — URL goes to /bookings/{numeric id}
    await expect(page).toHaveURL(/.*\/bookings\/\d+/);
  });

  test('should remove a booking when Cancel Booking is confirmed', async ({ page }) => {
    // Arrange — create exactly one booking, then capture how many cards are visible
    await bookFeaturedEvent(page);
    await page.goto('/bookings');
    const cancelButtons = page.getByRole('main').getByRole('button', { name: 'Cancel Booking' });
    await expect(cancelButtons.first()).toBeVisible();
    const startCount = await cancelButtons.count();

    // Act — Cancel Booking opens a custom in-app dialog (not window.confirm), so we
    // confirm by clicking "Yes, cancel it" inside the dialog rather than handling a
    // native dialog event.
    await cancelButtons.first().click();
    const confirmDialog = page.getByRole('dialog', { name: 'Cancel this booking?' });
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.getByRole('button', { name: 'Yes, cancel it' }).click();

    // Assert — one fewer booking card is visible
    await expect(cancelButtons).toHaveCount(startCount - 1);
  });

  test('should clear all bookings when Clear all bookings is confirmed', async ({ page }) => {
    // Arrange — create at least one booking so the Clear button has something to do
    await bookFeaturedEvent(page);
    await page.goto('/bookings');
    await expect(page.getByRole('main').getByRole('button', { name: 'Cancel Booking' }).first()).toBeVisible();

    // Act
    await clickAndAcceptDialog(page, page.getByRole('button', { name: 'Clear all bookings' }));

    // Assert
    await expect(page.getByRole('heading', { name: 'No bookings yet' })).toBeVisible();
    await expect(page.getByRole('main').getByRole('button', { name: 'Cancel Booking' })).toHaveCount(0);
  });

  test('should navigate to events page when Browse Events is clicked from empty state', async ({ page }) => {
    // Arrange — empty state guaranteed by beforeEach

    // Act
    await page.getByRole('main').getByRole('link', { name: 'Browse Events' }).click();

    // Assert
    await expect(page).toHaveURL(/.*\/events$/);
    await expect(page.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();
  });

});
