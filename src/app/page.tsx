'use client';

import React, { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { 
  Search, 
  Bookmark, 
  Users, 
  Mic, 
  MicOff, 
  Settings, 
  MessageCircle, 
  Send, 
  Briefcase, 
  Volume2, 
  Eye, 
  Type, 
  Bell, 
  Navigation, 
  Command, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Heart, 
  Star, 
  Clock, 
  Award
} from "lucide-react";

// Import components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Voice utilities
import {
  isSpeechRecognitionSupported,
  createSpeechRecognition,
  processVoiceCommand,
  speak
} from "@/utils/speechRecognition";

// Simple types (inline to avoid import issues)
type JobType = "job" | "training";

interface Job {
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
  featured?: boolean;
  accessibility_friendly?: boolean;
  remote_friendly?: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  textToSpeech: boolean;
  vibrationAlerts: boolean;
  onScreenAlerts: boolean;
  voiceNavigation: boolean;
  voiceCommands: boolean;
}

// Sample data (expanded so frontend shows more jobs/trainings)
const sampleJobs: Job[] = [
  {
    id: "1",
    title: "Senior Accessibility Developer",
    company: "Tech Solutions Inc.",
    location: "New Delhi",
    type: "job",
    description: "Lead development of accessible web applications following WCAG 2.1 AA standards. Work with assistive technologies and conduct accessibility audits.",
    applyLink: "https://example.com/apply/1",
    skills: ["React", "JavaScript", "WCAG", "ARIA", "Accessibility"],
    postedDate: "2024-12-15",
    isBookmarked: false,
    salary: "₹8-12 LPA",
    experience: "3-5 years",
    featured: true,
    accessibility_friendly: true,
    remote_friendly: true
  },
  {
    id: "2",
    title: "Web Accessibility Training Program",
    company: "National Skill Development Corporation",
    location: "Mumbai",
    type: "training",
    description: "Comprehensive 3-month certification program covering web accessibility standards and assistive technologies.",
    applyLink: "https://example.com/apply/2",
    skills: ["Web Standards", "Accessibility", "Screen Readers", "Training"],
    postedDate: "2024-12-10",
    isBookmarked: false,
    salary: "Free (Gov. Sponsored)",
    experience: "Beginner Friendly",
    featured: true,
    accessibility_friendly: true,
    remote_friendly: false
  },
  {
    id: "3",
    title: "Inclusive UX Designer",
    company: "Innovate Digital Labs",
    location: "Bengaluru",
    type: "job",
    description: "Design inclusive user experiences for mobile and web applications with focus on accessibility and usability.",
    applyLink: "https://example.com/apply/3",
    skills: ["UX Design", "Figma", "Accessibility", "User Research"],
    postedDate: "2024-12-08",
    isBookmarked: false,
    salary: "₹6-10 LPA",
    experience: "2-4 years",
    featured: false,
    accessibility_friendly: true,
    remote_friendly: true
  },
  {
    id: "4",
    title: "Data Entry Operator",
    company: "ABC Pvt Ltd",
    location: "Hyderabad",
    type: "job",
    description: "Accurate data entry and record keeping. Suitable for entry-level candidates.",
    applyLink: "https://example.com/apply/4",
    skills: ["Typing", "Attention to Detail"],
    postedDate: "2024-11-20",
    isBookmarked: false,
    salary: "₹1.5-2 LPA",
    experience: "Fresher",
    featured: false,
    accessibility_friendly: true,
    remote_friendly: false
  },
  {
    id: "5",
    title: "Software Intern",
    company: "XYZ Tech",
    location: "Pune",
    type: "job",
    description: "Internship for software development and testing.",
    applyLink: "https://example.com/apply/5",
    skills: ["JavaScript", "Python"],
    postedDate: "2024-11-18",
    isBookmarked: false,
    salary: "Stipend",
    experience: "Fresher",
    featured: false,
    accessibility_friendly: false,
    remote_friendly: true
  },
  {
    id: "6",
    title: "Assistive Technology Specialist",
    company: "EnableTech",
    location: "Chennai",
    type: "job",
    description: "Support users with assistive technologies and ensure product compatibility.",
    applyLink: "https://example.com/apply/6",
    skills: ["Screen Readers", "Accessibility Testing"],
    postedDate: "2024-11-25",
    isBookmarked: false,
    salary: "₹4-6 LPA",
    experience: "1-3 years",
    featured: false,
    accessibility_friendly: true,
    remote_friendly: false
  },
  {
    id: "7",
    title: "Vocational Training - Carpentry",
    company: "SkillBuild Trust",
    location: "Kolkata",
    type: "training",
    description: "Hands-on carpentry training tailored for persons with disabilities.",
    applyLink: "https://example.com/apply/7",
    skills: ["Carpentry", "Workshop Skills"],
    postedDate: "2024-11-30",
    isBookmarked: false,
    salary: "Free",
    experience: "Beginner",
    featured: false,
    accessibility_friendly: true,
    remote_friendly: false
  },
  {
    id: "8",
    title: "Digital Marketing for Accessibility",
    company: "MarketInclusiv",
    location: "Remote",
    type: "training",
    description: "Training program on inclusive digital marketing practices.",
    applyLink: "https://example.com/apply/8",
    skills: ["SEO", "Content"],
    postedDate: "2024-12-01",
    isBookmarked: false,
    salary: "Paid",
    experience: "Beginner",
    featured: false,
    accessibility_friendly: true,
    remote_friendly: true
  },
  {
    id: "9",
    title: "Customer Support Executive (Accessible Services)",
    company: "CareCo",
    location: "Gurgaon",
    type: "job",
    description: "Provide empathetic customer support via phone and chat with accessibility accommodations.",
    applyLink: "https://example.com/apply/9",
    skills: ["Communication", "Empathy"],
    postedDate: "2024-12-05",
    isBookmarked: false,
    salary: "₹2-3 LPA",
    experience: "1 year",
    featured: false,
    accessibility_friendly: true,
    remote_friendly: true
  },
  {
    id: "10",
    title: "Mobile App Accessibility Bootcamp",
    company: "AppWorks Academy",
    location: "Bengaluru",
    type: "training",
    description: "Short bootcamp covering mobile accessibility testing and remediation.",
    applyLink: "https://example.com/apply/10",
    skills: ["Mobile", "Accessibility Testing"],
    postedDate: "2024-12-12",
    isBookmarked: false,
    salary: "Paid",
    experience: "Beginner",
    featured: false,
    accessibility_friendly: true,
    remote_friendly: false
  }
];

export default function UdyogSaarthi() {
  // State management
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(sampleJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<JobType | "all">("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<"all" | "applied" | "not-applied">("all");
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);
  // Helper to decode JWT and extract 'sub' (identity)
  const getUserIdFromToken = () => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1];
      // atob polyfill safe replacement for URL-safe base64
      const json = JSON.parse(decodeURIComponent(atob(payload.replace(/-/g, '+').replace(/_/g, '/')).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
      return json.sub || null;
    } catch {
      return null;
    }
  };

  // appliedJobs is per-user; persisted in localStorage under key 'appliedJobsByUser'
  const [appliedJobs, setAppliedJobs] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const userId = getUserIdFromToken();
    try {
      const rawMap = localStorage.getItem('appliedJobsByUser');
      const map = rawMap ? JSON.parse(rawMap) : {};
      // migration: if no per-user map but old 'appliedJobs' exists, migrate for this user
      if (userId && (!map[userId] || map[userId].length === 0)) {
        const oldRaw = localStorage.getItem('appliedJobs');
        if (oldRaw) {
          try {
            const oldArr = JSON.parse(oldRaw);
            if (Array.isArray(oldArr)) {
              map[userId] = oldArr;
              localStorage.setItem('appliedJobsByUser', JSON.stringify(map));
              localStorage.removeItem('appliedJobs');
              return oldArr;
            }
          } catch {}
        }
      }
      return (userId && map[userId]) ? map[userId] : [];
    } catch {
      return [];
    }
  });

  // Applied dates per-user
  const [appliedDates, setAppliedDates] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    const userId = getUserIdFromToken();
    try {
      const rawMap = localStorage.getItem('appliedDates');
      const map = rawMap ? JSON.parse(rawMap) : {};
      return (userId && map[userId]) ? map[userId] : {};
    } catch {
      return {};
    }
  });

  // helper to persist applied jobs for current user
  const persistAppliedForUser = (userId: string | null, arr: string[]) => {
    if (typeof window === 'undefined' || !userId) return;
    try {
      const rawMap = localStorage.getItem('appliedJobsByUser');
      const map = rawMap ? JSON.parse(rawMap) : {};
      map[userId] = arr;
      localStorage.setItem('appliedJobsByUser', JSON.stringify(map));
    } catch {}
  };

  // Listen for storage events so applied status updates when token changes in another tab or window
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'appliedJobsByUser' || e.key === 'appliedJobs') {
        // reload appliedJobs for current token/user
        const userId = getUserIdFromToken();
        try {
          const rawMap = localStorage.getItem('appliedJobsByUser');
          const map = rawMap ? JSON.parse(rawMap) : {};
          setAppliedJobs((userId && map[userId]) ? map[userId] : []);
        } catch {
          setAppliedJobs([]);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    textToSpeech: true,
    vibrationAlerts: false,
    onScreenAlerts: true,
    voiceNavigation: true,
    voiceCommands: false,
  });

  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "bot-1",
      text: "नमस्ते! Welcome to Udyog Saarthi! I'm your accessibility-focused job assistant. How can I help you find the perfect opportunity today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  
  const [chatInput, setChatInput] = useState("");
  const [isChatListening, setIsChatListening] = useState(false);
  const [isVoiceCommandActive, setIsVoiceCommandActive] = useState(false);
  const [isSearchListening, setIsSearchListening] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const searchRecognitionRef = useRef<any>(null);
  const chatRecognitionRef = useRef<any>(null);
  const commandRecognitionRef = useRef<any>(null);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState("");

  // Refs
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    // Simple initialization
    console.log("Udyog Saarthi initialized");
  }, []);

  // Update jobs when bookmarks change
  useEffect(() => {
    setJobs(prev => 
      prev.map(job => ({
        ...job,
        isBookmarked: bookmarkedJobs.includes(job.id)
      }))
    );
  }, [bookmarkedJobs]);

  // Filter jobs
  useEffect(() => {
    let filtered = [...jobs];
    
    // Text search
    const searchTermLower = searchTerm.trim().toLowerCase();
    if (searchTermLower) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTermLower) ||
        job.company.toLowerCase().includes(searchTermLower) ||
        job.description.toLowerCase().includes(searchTermLower) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTermLower))
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(job => 
        selectedSkills.every(skill => job.skills.includes(skill))
      );
    }

    // Applied filter
    if (appliedFilter === "applied") {
      filtered = filtered.filter(job => appliedJobs.includes(String(job.id)));
    } else if (appliedFilter === "not-applied") {
      filtered = filtered.filter(job => !appliedJobs.includes(String(job.id)));
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedType, selectedLocation, selectedSkills, jobs, appliedFilter, appliedJobs]);

  // Announce function
  const announce = (text: string) => {
    setCurrentAnnouncement(text);
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = text;
    }
  };

  // Initialize recognition instances lazily
  const ensureRecognizers = () => {
    if (!isSpeechRecognitionSupported()) {
      announce("Speech recognition not supported in this browser");
      return false;
    }
    if (!searchRecognitionRef.current) {
      const rec = createSpeechRecognition({ interimResults: false, lang: 'en-IN' });
      if (rec) {
        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchTerm(transcript);
          announce(`Searching for ${transcript}`);
          setIsSearchListening(false);
          rec.stop();
        };
        rec.onend = () => setIsSearchListening(false);
        searchRecognitionRef.current = rec;
      }
    }
    if (!chatRecognitionRef.current) {
      const rec = createSpeechRecognition({ interimResults: false, lang: 'en-IN' });
      if (rec) {
        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setChatInput(transcript);
          announce(`Heard: ${transcript}`);
          setIsChatListening(false);
          rec.stop();
        };
        rec.onend = () => setIsChatListening(false);
        chatRecognitionRef.current = rec;
      }
    }
    if (!commandRecognitionRef.current) {
      const rec = createSpeechRecognition({ interimResults: false, lang: 'en-IN', continuous: true });
      if (rec) {
        rec.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          const { command, parameters } = processVoiceCommand(transcript);
          handleVoiceCommand(command, parameters);
        };
        rec.onend = () => {
          // If still active, restart continuous recognition
          if (isVoiceCommandActive) {
            try { rec.start(); } catch {}
          }
        };
        commandRecognitionRef.current = rec;
      }
    }
    return true;
  };

  const startRecognition = (which: 'search' | 'chat' | 'command') => {
    if (!ensureRecognizers()) return;
    try {
      if (which === 'search' && searchRecognitionRef.current) {
        searchRecognitionRef.current.start();
        setIsSearchListening(true);
      } else if (which === 'chat' && chatRecognitionRef.current) {
        chatRecognitionRef.current.start();
        setIsChatListening(true);
      } else if (which === 'command' && commandRecognitionRef.current) {
        commandRecognitionRef.current.start();
      }
    } catch {}
  };

  const stopRecognition = (which: 'search' | 'chat' | 'command') => {
    try {
      if (which === 'search' && searchRecognitionRef.current) searchRecognitionRef.current.stop();
      if (which === 'chat' && chatRecognitionRef.current) chatRecognitionRef.current.stop();
      if (which === 'command' && commandRecognitionRef.current) commandRecognitionRef.current.stop();
    } catch {}
  };

  const toggleVoiceSearch = () => {
    if (isSearchListening) {
      stopRecognition('search');
      announce("Voice search stopped");
    } else {
      announce("Voice search activated");
      startRecognition('search');
    }
  };

  const toggleChatVoiceSearch = () => {
    if (isChatListening) {
      stopRecognition('chat');
      announce("Voice input stopped");
    } else {
      announce("Voice input activated");
      startRecognition('chat');
    }
  };

  const toggleVoiceCommands = () => {
    const next = !isVoiceCommandActive;
    setIsVoiceCommandActive(next);
    if (next) {
      announce("Voice commands activated");
      startRecognition('command');
    } else {
      announce("Voice commands deactivated");
      stopRecognition('command');
    }
  };

  

  // Screen reader: read all page content
  const readPageContent = async () => {
    try {
      // Collect all visible text content from the page
      const mainContent = document.querySelector('main');
      if (!mainContent) {
        announce('No content found to read');
        return;
      }

      // Get all text from main content, preserving structure
      const allText = Array.from(mainContent.querySelectorAll('h1, h2, h3, h4, p, .card, [class*="job"], [class*="title"], [class*="description"]'))
        .map((el: any) => {
          const text = el.textContent?.trim() || '';
          return text.length > 0 ? text : null;
        })
        .filter((text: any) => text !== null && text !== '')
        .join('. ');

      if (allText.length > 0) {
        announce('Starting screen reader');
        await speak(allText);
        setIsScreenReaderActive(false);
        announce('Screen reader finished');
      } else {
        announce('No content to read');
      }
    } catch (e) {
      announce('Could not read page content');
    }
  };

  const handleScreenReaderToggle = async () => {
    if (isScreenReaderActive) {
      setIsScreenReaderActive(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      announce('Screen reader stopped');
    } else {
      setIsScreenReaderActive(true);
      announce('Screen reader enabled, reading page content');
      await readPageContent();
    }
  };

  const handleVoiceCommand = (command: string, parameters: string[]) => {
    // Helper: match a spoken location to one of the known locations (uniqueLocations)
    const matchLocation = (candidate: string | null): string | null => {
      if (!candidate) return null;
      try {
        const norm = candidate.toLowerCase().trim();
        // exact
        const exact = uniqueLocations.find(l => l.toLowerCase() === norm);
        if (exact) return exact;
        // substring
        const substr = uniqueLocations.find(l => l.toLowerCase().includes(norm) || norm.includes(l.toLowerCase()));
        if (substr) return substr;

        // simple Levenshtein distance for fuzzy match
        const levenshtein = (a: string, b: string) => {
          const m = a.length, n = b.length;
          const dp: number[][] = Array.from({ length: m+1 }, () => Array(n+1).fill(0));
          for (let i = 0; i <= m; i++) dp[i][0] = i;
          for (let j = 0; j <= n; j++) dp[0][j] = j;
          for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
              const cost = a[i-1] === b[j-1] ? 0 : 1;
              dp[i][j] = Math.min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + cost);
            }
          }
          return dp[m][n];
        };

        let best: { loc: string; dist: number } | null = null;
        for (const loc of uniqueLocations) {
          const d = levenshtein(norm, loc.toLowerCase());
          if (!best || d < best.dist) best = { loc, dist: d };
        }
        if (best) {
          const threshold = Math.max(1, Math.floor(best.loc.length * 0.35));
          if (best.dist <= threshold) return best.loc;
        }
      } catch (e) {
        // fallback
      }
      return null;
    };

    switch (command) {
      case 'search': {
        const term = parameters[0] ?? '';
        const loc = parameters[1] ?? null;
        setSearchTerm(term);
        if (loc) {
          const matched = matchLocation(loc);
          if (matched) {
            setSelectedLocation(matched);
            announce(`Searching for ${term} in ${matched}`);
          } else {
            setSelectedLocation(loc);
            announce(`Searching for ${term} in ${loc}`);
          }
        } else {
          announce(`Searching for ${term}`);
        }
        break;
      }
      case 'filter_jobs': {
        setSelectedType('job');
        if (parameters && parameters[0]) {
          const matched = matchLocation(parameters[0]);
          if (matched) {
            setSelectedLocation(matched);
            announce(`Showing jobs in ${matched}`);
          } else {
            setSelectedLocation(parameters[0]);
            announce(`Showing jobs in ${parameters[0]}`);
          }
        } else {
          announce('Showing jobs');
        }
        break;
      }
      case 'filter_training': {
        setSelectedType('training');
        if (parameters && parameters[0]) {
          const matched = matchLocation(parameters[0]);
          if (matched) {
            setSelectedLocation(matched);
            announce(`Showing training in ${matched}`);
          } else {
            setSelectedLocation(parameters[0]);
            announce(`Showing training in ${parameters[0]}`);
          }
        } else {
          announce('Showing training');
        }
        break;
      }
      case 'bookmark': {
        const id = parameters[0];
        if (id) toggleBookmark(id);
        break;
      }
      case 'toggle': {
        const key = parameters[0];
        if (key) {
          // Map simple phrases to feature keys
          const map: Record<string, keyof AccessibilitySettings> = {
            'high contrast': 'highContrast',
            'large text': 'largeText',
            'text to speech': 'textToSpeech',
            'vibration alerts': 'vibrationAlerts',
            'on screen alerts': 'onScreenAlerts',
            'voice navigation': 'voiceNavigation',
            'voice commands': 'voiceCommands',
          };
          const feature = map[key] as keyof AccessibilitySettings | undefined;
          if (feature) toggleAccessibilityFeature(feature);
        }
        break;
      }
      case 'open_chat': {
        setIsChatOpen(true);
        announce('Chat opened');
        break;
      }
      case 'close_chat': {
        if (isChatOpen) {
          setIsChatOpen(false);
          announce('Chat closed');
        } else {
          announce('Chat is already closed');
        }
        break;
      }
      case 'clear_filters': {
        setSearchTerm('');
        setSelectedType('all');
        setSelectedLocation('all');
        setSelectedSkills([]);
        announce('Filters cleared');
        break;
      }
      case 'help': {
        speak('Try commands like search for React jobs, show training, toggle high contrast, or open assistant.');
        break;
      }
      case 'screen_reader': {
        const action = parameters[0]?.toLowerCase() || '';
        if (action.includes('off') || action.includes('disable') || action.includes('stop')) {
          if (isScreenReaderActive) {
            setIsScreenReaderActive(false);
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            announce('Screen reader stopped');
          }
        } else if (action.includes('on') || action.includes('enable') || action.includes('start')) {
          if (!isScreenReaderActive) {
            setIsScreenReaderActive(true);
            announce('Screen reader enabled, reading page content');
            readPageContent();
          }
        } else {
          handleScreenReaderToggle();
        }
        break;
      }
      case 'read': {
        readPageContent();
        break;
      }
      case 'stop': {
        // Stop screen reader immediately
        if (isScreenReaderActive) {
          setIsScreenReaderActive(false);
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          announce('Screen reader stopped');
        }
        break;
      }
      default: {
        // Unknown -> fill search
        if (parameters && parameters[0]) {
          setSearchTerm(parameters[0]);
          announce(`Searching for ${parameters[0]}`);
        }
      }
    }
  };

  // Job functions
  const toggleBookmark = (jobId: string) => {
    const isCurrentlyBookmarked = bookmarkedJobs.includes(jobId);
    
    if (isCurrentlyBookmarked) {
      setBookmarkedJobs(prev => prev.filter(id => id !== jobId));
    } else {
      setBookmarkedJobs(prev => [...prev, jobId]);
    }
    
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      announce(isCurrentlyBookmarked 
        ? `Removed ${job.title} from bookmarks` 
        : `Added ${job.title} to bookmarks`
      );
    }
  };

  const handleApply = async (jobId: string) => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      // redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    // Use localhost backend base. If your backend runs elsewhere, change this.
    const apiBase = `http://localhost:5000`;

    try {
      const res = await fetch(`${apiBase}/api/jobs/apply/${jobId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let data: any = null;
      try { data = await res.json(); } catch (_) { data = null; }

      if (res.ok) {
        const msg = data?.message || 'Application submitted successfully';
        announce(msg);
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
        alert(msg);
        try {
          // mark as applied in UI and persist with date
          const idStr = String(jobId);
          const userId = getUserIdFromToken();
          
          // Store applied date
          const today = new Date();
          const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          const rawDateMap = localStorage.getItem('appliedDates');
          const dateMap = rawDateMap ? JSON.parse(rawDateMap) : {};
          if (userId) {
            if (!dateMap[userId]) dateMap[userId] = {};
            dateMap[userId][idStr] = dateStr;
            try { localStorage.setItem('appliedDates', JSON.stringify(dateMap)); } catch {}
          }
          
          setAppliedJobs(prev => {
            if (prev.includes(idStr)) return prev;
            const next = [...prev, idStr];
            const rawMap = localStorage.getItem('appliedJobsByUser');
            const map = rawMap ? JSON.parse(rawMap) : {};
            if (userId) {
              map[userId] = next;
              try { localStorage.setItem('appliedJobsByUser', JSON.stringify(map)); } catch {}
            }
            return next;
          });
        } catch {}
      } else {
        const msg = data?.message || `Failed to apply (status ${res.status})`;
        announce(msg);
        alert(msg);
      }
    } catch (err: any) {
      const msg = err?.message || String(err) || 'Network error while applying';
      announce(msg);
      alert(`Network error while applying: ${msg}. Check backend is running at http://localhost:5000 and CORS allows http://localhost:3000`);
      console.error('Apply error:', err);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleAccessibilityFeature = (feature: keyof AccessibilitySettings) => {
    setAccessibilitySettings(prev => {
      const newSettings = { ...prev, [feature]: !prev[feature] };
      const featureName = feature.replace(/([A-Z])/g, ' $1').toLowerCase();
      announce(`${featureName} ${newSettings[feature] ? "enabled" : "disabled"}`);
      return newSettings;
    });
  };

  const readJobDetails = (job: Job) => {
    const jobType = job.type === "job" ? "Job opportunity" : "Training program";
    const announcement = `${jobType}: ${job.title} at ${job.company}. Location: ${job.location}. Required skills: ${job.skills.join(", ")}.`;
    announce(announcement);
  };

  // Chat functions
  const handleChatSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: chatInput,
      sender: "user",
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = `Thank you for your message: "${chatInput}". I'm here to help you find jobs and use accessibility features. Try searching for opportunities or adjusting your accessibility settings!`;
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        sender: "bot",
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);

    setChatInput("");
  };

  // Get unique values for filters
  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location)));
  const uniqueSkills = Array.from(new Set(jobs.flatMap(job => job.skills)));

  return (
    <div className={`min-h-screen transition-all duration-300 ${accessibilitySettings.highContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} ${accessibilitySettings.largeText ? 'text-lg' : ''}`}>
      {/* Live region for screen readers */}
      <div 
        ref={liveRegionRef}
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {currentAnnouncement}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Udyog Saarthi
              </h1>
              <p className="text-sm text-gray-600 font-medium">Accessible Career Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleVoiceCommands}
              variant={isVoiceCommandActive ? "default" : "outline"}
              className="hidden sm:flex"
            >
              <Command className="h-4 w-4 mr-2" />
              {isVoiceCommandActive ? "Voice Active" : "Enable Voice"}
            </Button>
            <Button
              onClick={handleScreenReaderToggle}
              variant={isScreenReaderActive ? "default" : "outline"}
              className="hidden sm:flex"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              {isScreenReaderActive ? "Reader Active" : "Screen Reader"}
            </Button>
            {isScreenReaderActive && (
              <Button
                onClick={() => {
                  setIsScreenReaderActive(false);
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  announce('Screen reader stopped');
                }}
                variant="destructive"
                className="hidden sm:flex"
              >
                ✕ Stop
              </Button>
            )}
            <Button
              onClick={() => setIsAccessibilityOpen(prev => !prev)}
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              Accessibility
            </Button>
            {typeof window !== 'undefined' && localStorage.getItem('token') ? (
              <Button
                onClick={() => window.location.href = '/profile'}
                variant="outline"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = '/login'}
                variant="outline"
              >
                Login / Signup
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Accessibility Panel */}
      {isAccessibilityOpen && (
        <div className="fixed top-24 right-4 w-80 z-50 bg-white rounded-xl shadow-2xl border p-6 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-xl flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              Accessibility Features
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAccessibilityOpen(false)}
            >
              ×
            </Button>
          </div>
          
          <div className="space-y-3">
            {Object.entries(accessibilitySettings).map(([feature, enabled]) => {
              const icons: Record<string, any> = {
                highContrast: Eye,
                largeText: Type,
                textToSpeech: Volume2,
                vibrationAlerts: Bell,
                onScreenAlerts: Bell,
                voiceNavigation: Navigation,
                voiceCommands: Command,
              };
              const Icon = icons[feature];
              
              return (
                <Button
                  key={feature}
                  variant={enabled ? "default" : "outline"}
                  onClick={() => toggleAccessibilityFeature(feature as keyof AccessibilitySettings)}
                  className="w-full justify-start"
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
        {/* Search Section */}
        <Card className="mb-8 shadow-xl bg-white/80">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Search className="h-6 w-6 mr-2 text-blue-600" />
              Find Your Next Opportunity
            </CardTitle>
            <CardDescription>
              Search through {jobs.length} job opportunities and training programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <Label htmlFor="search-input" className="text-base font-medium">
                  Search Jobs & Training
                </Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="search-input"
                    placeholder="Search by job title, skills, company..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-12 h-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`absolute right-1 top-1/2 transform -translate-y-1/2 ${isSearchListening ? 'text-red-500' : 'text-gray-500'}`}
                    onClick={toggleVoiceSearch}
                  >
                    {isSearchListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label>Type</Label>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value as any)}
                  className="w-full h-12 mt-2 border rounded-md px-3 bg-white"
                >
                  <option value="all">All Opportunities</option>
                  <option value="job">Jobs Only</option>
                  <option value="training">Training Only</option>
                </select>
              </div>

              <div>
                <Label>Location</Label>
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="w-full h-12 mt-2 border rounded-md px-3 bg-white"
                >
                  <option value="all">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Applications</Label>
                <select
                  value={appliedFilter}
                  onChange={e => setAppliedFilter(e.target.value as "all" | "applied" | "not-applied")}
                  className="w-full h-12 mt-2 border rounded-md px-3 bg-white"
                >
                  <option value="all">All Jobs</option>
                  <option value="applied">Applied Jobs</option>
                  <option value="not-applied">Not Applied</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <Label className="text-base font-medium mb-3 block">Filter by Skills</Label>
              <div className="flex flex-wrap gap-2">
                {uniqueSkills.slice(0, 10).map(skill => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            {filteredJobs.length} Opportunities Found
          </h2>
        </div>

        {/* Job Listings */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="lg:col-span-2 text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </div>
          ) : (
            filteredJobs.map((job, index) => (
              <Card
                key={job.id}
                className={`transition-all duration-300 hover:shadow-xl ${
                  job.featured ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-white'
                }`}
                tabIndex={0}
                onFocus={() => readJobDetails(job)}
              >
                {job.featured && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">
                        {index + 1}. {job.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1 text-gray-600">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.company}</span>
                        <span>•</span>
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleBookmark(job.id)}
                      >
                        {job.isBookmarked ? (
                          <Heart className="h-4 w-4 text-red-600 fill-current" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {appliedJobs.includes(String(job.id)) ? (
                        <div className="flex items-center gap-2">
                          <Button variant="outline" className="mr-2" disabled>
                            ✓ Applied
                          </Button>
                          {appliedDates[String(job.id)] && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 whitespace-nowrap">
                              Applied on {appliedDates[String(job.id)]}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="default"
                          onClick={() => handleApply(job.id)}
                          className="mr-2"
                        >
                          Apply
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(job.applyLink, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">{job.description}</p>
                    
                    {job.salary && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        💰 {job.salary}
                      </Badge>
                    )}

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Skills:</Label>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map(skill => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs cursor-pointer"
                            onClick={() => toggleSkill(skill)}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {job.postedDate}
                      </div>
                      
                      <div className="flex gap-2">
                        {job.accessibility_friendly && (
                          <Badge variant="secondary" className="text-xs">
                            ♿ Accessible
                          </Badge>
                        )}
                        <Badge
                          variant={job.type === 'job' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {job.type === 'job' ? '💼 Job' : '🎓 Training'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </main>

      {/* Chat Assistant */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        <Button
          onClick={() => setIsChatOpen(prev => !prev)}
          className="rounded-full w-14 h-14 shadow-2xl"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        
        {isChatOpen && (
          <Card className="w-80 max-w-[90vw] bg-white shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="text-lg">Udyog Assistant</CardTitle>
              <CardDescription className="text-blue-100">
                Ask me about jobs or accessibility features
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                {chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t p-4">
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask about jobs, accessibility..."
                    className="flex-1"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={toggleChatVoiceSearch}
                  >
                    {isChatListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}