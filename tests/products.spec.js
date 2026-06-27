// @ts-nocheck
require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.describe('Products — Sorting & Filtering — Sauce Demo', () => {

  test('TC-Products-001 — products page displays product list', async ({ page }) => {
    await page.goto('/inventory.html');

    const products = page.locator('.inventory_item');
    await expect(products).toHaveCount(6);
  });

  test('TC-Products-002 — each product has name, price and add to cart button', async ({ page }) => {
    await page.goto('/inventory.html');

    const products = page.locator('.inventory_item');
    const count = await products.count();

    for (let i = 0; i < count; i++) {
      const product = products.nth(i);
      await expect(product.locator('.inventory_item_name')).toBeVisible();
      await expect(product.locator('.inventory_item_price')).toBeVisible();
      await expect(product.locator('button')).toBeVisible();
    }
  });

  test('TC-Products-003 — default sort is Name A to Z', async ({ page }) => {
    await page.goto('/inventory.html');

    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');
  });

  test('TC-Products-004 — sort by Name Z to A', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="product-sort-container"]').selectOption('za');

    const firstProduct = page.locator('.inventory_item_name').first();
    const lastProduct = page.locator('.inventory_item_name').last();

    await expect(firstProduct).toHaveText('Test.allTheThings() T-Shirt (Red)');
    await expect(lastProduct).toHaveText('Sauce Labs Backpack');
  });

  test('TC-Products-005 — sort by Price low to high', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));

    for (let i = 0; i < numericPrices.length - 1; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i + 1]);
    }
  });

  test('TC-Products-006 — sort by Price high to low', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');

    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));

    for (let i = 0; i < numericPrices.length - 1; i++) {
      expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i + 1]);
    }
  });

  test('TC-Products-007 — clicking product name opens product detail page', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('.inventory_item_name').first().click();

    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('.inventory_details_name')).toBeVisible();
  });

  test('TC-Products-008 — product detail page has back button', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('.inventory_item_name').first().click();
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    await page.locator('[data-test="back-to-products"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('TC-Products-009 — product detail page shows price and description', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('.inventory_item_name').first().click();

    await expect(page.locator('.inventory_details_price')).toBeVisible();
    await expect(page.locator('.inventory_details_desc')).toBeVisible();
  });

  test('TC-Products-010 — add to cart from product detail page', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('.inventory_item_name').first().click();
    await page.locator('[data-test="add-to-cart"]').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

});