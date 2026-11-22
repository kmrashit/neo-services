import { test, expect } from '@playwright/test';

test.describe('F11 Job Board & Recruitment Engine E2E Tests', () => {
  const CANDIDATE_USER = {
    id: '123456789012345678901234',
    fullName: 'Alex Mercer',
    email: 'alex.mercer@fortlio.dev',
    role: 'candidate',
    coins: 20,
    isOnboarded: true,
  };

  const HR_USER = {
    id: '567890123456789012345678',
    fullName: 'Eleanor Sterling',
    email: 'hr@biotherapeutics.org',
    role: 'hr',
    coins: 100,
    isOnboarded: true,
  };

  const MOCK_JOBS = [
    {
      _id: 'job-1',
      hrUserId: '567890123456789012345678',
      title: 'Staff Distributed Systems Engineer',
      companyName: 'Veloce Cloud Systems',
      profession: 'Engineering & Technology',
      department: 'Core Infrastructure',
      location: 'San Francisco, CA (Remote)',
      workplaceType: 'Remote',
      experienceYears: 6,
      salaryRange: '$185,000 - $230,000',
      skills: ['TypeScript', 'Distributed Systems', 'MongoDB', 'Redis', 'Kafka'],
      matchScore: 98,
      applicantCount: 14,
      status: 'active',
      description: 'Looking for a Staff Systems Engineer to lead the design and optimization of our high-throughput aggregation pipelines.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'job-2',
      hrUserId: '567890123456789012345678',
      title: 'Senior Clinical Bioinformatician',
      companyName: 'Genomics Health Institute',
      profession: 'Healthcare & Medicine',
      department: 'Translational Genetics',
      location: 'Boston, MA (Hybrid)',
      workplaceType: 'Hybrid',
      experienceYears: 5,
      salaryRange: '$160,000 - $195,000',
      skills: ['Genomics', 'Bioinformatics', 'Python'],
      matchScore: 91,
      applicantCount: 8,
      status: 'active',
      description: 'Analyze next-generation sequencing pipelines and translate variant discovery algorithms into clinical therapeutics.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const MOCK_APPLICANTS = [
    {
      _id: 'app-1',
      jobId: 'job-1',
      candidateId: '123456789012345678901234',
      status: 'applied',
      coverNote: 'Excited about the distributed systems pipeline role! My blog covers our streaming engine.',
      createdAt: new Date().toISOString(),
      candidate: {
        _id: '123456789012345678901234',
        fullName: 'Alex Mercer',
        email: 'alex.mercer@fortlio.dev',
        headline: 'Staff Infrastructure & Distributed Systems Architect',
        profession: 'Engineering & Technology',
        skills: ['TypeScript', 'Distributed Systems', 'MongoDB', 'Redis'],
      },
    },
  ];

  test.describe('Candidate Job Board Workflow (/jobs)', () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((user) => {
        localStorage.setItem('accessToken', 'mock-jwt-token-cand');
        localStorage.setItem('refreshToken', 'mock-refresh-token-cand');
        localStorage.setItem('user', JSON.stringify(user));
      }, CANDIDATE_USER);

      // Mock suggestions
      await page.route('**/job/suggestions', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: MOCK_JOBS,
          }),
        });
      });

      // Mock search
      await page.route('**/job/search*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              data: MOCK_JOBS,
              totalCount: 2,
              page: 1,
              pageSize: 12,
              totalPages: 1,
            },
          }),
        });
      });

      // Mock apply
      await page.route('**/job/apply/*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Application submitted successfully',
          }),
        });
      });
    });

    test('should render AI suggestions tab with match scores and job specs', async ({ page }) => {
      await page.goto('/jobs');

      // Verify page banner
      await expect(page.getByRole('heading', { name: /career & opportunity engine/i })).toBeVisible();

      // Check that AI recommendations tab is active and shows match score
      await expect(page.getByText('98% AI Match')).toBeVisible();
      await expect(page.getByText('Staff Distributed Systems Engineer')).toBeVisible();
      await expect(page.getByText('Veloce Cloud Systems')).toBeVisible();
    });

    test('should open job detail modal and submit application with cover note', async ({ page }) => {
      await page.goto('/jobs');

      // Click View Details on first job
      const viewDetailsBtn = page.getByRole('button', { name: 'View Details' }).first();
      await viewDetailsBtn.click();

      // Verify modal content
      const modal = page.locator('[role="dialog"]');
      await expect(modal.getByRole('heading', { name: 'Staff Distributed Systems Engineer' })).toBeVisible();
      await expect(modal.getByText('Veloce Cloud Systems')).toBeVisible();
      await expect(modal.getByText('Looking for a Staff Systems Engineer')).toBeVisible();

      // Fill cover note
      const coverInput = page.getByPlaceholder(/Highlight your domain strengths/i);
      await coverInput.fill('Excited about high-throughput distributed pipelines!');

      // Click Apply
      const applyBtn = page.getByRole('button', { name: /apply with verified profile/i });
      await applyBtn.click();

      // Verify success badge
      await expect(page.getByText('Application Submitted Successfully!')).toBeVisible();
    });

    test('should switch to browse all openings tab and filter by workplace', async ({ page }) => {
      await page.goto('/jobs');

      // Switch to browse all
      await page.getByRole('tab', { name: /browse all openings/i }).click();

      // Verify filter panel
      await expect(page.getByPlaceholder(/search by job title, department, or company/i)).toBeVisible();
      await expect(page.getByText('Workplace:')).toBeVisible();

      // Both jobs should be rendered
      await expect(page.getByText('Staff Distributed Systems Engineer')).toBeVisible();
      await expect(page.getByText('Senior Clinical Bioinformatician')).toBeVisible();
    });
  });

  test.describe('HR Recruiter Job Postings Workflow (/hr/jobs)', () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((user) => {
        localStorage.setItem('accessToken', 'mock-jwt-token-hr');
        localStorage.setItem('refreshToken', 'mock-refresh-token-hr');
        localStorage.setItem('user', JSON.stringify(user));
      }, HR_USER);

      // Mock HR job posts
      await page.route('**/job/hr/my-posts*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              data: MOCK_JOBS,
              totalCount: 2,
              page: 1,
              pageSize: 50,
              totalPages: 1,
            },
          }),
        });
      });

      // Mock create job
      await page.route('**/job/create', async (route) => {
        const body = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              _id: `job-new-${Date.now()}`,
              hrUserId: HR_USER.id,
              ...body,
              applicantCount: 0,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          }),
        });
      });

      // Mock applicants
      await page.route('**/job/*/applicants*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              data: MOCK_APPLICANTS,
              totalCount: 1,
              page: 1,
              pageSize: 20,
              totalPages: 1,
            },
          }),
        });
      });

      // Mock update status
      await page.route('**/job/*/status', async (route) => {
        const body = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              status: body.status,
            },
          }),
        });
      });
    });

    test('should render recruiter dashboard with metrics and active listings table', async ({ page }) => {
      await page.goto('/hr/jobs');

      // Verify header and metrics
      await expect(page.getByRole('heading', { name: /recruitment & job postings/i })).toBeVisible();
      await expect(page.getByText('Total Listings')).toBeVisible();
      await expect(page.getByText('Active Openings')).toBeVisible();
      await expect(page.getByText('Total Applicants')).toBeVisible();

      // Check table rows
      await expect(page.getByText('Staff Distributed Systems Engineer')).toBeVisible();
      await expect(page.getByText('Senior Clinical Bioinformatician')).toBeVisible();
    });

    test('should open Post New Job modal and publish a role', async ({ page }) => {
      await page.goto('/hr/jobs');

      // Click Post New Job button
      await page.getByRole('button', { name: /post new job/i }).click();

      // Verify modal is open
      await expect(page.getByRole('heading', { name: 'Post New Job Opening' })).toBeVisible();

      // Fill in role fields
      await page.locator('#job-title-input').fill('Lead Clinical AI Scientist');
      await page.locator('#company-name-input').fill('BioTherapeutics R&D');
      await page.locator('#location-input').fill('Cambridge, MA');
      await page.locator('#skills-input').fill('Biomedical AI, Deep Learning, Python');

      // Submit
      await page.getByRole('button', { name: /publish role/i }).click();

      // Modal should close and newly published role should appear
      await expect(page.getByText('Lead Clinical AI Scientist')).toBeVisible();
    });

    test('should open applicants drawer to inspect candidate applications', async ({ page }) => {
      await page.goto('/hr/jobs');

      // Click Applicants action on first row
      const applicantsBtn = page.getByRole('button', { name: 'Applicants' }).first();
      await applicantsBtn.click();

      // Verify applicants drawer opens with candidate details
      await expect(page.getByRole('heading', { name: /applicants: staff distributed systems engineer/i })).toBeVisible();
      await expect(page.getByText('Alex Mercer')).toBeVisible();
      await expect(page.getByText('alex.mercer@fortlio.dev')).toBeVisible();
      await expect(page.getByText(/Excited about the distributed systems pipeline role/i)).toBeVisible();
    });
  });
});
