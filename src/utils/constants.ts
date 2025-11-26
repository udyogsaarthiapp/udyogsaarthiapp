import { VoiceCommand, KeyboardShortcut } from '@/types';

// Application constants
export const APP_CONFIG = {
  name: 'Udyog Saarthi',
  version: '1.0.0',
  description: 'Accessible job and training portal for people with disabilities',
  supportEmail: 'support@udyogsaarthi.gov.in',
  helplineNumber: '1800-11-7878',
} as const;

// API endpoints (for future backend integration)
export const API_ENDPOINTS = {
  JOBS: '/api/jobs',
  TRAINING: '/api/training',
  BOOKMARKS: '/api/bookmarks',
  USER_PREFERENCES: '/api/preferences',
  SEARCH: '/api/search',
  ANALYTICS: '/api/analytics',
} as const;

// Default keyboard shortcuts
export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'h',
    modifiers: ['ctrl'],
    action: () => {}, // Will be set by component
    description: 'Show keyboard shortcuts help',
  },
  {
    key: 'f',
    modifiers: ['ctrl'],
    action: () => {}, // Will be set by component
    description: 'Focus search input',
  },
  {
    key: 'm',
    modifiers: ['ctrl'],
    action: () => {}, // Will be set by component
    description: 'Toggle voice search',
  },
  {
    key: 'm',
    modifiers: ['alt'],
    action: () => {}, // Will be set by component
    description: 'Toggle chat voice input',
  },
  {
    key: 'v',
    modifiers: ['ctrl', 'shift'],
    action: () => {}, // Will be set by component
    description: 'Toggle voice commands',
  },
  {
    key: 'b',
    modifiers: ['ctrl'],
    action: () => {}, // Will be set by component
    description: 'Show bookmarked jobs',
  },
  {
    key: 'j',
    modifiers: ['ctrl'],
    action: () => {}, // Will be set by component
    description: 'Filter jobs only',
  },
  {
    key: 't',
    modifiers: ['ctrl'],
    action: () => {}, // Will be set by component
    description: 'Filter training only',
  },
  {
    key: 'escape',
    modifiers: [],
    action: () => {}, // Will be set by component
    description: 'Close modals and panels',
  },
];

// Voice commands configuration
export const VOICE_COMMANDS: VoiceCommand[] = [
  {
    phrases: ['help', 'what can i do', 'commands'],
    action: () => {},
    description: 'Show available voice commands',
    category: 'help',
  },
  {
    phrases: ['search for', 'find', 'look for'],
    action: () => {},
    description: 'Search for jobs or training',
    category: 'search',
  },
  {
    phrases: ['show jobs', 'display jobs', 'jobs only'],
    action: () => {},
    description: 'Filter to show jobs only',
    category: 'filter',
  },
  {
    phrases: ['show training', 'display training', 'training only'],
    action: () => {},
    description: 'Filter to show training only',
    category: 'filter',
  },
  {
    phrases: ['clear filters', 'reset filters', 'show all'],
    action: () => {},
    description: 'Clear all applied filters',
    category: 'filter',
  },
  {
    phrases: ['apply to job', 'apply for job', 'apply to'],
    action: () => {},
    description: 'Apply to a specific job (say number)',
    category: 'action',
  },
  {
    phrases: ['bookmark job', 'save job', 'bookmark'],
    action: () => {},
    description: 'Bookmark a specific job (say number)',
    category: 'action',
  },
  {
    phrases: ['open assistant', 'open chat', 'show assistant'],
    action: () => {},
    description: 'Open the chat assistant',
    category: 'navigation',
  },
  {
    phrases: ['toggle high contrast', 'high contrast mode'],
    action: () => {},
    description: 'Toggle high contrast mode',
    category: 'accessibility',
  },
  {
    phrases: ['toggle large text', 'large text mode'],
    action: () => {},
    description: 'Toggle large text mode',
    category: 'accessibility',
  },
  {
    phrases: ['toggle text to speech', 'toggle tts'],
    action: () => {},
    description: 'Toggle text-to-speech',
    category: 'accessibility',
  },
  {
    phrases: ['read job details', 'describe job'],
    action: () => {},
    description: 'Read details of focused job',
    category: 'accessibility',
  },
];

// Speech synthesis settings
export const SPEECH_CONFIG = {
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0,
  lang: 'en-IN',
  voicePreference: ['female', 'indian', 'english'],
} as const;

// Accessibility thresholds
export const ACCESSIBILITY_THRESHOLDS = {
  MIN_CONTRAST_RATIO: 4.5,
  MIN_CONTRAST_RATIO_AAA: 7.0,
  MIN_FONT_SIZE: 14,
  MIN_TOUCH_TARGET: 44,
  MAX_TEXT_LENGTH_FOR_TTS: 500,
} as const;

// Animation durations (in ms)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: '320px',
  TABLET: '768px',
  DESKTOP: '1024px',
  LARGE_DESKTOP: '1440px',
} as const;

// Job categories
export const JOB_CATEGORIES = [
  'Technology',
  'Design',
  'Education',
  'Healthcare',
  'Finance',
  'Marketing',
  'Consulting',
  'Manufacturing',
  'Government',
  'Non-profit',
  'Accessibility Services',
  'Training & Development',
  'Communication Services',
  'Quality Assurance',
  'Product Management',
  'Publishing & Translation',
] as const;

