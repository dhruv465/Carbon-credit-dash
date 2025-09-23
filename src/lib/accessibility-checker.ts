/**
 * Browser-based accessibility checker for development
 * Run this in the browser console to check accessibility compliance
 */

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  element: Element;
  message: string;
  wcagRule: string;
}

export class AccessibilityChecker {
  private issues: AccessibilityIssue[] = [];

  /**
   * Run all accessibility checks
   */
  public checkAll(): AccessibilityIssue[] {
    this.issues = [];
    
    this.checkAriaLabels();
    this.checkHeadingHierarchy();
    this.checkColorContrast();
    this.checkKeyboardNavigation();
    this.checkFocusManagement();
    this.checkSemanticStructure();
    
    return this.issues;
  }

  /**
   * Check for missing ARIA labels
   */
  private checkAriaLabels(): void {
    const interactiveElements = document.querySelectorAll(
      'button, [role="button"], input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    );

    interactiveElements.forEach(element => {
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
      const hasTitle = element.hasAttribute('title');
      const hasTextContent = element.textContent?.trim();
      const hasLabel = element.tagName === 'INPUT' && 
        document.querySelector(`label[for="${element.id}"]`);

      if (!hasAriaLabel && !hasAriaLabelledBy && !hasTitle && !hasTextContent && !hasLabel) {
        this.issues.push({
          type: 'error',
          element,
          message: 'Interactive element lacks accessible name',
          wcagRule: 'WCAG 4.1.2 (Name, Role, Value)'
        });
      }
    });
  }

  /**
   * Check heading hierarchy
   */
  private checkHeadingHierarchy(): void {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));

      if (index === 0 && level !== 1) {
        this.issues.push({
          type: 'error',
          element: heading,
          message: 'First heading should be h1',
          wcagRule: 'WCAG 1.3.1 (Info and Relationships)'
        });
      }

      if (level > previousLevel + 1) {
        this.issues.push({
          type: 'warning',
          element: heading,
          message: `Heading level jumps from h${previousLevel} to h${level}`,
          wcagRule: 'WCAG 1.3.1 (Info and Relationships)'
        });
      }

      previousLevel = level;
    });
  }

  /**
   * Check color contrast (simplified)
   */
  private checkColorContrast(): void {
    const textElements = document.querySelectorAll('p, span, div, button, a, label, h1, h2, h3, h4, h5, h6');

    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // Skip elements with transparent backgrounds
      if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
        return;
      }

      // This is a simplified check - in production, use a proper contrast calculation
      const colorLuminance = this.getLuminance(color);
      const bgLuminance = this.getLuminance(backgroundColor);
      const contrast = this.getContrastRatio(colorLuminance, bgLuminance);

      if (contrast < 4.5) {
        this.issues.push({
          type: 'warning',
          element,
          message: `Low color contrast ratio: ${contrast.toFixed(2)}:1 (minimum 4.5:1)`,
          wcagRule: 'WCAG 1.4.3 (Contrast Minimum)'
        });
      }
    });
  }

  /**
   * Check keyboard navigation
   */
  private checkKeyboardNavigation(): void {
    const interactiveElements = document.querySelectorAll(
      'button, [role="button"], input, select, textarea, a[href]'
    );

    interactiveElements.forEach(element => {
      const tabIndex = element.getAttribute('tabindex');
      
      if (tabIndex === '-1' && !element.hasAttribute('aria-hidden')) {
        this.issues.push({
          type: 'warning',
          element,
          message: 'Interactive element is not keyboard accessible (tabindex="-1")',
          wcagRule: 'WCAG 2.1.1 (Keyboard)'
        });
      }
    });
  }

  /**
   * Check focus management
   */
  private checkFocusManagement(): void {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
      // Check if element has visible focus indicator
      const styles = window.getComputedStyle(element, ':focus');
      const outline = styles.outline;
      const outlineWidth = styles.outlineWidth;

      if (outline === 'none' || outlineWidth === '0px') {
        this.issues.push({
          type: 'warning',
          element,
          message: 'Element lacks visible focus indicator',
          wcagRule: 'WCAG 2.4.7 (Focus Visible)'
        });
      }
    });
  }

  /**
   * Check semantic structure
   */
  private checkSemanticStructure(): void {
    // Check for main landmark
    const main = document.querySelector('main, [role="main"]');
    if (!main) {
      this.issues.push({
        type: 'error',
        element: document.body,
        message: 'Page lacks main landmark',
        wcagRule: 'WCAG 1.3.1 (Info and Relationships)'
      });
    }

    // Check for navigation landmark
    const nav = document.querySelector('nav, [role="navigation"]');
    if (!nav) {
      this.issues.push({
        type: 'info',
        element: document.body,
        message: 'Page lacks navigation landmark',
        wcagRule: 'WCAG 1.3.1 (Info and Relationships)'
      });
    }

    // Check for proper list structure
    const lists = document.querySelectorAll('ul, ol');
    lists.forEach(list => {
      const directChildren = Array.from(list.children);
      const hasNonListItems = directChildren.some(child => child.tagName !== 'LI');
      
      if (hasNonListItems) {
        this.issues.push({
          type: 'error',
          element: list,
          message: 'List contains non-list-item children',
          wcagRule: 'WCAG 1.3.1 (Info and Relationships)'
        });
      }
    });
  }

  /**
   * Get relative luminance of a color (simplified)
   */
  private getLuminance(color: string): number {
    // This is a very simplified luminance calculation
    // In production, use a proper color library
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(Number);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  /**
   * Calculate contrast ratio between two luminance values
   */
  private getContrastRatio(lum1: number, lum2: number): number {
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Generate a report of all issues
   */
  public generateReport(): string {
    const errorCount = this.issues.filter(issue => issue.type === 'error').length;
    const warningCount = this.issues.filter(issue => issue.type === 'warning').length;
    const infoCount = this.issues.filter(issue => issue.type === 'info').length;

    let report = `\n=== Accessibility Report ===\n`;
    report += `Errors: ${errorCount}\n`;
    report += `Warnings: ${warningCount}\n`;
    report += `Info: ${infoCount}\n\n`;

    this.issues.forEach((issue, index) => {
      report += `${index + 1}. [${issue.type.toUpperCase()}] ${issue.message}\n`;
      report += `   Rule: ${issue.wcagRule}\n`;
      report += `   Element: ${issue.element.tagName}`;
      if (issue.element.id) report += `#${issue.element.id}`;
      if (issue.element.className) report += `.${issue.element.className.split(' ')[0]}`;
      report += `\n\n`;
    });

    return report;
  }
}

// Global function to run accessibility check
(window as any).checkAccessibility = () => {
  const checker = new AccessibilityChecker();
  const issues = checker.checkAll();
  console.log(checker.generateReport());
  return issues;
};

// Auto-run in development (check if we're in development mode)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Run check after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const checker = new AccessibilityChecker();
      const issues = checker.checkAll();
      
      if (issues.length > 0) {
        console.warn(`🔍 Accessibility issues found: ${issues.length}`);
        console.log('Run checkAccessibility() in console for detailed report');
      } else {
        console.log('✅ No accessibility issues found');
      }
    }, 1000);
  });
}