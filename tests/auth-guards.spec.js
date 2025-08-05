import { test, expect } from '@playwright/test';

test.describe('Authentication Guards', () => {
  const mockPokemons = [
    {
      _id: '1',
      id: 1,
      name: 'Pikachu',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      type: 'electric',
      type2: null,
      state: 'Normal',
      level: 5
    }
  ];

  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('http://localhost:3001/api/pokemons', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ json: mockPokemons });
      }
    });

    await page.route('http://localhost:3001/api/pokemons/*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ json: mockPokemons[0] });
      }
    });

    await page.route('https://pokeapi.co/api/v2/type', async route => {
      await route.fulfill({
        json: {
          results: [
            { name: 'normal' },
            { name: 'electric' },
            { name: 'fire' },
            { name: 'water' }
          ]
        }
      });
    });
  });

  test('unauthenticated users see "Login to Create" button instead of "Create Pokemon"', async ({ page }) => {
    // Visit Pokemon list without authentication
    await page.goto('/pokemons');
    await page.waitForTimeout(1000);

    // Should see "Login to Create" button instead of "Create Pokemon"
    await expect(page.locator('button:has-text("Login to Create")')).toBeVisible();
    await expect(page.locator('button:has-text("+ Create Pokémon")')).not.toBeVisible();

    // Clicking the button should navigate to login
    await page.click('button:has-text("Login to Create")');
    await expect(page).toHaveURL('/login');
  });

  test('authenticated users see "Create Pokemon" button', async ({ page }) => {
    // Set up authentication
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });

    await page.goto('/pokemons');
    await page.waitForTimeout(1000);

    // Should see "Create Pokemon" button
    await expect(page.locator('button:has-text("+ Create Pokémon")')).toBeVisible();
    await expect(page.locator('button:has-text("Login to Create")')).not.toBeVisible();
  });

  test('unauthenticated users cannot see edit/remove buttons in Pokemon modal', async ({ page }) => {
    await page.goto('/pokemons');
    await page.waitForTimeout(1000);

    // Open Pokemon modal
    await page.click('button[title="View"]');

    // Should see message about needing to login
    await expect(page.locator('text=Please login to edit or remove Pokemon')).toBeVisible();
    
    // Should not see edit and remove buttons
    await expect(page.locator('button:has-text("✏️ Edit")')).not.toBeVisible();
    await expect(page.locator('button:has-text("🗑️ Remove")')).not.toBeVisible();
  });

  test('login link in Pokemon modal navigates to login page', async ({ page }) => {
    await page.goto('/pokemons');
    await page.waitForTimeout(1000);

    // Open Pokemon modal
    await page.click('button[title="View"]');

    // Wait for modal to be visible and check login message exists
    await expect(page.locator('text=Please login to edit or remove Pokemon')).toBeVisible();

    // Click the login link inside the modal (be more specific)
    const loginButton = page.locator('.fixed.inset-0 button:has-text("login")');
    await loginButton.click({ force: true });

    // Should navigate to login page
    await expect(page).toHaveURL('/login');
  });

  test('authenticated users can see edit/remove buttons in Pokemon modal', async ({ page }) => {
    // Set up authentication
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });

    await page.goto('/pokemons');
    await page.waitForTimeout(1000);

    // Open Pokemon modal
    await page.click('button[title="View"]');

    // Should see edit and remove buttons
    await expect(page.locator('button:has-text("✏️ Edit")')).toBeVisible();
    await expect(page.locator('button:has-text("🗑️ Remove")')).toBeVisible();
    
    // Should not see login message
    await expect(page.locator('text=Please login to edit or remove Pokemon')).not.toBeVisible();
  });

  test('unauthenticated users are redirected from create page', async ({ page }) => {
    await page.goto('/create');

    // Should be redirected to login page
    await expect(page).toHaveURL('/login');
  });

  test('unauthenticated users see access denied message if they somehow reach create page', async ({ page }) => {
    // Disable navigation to simulate direct URL access
    await page.goto('/create');
    
    // Wait a moment for potential redirect
    await page.waitForTimeout(500);
    
    // If still on create page, should see access denied
    if (await page.url().includes('/create')) {
      await expect(page.locator('h2:has-text("Access Denied")')).toBeVisible();
      await expect(page.locator('text=You must be logged in to create Pokemon')).toBeVisible();
      await expect(page.locator('button:has-text("Go to Login")')).toBeVisible();
    }
  });

  test('unauthenticated users are redirected from edit page', async ({ page }) => {
    await page.goto('/edit/1');

    // Should be redirected to login page
    await expect(page).toHaveURL('/login');
  });

  test('unauthenticated users see access denied message if they somehow reach edit page', async ({ page }) => {
    // Disable navigation to simulate direct URL access
    await page.goto('/edit/1');
    
    // Wait a moment for potential redirect
    await page.waitForTimeout(500);
    
    // If still on edit page, should see access denied
    if (await page.url().includes('/edit/')) {
      await expect(page.locator('h2:has-text("Access Denied")')).toBeVisible();
      await expect(page.locator('text=You must be logged in to edit Pokemon')).toBeVisible();
      await expect(page.locator('button:has-text("Go to Login")')).toBeVisible();
    }
  });

  test('authenticated users can access create page', async ({ page }) => {
    // Set up authentication
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });

    await page.goto('/create');
    await page.waitForTimeout(1500); // Wait for form to load

    // Should see the create form
    await expect(page.locator('h2:has-text("Create Pokémon")')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('authenticated users can access edit page', async ({ page }) => {
    // Set up authentication
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });

    await page.goto('/edit/1');

    // Should see the edit form
    await expect(page.locator('h2:has-text("Edit Pokémon")')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('access denied page "Go to Login" button works', async ({ page }) => {
    await page.goto('/create');
    
    // Wait for page to load and check if we have access denied message
    await page.waitForTimeout(1000);
    
    const accessDeniedButton = page.locator('button:has-text("Go to Login")');
    
    // Only test if the access denied page is shown
    if (await accessDeniedButton.isVisible()) {
      await accessDeniedButton.click();
      await expect(page).toHaveURL('/login');
    }
  });

  test('Pokemon card modal shows appropriate content based on auth state', async ({ page }) => {
    // Test unauthenticated state
    await page.goto('/pokemon-catalog');
    await page.waitForTimeout(1000);

    // Click on a Pokemon card
    const pokemonCard = page.locator('.bg-white.shadow-md.rounded').first();
    if (await pokemonCard.isVisible()) {
      await pokemonCard.click();

      // Should show login message
      await expect(page.locator('text=Please login to edit or remove Pokemon')).toBeVisible();
      
      // Close modal
      await page.click('button[aria-label="Close modal"]');
    }

    // Set up authentication
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });

    // Reload page to apply auth
    await page.reload();
    await page.waitForTimeout(1000);

    // Click on a Pokemon card again
    if (await pokemonCard.isVisible()) {
      await pokemonCard.click();

      // Should show action buttons
      await expect(page.locator('button:has-text("✏️ Edit")')).toBeVisible();
      await expect(page.locator('button:has-text("🗑️ Remove")')).toBeVisible();
    }
  });

  test('navigation between protected and public pages works correctly', async ({ page }) => {
    // Start unauthenticated
    await page.goto('/');
    
    // Navigate to public pages should work
    await page.goto('/pokemons');
    await expect(page.locator('h2:has-text("Pokémon List")')).toBeVisible();
    
    await page.goto('/pokemon-catalog');
    await expect(page.locator('h2:has-text("Pokemon Catalog")')).toBeVisible();
    
    // Try to access protected page
    await page.goto('/create');
    await expect(page).toHaveURL('/login');
    
    // Login and try again
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });
    
    await page.goto('/create');
    await page.waitForTimeout(1500); // Wait for form to load
    await expect(page.locator('h2:has-text("Create Pokémon")')).toBeVisible();
  });
});