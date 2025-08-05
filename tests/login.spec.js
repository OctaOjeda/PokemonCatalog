import { test, expect } from '@playwright/test';

test.describe('Login Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('renders all required fields', async ({ page }) => {
    await expect(page.locator('input[name="identifier"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('shows validation errors for empty fields', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=Email/Username is required').first()).toBeVisible();
    await expect(page.locator('text=Password is required').first()).toBeVisible();
  });

  test('shows validation error for short identifier', async ({ page }) => {
    await page.locator('input[name="identifier"]').fill('ab');
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=Email/Username must be at least 3 characters').first()).toBeVisible();
  });

  test('shows validation error for short password', async ({ page }) => {
    await page.locator('input[name="password"]').fill('12345');
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=Password must be at least 6 characters').first()).toBeVisible();
  });

  test('enables submit button with valid data', async ({ page }) => {
    await page.locator('input[name="identifier"]').fill('testuser');
    await page.locator('input[name="password"]').fill('password123');
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).not.toBeDisabled();
    
    // Click submit - should attempt to make API call
    await submitButton.click();
    
    // Should show loading state
    await expect(page.locator('text=Logging in...')).toBeVisible();
    await expect(page.locator('button:has-text("Logging in...")')).toBeDisabled();
  });

  test('renders register link', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: 'Register' });
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute('href', '/register');
  });

  test('input fields have correct types and placeholders', async ({ page }) => {
    await expect(page.locator('input[name="identifier"]')).toHaveAttribute('type', 'text');
    await expect(page.locator('input[name="identifier"]')).toHaveAttribute('placeholder', 'Enter email or username');
    
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('placeholder', 'Enter password');
  });
});