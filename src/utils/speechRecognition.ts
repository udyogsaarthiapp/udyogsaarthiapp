import { VoiceRecognitionOptions } from '@/types';

// Check if speech recognition is supported
export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return !!(
    (window as any).SpeechRecognition || 
    (window as any).webkitSpeechRecognition
  );
};

// Get the SpeechRecognition constructor
export const getSpeechRecognition = (): any => {
  if (typeof window === 'undefined') return null;
  
  return (window as any).SpeechRecognition || 
         (window as any).webkitSpeechRecognition;
};

// Create a new speech recognition instance
export const createSpeechRecognition = (options: VoiceRecognitionOptions = {}): any => {
  const SpeechRecognition = getSpeechRecognition();
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  
  // Set default options
  recognition.continuous = options.continuous ?? false;
  recognition.interimResults = options.interimResults ?? false;
  recognition.lang = options.lang ?? 'en-IN';
  recognition.maxAlternatives = options.maxAlternatives ?? 1;

  return recognition;
};

// Speech synthesis utilities
export const isSpeechSynthesisSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
};

export const speak = (
  text: string, 
  options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    lang?: string;
    voice?: string;
  } = {}
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set options
    utterance.rate = options.rate ?? 0.9;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;
    utterance.lang = options.lang ?? 'en-IN';

    // Set voice if specified
    if (options.voice) {
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => 
        voice.name.toLowerCase().includes(options.voice!.toLowerCase())
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(event.error);

    speechSynthesis.speak(utterance);
  });
};

// Get available voices
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (!isSpeechSynthesisSupported()) return [];
  return speechSynthesis.getVoices();
};

// Voice command processing utilities
export const processVoiceCommand = (transcript: string): {
  command: string;
  parameters: string[];
} => {
  // Remove punctuation (periods, commas, etc.) from transcript
  const cleanTranscript = transcript.replace(/[.,!?;:—\-]+$/, '').toLowerCase().trim();
  const normalized = cleanTranscript;
  const words = normalized.split(' ');
  
  // Extract command and parameters
  let command = '';
  let parameters: string[] = [];
  
  // Try to extract a location phrase like "in Pune" / "near Mumbai" / "at Bangalore"
  let location: string | null = null;
  try {
    const locMatch = normalized.match(/\b(?:in|at|near|around)\s+([a-z\s\-]{2,})/i);
    if (locMatch && locMatch[1]) {
      location = locMatch[1].trim();
    } else {
      // trailing pattern: "jobs in pune" or "training in pune"
      const trailingMatch = normalized.match(/(?:jobs|job|training|trainings|opportunities)\s+(?:in\s+)?([a-z\s\-]{2,})$/i);
      if (trailingMatch && trailingMatch[1]) {
        location = trailingMatch[1].trim();
      }
    }
  } catch (e) {
    location = null;
  }

  // remove the location phrase from the normalized string for easier command parsing
  const normalizedNoLoc = location ? normalized.replace(new RegExp('\\\b(?:in|at|near|around)\\s+' + location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i'), '').trim() : normalized;

  // Common command patterns
  if (normalizedNoLoc.includes('search for') || normalizedNoLoc.includes('find')) {
    command = 'search';
    const searchTerm = normalizedNoLoc.replace(/search for|find/g, '').trim();
    parameters = [searchTerm];
    if (location) parameters.push(location);
  } else if (normalizedNoLoc.includes('show jobs') || normalizedNoLoc.includes('jobs')) {
    command = 'filter_jobs';
    if (location) parameters = [location];
  } else if (normalizedNoLoc.includes('show training') || normalizedNoLoc.includes('training')) {
    command = 'filter_training';
    if (location) parameters = [location];
  } else if (normalized.includes('apply to') || normalized.includes('apply for')) {
    command = 'apply';
    const numberMatch = normalized.match(/(\d+)/);
    if (numberMatch) {
      parameters = [numberMatch[0]];
    }
  } else if (normalized.includes('bookmark') || normalized.includes('save')) {
    command = 'bookmark';
    const numberMatch = normalized.match(/(\d+)/);
    if (numberMatch) {
      parameters = [numberMatch[0]];
    }
  } else if (normalized.includes('toggle')) {
    command = 'toggle';
    // Extract the feature name after 'toggle'
    const feature = normalized.replace('toggle', '').trim();
    parameters = [feature];
  } else if (normalized.includes('clear filters') || normalized.includes('reset')) {
    command = 'clear_filters';
  } else if (normalized.includes('stop') && !normalized.includes('stop listening')) {
    // "stop" alone = stop screen reader
    command = 'stop';
  } else if (normalized.includes('screen reader') || normalized.includes('reader on') || normalized.includes('reader off')) {
    command = 'screen_reader';
    const action = normalized.replace(/screen reader|reader/g, '').trim();
    parameters = [action];
  } else if (normalized.includes('read page') || normalized.includes('read all') || (normalized === 'read')) {
    command = 'read';
  } else if (normalized.includes('help')) {
    command = 'help';
  } else if (normalized.includes('open assistant') || normalized.includes('open chat')) {
    command = 'open_chat';
  } else if (normalized.includes('close assistant') || normalized.includes('close chat') || normalized.includes('hide chat')) {
    command = 'close_chat';
  } else {
    command = 'unknown';
    parameters = [normalized];
  }
  
  return { command, parameters };
};

// Audio feedback utilities
export const playAudioFeedback = (type: 'success' | 'error' | 'info' = 'info'): void => {
  if (typeof window === 'undefined') return;
  
  // Create audio context for accessibility sounds
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set frequency based on feedback type
    switch (type) {
      case 'success':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
      case 'error':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        break;
      case 'info':
      default:
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        break;
    }
    
    // Set volume and duration
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    console.log('Audio feedback not available');
  }
};

// Accessibility announcement queue
class AnnouncementQueue {
  private queue: string[] = [];
  private isProcessing = false;

  add(text: string): void {
    this.queue.push(text);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const text = this.queue.shift();
      if (text) {
        try {
          await speak(text);
          // Small delay between announcements
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.error('Failed to announce:', error);
        }
      }
    }
    
    this.isProcessing = false;
  }

  clear(): void {
    this.queue = [];
    if (isSpeechSynthesisSupported()) {
      speechSynthesis.cancel();
    }
    this.isProcessing = false;
  }
}

export const announcementQueue = new AnnouncementQueue();