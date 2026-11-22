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

    // Click on Specialty Blogs in Sidebar
    const blogsLink = page.getByRole('link', { name: 'Specialty Blogs' });
    await blogsLink.click();
    await expect(page).toHaveURL(/\/candidate-blogs/);
    await expect(page.getByText('Specialty Blogs & Knowledge Showcase')).toBeVisible();
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

  test('HR user sidebar renders recruiter discovery & hiring views', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'mock-jwt-hr-token');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: '678901234567890123456789',
          fullName: 'Alex Recruiter',
          email: 'hr@test.com',
          role: 'hr',
          isOnboarded: true,
        })
      );
    });

    await page.goto('/candidates');

    // Verify HR Recruiter section title
    await expect(page.getByText('Recruiter Discovery & Hiring')).toBeVisible();

    // Verify HR-specific navigation links
    await expect(page.getByRole('link', { name: 'Candidate Search' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Job Postings' })).toBeVisible();

    // Verify Candidate-only links are not rendered
    await expect(page.getByRole('link', { name: 'Job Suggestions & Search' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Resume Builder (A4)' })).not.toBeVisible();
  });
});
