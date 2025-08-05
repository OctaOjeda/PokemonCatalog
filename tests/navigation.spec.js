import { test, expect } from '@playwright/test';

test.describe('Navigation Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders logo and brand name', async ({ page }) => {
    // Check logo image
    const logo = page.locator('img[alt="Pokemon Logo"]');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png');
    
    // Check brand name
    await expect(page.locator('text=PokéApp')).toBeVisible();
  });

  test('renders navigation links', async ({ page }) => {
    // Check main navigation links
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pokemon Catalog' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pokemon List' })).toBeVisible();
    
    // Check links have correct href attributes
    await expect(page.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    await expect(page.getByRole('link', { name: 'Pokemon Catalog' })).toHaveAttribute('href', '/pokemon-catalog');
    await expect(page.getByRole('link', { name: 'Pokemon List' })).toHaveAttribute('href', '/pokemons');
  });

  test('shows login and register buttons when not logged in', async ({ page }) => {
    // Check login button
    const loginButton = page.getByRole('link', { name: 'Login' });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveAttribute('href', '/login');
    
    // Check register button
    const registerButton = page.getByRole('link', { name: 'Register' });
    await expect(registerButton).toBeVisible();
    await expect(registerButton).toHaveAttribute('href', '/register');
  });

  test('navigation links are clickable and navigate correctly', async ({ page }) => {
    // Test Home link
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');
    
    // Test Pokemon Catalog link
    await page.getByRole('link', { name: 'Pokemon Catalog' }).click();
    await expect(page).toHaveURL('/pokemon-catalog');
    
    // Test Pokemon List link
    await page.getByRole('link', { name: 'Pokemon List' }).click();
    await expect(page).toHaveURL('/pokemons');
  });

  test('login button navigates to login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL('/login');
  });

  test('register button navigates to register page', async ({ page }) => {
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL('/register');
  });

  test('navigation has proper styling classes', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toHaveClass(/bg-white/);
    await expect(nav).toHaveClass(/shadow-md/);
    
    // Check brand text styling
    const brandText = page.locator('text=PokéApp');
    await expect(brandText).toHaveClass(/text-purple-600/);
    await expect(brandText).toHaveClass(/font-bold/);
  });

  test('navigation is responsive - mobile menu hidden on desktop', async ({ page }) => {
    // Navigation links should be hidden on mobile (md:flex class)
    const navLinks = page.locator('.hidden.md\\:flex');
    await expect(navLinks).toBeVisible();
  });
});

test.describe('Navigation Component - Logged In State', () => {
  test.beforeEach(async ({ page }) => {
    // Mock user being logged in by setting localStorage
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });
    await page.goto('/');
  });

  test('shows logout button when logged in', async ({ page }) => {
    // Wait for component to recognize login state
    await page.waitForTimeout(500);
    
    // Check logout button appears
    const logoutButton = page.locator('button:has-text("Logout")');
    await expect(logoutButton).toBeVisible();
    
    // Login button should not be visible
    const loginLink = page.getByRole('link', { name: 'Login' });
    await expect(loginLink).not.toBeVisible();
  });

  test('logout button clears user data and shows login button', async ({ page }) => {
    // Wait for component to recognize login state
    await page.waitForTimeout(500);
    
    // Click logout
    const logoutButton = page.locator('button:has-text("Logout")');
    await logoutButton.click();
    
    // Wait for state change
    await page.waitForTimeout(500);
    
    // Login button should now be visible
    const loginLink = page.getByRole('link', { name: 'Login' });
    await expect(loginLink).toBeVisible();
    
    // Logout button should not be visible
    await expect(logoutButton).not.toBeVisible();
  });
});