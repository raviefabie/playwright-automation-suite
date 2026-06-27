require('dotenv').config();
const { test, expect } = require('@playwright/test');

const USERNAME = process.env.STANDARD_USER;
const LOCKED_USER = process.env.LOCKED_USER;
const PASSWORD = process.env.PASSWORD;

test.describe('Login — Sauce Demo', () => {

  test('TC-Login-001 — successful login with valid credentials', async ({ page }) => {
    await page.goto('/');
    await page.locator('#user-name').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('#login-button').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC-Login-002 — failed login with wrong password', async ({ page }) => {
    await page.goto('/');
    await page.locator('#user-name').fill(USERNAME);
    await page.locator('#password').fill('wrongpassword');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-Login-003 — failed login with empty username', async ({ page }) => {
    await page.goto('/');
    await page.locator('#user-name').fill('');
    await page.locator('#password').fill(PASSWORD);
    await page.locator('#login-button').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('TC-Login-004 — failed login with empty password', async ({ page }) => {
    await page.goto('/');
    await page.locator('#user-name').fill(USERNAME);
    await page.locator('#password').fill('');
    await page.locator('#login-button').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
  });

  test('TC-Login-005 — failed login with locked out user', async ({ page }) => {
    await page.goto('/');
    await page.locator('#user-name').fill(LOCKED_USER);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('#login-button').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out');
  });

  test('TC-Login-006 — failed login with empty username and password', async ({ page }) => {
    await page.goto('/');
    await page.locator('#user-name').fill('');
    await page.locator('#password').fill('');
    await page.locator('#login-button').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('TC-Login-007 — error message dismissable after failed login', async ({ page }) => {
    await page.goto('/');
    await page.locator('#user-name').fill('wronguser');
    await page.locator('#password').fill('wrongpassword');
    await page.locator('#login-button').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await page.locator('.error-button').click();
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
  });

});