import { Page, expect } from '@playwright/test';

/**
 * Utility functions for test automation
 * Provides common helper methods used across test suites
 */

export class TestHelpers {
  
  /**
   * Wait for network requests to complete
   * @param page - Playwright page instance
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForNetworkIdle(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Generate random test data
   * @param type - Type of data to generate
   */
  static generateTestData(type: 'email' | 'name' | 'search-term'): string {
    const timestamp = Date.now();
    
    switch (type) {
      case 'email':
        return `test.user.${timestamp}@example.com`;
      case 'name':
        return `Test User ${timestamp}`;
      case 'search-term':
        const terms = ['Engineer', 'Developer', 'Manager', 'Designer', 'Analyst'];
        return terms[Math.floor(Math.random() * terms.length)] || 'Engineer';
      default:
        return `test-data-${timestamp}`;
    }
  }

  /**
   * Take screenshot with timestamp
   * @param page - Playwright page instance
   * @param name - Base name for screenshot
   */
  static async takeTimestampedScreenshot(page: Page, name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    const path = `screenshots/${filename}`;
    
    await page.screenshot({ 
      path, 
      fullPage: true 
    });
    
    return path;
  }

  /**
   * Wait for element with enhanced error reporting
   * @param page - Playwright page instance
   * @param selector - Element selector
   * @param timeout - Timeout in milliseconds
   */
  static async waitForElementWithRetry(
    page: Page, 
    selector: string, 
    timeout: number = 30000
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      await page.locator(selector).waitFor({ 
        state: 'visible', 
        timeout 
      });
    } catch (error) {
      const elapsed = Date.now() - startTime;
      throw new Error(
        `Element '${selector}' not found after ${elapsed}ms. ` +
        `Current URL: ${page.url()}`
      );
    }
  }

  /**
   * Check if page has any console errors
   * @param page - Playwright page instance
   */
  static async captureConsoleErrors(page: Page): Promise<string[]> {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    return errors;
  }

  /**
   * Verify page performance metrics
   * @param page - Playwright page instance
   */
  static async getPerformanceMetrics(page: Page): Promise<{
    loadTime: number;
    domContentLoaded: number;
    firstContentfulPaint: number;
  }> {
    const performanceMetrics = await page.evaluate(() => {
      const timing = performance.timing;
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstContentfulPaint: navigation.loadEventEnd - navigation.loadEventStart
      };
    });
    
    return performanceMetrics;
  }

  /**
   * Simulate different network conditions
   * @param page - Playwright page instance
   * @param condition - Network condition to simulate
   */
  static async simulateNetworkCondition(
    page: Page, 
    condition: 'slow' | 'fast' | 'offline'
  ): Promise<void> {
    switch (condition) {
      case 'slow':
        await page.route('**/*', async route => {
          await new Promise(resolve => setTimeout(resolve, 200));
          await route.continue();
        });
        break;
      case 'fast':
        await page.unroute('**/*');
        break;
      case 'offline':
        await page.route('**/*', route => route.abort());
        break;
    }
  }

  /**
   * Validate element accessibility
   * @param page - Playwright page instance
   * @param selector - Element selector to validate
   */
  static async validateElementAccessibility(page: Page, selector: string): Promise<{
    hasAriaLabel: boolean;
    hasRole: boolean;
    isFocusable: boolean;
    hasAltText: boolean;
  }> {
    const element = page.locator(selector);
    
    const accessibility = await element.evaluate((el) => {
      return {
        hasAriaLabel: el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby'),
        hasRole: el.hasAttribute('role'),
        isFocusable: el.tabIndex >= 0 || 
                    ['input', 'button', 'select', 'textarea', 'a'].includes(el.tagName.toLowerCase()),
        hasAltText: el.tagName.toLowerCase() === 'img' ? el.hasAttribute('alt') : true
      };
    });
    
    return accessibility;
  }

  /**
   * Get element bounding box information
   * @param page - Playwright page instance
   * @param selector - Element selector
   */
  static async getElementBounds(page: Page, selector: string): Promise<{
    x: number;
    y: number;
    width: number;
    height: number;
    isVisible: boolean;
  }> {
    const element = page.locator(selector);
    const boundingBox = await element.boundingBox();
    const isVisible = await element.isVisible();
    
    return {
      x: boundingBox?.x || 0,
      y: boundingBox?.y || 0,
      width: boundingBox?.width || 0,
      height: boundingBox?.height || 0,
      isVisible
    };
  }

  /**
   * Compare two screenshots for visual regression testing
   * @param page - Playwright page instance
   * @param baselineName - Name of baseline screenshot
   */
  static async compareScreenshot(page: Page, baselineName: string): Promise<void> {
    await expect(page).toHaveScreenshot(`${baselineName}.png`);
  }

  /**
   * Wait for page animations to complete
   * @param page - Playwright page instance
   * @param timeout - Maximum wait time
   */
  static async waitForAnimationsToComplete(page: Page, timeout: number = 5000): Promise<void> {
    await page.waitForFunction(
      () => {
        const animations = document.getAnimations();
        return animations.every(animation => 
          animation.playState === 'finished' || animation.playState === 'idle'
        );
      },
      { timeout }
    );
  }

  /**
   * Extract all links from the page
   * @param page - Playwright page instance
   */
  static async extractAllLinks(page: Page): Promise<Array<{ text: string; href: string }>> {
    return await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href]'));
      return links.map(link => ({
        text: link.textContent?.trim() || '',
        href: (link as HTMLAnchorElement).href
      }));
    });
  }

  /**
   * Verify all images are loaded
   * @param page - Playwright page instance
   */
  static async verifyImagesLoaded(page: Page): Promise<{ total: number; loaded: number; failed: number }> {
    return await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const total = images.length;
      let loaded = 0;
      let failed = 0;
      
      images.forEach(img => {
        if (img.complete) {
          if (img.naturalHeight !== 0) {
            loaded++;
          } else {
            failed++;
          }
        }
      });
      
      return { total, loaded, failed };
    });
  }
}