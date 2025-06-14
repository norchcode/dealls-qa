import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object Model class
 * Contains common functionality shared across all page objects
 * Implements best practices for page interactions and error handling
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = process.env.PLAYWRIGHT_BASE_URL || 'https://job-portal-user-dev-skx7zw44dq-et.a.run.app';
  }

  /**
   * Navigate to a specific URL with enhanced error handling
   * @param url - The URL to navigate to (relative or absolute)
   * @param options - Navigation options
   */
  async goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    try {
      const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
      await this.page.goto(fullUrl, { 
        waitUntil: options?.waitUntil || 'networkidle',
        timeout: 30000 
      });
    } catch (error) {
      throw new Error(`Failed to navigate to ${url}: ${error}`);
    }
  }

  /**
   * Wait for an element to be visible with custom timeout
   * @param locator - The element locator
   * @param timeout - Custom timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
    try {
      await locator.waitFor({ 
        state: 'visible', 
        timeout 
      });
    } catch (error) {
      throw new Error(`Element not found within ${timeout}ms: ${locator}`);
    }
  }

  /**
   * Click an element with enhanced error handling and retry logic
   * @param locator - The element to click
   * @param options - Click options
   */
  async clickElement(locator: Locator, options?: { timeout?: number; force?: boolean }): Promise<void> {
    try {
      await this.waitForElement(locator, options?.timeout);
      await locator.click({ 
        timeout: options?.timeout || 10000,
        force: options?.force || false 
      });
    } catch (error) {
      throw new Error(`Failed to click element ${locator}: ${error}`);
    }
  }

  /**
   * Type text into an input field with validation
   * @param locator - The input field locator
   * @param text - Text to type
   * @param options - Typing options
   */
  async typeText(
    locator: Locator, 
    text: string, 
    options?: { clear?: boolean; delay?: number }
  ): Promise<void> {
    try {
      await this.waitForElement(locator);
      
      if (options?.clear !== false) {
        await locator.clear();
      }
      
      await locator.fill(text, { timeout: 10000 });
      
      // Verify text was entered correctly
      const inputValue = await locator.inputValue();
      if (inputValue !== text) {
        throw new Error(`Text verification failed. Expected: "${text}", Actual: "${inputValue}"`);
      }
    } catch (error) {
      throw new Error(`Failed to type text "${text}" into ${locator}: ${error}`);
    }
  }

  /**
   * Check if an element is visible with timeout
   * @param locator - The element locator
   * @param timeout - Timeout in milliseconds
   */
  async isElementVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if an element is enabled
   * @param locator - The element locator
   */
  async isElementEnabled(locator: Locator): Promise<boolean> {
    try {
      return await locator.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Get element text content with error handling
   * @param locator - The element locator
   */
  async getElementText(locator: Locator): Promise<string> {
    try {
      await this.waitForElement(locator);
      const text = await locator.textContent();
      return text?.trim() || '';
    } catch (error) {
      throw new Error(`Failed to get text from element ${locator}: ${error}`);
    }
  }

  /**
   * Get current page title
   */
  async getPageTitle(): Promise<string> {
    try {
      return await this.page.title();
    } catch (error) {
      throw new Error(`Failed to get page title: ${error}`);
    }
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for page to load completely
   * @param timeout - Timeout in milliseconds
   */
  async waitForPageLoad(timeout: number = 30000): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
    } catch (error) {
      throw new Error(`Page failed to load within ${timeout}ms: ${error}`);
    }
  }

  /**
   * Take a screenshot for debugging purposes
   * @param name - Screenshot filename
   */
  async takeScreenshot(name: string): Promise<string> {
    try {
      const screenshotPath = `screenshots/${name}-${Date.now()}.png`;
      await this.page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
      });
      return screenshotPath;
    } catch (error) {
      throw new Error(`Failed to take screenshot: ${error}`);
    }
  }

  /**
   * Scroll element into view
   * @param locator - The element to scroll to
   */
  async scrollToElement(locator: Locator): Promise<void> {
    try {
      await locator.scrollIntoViewIfNeeded();
    } catch (error) {
      throw new Error(`Failed to scroll to element ${locator}: ${error}`);
    }
  }

  /**
   * Wait for a specific amount of time
   * @param milliseconds - Time to wait in milliseconds
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Refresh the current page
   */
  async refreshPage(): Promise<void> {
    try {
      await this.page.reload({ waitUntil: 'networkidle' });
    } catch (error) {
      throw new Error(`Failed to refresh page: ${error}`);
    }
  }

  /**
   * Verify page title contains expected text
   * @param expectedTitle - Expected title text
   */
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    const actualTitle = await this.getPageTitle();
    expect(actualTitle).toContain(expectedTitle);
  }

  /**
   * Get access to the page instance for direct interactions
   */
  get pageInstance(): Page {
    return this.page;
  }

  /**
   * Verify current URL contains expected path
   * @param expectedPath - Expected URL path
   */
  async verifyCurrentUrl(expectedPath: string): Promise<void> {
    const currentUrl = this.getCurrentUrl();
    expect(currentUrl).toContain(expectedPath);
  }
}