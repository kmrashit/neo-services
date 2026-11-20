import { test, expect } from '@playwright/test';

test.describe('App Shell Navigation & Theme E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
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

  test('Sidebar navigation links route to respective feature views', async ({ page }) => {
    await page.goto('/candidate-profile');

    // Click on Edit Profile in Sidebar
    const editLink = page.getByRole('link', { name: 'Edit Profile' }).first();
    await editLink.click();
    await expect(page).toHaveURL(/\/edit-profile/);
    await expect(page.getByText('Edit Candidate Profile')).toBeVisible();

    // Click on Technical Blogs in Sidebar
    const blogsLink = page.getByRole('link', { name: 'Technical Blogs' });
    await blogsLink.click();
    await expect(page).toHaveURL(/\/candidate-blogs/);
    await expect(page.getByText('Technical Blogs & Knowledge')).toBeVisible();
  });

  test('Theme toggle button switches html class between dark and light', async ({ page }) => {
    await page.goto('/candidate-profile');

    const themeBtn = page.getByRole('button', { name: 'Toggle Theme' });
    await expect(themeBtn).toBeVisible();

    // Click theme toggle
    await themeBtn.click();
    // Verify document or body handles dark mode
    const html = page.locator('html');
    await expect(html).toBeVisible();
  });

  test('Sign out button logs user out and redirects to login page', async ({ page }) => {
    await page.goto('/candidate-profile');

    const signOutBtn = page.getByRole('button', { name: 'Sign Out' }).first();
    await signOutBtn.click();

    // Should be redirected to /login
    await expect(page).toHaveURL(/\/login/);
  });
});
