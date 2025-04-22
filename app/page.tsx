"use client";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 space-bg">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">MBTI 성격 유형 검사</CardTitle>
          <CardDescription className="mt-2">
            12개의 질문으로 알아보는 나의 MBTI 유형
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            MBTI 검사는 개인의 성격 유형을 16가지로 분류하는 검사입니다. 
            이 간단한 테스트로 자신의 성격 유형을 알아보세요.
          </p>
          <p>
            각 질문에 대해 본인과 가장 가까운 답변을 선택해주세요. 
            정답은 없으며, 솔직하게 응답할수록 정확한 결과를 얻을 수 있습니다.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/questions" className="w-full">
            <Button className="w-full py-6 text-lg">
              테스트 시작하기
            </Button>
          </Link>
        </CardFooter>
      </Card>
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-sm">
        <p>MBTI 테스트 ✨</p>
      </div>
    </main>
  );
} 