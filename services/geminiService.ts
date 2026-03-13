
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";
import { 
  HOSPITAL_INFO, 
  DOCTORS, 
  SPECIALIZED_CENTERS_DATA, 
  SUB_SERVICE_DETAILS,
  NOTICE_DATA,
  POSTPARTUM_PROGRAM
} from "../constants";

// 병원의 상세 정보를 챗봇이 이해할 수 있는 텍스트 형식으로 변환
const HOSPITAL_CONTEXT = `
[메디피아 여성병원 상세 정보]
- 병원명: ${HOSPITAL_INFO.name} (${HOSPITAL_INFO.engName})
- 역사: ${HOSPITAL_INFO.openYear}년 개원 (27년 전통의 남양주 진건/호평/평내 지역 대표 산부인과)
- 위치: ${HOSPITAL_INFO.address}
- 전화: ${HOSPITAL_INFO.phone}
- 비전: "화려한 시설이나 브랜드 포장이 아닌, 산모들을 향한 열린 마음과 진정성 있는 태도가 우리의 가장 큰 자부심입니다."

[주요 센터 및 특화 서비스]
1. 분만센터: 산과 전문의 365일 24시간 원내 상주. 야간 및 공휴일 응급 분만 즉시 가동. 젠틀버스 인권 분만, 고위험 임신 집중 케어.
2. 국제진료센터 (외국인 특화): 다누리콜센터 13개국어 24시간 실시간 무료 통역 및 모바일 AI도우미 의사소통 지원. QR코드 원스톱 안내, 투명한 안심 출산 비용 가이드(건강보험 미가입자 예상진료비 완벽 안내), 자국민 커뮤니티 연계 및 외국인 특화 산모교실 운영.
3. 요실금 및 성형센터: 99% 성공률의 15분 개량 TOT 슬링 수술(당일 퇴원), 비수술 레이저 및 체외자기장 치료기. 질성형 등 미적/기능적 동시 회복.
4. 여성센터(부인과): 미세 침습 단일공 복강경 수술, 무절개 자궁경 내시경 수술, 유방 맘모톰(VAB) 무절개 시술(당일 퇴원), 갱년기 관리.
5. 내과 및 검진센터: 보건복지부 지정 국가 5대 암 검진(위, 대장, 간, 유방, 자궁경부). 당일 용종 절제술이 가능한 CO2 무통 내시경 시스템.
6. 산후조리원: 1998년부터 축적된 경험. 모션베드가 구비된 로얄 스위트 및 프리미엄 룸. 소아과 전문의 회진, 산후 체형 교정 등.

[의료진 소개]
${DOCTORS.map(doc => `- ${doc.name} (${doc.role}): ${doc.expertise.join(", ")}\n  (진료철학: ${doc.philosophy})`).join("\n")}

[상담 지침 (비용 관련)]
- 일반적인 비급여 초진: 약 3~5만원 / 초음파: 5~8만원 정도 발생할 수 있으나, 환자 상태에 따라 다르다고 안내할 것.
- 출산(자연분만 2박3일, 제왕절개 5박6일) 및 조리원 입소 비용 등은 병실 등급이나 추가 옵션에 따라 달라지므로 반드시 "전화상담"으로 유도할 것.
`;

const SYSTEM_INSTRUCTION = `
당신은 메디피아 여성병원의 공식 AI 상담원 '메디'입니다. 
아래 병원 정보를 완벽하게 숙지하고, 고객에게 정중하고 신뢰감 있는 톤(Heritage & Haven 컨셉)으로 응대하세요.

[사전 지식: 메디피아 여성병원 컨텍스트]
${HOSPITAL_CONTEXT}

답변 규칙:
1. 반드시 제공된 [병원 정보]를 바탕으로 사실에 근거하여 답변하세요. 없는 사실을 지어내지 마세요.
2. 답변은 3단계(공감/안내/추가문의) 구조로 작성하며, 4문장 이내로 간결하게 답변하세요.
3. 외국인 환자의 문의가 오면 [국제진료센터]의 장점(무료 통역, 투명한 비용 안내 등)을 강조하여 안심시켜 주세요.
4. 구체적인 비용 확답이나 의학적 진단은 피하고 "대표번호 ${HOSPITAL_INFO.phone}으로 전화 주시면 전문 코디네이터가 상세히 안내해 드립니다"라고 안내하세요.
5. 친절하고, 과장되지 않고, 산모와 환자를 배려하는 진정성 있는 톤을 유지하세요.
`;

export const sendMessageToGemini = async (message: string, history: ChatMessage[]): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      // API 키가 없을 때의 임시(Mock) 응답 로직
      return `안녕하세요! 현재 인공지능 상담원 연결을 위한 API 키가 설정되지 않았습니다. 관리자이신 경우, 프로젝트 루트의 \`.env\` 파일에 \`VITE_GEMINI_API_KEY\`를 설정해 주세요. 급한 문의는 ${HOSPITAL_INFO.phone}으로 연락 부탁드립니다.`;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const contents = history
      .filter(m => m.id !== 'welcome')
      .map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, 
      },
    });

    return response.text || `죄송합니다. 현재 상담이 원활하지 않습니다. ${HOSPITAL_INFO.phone}으로 전화 주시면 친절히 상담해 드리겠습니다.`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `메디피아 상담 센터입니다. 현재 시스템 점검 중으로 상담이 지연되고 있습니다. ${HOSPITAL_INFO.phone}으로 문의 부탁드립니다.`;
  }
};
