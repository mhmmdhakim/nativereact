// types/practice.ts
import { db } from "../app/services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Practice {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  type: "practice";
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  category: "grammar" | "vocabulary" | "reading" | "listening";
}

export interface PracticeHistory {
  attempts: PracticeAttempt[];
  lastAttempt: string;
  bestScore: number;
}

export interface PracticeAttempt {
  practiceId: string;
  userId: string;
  answers: Record<string, string>;
  score: number;
  timestamp: string;
  attemptNumber: number;
}

export interface ValidationResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
}

export const practiceData: Practice[] = [
  {
    id: "english-beginner-grammar",
    title: "Basic English Grammar",
    description:
      "Practice basic English grammar including simple present tense and articles",
    type: "practice",
    duration: "15 minutes",
    level: "beginner",
    category: "grammar",
    questions: [
      {
        id: "beg-g1",
        text: "Choose the correct form of the verb: She ____ to school every day.",
        options: ["go", "goes", "going", "went"],
        correctAnswer: "goes",
        explanation:
          "With third-person singular (he/she/it), we add 's' to the base form of the verb in simple present tense.",
      },
      {
        id: "beg-g2",
        text: "Select the correct article: I saw ____ elephant at the zoo.",
        options: ["a", "an", "the", "no article"],
        correctAnswer: "an",
        explanation: "We use 'an' before words that begin with vowel sounds.",
      },
      {
        id: "beg-g3",
        text: "Complete the sentence: ____ books are on the table.",
        options: ["This", "That", "These", "It"],
        correctAnswer: "These",
        explanation:
          "'These' is used for plural objects that are near to the speaker.",
      },
    ],
  },
  {
    id: "english-intermediate-vocabulary",
    title: "Intermediate Vocabulary",
    description:
      "Enhance your vocabulary with common English words and phrases",
    type: "practice",
    duration: "20 minutes",
    level: "intermediate",
    category: "vocabulary",
    questions: [
      {
        id: "int-v1",
        text: "What is the opposite of 'generous'?",
        options: ["stingy", "wealthy", "kind", "giving"],
        correctAnswer: "stingy",
        explanation:
          "The antonym of 'generous' is 'stingy', meaning someone who doesn't like to spend or give.",
      },
      {
        id: "int-v2",
        text: "Choose the best synonym for 'essential':",
        options: ["necessary", "optional", "extra", "fancy"],
        correctAnswer: "necessary",
        explanation:
          "'Essential' means absolutely necessary or extremely important.",
      },
      {
        id: "int-v3",
        text: "Complete the idiom: 'It's raining cats and ____'",
        options: ["dogs", "birds", "fish", "mice"],
        correctAnswer: "dogs",
        explanation:
          "'It's raining cats and dogs' is an idiom meaning it's raining very heavily.",
      },
    ],
  },
  {
    id: "english-advanced-reading",
    title: "Advanced Reading Comprehension",
    description: "Practice understanding complex texts and passages",
    type: "practice",
    duration: "30 minutes",
    level: "advanced",
    category: "reading",
    questions: [
      {
        id: "adv-r1",
        text: `Read the passage:
        
Climate change poses one of the most significant challenges to our planet's ecosystems. While some argue that climate variations are natural phenomena, the rapid rate of current changes suggests human influence. Scientists have observed unprecedented rises in global temperatures over the past century.

What is the main idea of this passage?`,
        options: [
          "Natural climate variations are normal",
          "The current pace of climate change indicates human impact",
          "Scientists study global temperatures",
          "Ecosystems are changing",
        ],
        correctAnswer:
          "The current pace of climate change indicates human impact",
        explanation:
          "The passage emphasizes that while climate change can be natural, the current rapid rate suggests human influence.",
      },
      {
        id: "adv-r2",
        text: `Read the passage:
        
The Renaissance was a period of great cultural and artistic revival in Europe. Beginning in Italy in the late 14th century, it spread throughout Europe during the 15th and 16th centuries. This period marked a transition from medieval to modern times.

When did the Renaissance begin?`,
        options: [
          "In the 15th century",
          "In the 16th century",
          "In the late 14th century",
          "In medieval times",
        ],
        correctAnswer: "In the late 14th century",
        explanation:
          "The passage clearly states that the Renaissance began in Italy in the late 14th century.",
      },
      {
        id: "adv-r3",
        text: `Read the passage:
        
Artificial Intelligence has revolutionized many industries, from healthcare to transportation. However, its rapid advancement raises ethical concerns about privacy, job displacement, and decision-making autonomy.

What is the main concern mentioned about AI?`,
        options: [
          "Its cost",
          "Its complexity",
          "Its ethical implications",
          "Its effectiveness",
        ],
        correctAnswer: "Its ethical implications",
        explanation:
          "The passage highlights ethical concerns as the main issue, specifically mentioning privacy, jobs, and autonomy.",
      },
    ],
  },
  {
    id: "english-beginner-listening",
    title: "Basic Listening Practice",
    description:
      "Practice understanding common English phrases and conversations",
    type: "practice",
    duration: "15 minutes",
    level: "beginner",
    category: "listening",
    questions: [
      {
        id: "beg-l1",
        text: "In the phrase 'How are you?', what is the appropriate response?",
        options: [
          "I'm fine, thank you",
          "My name is John",
          "It's Monday",
          "Good night",
        ],
        correctAnswer: "I'm fine, thank you",
        explanation:
          "'How are you?' is a greeting asking about someone's wellbeing. 'I'm fine, thank you' is a common response.",
      },
      {
        id: "beg-l2",
        text: "What's the correct response to 'Nice to meet you'?",
        options: [
          "Nice to meet you too",
          "You're welcome",
          "Good morning",
          "Goodbye",
        ],
        correctAnswer: "Nice to meet you too",
        explanation:
          "When someone says 'Nice to meet you', the polite response is 'Nice to meet you too'.",
      },
      {
        id: "beg-l3",
        text: "What does 'Could you repeat that?' mean?",
        options: [
          "Please say it again",
          "Please leave",
          "Thank you",
          "Goodbye",
        ],
        correctAnswer: "Please say it again",
        explanation:
          "'Could you repeat that?' is a polite way to ask someone to say something again when you didn't hear or understand.",
      },
    ],
  },
];

