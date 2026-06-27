// @ts-nocheck
require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.describe('Cart & Checkout — Sauce Demo', () => {

  test('TC-Cart-001 — add single item to cart', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-Cart-002 — add multiple items to cart', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });

  test('TC-Cart-003 — remove item from cart on inventory page', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('TC-Cart-004 — cart page displays added item correctly', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
  });

  test('TC-Cart-005 — remove item from cart page', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();

    await expect(page.locator('.cart_item')).toHaveCount(1);
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('TC-Cart-006 — continue shopping button returns to inventory', async ({ page }) => {
    await page.goto('/cart.html');

    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('TC-Cart-007 — checkout with empty cart still proceeds', async ({ page }) => {
    await page.goto('/cart.html');

    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
  });

  test('TC-Cart-008 — checkout form shows error with empty fields', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('TC-Cart-009 — checkout form shows error with missing last name', async ({ page }) => {
    await page.goto('/checkout-step-one.html');

    await page.locator('[data-test="firstName"]').fill('Ahmad');
    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
  });

  test('TC-Cart-010 — checkout form shows error with missing postal code', async ({ page }) => {
    await page.goto('/checkout-step-one.html');

    await page.locator('[data-test="firstName"]').fill('Ahmad');
    await page.locator('[data-test="lastName"]').fill('Syafiq');
    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  });

  test('TC-Cart-011 — complete full checkout flow successfully', async ({ page }) => {
    await page.goto('/inventory.html');

    // Add item to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Go to cart
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    // Proceed to checkout
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    // Fill checkout form
    await page.locator('[data-test="firstName"]').fill('Ahmad');
    await page.locator('[data-test="lastName"]').fill('Syafiq');
    await page.locator('[data-test="postalCode"]').fill('43000');
    await page.locator('[data-test="continue"]').click();

    // Verify order overview
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    await expect(page.locator('.summary_info')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(1);

    // Complete order
    await page.locator('[data-test="finish"]').click();

    // Verify confirmation
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  test('TC-Cart-012 — back home button after order completion', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Ahmad');
    await page.locator('[data-test="lastName"]').fill('Syafiq');
    await page.locator('[data-test="postalCode"]').fill('43000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

});