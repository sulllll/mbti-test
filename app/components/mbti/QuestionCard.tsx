"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Button } from "@/app/components/ui/button";
import { Question } from "@/app/data/questions";
import { useMBTI } from "@/app/context/MBTIContext";
import Link from "next/link";
import { useEffect, useState } from "react";

type QuestionCardProps = {
  question: Question;
};

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const { state, answerQuestion, nextQuestion, calculateResult } = useMBTI();
  const { currentQuestionIndex, answers } = state;
  const [resultCalculated, setResultCalculated] = useState(false);

  const handleOptionSelect = (optionIndex: string) => {
    answerQuestion(currentQuestionIndex, parseInt(optionIndex));
  };

  const handleNextClick = () => {
    if (currentQuestionIndex === 11) {
      calculateResult();
      setResultCalculated(true);
    } else {
      nextQuestion();
    }
  };

  const isLastQuestion = currentQuestionIndex === 11;
  const selectedOption = answers[currentQuestionIndex];

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">질문 {question.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium mb-4">{question.text}</div>

        <RadioGroup
          value={selectedOption === -1 ? undefined : selectedOption.toString()}
          onValueChange={handleOptionSelect}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <label
              key={index}
              htmlFor={`option-${index}`}
              className={`radio-option ${selectedOption === index ? 'selected' : ''}`}
            >
              <RadioGroupItem 
                value={index.toString()} 
                id={`option-${index}`} 
                className="mr-3"
              />
              <span className="flex-1 text-sm">
                {option}
              </span>
            </label>
          ))}
        </RadioGroup>

        {resultCalculated && isLastQuestion ? (
          <Link href="/result" className="block w-full">
            <Button className="w-full mt-6 py-6 text-lg">
              결과 보기
            </Button>
          </Link>
        ) : (
          <Button
            onClick={handleNextClick}
            disabled={selectedOption === -1}
            className="w-full mt-6 py-6 text-lg"
          >
            {isLastQuestion ? "결과 계산하기" : "다음 질문"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}; 