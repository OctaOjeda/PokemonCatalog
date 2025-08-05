import { test, expect } from '@playwright/test';

test.describe('Register Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the register page
    await page.goto('/register');
  });

  test('renders all required fields', async ({ page }) => {
    // Check if all required form fields are present using specific selectors
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="lastname"]')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('renders submit button', async ({ page }) => {
    // Check if the submit button is present and has correct attributes
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText('Register');
  });

  test('renders login link (acts as cancel)', async ({ page }) => {
    // Check if the login link is present in the register form area
    const loginLink = page.locator('form').locator('..').getByRole('link', { name: 'Login' });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('renders register heading', async ({ page }) => {
    // Check if the register heading is displayed
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  });

  test('shows validation errors for empty fields', async ({ page }) => {
    // Click submit without filling any fields
    await page.locator('button[type="submit"]').click();

    // Wait a bit for validation to trigger
    await page.waitForTimeout(500);

    // Check that validation errors appear - using more specific selectors
    await expect(page.locator('text=Name is required').first()).toBeVisible();
    await expect(page.locator('text=Lastname is required').first()).toBeVisible();
    await expect(page.locator('text=Username is required').first()).toBeVisible();
    await expect(page.locator('text=Email is required').first()).toBeVisible();
    await expect(page.locator('text=Password is required').first()).toBeVisible();
  });

  test('shows validation error for invalid email format', async ({ page }) => {
    // Fill in an invalid email
    await page.locator('input[name="email"]').fill('invalid-email');
    await page.locator('button[type="submit"]').click();

    // Wait for validation
    await page.waitForTimeout(500);

    // Check that email validation error appears
    await expect(page.locator('text=Invalid email format').first()).toBeVisible();
  });

  test('shows validation error for short name', async ({ page }) => {
    // Fill in a name that's too short
    await page.locator('input[name="name"]').fill('A');
    await page.locator('button[type="submit"]').click();

    // Wait for validation
    await page.waitForTimeout(500);

    // Check that name length validation error appears
    await expect(page.locator('text=Name must be at least 2 characters').first()).toBeVisible();
  });

  test('shows validation error for short lastname', async ({ page }) => {
    // Fill in a lastname that's too short
    await page.locator('input[name="lastname"]').fill('B');
    await page.locator('button[type="submit"]').click();

    // Wait for validation
    await page.waitForTimeout(500);

    // Check that lastname length validation error appears
    await expect(page.locator('text=Lastname must be at least 2 characters').first()).toBeVisible();
  });

  test('shows validation error for short username', async ({ page }) => {
    // Fill in a username that's too short
    await page.locator('input[name="username"]').fill('ab');
    await page.locator('button[type="submit"]').click();

    // Wait for validation
    await page.waitForTimeout(500);

    // Check that username length validation error appears
    await expect(page.locator('text=Username must be at least 3 characters').first()).toBeVisible();
  });

  test('shows validation error for invalid username characters', async ({ page }) => {
    // Fill in a username with invalid characters
    await page.locator('input[name="username"]').fill('user@name');
    await page.locator('button[type="submit"]').click();

    // Wait for validation
    await page.waitForTimeout(500);

    // Check that username format validation error appears
    await expect(page.locator('text=Username can only contain letters, numbers, and underscores').first()).toBeVisible();
  });

  test('shows validation error for weak password', async ({ page }) => {
    // Fill in a weak password
    await page.locator('input[name="password"]').fill('weakpass');
    await page.locator('button[type="submit"]').click();

    // Wait for validation
    await page.waitForTimeout(500);

    // Check that password strength validation error appears
    await expect(page.locator('text=Password must contain at least one uppercase letter, one lowercase letter, and one number').first()).toBeVisible();
  });

  test('shows validation error for short password', async ({ page }) => {
    // Fill in a password that's too short
    await page.locator('input[name="password"]').fill('12345');
    await page.locator('button[type="submit"]').click();

    // Wait for validation
    await page.waitForTimeout(500);

    // Check that password length validation error appears
    await expect(page.locator('text=Password must be at least 6 characters').first()).toBeVisible();
  });

  test('validates field length limits', async ({ page }) => {
    // Fill in fields that exceed maximum length
    const longString = 'a'.repeat(51);
    const longUsername = 'a'.repeat(21);
    
    await page.locator('input[name="name"]').fill(longString);
    await page.locator('input[name="lastname"]').fill(longString);
    await page.locator('input[name="username"]').fill(longUsername);
    
    await page.locator('button[type="submit"]').click();

    // Wait for validation
    await page.waitForTimeout(500);

    // Check that length limit validation errors appear
    await expect(page.locator('text=Name must be less than 50 characters').first()).toBeVisible();
    await expect(page.locator('text=Lastname must be less than 50 characters').first()).toBeVisible();
    await expect(page.locator('text=Username must be less than 20 characters').first()).toBeVisible();
  });

  test('accepts valid username with underscores and numbers', async ({ page }) => {
    // Fill in all fields with valid data including username with underscores and numbers
    await page.locator('input[name="name"]').fill('John');
    await page.locator('input[name="lastname"]').fill('Doe');
    await page.locator('input[name="username"]').fill('john_doe123');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('input[name="password"]').fill('Password123');
    
    await page.locator('button[type="submit"]').click();

    // Wait a bit for any validation to appear
    await page.waitForTimeout(500);

    // Since we don't have a backend running, we expect no validation errors
    await expect(page.locator('text=Name is required')).not.toBeVisible();
    await expect(page.locator('text=Username can only contain letters, numbers, and underscores')).not.toBeVisible();
  });

  test('form submission disables button while submitting', async ({ page }) => {
    // Fill in valid data
    await page.locator('input[name="name"]').fill('John');
    await page.locator('input[name="lastname"]').fill('Doe');
    await page.locator('input[name="username"]').fill('johndoe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('input[name="password"]').fill('Password123');
    
    // Click submit and check that button becomes disabled and shows loading text
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // The button should show "Registering..." and be disabled
    await expect(page.locator('text=Registering...')).toBeVisible();
    await expect(page.locator('button:has-text("Registering...")')).toBeDisabled();
  });

  test('login link navigates to login page', async ({ page }) => {
    // Click the login link in the register form area
    await page.locator('form').locator('..').getByRole('link', { name: 'Login' }).click();
    
    // Check that we navigated to the login page
    await expect(page).toHaveURL('/login');
  });

  test('all input fields have proper placeholders', async ({ page }) => {
    // Check that all input fields have the expected placeholders
    await expect(page.locator('input[name="name"]')).toHaveAttribute('placeholder', 'Enter name');
    await expect(page.locator('input[name="lastname"]')).toHaveAttribute('placeholder', 'Enter lastname');
    await expect(page.locator('input[name="username"]')).toHaveAttribute('placeholder', 'Enter username');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('placeholder', 'Enter email');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('placeholder', 'Enter password');
  });

  test('input fields have correct types', async ({ page }) => {
    // Check that input fields have the correct type attributes
    await expect(page.locator('input[name="name"]')).toHaveAttribute('type', 'text');
    await expect(page.locator('input[name="lastname"]')).toHaveAttribute('type', 'text');
    await expect(page.locator('input[name="username"]')).toHaveAttribute('type', 'text');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('type', 'email');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
  });
});