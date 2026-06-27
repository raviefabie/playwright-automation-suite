// @ts-nocheck
require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.describe('E2E — Full User Journey — Sauce Demo', () => {

  test('TC-E2E-001 — complete purchase journey from login to order confirmation', async ({ page }) => {
    // Step 1 — Land on products page
    await page.goto('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    // Step 2 — Sort products by price low to high
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const firstPrice = await page.locator('.inventory_item_price').first().textContent();
    expect(parseFloat(firstPrice.replace('$', ''))).toBe(7.99);

    // Step 3 — Add two products to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Step 4 — View cart and verify items
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(page.locator('.cart_item')).toHaveCount(2);

    // Step 5 — Proceed to checkout
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    // Step 6 — Fill checkout form
    await page.locator('[data-test="firstName"]').fill('Ahmad');
    await page.locator('[data-test="lastName"]').fill('Syafiq');
    await page.locator('[data-test="postalCode"]').fill('43000');
    await page.locator('[data-test="continue"]').click();

    // Step 7 — Verify order summary
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.summary_total_label')).toBeVisible();

    // Step 8 — Complete order
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');

    // Step 9 — Return to products
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC-E2E-002 — fresh session has no cart state', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.saucedemo.com/inventory.html');

  // Sauce Demo doesn't enforce auth redirect — but cart should be empty
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();

  await context.close();
});

  test('TC-E2E-003 — locked user cannot access inventory', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill(process.env.LOCKED_USER);
    await page.locator('#password').fill(process.env.PASSWORD);
    await page.locator('#login-button').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out');
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    await context.close();
  });

  test('TC-E2E-004 — cart is empty after completing an order', async ({ page }) => {
    await page.goto('/inventory.html');

    // Add item and complete full checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Ahmad');
    await page.locator('[data-test="lastName"]').fill('Syafiq');
    await page.locator('[data-test="postalCode"]').fill('43000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();

    // Return to products and verify cart is empty
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('TC-E2E-005 — full journey with all 6 products added to cart', async ({ page }) => {
  await page.goto('/inventory.html');

  // Add all 6 products — re-query each time since buttons change after click
  const productCount = 6;
  for (let i = 0; i < productCount; i++) {
    await page.locator('[data-test^="add-to-cart"]').first().click();
  }

  await expect(page.locator('.shopping_cart_badge')).toHaveText('6');

  // Verify all 6 in cart
  await page.locator('.shopping_cart_link').click();
  await expect(page.locator('.cart_item')).toHaveCount(6);

  // Complete checkout
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill('Ahmad');
  await page.locator('[data-test="lastName"]').fill('Syafiq');
  await page.locator('[data-test="postalCode"]').fill('43000');
  await page.locator('[data-test="continue"]').click();

  await expect(page.locator('.cart_item')).toHaveCount(6);
  await page.locator('[data-test="finish"]').click();

  await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
});

});