// app/(tabs)/practice.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/auth";
import {
  Practice,
  getPractice,
  validateAnswers,
  savePracticeAttempt,
} from "../../types/practice";
import { progressService } from "../services/progressService";
import { Colors } from "../../constants/Colors";

interface PracticeScreenState {
  practice: Practice | null;
  userAnswers: Record<string, string>;
  loading: boolean;
  submitted: boolean;
  score: number | null;
  startTime: number;
}

export default function PracticeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [state, setState] = useState<PracticeScreenState>({
    practice: null,
    userAnswers: {},
    loading: true,
    submitted: false,
    score: null,
    startTime: Date.now(),
  });

  useEffect(() => {
    const loadPractice = async () => {
      try {
        if (id && typeof id === "string") {
          const practiceData = await getPractice(id);
          setState((prev) => ({
            ...prev,
            practice: practiceData,
            loading: false,
          }));
        }
      } catch (error) {
        console.error("Error loading practice:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadPractice();
  }, [id]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setState((prev) => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [questionId]: answer,
      },
    }));
  };

  const handleSubmit = async () => {
    const { practice, userAnswers, startTime } = state;
    if (!practice || !user) return;

    const result = validateAnswers(practice, userAnswers);
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // Convert to seconds

    setState((prev) => ({
      ...prev,
      score: result.score,
      submitted: true,
    }));

    try {
      // Save the practice attempt
      await savePracticeAttempt(
        user.uid,
        practice.id,
        userAnswers,
        result.score
      );

      // Update user progress
      await progressService.updateProgress(
        user.uid,
        practice.id,
        result.score,
        timeSpent
      );
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  if (state.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }

  if (!state.practice) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Practice not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{state.practice.title}</Text>
          <Text style={styles.subtitle}>{state.practice.description}</Text>
          <Text style={styles.levelText}>Level: {state.practice.level}</Text>
          <Text style={styles.durationText}>
            Duration: {state.practice.duration}
          </Text>
          <Text style={styles.categoryText}>
            Category: {state.practice.category}
          </Text>
        </View>

        {state.practice.questions?.map((question, index) => (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {index + 1}. {question.text}
            </Text>
            <View style={styles.optionsContainer}>
              {question.options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    state.userAnswers[question.id] === option &&
                      styles.selectedOption,
                    state.submitted &&
                      option === question.correctAnswer &&
                      styles.correctOption,
                    state.submitted &&
                      state.userAnswers[question.id] === option &&
                      option !== question.correctAnswer &&
                      styles.incorrectOption,
                  ]}
                  onPress={() =>
                    !state.submitted && handleAnswerSelect(question.id, option)
                  }
                  disabled={state.submitted}
                >
                  <Text
                    style={[
                      styles.optionText,
                      state.userAnswers[question.id] === option &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {state.submitted && question.explanation && (
              <Text style={styles.explanationText}>{question.explanation}</Text>
            )}
          </View>
        ))}

        {!state.submitted ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              Object.keys(state.userAnswers).length !==
                state.practice.questions.length && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={
              Object.keys(state.userAnswers).length !==
              state.practice.questions.length
            }
          >
            <Text style={styles.submitButtonText}>Submit Answers</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Your Score: {state.score}%</Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.back()}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textDim,
    marginTop: 4,
  },
  levelText: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 8,
    fontWeight: "500",
  },
  durationText: {
    fontSize: 14,
    color: Colors.textDim,
    marginTop: 4,
  },
  questionContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  questionText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  correctOption: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  incorrectOption: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.card,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.textDim,
    marginTop: 4,
  },
  explanationText: {
    fontSize: 14,
    color: Colors.textDim,
    marginTop: 12,
    fontStyle: "italic",
    padding: 8,
    backgroundColor: Colors.card,
    borderRadius: 4,
  },

  submitButton: {
    margin: 20,
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textDim,
  },
  submitButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreContainer: {
    padding: 20,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  continueButton: {
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  continueButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: Colors.error,
    textAlign: "center",
    marginTop: 20,
  },
});
