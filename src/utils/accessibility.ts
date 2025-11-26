import { AccessibilitySettings, KeyboardShortcut } from '@/types';

// Default accessibility settings
export const defaultAccessibilitySettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  textToSpeech: true,
  vibrationAlerts: false,
  onScreenAlerts: true,
  voiceNavigation: true,
  voiceCommands: false,
  reducedMotion: false,
  focusIndicators: true,
};

// Storage keys
export const STORAGE_KEYS = {
  ACCESSIBILITY_SETTINGS: 'udyog_accessibility_settings',
  BOOKMARKED_JOBS: 'udyog_bookmarked_jobs',
  USER_PREFERENCES: 'udyog_user_preferences',
  RECENT_SEARCHES: 'udyog_recent_searches',
} as const;

// Accessibility utilities
export class AccessibilityManager {
  private settings: AccessibilitySettings;
  private liveRegion: HTMLElement | null = null;

  constructor(initialSettings: AccessibilitySettings = defaultAccessibilitySettings) {
    this.settings = { ...initialSettings };
    this.initializeLiveRegion();
  }

  // Initialize ARIA live region for announcements
  private initializeLiveRegion(): void {
    if (typeof document === 'undefined') return;

    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    this.liveRegion.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
    
    document.body.appendChild(this.liveRegion);
  }

  // Announce text to screen readers
  announce(text: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.liveRegion) return;

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = text;

    // Clear after announcement
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = '';
      }
    }, 1000);
  }

  // Update settings
  updateSettings(newSettings: Partial<AccessibilitySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.applySettings();
    this.saveSettings();
  }

  // Get current settings
  getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  // Apply settings to DOM
  private applySettings(): void {
    if (typeof document === 'undefined') return;

    const body = document.body;
    const html = document.documentElement;

    // High contrast mode
    if (this.settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Large text mode
    if (this.settings.largeText) {
      body.classList.add('large-text');
    } else {
      body.classList.remove('large-text');
    }

    // Reduced motion
    if (this.settings.reducedMotion) {
      html.style.setProperty('--animation-duration', '0s');
      html.style.setProperty('--transition-duration', '0s');
    } else {
      html.style.removeProperty('--animation-duration');
      html.style.removeProperty('--transition-duration');
    }

    // Enhanced focus indicators
    if (this.settings.focusIndicators) {
      body.classList.add('enhanced-focus');
    } else {
      body.classList.remove('enhanced-focus');
    }
  }

  // Save settings to localStorage (in real app, would use proper storage)
  private saveSettings(): void {
    // In a real application, this would save to localStorage
    // For Claude artifacts, we'll just keep it in memory
    console.log('Settings saved:', this.settings);
  }

  // Load settings from localStorage
  loadSettings(): void {
    // In a real application, this would load from localStorage
    // For Claude artifacts, we'll use defaults
    this.applySettings();
  }

  // Vibration feedback (if supported)
  vibrate(pattern: number | number[] = 100): void {
    if (!this.settings.vibrationAlerts) return;
    
    if ('navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  // Focus management
  focusElement(selector: string): void {
    if (typeof document === 'undefined') return;

    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      this.announce(`Focused on ${element.getAttribute('aria-label') || element.textContent || selector}`);
    }
  }

  // Skip to content functionality
  skipToContent(): void {
    this.focusElement('main, [role="main"], #main-content');
  }

  // Cleanup
  destroy(): void {
    if (this.liveRegion && this.liveRegion.parentNode) {
      this.liveRegion.parentNode.removeChild(this.liveRegion);
    }
  }
}

// Keyboard navigation utilities
export class KeyboardManager {
  private shortcuts: KeyboardShortcut[] = [];
  private isActive = true;

  constructor() {
    this.initializeEventListeners();
  }

  // Add keyboard shortcut
  addShortcut(shortcut: KeyboardShortcut): void {
    this.shortcuts.push(shortcut);
  }

  // Remove keyboard shortcut
  removeShortcut(key: string, modifiers: string[] = []): void {
    this.shortcuts = this.shortcuts.filter(
      shortcut => !(shortcut.key === key && 
        JSON.stringify(shortcut.modifiers) === JSON.stringify(modifiers))
    );
  }

  // Initialize event listeners
  private initializeEventListeners(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  // Handle keydown events
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isActive) return;

    const key = event.key.toLowerCase();
    const modifiers: ("ctrl" | "alt" | "shift")[] = [];

    if (event.ctrlKey) modifiers.push('ctrl');
    if (event.altKey) modifiers.push('alt');
    if (event.shiftKey) modifiers.push('shift');

    // Find matching shortcut
    const matchingShortcut = this.shortcuts.find(shortcut => 
      shortcut.key === key && 
      JSON.stringify(shortcut.modifiers || []) === JSON.stringify(modifiers)
    );

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }

  // Enable/disable keyboard shortcuts
  setActive(active: boolean): void {
    this.isActive = active;
  }

  // Get help text for all shortcuts
  getHelpText(): string {
    return this.shortcuts
      .map(shortcut => {
        const keys = [...(shortcut.modifiers || []), shortcut.key];
        const keyString = keys.map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(' + ');
        return `${keyString}: ${shortcut.description}`;
      })
      .join('\n');
  }
}

// Color contrast utilities
export const checkColorContrast = (foreground: string, background: string): {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
} => {
  // Simple contrast ratio calculation (would use a proper library in production)
  const getLuminance = (color: string): number => {
    // Simplified luminance calculation
    return 0.5; // Placeholder
  };

  const fgLuminance = getLuminance(foreground);
  const bgLuminance = getLuminance(background);
  
  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                (Math.min(fgLuminance, bgLuminance) + 0.05);

  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
  };
};

// ARIA utilities
export const setAriaLabel = (element: Element, label: string): void => {
  element.setAttribute('aria-label', label);
};

export const setAriaDescribedBy = (element: Element, describedByIds: string[]): void => {
  element.setAttribute('aria-describedby', describedByIds.join(' '));
};

export const announceToScreenReader = (message: string): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus trap utility for modals
export class FocusTrap {
  private element: HTMLElement;
  private focusableElements: HTMLElement[] = [];
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.updateFocusableElements();
  }

  private updateFocusableElements(): void {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];

    this.focusableElements = Array.from(
      this.element.querySelectorAll(focusableSelectors.join(', '))
    ) as HTMLElement[];

    this.firstFocusableElement = this.focusableElements[0] || null;
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  activate(): void {
    this.element.addEventListener('keydown', this.handleKeyDown.bind(this));
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }
  }

  deactivate(): void {
    this.element.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === this.firstFocusableElement) {
          event.preventDefault();
          this.lastFocusableElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === this.lastFocusableElement) {
          event.preventDefault();
          this.firstFocusableElement?.focus();
        }
      }
    } else if (event.key === 'Escape') {
      // Allow escape to close modal (handled by parent)
      event.stopPropagation();
    }
  }
}