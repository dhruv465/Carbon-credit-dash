/**
 * Accessibility utilities for screen reader support and keyboard navigation
 */

/**
 * Announces a message to screen readers
 * @param message - The message to announce
 * @param priority - The priority level (polite or assertive)
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove the announcement after a short delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Manages focus for modal dialogs and overlays
 */
export class FocusManager {
  private previousActiveElement: Element | null = null;
  private focusableElements: NodeListOf<Element> | null = null;

  /**
   * Trap focus within a container element
   * @param container - The container element to trap focus within
   */
  trapFocus(container: Element): void {
    this.previousActiveElement = document.activeElement;

    // Get all focusable elements within the container
    this.focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (this.focusableElements.length > 0) {
      (this.focusableElements[0] as HTMLElement).focus();
    }

    // Add event listener for tab key
    document.addEventListener('keydown', this.handleTabKey);
  }

  /**
   * Release focus trap and restore previous focus
   */
  releaseFocus(): void {
    document.removeEventListener('keydown', this.handleTabKey);

    if (this.previousActiveElement) {
      (this.previousActiveElement as HTMLElement).focus();
    }

    this.previousActiveElement = null;
    this.focusableElements = null;
  }

  private handleTabKey = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab' || !this.focusableElements || this.focusableElements.length === 0) {
      return;
    }

    const firstElement = this.focusableElements[0] as HTMLElement;
    const lastElement = this.focusableElements[this.focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };
}

/**
 * Checks if an element meets WCAG color contrast requirements
 * @param element - The element to check
 * @returns Promise<boolean> - Whether the element meets contrast requirements
 */
export async function checkColorContrast(element: Element): Promise<boolean> {
  const styles = window.getComputedStyle(element);
  const backgroundColor = styles.backgroundColor;
  const color = styles.color;

  // This is a simplified check - in a real implementation, you'd use a proper
  // color contrast calculation library
  return backgroundColor !== color;
}

/**
 * Adds skip links for keyboard navigation
 */
export function addSkipLinks(): void {
  const skipLinks = document.createElement('div');
  skipLinks.className = 'skip-links sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:p-2';
  skipLinks.innerHTML = `
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <a href="#search" class="skip-link">Skip to search</a>
  `;

  document.body.insertBefore(skipLinks, document.body.firstChild);
}

/**
 * Validates that interactive elements have proper labels
 * @param container - The container to check within
 * @returns Array of elements missing labels
 */
export function validateAccessibleLabels(container: Element = document.body): Element[] {
  const interactiveElements = container.querySelectorAll(
    'button, [role="button"], input, select, textarea, a[href]'
  );

  const elementsWithoutLabels: Element[] = [];

  interactiveElements.forEach(element => {
    const hasAriaLabel = element.hasAttribute('aria-label');
    const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
    const hasTitle = element.hasAttribute('title');
    const hasTextContent = element.textContent?.trim();
    const hasLabel = element.tagName === 'INPUT' &&
      document.querySelector(`label[for="${element.id}"]`);

    if (!hasAriaLabel && !hasAriaLabelledBy && !hasTitle && !hasTextContent && !hasLabel) {
      elementsWithoutLabels.push(element);
    }
  });

  return elementsWithoutLabels;
}

/**
 * Ensures proper heading hierarchy
 * @param container - The container to check within
 * @returns Array of heading level issues
 */
export function validateHeadingHierarchy(container: Element = document.body): string[] {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const issues: string[] = [];
  let previousLevel = 0;

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));

    if (index === 0 && level !== 1) {
      issues.push('First heading should be h1');
    }

    if (level > previousLevel + 1) {
      issues.push(`Heading level jumps from h${previousLevel} to h${level}`);
    }

    previousLevel = level;
  });

  return issues;
}