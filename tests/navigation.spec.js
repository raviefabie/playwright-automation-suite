const { test, expect } = require('@playwright/test');

test.describe('Navigation — Sauce Demo', () => {

  test('TC-Nav-001 — products page loads after login', async ({ page }) => {
    await page.goto('/inventory.html');

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC-Nav-002 — burger menu is visible on products page', async ({ page }) => {
    await page.goto('/inventory.html');

    await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
  });

  test('TC-Nav-003 — burger menu opens when clicked', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('.bm-menu-wrap')).toBeVisible();
  });

  test('TC-Nav-004 — burger menu contains all expected items', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('#inventory_sidebar_link')).toHaveText('All Items');
    await expect(page.locator('#about_sidebar_link')).toHaveText('About');
    await expect(page.locator('#logout_sidebar_link')).toHaveText('Logout');
    await expect(page.locator('#reset_sidebar_link')).toHaveText('Reset App State');
  });

  test('TC-Nav-005 — logout from burger menu works', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('TC-Nav-006 — cart icon is visible and navigates to cart', async ({ page }) => {
    await page.goto('/inventory.html');

    await expect(page.locator('.shopping_cart_link')).toBeVisible();
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  });

});