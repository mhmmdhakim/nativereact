import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import Navbar from "../../components/Navbar";
import { progressService } from "../services/progressService";
import { UserProgress, ProgressStats } from "../../types/User";
import { Feather } from "@expo/vector-icons";
import { lessons } from "../../types/lesson";
import { practiceData, Practice } from "../../types/practice";

// Components
const StatCard = ({
  title,
  value,
  icon,
  unit = "",
}: {
  title: string;
  value: number | string;
  icon: keyof (typeof Feather)["glyphMap"];
  unit?: string;
}) => (
  <View style={styles.statCard}>
    <Feather name={icon} size={24} color={Colors.primary} />
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>
      {value}
      {unit}
    </Text>
  </View>
);

const PracticeCard = ({
  practice,
  onPress,
}: {
  practice: Practice;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.practiceCard} onPress={onPress}>
    <View style={styles.practiceHeader}>
      <Text style={styles.practiceTitle}>{practice.title}</Text>
      <Text style={styles.levelBadge}>{practice.level}</Text>
    </View>
    <Text style={styles.practiceDescription}>{practice.description}</Text>
    <Text style={styles.practiceInfo}>Duration: {practice.duration}</Text>
  </TouchableOpacity>
);

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (user?.uid) {
        setLoading(true);
        try {
          const userProgress = await progressService.getProgress(user.uid);
          setProgress(userProgress);
          setStats(progressService.calculateProgressStats(userProgress));
        } catch (error) {
          console.error("Error loading progress:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProgress();
  }, [user]);

  if (loading || !progress || !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }

  // Filter practices based on user's current level
  const availablePractices = practiceData.filter(
    (practice) => practice.level === progress.currentLevel
  );

  const handlePracticeNavigation = (practiceId: string) => {
    router.push(`/(tabs)/Practice?id=${practiceId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title='Study Streak'
            value={progress.streakDays}
            icon='calendar'
            unit=' days'
          />
          <StatCard
            title='Completed'
            value={stats.totalLessonsCompleted}
            icon='check-circle'
          />
          <StatCard
            title='Average Score'
            value={Math.round(stats.averageScore)}
            icon='award'
            unit='%'
          />
          <StatCard
            title='Total Time'
            value={Math.round(stats.totalStudyTime / 60)}
            icon='clock'
            unit='h'
          />
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Current Level Progress</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress.levelProgress[progress.currentLevel]}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress.levelProgress[progress.currentLevel])}%
            Complete
          </Text>
        </View>

        <View style={styles.practiceSection}>
          <Text style={styles.sectionTitle}>Available Practice</Text>
          {availablePractices.map((practice) => (
            <PracticeCard
              key={practice.id}
              practice={practice}
              onPress={() => handlePracticeNavigation(practice.id)}
            />
          ))}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.push("/(tabs)/Lesson")}
          >
            <Feather name='play-circle' size={24} color={Colors.card} />
            <Text style={styles.continueButtonText}>Continue Learning</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.textDim,
  },
  emailText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 16,
    alignItems: "center",
  },
  statTitle: {
    fontSize: 14,
    color: Colors.textDim,
    marginTop: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 4,
  },
  progressSection: {
    padding: 20,
  },
  practiceInfo: {
    fontSize: 12,
    color: Colors.textDim,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textDim,
  },
  practiceSection: {
    padding: 20,
  },
  practiceCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  practiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  practiceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  levelBadge: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },
  practiceDescription: {
    fontSize: 14,
    color: Colors.textDim,
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: "600",
  },
});
