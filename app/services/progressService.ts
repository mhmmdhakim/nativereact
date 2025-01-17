// services/progressService.ts
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { lessons } from "../../types/lesson";
import { UserProgress, LevelType, ProgressStats } from "../../types/User";

export const progressService = {
  async getProgress(userId: string): Promise<UserProgress> {
    try {
      const progressRef = doc(db, "userProgress", userId);
      const progressDoc = await getDoc(progressRef);

      if (progressDoc.exists()) {
        return progressDoc.data() as UserProgress;
      }

      // Initialize progress for new users
      const initialProgress: UserProgress = {
        currentLevel: "beginner",
        completedLessons: [],
        levelProgress: {
          beginner: 0,
          intermediate: 0,
          advanced: 0,
        },
        scores: {},
        completedQuestions: {},
        streakDays: 0,
        totalStudyTime: 0,
      };

      // Convert to plain object before storing
      const progressData = JSON.parse(JSON.stringify(initialProgress));
      await setDoc(progressRef, progressData);
      return initialProgress;
    } catch (error) {
      console.error("Error getting progress:", error);
      throw error;
    }
  },

  async updateProgress(
    userId: string,
    lessonId: string,
    score: number,
    timeSpent: number
  ): Promise<UserProgress> {
    try {
      const progressRef = doc(db, "userProgress", userId);
      const progressDoc = await getDoc(progressRef);

      if (!progressDoc.exists()) {
        throw new Error("Progress document not found");
      }

      const currentProgress = progressDoc.data() as UserProgress;
      const [level] = lessonId.split("-") as [LevelType];

      // Update scores
      currentProgress.scores[lessonId] = score;

      // Update completed lessons if score meets requirement
      const levelData = lessons[level];
      if (score >= 70 && !currentProgress.completedLessons.includes(lessonId)) {
        currentProgress.completedLessons.push(lessonId);
      }

      // Calculate level progress
      const totalLessonsInLevel = this.countLessonsInLevel(level);
      const completedLessonsInLevel = currentProgress.completedLessons.filter(
        (id) => id.startsWith(level)
      ).length;

      currentProgress.levelProgress[level] = Math.min(
        100,
        (completedLessonsInLevel / totalLessonsInLevel) * 100
      );

      // Update study streak and time
      const today = new Date().toISOString().split("T")[0];
      if (currentProgress.lastStudyDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split("T")[0];

        if (currentProgress.lastStudyDate === yesterdayString) {
          currentProgress.streakDays += 1;
        } else {
          currentProgress.streakDays = 1;
        }
        currentProgress.lastStudyDate = today;
      }

      currentProgress.totalStudyTime += timeSpent;

      // Convert to plain object before updating
      const progressData = JSON.parse(JSON.stringify(currentProgress));
      await updateDoc(progressRef, progressData);
      return currentProgress;
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  },

  countLessonsInLevel(level: LevelType): number {
    let count = 0;
    const levelData = lessons[level];

    levelData.lessons.forEach((lesson) => {
      count += lesson.subLessons.length;
    });

    return count;
  },

  calculateProgressStats(progress: UserProgress): ProgressStats {
    const totalLessonsCompleted = progress.completedLessons.length;
    const currentLevelProgress = progress.levelProgress[progress.currentLevel];
    const scores = Object.values(progress.scores);
    const averageScore =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    return {
      totalLessonsCompleted,
      currentLevelProgress,
      streakDays: progress.streakDays,
      totalStudyTime: progress.totalStudyTime,
      averageScore,
    };
  },
};
