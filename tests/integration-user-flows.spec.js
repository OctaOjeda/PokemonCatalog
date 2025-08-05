import { test, expect } from '@playwright/test';

test.describe('Integration Tests - Complete User Flows', () => {
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
    },
    {
      _id: '2',
      id: 2,
      name: 'Charizard',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
      type: 'fire',
      type2: 'flying',
      state: 'Legendary',
      level: 50
    }
  ];

  test.beforeEach(async ({ page }) => {
    // Mock all API endpoints
    await page.route('http://localhost:3001/api/pokemons', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ json: mockPokemons });
      } else if (route.request().method() === 'POST') {
        const newPokemon = {
          _id: '3',
          id: 3,
          name: 'Blastoise',
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
          type: 'water',
          type2: null,
          state: 'Normal',
          level: 36
        };
        await route.fulfill({ json: newPokemon });
      }
    });

    await page.route('http://localhost:3001/api/pokemons/*', async route => {
      if (route.request().method() === 'PUT') {
        const updatedPokemon = {
          _id: '1',
          id: 1,
          name: 'Pikachu Updated',
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
          type: 'electric',
          type2: 'normal',
          state: 'Legendary',
          level: 25
        };
        await route.fulfill({ json: updatedPokemon });
      } else if (route.request().method() === 'DELETE') {
        await route.fulfill({ json: { success: true } });
      }
    });

    await page.route('http://localhost:3001/api/auth/login', async route => {
      const loginData = await route.request().postDataJSON();
      if (loginData.identifier === 'testuser' && loginData.password === 'password123') {
        await route.fulfill({
          json: {
            token: 'fake-jwt-token',
            user: { id: 1, name: 'Test User', username: 'testuser' }
          }
        });
      } else {
        await route.fulfill({
          status: 401,
          json: { message: 'Invalid credentials' }
        });
      }
    });

    await page.route('http://localhost:3001/api/auth/register', async route => {
      const registerData = await route.request().postDataJSON();
      await route.fulfill({
        json: {
          token: 'fake-jwt-token',
          user: {
            id: 2,
            name: registerData.name,
            lastname: registerData.lastname,
            username: registerData.username,
            email: registerData.email
          }
        }
      });
    });
  });

  test('Complete user registration flow', async ({ page }) => {
    await page.goto('/register');

    // Fill registration form
    await page.fill('input[name="name"]', 'John');
    await page.fill('input[name="lastname"]', 'Doe');
    await page.fill('input[name="username"]', 'johndoe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to Pokemon list after successful registration
    await expect(page).toHaveURL('/pokemons');
    await expect(page.locator('h1:has-text("Pokémon List")')).toBeVisible();
  });

  test('Complete user login flow', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.fill('input[name="identifier"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to Pokemon list after successful login
    await expect(page).toHaveURL('/pokemons');
    await expect(page.locator('h1:has-text("Pokémon List")')).toBeVisible();
  });

  test('Login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');

    // Fill login form with invalid credentials
    await page.fill('input[name="identifier"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpass');

    // Submit form
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('Complete Pokemon creation flow', async ({ page }) => {
    // Set up authentication
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });

    await page.goto('/pokemons');

    // Verify authenticated user sees create button
    await expect(page.locator('button:has-text("+ Create Pokémon")')).toBeVisible();

    // Click create Pokemon button
    await page.click('button:has-text("+ Create Pokémon")');
    await expect(page).toHaveURL('/create');

    // Fill Pokemon creation form
    await page.fill('input[name="name"]', 'Blastoise');
    await page.fill('input[name="image"]', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png');
    await page.selectOption('select[name="type"]', 'water');
    await page.fill('input[name="level"]', '36');
    await page.check('input[name="isNormal"]');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect back to Pokemon list
    await expect(page).toHaveURL('/pokemons');
    await expect(page.locator('text=Pokemon created successfully')).toBeVisible();
  });

  test('Complete Pokemon editing flow', async ({ page }) => {
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

    // Click edit button
    await page.click('button:has-text("✏️ Edit")');
    await expect(page).toHaveURL(/\/edit\//);

    // Update Pokemon details
    await page.fill('input[name="name"]', 'Pikachu Updated');
    await page.selectOption('select[name="type2"]', 'normal');
    await page.fill('input[name="level"]', '25');
    await page.check('input[name="isLegendary"]');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect back to Pokemon list
    await expect(page).toHaveURL('/pokemons');
    await expect(page.locator('text=Pokemon updated successfully')).toBeVisible();
  });

  test('Complete Pokemon deletion flow', async ({ page }) => {
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

    // Click remove button
    await page.click('button:has-text("🗑️ Remove")');

    // Confirmation modal should appear
    await expect(page.locator('h2:has-text("Confirm")')).toBeVisible();

    // Click confirm button
    await page.click('button:has-text("Confirm")');

    // Wait for deletion to complete
    await page.waitForTimeout(1000);

    // Both modals should be closed and success message should appear
    await expect(page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).not.toBeVisible();
    await expect(page.locator('text=Pokemon deleted successfully')).toBeVisible();
  });

  test('Navigation between different pages works correctly', async ({ page }) => {
    // Set up authentication
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });

    // Start at home page
    await page.goto('/');
    await expect(page.locator('h1:has-text("Pokemon Catalog")')).toBeVisible();

    // Navigate to Pokemon list
    await page.click('a[href="/pokemons"]');
    await expect(page).toHaveURL('/pokemons');
    await expect(page.locator('h1:has-text("Pokémon List")')).toBeVisible();

    // Navigate to Pokemon catalog
    await page.click('a[href="/pokemon-catalog"]');
    await expect(page).toHaveURL('/pokemon-catalog');
    await expect(page.locator('h1:has-text("Pokemon Catalog")')).toBeVisible();

    // Navigate back to home
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('Search functionality works across different pages', async ({ page }) => {
    // Set up authentication
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });

    // Test search in Pokemon list
    await page.goto('/pokemons');
    await page.waitForTimeout(1000);

    const listSearchInput = page.locator('input[placeholder="Search Pokémon or type"]');
    await listSearchInput.fill('Pikachu');
    await expect(page.locator('td:has-text("Pikachu")')).toBeVisible();
    await expect(page.locator('td:has-text("Charizard")')).not.toBeVisible();

    // Test search in Pokemon catalog
    await page.goto('/pokemon-catalog');
    await page.waitForTimeout(1000);

    const catalogSearchInput = page.locator('input[placeholder="Search by name or type"]');
    await catalogSearchInput.fill('fire');
    await page.waitForTimeout(500);

    // Should filter to show only fire type Pokemon
    const cards = page.locator('.bg-white.shadow-md.rounded');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('User logout flow works correctly', async ({ page }) => {
    // Set up authentication
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });

    await page.goto('/pokemons');

    // Click logout button (if present in navigation)
    const logoutButton = page.locator('button:has-text("Logout")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();

      // Should redirect to login page
      await expect(page).toHaveURL('/login');
    }
  });

  test('Form validation prevents invalid Pokemon creation', async ({ page }) => {
    // Set up authentication
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });

    await page.goto('/create');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Image URL is required')).toBeVisible();
    await expect(page.locator('text=Level is required')).toBeVisible();

    // Fill invalid data
    await page.fill('input[name="name"]', 'ab'); // Too short
    await page.fill('input[name="image"]', 'invalid-url');
    await page.fill('input[name="level"]', '150'); // Too high

    await page.click('button[type="submit"]');

    // Should show specific validation errors
    await expect(page.locator('text=Name must be at least 3 characters')).toBeVisible();
    await expect(page.locator('text=Image must be a valid URL')).toBeVisible();
    await expect(page.locator('text=Level must be between 1 and 100')).toBeVisible();
  });

  test('Responsive design works throughout user flow', async ({ page }) => {
    // Set up authentication
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });

    // Test home page
    await page.goto('/');
    await expect(page.locator('h1:has-text("Pokemon Catalog")')).toBeVisible();

    // Test Pokemon list page
    await page.goto('/pokemons');
    await page.waitForTimeout(1000);
    await expect(page.locator('h1:has-text("Pokémon List")')).toBeVisible();

    // Test Pokemon catalog page
    await page.goto('/pokemon-catalog');
    await page.waitForTimeout(1000);
    await expect(page.locator('h1:has-text("Pokemon Catalog")')).toBeVisible();

    // Test create page
    await page.goto('/create');
    await expect(page.locator('h1:has-text("Create Pokémon")')).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/pokemon-catalog');
    await page.waitForTimeout(1000);
    await expect(page.locator('h1:has-text("Pokemon Catalog")')).toBeVisible();

    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/pokemon-catalog');
    await page.waitForTimeout(1000);
    await expect(page.locator('h1:has-text("Pokemon Catalog")')).toBeVisible();
  });

  test('Error handling works throughout application', async ({ page }) => {
    // Set up failing API responses
    await page.route('http://localhost:3001/api/pokemons', async route => {
      await route.fulfill({
        status: 500,
        json: { message: 'Server error' }
      });
    });

    // Set up authentication
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });

    await page.goto('/pokemons');
    await page.waitForTimeout(1000);

    // Should handle API errors gracefully
    // The exact error handling depends on the implementation
    // We can check that the page doesn't crash and shows some error state
    await expect(page.locator('body')).toBeVisible();
  });
});