"use client";

import { Progress } from "@/app/components/ui/progress";

type ProgressBarProps = {
  currentQuestionIndex: number;
  totalQuestions: number;
};

export const ProgressBar = ({
  currentQuestionIndex,
  totalQuestions,
}: ProgressBarProps) => {
  const progress = (currentQuestionIndex / totalQuestions) * 100;

  return (
    <div className="w-full space-y-3 mb-4">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-foreground/80">
          {currentQuestionIndex === totalQuestions
            ? "완료!"
            : `${currentQuestionIndex}/${totalQuestions} 문항`}
        </span>
        <span className="text-sm font-medium text-foreground/90">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-bar-indicator"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}; 