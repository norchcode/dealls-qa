import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for LOCAL DEVELOPMENT
 * Optimized for visible browser testing and debugging
 * Use this config when running on your local machine
 */
export default defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry failed tests */
  retries: 1,
  
  /* Opt out of parallel tests for better visibility */
  workers: 1,
  
  /* Reporter configuration for comprehensive test reporting */
  reporter: [
    ['html', { 
      outputFolder: 'reports/html-report',
      open: 'on-failure'
    }],
    ['json', { 
      outputFile: 'reports/test-results.json' 
    }],
    ['line']
  ],
  
  /* Shared settings for all projects */
  use: {
    /* Base URL for testing */
    baseURL: 'https://job-portal-user-dev-skx7zw44dq-et.a.run.app',
    
    /* 
     * VISIBLE BROWSER MODE for local development
     * Shows browser window and slows down actions for visibility
     */
    headless: false,
    slowMo: 1000,
    
    /* Collect trace when retrying failed tests */
    trace: 'on-first-retry',
    
    /* Screenshot configuration */
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    
    /* Video recording configuration - 1080p */
    video: {
      mode: 'retain-on-failure',
      size: { width: 1920, height: 1080 }
    },
    
    /* Global timeout settings */
    actionTimeout: 30000,
    navigationTimeout: 30000,
    
    /* Browser context options */
    ignoreHTTPSErrors: true,
    
    /* Viewport settings - 1080p Display */
    viewport: { width: 1920, height: 1080 }
  },

  /* Configure projects for major browsers and devices */
  projects: [
    /* Desktop Browsers */
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    }
  ],

  /* Global test timeout */
  timeout: 120000,
  
  /* Expect timeout for assertions */
  expect: {
    timeout: 15000,
    toHaveScreenshot: {
      threshold: 0.3
    }
  },
  
  /* Output directory for test artifacts */
  outputDir: 'test-results/',
});