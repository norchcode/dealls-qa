import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Dealls Mentoring UI Automation
 * Optimized for cross-browser testing and comprehensive reporting
 * Fixed: Removed invalid --headed=false option usage
 */
export default defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry failed tests */
  retries: process.env.CI ? 2 : 1,
  
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : 4,
  
  /* Reporter configuration for comprehensive test reporting */
  reporter: [
    ['html', { 
      outputFolder: 'reports/html-report',
      open: 'never'
    }],
    ['json', { 
      outputFile: 'reports/test-results.json' 
    }],
    ['junit', { 
      outputFile: 'reports/test-results.xml' 
    }],
    ['line']
  ],
  
  /* Shared settings for all projects */
  use: {
    /* Base URL for testing */
    baseURL: 'https://job-portal-user-dev-skx7zw44dq-et.a.run.app',
    
    /* 
     * Headless mode configuration:
     * - Docker/CI environments: Must be true (no display server)
     * - Local machines: Can be overridden with --headed flag
     * - Valid options: true (headless) or false (headed)
     * - CLI option: --headed (not --headed=false)
     */
    headless: process.env.CI ? true : true, // Default to headless, use --headed flag for visible browser
    
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
    },

    /* Mobile Devices */
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'] 
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'] 
      },
    },

    /* Tablet Devices */
    {
      name: 'tablet',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 768 }
      },
    }
  ],

  /* Global test timeout */
  timeout: 60000,
  
  /* Expect timeout for assertions */
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      threshold: 0.3
    }
  },
  
  /* Output directory for test artifacts */
  outputDir: 'test-results/',
  
  /* Global setup and teardown */
  // globalSetup: undefined,
  // globalTeardown: undefined,
});