import { test, expect } from '@playwright/test';

test.describe('F10 AI Interactive Interviews & Domain Readiness Evaluation E2E Tests', () => {
  const CANDIDATE_USER = {
    id: '123456789012345678901234',
    fullName: 'Alex Mercer',
    email: 'alex.mercer@fortlio.dev',
    role: 'candidate',
    coins: 20,
    isOnboarded: true,
  };

  const MOCK_SESSION_START = {
    id: 'session-6789',
    _id: 'session-6789',
    candidateId: '123456789012345678901234',
    profession: 'Engineering & Technology',
    specialty: 'Distributed Systems',
    targetLevel: 'Senior',
    status: 'in_progress',
    currentTurn: 0,
    maxTurns: 4,
    turns: [
      {
        questionId: 'q-1',
        questionText: 'How do you design a leader election protocol that avoids split-brain during partial network partitions?',
        askedAt: new Date().toISOString(),
      },
    ],
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const MOCK_SCORECARD = {
    overallScore: 92,
    readinessBadge: 'Expert / Lead',
    domainDepthScore: 95,
    problemSolvingScore: 90,
    communicationScore: 92,
    leadershipScore: 88,
    strengths: [
      'Mastery of Raft and Paxos consensus quorum configurations',
      'Articulated clear fencing token strategies against stale leaders',
      'Strong architectural focus on failover latency and network heartbeat jitter',
    ],
    areasForImprovement: [
      'Quantify disk write latency implications on multi-region write replication',
      'Consider chaos engineering practices in disaster recovery simulation',
    ],
    summary: 'Alex demonstrated exceptional technical leadership in distributed systems, formulating robust consensus architectures with realistic trade-off analysis.',
    evaluatedAt: new Date().toISOString(),
  };

  const MOCK_SESSION_COMPLETED = {
    ...MOCK_SESSION_START,
    status: 'completed',
    currentTurn: 3,
    turns: [
      {
        questionId: 'q-1',
        questionText: 'How do you design a leader election protocol that avoids split-brain during partial network partitions?',
        answerText: 'We enforce an odd-numbered quorum cluster and utilize term leases. Nodes cannot declare leadership without majority heartbeat confirmations.',
        audioDurationSeconds: 45,
        askedAt: new Date().toISOString(),
        answeredAt: new Date().toISOString(),
      },
      {
        questionId: 'q-2',
        questionText: 'How do you handle log reconciliation when a partition heals with conflicting uncommitted entries?',
        answerText: 'The leader forces followers to overwrite uncommitted logs back to the last common commit index using AppendEntries RPCs.',
        audioDurationSeconds: 30,
        askedAt: new Date().toISOString(),
        answeredAt: new Date().toISOString(),
      },
    ],
    scorecard: MOCK_SCORECARD,
  };

  const MOCK_HISTORY = [
    {
      id: 'session-1234',
      _id: 'session-1234',
      candidateId: '123456789012345678901234',
      profession: 'Engineering & Technology',
      specialty: 'Cloud Infrastructure & Kubernetes',
      targetLevel: 'Senior',
      status: 'completed',
      currentTurn: 4,
      maxTurns: 4,
      turns: [],
      scorecard: {
        overallScore: 89,
        readinessBadge: 'Advanced',
      },
      isPublic: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  test.beforeEach(async ({ page }) => {
    // Inject candidate auth tokens
    await page.addInitScript((user) => {
      localStorage.setItem('accessToken', 'mock-jwt-token-cand');
      localStorage.setItem('refreshToken', 'mock-refresh-token-cand');
      localStorage.setItem('user', JSON.stringify(user));
    }, CANDIDATE_USER);

    // Mock history endpoint
    await page.route('**/interview/my-history*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            data: MOCK_HISTORY,
            totalCount: 1,
            page: 1,
            pageSize: 10,
            totalPages: 1,
          },
        }),
      });
    });

    // Mock start endpoint
    await page.route('**/interview/start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: MOCK_SESSION_START,
        }),
      });
    });

    // Mock respond endpoint
    await page.route('**/interview/session/*/respond', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            turnCompleted: 1,
            maxTurns: 4,
            nextQuestion: 'How do you handle log reconciliation when a partition heals with conflicting uncommitted entries?',
            isComplete: false,
          },
        }),
      });
    });

    // Mock conclude endpoint
    await page.route('**/interview/session/*/conclude', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: MOCK_SESSION_COMPLETED,
        }),
      });
    });

    // Mock report endpoint
    await page.route('**/interview/report/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: MOCK_SESSION_COMPLETED,
        }),
      });
    });

    // Mock visibility toggle
    await page.route('**/interview/session/*/visibility', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 'session-6789', isPublic: true },
        }),
      });
    });
  });

  test('Interview Hub renders hero, parameters form, and past interview history', async ({ page }) => {
    await page.goto('/interview');

    // Verify main heading
    await expect(page.getByRole('heading', { name: 'Universal AI Domain Interviews' })).toBeVisible();

    // Verify profession options exist
    await expect(page.getByRole('button', { name: 'Engineering & Technology' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Healthcare & Medicine' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Legal, Compliance & Risk' })).toBeVisible();

    // Verify target seniority options exist
    await expect(page.getByRole('button', { name: 'Senior' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Staff / Principal' })).toBeVisible();

    // Verify past history in sidebar
    await expect(page.getByText('Cloud Infrastructure & Kubernetes')).toBeVisible();
    await expect(page.getByText('Advanced')).toBeVisible();
  });

  test('Candidate customizes specialty, starts interview simulation room, and sees first question', async ({ page }) => {
    await page.goto('/interview');

    // Switch profession
    await page.getByRole('button', { name: 'Healthcare & Medicine' }).click();

    // Verify specialty suggestions updated
    await expect(page.getByRole('button', { name: 'Internal Medicine' })).toBeVisible();
    await page.getByRole('button', { name: 'Internal Medicine' }).click();

    // Click launch button
    const startBtn = page.getByRole('button', { name: /Start Interview Simulation/i });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // Room should appear
    await expect(page.locator('[data-testid="interview-session-room"]')).toBeVisible();
    await expect(page.getByText(/Distributed Systems Simulation/i)).toBeVisible();
    await expect(page.getByText(/Question 1 of 4/i)).toBeVisible();
    await expect(page.getByText(/How do you design a leader election protocol/i)).toBeVisible();
  });

  test('Candidate enters response and receives adaptive next turn', async ({ page }) => {
    await page.goto('/interview');
    await page.getByRole('button', { name: /Start Interview Simulation/i }).click();

    const textarea = page.getByPlaceholder(/Synthesize your answer clearly/i);
    await textarea.fill('We enforce an odd-numbered quorum cluster and utilize term leases. Nodes cannot declare leadership without majority heartbeat confirmations.');

    const submitBtn = page.getByRole('button', { name: /Submit Answer/i });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Next question should appear
    await expect(page.getByText(/How do you handle log reconciliation when a partition heals/i)).toBeVisible();
    await expect(page.getByText(/Question 2 of 4/i)).toBeVisible();
  });

  test('Candidate concludes interview session and examines multi-dimensional scorecard', async ({ page }) => {
    await page.goto('/interview');
    await page.getByRole('button', { name: /Start Interview Simulation/i }).click();

    // Conclude session early
    const concludeBtn = page.getByRole('button', { name: /Conclude Session/i });
    await concludeBtn.click();

    // Scorecard view should be displayed
    await expect(page.locator('[data-testid="interview-scorecard"]')).toBeVisible();

    // Verify overall score circle
    await expect(page.getByText('92', { exact: true })).toBeVisible();
    await expect(page.getByText('/ 100')).toBeVisible();

    // Verify readiness badge
    await expect(page.getByText('Expert / Lead')).toBeVisible();

    // Verify dimensional metrics
    await expect(page.getByText('Domain Depth & Precision')).toBeVisible();
    await expect(page.getByText('Problem Solving & Scenario Analysis')).toBeVisible();
    await expect(page.getByText('Communication & Articulation')).toBeVisible();
    await expect(page.getByText('Leadership, Ownership & Collaboration')).toBeVisible();

    // Verify strengths and improvement areas
    await expect(page.getByText('Mastery of Raft and Paxos consensus quorum configurations')).toBeVisible();
    await expect(page.getByText('Quantify disk write latency implications on multi-region write replication')).toBeVisible();

    // Verify transcript log contains questions
    await expect(page.getByText('Interview Transcript & Q&A Log')).toBeVisible();
  });

  test('Scorecard supports public visibility toggle and return to interview hub', async ({ page }) => {
    await page.goto('/interview');
    await page.getByRole('button', { name: /Start Interview Simulation/i }).click();
    await page.getByRole('button', { name: /Conclude Session/i }).click();

    // Toggle visibility
    const visibilityBtn = page.getByRole('button', { name: /Private/i });
    await expect(visibilityBtn).toBeVisible();
    await visibilityBtn.click();
    await expect(page.getByRole('button', { name: /Public/i })).toBeVisible();

    // Return to Hub
    const backBtn = page.getByRole('button', { name: /Take Another Interview/i });
    await backBtn.click();

    await expect(page.locator('[data-testid="interview-hub"]')).toBeVisible();
  });
});
