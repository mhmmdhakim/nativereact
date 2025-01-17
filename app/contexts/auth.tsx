import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { User } from "../../types/User";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useProtectedRoute(user: User | null, loading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, segments, loading]);
}

async function initializeUserProgress(userId: string) {
  const progressRef = doc(db, "userProgress", userId);
  const progressDoc = await getDoc(progressRef);

  if (!progressDoc.exists()) {
    const initialProgress = {
      currentLevel: "beginner",
      levelProgress: {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
      },
      completedLessons: [],
      completedQuestions: {},
      scores: {},
      streakDays: 0,
      totalStudyTime: 0,
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(progressRef, initialProgress);
    } catch (error) {
      console.error("Error initializing user progress:", error);
      throw error;
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useProtectedRoute(user, loading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Initialize progress document if it doesn't exist
          await initializeUserProgress(firebaseUser.uid);

          // Get the progress document
          const progressRef = doc(db, "userProgress", firebaseUser.uid);
          const progressDoc = await getDoc(progressRef);
          const progressData = progressDoc.exists() ? progressDoc.data() : null;

          // Create a properly typed User object
          const userWithExtra: User = {
            ...firebaseUser, // Base Firebase user data
            currentLevel: progressData?.currentLevel ?? "beginner",
            levelProgress: progressData?.levelProgress ?? {
              beginner: 0,
              intermediate: 0,
              advanced: 0,
            },
            completedLessons: progressData?.completedLessons ?? [],
            completedQuestions: progressData?.completedQuestions ?? {},
            scores: progressData?.scores ?? {},
            streakDays: progressData?.streakDays ?? 0,
            totalStudyTime: progressData?.totalStudyTime ?? 0,
            lastActivity: new Date().toISOString(),
            createdAt: progressData?.createdAt ?? new Date().toISOString(),
          };

          setUser(userWithExtra);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  if (loading) {
    return null; // Or a loading spinner component
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
