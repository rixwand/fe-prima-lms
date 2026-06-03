import { IconType } from "react-icons";

export type QuizTypeKey = "multiple-choices" | "fill-blank";
export type ChoiceTypeKey = "text" | "code" | "image";

export type RemoveQuestionParams = { id: number; fieldId?: never } | { id?: never; fieldId: string };

export type Question = {
  id?: number;
  quizType: QuizTypeKey;
  choiceType: ChoiceTypeKey;
  question: string;
  multipleAnswer: boolean;
  options: { value: string; isCorrect: boolean }[];
  durationMins: number;
  points: number;
  position: number;
};

export type QuizEditorForm = {
  questions: Question[];
};

export type SelectionKeys = "all" | Set<React.Key>;

export type QuizOption = {
  key: QuizTypeKey;
  label: string;
  icon: IconType;
};

export type ChoiceOption = {
  key: ChoiceTypeKey;
  label: string;
  icon: IconType;
};
export interface ICreateQuizOption {
  // name: string;
  value: string;
  isCorrect?: boolean;
}

export interface IUpdateQuizOption {
  id: number;
  value?: string;
  isCorrect?: boolean;
}

export interface ICreateQuestion {
  position: number;
  question: string;
  options: ICreateQuizOption[];
  estimatedTimesSecond?: number;
  points?: number;
  multipleAnswer?: boolean;
}

export interface IUpdateQestion {
  id?: number;
  position?: number;
  question?: string;
  estimatedTimesSecond?: number;
  points?: number;
  multipleAnswer?: boolean;
  options?: ICreateQuizOption[];
}

export interface IUpdateQuiz {
  description?: string;
  questions?: (ICreateQuestion | IUpdateQestion)[];
}
