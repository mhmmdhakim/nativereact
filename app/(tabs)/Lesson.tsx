import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router"; // Pastikan versi terbaru digunakan
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import { lessons } from "../../types/lesson";
import { Colors } from "../../constants/Colors";

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const [currentLesson, setCurrentLesson] = useState<any>(null);

  useEffect(() => {
    if (lessonId) {
      for (const level of Object.values(lessons)) {
        for (const lesson of level.lessons) {
          const foundSubLesson = lesson.subLessons.find(
            (sub) => sub.id === lessonId
          );
          if (foundSubLesson) {
            setCurrentLesson(foundSubLesson);
            break;
          }
        }
      }
    }
  }, [lessonId]);

  const handleAnswerSelection = (questionId: string, option: string) => {
    console.log(`Question ID: ${questionId}, Selected Option: ${option}`);
  };

  if (!currentLesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text>Loading lesson...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{currentLesson.title}</Text>
          <View style={styles.metaInfo}>
            <Text style={styles.duration}>{currentLesson.duration}</Text>
            <Text
              style={[
                styles.type,
                {
                  backgroundColor:
                    currentLesson.type === "theory"
                      ? Colors.primary
                      : Colors.secondary,
                },
              ]}
            >
              {currentLesson.type}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Markdown style={markdownStyles}>{currentLesson.content}</Markdown>
        </View>

        {currentLesson.questions && (
          <View style={styles.questionsSection}>
            <Text style={styles.questionsSectionTitle}>Practice Questions</Text>
            {currentLesson.questions.map((question: any) => (
              <View key={question.id} style={styles.questionCard}>
                <Text style={styles.questionText}>{question.text}</Text>
                {question.options.map((option: string) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.optionButton}
                    onPress={() => handleAnswerSelection(question.id, option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
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
  scrollView: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  duration: {
    fontSize: 14,
    color: Colors.textDim,
  },
  type: {
    fontSize: 12,
    color: Colors.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  content: {
    padding: 20,
  },
  questionsSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  questionsSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.text,
  },
  questionCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 12,
    color: Colors.text,
  },
  optionButton: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
  },
});

const markdownStyles = {
  body: {
    color: Colors.text,
  },
  heading1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.text,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
    color: Colors.text,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    color: Colors.text,
  },
  list: {
    marginBottom: 12,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
};
