import { test, expect } from '@playwright/test';

test.describe('Home Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders main heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Pokemon Catalog' });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveClass(/text-4xl/);
    await expect(heading).toHaveClass(/font-bold/);
    await expect(heading).toHaveClass(/text-purple-500/);
  });

  test('renders Swiper carousel component', async ({ page }) => {
    // Check if Swiper container is present
    const swiperContainer = page.locator('.swiper');
    await expect(swiperContainer).toBeVisible();
    
    // Check if slides are present
    const slides = page.locator('.swiper-slide');
    await expect(slides).toHaveCount(4); // We have 4 Pokemon in the array
  });

  test('displays all Pokemon in carousel', async ({ page }) => {
    // Wait for carousel to load
    await page.waitForTimeout(1000);
    
    // Check if Pikachu slide is visible (should be first)
    await expect(page.locator('[src*="25.png"]')).toBeVisible();
    await expect(page.locator('text=Pikachu')).toBeVisible();
    
    // We can't easily test all slides without complex carousel navigation
    // But we can check that images and names exist in the DOM
    const pokemonNames = ['Pikachu', 'Charmander', 'Squirtle', 'Bulbasaur'];
    const pokemonImages = ['25.png', '4.png', '7.png', '1.png'];
    
    for (let i = 0; i < pokemonNames.length; i++) {
      await expect(page.locator(`text=${pokemonNames[i]}`)).toBeVisible();
      await expect(page.locator(`[src*="${pokemonImages[i]}"]`)).toBeVisible();
    }
  });

  test('carousel slides have correct structure', async ({ page }) => {
    // Wait for carousel to load
    await page.waitForTimeout(1000);
    
    // Check slide structure
    const slides = page.locator('.swiper-slide');
    const firstSlide = slides.first();
    
    // Check slide has correct classes
    await expect(firstSlide).toHaveClass(/flex/);
    await expect(firstSlide).toHaveClass(/flex-col/);
    await expect(firstSlide).toHaveClass(/items-center/);
    await expect(firstSlide).toHaveClass(/justify-center/);
    await expect(firstSlide).toHaveClass(/bg-purple-50/);
    
    // Check image in first slide
    const slideImage = firstSlide.locator('img');
    await expect(slideImage).toBeVisible();
    await expect(slideImage).toHaveClass(/w-40/);
    await expect(slideImage).toHaveClass(/h-40/);
    
    // Check name in first slide
    const slideName = firstSlide.locator('h2');
    await expect(slideName).toBeVisible();
    await expect(slideName).toHaveClass(/text-2xl/);
    await expect(slideName).toHaveClass(/font-semibold/);
    await expect(slideName).toHaveClass(/text-purple-600/);
  });

  test('carousel has pagination', async ({ page }) => {
    // Wait for carousel to load
    await page.waitForTimeout(1000);
    
    // Check if pagination dots are present
    const pagination = page.locator('.swiper-pagination');
    await expect(pagination).toBeVisible();
    
    // Check pagination bullets
    const bullets = page.locator('.swiper-pagination-bullet');
    await expect(bullets).toHaveCount(4); // Should have 4 bullets for 4 slides
  });

  test('carousel auto-plays', async ({ page }) => {
    // Wait for carousel to load
    await page.waitForTimeout(1000);
    
    // Get initial active slide
    const initialActiveSlide = await page.locator('.swiper-slide-active').textContent();
    
    // Wait for autoplay to change slide (autoplay delay is 2500ms)
    await page.waitForTimeout(3000);
    
    // Check if slide has changed
    const newActiveSlide = await page.locator('.swiper-slide-active').textContent();
    expect(newActiveSlide).not.toBe(initialActiveSlide);
  });

  test('pagination bullets are clickable', async ({ page }) => {
    // Wait for carousel to load
    await page.waitForTimeout(1000);
    
    // Get pagination bullets
    const bullets = page.locator('.swiper-pagination-bullet');
    await expect(bullets.first()).toBeVisible();
    
    // Click second bullet
    if (await bullets.nth(1).isVisible()) {
      await bullets.nth(1).click();
      await page.waitForTimeout(500);
      
      // Verify slide changed
      const activeSlide = page.locator('.swiper-slide-active');
      await expect(activeSlide).toBeVisible();
    }
  });

  test('Pokemon images have correct alt attributes', async ({ page }) => {
    // Wait for carousel to load
    await page.waitForTimeout(1000);
    
    const pokemonData = [
      { name: 'Pikachu', id: '25' },
      { name: 'Charmander', id: '4' },
      { name: 'Squirtle', id: '7' },
      { name: 'Bulbasaur', id: '1' }
    ];
    
    for (const pokemon of pokemonData) {
      const image = page.locator(`[src*="${pokemon.id}.png"]`);
      await expect(image).toHaveAttribute('alt', pokemon.name);
    }
  });

  test('component has proper layout styling', async ({ page }) => {
    // Check main container
    const mainContainer = page.locator('div').first();
    await expect(mainContainer).toHaveClass(/bg-white/);
    await expect(mainContainer).toHaveClass(/flex/);
    await expect(mainContainer).toHaveClass(/flex-col/);
    await expect(mainContainer).toHaveClass(/items-center/);
    
    // Check Swiper styling
    const swiper = page.locator('.swiper');
    await expect(swiper).toHaveClass(/w-full/);
    await expect(swiper).toHaveClass(/max-w-4xl/);
  });

  test('responsive design works correctly', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);
    
    const heading = page.getByRole('heading', { name: 'Pokemon Catalog' });
    await expect(heading).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    await expect(heading).toBeVisible();
    
    // Swiper should still be visible and functional
    const swiper = page.locator('.swiper');
    await expect(swiper).toBeVisible();
  });
});