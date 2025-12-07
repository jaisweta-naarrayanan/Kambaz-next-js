export interface Assignment {
  _id: string;
  title: string;
  course: string;
  description: string;
  points: number;
  availableFrom: string;
  dueDate: string;
}

export interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department: string;
  credits: number;
  description: string;
  author?: string;
  image?: string;
}

export interface Module {
  _id: string;
  name: string;
  description: string;
  course: string;
  lessons?: any[];
}

export interface User {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: string;
  loginId: string;
  section: string;
  lastActivity: string;
  totalActivity: string;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  course: string;
  quizType: "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey";
  points: number;
  assignmentGroup: "Quizzes" | "Exams" | "Assignments" | "Project";
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: string;
  showCorrectAnswersDate?: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate: string;
  availableDate: string;
  availableUntilDate: string;
  published: boolean;
}

export interface Question {
  _id: string;
  quiz: string;
  title: string;
  type: "Multiple Choice" | "True/False" | "Fill in the Blank";
  points: number;
  question: string;
  // Multiple Choice fields
  choices?: string[];
  correctAnswer?: number | boolean; // index for MC, boolean for T/F
  // Fill in the Blank fields
  possibleAnswers?: string[];
  caseSensitive?: boolean;
}

export interface QuizAttempt {
  _id: string;
  quiz: string;
  student: string;
  answers: {
    questionId: string;
    answer: number | boolean | string;
  }[];
  score: number;
  attemptNumber: number;
  submittedAt: string;
}


