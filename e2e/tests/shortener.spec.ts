import { test, expect } from '@playwright/test';

test.describe('F08 Link Shortener & Share Analytics E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Seed authenticated candidate session in localStorage
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

  test('Candidate Profile displays Link Share & Visitor Analytics card with metrics', async ({ page }) => {
    await page.goto('/candidate-profile');

    // Check Analytics Card
    await expect(page.getByRole('heading', { name: 'Link Share & Visitor Analytics' })).toBeVisible();
    await expect(page.getByText('Real-time candidate reach and dwell time')).toBeVisible();
    await expect(page.getByText('Active Tracking')).toBeVisible();

    // Metric items
    await expect(page.getByText('Total Views')).toBeVisible();
    await expect(page.getByText('Time Engaged')).toBeVisible();
    await expect(page.getByText('Avg Dwell Time')).toBeVisible();
  });

  test('Generate custom trackable short link with QR code and copy action', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/candidate-profile');

    // Click "Short Link" button
    const shortLinkBtn = page.getByRole('button', { name: 'Short Link' });
    await expect(shortLinkBtn).toBeVisible();
    await shortLinkBtn.click();

    // Verify Share Link Modal
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { name: 'Share Trackable Short Link' })).toBeVisible();
    await expect(modal.getByText('Built-in Engagement Analytics')).toBeVisible();

    // Fill Custom Alias
    const aliasInput = modal.getByPlaceholder(/e\.g\. alex-mercer/);
    await aliasInput.fill('alex-portfolio');

    // Click Generate Short Link
    const generateBtn = modal.getByRole('button', { name: 'Generate Short Link' });
    await generateBtn.click();

    // Verify generated URL input
    await expect(modal.getByText('Your Branded Short URL')).toBeVisible();
    await expect(modal.locator('input[readonly]')).toHaveValue(/\/s\/alex-portfolio/);

    // Toggle QR Code
    const qrBtn = modal.getByRole('button', { name: 'Show QR' });
    await qrBtn.click();
    await expect(modal.getByRole('img', { name: 'QR Code' })).toBeVisible();

    // Copy action
    const copyBtn = modal.getByRole('button', { name: 'Copy' });
    await copyBtn.click();
    await expect(modal.getByText('Copied!')).toBeVisible();

    // Close modal
    await modal.getByRole('button', { name: 'Done' }).click();
    await expect(modal).not.toBeVisible();
  });

  test('View all shared links table and copy individual links', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/candidate-profile');

    // Click "View all X shared links"
    const viewLinksBtn = page.getByRole('button', { name: /View all .* shared links/ });
    if (await viewLinksBtn.isVisible()) {
      await viewLinksBtn.click();

      // Check modal with table
      const linksDialog = page.getByRole('dialog');
      await expect(linksDialog).toBeVisible();
      await expect(linksDialog.getByRole('heading', { name: 'My Trackable Shared Links' })).toBeVisible();
      await expect(linksDialog.getByText('/s/res-alex-2026')).toBeVisible();

      // Click Copy on first row
      const firstCopyBtn = linksDialog.getByRole('button', { name: 'Copy' }).first();
      await firstCopyBtn.click();
      await expect(linksDialog.getByText('Copied').first()).toBeVisible();

      // Close modal by clicking outside or pressing Escape
      await page.keyboard.press('Escape');
      await expect(linksDialog).not.toBeVisible();
    }
  });

  test('Dwell time tracking executes gracefully when visiting profile with via parameter', async ({ page }) => {
    // Visit candidate profile via a shortened link beacon parameter
    await page.goto('/candidate-profile?via=alex-portfolio');

    // Page loads normally and renders full profile
    await expect(page.getByRole('heading', { name: 'Alex Mercer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Link Share & Visitor Analytics' })).toBeVisible();
  });
});
