import { test, expect } from '@playwright/test';

test.describe('F02 User Account & RBAC Settings E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Seed authenticated session in localStorage
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'mock-jwt-token-f02');
      localStorage.setItem('refreshToken', 'mock-refresh-token-f02');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: '123456789012345678901234',
          fullName: 'Alex Mercer',
          email: 'alex.mercer@fortlio.dev',
          role: 'candidate',
          coins: 10,
          isOnboarded: true,
        })
      );
    });
  });

  test('Header displays user profile trigger with avatar and coins quick action', async ({ page }) => {
    await page.goto('/candidate-profile');

    // Check coins quick action button in header
    const coinsBtn = page.getByRole('button', { name: /10 Coins/ });
    await expect(coinsBtn).toBeVisible();

    // Check user menu trigger button
    const userMenuBtn = page.getByRole('button', { name: 'Open User Menu' });
    await expect(userMenuBtn).toBeVisible();
    await expect(userMenuBtn.getByText('Alex Mercer')).toBeVisible();
    await expect(userMenuBtn.getByText('candidate')).toBeVisible();
  });

  test('User dropdown menu opens with verified role badge and account actions', async ({ page }) => {
    await page.goto('/candidate-profile');

    // Click user dropdown
    const userMenuBtn = page.getByRole('button', { name: 'Open User Menu' });
    await userMenuBtn.click();

    // Check dropdown contents
    const menu = page.getByRole('menu');
    await expect(menu.getByText('alex.mercer@fortlio.dev')).toBeVisible();
    await expect(menu.getByText('Candidate', { exact: true })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Candidate Profile' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Account & RBAC Settings' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: /Watch Ad/ })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Sign Out' })).toBeVisible();
  });

  test('Account & RBAC Settings modal allows navigating tabs and updating profile', async ({ page }) => {
    await page.goto('/candidate-profile');

    // Open User Menu and click settings
    await page.getByRole('button', { name: 'Open User Menu' }).click();
    await page.getByRole('menuitem', { name: 'Account & RBAC Settings' }).click();

    // Verify modal appears
    await expect(page.getByRole('heading', { name: 'Account & RBAC Settings' })).toBeVisible();

    // Check Tabs
    const generalTab = page.getByRole('tab', { name: 'General Info' });
    const coinsTab = page.getByRole('tab', { name: 'Search Coins' });
    const rbacTab = page.getByRole('tab', { name: 'Role & RBAC' });

    await expect(generalTab).toBeVisible();
    await expect(coinsTab).toBeVisible();
    await expect(rbacTab).toBeVisible();

    // Test Search Coins Tab
    await coinsTab.click();
    await expect(page.getByText('Available Search Balance')).toBeVisible();
    await expect(page.getByText('Monetization & Search Policy (F05 rule):')).toBeVisible();

    // Test Role & RBAC Tab
    await rbacTab.click();
    await expect(page.getByText('Assigned Role')).toBeVisible();
    await expect(page.getByText('Role Capabilities')).toBeVisible();
    await expect(page.getByText('Authenticated candidate portfolio and markdown blog authoring')).toBeVisible();

    // Test General Info Tab
    await generalTab.click();
    const nameInput = page.getByLabel('First / Full Name');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveValue('Alex Mercer');

    // Check email is disabled/verified
    const emailInput = page.getByLabel(/Email Address/);
    await expect(emailInput).toBeDisabled();

    // Update name and submit
    await nameInput.fill('Alex J. Mercer');
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify feedback
    await expect(page.getByText('Profile updated successfully!')).toBeVisible();
  });

  test('Ad Reward Modal allows watching sponsored video and earning search coins', async ({ page }) => {
    await page.goto('/candidate-profile');

    // Click quick Watch Ad button from header
    const coinsBtn = page.getByRole('button', { name: /10 Coins/ });
    await coinsBtn.click();

    // Check ad modal appears
    await expect(page.getByRole('heading', { name: 'Watch Ad & Earn Credits' })).toBeVisible();
    await expect(page.getByText('Earn 10 search coins immediately upon completing this short video simulation.')).toBeVisible();

    // Start watching ad
    const startAdBtn = page.getByRole('button', { name: /Start Watching Video Ad/ });
    await expect(startAdBtn).toBeVisible();
    await startAdBtn.click();

    // Verify simulation is in progress
    await expect(page.getByText(/Playing Sponsored Video/)).toBeVisible();

    // Wait for video countdown to finish (5s)
    const claimBtn = page.getByRole('button', { name: /Claim \+10 Search Coins/ });
    await expect(claimBtn).toBeVisible({ timeout: 10000 });

    // Claim reward
    await claimBtn.click();

    // Verify reward claimed confirmation
    await expect(page.getByText('Reward Claimed!')).toBeVisible();
    await page.getByRole('button', { name: 'Done' }).click();

    // Header coins balance should reflect updated coins
    await expect(page.getByRole('button', { name: /20 Coins/ })).toBeVisible();
  });

  test('Recruiter / HR role displays specialized Recruiter badge and permissions', async ({ page }) => {
    // Seed as Recruiter
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'mock-jwt-hr-token');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: '567890123456789012345678',
          fullName: 'Sarah HR',
          email: 'sarah.hr@talent.io',
          role: 'hr',
          coins: 2,
          isOnboarded: true,
        })
      );
    });

    await page.goto('/candidate-profile');

    // Header role should indicate HR
    const userMenuBtn = page.getByRole('button', { name: 'Open User Menu' });
    await expect(userMenuBtn.getByText('hr', { exact: true })).toBeVisible();

    // Open dropdown and check Recruiter badge
    await userMenuBtn.click();
    const menu = page.getByRole('menu');
    await expect(menu.getByText('Recruiter / HR')).toBeVisible();
  });
});
