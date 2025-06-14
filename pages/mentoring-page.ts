import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Page Object Model for Dealls Mentoring Feature
 * Implements comprehensive interactions for the mentoring platform
 */
export class MentoringPage extends BasePage {
  
  // Page Elements - Using robust and maintainable locator strategies
  private readonly pageTitle: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly mentorCards: Locator;
  private readonly mentorNames: Locator;
  private readonly mentorCompanies: Locator;
  private readonly mentorExpertise: Locator;
  private readonly categoryFilters: Locator;
  private readonly loginButton: Locator;
  private readonly signupButton: Locator;
  private readonly bookingButtons: Locator;
  private readonly loadingIndicator: Locator;
  private readonly errorMessage: Locator;
  private readonly noResultsMessage: Locator;
  private readonly mentorAvailability: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators with comprehensive fallback strategies
    this.pageTitle = page.locator('h1, [data-testid="page-title"], .page-title, .hero-title');
    this.searchInput = page.locator(
      'input[type="search"], input[placeholder*="search" i], input[placeholder*="cari" i], .search-input, [data-testid="search-input"]'
    );
    this.searchButton = page.locator(
      'button[type="submit"], button:has-text("Search"), button:has-text("Cari"), .search-button, [data-testid="search-button"]'
    );
    this.mentorCards = page.locator(
      '.mentor-card, .mentor-item, [data-testid="mentor-card"], .card:has(.mentor), .profile-card'
    );
    this.mentorNames = page.locator(
      '.mentor-name, .name, .profile-name, [data-testid="mentor-name"], h3, h4'
    );
    this.mentorCompanies = page.locator(
      '.mentor-company, .company, .organization, [data-testid="mentor-company"]'
    );
    this.mentorExpertise = page.locator(
      '.mentor-expertise, .skills, .expertise, .specialization, [data-testid="mentor-expertise"]'
    );
    this.categoryFilters = page.locator(
      '.category, .filter-category, .expertise-filter, [data-testid="category-filter"], button[data-category]'
    );
    this.loginButton = page.locator(
      'button:has-text("Masuk"), a:has-text("Masuk"), button:has-text("Login"), a:has-text("Login"), [data-testid="login"]'
    );
    this.signupButton = page.locator(
      'button:has-text("Daftar"), a:has-text("Daftar"), button:has-text("Sign Up"), a:has-text("Sign Up"), [data-testid="signup"]'
    );
    this.bookingButtons = page.locator(
      '.book-btn, .schedule-btn, button:has-text("Book"), button:has-text("Schedule"), [data-testid="book-session"]'
    );
    this.loadingIndicator = page.locator(
      '.loading, .spinner, .loader, [data-testid="loading"]'
    );
    this.errorMessage = page.locator(
      '.error-message, .alert-error, .error, [data-testid="error-message"]'
    );
    this.noResultsMessage = page.locator(
      '.no-results, .empty-state, [data-testid="no-results"]'
    );
    this.mentorAvailability = page.locator(
      '.availability, .status, .mentor-status, [data-testid="mentor-availability"]'
    );
  }

  /**
   * Navigate to the mentoring page
   */
  async navigateToMentoring(): Promise<void> {
    await this.goto('/mentoring');
    await this.waitForPageLoad();
    await this.verifyPageLoaded();
  }

  /**
   * Verify the mentoring page has loaded correctly with enhanced waiting
   */
  async verifyPageLoaded(): Promise<void> {
    console.log('🔍 Verifying mentoring page load...');
    
    // Wait for page title
    await this.waitForElement(this.pageTitle, 20000);
    
    const title = await this.getPageTitle();
    console.log(`📄 Page title: "${title}"`);
    
    const titleLower = title.toLowerCase();
    
    if (!titleLower.includes('mentoring') && !titleLower.includes('mentor') && !titleLower.includes('karir')) {
      throw new Error(`Page title does not indicate mentoring page. Actual title: "${title}"`);
    }
    
    // Verify URL contains mentoring path
    await this.verifyCurrentUrl('/mentoring');
    
    // Wait for page to be fully interactive
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    
    // Wait for any loading indicators to disappear
    const loadingSelectors = [
      '.loading', '.spinner', '.loader', '[data-loading]', 
      '.skeleton', '.shimmer', '[class*="loading"]'
    ];
    
    for (const selector of loadingSelectors) {
      try {
        const loadingElement = this.page.locator(selector);
        if (await loadingElement.isVisible()) {
          console.log(`⏳ Waiting for loading indicator: ${selector}`);
          await loadingElement.waitFor({ state: 'hidden', timeout: 15000 });
        }
      } catch {
        // Loading indicator might not exist, continue
      }
    }
    
    // Wait for main content to appear - be more flexible
    await this.wait(3000); // Allow time for dynamic content
    
    // Check if we have any content loaded
    const bodyText = await this.page.textContent('body');
    const wordCount = bodyText?.split(' ').length || 0;
    
    if (wordCount < 50) {
      throw new Error(`Page appears to be empty or not fully loaded. Word count: ${wordCount}`);
    }
    
    console.log(`✅ Page verified - ${wordCount} words loaded`);
    
    // Try to detect mentor cards or content area
    const contentSelectors = [
      '.mentor-card', '.mentor-item', '.card', '.profile-card',
      '[data-testid*="mentor"]', '.mentor', '[class*="mentor"]',
      '.grid', '.flex', '[class*="grid"]', '[class*="flex"]',
      'main', '.main', '.content', '.container'
    ];
    
    let contentFound = false;
    for (const selector of contentSelectors) {
      const elements = await this.page.$$(selector);
      if (elements.length > 0) {
        console.log(`📦 Found content: ${selector} (${elements.length} elements)`);
        contentFound = true;
        break;
      }
    }
    
    if (!contentFound) {
      console.log('⚠️  No specific mentor content detected, but page loaded successfully');
    }
  }

  /**
   * Search for mentors using keyword with improved reliability
   * @param keyword - Search keyword
   */
  async searchMentors(keyword: string): Promise<void> {
    if (!keyword || keyword.trim().length === 0) {
      throw new Error('Search keyword cannot be empty');
    }

    console.log(`🔍 Searching for: "${keyword}"`);
    
    // Wait for page to be ready
    await this.waitForPageLoad();
    
    // Try to find search input with more flexible selectors
    const searchSelectors = [
      'input[type="search"]',
      'input[placeholder*="search" i]', 
      'input[placeholder*="cari" i]',
      'input[placeholder*="mentor" i]',
      '.search-input',
      '[data-testid*="search"]',
      'input[name*="search"]'
    ];
    
    let searchInput = null;
    let workingSelector = '';
    
    for (const selector of searchSelectors) {
      const element = this.page.locator(selector);
      if (await this.isElementVisible(element, 2000)) {
        searchInput = element;
        workingSelector = selector;
        break;
      }
    }
    
    if (!searchInput) {
      throw new Error('Search input not available on the page');
    }
    
    console.log(`📝 Using search input: ${workingSelector}`);
    
    await this.typeText(searchInput, keyword);
    
    // Try to submit search
    const searchButtonSelectors = [
      'button[type="submit"]',
      'button:has-text("Search")', 
      'button:has-text("Cari")',
      '.search-button',
      '[data-testid*="search-button"]'
    ];
    
    let searchSubmitted = false;
    
    for (const selector of searchButtonSelectors) {
      const button = this.page.locator(selector);
      if (await this.isElementVisible(button, 1000)) {
        await this.clickElement(button);
        searchSubmitted = true;
        console.log(`🎯 Clicked search button: ${selector}`);
        break;
      }
    }
    
    if (!searchSubmitted) {
      console.log('🔍 No search button found, using Enter key');
      await searchInput.press('Enter');
    }
    
    await this.waitForSearchResults();
  }

  /**
   * Filter mentors by category
   * @param category - Category name to filter by
   */
  async filterByCategory(category: string): Promise<void> {
    if (!category || category.trim().length === 0) {
      throw new Error('Category cannot be empty');
    }

    // Look for specific category button with multiple strategies
    const categoryButton = this.page.locator([
      `button:has-text("${category}")`,
      `[data-category="${category}"]`,
      `.category:has-text("${category}")`,
      `.filter:has-text("${category}")`
    ].join(', '));

    if (!(await this.isElementVisible(categoryButton))) {
      throw new Error(`Category filter "${category}" not found on the page`);
    }

    await this.clickElement(categoryButton);
    await this.waitForSearchResults();
  }

  /**
   * Get the count of mentor cards displayed with improved detection
   */
  async getMentorCount(): Promise<number> {
    console.log('🔍 Counting mentor cards...');
    
    // Wait for content to load
    await this.wait(2000);
    
    // Try multiple selector strategies for mentor cards
    const cardSelectors = [
      '.mentor-card', '.mentor-item', '.card', '.profile-card',
      '[data-testid*="mentor"]', '.mentor', '[class*="mentor"]',
      '.grid > div', '.flex > div', '[class*="grid"] > div',
      '.container > div', '.content > div'
    ];
    
    let maxCount = 0;
    let workingSelector = '';
    
    for (const selector of cardSelectors) {
      try {
        const elements = await this.page.$$(selector);
        if (elements.length > maxCount) {
          maxCount = elements.length;
          workingSelector = selector;
        }
      } catch {
        // Continue to next selector
      }
    }
    
    if (maxCount > 0) {
      console.log(`👥 Found ${maxCount} elements using selector: ${workingSelector}`);
    } else {
      console.log('⚠️  No mentor cards found with standard selectors');
      
      // Check for no results message
      const noResultsSelectors = [
        '.no-results', '.empty-state', '[data-testid="no-results"]',
        '.empty', '.not-found', '[class*="empty"]'
      ];
      
      for (const selector of noResultsSelectors) {
        if (await this.isElementVisible(this.page.locator(selector))) {
          console.log(`📝 Found no results message: ${selector}`);
          return 0;
        }
      }
    }
    
    return maxCount;
  }

  /**
   * Get mentor names from visible cards with improved detection
   * @param maxCount - Maximum number of names to retrieve
   */
  async getMentorNames(maxCount: number = 10): Promise<string[]> {
    console.log('🔍 Extracting mentor names...');
    
    const names: string[] = [];
    
    // Try multiple strategies to find mentor names
    const nameSelectors = [
      'h1, h2, h3, h4, h5, h6',
      '.name, .mentor-name, .profile-name',
      '[class*="name"], [class*="title"]',
      'strong, b, .font-bold'
    ];
    
    for (const selector of nameSelectors) {
      const elements = await this.page.$$(selector);
      console.log(`Found ${elements.length} elements with selector: ${selector}`);
      
      for (let i = 0; i < Math.min(elements.length, maxCount); i++) {
        try {
          const element = elements[i];
          if (!element) continue;
          const text = await element.textContent();
          
          if (text && text.trim().length > 0 && text.trim().length < 100) {
            // Filter out likely non-name content
            const cleanText = text.trim();
            if (!cleanText.toLowerCase().includes('mentoring') && 
                !cleanText.toLowerCase().includes('karir') &&
                !cleanText.toLowerCase().includes('tingkatkan') &&
                cleanText.split(' ').length <= 4) { // Likely a person's name
              names.push(cleanText);
              if (names.length >= maxCount) break;
            }
          }
        } catch (error) {
          console.warn(`Failed to get text from element at index ${i}: ${error}`);
        }
      }
      
      if (names.length >= maxCount) break;
    }
    
    // Remove duplicates
    const uniqueNames = [...new Set(names)];
    console.log(`📝 Found ${uniqueNames.length} unique mentor names`);
    
    return uniqueNames.slice(0, maxCount);
  }

  /**
   * Get mentor companies from visible cards
   * @param maxCount - Maximum number of companies to retrieve
   */
  async getMentorCompanies(maxCount: number = 5): Promise<string[]> {
    const mentorCount = await this.getMentorCount();
    
    if (mentorCount === 0) {
      return [];
    }

    const companies: string[] = [];
    const countToProcess = Math.min(mentorCount, maxCount);

    for (let i = 0; i < countToProcess; i++) {
      try {
        const companyElement = this.mentorCompanies.nth(i);
        if (await this.isElementVisible(companyElement, 2000)) {
          const company = await this.getElementText(companyElement);
          if (company && company.length > 0) {
            companies.push(company);
          }
        }
      } catch (error) {
        console.warn(`Failed to get mentor company at index ${i}: ${error}`);
      }
    }

    return companies;
  }

  /**
   * Click on a specific mentor card
   * @param index - Index of the mentor card to click (0-based)
   */
  async clickMentorCard(index: number = 0): Promise<void> {
    const mentorCount = await this.getMentorCount();
    
    if (mentorCount === 0) {
      throw new Error('No mentor cards available to click');
    }
    
    if (index >= mentorCount) {
      throw new Error(`Mentor card index ${index} is out of range. Only ${mentorCount} cards available.`);
    }

    const mentorCard = this.mentorCards.nth(index);
    await this.scrollToElement(mentorCard);
    await this.clickElement(mentorCard);
    
    // Wait for potential navigation or modal
    await this.wait(2000);
  }

  /**
   * Attempt to book a session with the first available mentor
   */
  async bookSessionWithFirstMentor(): Promise<void> {
    const mentorCount = await this.getMentorCount();
    
    if (mentorCount === 0) {
      throw new Error('No mentors available to book session with');
    }

    // Click on the first mentor card
    await this.clickMentorCard(0);

    // Look for booking button after clicking mentor
    if (await this.isElementVisible(this.bookingButtons.first(), 5000)) {
      await this.clickElement(this.bookingButtons.first());
      
      // Wait for booking flow to initiate
      await this.wait(3000);
    } else {
      console.warn('No booking button found after clicking mentor card');
    }
  }

  /**
   * Attempt to access login functionality
   */
  async attemptLogin(): Promise<void> {
    if (await this.isElementVisible(this.loginButton)) {
      await this.clickElement(this.loginButton);
      await this.waitForPageLoad();
    } else {
      throw new Error('Login button not found on the page');
    }
  }

  /**
   * Attempt to access signup functionality
   */
  async attemptSignup(): Promise<void> {
    if (await this.isElementVisible(this.signupButton)) {
      await this.clickElement(this.signupButton);
      await this.waitForPageLoad();
    } else {
      throw new Error('Signup button not found on the page');
    }
  }

  /**
   * Verify responsive design across different viewport sizes
   */
  async verifyResponsiveDesign(): Promise<void> {
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop-large' },
      { width: 1366, height: 768, name: 'desktop-standard' },
      { width: 1024, height: 768, name: 'tablet-landscape' },
      { width: 768, height: 1024, name: 'tablet-portrait' },
      { width: 375, height: 667, name: 'mobile-standard' },
      { width: 320, height: 568, name: 'mobile-small' }
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.wait(1000); // Allow layout to adjust
      
      // Verify essential elements are still visible
      await expect(this.pageTitle).toBeVisible();
      
      // Take screenshot for visual validation
      await this.takeScreenshot(`responsive-${viewport.name}`);
      
      // Check for horizontal scroll on mobile
      if (viewport.width <= 768) {
        const hasHorizontalScroll = await this.page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        if (hasHorizontalScroll) {
          console.warn(`Horizontal scroll detected on ${viewport.name} viewport`);
        }
      }
    }
  }

  /**
   * Verify page accessibility
   */
  async verifyAccessibility(): Promise<void> {
    // Check for page title
    const title = await this.getPageTitle();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);

    // Check for main heading
    await expect(this.pageTitle).toBeVisible();

    // Verify keyboard navigation works
    await this.page.keyboard.press('Tab');
    await this.wait(500);
    
    const focusedElement = await this.page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  }

  /**
   * Wait for search results to load with enhanced detection
   * @private
   */
  private async waitForSearchResults(): Promise<void> {
    console.log('⏳ Waiting for search results...');
    
    // Wait for any loading indicators to disappear
    const loadingSelectors = [
      '.loading', '.spinner', '.loader', '[data-loading]', 
      '.skeleton', '.shimmer', '[class*="loading"]'
    ];
    
    for (const selector of loadingSelectors) {
      try {
        const loadingElement = this.page.locator(selector);
        if (await this.isElementVisible(loadingElement, 2000)) {
          console.log(`⏳ Waiting for loading indicator: ${selector}`);
          await loadingElement.waitFor({ state: 'hidden', timeout: 15000 });
        }
      } catch {
        // Loading indicator might not exist or already hidden
      }
    }
    
    // Wait for content to stabilize
    await this.wait(3000);
    
    // Check if results appeared
    const beforeCount = await this.getMentorCount();
    await this.wait(2000);
    const afterCount = await this.getMentorCount();
    
    if (beforeCount === afterCount) {
      console.log(`✅ Search results stabilized: ${afterCount} results`);
    } else {
      console.log(`⚠️  Results still changing: ${beforeCount} -> ${afterCount}`);
      await this.wait(2000); // Additional wait
    }
  }

  /**
   * Check if any error messages are displayed
   */
  async hasErrorMessages(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Get displayed error message text
   */
  async getErrorMessage(): Promise<string> {
    if (await this.hasErrorMessages()) {
      return await this.getElementText(this.errorMessage);
    }
    return '';
  }
}