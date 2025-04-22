"use client";

import { QuestionCard } from "@/app/components/mbti/QuestionCard";
import { ProgressBar } from "@/app/components/mbti/ProgressBar";
import { questions } from "@/app/data/questions";
import { useMBTI } from "@/app/context/MBTIContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function QuestionsPage() {
  const router = useRouter();
  const { state } = useMBTI();
  const { currentQuestionIndex, result } = state;

  // 결과가 있으면 결과 페이지로 리다이렉트
  useEffect(() => {
    if (result) {
      router.push("/result");
    }
  }, [result, router]);

  // 인덱스가 범위를 벗어나면 첫 페이지로 리다이렉트
  useEffect(() => {
    if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) {
      router.push("/");
    }
  }, [currentQuestionIndex, router]);

  // 현재 질문 가져오기
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 space-bg">
      <div className="w-full max-w-md mx-auto">
        <ProgressBar
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
        />
      </div>
      <QuestionCard question={currentQuestion} />
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-sm">
        <p>MBTI 테스트 ✨</p>
      </div>
    </main>
  );
} 