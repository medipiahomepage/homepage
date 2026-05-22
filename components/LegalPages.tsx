// ─────────────────────────────────────────────
// 개인정보처리방침 & 이용약관 페이지
// 메디피아산부인과 법적 고지 페이지 컴포넌트
// ─────────────────────────────────────────────
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

// ── 공통 레이아웃 래퍼 ──────────────────────────
const LegalLayout: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
  title, subtitle, children
}) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FAF7F5]">
      {/* 상단 헤더 */}
      <div
        className="sticky top-0 z-50 flex items-center gap-3 px-5 py-4 border-b border-brand-secondary/10"
        style={{ background: 'rgba(250,247,245,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-brand-secondary/10 transition-colors"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={20} className="text-brand-primary" />
        </button>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary">MEDIPIA OB &amp; GYN</p>
          <h1 className="text-[16px] font-bold text-brand-primary leading-tight">{title}</h1>
        </div>
      </div>

      {/* 본문 영역 */}
      <div className="max-w-2xl mx-auto px-5 py-8 pb-24">
        <p className="text-[12px] text-brand-primary/50 mb-8">{subtitle}</p>
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
};

// ── 섹션 블록 ──────────────────────────────────
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h2 className="text-[14px] font-bold text-brand-primary mb-3 pb-2 border-b border-brand-secondary/20">
      {title}
    </h2>
    <div className="text-[13px] text-brand-primary/70 leading-relaxed space-y-2">
      {children}
    </div>
  </section>
);

// ══════════════════════════════════════════════
// ① 개인정보처리방침 페이지
// ══════════════════════════════════════════════
export const PrivacyPage: React.FC = () => (
  <LegalLayout
    title="개인정보처리방침"
    subtitle={`시행일: 2024년 1월 1일 | 최종 수정일: ${new Date().getFullYear()}년 4월 21일`}
  >
    <Section title="제1조 (개인정보 수집 목적 및 항목)">
      <p>메디피아산부인과(이하 "병원")는 다음과 같은 목적으로 개인정보를 수집·이용합니다.</p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li>진료 예약 및 진료 서비스 제공</li>
        <li>건강검진 결과 안내 및 사후 관리</li>
        <li>온라인 상담 서비스 운영</li>
        <li>의료법에 따른 의무 기록 보존</li>
      </ul>
      <p className="mt-3 font-medium">수집 항목:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li>필수: 성명, 생년월일, 성별, 연락처(전화번호)</li>
        <li>선택: 이메일 주소, 진료 희망 사항</li>
        <li>자동 수집: 접속 IP, 방문 일시, 브라우저 정보</li>
      </ul>
    </Section>

    <Section title="제2조 (개인정보 보유 및 이용 기간)">
      <p>병원은 개인정보 수집·이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계 법령에 따라 아래 기간 동안 보존합니다.</p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li>진료기록부: 10년 (의료법 제22조)</li>
        <li>처방전: 2년 (의료법 제17조)</li>
        <li>소비자 불만 또는 분쟁처리 기록: 3년 (전자상거래법)</li>
        <li>온라인 상담 기록: 수집일로부터 1년</li>
      </ul>
    </Section>

    <Section title="제3조 (개인정보의 제3자 제공)">
      <p>병원은 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 아래 경우는 예외로 합니다.</p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li>이용자가 사전에 동의한 경우</li>
        <li>법령의 규정에 의거하거나 수사기관의 요청이 있는 경우</li>
        <li>의료법에 따라 타 의료기관에 진료 정보를 제공하는 경우</li>
      </ul>
    </Section>

    <Section title="제4조 (개인정보 처리 위탁)">
      <p>병원은 서비스 향상을 위해 아래와 같이 개인정보 처리 업무를 위탁합니다.</p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li>수탁자: 의료정보시스템 운영업체 | 위탁 업무: 전자의무기록(EMR) 관리</li>
        <li>수탁자: 문자 발송 서비스업체 | 위탁 업무: 진료 예약 알림 발송</li>
      </ul>
    </Section>

    <Section title="제5조 (정보 주체의 권리)">
      <p>이용자는 병원에 대해 언제든지 아래 권리를 행사할 수 있습니다.</p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li>개인정보 열람 요구</li>
        <li>오류 정정 요구</li>
        <li>삭제 요구</li>
        <li>처리 정지 요구</li>
      </ul>
      <p className="mt-2">권리 행사는 병원에 서면, 전화, 이메일로 하실 수 있으며, 병원은 즉시 조치하겠습니다.</p>
    </Section>

    <Section title="제6조 (개인정보 보호 책임자)">
      <p>병원은 개인정보 처리에 관한 업무를 총괄하고 이용자의 불만 처리 및 피해 구제를 위하여 아래와 같이 개인정보 보호 책임자를 지정합니다.</p>
      <div className="mt-2 p-4 bg-white rounded-xl border border-brand-secondary/15">
        <p className="font-semibold text-brand-primary">개인정보 보호 책임자</p>
        <p>성명: 메디피아산부인과 원장</p>
        <p>소속: 메디피아산부인과</p>
        <p>연락처: 031-595-8400</p>
        <p>주소: 경기도 남양주시 경춘로 1511 (호평동 14)</p>
      </div>
    </Section>

    <Section title="제7조 (쿠키 운영 및 거부)">
      <p>병원 웹사이트는 이용자에게 개인화된 서비스를 제공하기 위해 쿠키(Cookie)를 사용할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.</p>
      <p className="mt-1 text-[12px] text-brand-primary/50">※ 쿠키 거부 시 일부 서비스 이용이 제한될 수 있습니다.</p>
    </Section>

    <Section title="제8조 (개인정보처리방침 변경)">
      <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가·삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지합니다.</p>
    </Section>

    <div className="pt-4 text-center text-[11px] text-brand-primary/40">
      © {new Date().getFullYear()} 메디피아산부인과. All Rights Reserved.
    </div>
  </LegalLayout>
);