// Practice functions
export const getPractice = async (practiceId: string): Promise<Practice> => {
  const practice = practiceData.find((p) => p.id === practiceId);
  if (!practice) {
    throw new Error("Practice not found");
  }
  return practice;
};

export const getUserPracticeHistory = async (
  userId: string,
  practiceId: string
): Promise<PracticeHistory | null> => {
  try {
    const practiceHistoryRef = doc(
      db,
      "practiceHistory",
      `${userId}_${practiceId}`
    );
    const practiceHistoryDoc = await getDoc(practiceHistoryRef);

    if (practiceHistoryDoc.exists()) {
      return practiceHistoryDoc.data() as PracticeHistory;
    }
    return null;
  } catch (error) {
    console.error("Error getting practice history:", error);
    throw error;
  }
};

export const savePracticeAttempt = async (
  userId: string,
  practiceId: string,
  answers: Record<string, string>,
  score: number
): Promise<PracticeAttempt> => {
  try {
    const practiceHistoryRef = doc(
      db,
      "practiceHistory",
      `${userId}_${practiceId}`
    );
    const timestamp = new Date().toISOString();

    const attemptData: PracticeAttempt = {
      practiceId,
      userId,
      answers,
      score,
      timestamp,
      attemptNumber: 1,
    };

    const existingHistory = await getDoc(practiceHistoryRef);
    if (existingHistory.exists()) {
      const currentHistory = existingHistory.data() as PracticeHistory;
      attemptData.attemptNumber = (currentHistory.attempts?.length || 0) + 1;

      await updateDoc(practiceHistoryRef, {
        attempts: [...(currentHistory.attempts || []), attemptData],
        lastAttempt: timestamp,
        bestScore: Math.max(currentHistory.bestScore || 0, score),
      });
    } else {
      await setDoc(practiceHistoryRef, {
        attempts: [attemptData],
        lastAttempt: timestamp,
        bestScore: score,
      });
    }

    return attemptData;
  } catch (error) {
    console.error("Error saving practice attempt:", error);
    throw error;
  }
};

export const validateAnswers = (
  practice: Practice,
  userAnswers: Record<string, string>
): ValidationResult => {
  const questions = practice.questions;
  let correctCount = 0;

  questions.forEach((question) => {
    if (userAnswers[question.id] === question.correctAnswer) {
      correctCount++;
    }
  });

  return {
    score: Math.round((correctCount / questions.length) * 100),
    correctCount,
    totalQuestions: questions.length,
  };
};
