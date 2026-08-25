type PublishedQuizData = {
  id: number;
  passingScorePercent: number;
  description: string;
  questions: PublishedQuizQuestion[];
  topics: string[];
};

type PublishedQuizQuestion = {
  id: number;
  points: number;
  position: number;
  question: string;
  multipleAnswer: boolean;
  estimatedTimesSecond: number;
  options: PublishedQuizOption[];
};

type PublishedQuizOption = {
  id: number;
  value: string;
  position: number;
};

type StartedQuizSnapshot = {
  id: number;
  quizId: number;
  publishedVersion: number;
  data: PublishedQuizData;
};

type QuizAttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "CANCELED" | "FINISHED";

interface QuizAttempt {
  id: number;
  userId: number;
  quizId: number;
  snapshotId: number;
  attemptNumber: number;
  status: QuizAttemptStatus;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string | null;
  timeSpentSecond: number;
  quizSnapshot: StartedQuizSnapshot;
}

type QuizAttemptHistoryResponse = {
  attempts: Omit<QuizAttempt, "quizSnapshot">[];
  meta: MetaData;
};

type QuizSubmissionForm = {
  answers: {
    questionId: number;
    multipleAnswer: boolean;
    selectedOptionIds: number[];
  }[];
};

interface QuizResult {
  id: number;
  quizId: number;
  snapshotId: number;
  attemptNumber: number;
  status: QuizAttemptStatus;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string;
  timeSpentSecond: number;
  quizSnapshot: StartedQuizSnapshot;
  userAnswers: UserAnswer[];
}

interface UserAnswer {
  id: number;
  attemptId: number;
  snapshotQuestionId: number;
  selectedOptionIds: number[];
  correctOptionIds: number[];
  earnedPoints: number;
}
