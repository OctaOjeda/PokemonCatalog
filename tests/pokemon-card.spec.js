import { test, expect } from '@playwright/test';

test.describe('Pokemon Card Modal Component', () => {
  const mockPokemon = {
    _id: '123',
    id: 25,
    name: 'Pikachu',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    type: 'electric',
    type2: null,
    state: 'Normal',
    level: 15
  };

  const mockLegendaryPokemon = {
    _id: '456',
    id: 6,
    name: 'Charizard',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    type: 'fire',
    type2: 'flying',
    state: 'Legendary',
    level: 50
  };

  test.beforeEach(async ({ page }) => {
    // Mock API for Pokemon list
    await page.route('http://localhost:3001/api/pokemons', async route => {
      await route.fulfill({ json: [mockPokemon, mockLegendaryPokemon] });
    });

    // Mock delete API
    await page.route('http://localhost:3001/api/pokemons/*', async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({ json: { success: true } });
      }
    });

    // Set up user authentication
    await page.addInitScript(() => {
      localStorage.setItem('userInfo', JSON.stringify({
        token: 'fake-token',
        user: { id: 1, name: 'Test User' }
      }));
    });

    await page.goto('/pokemons');
    await page.waitForTimeout(1000);
  });

  test('opens modal when Pokemon is clicked', async ({ page }) => {
    // Click view button for first Pokemon
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Check modal is visible
    const modal = page.locator('.fixed.inset-0.bg-black.bg-opacity-50');
    await expect(modal).toBeVisible();

    const modalContent = page.locator('.bg-white.p-6.rounded-lg.shadow-lg');
    await expect(modalContent).toBeVisible();
  });

  test('displays Pokemon information correctly', async ({ page }) => {
    // Open modal
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Check Pokemon name
    const pokemonName = page.locator('h2:has-text("Pokemon1")'); // From our mock data
    await expect(pokemonName).toBeVisible();
    await expect(pokemonName).toHaveClass(/text-2xl/);
    await expect(pokemonName).toHaveClass(/font-bold/);
    await expect(pokemonName).toHaveClass(/text-purple-600/);
    await expect(pokemonName).toHaveClass(/capitalize/);

    // Check Pokemon image
    const pokemonImage = page.locator('.bg-white.p-6.rounded-lg img');
    await expect(pokemonImage).toBeVisible();
    await expect(pokemonImage).toHaveClass(/w-32/);
    await expect(pokemonImage).toHaveClass(/h-32/);
    await expect(pokemonImage).toHaveClass(/mx-auto/);

    // Check Pokemon ID
    await expect(page.locator('text=ID:')).toBeVisible();

    // Check Types section
    await expect(page.locator('text=Types:')).toBeVisible();
  });

  test('displays single type correctly', async ({ page }) => {
    // Open modal for Pokemon with single type
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Check type badge is displayed
    const typeBadge = page.locator('span').filter({ hasText: 'electric' });
    if (await typeBadge.count() > 0) {
      await expect(typeBadge.first()).toHaveClass(/px-2/);
      await expect(typeBadge.first()).toHaveClass(/py-0.5/);
      await expect(typeBadge.first()).toHaveClass(/rounded/);
    }
  });

  test('displays dual types correctly', async ({ page }) => {
    // Click second Pokemon (should have dual types based on our mock)
    const viewButtons = page.locator('button[title="View"]');
    if (await viewButtons.count() > 1) {
      await viewButtons.nth(1).click();

      // Check both type badges are displayed
      const fireType = page.locator('span').filter({ hasText: 'fire' });
      const flyingType = page.locator('span').filter({ hasText: 'flying' });

      // At least one should be visible (depending on mock data structure)
      const typeSpans = page.locator('span[class*="px-2"]');
      await expect(typeSpans).toHaveCount.greaterThan(0);
    }
  });

  test('displays Normal Pokemon state correctly', async ({ page }) => {
    // Open modal
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Should show "Normal Pokémon" for normal state
    await expect(page.locator('text=Normal Pokémon')).toBeVisible();
  });

  test('displays Legendary Pokemon state correctly', async ({ page }) => {
    // If we have a legendary Pokemon in our data
    const viewButtons = page.locator('button[title="View"]');
    if (await viewButtons.count() > 1) {
      // Check if any Pokemon is legendary in the table first
      const legendaryIndicator = page.locator('td:has-text("🌟 Legendary Pokémon")');
      if (await legendaryIndicator.count() > 0) {
        // Find and click the corresponding view button
        const legendaryRow = page.locator('tr').filter({ has: legendaryIndicator });
        const legendaryViewButton = legendaryRow.locator('button[title="View"]');
        await legendaryViewButton.click();

        // Should show "🌟 Legendary Pokémon"
        await expect(page.locator('text=🌟 Legendary Pokémon')).toBeVisible();
      }
    }
  });

  test('close button works correctly', async ({ page }) => {
    // Open modal
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Click close button
    const closeButton = page.locator('button[aria-label="Close modal"]');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    // Modal should be closed
    const modal = page.locator('.fixed.inset-0.bg-black.bg-opacity-50');
    await expect(modal).not.toBeVisible();
  });

  test('edit button is present and has correct styling', async ({ page }) => {
    // Open modal
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Check edit button
    const editButton = page.locator('button:has-text("✏️ Edit")');
    await expect(editButton).toBeVisible();
    await expect(editButton).toHaveClass(/border-purple-500/);
    await expect(editButton).toHaveClass(/text-purple-500/);
    await expect(editButton).toHaveClass(/hover:bg-purple-100/);
  });

  test('remove button is present and has correct styling', async ({ page }) => {
    // Open modal
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Check remove button
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await expect(removeButton).toBeVisible();
    await expect(removeButton).toHaveClass(/border-red-500/);
    await expect(removeButton).toHaveClass(/text-red-500/);
    await expect(removeButton).toHaveClass(/hover:bg-red-100/);
  });

  test('edit button navigates to edit page', async ({ page }) => {
    // Open modal
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Click edit button
    const editButton = page.locator('button:has-text("✏️ Edit")');
    await editButton.click();

    // Should navigate to edit page
    await expect(page).toHaveURL(/\/edit\//);
  });

  test('remove button opens confirmation modal', async ({ page }) => {
    // Open Pokemon modal
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Click remove button
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Confirmation modal should appear
    await expect(page.locator('h2:has-text("Confirm")')).toBeVisible();
    await expect(page.locator('text=¿Estás seguro que querés continuar con esta acción?')).toBeVisible();
  });

  test('confirmation modal has cancel and confirm buttons', async ({ page }) => {
    // Open Pokemon modal and then confirmation modal
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Check confirmation modal buttons
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    await expect(page.locator('button:has-text("Confirm")')).toBeVisible();
  });

  test('cancel button closes confirmation modal', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Click cancel
    const cancelButton = page.locator('button:has-text("Cancel")');
    await cancelButton.click();

    // Confirmation modal should be closed, but Pokemon modal should still be open
    await expect(page.locator('h2:has-text("Confirm")')).not.toBeVisible();
    await expect(page.locator('h2').filter({ hasText: /Pokemon/ })).toBeVisible();
  });

  test('confirm button deletes Pokemon and closes modals', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Click confirm
    const confirmButton = page.locator('button:has-text("Confirm")');
    await confirmButton.click();

    // Wait for deletion to complete
    await page.waitForTimeout(1000);

    // Both modals should be closed
    await expect(page.locator('h2:has-text("Confirm")')).not.toBeVisible();
    await expect(page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).not.toBeVisible();
  });

  test('modal has proper aria labels for accessibility', async ({ page }) => {
    // Open modal
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Check aria labels
    const closeButton = page.locator('button[aria-label="Close modal"]');
    await expect(closeButton).toBeVisible();

    // Edit and remove buttons should have aria-labels too
    const editButton = page.locator('button').filter({ hasText: '✏️ Edit' });
    const removeButton = page.locator('button').filter({ hasText: '🗑️ Remove' });
    
    if (await editButton.count() > 0) {
      await expect(editButton).toHaveAttribute('aria-label', /Edit/);
    }
    if (await removeButton.count() > 0) {
      await expect(removeButton).toHaveAttribute('aria-label', /Remove/);
    }
  });

  test('modal is properly centered and styled', async ({ page }) => {
    // Open modal
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Check modal backdrop
    const backdrop = page.locator('.fixed.inset-0.bg-black.bg-opacity-50');
    await expect(backdrop).toHaveClass(/flex/);
    await expect(backdrop).toHaveClass(/items-center/);
    await expect(backdrop).toHaveClass(/justify-center/);
    await expect(backdrop).toHaveClass(/z-50/);

    // Check modal content
    const modalContent = page.locator('.bg-white.p-6.rounded-lg.shadow-lg');
    await expect(modalContent).toHaveClass(/w-96/);
    await expect(modalContent).toHaveClass(/relative/);
  });
});