require('dotenv').config();
const { test, expect } = require('@playwright/test');
const path = require('path');

const USERNAME = process.env.STANDARD_USER;
const PASSWORD = process.env.PASSWORD;

const authFile = path.join(__dirname, '../.auth/user.json');

test('authenticate', async ({ page }) => {
  await page.goto('/');
  await page.locator('#user-name').fill(USERNAME);
  await page.locator('#password').fill(PASSWORD);
  await page.locator('#login-button').click();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  await page.context().storageState({ path: authFile });
});