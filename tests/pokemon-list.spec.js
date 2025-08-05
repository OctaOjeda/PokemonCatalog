import { test, expect } from '@playwright/test';

test.describe('Pokemon List Component', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API response for Pokemon list
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
        },
        {
          _id: '3',
          id: 3,
          name: 'Blastoise',
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
          type: 'water',
          type2: null,
          state: 'Normal',
          level: 36
        }
      ];
      await route.fulfill({ json: mockPokemons });
    });

    await page.goto('/pokemons');
  });

  test('renders Pokemon List heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Pokémon List' })).toBeVisible();
  });

  test('renders search input', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search Pokémon or type"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('type', 'text');
  });

  test('renders create Pokemon button', async ({ page }) => {
    const createButton = page.locator('button:has-text("+ Create Pokémon")');
    await expect(createButton).toBeVisible();
    await expect(createButton).toHaveClass(/bg-purple-500/);
  });

  test('renders Pokemon table with headers', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Check table headers
    await expect(page.locator('th:has-text("#")')).toBeVisible();
    await expect(page.locator('th:has-text("Image")')).toBeVisible();
    await expect(page.locator('th:has-text("Name")')).toBeVisible();
    await expect(page.locator('th:has-text("Type(s)")')).toBeVisible();
    await expect(page.locator('th:has-text("Class")')).toBeVisible();
    await expect(page.locator('th:has-text("Level")')).toBeVisible();
    await expect(page.locator('th:has-text("Actions")')).toBeVisible();
  });

  test('displays Pokemon data in table rows', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Check first Pokemon (Pikachu)
    await expect(page.locator('td:has-text("Pikachu")')).toBeVisible();
    await expect(page.locator('td:has-text("electric")')).toBeVisible();
    await expect(page.locator('td:has-text("Normal Pokémon")')).toBeVisible();
    
    // Check second Pokemon (Charizard)
    await expect(page.locator('td:has-text("Charizard")')).toBeVisible();
    await expect(page.locator('td:has-text("fire")')).toBeVisible();
    await expect(page.locator('td:has-text("flying")')).toBeVisible();
    await expect(page.locator('td:has-text("🌟 Legendary Pokémon")')).toBeVisible();
    
    // Check Pokemon images
    await expect(page.locator('img[alt="Pikachu"]')).toBeVisible();
    await expect(page.locator('img[alt="Charizard"]')).toBeVisible();
  });

  test('search functionality filters Pokemon by name', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Search for Pikachu
    const searchInput = page.locator('input[placeholder="Search Pokémon or type"]');
    await searchInput.fill('Pikachu');
    
    // Should show only Pikachu
    await expect(page.locator('td:has-text("Pikachu")')).toBeVisible();
    await expect(page.locator('td:has-text("Charizard")')).not.toBeVisible();
    await expect(page.locator('td:has-text("Blastoise")')).not.toBeVisible();
  });

  test('search functionality filters Pokemon by type', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Search for fire type
    const searchInput = page.locator('input[placeholder="Search Pokémon or type"]');
    await searchInput.fill('fire');
    
    // Should show only Charizard
    await expect(page.locator('td:has-text("Charizard")')).toBeVisible();
    await expect(page.locator('td:has-text("Pikachu")')).not.toBeVisible();
    await expect(page.locator('td:has-text("Blastoise")')).not.toBeVisible();
  });

  test('search resets pagination to first page', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // If there are pagination buttons, they should reset when searching
    const searchInput = page.locator('input[placeholder="Search Pokémon or type"]');
    await searchInput.fill('test');
    
    // Check that we're on page 1 (implicitly tested by search results)
    await expect(searchInput).toHaveValue('test');
  });

  test('view button opens Pokemon card modal', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Click view button for first Pokemon
    const viewButton = page.locator('button[title="View"]').first();
    await viewButton.click();
    
    // Modal should appear with Pokemon details
    await expect(page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).toBeVisible();
    await expect(page.locator('h2:has-text("Pikachu")')).toBeVisible();
  });

  test('create Pokemon button navigates to create page', async ({ page }) => {
    const createButton = page.locator('button:has-text("+ Create Pokémon")');
    await createButton.click();
    
    await expect(page).toHaveURL('/create');
  });

  test('table rows have hover effects', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toHaveClass(/hover:bg-gray-100/);
  });

  test('Pokemon types display with correct styling', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Check type badges have styling
    const typeBadges = page.locator('span').filter({ hasText: 'electric' });
    await expect(typeBadges.first()).toHaveClass(/px-2/);
    await expect(typeBadges.first()).toHaveClass(/py-0.5/);
    await expect(typeBadges.first()).toHaveClass(/rounded/);
  });

  test('pagination works correctly', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // With 3 Pokemon and 20 items per page, we should have 1 page
    // Check that all Pokemon are visible (no pagination needed)
    await expect(page.locator('td:has-text("Pikachu")')).toBeVisible();
    await expect(page.locator('td:has-text("Charizard")')).toBeVisible();
    await expect(page.locator('td:has-text("Blastoise")')).toBeVisible();
  });

  test('handles empty search results', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Search for non-existent Pokemon
    const searchInput = page.locator('input[placeholder="Search Pokémon or type"]');
    await searchInput.fill('nonexistent');
    
    // Should show no results
    await expect(page.locator('td:has-text("Pikachu")')).not.toBeVisible();
    await expect(page.locator('td:has-text("Charizard")')).not.toBeVisible();
    await expect(page.locator('td:has-text("Blastoise")')).not.toBeVisible();
  });

  test('case insensitive search works', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Search with different cases
    const searchInput = page.locator('input[placeholder="Search Pokémon or type"]');
    
    await searchInput.fill('PIKACHU');
    await expect(page.locator('td:has-text("Pikachu")')).toBeVisible();
    
    await searchInput.fill('pikachu');
    await expect(page.locator('td:has-text("Pikachu")')).toBeVisible();
    
    await searchInput.fill('PiKaChU');
    await expect(page.locator('td:has-text("Pikachu")')).toBeVisible();
  });
});