// Experience levels
export const EXPERIENCE_LEVELS = [
  'Entry Level',
  'Beginner Friendly',
  '1-2 years',
  '2-4 years',
  '3-5 years',
  '4-7 years',
  '5+ years',
  'Senior Level',
  'Expert Level',
] as const;

// Salary ranges (in INR)
export const SALARY_RANGES = [
  { label: 'Under ₹3 LPA', min: 0, max: 300000 },
  { label: '₹3-5 LPA', min: 300000, max: 500000 },
  { label: '₹5-8 LPA', min: 500000, max: 800000 },
  { label: '₹8-12 LPA', min: 800000, max: 1200000 },
  { label: '₹12-18 LPA', min: 1200000, max: 1800000 },
  { label: '₹18+ LPA', min: 1800000, max: Infinity },
] as const;

// Common skills for autocomplete
export const COMMON_SKILLS = [
  'React',
  'JavaScript',
  'TypeScript',
  'HTML',
  'CSS',
  'Accessibility',
  'WCAG',
  'ARIA',
  'Screen Readers',
  'UX Design',
  'UI Design',
  'Figma',
  'Adobe Creative Suite',
  'Python',
  'Java',
  'Node.js',
  'Express',
  'MongoDB',
  'SQL',
  'API Development',
  'Testing',
  'Quality Assurance',
  'Agile',
  'Scrum',
  'Project Management',
  'Communication',
  'Training',
  'Documentation',
  'Sign Language',
  'Braille',
  'Assistive Technology',
  'Inclusive Design',
  'User Research',
  'Analytics',
  'SEO',
  'Content Writing',
  'Translation',
  'Customer Support',
  'Data Analysis',
  'Machine Learning',
  'AI',
  'Cloud Computing',
  'DevOps',
  'Security',
] as const;

// Error messages
export const ERROR_MESSAGES = {
  VOICE_NOT_SUPPORTED: 'Voice recognition is not supported in your browser. Please try using Chrome or Edge.',
  MICROPHONE_PERMISSION: 'Microphone permission is required for voice features. Please allow microphone access.',
  NETWORK_ERROR: 'Network error occurred. Please check your internet connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  INVALID_JOB_NUMBER: 'Invalid job number. Please specify a valid job number from the list.',
  NO_RESULTS_FOUND: 'No jobs or training programs found matching your criteria.',
  BOOKMARK_ERROR: 'Unable to save bookmark. Please try again.',
  SPEECH_SYNTHESIS_ERROR: 'Text-to-speech is not available. Please check your browser settings.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  JOB_BOOKMARKED: 'Job successfully bookmarked!',
  BOOKMARK_REMOVED: 'Job removed from bookmarks.',
  APPLICATION_OPENED: 'Application page opened in new tab.',
  FILTERS_CLEARED: 'All filters have been cleared.',
  VOICE_ACTIVATED: 'Voice commands activated.',
  VOICE_DEACTIVATED: 'Voice commands deactivated.',
  SETTINGS_SAVED: 'Accessibility settings saved.',
} as const;

// Tutorial steps
export const TUTORIAL_STEPS = [
  {
    target: '[data-tour="search"]',
    content: 'Use this search bar to find jobs and training programs. You can also use voice search by clicking the microphone icon or pressing Ctrl+M.',
  },
  {
    target: '[data-tour="filters"]',
    content: 'Filter results by job type, location, and required skills. Use voice commands like "show jobs" or "show training".',
  },
  {
    target: '[data-tour="accessibility"]',
    content: 'Access powerful accessibility features including high contrast mode, text-to-speech, and voice navigation.',
  },
  {
    target: '[data-tour="voice-commands"]',
    content: 'Enable voice commands to navigate hands-free. Say "help" to hear all available commands.',
  },
  {
    target: '[data-tour="chat"]',
    content: 'Get personalized assistance with job search, applications, and platform features.',
  },
] as const;

// Local storage keys (for future use)
export const STORAGE_KEYS = {
  ACCESSIBILITY_SETTINGS: 'udyog_accessibility_settings',
  BOOKMARKED_JOBS: 'udyog_bookmarked_jobs',
  USER_PREFERENCES: 'udyog_user_preferences',
  RECENT_SEARCHES: 'udyog_recent_searches',
  VIEWED_JOBS: 'udyog_viewed_jobs',
  TUTORIAL_COMPLETED: 'udyog_tutorial_completed',
  LANGUAGE_PREFERENCE: 'udyog_language',
  THEME_PREFERENCE: 'udyog_theme',
} as const;

// Analytics events (for future tracking)
export const ANALYTICS_EVENTS = {
  JOB_VIEWED: 'job_viewed',
  JOB_APPLIED: 'job_applied',
  JOB_BOOKMARKED: 'job_bookmarked',
  SEARCH_PERFORMED: 'search_performed',
  VOICE_COMMAND_USED: 'voice_command_used',
  ACCESSIBILITY_FEATURE_TOGGLED: 'accessibility_feature_toggled',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  TUTORIAL_COMPLETED: 'tutorial_completed',
  ERROR_ENCOUNTERED: 'error_encountered',
} as const;