import { test, expect } from '@playwright/test';

test.describe('Authentication & Landing Page E2E Tests', () => {
  test('Landing page loads successfully and displays branding and CTAs', async ({ page }) => {
    await page.goto('/');

    // Check title / brand text
    await expect(page.getByRole('link', { name: 'Fortlio' })).toBeVisible();

    // Check Hero text
    await expect(page.getByText('Where Code Speaks, Mindset Leads')).toBeVisible();

    // Check CTA buttons
    const getStartedBtn = page.getByRole('link', { name: 'Create Candidate Portfolio' });
    await expect(getStartedBtn).toBeVisible();

    const recruiterBtn = page.getByRole('link', { name: 'Recruiter Sign In' });
    await expect(recruiterBtn).toBeVisible();
  });

  test('Navigate from landing page to register form with role tabs', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Get Started' }).click();

    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByText('Join Fortlio')).toBeVisible();

    // Verify role tabs (Candidate vs Recruiter / HR)
    const candidateTab = page.getByRole('tab', { name: 'Candidate' });
    const hrTab = page.getByRole('tab', { name: 'Recruiter / HR' });

    await expect(candidateTab).toBeVisible();
    await expect(hrTab).toBeVisible();

    // Switch to Recruiter tab
    await hrTab.click();
    await expect(page.getByRole('button', { name: 'Create Recruiter Account' })).toBeVisible();

    // Switch back to Candidate tab
    await candidateTab.click();
    await expect(page.getByRole('button', { name: 'Create Candidate Account' })).toBeVisible();
  });

  test('Login form renders cleanly with validation', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByText('Welcome to Fortlio')).toBeVisible();

    const emailInput = page.getByPlaceholder('alex@example.com');
    const passwordInput = page.getByPlaceholder('••••••••');
    const submitBtn = page.getByRole('button', { name: 'Sign In' });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeDisabled();

    // Fill in inputs
    await emailInput.fill('alex@example.com');
    await passwordInput.fill('Password123!');

    await expect(submitBtn).toBeEnabled();
  });

  test('Protected route redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/candidate-profile');

    // Should redirect to /login
    await expect(page).toHaveURL(/\/login/);
  });
});
