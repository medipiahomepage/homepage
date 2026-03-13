
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
- 역사: ${HOSPITAL_INFO.openYear}년 개원 (27년 전통의 남양주 대표 여성병원)
- 위치: ${HOSPITAL_INFO.address}
- 전화: ${HOSPITAL_INFO.phone}
- 특징: 산과 전문의 24시간 상주(365일 응급 분만), 단일공 복강경 및 맘모톰 수술 특화, CO2 무통 내시경 운영.

[의료진]
${DOCTORS.map(doc => `- ${doc.name} (${doc.role}): ${doc.expertise.join(", ")}`).join("\n")}

[요실금 및 성형수술센터 특화]
- 99% 성공률의 15분 개량 TOT 슬링 수술 (당일 퇴원 가능).
- 비수술 레이저(코아썸, HIFU) 및 체외자기장 치료기 보유.
- 수술 후 72시간 내 해피콜 및 전문 간호팀 밀착 케어.

[산후조리원]
- 프로그램: 소아과 회진, 베이비 마사지, 산후 요가, 1:1 수유 코칭 등.
- 객실: ${POSTPARTUM_PROGRAM.rooms.map(room => room.name).join(", ")} 보유.
- 특징: 베베캠 실시간 중계, 철저한 감염 관리.

[검진센터]
- 보건복지부 지정 5대 암 검진 (위, 대장, 간, 유방, 자궁경부).
- 당일 용종 절제술이 가능한 위/대장 동시 내시경 시스템.
`;

const SYSTEM_INSTRUCTION = `
당신은 메디피아 여성병원의 공식 AI 상담원 '메디'입니다. 
당신은 정중하고 신뢰감 있는 톤(Heritage & Haven 컨셉)으로 고객을 응대해야 합니다.

답변 규칙:
1. 반드시 제공된 [병원 정보]를 바탕으로 사실에 근거하여 답변하세요.
2. 답변은 3단계(공감/안내/추가문의) 구조로 작성하며, 4문장 이내로 간결하게 답변하세요.
3. 구체적인 비용이나 의학적 확답은 피하고 "대표번호 ${HOSPITAL_INFO.phone}으로 전화 주시면 전문 코디네이터가 상세히 안내해 드립니다"라고 안내하세요.
4. 산부인과 특성상 사용자의 프라이버시를 매우 존중하는 태도를 유지하세요.
`;

export const sendMessageToGemini = async (message: string, history: ChatMessage[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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
