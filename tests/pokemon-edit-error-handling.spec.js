const { test, expect } = require('@playwright/test');

test.describe('Pokemon Edit - Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the Pokemon API to simulate authentication and types
    await page.route('http://localhost:3001/api/pokemons/*', async route => {
      const url = route.request().url();
      const pokemonId = url.split('/').pop();
      
      // Simulate different error scenarios based on ID
      if (pokemonId === '999999') {
        // 404 - Pokemon not found
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Pokemon not found' })
        });
      } else if (pokemonId === 'invalid') {
        // 400 - Invalid ID format
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Invalid ID format' })
        });
      } else if (pokemonId === 'servererror') {
        // 500 - Server error
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal server error' })
        });
      } else {
        // Valid Pokemon data for testing success case
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            _id: pokemonId,
            name: 'Test Pokemon',
            image: 'https://example.com/test.png',
            type: 'fire',
            type2: 'flying',
            state: 'Normal',
            level: 25
          })
        });
      }
    });

    // Mock Pokemon types API
    await page.route('https://pokeapi.co/api/v2/type', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            { name: 'fire' },
            { name: 'water' },
            { name: 'grass' },
            { name: 'electric' },
            { name: 'flying' }
          ]
        })
      });
    });

    // Set up authentication mock by navigating to the page first
    await page.goto('http://localhost:3000/');
    await page.evaluate(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });
  });

  test('displays loading state initially', async ({ page }) => {
    await page.goto('http://localhost:3000/edit/123');
    
    // Should show loading state
    await expect(page.locator('text=Loading Pokémon...')).toBeVisible();
    await expect(page.locator('.animate-spin')).toBeVisible();
  });

  test('displays 404 error message for non-existent Pokemon ID', async ({ page }) => {
    await page.goto('http://localhost:3000/edit/999999');
    
    // Wait for loading to finish and error to appear
    await expect(page.locator('text=Loading Pokémon...')).toBeHidden({ timeout: 10000 });
    
    // Should show error state
    await expect(page.locator('h2:has-text("Error")')).toBeVisible();
    await expect(page.locator('text=Pokemon not found. Please check the ID and try again.')).toBeVisible();
    
    // Should show action buttons
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
    await expect(page.locator('button:has-text("Back to List")')).toBeVisible();
  });

  test('displays invalid ID error message for malformed ID', async ({ page }) => {
    await page.goto('http://localhost:3000/edit/invalid');
    
    // Wait for loading to finish and error to appear
    await expect(page.locator('text=Loading Pokémon...')).toBeHidden({ timeout: 10000 });
    
    // Should show error state
    await expect(page.locator('h2:has-text("Error")')).toBeVisible();
    await expect(page.locator('text=Invalid Pokemon ID. Please verify the ID is correct.')).toBeVisible();
    
    // Should show action buttons
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
    await expect(page.locator('button:has-text("Back to List")')).toBeVisible();
  });

  test('displays server error message for 500 errors', async ({ page }) => {
    await page.goto('http://localhost:3000/edit/servererror');
    
    // Wait for loading to finish and error to appear
    await expect(page.locator('text=Loading Pokémon...')).toBeHidden({ timeout: 10000 });
    
    // Should show error state
    await expect(page.locator('h2:has-text("Error")')).toBeVisible();
    await expect(page.locator('text=Failed to load Pokemon data. Please try again later.')).toBeVisible();
    
    // Should show action buttons
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
    await expect(page.locator('button:has-text("Back to List")')).toBeVisible();
  });

  test('Try Again button retries the API call', async ({ page }) => {
    let apiCallCount = 0;
    
    // Track API calls
    await page.route('http://localhost:3001/api/pokemons/999999', async route => {
      apiCallCount++;
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Pokemon not found' })
      });
    });
    
    await page.goto('http://localhost:3000/edit/999999');
    
    // Wait for error to appear
    await expect(page.locator('text=Pokemon not found. Please check the ID and try again.')).toBeVisible();
    
    // Click Try Again
    await page.locator('button:has-text("Try Again")').click();
    
    // Should show loading again
    await expect(page.locator('text=Loading Pokémon...')).toBeVisible();
    
    // Should make another API call
    await expect(page.locator('text=Pokemon not found. Please check the ID and try again.')).toBeVisible();
    
    // Verify API was called twice
    expect(apiCallCount).toBe(2);
  });

  test('Back to List button navigates to Pokemon list', async ({ page }) => {
    await page.goto('http://localhost:3000/edit/999999');
    
    // Wait for error to appear
    await expect(page.locator('text=Pokemon not found. Please check the ID and try again.')).toBeVisible();
    
    // Click Back to List
    await page.locator('button:has-text("Back to List")').click();
    
    // Should navigate to Pokemon list
    await expect(page).toHaveURL('http://localhost:3000/pokemons');
  });

  test('successfully loads valid Pokemon and shows form', async ({ page }) => {
    await page.goto('http://localhost:3000/edit/123');
    
    // Wait for loading to finish
    await expect(page.locator('text=Loading Pokémon...')).toBeHidden({ timeout: 10000 });
    
    // Should show the form
    await expect(page.locator('h2:has-text("Edit Pokémon")')).toBeVisible();
    
    // Should not show error
    await expect(page.locator('h2:has-text("Error")')).not.toBeVisible();
    
    // Should show form fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="image"]')).toBeVisible();
    await expect(page.locator('select[name="type"]')).toBeVisible();
    await expect(page.locator('input[name="level"]')).toBeVisible();
    
    // Should show populated data
    await expect(page.locator('input[name="name"]')).toHaveValue('Test Pokemon');
    await expect(page.locator('input[name="level"]')).toHaveValue('25');
    
    // Should show checkboxes with correct state
    await expect(page.locator('input[name="isNormal"]')).toBeChecked();
    await expect(page.locator('input[name="isLegendary"]')).not.toBeChecked();
  });

  test('error state has proper styling and accessibility', async ({ page }) => {
    await page.goto('http://localhost:3000/edit/999999');
    
    // Wait for error to appear
    await expect(page.locator('text=Pokemon not found. Please check the ID and try again.')).toBeVisible();
    
    // Check styling classes
    const errorContainer = page.locator('div:has(h2:has-text("Error"))');
    await expect(errorContainer).toHaveClass(/max-w-xl/);
    await expect(errorContainer).toHaveClass(/mx-auto/);
    await expect(errorContainer).toHaveClass(/bg-white/);
    await expect(errorContainer).toHaveClass(/rounded/);
    await expect(errorContainer).toHaveClass(/shadow-md/);
    
    // Check error heading styling
    const errorHeading = page.locator('h2:has-text("Error")');
    await expect(errorHeading).toHaveClass(/text-red-600/);
    await expect(errorHeading).toHaveClass(/font-bold/);
    
    // Check buttons have proper styling
    const tryAgainButton = page.locator('button:has-text("Try Again")');
    await expect(tryAgainButton).toHaveClass(/bg-purple-500/);
    await expect(tryAgainButton).toHaveClass(/text-white/);
    
    const backButton = page.locator('button:has-text("Back to List")');
    await expect(backButton).toHaveClass(/bg-gray-500/);
    await expect(backButton).toHaveClass(/text-white/);
  });

  test('loading state has proper styling', async ({ page }) => {
    // Start navigation to trigger loading state
    await page.goto('http://localhost:3000/edit/123');
    
    // Check loading state (might be brief, so check quickly)
    const loadingContainer = page.locator('div:has(h2:has-text("Loading Pokémon..."))');
    if (await loadingContainer.isVisible({ timeout: 1000 })) {
      await expect(loadingContainer).toHaveClass(/text-center/);
      
      const loadingHeading = page.locator('h2:has-text("Loading Pokémon...")');
      await expect(loadingHeading).toHaveClass(/text-purple-600/);
      
      const spinner = page.locator('.animate-spin');
      await expect(spinner).toHaveClass(/rounded-full/);
      await expect(spinner).toHaveClass(/border-purple-600/);
    }
  });
});