// ══════════════════════════════════════════════
// ② 이용약관 페이지
// ══════════════════════════════════════════════
export const TermsPage: React.FC = () => (
  <LegalLayout
    title="이용약관"
    subtitle={`시행일: 2024년 1월 1일 | 최종 수정일: ${new Date().getFullYear()}년 4월 21일`}
  >
    <Section title="제1조 (목적)">
      <p>이 약관은 메디피아산부인과(이하 "병원")가 운영하는 홈페이지(이하 "사이트")에서 제공하는 인터넷 관련 서비스(이하 "서비스")를 이용함에 있어 병원과 이용자의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
    </Section>

    <Section title="제2조 (정의)">
      <ul className="list-disc list-inside space-y-1">
        <li><span className="font-medium">사이트:</span> 병원이 운영하는 메디피아산부인과 공식 홈페이지</li>
        <li><span className="font-medium">이용자:</span> 이 약관에 따라 병원이 제공하는 서비스를 받는 회원 및 비회원</li>
        <li><span className="font-medium">서비스:</span> 진료 정보 안내, 온라인 상담, 예약 신청 등 병원이 제공하는 모든 서비스</li>
      </ul>
    </Section>

    <Section title="제3조 (약관의 효력 및 변경)">
      <p>이 약관은 사이트에 게시함으로써 효력이 발생하며, 병원은 합리적인 사유가 있을 경우 관련 법령에 위반되지 않는 범위에서 약관을 변경할 수 있습니다. 변경된 약관은 사이트에 공지함으로써 효력이 발생합니다.</p>
    </Section>

    <Section title="제4조 (서비스 이용)">
      <p>서비스 이용 시간은 병원의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴 24시간을 원칙으로 합니다. 단, 정기점검 등 필요한 경우 이용을 일시 중단할 수 있습니다.</p>
      <p className="mt-2">이 사이트에서 제공하는 의료 정보는 일반적인 건강 정보 제공을 목적으로 하며, 실제 진료를 대체할 수 없습니다. 정확한 진단과 치료를 위해 반드시 의료진과 상담하시기 바랍니다.</p>
    </Section>

    <Section title="제5조 (이용자의 의무)">
      <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li>허위 정보를 등록하는 행위</li>
        <li>병원의 저작권, 제3자의 저작권 등 기타 권리를 침해하는 행위</li>
        <li>병원 및 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
        <li>외설 또는 폭력적인 내용을 게시하는 행위</li>
        <li>해킹, 바이러스 배포 등 사이트의 정상적인 운영을 방해하는 행위</li>
      </ul>
    </Section>

    <Section title="제6조 (저작권)">
      <p>이 사이트에 게시된 모든 콘텐츠(텍스트, 이미지, 영상 등)의 저작권은 메디피아산부인과에 귀속됩니다. 이용자는 병원의 사전 서면 동의 없이 이를 복제, 배포, 상업적으로 이용할 수 없습니다.</p>
    </Section>

    <Section title="제7조 (면책 조항)">
      <ul className="list-disc list-inside space-y-1">
        <li>병원은 천재지변, 불가항력적 사유로 서비스를 제공하지 못하는 경우 책임을 지지 않습니다.</li>
        <li>이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.</li>
        <li>사이트 내 링크된 외부 사이트에 대한 신뢰도 및 정확성에 대해 책임을 지지 않습니다.</li>
      </ul>
    </Section>

    <Section title="제8조 (분쟁 해결)">
      <p>이 약관과 관련한 분쟁은 대한민국 법률을 적용하며, 소송이 제기될 경우 병원 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.</p>
    </Section>

    <Section title="제9조 (연락처)">
      <div className="p-4 bg-white rounded-xl border border-brand-secondary/15">
        <p className="font-semibold text-brand-primary mb-2">메디피아산부인과</p>
        <p>주소: 경기도 남양주시 경춘로 1511 (호평동 14)</p>
        <p>전화: 031-595-8400</p>
        <p>운영시간: 평일 09:00 ~ 18:00 (토요일 단축 운영)</p>
      </div>
    </Section>

    <div className="pt-4 text-center text-[11px] text-brand-primary/40">
      © {new Date().getFullYear()} 메디피아산부인과. All Rights Reserved.
    </div>
  </LegalLayout>
);
