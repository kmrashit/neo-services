import { test, expect } from '@playwright/test';

test.describe('F05 HR Search Engine & Video Ad Monetization E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Seed authenticated recruiter session in localStorage with 10 initial coins (2 searches)
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'mock-jwt-hr-token');
      localStorage.setItem('refreshToken', 'mock-refresh-hr-token');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: '678901234567890123456789',
          fullName: 'Jessica Hayes',
          email: 'jessica.hayes@talentcorp.com',
          role: 'hr',
          coins: 10,
          isOnboarded: true,
        })
      );
    });
  });

  test('Candidate Discovery page renders banner, search quota, and candidate directory', async ({ page }) => {
    await page.goto('/candidates');

    // Verify Page Header
    await expect(page.getByRole('heading', { name: 'Candidate Discovery & Talent Engine' })).toBeVisible();
    await expect(page.getByText('Universal Recruiter Discovery')).toBeVisible();

    // Verify Search Quota Counter
    await expect(page.getByText('Search Quota')).toBeVisible();
    await expect(page.getByText(/Coins/i).first()).toBeVisible();

    // Verify Candidate Cards render with details
    await expect(page.getByText('Alex Mercer')).toBeVisible();
    await expect(page.getByText('Staff Systems Engineer & Distributed Architect')).toBeVisible();
    await expect(page.getByText('Dr. Sarah Lin')).toBeVisible();
    await expect(page.getByText('Elena Rostova')).toBeVisible();

    // Verify Forti AI velocity badge on candidate cards
    await expect(page.getByText(/Forti Velocity: 94\/100/)).toBeVisible();

    // Verify masked contact protection
    await expect(page.getByText('a***r@fortlio.dev')).toBeVisible();
  });

  test('Filter candidate directory by quick keyword pills and filter panel', async ({ page }) => {
    await page.goto('/candidates');

    // Toggle filter panel
    const filterBtn = page.getByRole('button', { name: 'Filter Candidates' });
    await expect(filterBtn).toBeVisible();
    await filterBtn.click();

    // Verify filter panel opened
    await expect(page.getByText('Minimum Experience')).toBeVisible();
    await expect(page.getByText('Domain Competencies & Skills')).toBeVisible();

    // Click quick trending pill "Genomics"
    const genomicsPill = page.getByText('Genomics').first();
    await genomicsPill.click();

    // Trigger Search
    const searchBtn = page.locator('button[type="submit"]');
    await searchBtn.click();

    // Verify Dr. Sarah Lin (Genomics expert) is displayed
    await expect(page.getByText('Dr. Sarah Lin')).toBeVisible();
    await expect(page.getByText('Principal Clinical Bioinformatician & Research Lead')).toBeVisible();
  });

  test('Watch sponsored video ad to replenish recruiter search quota (+10 coins)', async ({ page }) => {
    await page.goto('/candidates');

    // Click Watch Ad button from header banner
    const watchAdBtn = page.getByRole('button', { name: 'Watch Ad (+10 Coins)' });
    await expect(watchAdBtn).toBeVisible();
    await watchAdBtn.click();

    // Verify Video Ad Modal opens
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Recruiter Search Quota Depleted' })).toBeVisible();
    await expect(dialog.getByText('Replenish 2 Free Searches')).toBeVisible();

    // Start Watching Video Ad
    const startBtn = dialog.getByRole('button', { name: 'Start Watching Video Ad' });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // Verify countdown timer is active
    await expect(dialog.getByText('Playing Sponsored Video Ad...')).toBeVisible();

    // Wait for video countdown to finish (5 seconds)
    const claimBtn = dialog.getByRole('button', { name: 'Claim +10 Search Coins' });
    await expect(claimBtn).toBeVisible({ timeout: 10000 });

    // Claim coins reward
    await claimBtn.click();

    // Verify success confirmation
    await expect(dialog.getByRole('heading', { name: 'Search Quota Replenished!' })).toBeVisible();
    await expect(dialog.getByText('+10 Search Coins')).toBeVisible();

    // Close modal
    await dialog.getByRole('button', { name: 'Start Searching Now' }).click();
    await expect(dialog).not.toBeVisible();

    // Verify coins balance reflects replenish (+10)
    await expect(page.getByRole('main').getByText('20 Coins')).toBeVisible();
  });

  test('Search History and Recently Viewed tabs switch and render content', async ({ page }) => {
    await page.goto('/candidates');

    // Switch to Search History Tab
    const historyTab = page.getByRole('tab', { name: /Search History/ });
    await expect(historyTab).toBeVisible();
    await historyTab.click();

    // Check table headers or empty history state
    await expect(page.getByText(/No recent searches|Search Query/i)).toBeVisible();

    // Switch to Recently Viewed Tab
    const viewedTab = page.getByRole('tab', { name: /Recently Viewed/ });
    await expect(viewedTab).toBeVisible();
    await viewedTab.click();

    // Verify viewed tab content or empty state
    await expect(page.getByText(/No viewed profiles yet|viewed profiles/i)).toBeVisible();
  });
});
