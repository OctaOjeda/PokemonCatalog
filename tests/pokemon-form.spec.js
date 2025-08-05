import { test, expect } from '@playwright/test';

test.describe('Pokemon Create Form', () => {
  test.beforeEach(async ({ page }) => {
    // First navigate to login and then to create pokemon
    // For this test, we'll assume the user is already logged in or we'll skip auth
    await page.goto('/pokemon-create');
  });

  test('renders all required fields', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="image"]')).toBeVisible();
    await expect(page.locator('select[name="type"]')).toBeVisible();
    await expect(page.locator('select[name="type2"]')).toBeVisible();
    await expect(page.locator('input[name="isLegendary"]')).toBeVisible();
    await expect(page.locator('input[name="isNormal"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('shows validation errors for empty required fields', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=Name is required').first()).toBeVisible();
    await expect(page.locator('text=Image URL is required').first()).toBeVisible();
    await expect(page.locator('text=Type 1 is required').first()).toBeVisible();
  });

  test('shows validation error for short name', async ({ page }) => {
    await page.locator('input[name="name"]').fill('A');
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=Name must be at least 2 characters').first()).toBeVisible();
  });

  test('shows validation error for long name', async ({ page }) => {
    const longName = 'a'.repeat(51);
    await page.locator('input[name="name"]').fill(longName);
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=Name must be less than 50 characters').first()).toBeVisible();
  });

  test('shows validation error for invalid image URL', async ({ page }) => {
    await page.locator('input[name="image"]').fill('invalid-url');
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=Must be a valid URL').first()).toBeVisible();
  });

  test('shows validation error when same type is selected for both types', async ({ page }) => {
    // Wait for types to load
    await page.waitForTimeout(1000);
    
    await page.locator('select[name="type"]').selectOption('fire');
    await page.locator('select[name="type2"]').selectOption('fire');
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=Type 1 and Type 2 cannot be the same').first()).toBeVisible();
  });

  test('legendary and normal checkboxes are mutually exclusive', async ({ page }) => {
    const legendaryCheckbox = page.locator('input[name="isLegendary"]');
    const normalCheckbox = page.locator('input[name="isNormal"]');
    
    // Initially normal should be checked
    await expect(normalCheckbox).toBeChecked();
    await expect(legendaryCheckbox).not.toBeChecked();
    
    // Click legendary
    await legendaryCheckbox.click();
    await expect(legendaryCheckbox).toBeChecked();
    await expect(normalCheckbox).not.toBeChecked();
    
    // Click normal
    await normalCheckbox.click();
    await expect(normalCheckbox).toBeChecked();
    await expect(legendaryCheckbox).not.toBeChecked();
  });

  test('form accepts valid data', async ({ page }) => {
    // Wait for types to load
    await page.waitForTimeout(1000);
    
    await page.locator('input[name="name"]').fill('Pikachu');
    await page.locator('input[name="image"]').fill('https://example.com/pikachu.png');
    await page.locator('select[name="type"]').selectOption('electric');
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).not.toBeDisabled();
    
    // Click submit - should attempt to make API call
    await submitButton.click();
    
    // Should show loading state
    await expect(page.locator('text=Saving...')).toBeVisible();
    await expect(page.locator('button:has-text("Saving...")')).toBeDisabled();
  });

  test('cancel button navigates back', async ({ page }) => {
    const cancelButton = page.locator('button:has-text("Cancel")');
    await expect(cancelButton).toBeVisible();
    
    await cancelButton.click();
    await expect(page).toHaveURL('/pokemons');
  });

  test('input fields have correct placeholders', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toHaveAttribute('placeholder', 'Enter Pokémon name');
    await expect(page.locator('input[name="image"]')).toHaveAttribute('placeholder', 'Enter image URL');
  });
});