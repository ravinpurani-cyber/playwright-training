import { test, expect } from '@playwright/test';
//import { validUser, invalidUser } from '../utils/test-data.ts';

const baseURL = process.env.BASE_URL!;
const email = process.env.USER_EMAIL!;
const password = process.env.USER_PASSWORD!;

test.describe('Login Flow', () => {

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(baseURL);
    await expect(page.getByRole('heading', { name: 'Discover & Book Amazing Events' })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

});

test.describe('Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(baseURL);
  });

  test('should navigate to Events page', async ({ page }) => {

    await page.getByTestId('nav-events').click();
    await expect(page).toHaveURL(/.*events/);
    await expect(page.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();
  });

  test('should navigate to My Bookings page', async ({ page }) => {

    await page.getByTestId('nav-bookings').click();
    await expect(page).toHaveURL(/.*bookings/);
    await expect(page.getByRole('heading', { name: 'My Bookings' })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {

    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: 'Sign in to EventHub' })).toBeVisible();
  });

});