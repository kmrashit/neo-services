import { test, expect } from '@playwright/test';

test.describe('Candidate Specialty Blogs & Knowledge Showcase E2E Tests', () => {
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

  test('Specialty Blogs feed renders banner, tag filter bar, search input, and blog cards', async ({ page }) => {
    await page.goto('/candidate-blogs');

    // Header banner and title
    await expect(page.getByRole('heading', { name: 'Specialty Blogs & Knowledge Showcase' })).toBeVisible();
    await expect(page.getByText('Forti Evaluated')).toBeVisible();

    // CTA
    await expect(page.getByRole('button', { name: 'Write New Blog' })).toBeVisible();

    // Search input
    const searchInput = page.getByPlaceholder('Search articles by title, keywords or concepts...');
    await expect(searchInput).toBeVisible();

    // Tag pills
    await expect(page.getByRole('button', { name: 'All Topics' })).toBeVisible();
    await expect(page.getByRole('button', { name: '#Engineering' })).toBeVisible();

    // Initial blogs
    await expect(page.getByText('Optimizing MongoDB Pipelines with Post-Facet Slicing & Lookups')).toBeVisible();
  });

  test('Filter blogs by topic tag and search query', async ({ page }) => {
    await page.goto('/candidate-blogs');

    // Filter by #Healthcare
    const healthcareBtn = page.getByRole('button', { name: '#Healthcare' });
    await healthcareBtn.click();

    await expect(page.getByText('Clinical Decision Support Systems: Evaluating Diagnostic Precision & Latency')).toBeVisible();
    await expect(page.getByText('Optimizing MongoDB Pipelines with Post-Facet Slicing & Lookups')).not.toBeVisible();

    // Reset back to All Topics
    await page.getByRole('button', { name: 'All Topics' }).click();
    await expect(page.getByText('Optimizing MongoDB Pipelines with Post-Facet Slicing & Lookups')).toBeVisible();

    // Search by text query
    const searchInput = page.getByPlaceholder('Search articles by title, keywords or concepts...');
    await searchInput.fill('Intellectual Property');

    await expect(page.getByText('Intellectual Property Strategies in Generative AI Model Training')).toBeVisible();
    await expect(page.getByText('Optimizing MongoDB Pipelines with Post-Facet Slicing & Lookups')).not.toBeVisible();

    // Clear search
    await searchInput.fill('');
    await expect(page.getByText('Optimizing MongoDB Pipelines with Post-Facet Slicing & Lookups')).toBeVisible();
  });

  test('Open and read full Markdown article in BlogDetailView modal', async ({ page }) => {
    await page.goto('/candidate-blogs');

    // Find article card and click to open
    await page.getByRole('heading', { name: 'Optimizing MongoDB Pipelines with Post-Facet Slicing & Lookups' }).click();

    // Check modal contents
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Optimizing MongoDB Pipelines with Post-Facet Slicing & Lookups' })).toBeVisible();
    await expect(dialog.getByText('The Naive Pattern: Joining Too Early')).toBeVisible();
    await expect(dialog.getByText('Forti AI Insights Verification')).toBeVisible();

    // Click Back to Articles to close modal
    await dialog.getByRole('button', { name: 'Back to Articles' }).click();
    await expect(dialog).not.toBeVisible();
  });

  test('Author and publish new specialty blog with live Markdown preview and Forti analysis', async ({ page }) => {
    await page.goto('/candidate-blogs');

    // Open blog editor
    await page.getByRole('button', { name: 'Write New Blog' }).click();

    const editorDialog = page.getByRole('dialog');
    await expect(editorDialog).toBeVisible();
    await expect(editorDialog.getByRole('heading', { name: 'Write Specialty Domain Blog' })).toBeVisible();

    // Fill Title
    const titleInput = editorDialog.getByLabel('Article Title');
    await titleInput.fill('High-Throughput Event Streaming with Redis Streams and Bun');

    // Add Tag
    const tagInput = editorDialog.getByPlaceholder('Add tag and press Enter...');
    await tagInput.fill('Streaming');
    await editorDialog.getByRole('button', { name: 'Add' }).click();
    await expect(editorDialog.getByText('#Streaming')).toBeVisible();

    // Fill Markdown content
    const contentTextarea = editorDialog.getByPlaceholder(/Write your article in Markdown/);
    await contentTextarea.fill(`## High-Throughput Event Streaming

Event-driven architectures require sub-millisecond ingestion and deterministic consumer group acknowledgment.

### Benchmark Results
- 120,000 ops/sec sustained throughput
- Memory footprint bounded under 64MB using capped streams`);

    // Test Preview tab
    await editorDialog.getByRole('tab', { name: 'Preview' }).click();
    await expect(editorDialog.getByRole('heading', { name: 'High-Throughput Event Streaming' })).toBeVisible();
    await expect(editorDialog.getByText('Benchmark Results')).toBeVisible();

    // Switch back to Write tab
    await editorDialog.getByRole('tab', { name: 'Write' }).click();

    // Publish Article
    const publishBtn = editorDialog.getByRole('button', { name: 'Publish Specialty Article' });
    await publishBtn.click();

    // Verifies editor closes and reader view opens with the new article
    const readerDialog = page.getByRole('dialog');
    await expect(readerDialog).toBeVisible();
    await expect(readerDialog.getByRole('heading', { name: 'High-Throughput Event Streaming with Redis Streams and Bun' })).toBeVisible();
    await expect(readerDialog.getByText('Benchmark Results')).toBeVisible();

    // Close reader dialog and verify card in feed
    await readerDialog.getByRole('button', { name: 'Back to Articles' }).click();
    await expect(page.getByText('High-Throughput Event Streaming with Redis Streams and Bun')).toBeVisible();
  });
});
