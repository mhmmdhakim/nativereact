// types/lesson.ts
export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "theory" | "practice";
  description?: string;
  subLessons: SubLesson[];
}

export interface SubLesson {
  id: string;
  title: string;
  duration: string;
  type: "theory" | "practice";
  content: string;
  questions?: Question[];
  prerequisites?: string[]; // IDs of lessons that must be completed first
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface LevelData {
  title: string;
  description: string;
  requiredScore: number; // Score needed to progress to next level
  lessons: Lesson[];
}

export const lessons: Record<string, LevelData> = {
  beginner: {
    title: "Beginner Level",
    description: "Master the fundamentals and build a strong foundation",
    requiredScore: 70,
    lessons: [
      {
        id: "basic-1",
        title: "Getting Started with English",
        duration: "45 min",
        type: "theory",
        description:
          "Learn essential English concepts for everyday communication",
        subLessons: [
          {
            id: "basic-1-1",
            title: "Introduction to English Basics",
            duration: "20 min",
            type: "theory",
            content: `# Introduction to English Basics

## Key Components of English
1. Alphabet and Pronunciation
- 26 letters (A-Z)
- Basic phonetic sounds
- Vowels and consonants

2. Basic Grammar Structure
- Subject + Verb + Object
- Simple present tense
- Personal pronouns (I, you, he, she, it, we, they)

3. Essential Vocabulary
- Common greetings
- Numbers 1-100
- Days of the week
- Months of the year

## Common Greetings
- Hello / Hi
- Good morning
- Good afternoon
- Good evening
- Goodbye / Bye
- How are you?
- Nice to meet you`,
            questions: [
              {
                id: "b1-q1",
                text: "Which of these is NOT a personal pronoun?",
                options: ["He", "She", "They", "Where"],
                correctAnswer: "Where",
                explanation:
                  "'Where' is an interrogative word, not a personal pronoun. Personal pronouns include he, she, it, they, we, you, and I.",
              },
              {
                id: "b1-q2",
                text: "What is the correct response to 'How are you?'",
                options: [
                  "Good morning",
                  "I'm fine, thank you",
                  "Nice to meet you",
                  "Goodbye",
                ],
                correctAnswer: "I'm fine, thank you",
                explanation:
                  "When someone asks 'How are you?', the appropriate response is to tell them how you're feeling, commonly 'I'm fine, thank you' or 'I'm good, thanks.'",
              },
            ],
          },
          {
            id: "basic-1-2",
            title: "Simple Present Tense",
            duration: "25 min",
            type: "practice",
            content: `# Simple Present Tense

The simple present tense is used to:
- Express habits or routines
- State facts or general truths
- Describe feelings and emotions
- Give instructions

## Rules:
1. Basic form: Subject + Verb
2. Add 's' or 'es' to verb for he/she/it
3. Use 'do/does' for questions
4. Use 'don't/doesn't' for negatives

## Examples:
- I work every day
- She works in a hospital
- They play tennis
- The sun rises in the east`,
            questions: [
              {
                id: "b1-p1",
                text: "Complete the sentence: He ____ (go) to school every day.",
                options: ["go", "goes", "going", "went"],
                correctAnswer: "goes",
                explanation:
                  "With third-person singular (he/she/it), we add 's' to the base form of the verb in simple present tense.",
              },
              {
                id: "b1-p2",
                text: "Which sentence is correct?",
                options: [
                  "They plays football",
                  "She play tennis",
                  "I watches TV",
                  "We watch movies",
                ],
                correctAnswer: "We watch movies",
                explanation:
                  "Only third-person singular (he/she/it) needs 's' added to the verb. Other subjects use the base form of the verb.",
              },
            ],
          },
        ],
      },
      {
        id: "basic-2",
        title: "Numbers and Basic Math",
        duration: "60 min",
        type: "theory",
        description: "Learn to count and perform basic calculations in English",
        subLessons: [
          {
            id: "basic-2-1",
            title: "Numbers 1-100",
            duration: "30 min",
            type: "theory",
            content: `# Numbers in English

## Cardinal Numbers (1-100)
1. One to Ten
- 1 - One
- 2 - Two
- 3 - Three
- 4 - Four
- 5 - Five
- 6 - Six
- 7 - Seven
- 8 - Eight
- 9 - Nine
- 10 - Ten

2. Special Numbers (11-20)
- 11 - Eleven
- 12 - Twelve
- 13 - Thirteen
- 14 - Fourteen
- 15 - Fifteen

3. Tens
- 20 - Twenty
- 30 - Thirty
- 40 - Forty
- 50 - Fifty
- 60 - Sixty
- 70 - Seventy
- 80 - Eighty
- 90 - Ninety
- 100 - One hundred`,
            prerequisites: ["basic-1-1"],
            questions: [
              {
                id: "b2-q1",
                text: "How do you write '45' in words?",
                options: [
                  "Fourty five",
                  "Forty five",
                  "Fourtyfive",
                  "Four five",
                ],
                correctAnswer: "Forty five",
                explanation:
                  "Numbers from 21-99 are written with a hyphen: forty-five. However, both 'forty five' and 'forty-five' are commonly used.",
              },
            ],
          },
        ],
      },
    ],
  },
  intermediate: {
    title: "Intermediate Level",
    description: "Advance your skills with more complex topics",
    requiredScore: 75,
    lessons: [
      {
        id: "inter-1",
        title: "Past and Future Tenses",
        duration: "90 min",
        type: "theory",
        description: "Master different time expressions in English",
        subLessons: [
          {
            id: "inter-1-1",
            title: "Simple Past Tense",
            duration: "45 min",
            type: "theory",
            content: `# Simple Past Tense

The simple past tense is used to:
- Talk about completed actions
- Describe past states or conditions
- Tell stories or narrate events

## Regular Verbs
- Add '-ed' to base form
- Example: walk → walked

## Irregular Verbs
Common irregular verbs:
- go → went
- see → saw
- eat → ate
- drink → drank
- write → wrote

## Time Expressions
- yesterday
- last week/month/year
- ago
- in (past year)`,
            prerequisites: ["basic-2-1"],
            questions: [
              {
                id: "i1-q1",
                text: "Choose the correct past tense: They ____ to the park yesterday.",
                options: ["go", "went", "gone", "going"],
                correctAnswer: "went",
                explanation:
                  "'Go' is an irregular verb. Its past tense form is 'went'.",
              },
            ],
          },
        ],
      },
    ],
  },
  advanced: {
    title: "Advanced Level",
    description: "Master complex concepts and real-world applications",
    requiredScore: 80,
    lessons: [
      {
        id: "adv-1",
        title: "Complex Grammar Structures",
        duration: "120 min",
        type: "theory",
        description: "Master advanced English grammar concepts",
        subLessons: [
          {
            id: "adv-1-1",
            title: "Conditionals",
            duration: "60 min",
            type: "theory",
            content: `# Conditional Sentences

Conditional sentences express the relationship between two events.

## Types of Conditionals

1. Zero Conditional
- For general truths
- If + present simple, present simple
- Example: If you heat water to 100°C, it boils.

2. First Conditional
- For possible future situations
- If + present simple, will + infinitive
- Example: If it rains tomorrow, I will stay home.

3. Second Conditional
- For unlikely or imaginary situations
- If + past simple, would + infinitive
- Example: If I won the lottery, I would travel the world.

4. Third Conditional
- For impossible past situations
- If + past perfect, would have + past participle
- Example: If I had studied harder, I would have passed the exam.`,
            prerequisites: ["inter-1-1"],
            questions: [
              {
                id: "a1-q1",
                text: "Which conditional is used for general truths?",
                options: [
                  "Zero conditional",
                  "First conditional",
                  "Second conditional",
                  "Third conditional",
                ],
                correctAnswer: "Zero conditional",
                explanation:
                  "The zero conditional (If + present simple, present simple) is used to express general truths or scientific facts.",
              },
            ],
          },
        ],
      },
    ],
  },
};
