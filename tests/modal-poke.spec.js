import { test, expect } from '@playwright/test';

test.describe('ModalPoke Component', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API for Pokemon list to have data to work with
    await page.route('http://localhost:3001/api/pokemons', async route => {
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
      await route.fulfill({ json: mockPokemons });
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

  test('modal is not visible when closed', async ({ page }) => {
    // Modal should not be visible initially
    const modal = page.locator('.fixed.inset-0.z-50.flex.items-center.justify-center.bg-black.bg-opacity-40');
    await expect(modal).not.toBeVisible();
  });

  test('modal opens when remove button is clicked', async ({ page }) => {
    // Open Pokemon card modal first
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();

    // Click remove button to open confirmation modal
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // ModalPoke should now be visible
    const modal = page.locator('.fixed.inset-0.z-50.flex.items-center.justify-center.bg-black.bg-opacity-40');
    await expect(modal).toBeVisible();
  });

  test('modal displays correct structure and styling', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Check modal backdrop
    const backdrop = page.locator('.fixed.inset-0.z-50.flex.items-center.justify-center.bg-black.bg-opacity-40');
    await expect(backdrop).toBeVisible();

    // Check modal content container
    const modalContent = page.locator('.bg-white.border-2.border-purple-600.rounded-2xl.shadow-xl');
    await expect(modalContent).toBeVisible();
    await expect(modalContent).toHaveClass(/p-6/);
    await expect(modalContent).toHaveClass(/w-full/);
    await expect(modalContent).toHaveClass(/max-w-md/);
    await expect(modalContent).toHaveClass(/text-black/);
  });

  test('modal displays confirm heading', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Check heading
    const heading = page.locator('h2:has-text("Confirm")');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveClass(/text-xl/);
    await expect(heading).toHaveClass(/font-bold/);
    await expect(heading).toHaveClass(/mb-4/);
    await expect(heading).toHaveClass(/text-purple-600/);
    await expect(heading).toHaveClass(/text-center/);
  });

  test('modal displays custom message', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Check custom message
    const message = page.locator('text=¿Estás seguro que querés continuar con esta acción?');
    await expect(message).toBeVisible();
    
    // Check message styling
    const messageElement = page.locator('p').filter({ hasText: '¿Estás seguro que querés continuar con esta acción?' });
    await expect(messageElement).toHaveClass(/text-center/);
    await expect(messageElement).toHaveClass(/mb-6/);
  });

  test('modal displays cancel button with correct styling', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Check cancel button
    const cancelButton = page.locator('button:has-text("Cancel")');
    await expect(cancelButton).toBeVisible();
    await expect(cancelButton).toHaveClass(/px-4/);
    await expect(cancelButton).toHaveClass(/py-2/);
    await expect(cancelButton).toHaveClass(/border/);
    await expect(cancelButton).toHaveClass(/border-purple-600/);
    await expect(cancelButton).toHaveClass(/text-purple-600/);
    await expect(cancelButton).toHaveClass(/rounded-lg/);
    await expect(cancelButton).toHaveClass(/hover:bg-purple-50/);
    await expect(cancelButton).toHaveClass(/transition/);
  });

  test('modal displays confirm button with correct styling', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Check confirm button
    const confirmButton = page.locator('button:has-text("Confirm")');
    await expect(confirmButton).toBeVisible();
    await expect(confirmButton).toHaveClass(/px-4/);
    await expect(confirmButton).toHaveClass(/py-2/);
    await expect(confirmButton).toHaveClass(/bg-purple-600/);
    await expect(confirmButton).toHaveClass(/text-white/);
    await expect(confirmButton).toHaveClass(/rounded-lg/);
    await expect(confirmButton).toHaveClass(/hover:bg-purple-700/);
    await expect(confirmButton).toHaveClass(/transition/);
  });

  test('buttons are properly positioned', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Check button container
    const buttonContainer = page.locator('.flex.justify-end.space-x-4');
    await expect(buttonContainer).toBeVisible();

    // Both buttons should be in the container
    const cancelButton = buttonContainer.locator('button:has-text("Cancel")');
    const confirmButton = buttonContainer.locator('button:has-text("Confirm")');
    
    await expect(cancelButton).toBeVisible();
    await expect(confirmButton).toBeVisible();
  });

  test('cancel button closes modal', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Modal should be visible
    const modal = page.locator('.fixed.inset-0.z-50.flex.items-center.justify-center.bg-black.bg-opacity-40');
    await expect(modal).toBeVisible();

    // Click cancel
    const cancelButton = page.locator('button:has-text("Cancel")');
    await cancelButton.click();

    // Modal should be closed
    await expect(modal).not.toBeVisible();
  });

  test('confirm button executes callback and closes modal', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Modal should be visible
    const modal = page.locator('.fixed.inset-0.z-50.flex.items-center.justify-center.bg-black.bg-opacity-40');
    await expect(modal).toBeVisible();

    // Click confirm
    const confirmButton = page.locator('button:has-text("Confirm")');
    await confirmButton.click();

    // Wait for action to complete
    await page.waitForTimeout(1000);

    // Modal should be closed (both confirmation modal and Pokemon card modal)
    await expect(modal).not.toBeVisible();
    const pokemonModal = page.locator('.fixed.inset-0.bg-black.bg-opacity-50');
    await expect(pokemonModal).not.toBeVisible();
  });

  test('modal has proper z-index for layering', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Check z-index
    const modal = page.locator('.fixed.inset-0.z-50');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveClass(/z-50/);
  });

  test('modal backdrop has correct opacity', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Check backdrop opacity
    const backdrop = page.locator('.bg-black.bg-opacity-40');
    await expect(backdrop).toBeVisible();
    await expect(backdrop).toHaveClass(/bg-opacity-40/);
  });

  test('modal content has correct border and shadow', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Check modal content styling
    const modalContent = page.locator('.bg-white.border-2.border-purple-600.rounded-2xl.shadow-xl');
    await expect(modalContent).toBeVisible();
    await expect(modalContent).toHaveClass(/border-2/);
    await expect(modalContent).toHaveClass(/border-purple-600/);
    await expect(modalContent).toHaveClass(/rounded-2xl/);
    await expect(modalContent).toHaveClass(/shadow-xl/);
  });

  test('modal is responsive', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const modalContent = page.locator('.bg-white.border-2.border-purple-600.rounded-2xl.shadow-xl');
    await expect(modalContent).toBeVisible();
    await expect(modalContent).toHaveClass(/w-full/);
    await expect(modalContent).toHaveClass(/max-w-md/);

    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);

    await expect(modalContent).toBeVisible();
  });

  test('modal handles keyboard interactions', async ({ page }) => {
    // Open modals
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    const removeButton = page.locator('button:has-text("🗑️ Remove")');
    await removeButton.click();

    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Should focus on the first button (Cancel)
    const cancelButton = page.locator('button:has-text("Cancel")');
    await expect(cancelButton).toBeFocused();

    // Tab to confirm button
    await page.keyboard.press('Tab');
    const confirmButton = page.locator('button:has-text("Confirm")');
    await expect(confirmButton).toBeFocused();

    // Enter should trigger the focused button
    await page.keyboard.press('Enter');
    
    // Wait for action to complete
    await page.waitForTimeout(1000);

    // Modal should be closed
    const modal = page.locator('.fixed.inset-0.z-50.flex.items-center.justify-center.bg-black.bg-opacity-40');
    await expect(modal).not.toBeVisible();
  });
});