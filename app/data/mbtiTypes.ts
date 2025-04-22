import { MBTIResult } from "../types";

export const mbtiResults: Record<string, MBTIResult> = {
  "ISTJ": {
    type: "ISTJ",
    description: "진지하고 조용하며 현실적인 성격으로, 책임감과 인내력이 강한 관리자형 성격입니다.",
    compatibleTypes: ["ESTP", "ESFP"]
  },
  "ISFJ": {
    type: "ISFJ",
    description: "조용하고 우호적이며 책임감이 강하고 양심적인 보호자형 성격입니다.",
    compatibleTypes: ["ESFP", "ESTP"]
  },
  "INFJ": {
    type: "INFJ",
    description: "이상주의적이고 통찰력이 뛰어나며 창의적인 옹호자형 성격입니다.",
    compatibleTypes: ["ENFP", "ENTP"]
  },
  "INTJ": {
    type: "INTJ",
    description: "독창적인 사고를 가진 전략가형으로, 지식을 추구하며 높은 기준을 가진 성격입니다.",
    compatibleTypes: ["ENFP", "ENTP"]
  },
  "ISTP": {
    type: "ISTP",
    description: "논리적이고 실용적인 장인형 성격으로, 문제 해결에 능숙합니다.",
    compatibleTypes: ["ESFJ", "ESTJ"]
  },
  "ISFP": {
    type: "ISFP",
    description: "조용하고 친절하며 예술적 감각이 뛰어난 예술가형 성격입니다.",
    compatibleTypes: ["ESTJ", "ESFJ"]
  },
  "INFP": {
    type: "INFP",
    description: "이상주의적이고 충실하며 자신의 가치에 따라 행동하는 중재자형 성격입니다.",
    compatibleTypes: ["ENTJ", "ENFJ"]
  },
  "INTP": {
    type: "INTP",
    description: "논리적이고 창의적인 사색가형 성격으로, 지적 호기심이 강합니다.",
    compatibleTypes: ["ENTJ", "ENFJ"]
  },
  "ESTP": {
    type: "ESTP",
    description: "활동적이고 적응력이 강한 사업가형 성격으로, 현실적이고 실용적입니다.",
    compatibleTypes: ["ISFJ", "ISTJ"]
  },
  "ESFP": {
    type: "ESFP",
    description: "자유롭고 친절한 연예인형 성격으로, 현재의 즐거움을 추구합니다.",
    compatibleTypes: ["ISTJ", "ISFJ"]
  },
  "ENFP": {
    type: "ENFP",
    description: "열정적이고 창의적인 활동가형 성격으로, 새로운 가능성을 탐색합니다.",
    compatibleTypes: ["INTJ", "INFJ"]
  },
  "ENTP": {
    type: "ENTP",
    description: "창의적이고 논쟁을 좋아하는 변론가형 성격으로, 지적 도전을 추구합니다.",
    compatibleTypes: ["INFJ", "INTJ"]
  },
  "ESTJ": {
    type: "ESTJ",
    description: "체계적이고 관리를 잘하는 경영자형 성격으로, 책임감이 강합니다.",
    compatibleTypes: ["ISFP", "ISTP"]
  },
  "ESFJ": {
    type: "ESFJ",
    description: "친절하고 사교적인 집정관형 성격으로, 타인을 돕고 배려합니다.",
    compatibleTypes: ["ISTP", "ISFP"]
  },
  "ENFJ": {
    type: "ENFJ",
    description: "카리스마 있고 이타적인 지도자형 성격으로, 타인의 성장을 돕습니다.",
    compatibleTypes: ["INFP", "INTP"]
  },
  "ENTJ": {
    type: "ENTJ",
    description: "대담하고 결단력 있는 지휘관형 성격으로, 효율적인 계획을 세웁니다.",
    compatibleTypes: ["INTP", "INFP"]
  }
}; 