export interface User {
  id: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  personality?: Personality;
  createdAt?: Date;
  name: string;
  updatedAt: Date | any;
  preferences?: {
    theme: 'light' | 'dark';
    colorScheme: 'chill' | 'beast';
  };
}

export interface Personality {
  procrastinationResponse?: string;
  sleepResponse?: string;
  alcoholSmokingResponse?: string;
}

export interface Habit {
  id?: string;
  title: string;
  description?: string;
  ownerId: string;
  category?: string;
  isNegative?: boolean;
  isPublic?: boolean;
  streak?: number;
  recurrence?: 'daily' | 'weekly';
  completed?: boolean;
  createdAt?: Date | any;
}

export interface HabitLog {
  completed: boolean;
  timestamp: Date | any;
}

export interface Post {
  authorId: string; // reference to users collection
  content: string;
  modeTag: 'growth' | 'action';
  createdAt: Date | number;
}

export interface Comment {
  authorId: string;
  content: string;
  createdAt: Date | number;
}

export interface LeaderboardEntry {
  userId: string;
  score: number;
}

export interface Leaderboard {
  entries: LeaderboardEntry[];
}

export interface AdviceSession {
  userId: string;
  habitIds: string[]; // array of habit IDs
  startedAt: Date | number;
}

export interface Message {
  sender: 'user' | 'bot';
  text: string;
  createdAt: Date | number;
}

export interface VoiceChat {
  audioUrl: string;
  duration: number;
  createdAt: Date | number;
}

export interface ScheduleEntry {
  userId: string;
  habitId: string;
  scheduledFor: Date | number;
  status: 'pending' | 'completed' | 'missed';
}

export interface AnalyticsEvent {
  userId: string;
  eventType: string;
  metadata: Record<string, any>;
  timestamp: Date | number;
}

export interface Mood {
  id?: string;
  userId: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'awful';
  note?: string;
  createdAt: Date | any;
}
