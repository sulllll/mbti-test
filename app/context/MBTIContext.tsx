"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { mbtiResults } from "../data/mbtiTypes";
import { MBTIType } from "../types";

// 상태 타입 정의
type MBTIState = {
  currentQuestionIndex: number;
  answers: number[];
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  result: string | null;
};

// 액션 타입 정의
type MBTIAction =
  | { type: "ANSWER_QUESTION"; questionIndex: number; answerIndex: number }
  | { type: "NEXT_QUESTION" }
  | { type: "CALCULATE_RESULT" }
  | { type: "RESET" };

// 초기 상태
const initialState: MBTIState = {
  currentQuestionIndex: 0,
  answers: Array(12).fill(-1),
  scores: {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  },
  result: null,
};

// 리듀서 함수
const mbtiReducer = (state: MBTIState, action: MBTIAction): MBTIState => {
  switch (action.type) {
    case "ANSWER_QUESTION": {
      const newAnswers = [...state.answers];
      newAnswers[action.questionIndex] = action.answerIndex;

      // 점수 계산 로직
      const newScores = { ...state.scores };
      const questionType = getQuestionType(action.questionIndex);
      
      // 응답에 따른 점수 업데이트
      if (questionType === "EI") {
        if (action.answerIndex === 0 || action.answerIndex === 1) {
          newScores.E += 1;
        } else {
          newScores.I += 1;
        }
      } else if (questionType === "SN") {
        if (action.answerIndex === 0 || action.answerIndex === 2) {
          newScores.S += 1;
        } else {
          newScores.N += 1;
        }
      } else if (questionType === "TF") {
        if (action.answerIndex === 0 || action.answerIndex === 2) {
          newScores.T += 1;
        } else {
          newScores.F += 1;
        }
      } else if (questionType === "JP") {
        if (action.answerIndex === 0 || action.answerIndex === 2) {
          newScores.J += 1;
        } else {
          newScores.P += 1;
        }
      }

      return {
        ...state,
        answers: newAnswers,
        scores: newScores,
      };
    }
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };
    case "CALCULATE_RESULT": {
      const { scores } = state;
      const result = [
        scores.E > scores.I ? "E" : "I",
        scores.S > scores.N ? "S" : "N",
        scores.T > scores.F ? "T" : "F",
        scores.J > scores.P ? "J" : "P",
      ].join("");

      return {
        ...state,
        result,
      };
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

// 질문 유형 가져오기 함수
const getQuestionType = (questionIndex: number): MBTIType => {
  const types: MBTIType[] = ["EI", "TF", "SN", "JP", "EI", "SN", "TF", "JP", "EI", "SN", "TF", "JP"];
  return types[questionIndex];
};

// 컨텍스트 타입 정의
type MBTIContextType = {
  state: MBTIState;
  answerQuestion: (questionIndex: number, answerIndex: number) => void;
  nextQuestion: () => void;
  calculateResult: () => void;
  resetTest: () => void;
};

// 컨텍스트 생성
const MBTIContext = createContext<MBTIContextType | undefined>(undefined);

// 컨텍스트 프로바이더 컴포넌트
export const MBTIProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(mbtiReducer, initialState);

  const answerQuestion = (questionIndex: number, answerIndex: number) => {
    dispatch({ type: "ANSWER_QUESTION", questionIndex, answerIndex });
  };

  const nextQuestion = () => {
    dispatch({ type: "NEXT_QUESTION" });
  };

  const calculateResult = () => {
    dispatch({ type: "CALCULATE_RESULT" });
  };

  const resetTest = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <MBTIContext.Provider
      value={{
        state,
        answerQuestion,
        nextQuestion,
        calculateResult,
        resetTest,
      }}
    >
      {children}
    </MBTIContext.Provider>
  );
};

// 컨텍스트 사용을 위한 훅
export const useMBTI = (): MBTIContextType => {
  const context = useContext(MBTIContext);
  if (context === undefined) {
    throw new Error("useMBTI must be used within an MBTIProvider");
  }
  return context;
};

// MBTI 결과 정보 가져오기 함수
export const getMBTIResult = (type: string | null) => {
  if (!type) return null;
  return mbtiResults[type] || null;
}; 