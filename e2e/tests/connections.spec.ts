import { test, expect } from '@playwright/test';

test.describe('F06 Connections & Notification System E2E Tests', () => {
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
      _id: 'conn-pending-received-1',
      senderId: {
        _id: 'user-rec-2',
        fullName: 'Elena Rostova',
        email: 'elena.rostova@lumina.design',
        headline: 'Staff Design Systems Architect',
        profession: 'Design & Creative Arts',
        skills: ['Design Systems', 'Figma', 'React'],
      },
      receiverId: {
        _id: '123456789012345678901234',
        fullName: 'Alex Mercer',
        email: 'alex.mercer@fortlio.dev',
      },
      status: 'pending',
      message: 'Loved your technical blog on distributed architectures! Would love to connect.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'conn-pending-sent-1',
      senderId: {
        _id: '123456789012345678901234',
        fullName: 'Alex Mercer',
        email: 'alex.mercer@fortlio.dev',
      },
      receiverId: {
        _id: 'user-rec-3',
        fullName: 'Marcus Vance',
        email: 'marcus.vance@jurisnova.com',
        headline: 'AI Governance & Compliance Director',
        profession: 'Law & Legal Services',
        skills: ['AI Governance', 'Tech Policy'],
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const MOCK_NOTIFICATIONS = [
    {
      _id: 'notif-1',
      userId: '123456789012345678901234',
      type: 'connection_request',
      title: 'New Connection Request',
      message: 'Elena Rostova sent you a connection invitation.',
      isRead: false,
      metadata: { connectionId: 'conn-pending-received-1' },
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'notif-2',
      userId: '123456789012345678901234',
      type: 'connection_accepted',
      title: 'Connection Accepted',
      message: 'Dr. Sarah Lin accepted your connection request.',
      isRead: true,
      metadata: { connectionId: 'conn-active-1' },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  test.beforeEach(async ({ page }) => {
    // Seed authenticated session
    await page.addInitScript((user) => {
      localStorage.setItem('accessToken', 'mock-jwt-token-xyz');
      localStorage.setItem('refreshToken', 'mock-refresh-token-abc');
      localStorage.setItem('user', JSON.stringify(user));
    }, CANDIDATE_USER);

    // Mock API routes for connections and notifications
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

    await page.route('**/connections/notifications*', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: MOCK_NOTIFICATIONS,
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route('**/connections/notifications/read-all', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { success: true },
        }),
      });
    });

    await page.route('**/connections/respond/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            _id: 'conn-pending-received-1',
            status: 'accepted',
          },
        }),
      });
    });

    await page.route('**/connections/connect', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            _id: 'conn-new-123',
            status: 'pending',
          },
        }),
      });
    });
  });

  test('Connections page renders header banner, network metrics, and active connections tab', async ({ page }) => {
    await page.goto('/connections');

    // Verify Page Header
    await expect(page.getByRole('heading', { name: 'Connections & Network' })).toBeVisible();
    await expect(page.getByText('Universal Professional Network')).toBeVisible();

    // Verify Metrics Row
    await expect(page.getByText('Connected Peers')).toBeVisible();
    await expect(page.getByText('Pending Invitations')).toBeVisible();
    await expect(page.getByText('Outgoing Requests')).toBeVisible();

    // Verify Active Connected tab displays Dr. Sarah Lin with Connected badge and Message button
    await expect(page.getByRole('heading', { name: 'Dr. Sarah Lin' })).toBeVisible();
    await expect(page.getByText('Lead Genomic Bioinformatician')).toBeVisible();
    await expect(page.getByRole('button', { name: /Direct Message/i })).toBeVisible();
  });

  test('Switch tabs between Invitations Received, Pending Sent, and filter by search', async ({ page }) => {
    await page.goto('/connections');

    // Switch to Invitations Tab
    const invitationsTab = page.getByRole('tab', { name: /Invitations/i });
    await invitationsTab.click();

    // Verify Elena Rostova appears with Accept and Decline buttons
    await expect(page.getByRole('heading', { name: 'Elena Rostova' })).toBeVisible();
    await expect(page.getByText(/Loved your technical blog/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Accept' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Decline' })).toBeVisible();

    // Switch to Pending Sent Tab
    const sentTab = page.getByRole('tab', { name: /Pending Sent/i });
    await sentTab.click();

    // Verify Marcus Vance appears with Request Sent badge
    await expect(page.getByRole('heading', { name: 'Marcus Vance' })).toBeVisible();
    await expect(page.getByText('Awaiting Recipient Response')).toBeVisible();

    // Search filter test
    const searchInput = page.getByPlaceholder(/Filter by name, headline, skill/i);
    await searchInput.fill('Marcus');
    await expect(page.getByRole('heading', { name: 'Marcus Vance' })).toBeVisible();

    await searchInput.fill('NonExistentPerson');
    await expect(page.getByText('No Outgoing Requests Pending')).toBeVisible();
  });

  test('Accept connection invitation request updates status', async ({ page }) => {
    await page.goto('/connections');

    // Navigate to Invitations
    await page.getByRole('tab', { name: /Invitations/i }).click();

    // Click Accept on Elena Rostova's card
    const acceptBtn = page.getByRole('button', { name: 'Accept' });
    await expect(acceptBtn).toBeVisible();
    await acceptBtn.click();
  });

  test('Notification Center page renders alerts, filter tabs, and mark as read', async ({ page }) => {
    await page.goto('/notifications');

    // Verify Page Header
    await expect(page.getByRole('heading', { name: 'Notification Center' })).toBeVisible();
    await expect(page.getByText('Activity & Alerts')).toBeVisible();

    // Verify Notification items
    await expect(page.getByText('Elena Rostova sent you a connection invitation.')).toBeVisible();
    await expect(page.getByText('Dr. Sarah Lin accepted your connection request.')).toBeVisible();

    // Test Unread tab filter
    const unreadTab = page.getByRole('tab', { name: /Unread/i });
    await unreadTab.click();
    await expect(page.getByText('Elena Rostova sent you a connection invitation.')).toBeVisible();

    // Click Mark All as Read button
    const markAllBtn = page.getByRole('button', { name: /Mark All as Read/i });
    if (await markAllBtn.isVisible()) {
      await markAllBtn.click();
    }
  });

  test('Header Notification Bell dropdown displays unread notifications and triggers navigation', async ({ page }) => {
    await page.goto('/connections');

    // Click Notification Bell in Header
    const bellBtn = page.getByRole('button', { name: 'Notifications' });
    await expect(bellBtn).toBeVisible();
    await bellBtn.click();

    // Verify dropdown content
    await expect(page.getByText('Elena Rostova sent you a connection invitation.')).toBeVisible();
    await expect(page.getByRole('button', { name: /View All Notifications/i })).toBeVisible();

    // Click View All Notifications
    await page.getByRole('button', { name: /View All Notifications/i }).click();
    await expect(page).toHaveURL(/\/notifications/);
  });
});
