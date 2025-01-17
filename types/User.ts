// types/user.ts
import { User as FirebaseUser } from "firebase/auth";

export type LevelType = "beginner" | "intermediate" | "advanced";

// Main User interface that extends FirebaseUser
export interface User extends FirebaseUser {
  currentLevel: LevelType;
  levelProgress: Record<LevelType, number>;
  completedLessons: string[];
  completedQuestions: Record<string, boolean>;
  scores: Record<string, number>;
  streakDays: number;
  lastStudyDate?: string;
  totalStudyTime: number;
  lastActivity?: string;
  createdAt: string;
}

// Progress tracking interface
export interface UserProgress {
  currentLevel: LevelType;
  completedLessons: string[];
  levelProgress: Record<LevelType, number>;
  completedQuestions: Record<string, boolean>;
  scores: Record<string, number>;
  streakDays: number;
  lastStudyDate?: string;
  totalStudyTime: number;
}

// User settings interface
export interface UserSettings {
  notifications: boolean;
  language: string;
  theme: "light" | "dark" | "system";
}

// Progress stats interface for dashboard
export interface ProgressStats {
  totalLessonsCompleted: number;
  currentLevelProgress: number;
  streakDays: number;
  totalStudyTime: number;
  averageScore: number;
}
