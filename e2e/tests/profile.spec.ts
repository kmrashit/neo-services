import { test, expect } from '@playwright/test';

test.describe('Candidate Profile & Tabs E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Seed authenticated session in localStorage
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'mock-jwt-token-xyz');
      localStorage.setItem('refreshToken', 'mock-refresh-token-abc');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: '123456789012345678901234',
          fullName: 'Alex Mercer',
          email: 'alex.mercer@fortlio.dev',
          role: 'candidate',
          isOnboarded: true,
        })
      );
    });
  });

  test('Candidate Profile page renders full showcase details', async ({ page }) => {
    await page.goto('/candidate-profile');

    // Candidate details
    await expect(page.getByRole('heading', { name: 'Alex Mercer' })).toBeVisible();
    await expect(page.getByText('Staff Systems Engineer & Distributed Architect')).toBeVisible();
    await expect(page.getByText('Verified Candidate')).toBeVisible();

    // Action buttons in main profile card
    await expect(page.getByRole('button', { name: 'Share Profile' })).toBeVisible();
    await expect(page.getByRole('main').getByRole('link', { name: 'PDF Resume' })).toBeVisible();
    await expect(page.getByRole('main').getByRole('link', { name: 'Edit Profile' })).toBeVisible();
  });

  test('Profile tabs switch between Overview, Blogs, and Forti AI Insights', async ({ page }) => {
    await page.goto('/candidate-profile');

    // Default Overview tab should be active
    await expect(page.getByText('Work Experience')).toBeVisible();
    await expect(page.getByText('Lead Systems Architect')).toBeVisible();
    await expect(page.getByText('Verified Skills')).toBeVisible();

    // Click Blogs Tab
    const blogsTab = page.getByRole('tab', { name: /Blogs/ });
    await blogsTab.click();
    await expect(page.getByText('Optimizing MongoDB Pipelines with Post-Facet Slicing')).toBeVisible();

    // Click Forti AI Insights Tab
    const fortiTab = page.getByRole('tab', { name: /Forti AI Insights/ });
    await fortiTab.click();
    await expect(page.getByText('Learning Velocity Score')).toBeVisible();
    await expect(page.getByText('Leadership & Soft Qualities')).toBeVisible();
  });

  test('Copy share link button updates to Link Copied', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/candidate-profile');
    const shareBtn = page.getByRole('button', { name: 'Share Profile' });
    await shareBtn.click();

    await expect(page.getByText('Link Copied')).toBeVisible();
  });
});
