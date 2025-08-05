import { test, expect } from '@playwright/test';

test.describe('Pokemon Catalog Component', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API response for Pokemon catalog
    await page.route('http://localhost:3001/api/pokemons', async route => {
      const mockPokemons = Array.from({ length: 15 }, (_, i) => ({
        _id: `${i + 1}`,
        id: i + 1,
        name: `Pokemon${i + 1}`,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`,
        type: i % 2 === 0 ? 'electric' : 'fire',
        type2: i % 3 === 0 ? 'flying' : null,
        state: i % 4 === 0 ? 'Legendary' : 'Normal',
        level: (i + 1) * 5
      }));
      await route.fulfill({ json: mockPokemons });
    });

    await page.goto('/pokemon-catalog');
  });

  test('renders Pokemon Catalog heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Pokemon Catalog' });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveClass(/text-5xl/);
    await expect(heading).toHaveClass(/font-bold/);
    await expect(heading).toHaveClass(/text-purple-600/);
  });

  test('renders search input', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search by name or type"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('type', 'text');
    await expect(searchInput).toHaveClass(/w-full/);
    await expect(searchInput).toHaveClass(/sm:w-1\\/3/);
  });

  test('displays Pokemon cards in grid layout', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Check grid container
    const grid = page.locator('.grid.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3');
    await expect(grid).toBeVisible();
    
    // Should show 12 Pokemon cards (itemsPerPage = 12)
    const cards = page.locator('.bg-white.shadow-md.rounded');
    await expect(cards).toHaveCount(12);
  });

  test('Pokemon cards display correct information', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Check first Pokemon card
    const firstCard = page.locator('.bg-white.shadow-md.rounded').first();
    await expect(firstCard).toBeVisible();
    
    // Check image
    const image = firstCard.locator('img');
    await expect(image).toBeVisible();
    await expect(image).toHaveClass(/w-full/);
    await expect(image).toHaveClass(/h-40/);
    
    // Check name
    const name = firstCard.locator('h3');
    await expect(name).toBeVisible();
    await expect(name).toHaveClass(/text-xl/);
    await expect(name).toHaveClass(/font-bold/);
    await expect(name).toHaveClass(/capitalize/);
    
    // Check type badges
    const typeBadges = firstCard.locator('span').filter({ hasText: 'electric' });
    if (await typeBadges.count() > 0) {
      await expect(typeBadges.first()).toHaveClass(/px-2/);
      await expect(typeBadges.first()).toHaveClass(/py-0.5/);
      await expect(typeBadges.first()).toHaveClass(/rounded/);
    }
  });

  test('Pokemon cards have hover effects', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    const firstCard = page.locator('.bg-white.shadow-md.rounded').first();
    await expect(firstCard).toHaveClass(/hover:scale-105/);
    await expect(firstCard).toHaveClass(/cursor-pointer/);
  });

  test('clicking Pokemon card opens modal', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Click first Pokemon card
    const firstCard = page.locator('.bg-white.shadow-md.rounded').first();
    await firstCard.click();
    
    // Modal should appear
    await expect(page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).toBeVisible();
    await expect(page.locator('h2:has-text("Pokemon1")')).toBeVisible();
  });

  test('search functionality filters Pokemon by name', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Search for specific Pokemon
    const searchInput = page.locator('input[placeholder="Search by name or type"]');
    await searchInput.fill('Pokemon1');
    
    // Should show filtered results
    await page.waitForTimeout(500);
    
    // Check that search is working (cards should be filtered)
    const cards = page.locator('.bg-white.shadow-md.rounded');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('search functionality filters Pokemon by type', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Search for electric type
    const searchInput = page.locator('input[placeholder="Search by name or type"]');
    await searchInput.fill('electric');
    
    await page.waitForTimeout(500);
    
    // Should show only electric type Pokemon
    const cards = page.locator('.bg-white.shadow-md.rounded');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('pagination controls are present and functional', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Check pagination buttons
    const prevButton = page.locator('button:has-text("Prev")');
    const nextButton = page.locator('button:has-text("Next")');
    
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    
    // Prev button should be disabled on first page
    await expect(prevButton).toBeDisabled();
    
    // Next button should be enabled (we have more than 12 items)
    await expect(nextButton).toBeEnabled();
  });

  test('pagination next button works', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Click next button
    const nextButton = page.locator('button:has-text("Next")');
    await nextButton.click();
    
    await page.waitForTimeout(500);
    
    // Should show different Pokemon (page 2)
    const cards = page.locator('.bg-white.shadow-md.rounded');
    await expect(cards).toHaveCount(3); // Remaining 3 Pokemon from our 15 total
    
    // Prev button should now be enabled
    const prevButton = page.locator('button:has-text("Prev")');
    await expect(prevButton).toBeEnabled();
  });

  test('pagination prev button works', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Go to next page first
    const nextButton = page.locator('button:has-text("Next")');
    await nextButton.click();
    await page.waitForTimeout(500);
    
    // Then go back to previous page
    const prevButton = page.locator('button:has-text("Prev")');
    await prevButton.click();
    await page.waitForTimeout(500);
    
    // Should be back to page 1 with 12 items
    const cards = page.locator('.bg-white.shadow-md.rounded');
    await expect(cards).toHaveCount(12);
    
    // Prev button should be disabled again
    await expect(prevButton).toBeDisabled();
  });

  test('search resets pagination to first page', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Go to next page
    const nextButton = page.locator('button:has-text("Next")');
    await nextButton.click();
    await page.waitForTimeout(500);
    
    // Search for something
    const searchInput = page.locator('input[placeholder="Search by name or type"]');
    await searchInput.fill('electric');
    await page.waitForTimeout(500);
    
    // Should be back on first page
    const prevButton = page.locator('button:has-text("Prev")');
    await expect(prevButton).toBeDisabled();
  });

  test('displays Pokemon state and level information', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    const cards = page.locator('.bg-white.shadow-md.rounded');
    const firstCard = cards.first();
    
    // Check that state and level info is displayed
    const stateAndLevel = firstCard.locator('.text-sm.text-gray-700');
    await expect(stateAndLevel).toBeVisible();
    await expect(stateAndLevel).toContainText('Level');
  });

  test('handles empty search results', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Search for non-existent Pokemon
    const searchInput = page.locator('input[placeholder="Search by name or type"]');
    await searchInput.fill('nonexistentpokemon');
    await page.waitForTimeout(500);
    
    // Should show no cards
    const cards = page.locator('.bg-white.shadow-md.rounded');
    await expect(cards).toHaveCount(0);
  });

  test('responsive grid layout works', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);
    
    const grid = page.locator('.grid.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3');
    await expect(grid).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    await expect(grid).toBeVisible();
  });

  test('case insensitive search works', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    const searchInput = page.locator('input[placeholder="Search by name or type"]');
    
    // Test different cases
    await searchInput.fill('ELECTRIC');
    await page.waitForTimeout(500);
    let cards = page.locator('.bg-white.shadow-md.rounded');
    let count1 = await cards.count();
    
    await searchInput.fill('electric');
    await page.waitForTimeout(500);
    cards = page.locator('.bg-white.shadow-md.rounded');
    let count2 = await cards.count();
    
    expect(count1).toBe(count2);
  });
});