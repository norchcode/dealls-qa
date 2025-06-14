/**
 * Test Configuration for Dealls Mentoring UI Automation
 * Centralized configuration for test execution parameters
 */

export interface TestConfig {
  readonly timeouts: {
    readonly short: number;
    readonly medium: number;
    readonly long: number;
    readonly pageLoad: number;
    readonly apiRequest: number;
  };
  readonly urls: {
    readonly base: string;
    readonly mentoring: string;
  };
  readonly viewports: {
    readonly desktop: { width: number; height: number };
    readonly tablet: { width: number; height: number };
    readonly mobile: { width: number; height: number };
  };
  readonly browsers: readonly string[];
  readonly retries: {
    readonly ci: number;
    readonly local: number;
  };
  readonly screenshots: {
    readonly onFailure: boolean;
    readonly onSuccess: boolean;
    readonly fullPage: boolean;
  };
  readonly videos: {
    readonly enabled: boolean;
    readonly quality: 'low' | 'medium' | 'high';
  };
}

/**
 * Default test configuration
 */
export const defaultTestConfig: TestConfig = {
  timeouts: {
    short: 5000,
    medium: 15000,
    long: 30000,
    pageLoad: 30000,
    apiRequest: 10000
  },
  urls: {
    base: 'https://job-portal-user-dev-skx7zw44dq-et.a.run.app',
    mentoring: '/mentoring'
  },
  viewports: {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 1024, height: 768 },
    mobile: { width: 375, height: 667 }
  },
  browsers: ['chromium', 'firefox', 'webkit'] as const,
  retries: {
    ci: 2,
    local: 1
  },
  screenshots: {
    onFailure: true,
    onSuccess: false,
    fullPage: true
  },
  videos: {
    enabled: true,
    quality: 'medium'
  }
} as const;

/**
 * Environment-specific configurations
 */
export const environmentConfigs = {
  development: {
    ...defaultTestConfig,
    urls: {
      base: 'https://job-portal-user-dev-skx7zw44dq-et.a.run.app',
      mentoring: '/mentoring'
    }
  },
  staging: {
    ...defaultTestConfig,
    urls: {
      base: 'https://staging.dealls.com',
      mentoring: '/mentoring'
    }
  },
  production: {
    ...defaultTestConfig,
    urls: {
      base: 'https://dealls.com',
      mentoring: '/mentoring'
    },
    retries: {
      ci: 3,
      local: 2
    }
  }
} as const;

/**
 * Get configuration for current environment
 */
export function getTestConfig(): TestConfig {
  const environment = process.env.TEST_ENV || 'development';
  
  switch (environment) {
    case 'staging':
      return environmentConfigs.staging;
    case 'production':
      return environmentConfigs.production;
    default:
      return environmentConfigs.development;
  }
}

/**
 * Test data constants
 */
export const testData = {
  searchTerms: {
    valid: ['Software Engineer', 'Product Manager', 'Designer', 'Data Scientist'],
    invalid: ['', '!@#$%^&*()', 'x'.repeat(1000)]
  },
  categories: {
    technology: ['IT & Eng', 'Technology', 'Engineering', 'Software'],
    business: ['Business', 'Management', 'Sales', 'Marketing'],
    design: ['Design', 'UX', 'UI', 'Creative']
  },
  userAgents: {
    desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    tablet: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  }
} as const;

/**
 * Selectors configuration for consistent element targeting
 */
export const selectors = {
  mentoring: {
    pageTitle: 'h1, [data-testid="page-title"], .page-title, .hero-title',
    searchInput: 'input[type="search"], input[placeholder*="search" i], .search-input',
    mentorCards: '.mentor-card, .mentor-item, [data-testid="mentor-card"]',
    mentorNames: '.mentor-name, .name, [data-testid="mentor-name"]',
    filterButtons: '.category, .filter-category, [data-testid="category-filter"]',
    loginButton: 'button:has-text("Masuk"), a:has-text("Masuk"), [data-testid="login"]',
    loadingIndicator: '.loading, .spinner, .loader',
    errorMessage: '.error-message, .alert-error, .error'
  }
} as const;