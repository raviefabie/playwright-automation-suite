// @ts-nocheck
require('dotenv').config();
const { test, expect } = require('@playwright/test');

test.describe('Search & Filter — Sauce Demo', () => {

  test('TC-Search-001 — all 4 sort options are available', async ({ page }) => {
    await page.goto('/inventory.html');

    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await expect(sortDropdown).toBeVisible();

    const options = await sortDropdown.locator('option').allTextContents();
    expect(options).toContain('Name (A to Z)');
    expect(options).toContain('Name (Z to A)');
    expect(options).toContain('Price (low to high)');
    expect(options).toContain('Price (high to low)');
  });

  test('TC-Search-002 — sort resets to default after page reload', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="product-sort-container"]').selectOption('za');
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('za');

    await page.reload();
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');
  });

  test('TC-Search-003 — product prices are displayed with $ symbol', async ({ page }) => {
    await page.goto('/inventory.html');

    const prices = await page.locator('.inventory_item_price').allTextContents();
    for (const price of prices) {
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    }
  });

  test('TC-Search-004 — product names are unique', async ({ page }) => {
    await page.goto('/inventory.html');

    const names = await page.locator('.inventory_item_name').allTextContents();
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  test('TC-Search-005 — all products have non-empty descriptions', async ({ page }) => {
    await page.goto('/inventory.html');

    const descriptions = await page.locator('.inventory_item_desc').allTextContents();
    for (const desc of descriptions) {
      expect(desc.trim().length).toBeGreaterThan(0);
    }
  });

  test('TC-Search-006 — sort by price low to high shows lowest price first', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    const firstPrice = await page.locator('.inventory_item_price').first().textContent();
    const numericFirst = parseFloat(firstPrice.replace('$', ''));

    expect(numericFirst).toBe(7.99);
  });

  test('TC-Search-007 — sort by price high to low shows highest price first', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');

    const firstPrice = await page.locator('.inventory_item_price').first().textContent();
    const numericFirst = parseFloat(firstPrice.replace('$', ''));

    expect(numericFirst).toBe(49.99);
  });

  test('TC-Search-008 — cart count persists after sorting', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('[data-test="product-sort-container"]').selectOption('za');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-Search-009 — product image is visible for all items', async ({ page }) => {
    await page.goto('/inventory.html');

    const images = page.locator('.inventory_item_img img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toBeVisible();
      const src = await images.nth(i).getAttribute('src');
      expect(src).not.toBeNull();
      expect(src.length).toBeGreaterThan(0);
    }
  });

  test('TC-Search-010 — clicking product image opens product detail', async ({ page }) => {
    await page.goto('/inventory.html');

    await page.locator('.inventory_item_img').first().click();
    await expect(page).toHaveURL(/inventory-item\.html/);
  });

});