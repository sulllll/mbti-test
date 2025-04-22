# MBTI 검사기

Next.js, TypeScript, TailwindCSS, Shadcn/UI를 활용한 간단한 MBTI 검사 애플리케이션입니다.

## 기능 소개

- 12개의 객관식 문항을 통해 사용자의 MBTI 유형을 검사합니다.
- 각 문항은 4개의 선택지가 있으며, MBTI 네 가지 지표(E/I, S/N, T/F, J/P)에 영향을 줍니다.
- 모든 질문에 응답하면 MBTI 결과를 계산하여 보여줍니다.
- 결과 페이지에서 해당 MBTI 유형의 설명과 궁합이 잘 맞는 유형 정보를 제공합니다.

## 기술 스택

- Next.js 14
- TypeScript
- TailwindCSS
- Shadcn/UI
- Context API (상태 관리)

## 설치 및 실행 방법

1. 패키지 설치

```bash
npm install
# 또는
yarn install
```

2. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

3. 브라우저에서 접속

```
http://localhost:3000
```

## 프로젝트 구조

- `/app/components/mbti` - MBTI 관련 컴포넌트
- `/app/components/ui` - Shadcn UI 컴포넌트
- `/app/context` - Context API 관련 파일
- `/app/data` - 질문 및 MBTI 유형 데이터
- `/app` - 페이지 파일 