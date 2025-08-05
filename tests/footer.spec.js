import { test, expect } from '@playwright/test';

test.describe('Footer Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders footer with correct styling', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toHaveClass(/bg-purple-600/);
    await expect(footer).toHaveClass(/text-white/);
  });

  test('displays information section', async ({ page }) => {
    // Check Information heading
    await expect(page.locator('h3:has-text("Information")')).toBeVisible();
    
    // Check information content
    const infoText = page.locator('text=Pokémon is a franchise that includes video games');
    await expect(infoText).toBeVisible();
    
    // Verify the complete information text
    const fullInfoText = 'Pokémon is a franchise that includes video games, animated series, movies, trading cards, and much more. It was created by Satoshi Tajiri and launched by Nintendo in 1996. The main goal is to catch, train, and battle creatures called Pokémon.';
    await expect(page.locator(`p:has-text("${fullInfoText.substring(0, 30)}")`)).toBeVisible();
  });

  test('displays history section', async ({ page }) => {
    // Check History heading
    await expect(page.locator('h3:has-text("History")')).toBeVisible();
    
    // Check history content
    const historyText = page.locator('text=The Pokémon adventure begins in the Kanto region');
    await expect(historyText).toBeVisible();
    
    // Verify the complete history text
    const fullHistoryText = 'The Pokémon adventure begins in the Kanto region, where young trainers start their journey to become Pokémon masters. Over the years, the saga has grown and evolved, capturing the imagination of millions worldwide.';
    await expect(page.locator(`p:has-text("${fullHistoryText.substring(0, 30)}")`)).toBeVisible();
  });

  test('displays copyright information with current year', async ({ page }) => {
    const currentYear = new Date().getFullYear();
    const copyrightText = `© ${currentYear} PokéApp. All rights reserved.`;
    
    await expect(page.locator(`text=${copyrightText}`)).toBeVisible();
  });

  test('footer has proper layout structure', async ({ page }) => {
    // Check main container
    const mainContainer = page.locator('footer .max-w-6xl');
    await expect(mainContainer).toBeVisible();
    
    // Check flex layout
    const flexContainer = page.locator('footer .flex.flex-col.md\\:flex-row');
    await expect(flexContainer).toBeVisible();
    
    // Check both sections are present
    const sections = page.locator('footer .md\\:w-1\\/2');
    await expect(sections).toHaveCount(2);
  });

  test('footer headings have correct styling', async ({ page }) => {
    const headings = page.locator('footer h3');
    await expect(headings).toHaveCount(2);
    
    // Check styling classes
    for (let i = 0; i < 2; i++) {
      const heading = headings.nth(i);
      await expect(heading).toHaveClass(/text-xl/);
      await expect(heading).toHaveClass(/font-bold/);
      await expect(heading).toHaveClass(/mb-3/);
    }
  });

  test('copyright section has proper styling', async ({ page }) => {
    const copyright = page.locator('footer .text-center.text-sm.mt-8.opacity-70');
    await expect(copyright).toBeVisible();
    
    // Check it contains the year
    const currentYear = new Date().getFullYear();
    await expect(copyright).toContainText(currentYear.toString());
    await expect(copyright).toContainText('PokéApp. All rights reserved.');
  });

  test('footer is responsive', async ({ page }) => {
    // Check responsive classes are present
    const responsiveContainer = page.locator('footer .flex-col.md\\:flex-row');
    await expect(responsiveContainer).toBeVisible();
    
    const responsiveSections = page.locator('footer .md\\:w-1\\/2');
    await expect(responsiveSections).toHaveCount(2);
  });

  test('footer appears at bottom of page', async ({ page }) => {
    const footer = page.locator('footer');
    
    // Check footer is visible when scrolling to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(footer).toBeVisible();
  });
});