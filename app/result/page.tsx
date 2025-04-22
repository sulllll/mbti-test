"use client";

import { ResultCard } from "@/app/components/mbti/ResultCard";
import { useMBTI } from "@/app/context/MBTIContext";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function ResultPage() {
  const { state } = useMBTI();
  const { result } = state;

  // 결과가 없으면 첫 페이지로 리다이렉트
  useEffect(() => {
    if (!result) {
      window.location.href = "/";
    }
  }, [result]);

  if (!result) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 space-bg">
      <ResultCard />
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-sm">
        <p>MBTI 테스트 ✨</p>
      </div>
    </main>
  );
} 