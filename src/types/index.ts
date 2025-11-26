// Job and Training Types
export type JobType = "job" | "training";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  description: string;
  applyLink: string;
  skills: string[];
  postedDate: string;
  isBookmarked: boolean;
  salary?: string;
  experience?: string;
  deadline?: string;
  category?: string;
  featured?: boolean;
  accessibility_friendly?: boolean;
  remote_friendly?: boolean;
}

// Chat Types
export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "command" | "suggestion";
}

// Accessibility Types
export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  textToSpeech: boolean;
  vibrationAlerts: boolean;
  onScreenAlerts: boolean;
  voiceNavigation: boolean;
  voiceCommands: boolean;
  reducedMotion: boolean;
  focusIndicators: boolean;
}

// Voice Recognition Types
export interface VoiceRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
}

// Filter Types
export interface JobFilters {
  searchTerm: string;
  type: JobType | "all";
  location: string;
  skills: string[];
  salaryRange?: [number, number];
  experienceLevel?: string;
  accessibilityFriendly?: boolean;
  remoteFriendly?: boolean;
}

// User Preferences Types
export interface UserPreferences {
  accessibility: AccessibilitySettings;
  notifications: boolean;
  language: string;
  theme: "light" | "dark" | "auto";
}

// Speech Synthesis Types
export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  voice?: string;
}

// Component Props Types
export interface JobCardProps {
  job: Job;
  index: number;
  onBookmark: (jobId: string) => void;
  onRead: (job: Job) => void;
  isBookmarked: boolean;
}

export interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onToggleFeature: (feature: keyof AccessibilitySettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface ChatAssistantProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface JobSearchResponse extends ApiResponse<Job[]> {
  total: number;
  page: number;
  limit: number;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  icon?: any;
  action: () => void;
  shortcut?: string;
  ariaLabel?: string;
}

// Keyboard Shortcut Types
export interface KeyboardShortcut {
  key: string;
  modifiers?: ("ctrl" | "alt" | "shift")[];
  action: () => void;
  description: string;
}

// Voice Command Types
export interface VoiceCommand {
  phrases: string[];
  action: (params?: any) => void;
  description: string;
  category: string;
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  category: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

// Storage Types
export interface StorageData {
  bookmarkedJobs: string[];
  userPreferences: UserPreferences;
  recentSearches: string[];
  viewedJobs: string[];
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;