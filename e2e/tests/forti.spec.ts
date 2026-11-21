import { test, expect } from '@playwright/test';

test.describe('F09 Forti AI Engine & Profile Chatbot E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Seed authenticated candidate/recruiter session in localStorage
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

  test('Forti AI Insights tab renders velocity score, depth, topic diversity, and leadership qualities', async ({ page }) => {
    await page.goto('/candidate-profile');

    // Click Forti AI Insights Tab
    const fortiTab = page.getByRole('tab', { name: /Forti AI Insights/ });
    await fortiTab.click();

    // Verify Card title and authentic validation badge
    await expect(page.getByRole('heading', { name: /Forti AI Candidate Insights & Leadership Synthesis/ })).toBeVisible();
    await expect(page.getByText('Authentic Input Verified')).toBeVisible();

    // Verify key metrics
    await expect(page.getByText('Learning Velocity Score')).toBeVisible();
    await expect(page.getByText('Knowledge Volume & Depth')).toBeVisible();
    await expect(page.getByText('Topic Diversity Score')).toBeVisible();

    // Verify Leadership and Domain Badges
    await expect(page.getByRole('heading', { name: 'Leadership & Soft Qualities' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Verified Domains & Specialty Topics' })).toBeVisible();

    // Verify CTA button in card
    await expect(page.getByRole('button', { name: 'Chat with Candidate Profile (AI)' })).toBeVisible();
  });

  test('Open Forti AI Chat Drawer from hero button, ask question, and receive grounded response', async ({ page }) => {
    await page.goto('/candidate-profile');

    // Click "Chat with Profile" from top hero action buttons
    const chatBtn = page.getByRole('button', { name: 'Chat with Profile' });
    await expect(chatBtn).toBeVisible();
    await chatBtn.click();

    // Verify Drawer Sheet opens
    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole('heading', { name: 'Chat with Candidate Profile' })).toBeVisible();
    await expect(sheet.getByText('Hello! I am Forti AI')).toBeVisible();

    // Verify suggested question prompt pills
    await expect(sheet.getByText('Suggested Recruiter Inquiries')).toBeVisible();
    const suggestedBtn = sheet.getByRole('button', { name: 'Summarize their systems architecture experience' });
    await expect(suggestedBtn).toBeVisible();

    // Click suggested prompt
    await suggestedBtn.click();

    // Verify user message appears in stream
    await expect(sheet.getByRole('paragraph').filter({ hasText: 'Summarize their systems architecture experience' })).toBeVisible();

    // Verify response from Forti AI renders
    await expect(sheet.locator('.prose').nth(1)).toBeVisible();
    await expect(sheet.locator('.prose').nth(1)).toContainText('Alex Mercer');

    // Send custom question via input
    const input = sheet.getByPlaceholder(/Ask anything about/);
    await input.fill('What leadership qualities are verified?');
    const sendBtn = sheet.locator('button[type="submit"]');
    await sendBtn.click();

    await expect(sheet.getByRole('paragraph').filter({ hasText: 'What leadership qualities are verified?' })).toBeVisible();
    await expect(sheet.locator('.prose').nth(2)).toBeVisible();
    await expect(sheet.locator('.prose').nth(2)).toContainText(/leadership/i);

    // Close drawer with escape or close button
    await page.keyboard.press('Escape');
    await expect(sheet).not.toBeVisible();
  });

  test('Open Forti AI Chat Drawer from Insights tab CTA button and test clear chat', async ({ page }) => {
    await page.goto('/candidate-profile');

    // Go to Forti tab
    await page.getByRole('tab', { name: /Forti AI Insights/ }).click();

    // Click CTA button at bottom of insights card
    await page.getByRole('button', { name: 'Chat with Candidate Profile (AI)' }).click();

    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();

    // Reset conversation button
    const resetBtn = sheet.getByTitle('Reset conversation');
    await resetBtn.click();

    // Only welcome message remains
    await expect(sheet.getByText('Hello! I am Forti AI')).toBeVisible();

    // Close sheet
    await page.keyboard.press('Escape');
    await expect(sheet).not.toBeVisible();
  });
});
