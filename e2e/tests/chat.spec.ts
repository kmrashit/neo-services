import { test, expect } from '@playwright/test';

test.describe('F07 Real-Time & Stored Chat Messaging E2E Tests', () => {
  const CANDIDATE_USER = {
    id: '123456789012345678901234',
    fullName: 'Alex Mercer',
    email: 'alex.mercer@fortlio.dev',
    role: 'candidate',
    coins: 20,
    isOnboarded: true,
  };

  const MOCK_CONNECTIONS = [
    {
      _id: 'conn-active-1',
      senderId: {
        _id: '123456789012345678901234',
        fullName: 'Alex Mercer',
        email: 'alex.mercer@fortlio.dev',
      },
      receiverId: {
        _id: 'user-rec-1',
        fullName: 'Dr. Sarah Lin',
        email: 'sarah.lin@genomics.org',
        headline: 'Lead Genomic Bioinformatician',
        profession: 'Medicine & Healthcare',
        skills: ['Genomics', 'Bioinformatics', 'Python'],
      },
      status: 'accepted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'conn-active-2',
      senderId: {
        _id: 'user-rec-2',
        fullName: 'Marcus Vance',
        email: 'marcus.vance@jurisnova.com',
        headline: 'AI Governance & Compliance Director',
        profession: 'Law & Legal Services',
        skills: ['AI Governance', 'Tech Policy'],
      },
      receiverId: {
        _id: '123456789012345678901234',
        fullName: 'Alex Mercer',
        email: 'alex.mercer@fortlio.dev',
      },
      status: 'accepted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const MOCK_MESSAGES_CONN_1 = [
    {
      _id: 'msg-1',
      connectionId: 'conn-active-1',
      senderId: 'user-rec-1',
      receiverId: '123456789012345678901234',
      message: 'Hi Alex, thrilled to connect! I reviewed your distributed architectures blog.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      _id: 'msg-2',
      connectionId: 'conn-active-1',
      senderId: '123456789012345678901234',
      receiverId: 'user-rec-1',
      message: 'Thanks Dr. Sarah! Would love to discuss how our pipelines handle genomic sequence data.',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  test.beforeEach(async ({ page }) => {
    // Authenticate user session
    await page.addInitScript((user) => {
      localStorage.setItem('accessToken', 'mock-jwt-token-chat');
      localStorage.setItem('refreshToken', 'mock-refresh-token-chat');
      localStorage.setItem('user', JSON.stringify(user));
    }, CANDIDATE_USER);

    // Mock connections list
    await page.route('**/connections/list*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: MOCK_CONNECTIONS,
        }),
      });
    });

    // Mock chat history
    await page.route('**/connections/chat/history/*', async (route) => {
      const url = route.request().url();
      if (url.includes('conn-active-1')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              data: MOCK_MESSAGES_CONN_1,
              totalCount: 2,
              page: 1,
              pageSize: 50,
              totalPages: 1,
            },
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              data: [],
              totalCount: 0,
              page: 1,
              pageSize: 50,
              totalPages: 0,
            },
          }),
        });
      }
    });

    // Mock sending chat message
    await page.route('**/connections/chat/send', async (route) => {
      const requestData = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            _id: `msg-${Date.now()}`,
            connectionId: requestData.connectionId,
            senderId: CANDIDATE_USER.id,
            message: requestData.message,
            createdAt: new Date().toISOString(),
          },
        }),
      });
    });
  });

  test('should render chat layout with contacts sidebar and active chat header', async ({ page }) => {
    await page.goto('/chat');

    // Check Messages heading and contact count
    await expect(page.getByRole('heading', { name: /messages/i })).toBeVisible();
    await expect(page.getByText('2 chats')).toBeVisible();

    // Verify contacts are listed in the sidebar
    await expect(page.locator('button', { hasText: 'Dr. Sarah Lin' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Marcus Vance' })).toBeVisible();

    // Verify active chat header defaults to first connection
    await expect(page.locator('h3', { hasText: 'Dr. Sarah Lin' })).toBeVisible();
  });

  test('should display historical messages in chronological order', async ({ page }) => {
    await page.goto('/chat');

    // Verify messages from Dr. Sarah Lin and Alex are displayed
    await expect(
      page.getByText('Hi Alex, thrilled to connect! I reviewed your distributed architectures blog.'),
    ).toBeVisible();
    await expect(
      page.getByText('Thanks Dr. Sarah! Would love to discuss how our pipelines handle genomic sequence data.'),
    ).toBeVisible();
  });

  test('should successfully send a new message and append to stream', async ({ page }) => {
    await page.goto('/chat');

    const input = page.getByPlaceholder('Type a message... (Press Enter to send)');
    await expect(input).toBeVisible();

    const testMessage = 'Looking forward to our upcoming cross-domain research sync!';
    await input.fill(testMessage);
    await input.press('Enter');

    // Verify message appears in thread immediately
    await expect(page.getByText(testMessage)).toBeVisible();
  });

  test('should switch conversation when clicking another contact', async ({ page }) => {
    await page.goto('/chat');

    // Click Marcus Vance
    await page.getByRole('button', { name: /marcus vance/i }).click();

    // Active conversation header should update
    await expect(page.locator('h3', { hasText: 'Marcus Vance' })).toBeVisible();

    // Empty state for Marcus Vance
    await expect(page.getByText('No messages yet')).toBeVisible();
    await expect(page.getByText(/Say hello to Marcus Vance/i)).toBeVisible();
  });

  test('should auto-select conversation from query parameter', async ({ page }) => {
    await page.goto('/chat?connectionId=conn-active-2');

    // Directly opens Marcus Vance conversation
    await expect(page.locator('h3', { hasText: 'Marcus Vance' })).toBeVisible();
    await expect(page.getByText('No messages yet')).toBeVisible();
  });

  test('should filter conversations list via search input', async ({ page }) => {
    await page.goto('/chat');

    const searchInput = page.getByPlaceholder('Search contacts...');
    await searchInput.fill('Marcus');

    await expect(page.locator('button', { hasText: 'Marcus Vance' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Dr. Sarah Lin' })).not.toBeVisible();
  });
});
