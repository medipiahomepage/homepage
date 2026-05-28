
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Menu, X, Phone, ChevronRight, MapPin, Clock, Heart, CheckCircle2, ArrowRight, Zap, Camera, Bus, Car, Baby, Info, Calendar } from 'lucide-react';
import { NAV_ITEMS, DOCTORS as DOCTORS_FALLBACK, SPECIALIZED_CENTERS_DATA, SUB_SERVICE_DETAILS, NOTICE_DATA, FACILITY_GALLERY, HOSPITAL_INFO, POSTPARTUM_PROGRAM, POSTPARTUM_MAIN_IMAGE, HOME_HERO_VIDEO, LOBBY_IMAGE_URL } from './constants';
import { GeminiChat } from './components/GeminiChat';
import { SpecializedCenters } from './components/SpecializedCenters';
import { InternationalClinic, TRANSLATIONS, SupportedLanguage } from './components/InternationalClinic';
import { PageHero } from './components/PageHero';
import { PrivacyPage, TermsPage } from './components/LegalPages';
import { AdminPage } from './components/AdminPage';
import { PopupManager } from './components/PopupManager';
import { ConsultationPage } from './components/ConsultationPage';
import { ReviewBoard } from './components/ReviewBoard';
import { SEO } from './components/SEO';
import { db } from './lib/firebase';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { Notice, Doctor } from './types';

// ─────────────────────────────────────────────
// 커스텀 훅: Firestore에서 의료진 데이터 로드
// Firestore 연결 실패 시 constants.ts 데이터로 fallback
// order 필드 기준으로 정렬하여 반환
// ─────────────────────────────────────────────
function useDoctors(): Doctor[] {
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS_FALLBACK);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const snapshot = await getDocs(
          query(collection(db, 'doctors'), orderBy('order', 'asc'))
        );
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as unknown as Doctor));
          setDoctors(fetched);
        }
      } catch (error) {
        // Firestore 미연결 시 constants.ts fallback 유지 (정상 동작)
        console.warn('[useDoctors] Firestore 로드 실패, constants 데이터 사용:', error);
      }
    };
    fetchDoctors();
  }, []);

  return doctors;
}


// -- Hospital Logo Component --
const HospitalLogo: React.FC<{
  primaryColor?: string;
  secondaryColor?: string;
}> = ({ 
  primaryColor = 'text-brand-primary', 
  secondaryColor = 'text-brand-secondary'
}) => (
  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', width: 'max-content' }}>
    <span className={`nanum-gothic font-bold text-lg tracking-tighter ${primaryColor} leading-tight`}>
      {HOSPITAL_INFO.name}
    </span>
    <span
      className={`text-[11px] font-black ${secondaryColor} leading-none uppercase`}
      style={{ marginTop: '2px', textAlign: 'center', letterSpacing: '0.08em' }}
    >
      MEDIPIA OB &amp; GYN
    </span>
  </div>
);

// -- Shared Components (Updated) --

// -- 햅틱 피드백 유틸리티 --
// iOS Safari는 vibrate 미지원이므로 graceful fallback
const triggerHaptic = (ms: number = 10) => {
  try { navigator?.vibrate?.(ms); } catch (_) { /* 미지원 기기 무시 */ }
};

// -- 프로그레스 바 컴포넌트 --
// 스크롤 위치에 따라 상단에 얇은 바를 표시하여 전체 위치 인지 지원
const ProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div className="progress-bar" style={{ width: `${progress}%` }} />;
};

const PhoneConsultButton: React.FC<{ className?: string, variant?: 'outline' | 'filled' }> = ({ className, variant = 'filled' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleClick = () => {
    triggerHaptic();
    if (isMobile) {
      window.location.href = `tel:${HOSPITAL_INFO.phone}`;
    }
  };

  // 더스티 로즈 CTA 버튼: touch-scale + pulse-cta 마이크로 인터랙션
  const filledStyles = "w-full px-8 md:px-10 py-3.5 md:py-4 bg-brand-secondary text-white font-bold tracking-wider text-[13px] hover:bg-white hover:text-brand-secondary border border-brand-secondary transition-all rounded-full shadow-md flex items-center justify-center gap-2 touch-scale pulse-cta";
  const outlineStyles = "border border-brand-secondary text-brand-secondary px-5 md:px-6 py-2 text-[12px] tracking-wider font-bold hover:bg-brand-secondary hover:text-white transition-all rounded-full flex items-center justify-center gap-2 touch-scale";

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => !isMobile && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button 
        onClick={handleClick}
        className={variant === 'filled' ? filledStyles : outlineStyles}
      >
        <Phone size={14} /> 전화로 상담하기
      </button>
      
      {!isMobile && showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max px-4 py-2 bg-brand-secondary text-white text-[10px] font-bold rounded-lg shadow-xl animate-fade-in-up z-50 text-center">
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-brand-secondary"></div>
          모바일에서 즉시 전화 연결이 가능합니다.
        </div>
      )}
    </div>
  );
};

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <>
      {/* Header - asantph.com style: 좌측 햄버거, 중앙 로고, 우측 전화 */}
      <header className="sticky top-0 z-[100] glass-nav border-b border-brand-primary/5">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-12">
          <div className="relative flex items-center justify-center lg:justify-between h-16 lg:h-20">
            {/* 좌측: 햄버거 메뉴 (모바일 전용) */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden absolute left-0 p-2 text-brand-primary hover:text-brand-secondary transition-colors"
              aria-label="메뉴 열기"
            >
              <Menu size={26} strokeWidth={1.8} />
            </button>

            {/* 로고 (모바일에서는 중앙, PC에서는 좌측) */}
            <div onClick={() => navigate('/')} className="cursor-pointer lg:relative absolute left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0">
              <HospitalLogo />
            </div>

            {/* PC 메인 네비게이션 (주메뉴 & 부메뉴) */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10 h-full">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="group relative h-full flex items-center cursor-pointer">
                  <button 
                    onClick={() => { if(item.children && item.children[0].path) navigate(item.children[0].path); else if(item.path) navigate(item.path); }} 
                    className="text-brand-primary font-bold hover:text-brand-secondary text-[16px] lg:text-[17px] transition-colors h-full flex items-center"
                  >
                    {item.label}
                  </button>
                  {/* 부메뉴 드롭다운 */}
                  {item.children && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[220px] bg-white shadow-2xl border border-brand-primary/5 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 mt-0 z-50">
                      {item.children.map((child) => (
                        <button 
                          key={child.label} 
                          onClick={() => navigate(child.path!)} 
                          className="block w-full text-left px-5 py-3 text-[15px] text-brand-primary hover:text-brand-secondary hover:bg-brand-pale transition-colors font-medium"
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* 우측: 전화 아이콘 / 번호 */}
            <button
              onClick={() => isMobile ? window.location.href = `tel:${HOSPITAL_INFO.phone}` : undefined}
              className="lg:relative absolute right-0 p-2 text-brand-primary hover:text-brand-secondary transition-colors flex items-center gap-2"
              aria-label="전화 상담"
            >
              <Phone size={20} strokeWidth={1.8} />
              <span className="hidden lg:block text-[14px] font-bold">{HOSPITAL_INFO.phone}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 사이드바 오버레이 배경 */}
      <div
        className={`fixed inset-0 z-[199] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={() => setIsOpen(false)}
      />

      {/* Side Drawer - asantph.com 스타일: 반투명 + 좁은 너비 */}
      <div
        className={`fixed top-0 left-0 z-[200] transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}
        style={{
          width: 'min(280px, 78vw)',
          background: 'rgba(10, 10, 10, 0.55)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottomRightRadius: '20px',
          maxHeight: '100vh',
        }}
      >
        {/* 닫기 버튼 - 좌측 상단 */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/50 hover:text-white transition-colors" aria-label="메뉴 닫기">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* 메뉴 목록 */}
        <div className="flex-1 overflow-y-auto pb-6 no-scrollbar">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="w-full flex justify-between items-center px-6 py-3.5 text-white/70 hover:text-white transition-colors"
                  >
                    <span className="text-[16px] tracking-wide font-bold">{item.label}</span>
                    <ChevronRight
                      size={14}
                      strokeWidth={1.5}
                      className={`transition-transform duration-300 text-white/30 ${openMenu === item.label ? 'rotate-90' : ''}`}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: openMenu === item.label ? '500px' : '0' }}
                  >
                    {item.children.map((child) => (
                      <button
                        key={child.label}
                        onClick={() => { child.path && navigate(child.path); setIsOpen(false); }}
                        className="block w-full text-left pl-10 pr-6 py-2.5 text-[14px] font-medium text-white/50 hover:text-brand-secondary transition-colors"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => { item.path && navigate(item.path); setIsOpen(false); }}
                  className="w-full text-left px-6 py-3.5 text-[16px] tracking-wide font-bold text-white/70 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 사이드바 하단 전화번호 */}
        <div className="px-6 py-5 border-t border-white/8">
          <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mb-1.5">진료 상담</p>
          <p className="text-white/90 text-base font-bold tracking-wider">{HOSPITAL_INFO.phone}</p>
          <p className="text-white/30 text-[10px] mt-1">평일 09:00~18:00 · 토 09:00~13:00</p>
        </div>
      </div>
    </>
  );
};


// -- Page Components --

// 히어로 배경 이미지 슬라이드쇼 컴포넌트
// 3장 이미지를 5초 간격으로 크로스페이드(부드럽게 전환)하며 반복함
const HERO_IMAGES = [
  { src: '/images/hero_bg.png', alt: '메디피아산부인과 내부 복도' },
  { src: '/images/hero_bg2.png', alt: '메디피아산부인과 편안한 진료실' },
  { src: '/images/hero_bg3.png', alt: '메디피아산부인과 따뜻한 공간' },
];

const HeroSlideshow: React.FC<{ sectionRef: React.RefObject<HTMLElement>; navigate: (path: string) => void }> = ({ sectionRef, navigate }) => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(-1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => {
        setPrev(c);
        return (c + 1) % HERO_IMAGES.length;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={sectionRef} className="snap-hero relative h-[92vh] lg:h-screen w-full overflow-hidden" style={{ backgroundColor: '#3D3535' }}>
      {/* Ken Burns 효과 크로스페이드 배경 */}
      {HERO_IMAGES.map((img, idx) => (
        <div
          key={img.src}
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: idx === current ? 1 : 0,
            transition: 'opacity 2.5s ease-in-out',
          }}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover"
            style={{
              transform: (idx === current || idx === prev) ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 10s ease-out',
              transformOrigin: 'center center'
            }}
          />
        </div>
      ))}

      {/* 워미 핑크 오버레이 */}
      <div className="absolute inset-0 bg-brand-secondary/25 mix-blend-multiply z-10" />
      <div className="absolute inset-0 overlay-gradient-bottom z-10" />

      {/* 히어로 텍스트 */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-5">
        <div className="animate-fade-in-up">
          <p className="section-eng-label text-white/70 mb-6 tracking-[0.5em]">MEDIPIA OB &amp; GYN</p>
          <h1 className="serif-title text-[36px] md:text-[42px] lg:text-[52px] text-white font-bold mb-6 leading-[1.35]" style={{ textShadow: '0 0 50px rgba(0,0,0,0.9), 0 0 100px rgba(0,0,0,0.6), 0 4px 25px rgba(0,0,0,0.85)' }}>
            여성의<br />가장 <span className="noble-moment-highlight">고귀한 순간</span>을<br />함께 합니다.
          </h1>
          <p className="text-white/80 text-[15px] lg:text-[17px] max-w-lg mx-auto mb-12 font-light leading-[1.8] tracking-wide" style={{ textShadow: '0 0 30px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.5)' }}>
            남양주 여성 건강 전문 클리닉<br />메디피아산부인과에 오신 것을 환영합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <PhoneConsultButton className="w-full sm:w-[220px]" />
            <button onClick={() => navigate('/brand')} className="w-full sm:w-[220px] px-10 py-4 bg-white/8 backdrop-blur-md text-white border border-white/25 font-bold tracking-[0.15em] text-[11px] uppercase hover:bg-white hover:text-brand-primary transition-all duration-500 rounded-full flex items-center justify-center gap-2 touch-scale">메디피아산부인과 소개</button>
          </div>
        </div>
      </div>

      {/* 슬라이드 프로그레스 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`슬라이드 ${idx + 1}`}
            className="relative h-[3px] rounded-full overflow-hidden transition-all duration-500"
            style={{ width: idx === current ? '48px' : '16px', backgroundColor: idx === current ? 'transparent' : 'rgba(255,255,255,0.3)' }}
          >
            {idx === current && (
              <>
                <div className="absolute inset-0 bg-white/30 rounded-full" />
                <div className="absolute inset-y-0 left-0 bg-white rounded-full slide-progress-bar" />
              </>
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

const HOME_SERVICE_TABS = [
  {
    id: 'obs',
    label: '분만센터',
    engLabel: 'OBSTETRICS',
    title: '안전한 출산을 위한\n분만 전문 클리닉',
    desc: '24시간 산과 전문의 원내 상주. 안전한 분만부터 고위험 임신까지 체계적으로 관리합니다.',
    items: [
      { name: '고위험 임신 관리', path: '/medical/obs/high-risk', desc: '임신중독증, 다태임신 집중 케어' },
      { name: '3D 정밀 초음파', path: '/medical/obs/ultrasound', desc: '태아 심장·구조 정밀 검사' },
      { name: '임신 주기별 검사', path: '/medical/obs/basic', desc: '초기~후기 필수 산전 검사' },
    ],
  },
  {
    id: 'gyn',
    label: '여성센터',
    engLabel: 'GYNECOLOGY',
    title: '여성 질환의 정확한\n진단과 맞춤 치료',
    desc: '복강경 수술 특화 클리닉. 자궁근종, 난소낭종, 갱년기 관리까지 여성 건강 전반을 책임집니다.',
    items: [
      { name: '복강경 수술', path: '/medical/gyn/laparoscopy', desc: '최소침습 복강경 전문 수술' },
      { name: '자궁내시경', path: '/medical/gyn/hysteroscopy', desc: '무절개 자궁 내부 정밀 치료' },
      { name: '갱년기·폐경기 관리', path: '/medical/gyn/menopause', desc: '맞춤 호르몬 보충 요법' },
      { name: '유방 맘모톰', path: '/medical/gyn/mammotome', desc: '비수술 유방 종양 제거' },
    ],
  },
  {
    id: 'internal',
    label: '내과,종합검진센터',
    engLabel: 'INTERNAL MEDICINE',
    title: '예방부터 치료까지\n통합 내과 건강검진',
    desc: '국가 5대 암 검진 지정 기관. 위·대장 내시경, 맞춤 종합검진으로 숨겨진 위험 인자를 조기에 발견합니다.',
    items: [
      { name: '국가 건강검진', path: '/medical/internal/national', desc: '5대 암 포함 국가검진 지정기관' },
      { name: '위·대장 내시경', path: '/medical/internal/endoscopy', desc: '당일 용종 절제 원스톱 시스템' },
      { name: '맞춤 종합검진', path: '/medical/internal/comprehensive', desc: '연령·가족력 기반 개인화 검진' },
      { name: '만성질환 클리닉', path: '/medical/internal/chronic', desc: '고혈압·당뇨·고지혈증 관리' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 모바일 전용 공통 풀스크린 섹션 컴포넌트
// 각 서비스 센터를 대형 타이포그래피 + 가로스크롤 탭 구조로 표현
// ─────────────────────────────────────────────────────────────
interface MobileSectionProps {
  engLabel: string;
  title: React.ReactNode;
  subtitle: string;
  bgColor: string;
  gradientFrom?: string;
  tabs: { label: string; path: string }[];
  navigate: (path: string) => void;
  accentLine?: boolean;
  bgImage?: string;
  sectionRef?: React.RefObject<HTMLElement> | ((instance: HTMLElement | null) => void);
}

const MobileSection: React.FC<MobileSectionProps> = ({
  engLabel, title, subtitle, bgColor, tabs, navigate, bgImage, sectionRef
}) => (
  <section
    ref={sectionRef as React.LegacyRef<HTMLElement>}
    className="lg:hidden snap-section min-h-screen flex flex-col relative"
    style={{ backgroundColor: bgColor }}
  >
    {/* 상단 이미지 카드 - 그라디언트 오버레이 포함 */}
    {bgImage && (
      <div className="mx-4 mt-2 rounded-2xl overflow-hidden shadow-lg relative"
           style={{ height: '30vh', flexShrink: 0 }}>
        <img
          src={bgImage}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {/* 하단 그라디언트 오버레이 */}
        <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: `linear-gradient(to top, ${bgColor}, transparent)` }} />
      </div>
    )}

    {/* 텍스트 콘텐츠 */}
    <div className="flex flex-col justify-end px-7 pt-3 pb-3 relative z-10">
      <p className="section-eng-label text-brand-secondary mb-3 drop-shadow-sm scale-typography-left tracking-[0.4em]">{engLabel}</p>
      <div className="w-10 h-[2px] bg-brand-secondary mb-4 shadow-sm" />
      <h2 className="serif-title text-[26px] font-bold text-brand-primary dark:text-white leading-snug mb-3 whitespace-nowrap scale-typography-left">
        {title}
      </h2>
      <p className="text-brand-primary/55 dark:text-gray-300 text-[13px] leading-[1.8] scale-typography-left font-light">{subtitle}</p>
    </div>

    {/* 세련된 탭 리스트 - 스크롤 하단 여유 공간 확보 */}
    <div className="flex-1 px-5 pb-32 pt-2 space-y-2 content-start">
      {tabs.map((tab, i) => (
        <button
          key={tab.path}
          onClick={() => navigate(tab.path)}
          className="group w-full flex items-center justify-between bg-white/80 hover:bg-white border border-brand-primary/5 hover:border-brand-secondary/30 rounded-2xl px-5 py-4 text-left transition-all duration-300 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center text-[11px] font-bold text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-all duration-300">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="text-brand-primary font-semibold text-[14px] leading-snug group-hover:text-brand-secondary transition-colors">{tab.label}</p>
          </div>
          <ChevronRight size={14} className="text-brand-accent/40 group-hover:text-brand-secondary group-hover:translate-x-1 transition-all duration-300" />
        </button>
      ))}
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────
// 하단 고정 Floating CTA 바 (모바일 전용)
// 어느 섹션에서든 즉시 전화/상담 가능하도록 항상 표시
// ─────────────────────────────────────────────────────────────
const MobileFloatingBar: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
  <div
    className="lg:hidden fixed bottom-0 left-0 right-0 z-[150] safe-bottom"
    style={{ background: 'linear-gradient(135deg, rgba(61,53,53,0.95) 0%, rgba(90,69,85,0.95) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
  >
    <div className="flex">
      <a
        href="tel:031-595-8400"
        className="flex-1 flex items-center justify-center gap-2.5 py-4 border-r border-white/10 active:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center pulse-cta">
          <Phone size={14} className="text-brand-secondary" />
        </div>
        <span className="text-white text-[13px] font-bold tracking-wide">전화 상담</span>
      </a>
      <button
        onClick={() => navigate('/consultation')}
        className="flex-1 flex items-center justify-center gap-2.5 py-4 active:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <Heart size={14} className="text-brand-muted" />
        </div>
        <span className="text-white/80 text-[13px] font-bold tracking-wide">상담 남기기</span>
      </button>
    </div>
  </div>
);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('obs');
  const [activeSnap, setActiveSnap] = useState(0);
  const activeService = HOME_SERVICE_TABS.find(t => t.id === activeTab)!;
  const sectionRefs = [useRef<HTMLElement>(null), useRef<HTMLElement>(null), useRef<HTMLElement>(null), useRef<HTMLElement>(null), useRef<HTMLElement>(null)];
  const mobileRefs = useRef<(HTMLElement | null)[]>(new Array(9).fill(null));
  // Firestore에서 의료진 데이터 동적 로드 (실패 시 constants fallback)
  const DOCTORS = useDoctors();

  const [recentNotices, setRecentNotices] = useState<{id: string, date: string, title: string}[]>(NOTICE_DATA);

  useEffect(() => {
    const fetchHomeNotices = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, 'notices')));
        const fetchedNotices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notice));
        const visibleNotices = fetchedNotices
          .filter(n => n.isVisible !== false)
          .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
          .slice(0, 3)
          .map(n => ({
            id: n.id,
            date: n.createdAt?.toDate?.().toLocaleDateString() || '',
            title: n.title
          }));
        
        if (visibleNotices.length > 0) {
          setRecentNotices(visibleNotices);
        }
      } catch (error) {
        console.error('Failed to fetch home notices:', error);
      }
    };
    fetchHomeNotices();
  }, []);

  // 모바일 홈 진입 시 스크롤 스냅 활성화, 이탈 시 해제
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      document.documentElement.classList.add('home-snap');
    }
    return () => {
      document.documentElement.classList.remove('home-snap');
    };
  }, []);

  // 현재 보이는 섹션 감지 (인디케이터 업데이트)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (isMobile) {
              const idx = mobileRefs.current.findIndex(r => r === entry.target);
              if (idx !== -1) setActiveSnap(idx);
            } else {
              const idx = sectionRefs.findIndex(r => r.current === entry.target);
              // PC용 인디케이터가 있다면 여기서 업데이트됨
            }
          }
        });
      },
      { threshold: 0.3 } // 모바일에서 긴 섹션을 위해 threshold 하향 조정
    );
    
    if (isMobile) {
      mobileRefs.current.forEach(ref => { if (ref) observer.observe(ref); });
    } else {
      sectionRefs.forEach(ref => { if (ref.current) observer.observe(ref.current); });
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full">
      {/* 모바일 섹션 인디케이터 (우측 고정) - 총 9개 섹션 */}
      <div className="snap-indicator lg:hidden" aria-hidden="true">
        {['히어로','소개','분만','여성','내과','외국인','산후','상담','소식'].map((_, i) => (
          <div key={i} className={`snap-dot${activeSnap === i ? ' active' : ''}`} />
        ))}
      </div>

      {/* ── 히어로 섹션 ── */}
      {/* 히어로 - 3장 이미지 크로스페이드 슬라이드쇼 */}
      <div ref={(el) => {
        // 모바일과 PC 모두 첫 번째 히어로 섹션 참조
        mobileRefs.current[0] = el;
        if (sectionRefs[0]) (sectionRefs[0] as any).current = el;
      }}>
        <HeroSlideshow sectionRef={sectionRefs[0]} navigate={navigate} />
      </div>

      {/* ── 병원 소개 섹션 ── */}
      {/* PC 전용 - 모바일에서는 메뉴별 접이식 섹션으로 대체 */}
      <section ref={sectionRefs[1]} className="snap-section hidden lg:block py-20 lg:py-32 bg-brand-light">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="section-eng-label mb-4 tracking-[0.5em]">MEDIPIA OB &amp; GYN</p>
          <div className="section-divider" />
          <h2 className="serif-title text-[28px] lg:text-[42px] font-bold text-brand-primary mt-6 mb-6 leading-[1.4]">
            메디피아산부인과 소개
          </h2>
          <p className="text-brand-primary/50 font-light text-[15px] lg:text-[16px] max-w-2xl mx-auto leading-[1.9] mb-16">
            소중한 탄생 그리고 새로운 시작을 위해 안전한 응급 의료 시스템,<br />
            전문화된 진료 시스템을 통해 최상의 의료 서비스를 제공할 것을 약속 드립니다.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { num: '30+', label: '년 진료 경력', sub: '1995년부터' },
              { num: '4', label: '명 전문의', sub: '산부인과·내과·마취과' },
              { num: '24H', label: '응급 대응', sub: '365일 산과 전문의 상주' },
              { num: '5대', label: '암 검진 지정', sub: '국가 건강검진 기관' },
            ].map((item) => (
              <div key={item.num} className="py-10 rounded-2xl service-card bg-white shadow-sm border border-brand-primary/5 hover-lift">
                <p className="serif-title text-[32px] lg:text-[38px] font-bold text-brand-secondary mb-2">{item.num}</p>
                <p className="font-medium text-brand-primary text-[13px]">{item.label}</p>
                <p className="text-brand-accent text-[11px] font-light mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 진료 서비스 탭 섹션 ── */}
      {/* PC 전용 */}
      <section ref={sectionRefs[2]} className="snap-section hidden lg:block py-20 lg:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-eng-label mb-4 tracking-[0.5em]">OUR MEDICAL SERVICES</p>
            <div className="section-divider" />
            <h2 className="serif-title text-[28px] lg:text-[42px] font-bold text-brand-primary mt-6">진료 안내</h2>
          </div>
          {/* 탭 버튼 - 필 배경 */}
          <div className="flex justify-center gap-2 mb-14">
            {HOME_SERVICE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-8 py-3 text-[13px] font-bold rounded-full transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-brand-primary text-white shadow-lg' 
                    : 'text-brand-accent hover:text-brand-primary bg-brand-light hover:bg-brand-pale'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* 탭 콘텐츠 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start" key={activeTab}>
            <div className="animate-fade-in-up">
              <p className="section-eng-label mb-4 tracking-[0.4em]">{activeService.engLabel}</p>
              <h3 className="serif-title text-[24px] lg:text-[36px] font-bold text-brand-primary mb-6 leading-[1.4] whitespace-pre-line">{activeService.title}</h3>
              <p className="text-brand-primary/50 font-light text-[14px] leading-[1.9] mb-10">{activeService.desc}</p>
              <button onClick={() => navigate(activeService.items[0].path)} className="inline-flex items-center gap-2 text-brand-secondary font-bold text-[13px] hover:gap-4 transition-all duration-300 group">
                자세히 보기 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="space-y-4">
              {activeService.items.map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="w-full service-card text-left bg-white rounded-2xl p-6 border border-brand-primary/5 hover:border-brand-secondary/25 flex items-center gap-5 group"
                >
                  <span className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-[12px] font-bold text-brand-secondary shrink-0 group-hover:bg-brand-secondary group-hover:text-white transition-all duration-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-brand-primary text-[15px] mb-1 group-hover:text-brand-secondary transition-colors">{item.name}</p>
                    <p className="text-brand-accent text-[12px] font-light leading-relaxed">{item.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-brand-accent/30 group-hover:text-brand-secondary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 의료진 소개 미리보기 ── */}
      {/* PC 전용 */}
      <section ref={sectionRefs[3]} className="snap-section hidden lg:block py-16 lg:py-40 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="section-eng-label mb-4">MEDICAL TEAM</p>
            <div className="section-divider" />
            <h2 className="serif-title text-3xl lg:text-5xl font-bold text-brand-primary mt-6">전문 의료진 소개</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {DOCTORS.map((doc, idx) => (
              <button
                key={idx}
                onClick={() => navigate('/medical/staff')}
                className="service-card group text-center bg-[#F8F7F4] rounded-2xl overflow-hidden border border-brand-primary/5"
              >
                <div className="aspect-[3/4] overflow-hidden bg-brand-light/30">
                  <img src={doc.image} alt={doc.name} className="w-[85%] h-full mx-auto object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-5">
                  <p className="section-eng-label mb-1">{doc.role}</p>
                  <p className="font-bold text-brand-primary text-base">{doc.name}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="text-center mt-12">
            <button onClick={() => navigate('/medical/staff')} className="inline-flex items-center gap-2 px-8 py-3 border border-brand-secondary text-brand-secondary font-bold text-[13px] rounded-full hover:bg-brand-secondary hover:text-white transition-all">
              의료진 전체 보기 <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 공지사항 / 소식 섹션 ── */}
      {/* PC 전용 */}
      <section ref={sectionRefs[4]} className="snap-section hidden lg:block py-16 lg:py-40 bg-brand-pale" style={{ backgroundColor: '#FFE4E1' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            {/* 영문 레이블: label-eng / 11px / Cormorant Garamond */}
            <p className="section-eng-label mb-4">HOSPITAL NEWS</p>
            <div className="section-divider mx-auto" />
            {/* 섹션 제목: 26~36px / Noto Serif KR 700 */}
            <h2 className="serif-title text-[26px] lg:text-[36px] font-bold text-brand-primary mt-6">메디피아 소식</h2>
          </div>
          <div className="space-y-4 mb-12">
            {recentNotices.map((item) => (
              <div key={item.id} className="bg-white/80 hover:bg-white transition-all rounded-2xl px-8 py-6 flex justify-between items-center gap-4 group border border-brand-secondary/10 hover:border-brand-secondary/30 shadow-sm">
                <div>
                  {/* 날짜: caption / 11px / Apple SF Pro Text 300 */}
                  <p className="text-brand-accent text-[11px] font-light tracking-wider mb-2">{item.date}</p>
                  {/* 제목: body / 14~15px / Noto Sans KR 500 */}
                  <p className="text-brand-primary font-medium text-[14px] group-hover:text-brand-secondary transition-colors">{item.title}</p>
                </div>
                <ChevronRight size={18} className="text-brand-accent group-hover:text-brand-secondary shrink-0 transition-colors" />
              </div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={() => navigate('/community')} className="inline-flex items-center gap-2 px-8 py-3 border border-brand-secondary/40 text-brand-secondary font-medium text-[13px] rounded-full hover:bg-brand-secondary hover:text-white transition-all">
              소식 전체 보기 <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>


      {/* ==========================================
          모바일 전용: 스토리텔링 풀스크린 섹션
          Vertical Scroll Snap - 8개 센터 + 소식
          ========================================== */}

      {/* ① 메디피아 소개 */}
      <MobileSection
        sectionRef={(el) => mobileRefs.current[1] = el}
        engLabel="ABOUT US"
        title={<><span className="text-brand-secondary text-[24px]">27년의 신뢰,</span><br/>메디피아산부인과</>}
        subtitle="1995년부터 남양주 여성 건강을 지켜온 메디피아산부인과의 이야기를 소개합니다."
        bgColor="#FAF7F5"
        gradientFrom="#F0EAE4"
        bgImage="/images/about_bg.png"
        navigate={navigate}
        tabs={[
          { label: '메디피아 소개', path: '/brand' },
          { label: '의료진 소개', path: '/medical/staff' },
          { label: '진료시간 안내', path: '/brand/hours' },
          { label: '오시는 길', path: '/brand/location' },
        ]}
      />

      {/* ② 분만센터 */}
      <MobileSection
        sectionRef={(el) => mobileRefs.current[2] = el}
        engLabel="BIRTH CENTER"
        title={<><span className="text-brand-secondary text-[24px]">안전한 기적,</span><br/>365 분만센터</>}
        subtitle="예비맘부터 출산까지, 산모와 아기의 안전한 10개월을 24시간 전문의가 함께합니다."
        bgColor="#FFFFFF"
        gradientFrom="#FFF0EC"
        bgImage="/images/birth_center_bg.png"
        navigate={navigate}
        tabs={[
          { label: '예비맘 검사', path: '/medical/obs/prenatal' },
          { label: '임신중 기본검사', path: '/medical/obs/basic' },
          { label: '고위험 임신클리닉', path: '/medical/obs/high-risk' },
          { label: '태아초음파(3D)', path: '/medical/obs/ultrasound' },
          { label: '예방접종', path: '/medical/obs/vaccination' },
        ]}
      />

      {/* ③ 여성센터 */}
      <MobileSection
        sectionRef={(el) => mobileRefs.current[3] = el}
        engLabel="WOMEN'S CENTER"
        title={<><span className="text-brand-secondary text-[24px]">여성을 위한</span><br/>전문 집중 케어</>}
        subtitle="복강경 수술부터 갱년기 관리까지, 여성 건강의 모든 것을 책임집니다."
        bgColor="#FAF7F5"
        gradientFrom="#F5EEF0"
        bgImage="/images/women_center_bg.png"
        navigate={navigate}
        tabs={[
          { label: '복강경 수술', path: '/medical/gyn/laparoscopy' },
          { label: '자궁경 수술', path: '/medical/gyn/hysteroscopy' },
          { label: '여성암 정밀 검진', path: '/medical/gyn/cancer' },
          { label: '질염 / 골반염 / 방광염', path: '/medical/gyn/inflammation' },
          { label: '갱년기 / 폐경기 관리', path: '/medical/gyn/menopause' },
          { label: '유방 맘모톰', path: '/medical/gyn/mammotome' },
          { label: '요실금 / 성형수술', path: '/medical/gyn/incontinence-plastic' },
        ]}
      />

      {/* ④ 내과·종합검진센터 */}
      <MobileSection
        sectionRef={(el) => mobileRefs.current[4] = el}
        engLabel="HEALTH CHECK"
        title={<><span className="text-brand-secondary text-[24px]">조기 예방의 힘,</span><br/>내과 종합검진</>}
        subtitle="국가 5대 암 검진 지정 기관. 위·대장 내시경부터 맞춤 종합검진으로 건강을 지킵니다."
        bgColor="#FFFFFF"
        gradientFrom="#F0F4F8"
        bgImage="/images/internal_center_bg.png"
        navigate={navigate}
        tabs={[
          { label: '국가 건강검진', path: '/medical/internal/national' },
          { label: '맞춤 종합 검진', path: '/medical/internal/comprehensive' },
          { label: '채용 신체검사', path: '/medical/internal/employment' },
          { label: '위/대장 내시경', path: '/medical/internal/endoscopy' },
          { label: '초음파', path: '/medical/internal/us-exam' },
          { label: '만성질환클리닉', path: '/medical/internal/chronic' },
          { label: '수액요법', path: '/medical/internal/iv-therapy' },
        ]}
      />

      {/* ⑤ 외국인 여성센터 */}
      <MobileSection
        sectionRef={(el) => mobileRefs.current[5] = el}
        engLabel="INTERNATIONAL"
        title={<><span className="text-brand-secondary text-[24px]">언어 장벽 없는</span><br/>외국인 특화 진료</>}
        subtitle="남양주 외국인 산모를 위한 다국어 의료 서비스. 언어 장벽 없는 따뜻한 진료를 제공합니다."
        bgColor="#FFF8F6"
        gradientFrom="#FFE8E0"
        bgImage="/images/international_clinic_main.png"
        navigate={navigate}
        tabs={[
          { label: '센터 소개', path: '/international-women/intro' },
          { label: '6대 핵심 실행 전략', path: '/international-women/strategies' },
          { label: '산모교실 및 커뮤니티', path: '/international-women/class-community' }
        ]}
      />

      {/* ⑥ 산후조리원 */}
      <MobileSection
        sectionRef={(el) => mobileRefs.current[6] = el}
        engLabel="POSTPARTUM CARE"
        title={<><span className="text-brand-secondary text-[24px]">가장 아름다운 회복,</span><br/>메디피아 조리원</>}
        subtitle="산모의 완전한 회복과 신생아의 안전을 한 공간에서. 생애 가장 아름다운 회복의 시간."
        bgColor="#FAF7F5"
        gradientFrom="#F5EDE8"
        bgImage="/images/postpartum_bg.png"
        navigate={navigate}
        tabs={[
          { label: '프로그램 안내', path: '/postpartum/program' },
          { label: '예약 및 비용', path: '/postpartum/rooms' },
        ]}
      />

      {/* ⑦ 상담/안내 */}
      <section ref={(el) => mobileRefs.current[7] = el} className="lg:hidden snap-section min-h-screen flex flex-col relative" style={{ backgroundColor: '#FFFFFF' }}>
        {/* 상단 프레임 이미지 카드 */}
        <div className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-md" style={{ height: '38vh', flexShrink: 0 }}>
          <img
            src="/images/consultation_main.png"
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="flex flex-col justify-end px-7 pt-5 pb-8 relative z-10"
          style={{ minHeight: '22vh' }}
        >
          <p className="section-eng-label text-brand-secondary mb-3 drop-shadow-sm scale-typography-left">CONSULTATION</p>
          <div className="w-10 h-[2px] bg-brand-secondary mb-6 shadow-sm" />
          <h2 className="serif-title text-[28px] font-bold text-brand-primary dark:text-white leading-snug mb-4 scale-typography-left">
            <span className="text-brand-secondary text-[24px]">소중한 만남,</span><br/>상담 안내
          </h2>
          <p className="text-brand-primary/60 dark:text-gray-400 text-[14px] leading-relaxed scale-typography-left">
            병원 이용이 처음이신가요? 어떤 질문이든 친절히 안내해 드리겠습니다.
          </p>
        </div>
        <div className="flex-1 px-5 py-8 space-y-4 pb-24">
          <button
            onClick={() => navigate('/consultation')}
            className="w-full py-5 bg-brand-secondary text-white font-bold text-[14px] rounded-2xl flex items-center justify-center gap-2 active:opacity-80 scale-typography"
          >
            💬 궁금한 점을 남겨주시면 따뜻하게 답해드립니다 <ArrowRight size={18} />
          </button>
          <div className="bg-brand-light dark:bg-brand-darkCard rounded-2xl p-6 space-y-4 border border-brand-secondary/10">
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-brand-accent font-medium">평일</span>
              <span className="text-brand-primary font-bold">09:00 – 18:00</span>
            </div>
            <div className="w-full h-px bg-brand-secondary/10" />
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-brand-accent font-medium">토요일</span>
              <span className="text-brand-primary font-bold">09:00 – 16:00</span>
            </div>
            <div className="w-full h-px bg-brand-secondary/10" />
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-brand-accent font-medium">응급·분만</span>
              <span className="text-brand-secondary font-bold">365일 24시간</span>
            </div>
            <div className="w-full h-px bg-brand-secondary/10" />
            <div className="flex justify-between items-center">
              <span className="text-brand-accent font-medium text-[14px]">전화</span>
              <a href="tel:031-595-8400" className="text-brand-secondary font-black text-[18px] tracking-wide">
                031-595-8400
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ⑧ 메디피아 소식 */}
      <section ref={(el) => mobileRefs.current[8] = el} className="lg:hidden min-h-screen flex flex-col relative" style={{ backgroundColor: '#FAF7F5' }}>
        <div
          className="flex flex-col justify-end px-7 pt-24 pb-8 relative z-10"
          style={{ background: 'linear-gradient(160deg, #F0EAE4B0 0%, #FAF7F5FA 100%)', minHeight: '40vh' }}
        >
          <p className="section-eng-label text-brand-secondary mb-3 drop-shadow-sm scale-typography-left">HOSPITAL NEWS</p>
          <div className="w-10 h-[2px] bg-brand-secondary mb-6 shadow-sm" />
          <h2 className="serif-title text-[28px] font-bold text-brand-primary dark:text-white leading-snug mb-4 scale-typography-left">
            <span className="text-brand-secondary text-[24px]">유익한 정보,</span><br/>메디피아 소식
          </h2>
          <p className="text-brand-primary/60 dark:text-gray-400 text-[14px] leading-relaxed scale-typography-left">
            새로운 소식과 건강 정보를 전해드립니다.
          </p>
        </div>
        <div className="flex-1 px-5 py-6 space-y-3 pb-24">
          {recentNotices.map(item => (
            <button
              key={item.id}
              onClick={() => navigate('/community')}
              className="w-full text-left px-5 py-5 bg-white/80 hover:bg-white rounded-2xl border border-brand-secondary/15 hover:border-brand-secondary/30 transition-all"
            >
              <p className="text-brand-accent text-[11px] font-medium mb-1.5">{item.date}</p>
              <p className="text-brand-primary font-semibold text-[14px] leading-snug">{item.title}</p>
            </button>
          ))}
          <button
            onClick={() => navigate('/community')}
            className="w-full py-4 border-2 border-brand-secondary/40 text-brand-secondary font-bold text-[13px] rounded-2xl flex items-center justify-center gap-2 mt-2"
          >
            소식 전체 보기 <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* 하단 고정 Floating CTA 바 */}
      <MobileFloatingBar navigate={navigate} />

    </div>
  );
};

const PostpartumPage: React.FC = () => {
  const { sub } = useParams();
  const navigate = useNavigate();

  const renderContent = () => {
    switch (sub) {
      case 'program':
        return (
          <div className="animate-fade-in-up space-y-10 md:space-y-20">
            <div className="space-y-4 border-b border-brand-primary/10 pb-10">
              <span className="text-brand-secondary font-black text-[11px] tracking-[0.4em] uppercase">Specialized Recovery System</span>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-brand-primary">산후조리원 전문 프로그램 안내</h3>
              <p className="text-brand-primary/60 font-bold max-w-2xl leading-relaxed">
                산모님의 빠른 회복과 아기의 건강한 성장을 위해 분야별 전문가들이 구성한 체계적인 교육 및 케어 시스템입니다.
              </p>
            </div>

            {/* 산후조리원 프로그램 5가지: 주기의 시각적 구분을 원칙으로 레이아웃 구성 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8">
              {POSTPARTUM_PROGRAM.scheduleEvents.map((ev, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[20px] md:rounded-[32px] border border-brand-primary/5 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group hover-lift flex flex-col"
                >
                  {/* 상단 이미지 — 16:10 비율, 사람 없는 편안한 분위기 */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                    <img
                      src={ev.image}
                      alt={ev.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* 하단 그라디언트 — 이미지→컬러헤더 자연스럽게 연결 */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/2"
                      style={{ background: `linear-gradient(to top, ${ev.color}, transparent)` }}
                    />
                    {/* 주기 배지 — 이미지 우하단 오버레이 */}
                    <span
                      className="absolute bottom-3 right-4 px-3 py-1 rounded-full text-[11px] font-black shadow-md backdrop-blur-sm"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.92)',
                        color: ev.textColor,
                        border: `1.5px solid ${ev.textColor}50`,
                      }}
                    >
                      {ev.cycle}
                    </span>
                  </div>

                  {/* 컬러 헤더 띠 — 프로그램 아이콘 */}
                  <div
                    className="px-5 py-3.5 flex items-center gap-3"
                    style={{ backgroundColor: ev.color }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: `${ev.textColor}20` }}
                    >
                      <Baby size={16} style={{ color: ev.textColor }} />
                    </div>
                    <span
                      className="text-[10px] font-black tracking-[0.2em] uppercase"
                      style={{ color: ev.textColor }}
                    >
                      Postpartum Program
                    </span>
                  </div>

                  {/* 본체 */}
                  <div className="p-5 md:p-6 flex-1 flex flex-col gap-3">
                    <h4 className="text-lg md:text-xl font-black text-brand-primary group-hover:text-brand-secondary transition-colors">
                      {ev.name}
                    </h4>
                    <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: ev.textColor }} />
                    <p className="text-brand-primary/65 font-medium text-[13px] md:text-[14px] leading-[1.8] flex-1">
                      {ev.desc}
                    </p>
                    <div className="pt-3 border-t border-brand-light flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-brand-secondary shrink-0" />
                      <span className="text-[11px] font-black text-brand-primary/35 uppercase tracking-wider">Medical Professional Led</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>


            {/* 에스테틱 항목 별도 안내 부스터 */}
            <div className="bg-white border border-brand-secondary/15 rounded-[20px] md:rounded-[32px] p-6 md:p-10 space-y-5 shadow-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-brand-light">
                <div className="w-9 h-9 rounded-xl bg-brand-secondary/10 flex items-center justify-center shrink-0">
                  <Heart size={18} className="text-brand-secondary" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.3em]">Free Aesthetic Service</p>
                  <h4 className="text-base md:text-lg font-black text-brand-primary">무료 에스테틱 서비스</h4>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-black text-brand-primary/40 uppercase tracking-widest mb-3">1~2주 공통 제공</p>
                  {["샴푸 후 림프 순환", "가슴 림프 순환 (모유량 조절)", "등 스트레칭 관리"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 size={14} className="text-brand-secondary shrink-0" />
                      <span className="font-bold text-[13px] text-brand-primary/80">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-black text-brand-primary/40 uppercase tracking-widest mb-3">2주 입실 추가 제공</p>
                  {["가슴 울혈 관리", "복부 고주파 (자궁수축)", "경혈 전신 관리"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 size={14} className="text-brand-secondary shrink-0" />
                      <span className="font-bold text-[13px] text-brand-primary/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'rooms':
        return (
          <div className="animate-fade-in-up space-y-8 md:space-y-16">
            <div className="space-y-4 border-b border-brand-primary/10 pb-10">
              <span className="text-brand-secondary font-black text-[11px] tracking-[0.4em] uppercase">Reservation & Pricing</span>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-brand-primary">예약 및 비용 안내</h3>
            </div>

            {/* 예약 안내 */}
            <div className="bg-white border border-brand-primary/5 rounded-[20px] md:rounded-[40px] shadow-xl p-5 md:p-10 lg:p-14 space-y-6 hover-glow">
              <h4 className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.3em] border-b border-brand-light pb-4">예약 안내</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brand-light rounded-3xl p-6 text-center space-y-2">
                  <p className="text-[11px] font-black text-brand-primary/40 uppercase tracking-widest">예약 방법</p>
                  <p className="font-black text-brand-primary text-base">{POSTPARTUM_PROGRAM.reservation.method}</p>
                  <p className="text-brand-secondary font-bold text-sm">{POSTPARTUM_PROGRAM.reservation.phone}</p>
                </div>
                <div className="bg-brand-light rounded-3xl p-6 text-center space-y-2">
                  <p className="text-[11px] font-black text-brand-primary/40 uppercase tracking-widest">예약금</p>
                  <p className="font-black text-brand-primary text-base">{POSTPARTUM_PROGRAM.reservation.deposit}</p>
                </div>
                <div className="bg-brand-light rounded-3xl p-6 text-center space-y-2">
                  <p className="text-[11px] font-black text-brand-primary/40 uppercase tracking-widest">입실 연장</p>
                  <p className="font-black text-brand-primary text-base">{POSTPARTUM_PROGRAM.reservation.extension}</p>
                </div>
              </div>
              <div className="mt-4 p-5 bg-brand-light/50 rounded-2xl border border-brand-primary/10">
                <p className="text-brand-primary/80 font-bold text-sm md:text-base flex items-start gap-2">
                  <span className="text-brand-secondary">※</span> 
                  아기사진과 에스테틱은 산후조리원 협력업체이므로 배상과 실책문제는 본원의 산후조리원과 무관합니다.
                </p>
              </div>
            </div>

            {/* 이용 금액 */}
            <div className="bg-white border border-brand-primary/5 rounded-[20px] md:rounded-[40px] shadow-xl p-5 md:p-10 lg:p-14 space-y-6 hover-glow">
              <h4 className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.3em] border-b border-brand-light pb-4">이용 금액</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {POSTPARTUM_PROGRAM.pricing.map((plan: any, idx: number) => (
                  <div key={idx} className="rounded-[20px] md:rounded-[32px] border border-brand-primary/10 overflow-hidden hover-lift">
                    <div className="bg-brand-primary p-5 md:p-8 text-center">
                      <p className="text-brand-secondary font-black text-[11px] uppercase tracking-widest mb-2">{plan.name}</p>
                      <p className="text-white font-black text-2xl md:text-3xl lg:text-4xl">{plan.price}</p>
                    </div>
                    <div className="p-5 md:p-8 space-y-3">
                      <p className="text-[11px] font-black text-brand-primary/40 uppercase tracking-widest mb-4">할인 혜택</p>
                      {plan.discounts.map((d: string, i: number) => (
                        <div key={i} className="flex gap-3 items-start">
                          <CheckCircle2 size={16} className="text-brand-secondary shrink-0 mt-0.5" />
                          <p className="font-bold text-sm text-brand-primary">{d}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 환불 규정 */}
            <div className="bg-white border border-brand-primary/5 rounded-[20px] md:rounded-[40px] shadow-xl p-5 md:p-10 lg:p-14 space-y-6 hover-glow">
              <h4 className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.3em] border-b border-brand-light pb-4">환불 규정</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-light">
                      <th className="py-4 px-6 text-left font-black text-brand-primary/60 text-[11px] uppercase tracking-widest rounded-l-2xl">취소 시점</th>
                      <th className="py-4 px-6 text-left font-black text-brand-primary/60 text-[11px] uppercase tracking-widest rounded-r-2xl">환불 기준</th>
                    </tr>
                  </thead>
                  <tbody>
                    {POSTPARTUM_PROGRAM.refundPolicy.map((row: any, idx: number) => (
                      <tr key={idx} className="border-b border-brand-light last:border-0">
                        <td className="py-4 px-6 font-bold text-brand-primary">{row.period}</td>
                        <td className="py-4 px-6 font-black text-brand-secondary">{row.refund}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 상담 CTA */}
            <div className="bg-brand-primary rounded-[20px] md:rounded-[40px] p-6 md:p-12 text-center space-y-4 md:space-y-6">
              <p className="text-white/60 font-black text-[11px] uppercase tracking-widest">문의 및 예약</p>
              <p className="text-white font-bold text-lg">입실 가능 일정 및 상세 안내는 전화로 문의해 주세요.</p>
              <PhoneConsultButton className="max-w-xs mx-auto" />
            </div>
          </div>
        );


      case 'reviews':
        return (
          <div className="animate-fade-in-up space-y-10 md:space-y-16">
            <div className="space-y-4 border-b border-brand-primary/10 pb-10">
              <span className="text-brand-secondary font-black text-[11px] tracking-[0.4em] uppercase">Real Reviews</span>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-brand-primary">이용 후기</h3>
              <p className="text-brand-primary/60 font-bold max-w-2xl leading-relaxed">
                메디피아 산후조리원을 이용하신 산모님들의 생생한 후기를 확인하세요.
              </p>
            </div>

            <ReviewBoard />
          </div>
        );

      default:
        return (
          <div className="animate-fade-in-up py-32 text-center">
            <p className="text-brand-primary/30 font-black text-[12px] uppercase tracking-widest">Please select a menu above.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-brand-light min-h-screen pb-20 lg:pb-32">
      <PageHero 
        category="Heritage Haven Care"
        title={
          <>
            생애 가장 아름다운<br />회복의 시간
          </>
        }
        description="산모님의 온전한 휴식과 신생아의 안전을 위한 전문적인 산후 케어를 제공합니다. 메디피아 산후조리원은 단순한 휴식을 넘어 '건강한 가족의 시작'을 설계합니다."
        imageSrc={POSTPARTUM_MAIN_IMAGE}
      />
      <div className="max-w-[1300px] mx-auto px-4 md:px-6">
        <div className="mb-4 md:mb-20 flex gap-4 md:gap-6 lg:gap-10 border-b border-brand-primary/5 pb-2 md:pb-6 overflow-x-auto overflow-y-hidden touch-pan-x no-scrollbar">
         {['프로그램', '예약 및 비용 안내', '이용 후기'].map((label, idx) => {
             const paths = ['/postpartum/program', '/postpartum/rooms', '/postpartum/reviews'];
             const isActive = sub ? paths[idx].endsWith(sub) : false;
             return (
               <button key={label} onClick={() => navigate(paths[idx])} className={`text-[14px] md:text-[15px] font-bold tracking-wide transition-all relative whitespace-nowrap py-2 ${isActive ? 'text-brand-secondary' : 'text-brand-primary/50 hover:text-brand-primary'}`}>
                 {label}
                 {isActive && <span className="absolute -bottom-[18px] md:-bottom-[26px] left-0 w-full h-[2px] bg-brand-secondary"></span>}
               </button>
             )
           })}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

const BrandPage: React.FC = () => {
  const { sub } = useParams();
  const navigate = useNavigate();

  const renderContent = () => {
    switch (sub) {
      case undefined:
      case 'greeting':
        return (
          <div className="animate-fade-in-up space-y-12 pt-12">
            <h3 className="text-xl md:text-2xl font-bold text-brand-primary">대표 인사말</h3>
            <div className="bg-white border border-brand-primary/5 rounded-[20px] md:rounded-[40px] shadow-xl p-5 md:p-10 lg:p-16 space-y-8 hover-glow">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="flex-1 space-y-6">
                  <p className="text-brand-secondary font-black text-[11px] tracking-[0.3em] uppercase">Message from Director</p>
                  <p className="text-brand-primary/80 font-bold text-base md:text-lg leading-[2]">
                    소중한 당신,<br /><br />
                    여성의 건강한 삶, 메디피아가 언제나 함께 하겠습니다.<br /><br />
                    메디피아는 여성의 건강과 행복한 삶을 위하여 최고의 의료진과 풍부한 경험을 바탕으로 최선을 다할 것을 약속 드립니다.<br /><br />
                    소중한 탄생 그리고 새로운 시작을 위해 안전한 응급 의료 시스템, 전문화된 진료 시스템을 통해 최상의 의료 서비스를 제공할 것을 약속 드립니다.<br /><br />
                    저희 병원을 찾아주시는 모든 분께 건강과 축복이 함께 하시길 기원하겠습니다.<br /><br />
                    감사합니다.
                  </p>
                  <div className="pt-4 border-t border-brand-light">
                    <p className="font-black text-brand-primary text-lg">한 상 철</p>
                    <p className="text-brand-primary/50 font-bold text-sm mt-1">메디피아산부인과 대표원장 · 산부인과 전문의</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'hours':
        return (
          <div className="animate-fade-in-up space-y-10 pt-12">
            <h3 className="text-xl md:text-2xl font-bold text-brand-primary">진료시간 안내</h3>
            <div className="bg-white border border-brand-primary/5 rounded-[20px] md:rounded-[40px] shadow-xl p-4 md:p-6 md:p-10 lg:p-16 space-y-8 md:space-y-10 hover-glow">

              {/* 외래 테이블 */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.3em] border-b border-brand-light pb-2">외래 산부인과 / 내과</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse min-w-[340px]">
                    <thead>
                      <tr className="bg-brand-light">
                        <th className="border border-brand-primary/10 px-3 py-2 text-brand-primary/60 font-black text-[11px] w-16"></th>
                        <th className="border border-brand-primary/10 px-3 py-2 text-brand-primary font-black text-[12px]">월</th>
                        <th className="border border-brand-primary/10 px-3 py-2 text-brand-primary font-black text-[12px]">화</th>
                        <th className="border border-brand-primary/10 px-3 py-2 text-brand-primary font-black text-[12px]">수</th>
                        <th className="border border-brand-primary/10 px-3 py-2 text-brand-primary font-black text-[12px]">목</th>
                        <th className="border border-brand-primary/10 px-3 py-2 text-brand-primary font-black text-[12px]">금</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-brand-primary/10 px-3 py-3 text-brand-primary font-black text-[12px] bg-brand-light/50 text-center">평일</td>
                        <td colSpan={5} className="border border-brand-primary/10 px-3 py-3 text-center">
                          <p className="text-brand-secondary font-black text-sm">09:00 ~ 18:00</p>
                          <p className="text-brand-primary/50 font-bold text-[11px]">(점심 13:00 ~ 14:00)</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-brand-primary/10 px-3 py-3 text-brand-primary font-black text-[12px] bg-brand-light/50 text-center">토요일</td>
                        <td colSpan={5} className="border border-brand-primary/10 px-3 py-3 text-center">
                          <p className="text-brand-secondary font-black text-sm">09:00 ~ 16:00</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-brand-primary/10 px-3 py-3 text-brand-primary font-black text-[12px] bg-brand-light/50 text-center">일요일</td>
                        <td colSpan={5} className="border border-brand-primary/10 px-3 py-3 text-center">
                          <p className="text-brand-primary/40 font-black text-sm">휴진</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 야간·공휴일 테이블 */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.3em] border-b border-brand-light pb-2">산부인과 야간진료 · 일요일 · 공휴일 진료</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse min-w-[340px]">
                    <thead>
                      <tr className="bg-brand-light">
                        <th className="border border-brand-primary/10 px-3 py-2 text-brand-primary/60 font-black text-[11px] w-24">구분</th>
                        <th className="border border-brand-primary/10 px-3 py-2 text-brand-primary font-black text-[12px]">시간</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: '평일 야간', time: '18:00 ~ 20:00', note: '' },
                        { label: '토요일 야간', time: '16:00 ~ 19:00', note: '' },
                        { label: '일요일·공휴일', time: '10:00 ~ 13:00', note: '17:00 ~ 야간진료' },
                      ].map(({ label, time, note }) => (
                        <tr key={label}>
                          <td className="border border-brand-primary/10 px-3 py-3 text-brand-primary font-black text-[12px] bg-brand-light/50 text-center">{label}</td>
                          <td className="border border-brand-primary/10 px-3 py-3 text-center">
                            <p className="text-brand-secondary font-black text-sm">{time}</p>
                            {note && <p className="text-brand-primary/50 font-bold text-[11px]">{note}</p>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 응급진료 */}
              <div className="bg-brand-primary rounded-3xl p-6 flex items-center gap-6">
                <div className="w-12 h-12 bg-brand-secondary rounded-2xl flex items-center justify-center shrink-0">
                  <Heart size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-black text-white text-sm">응급진료 · 분만</p>
                  <p className="text-white/70 font-bold text-sm mt-1">
                    - 365일 24시간 연중무휴 대응<br/>
                    - 산과 전문의 원내 상주
                  </p>
                </div>
              </div>

              {/* 야간진료 변동 안내 문구 */}
              <div className="bg-brand-light rounded-3xl p-5 mt-6">
                <p className="text-brand-secondary font-bold text-[13px] md:text-[14px] leading-relaxed text-center">
                  ※ 야간진료시간은 병원사정에 따라 변동될 수 있으니 전화 확인 후 내원하여 주시기 바랍니다.
                </p>
              </div>

            </div>
          </div>
        );


      case 'location':

        return (
          <div className="animate-fade-in-up space-y-16">
              <h3 className="text-xl md:text-2xl font-bold text-brand-primary">오시는 길</h3>
             <div className="bg-white border border-brand-primary/5 rounded-[20px] md:rounded-[40px] shadow-xl p-5 md:p-10 lg:p-16 hover-glow">
                <div className="rounded-[20px] md:rounded-[32px] mb-8 md:mb-12 overflow-hidden shadow-sm" style={{height: 'clamp(240px, 35vh, 420px)'}}>
                  <iframe
                    src="https://maps.google.com/maps?q=%EB%A9%94%EB%94%94%ED%94%BC%EC%95%84%EC%82%B0%EB%B6%80%EC%9D%B8%EA%B3%BC+%EA%B2%BD%EA%B8%B0%EB%8F%84+%EB%82%A8%EC%96%91%EC%A3%BC%EC%8B%9C+%EA%B2%BD%EC%B6%98%EB%A1%9C+1511&t=&z=17&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="메디피아산부인과 위치 — 경기도 남양주시 경춘로 1511"
                  />
                </div>

                <div className="mb-8 p-6 bg-brand-light rounded-[24px] flex items-start gap-4">
                  <MapPin size={24} className="text-brand-secondary shrink-0 mt-1" />
                  <div>
                    <p className="font-black text-brand-primary text-lg">{HOSPITAL_INFO.address}</p>
                    <a 
                      href="https://map.kakao.com/link/search/메디피아산부인과" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-secondary font-bold text-sm mt-2 inline-block hover:underline"
                    >
                      카카오맵에서 보기 →
                    </a>
                  </div>
                </div>
                 <div className="space-y-6">
                   {/* 버스 1 */}
                   <div className="space-y-2">
                     <h5 className="font-black text-brand-primary text-[13px] uppercase tracking-widest flex items-center gap-2">
                       <Bus size={16} className="text-brand-secondary" /> 버스 — '구룡터·효성해링턴플레이스' 정류장
                     </h5>
                     <p className="text-brand-primary/60 font-bold text-sm leading-relaxed">
                       하차 후 마석방면으로 400m<br />
                       <span className="text-brand-primary/40">좌석버스: 1000-1, 1200, 1200-1, 1330-2, 1330-3, 1330-4, 1330-44</span><br />
                       <span className="text-brand-primary/40">일반버스: 1-4, 30, 55, 65, 65-1, 168</span>
                     </p>
                   </div>
                   {/* 버스 2 */}
                   <div className="space-y-2">
                     <h5 className="font-black text-brand-primary text-[13px] uppercase tracking-widest flex items-center gap-2">
                       <Bus size={16} className="text-brand-secondary" /> 버스 — '호평중흥S클래스.한라·주공APT' 정류장
                     </h5>
                     <p className="text-brand-primary/60 font-bold text-sm leading-relaxed">
                       하차 후 중흥·주공아파트 사잇길로 200m → 오른쪽 언덕길<br />
                       <span className="text-brand-primary/40">좌석버스: 1000, 1000-1, 1100, M2323</span><br />
                       <span className="text-brand-primary/40">일반버스: 93, 97, 165</span>
                     </p>
                   </div>
                   {/* 지하철 */}
                   <div className="space-y-2">
                     <h5 className="font-black text-brand-primary text-[13px] uppercase tracking-widest flex items-center gap-2">
                       <MapPin size={16} className="text-brand-secondary" /> 지하철 — 경춘선 '평내호평역'
                     </h5>
                     <p className="text-brand-primary/60 font-bold text-sm leading-relaxed">
                       평내방면 출구 이용<br />
                       <span className="text-brand-primary/40">→ '평내호평역(두산알프하임입구 방면)' 정류장에서 버스 환승</span>
                     </p>
                   </div>
                   {/* 자가용 */}
                   <div className="space-y-2">
                     <h5 className="font-black text-brand-primary text-[13px] uppercase tracking-widest flex items-center gap-2">
                       <Car size={16} className="text-brand-secondary" /> 자가용 — 본원 주차장 이용
                     </h5>
                     <p className="text-brand-primary/60 font-bold text-sm leading-relaxed">
                       내비게이션 '메디피아산부인과' 또는 '경기도 남양주시 경춘로 1511' 검색<br />
                       <span className="text-brand-primary/40">☎ 031-595-8400 (응급의 경우 언제든 연락주십시오.)</span>
                     </p>
                   </div>
                 </div>
               </div>
             </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-brand-light min-h-screen">
      <PageHero
        category="About MEDIPIA"
        title={
          <>
            생명의 경외심을 바탕으로<br />당신 곁에 함께합니다
          </>
        }
        description="저희는 생명의 경외심을 바탕으로 환자 한 분 한 분의 고귀한 삶을 존중해 왔습니다."
        videoSrc={HOME_HERO_VIDEO}
      />
      <div className="max-w-[1300px] mx-auto px-4 md:px-6 pb-20">
        <div className="mb-4 md:mb-20 flex gap-3 md:gap-6 lg:gap-10 border-b border-brand-primary/5 pb-2 md:pb-6 overflow-x-auto overflow-y-hidden touch-pan-x no-scrollbar">
          {['대표 인사말', '의료진소개', '진료시간', '오시는 길'].map((label, idx) => {
            const paths = ['/brand', '/medical/staff', '/brand/hours', '/brand/location'];
            const isActive = (!sub && idx === 0) || (sub && paths[idx].includes(sub));
            return (
              <button key={label} onClick={() => navigate(paths[idx])} className={`text-[14px] md:text-[15px] font-bold tracking-wide transition-all relative whitespace-nowrap py-2 ${isActive ? 'text-brand-secondary' : 'text-brand-primary/50 hover:text-brand-primary'}`}>
                {label}
                {isActive && <span className="absolute -bottom-[18px] md:-bottom-[26px] left-0 w-full h-[2px] bg-brand-secondary"></span>}
              </button>
            )
          })}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

// Display detailed medical service info
// Display detailed medical service info
const MedicalServicePage: React.FC = () => {
  const { service } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  let data = service ? { ...SUB_SERVICE_DETAILS[service] } : null;
  const [showSchedule, setShowSchedule] = React.useState(false);
  const [showDetailGuide, setShowDetailGuide] = React.useState(false);

  // 다국어 상태 관리 (localStorage 및 medipia_lang_changed 이벤트 연동)
  const [lang, setLangState] = React.useState<SupportedLanguage>(() => {
    return (localStorage.getItem('medipia_lang') as SupportedLanguage) || 'ko';
  });

  const setLang = (newLang: SupportedLanguage) => {
    localStorage.setItem('medipia_lang', newLang);
    setLangState(newLang);
    window.dispatchEvent(new Event('medipia_lang_changed'));
  };

  React.useEffect(() => {
    const handleLangChange = () => {
      const stored = (localStorage.getItem('medipia_lang') as SupportedLanguage) || 'ko';
      setLangState(stored);
    };
    window.addEventListener('medipia_lang_changed', handleLangChange);
    return () => window.removeEventListener('medipia_lang_changed', handleLangChange);
  }, []);

  // 현재 접속한 경로의 부모 메뉴 항목(NAV_ITEMS 기준) 찾기
  const parentNavItem = NAV_ITEMS.find(item => item.children?.some(child => child.path === location.pathname));

  if (!data) return <div className="py-40 text-center font-bold text-brand-primary/30 uppercase tracking-widest">Service Not Found</div>;

  // 다국어 데이터 바인딩
  if (data.category === "INTERNATIONAL CLINIC") {
    const t = TRANSLATIONS[lang];
    if (t) {
      if (service === 'intro') {
        data.title = t.heroTitle;
        data.intro = t.heroIntro;
        data.description = t.visionDesc;
        data.items = t.strategies.slice(0, 3).map((s: any) => ({
          title: s.title,
          detail: s.desc
        }));
      } else if (service === 'strategies') {
        const titleMap: Record<string, string> = {
          ko: "6대 핵심 실행 전략",
          en: "6 Core Implementation Strategies",
          ja: "6대核心実行戦略",
          vi: "6 Chiến lược thực hiện cốt lõi",
          th: "6 กลยุทธ์การดำเนินงานหลัก"
        };
        const introMap: Record<string, string> = {
          ko: "외국인 산모들이 안심하고 진료받을 수 있도록 메디피아가 실천하는 6대 핵심 전략입니다.",
          en: "Here are the 6 core strategies practiced by Medipia so that foreign mothers can receive treatment with peace of mind.",
          ja: "外国人妊婦さんが安心して診療を受けられるように메디ピア가 실천하는 6대 핵심 전략입니다.",
          vi: "Dưới đây là 6 chiến lược cốt lõi được Medipia thực hiện để các bà mẹ nước ngoài có thể yên tâm điều trị.",
          th: "นี่คือ 6 กลยุทธ์หลักที่ดำเนินการโดย เมดิเปีย เพื่อให้มารดาชาวต่างชาติได้รับการรักษาด้วยความอุ่นใจ"
        };
        data.title = titleMap[lang] || titleMap['ko'];
        data.intro = introMap[lang] || introMap['ko'];
        data.items = t.strategies.map((s: any) => ({
          title: s.title,
          detail: s.desc
        }));
      } else if (service === 'class-community') {
        data.title = t.maternityTitle;
        data.intro = t.maternityDesc;
        data.description = lang === 'ko' 
          ? "메디맘스 출산준비교실은 외국인 산모를 위한 다국어 자료 및 소그룹 클래스 운영을 통해 건강한 출산과 육아를 준비하도록 지원합니다.\n\n각 과정은 한국어 외 영어, 베트남어, 일본어, 태국어 등 다국어 자료를 제공하며, 소규모 그룹 형태로 진행되어 보다 밀착된 교육이 가능합니다."
          : (lang === 'en'
            ? "The Medimoms Childbirth Preparation Class supports foreign mothers in preparing for healthy childbirth and parenting through multilingual materials and small group classes.\n\nEach course provides multilingual materials in English, Vietnamese, Japanese, and Thai in addition to Korean, and is conducted in a small group format for closer education."
            : (lang === 'ja'
              ? "メディマムズ出産準備教室は、外国人妊婦さんのための多言語資料や小グループクラス의 운영을 통해 건강한 출산과 육아를 준비하도록 지원합니다.\n\n각 과정은 한국어 외 영어, 베트남어, 일본어, 태국어 등 다국어 자료를 제공하며, 소규모 그룹 형태로 진행되어 보다 밀착된 교육이 가능합니다."
              : (lang === 'vi'
                ? "Lớp học chuẩn bị sinh Medimoms hỗ trợ các bà mẹ nước ngoài chuẩn bị cho việc sinh nở và nuôi dạy con cái khỏe mạnh thông qua các tài liệu đa ngôn ngữ 및 các lớp học nhóm nhỏ.\n\nMỗi khóa học cung급 các tài liệu đa ngôn ngữ bằng tiếng Anh, tiếng Việt, tiếng Nhật và tiếng Thái ngoài tiếng Hàn, đồng thời được tiến hành dưới dạng nhóm nhỏ để giáo dục chặt chẽ hơn."
                : "คลาสเตรียมคลอด Medimoms สนับสนุนมารดาชาวต่างชาติในการเตรียมตัวสำหรับการคลอดบุตรและการเลี้ยงดูบุตรอย่างมีสุขภาพดี ผ่านสื่อการเรียนรู้หลายภาษาและคลาสเรียนกลุ่มย่อย\n\nแต่ละหลักสูตรมีสื่อการเรียนรู้หลายภาษาในภาษาอังกฤษ เวียดนาม ญี่ปุ่น และไทย นอกเหนือจากภาษาเกาหลี 및 ดำเนินการในรูปแบบกลุ่มย่อยเพื่อการเรียนรู้อย่างใกล้ชิดยิ่ง시")));
        data.items = t.maternityClasses.map((c: any) => ({
          title: c.title,
          detail: c.desc
        }));
      } else if (service === 'guide') {
        const titleMap: Record<string, string> = {
          ko: "진료 및 비용 안내",
          en: "Treatment & Cost Guide",
          ja: "診療および費用案内",
          vi: "Hướng dẫn điều trị & chi phí",
          th: "คำแนะนำการรักษาและค่าใช้จ่าย"
        };
        data.title = titleMap[lang] || titleMap['ko'];
        data.intro = t.guideDesc;
        data.infoBox = t.guideDetails.map((detail: any) => ({
          title: detail.title,
          contents: detail.contents
        }));
        const checkupTableMap: Record<string, any[]> = {
          ko: [
            { name: "임신 초기(1~12주)", target: "산전 검사 및 1차 기형아 검사", cycle: "필수" },
            { name: "임신 중기(13~28주)", target: "2차 기형아 검사, 정밀 초음파, 임신성 당뇨 검사", cycle: "필수" },
            { name: "임신 후기(29주~)", target: "막달 검사 및 태동 검사(NST)", cycle: "필수" }
          ],
          en: [
            { name: "1st Trimester (1~12 weeks)", target: "Prenatal screening & 1st anomaly test", cycle: "Essential" },
            { name: "2nd Trimester (13~28 weeks)", target: "2nd anomaly, anatomy ultrasound, gestational diabetes screening", cycle: "Essential" },
            { name: "3rd Trimester (29 weeks~)", target: "Late pregnancy tests & Non-stress test (NST)", cycle: "Essential" }
          ],
          ja: [
            { name: "妊娠初期(1~12週)", target: "妊婦健診および第1次奇形児検査", cycle: "必須" },
            { name: "妊娠中期(13~28週)", target: "第2次奇形児検査、精密超音波、妊娠糖尿病検査", cycle: "必須" },
            { name: "妊娠後期(29週~)", target: "臨月検査およびノンストレステスト(NST)", cycle: "必須" }
          ],
          vi: [
            { name: "Tam cá nguyệt thứ 1 (1~12 tuần)", target: "Khám tiền sản & Sàng lọc dị tật lần 1", cycle: "Bắt buộc" },
            { name: "Tam cá nguyệt thứ 2 (13~28 tuần)", target: "Sàng lọc dị tật lần 2, Siêu âm hình thái, Nghiệm pháp dung nạp glucose", cycle: "Bắt buộc" },
            { name: "Tam cá nguyệt thứ 3 (29 tuần~)", target: "Xét nghiệm cuối thai kỳ & Đo tim thai (NST)", cycle: "Bắt buộc" }
          ],
          th: [
            { name: "ไตรมาสที่ 1 (1~12 สัปดาห์)", target: "การตรวจก่อนคลอด & การตรวจคัดกรองความผิดปกติครั้งที่ 1", cycle: "จำเป็น" },
            { name: "ไตรมาสที่ 2 (13~28 สัปดาห์)", target: "การตรวจคัดกรองครั้งที่ 2, อัลตราซาวนด์อย่างละเอียด, การตรวจเบาหวานขณะตั้งครรภ์", cycle: "จำเป็น" },
            { name: "ไตรมาสที่ 3 (29 สัปดาห์ขึ้นไป)", target: "การตรวจก่อนคลอดระยะสุดท้าย & การตรวจสุขภาพทารกในครรภ์ (NST)", cycle: "จำเป็น" }
          ]
        };
        data.checkupTable = checkupTableMap[lang] || checkupTableMap['ko'];
      }
    }
  }

  return (
    <div className="bg-brand-light min-h-screen pb-20 lg:pb-32">
      <PageHero 
        category={data.category}
        title={data.title}
        description={data.intro}
        imageSrc={data.image || LOBBY_IMAGE_URL}
        showLanguageSelector={data.category === "INTERNATIONAL CLINIC"}
        lang={lang}
        onLangChange={setLang}
      />
      
      {/* 서브 네비게이션 바 (가로 스크롤) */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-6 mb-4 md:mb-12 mt-2 md:mt-10">
        {parentNavItem && parentNavItem.children && (
          <div className="flex gap-4 md:gap-8 lg:gap-10 border-b border-brand-primary/10 pb-2 overflow-x-auto overflow-y-hidden touch-pan-x no-scrollbar">
            {parentNavItem.children.map((child) => {
              const isActive = location.pathname === child.path;
              return (
                <button 
                  key={child.label} 
                  onClick={() => navigate(child.path!)} 
                  className={`text-[14px] md:text-[15px] font-bold tracking-wide transition-all relative whitespace-nowrap py-2 ${isActive ? 'text-brand-secondary' : 'text-brand-primary/50 hover:text-brand-primary'}`}
                >
                  {child.label}
                  {isActive && <span className="absolute -bottom-[13px] left-0 w-full h-[2px] bg-brand-secondary"></span>}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="max-w-[1100px] mx-auto space-y-10 md:space-y-24 px-4 md:px-6 animate-fade-in-up">

        {/* 상세 설명 */}
        {data.description && (
          <div className="bg-white rounded-[20px] md:rounded-[40px] border border-brand-primary/5 shadow-xl p-5 md:p-10 lg:p-12 hover-glow">
            <p className="text-brand-primary/70 font-medium text-[15px] md:text-[16px] leading-[2] whitespace-pre-line">{data.description}</p>
          </div>
        )}


        {/* 이미지 갤러리 (복강경·맘모톰 등 도식도·GIF) */}
        {data.imageGallery && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.imageGallery.map((img: any, i: number) => (
              <div key={i} className="bg-white rounded-[20px] md:rounded-[40px] border border-brand-primary/5 shadow-xl overflow-hidden hover-lift">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full object-contain bg-white"
                  style={{ maxHeight: '320px' }}
                />
                {img.caption && (
                  <div className="px-8 py-4 border-t border-brand-light">
                    <p className="text-brand-primary/60 font-medium text-[13px] md:text-[14px] text-center">{img.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {data.items && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {data.items.map((item: any, i: number) => (
                <div key={i} className="bg-white p-5 md:p-10 lg:p-12 rounded-[20px] md:rounded-[40px] border border-brand-primary/5 shadow-xl hover:-translate-y-2 transition-transform duration-500 hover-glow">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-5">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-light rounded-xl flex items-center justify-center flex-shrink-0">
                      <Heart size={18} className="text-brand-secondary" />
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-brand-primary">{item.title}</h4>
                  </div>
                  <p className="text-brand-primary/70 font-medium text-[14px] md:text-[15px] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        )}

        {/* 주별 검사 상세 카드 + 모달 (임신중 기본검사 전용) */}
        {data.weeklySchedule && (
          <>
            <button
              onClick={() => setShowSchedule(true)}
              className="w-full rounded-[20px] md:rounded-[40px] border border-brand-secondary/30 shadow-xl p-5 md:p-10 hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:border-brand-secondary/50 group cursor-pointer text-left"
              style={{ background: 'linear-gradient(135deg, #F5F0EB 0%, #EDE8E3 40%, #F0EAE4 100%)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-secondary/20 transition-colors">
                    <Calendar size={20} className="text-brand-secondary" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-brand-primary group-hover:text-brand-secondary transition-colors">주별 검사 상세 일정</h4>
                    <p className="text-brand-primary/50 text-[13px] font-medium mt-1">임신 5주부터 41주까지 주차별 필수 검사 항목을 확인하세요</p>
                  </div>
                </div>
                <ChevronRight size={22} className="text-brand-primary/30 group-hover:text-brand-secondary transition-colors flex-shrink-0" />
              </div>
            </button>

            {/* 주별 검사 모달 */}
            {showSchedule && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in-up" onClick={() => setShowSchedule(false)}>
                <div className="bg-white rounded-[20px] md:rounded-[32px] shadow-2xl w-full max-w-[700px] max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                  {/* 모달 헤더 */}
                  <div className="bg-brand-primary p-5 md:p-8 flex items-center justify-between">
                    <div>
                      <p className="text-brand-secondary text-[10px] font-black tracking-[0.3em] uppercase mb-1">Weekly Checkup Schedule</p>
                      <h3 className="text-lg md:text-xl font-bold text-white">주별 검사 상세 일정</h3>
                    </div>
                    <button onClick={() => setShowSchedule(false)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                      <X size={18} className="text-white" />
                    </button>
                  </div>
                  {/* 모달 테이블 */}
                  <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 100px)' }}>
                    <table className="w-full">
                      <thead className="sticky top-0 bg-brand-light">
                        <tr>
                          <th className="text-left p-3 md:p-4 text-[12px] md:text-[13px] font-bold text-brand-primary/60 border-b border-brand-primary/10 whitespace-nowrap w-[90px] md:w-[110px]">주차</th>
                          <th className="text-left p-3 md:p-4 text-[12px] md:text-[13px] font-bold text-brand-primary/60 border-b border-brand-primary/10">검사 내용</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.weeklySchedule.map((row: any, i: number) => (
                          <tr key={i} className="border-b border-brand-primary/5 last:border-0 hover:bg-brand-light/50 transition-colors">
                            <td className="p-3 md:p-4 align-top">
                              <span className="inline-block px-2.5 py-1 bg-brand-secondary/10 text-brand-secondary font-bold rounded-lg text-[12px] md:text-[13px] whitespace-nowrap">
                                {row.week}
                              </span>
                            </td>
                            <td className="p-3 md:p-4 text-[13px] md:text-[14px] text-brand-primary/70 font-medium leading-[1.8] whitespace-pre-line align-top">
                              {row.detail}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {data.weeklyScheduleNote && (
                      <div className="px-4 md:px-6 py-4 bg-brand-light border-t border-brand-primary/10">
                        <p className="text-[12px] md:text-[13px] text-brand-secondary font-bold">{data.weeklyScheduleNote}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 상세 가이드 카드 + 모달 */}
        {data.detailGuide && (
          <>
            <button
              onClick={() => setShowDetailGuide(true)}
              className="w-full rounded-[20px] md:rounded-[40px] border border-brand-secondary/30 shadow-xl p-5 md:p-10 hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:border-brand-secondary/50 group cursor-pointer text-left"
              style={{ background: 'linear-gradient(135deg, #F5F0EB 0%, #EDE8E3 40%, #F0EAE4 100%)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-light rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-pale transition-colors">
                    <Heart size={20} className="text-brand-secondary" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-brand-primary group-hover:text-brand-secondary transition-colors">{data.title} 상세 가이드</h4>
                    <p className="text-brand-primary/50 text-[13px] font-medium mt-1">자세한 안내 및 질환별 정보를 확인하세요</p>
                  </div>
                </div>
                <ChevronRight size={22} className="text-brand-primary/30 group-hover:text-brand-secondary transition-colors flex-shrink-0" />
              </div>
            </button>

            {/* 상세 가이드 모달 */}
            {showDetailGuide && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in-up" onClick={() => setShowDetailGuide(false)}>
                <div className="bg-white rounded-[20px] md:rounded-[32px] shadow-2xl w-full max-w-[700px] max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                  {/* 모달 헤더 */}
                  <div className="bg-brand-primary p-5 md:p-8 flex items-center justify-between">
                    <div>
                      <p className="text-brand-secondary text-[10px] font-black tracking-[0.3em] uppercase mb-1">DETAILED GUIDE</p>
                      <h3 className="text-lg md:text-xl font-bold text-white">{data.title} 상세 가이드</h3>
                    </div>
                    <button onClick={() => setShowDetailGuide(false)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                      <X size={18} className="text-white" />
                    </button>
                  </div>
                  {/* 모달 본문 — 이미지 포함 리치 카드 */}
                  <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 100px)' }}>
                    <div className="divide-y divide-brand-primary/10">
                      {data.detailGuide.map((item: any, i: number) => (
                        <div key={i} className="p-4 md:p-6">
                          {/* 질환 제목 */}
                          <div className="flex items-center gap-3 mb-4">
                            <span className="inline-flex w-8 h-8 rounded-full bg-brand-secondary/10 text-brand-secondary font-bold text-[13px] items-center justify-center flex-shrink-0">
                              {i + 1}
                            </span>
                            <h4 className="text-[16px] md:text-[18px] font-black text-brand-primary">{item.condition}</h4>
                          </div>

                          {/* 질환별 도해 이미지 (있는 경우에만 렌더링) */}
                          {item.image && (
                            <div className="mb-4 rounded-2xl overflow-hidden border border-brand-primary/10 shadow-sm bg-white">
                              <img
                                src={item.image}
                                alt={`${item.condition} 도해`}
                                className="w-full object-contain"
                                style={{ maxHeight: '280px' }}
                              />
                            </div>
                          )}

                          {/* 상세 설명 리스트 */}
                          <ul className="space-y-2.5 ml-2 md:ml-4">
                            {item.details.map((detail: string, j: number) => (
                              <li key={j} className="flex items-start gap-2.5 text-[13px] md:text-[14px] text-brand-primary/65 leading-[1.8]">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary/60 mt-2.5 shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {data.detailGuideNote && (
                      <div className="px-4 md:px-6 py-4 bg-brand-light border-t border-brand-primary/10">
                        <p className="text-[13px] md:text-[14px] text-brand-secondary font-medium">{data.detailGuideNote}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 안내 정보 박스 렌더링 (대상/주기, 금식 안내 등) */}
        {data.infoBox && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.infoBox.map((box: any, i: number) => (
              <div key={i} className="bg-white rounded-[20px] md:rounded-[28px] border border-brand-primary/5 shadow-lg p-5 md:p-8 hover-glow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center">
                    <Info size={16} className="text-brand-secondary" />
                  </span>
                  <h4 className="font-bold text-brand-primary text-[15px] md:text-[16px]">{box.title}</h4>
                </div>
                <ul className="space-y-2.5">
                  {box.contents.map((content: string, j: number) => (
                    <li key={j} className="flex items-start gap-2.5 text-[14px] md:text-[15px] font-medium text-brand-primary/75 leading-[1.7]">
                      <CheckCircle2 size={16} className="text-brand-secondary mt-0.5 shrink-0" />
                      <span>{content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* 검진 항목 테이블 렌더링 (국가검진, 맞춤검진 등) */}
        {data.checkupTable && (
          <div className="bg-white rounded-[20px] md:rounded-[40px] border border-brand-primary/5 shadow-xl overflow-hidden hover-glow">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse premium-table">
                <thead>
                  <tr>
                    <th className="p-4 md:p-6 text-[13px] md:text-[15px] font-bold border-b border-white/10 whitespace-nowrap tracking-wide">검진 항목</th>
                    <th className="p-4 md:p-6 text-[13px] md:text-[15px] font-bold border-b border-white/10 tracking-wide">상세 내용</th>
                    {data.checkupTable[0]?.cycle && <th className="p-4 md:p-6 text-[13px] md:text-[15px] font-bold border-b border-white/10 whitespace-nowrap tracking-wide">주기</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.checkupTable.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-brand-primary/5 last:border-0 transition-colors duration-200">
                      <td className="p-4 md:p-6 text-[14px] md:text-[15px] font-bold text-brand-primary align-top whitespace-pre-line">
                        <div className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-1.5 shrink-0" />
                          {row.name || row.category}
                        </div>
                      </td>
                      <td className="p-4 md:p-6 text-[14px] md:text-[15px] font-medium text-brand-primary/80 align-top whitespace-pre-line leading-[1.8]">{row.target || row.items}</td>
                      {row.cycle && <td className="p-4 md:p-6 text-[14px] md:text-[15px] align-top whitespace-pre-line"><span className="inline-block px-3 py-1 bg-brand-light text-brand-secondary font-bold rounded-full text-[13px]">{row.cycle}</span></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {data.process && (
            <div className="bg-brand-primary p-6 md:p-14 lg:p-24 rounded-[24px] md:rounded-[48px] lg:rounded-[60px] text-white">
              <h3 className="text-lg md:text-2xl font-bold mb-6 md:mb-12 text-center text-white/90">진료 프로세스</h3>
            <div className="flex flex-col lg:flex-row gap-8 justify-between">
              {data.process.map((step: string, i: number) => (
                <div key={i} className="flex-1 text-center space-y-4">
                  <div className="text-[10px] font-black text-brand-secondary uppercase tracking-widest opacity-50">Step 0{i+1}</div>
                  <p className="font-bold text-lg">{step}</p>
                  {i < data.process.length - 1 && <div className="hidden lg:block h-px w-8 bg-white/10 mx-auto mt-4"></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 고위험 임신 해당 경우 */}
        {data.risks && (
          <div className="bg-white rounded-[20px] md:rounded-[48px] border border-brand-primary/5 shadow-xl p-6 md:p-12 space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-brand-secondary border-b border-brand-light pb-4">고위험 임신에 해당되는 경우</h3>
            {data.riskNote && <p className="text-brand-primary/70 font-medium text-[14px] md:text-[15px]">{data.riskNote}</p>}
            <ul className="space-y-3">
              {data.risks.map((risk: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-brand-primary/80 font-medium text-[15px] md:text-[16px]">
                  <CheckCircle2 size={18} className="text-brand-secondary shrink-0 mt-0.5" />{risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 관리의 중요성 */}
        {data.importance && (
            <div className="bg-brand-primary rounded-[20px] md:rounded-[40px] p-6 md:p-12 lg:p-16 text-white space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white/90">고위험 임신 관리의 중요성</h3>
            <p className="text-white/80 font-medium text-[15px] md:text-[16px] leading-relaxed">{data.importance}</p>
          </div>
        )}

        {/* 우리 병원의 고위험 임신 관리 */}
        {data.management && (
          <div className="bg-white rounded-[20px] md:rounded-[48px] border border-brand-primary/5 shadow-xl p-6 md:p-12 space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-brand-secondary border-b border-brand-light pb-4">우리 병원의 고위험 임신 관리</h3>
            <p className="text-brand-primary/70 font-medium text-[14px] md:text-[15px]">본원은 고위험 임신 산모를 위해 다음과 같은 체계적인 관리와 진료를 제공합니다.</p>
            <ul className="space-y-3">
              {data.management.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-brand-primary/80 font-medium text-[15px] md:text-[16px]">
                  <CheckCircle2 size={18} className="text-brand-secondary shrink-0 mt-0.5" />{item}
                </li>
              ))}
            </ul>
            <div className="bg-brand-light rounded-2xl p-6 mt-4">
              <p className="text-brand-primary font-black text-[14px] text-center">산모와 아기의 건강한 출산을 위해 최선을 다하겠습니다.</p>
            </div>
          </div>
        )}

        {/* 국가건강검진: 검진 대상 및 주기 */}
        {data.eligibility && (

          <div className="bg-white rounded-[20px] md:rounded-[48px] border border-brand-primary/5 shadow-xl p-6 md:p-12 space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-brand-secondary border-b border-brand-light pb-4">검진 대상 및 주기</h3>
            <ul className="space-y-3">
              {data.eligibility.map((el: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-brand-primary/80 font-medium text-[15px] md:text-[16px]">
                  <CheckCircle2 size={18} className="text-brand-secondary shrink-0 mt-0.5" />{el}
                </li>
              ))}
            </ul>
            {data.notice && (
              <div className="bg-brand-light rounded-2xl p-6 border border-brand-primary/5 mt-4">
                <p className="text-brand-primary/80 font-medium text-[14px] md:text-[15px] leading-relaxed whitespace-pre-line">※ {data.notice}</p>
              </div>
            )}
          </div>
        )}



        {/* 채용검사: 검사 전 준비사항 */}
        {data.preparation && (
          <div className="bg-white rounded-[20px] md:rounded-[48px] border border-brand-primary/5 shadow-xl p-6 md:p-12 space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-brand-secondary border-b border-brand-light pb-4">검사 전 준비사항</h3>
            <ul className="space-y-3">
              {data.preparation.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-brand-primary/80 font-medium text-[15px] md:text-[16px] leading-relaxed">
                  <CheckCircle2 size={18} className="text-brand-secondary shrink-0 mt-0.5" />{item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 채용검사: 검사항목 테이블 */}
        {data.employmentTable && (
          <div className="bg-white rounded-[20px] md:rounded-[48px] border border-brand-primary/5 shadow-xl p-6 md:p-12 space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-brand-secondary border-b border-brand-light pb-4">검사 항목</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px] border-collapse">
                <thead>
                  <tr className="bg-brand-primary text-white">
                    <th className="px-6 py-3 text-center font-black tracking-wide w-[30%]">검사 종목</th>
                    <th className="px-6 py-3 text-left font-black tracking-wide">검사 항목</th>
                  </tr>
                </thead>
                <tbody>
                  {data.employmentTable.map((row: any, i: number) => (
                    <tr key={i} className={`border-b border-brand-light ${i % 2 === 0 ? 'bg-white' : 'bg-brand-light/40'}`}>
                      <td className="px-6 py-4 text-center font-bold text-[14px] md:text-[15px] text-brand-primary">{row.category}</td>
                      <td className="px-6 py-4 font-medium text-[14px] md:text-[15px] text-brand-primary/80 whitespace-pre-line">{row.items}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 채용검사: 비용 */}
        {data.pricing && (
            <div className="bg-brand-primary rounded-[20px] md:rounded-[40px] p-5 md:p-10 lg:p-12 text-center space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-white/90">비용 안내</h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {data.pricing.map((p: any, i: number) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-3xl px-10 py-8 flex-1 max-w-xs mx-auto">
                  <p className="text-brand-secondary font-black text-[12px] uppercase tracking-widest mb-3">{p.type}</p>
                  <p className="text-white text-4xl font-black">{p.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-center pt-10">
          <PhoneConsultButton className="w-full sm:w-[260px]" />
        </div>
      </div>
    </div>
  );
};

// Display reservation guidance (Contact focus)
const ReservationPage: React.FC = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  const handlePhoneClick = () => {
    if (isMobile) window.location.href = `tel:${HOSPITAL_INFO.phone}`;
  };

  return (
    <div className="bg-brand-light min-h-screen py-12 lg:py-32 px-4 md:px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="bg-white rounded-[20px] md:rounded-[48px] overflow-hidden shadow-2xl border border-brand-primary/5">
          <div className="bg-brand-primary p-8 md:p-16 lg:p-20 text-white text-center">
            <Phone size={36} className="text-brand-secondary mx-auto mb-5 md:mb-8" />
            <h2 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-6">진료 상담 및 안내</h2>
            <p className="text-white/60 font-bold max-w-lg mx-auto leading-relaxed">
              메디피아는 27년 전통의 신뢰를 바탕으로 한 분 한 분 정성껏 상담해 드립니다. 
              현재 모든 예약 및 상담은 **전화**를 통해 진행되고 있습니다.
            </p>
          </div>
          <div className="p-5 md:p-12 lg:p-16 space-y-10 md:space-y-16">
            <div className="text-center space-y-8">
              <h4 className="text-[14px] font-black text-brand-secondary uppercase tracking-[0.3em]">Representative Consultation</h4>
              <div 
                className={`text-3xl md:text-5xl lg:text-7xl font-black text-brand-primary hover:text-brand-secondary transition-colors ${isMobile ? 'cursor-pointer' : ''}`}
                onClick={handlePhoneClick}
              >
                {HOSPITAL_INFO.phone}
              </div>
              
              <div className="flex justify-center my-10">
                <PhoneConsultButton className="w-full sm:w-[260px]" />
              </div>
              
              {!isMobile && (
                <div className="flex items-center justify-center gap-2 text-brand-primary/40 text-[12px] font-bold">
                  <Info size={16} /> PC에서는 모바일 연동 또는 수동 발신이 필요합니다.
                </div>
              )}
            </div>
            
            <div className="pt-12 border-t border-brand-light grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="text-base font-bold text-brand-secondary">평일 상담 시간</h4>
                <div className="space-y-2 text-sm font-bold text-brand-primary/60">
                   <p className="flex justify-between"><span>오전 진료</span><span>09:00 - 13:00</span></p>
                   <p className="flex justify-between"><span>오후 진료</span><span>14:00 - 18:00</span></p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-base font-bold text-brand-secondary">주말 및 공휴일</h4>
                <div className="space-y-2 text-sm font-bold text-brand-primary/60">
                   <p className="flex justify-between"><span>토요일 진료</span><span>09:00 - 13:00</span></p>
                   <p className="flex justify-between text-brand-secondary"><span>응급 분만</span><span>365일 24시간</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Display specialized medical staff
const MedicalStaffPage: React.FC = () => {
  const navigate = useNavigate();
  // Firestore에서 의료진 데이터 동적 로드 (실패 시 constants fallback)
  const DOCTORS = useDoctors();
  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title="메디피아 - 의료진 소개" 
        description="메디피아의 27년 노하우를 이끄는 각 분야 전문가들을 소개합니다." 
        url="https://medipiahomepage.web.app/medical/staff" 
      />
      <PageHero 
        category="Medical Specialists"
        title={
          <>
            품격 있는 진료를 위한<br />분야별 전문 의료진
          </>
        }
        description="메디피아의 27년 노하우를 이끄는 각 분야 전문가들을 소개합니다."
        videoSrc={HOME_HERO_VIDEO}
      />

      <div className="max-w-[1300px] mx-auto pb-20 lg:pb-32 px-4 md:px-6">
        <div className="mb-4 md:mb-20 flex gap-3 md:gap-6 lg:gap-10 border-b border-brand-primary/5 pb-2 md:pb-6 overflow-x-auto overflow-y-hidden touch-pan-x no-scrollbar">
          {['대표 인사말', '의료진소개', '진료시간', '오시는 길'].map((label, idx) => {
            const paths = ['/brand', '/medical/staff', '/brand/hours', '/brand/location'];
            // 의료진소개 페이지이므로 idx === 1 일 때만 isActive
            const isActive = idx === 1;
            return (
              <button key={label} onClick={() => navigate(paths[idx])} className={`text-[14px] md:text-[15px] font-bold tracking-wide transition-all relative whitespace-nowrap py-2 ${isActive ? 'text-brand-secondary' : 'text-brand-primary/50 hover:text-brand-primary'}`}>
                {label}
                {isActive && <span className="absolute -bottom-[18px] md:-bottom-[26px] left-0 w-full h-[2px] bg-brand-secondary"></span>}
              </button>
            )
          })}
        </div>
        
        <div className="space-y-12 md:space-y-24 lg:space-y-32">
          {DOCTORS.map((doc, idx) => (
            <div key={idx} className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`lg:col-span-4 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className="aspect-[3/4] overflow-hidden rounded-[24px] md:rounded-[40px] shadow-xl border border-brand-primary/5 bg-brand-light/30 max-w-[320px] mx-auto lg:max-w-none">
                  <img src={doc.image} alt={doc.name} className="w-[85%] h-full mx-auto object-cover object-top" />
                </div>
              </div>
              <div className="lg:col-span-8 space-y-5 md:space-y-8 lg:pl-10">
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-4xl font-black text-brand-primary">{doc.name}</h3>
                  <p className="text-brand-secondary font-black text-[14px] uppercase tracking-widest">{doc.role}</p>
                </div>
                <div className="p-5 md:p-8 bg-white border border-brand-primary/5 rounded-[16px] md:rounded-[40px] shadow-sm hover-glow">
                  <p className="text-base md:text-lg font-bold text-brand-primary/80 leading-relaxed">"{doc.philosophy}"</p>
                </div>
                {doc.fields && (
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.3em] border-b border-brand-light pb-2">진료 분야</h4>
                    <div className="flex flex-wrap gap-2">
                      {doc.fields.map((field: string, i: number) => (
                        <span key={i} className="px-3 md:px-4 py-1.5 bg-brand-light rounded-full text-[11px] md:text-[12px] font-black text-brand-primary border border-brand-primary/5 hover:bg-brand-secondary hover:text-white transition-all touch-scale">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── 진료 일정표 ── */}
                {/* schedule 필드가 있는 의료진만 일정표 표시 (채승호 마취과장은 미표시) */}
                {doc.schedule && (
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.3em] border-b border-brand-light pb-2">
                      진료 일정
                    </h4>
                    <div className="overflow-x-auto rounded-2xl border border-brand-primary/40 shadow-md bg-white">
                      <table className="w-full text-center text-[11px] md:text-[13px]">
                        <thead>
                          <tr className="bg-brand-primary/10">
                            <th className="py-2 px-1 md:px-3 text-[10px] md:text-[11px] font-black text-brand-primary/70 tracking-wider w-10 md:w-14 border-r border-brand-primary/10"></th>
                            {(['월', '화', '수', '목', '금', '토', '일'] as const).map((day) => (
                              <th key={day} className={`py-2 px-0.5 md:px-1 font-black tracking-wider border-r border-brand-primary/20 last:border-r-0 ${
                                day === '일' ? 'text-rose-600' : day === '토' ? 'text-blue-600' : 'text-brand-primary'
                              }`}>
                                {day}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(
                            [
                              { label: '오전', key: 'am' as const },
                              { label: '오후', key: 'pm' as const },
                            ] as const
                          ).map(({ label, key }) => (
                            <tr key={key} className="border-t border-brand-primary/20 hover:bg-brand-pale/30 transition-colors">
                              <td className="py-2 md:py-3 px-1 md:px-3 font-black text-brand-primary/90 text-[10px] md:text-[11px] bg-brand-primary/10 border-r border-brand-primary/20 break-keep">
                                {label}
                              </td>
                              {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((dayKey) => {
                                const val: string = doc.schedule?.[key]?.[dayKey] ?? '—';
                                const isActive = val === '진료';
                                const isOff = val === '휴진';
                                const isEmergency = val === '수술응급' || val === '응급';
                                return (
                                  <td key={dayKey} className="py-3 px-1 border-r border-brand-primary/20 last:border-r-0">
                                    {isActive ? (
                                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-secondary/30 text-brand-secondary font-black text-[15px]">
                                        ○
                                      </span>
                                    ) : isOff ? (
                                      <span className="inline-flex items-center justify-center text-brand-primary/50 font-bold text-[11px] tracking-tight">
                                        휴진
                                      </span>
                                    ) : isEmergency ? (
                                      <span className="inline-flex items-center justify-center text-amber-600 font-black text-[9px] leading-tight text-center">
                                        {val === '수술응급' ? (
                                          <span>수술<br/>응급</span>
                                        ) : (
                                          '응급'
                                        )}
                                      </span>
                                    ) : (
                                      <span className="text-brand-primary/50 text-[11px]">{val}</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* 하단 주석 */}
                    <div className="space-y-1 pt-1">
                      <p className="text-[10px] md:text-[11px] text-brand-primary/90 font-bold leading-relaxed">
                        ※ 사정에 따라 진료 일정이 변경될 수 있습니다.
                      </p>
                      <p className="text-[10px] md:text-[11px] text-brand-primary/90 font-bold leading-relaxed">
                        ※ 자세한 일정은 공지사항을 확인해주세요.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// Display hospital notices and community updates

const CommunityPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const q = query(collection(db, 'notices'));
        const snapshot = await getDocs(q);
        const fetchedNotices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notice));
        
        const visibleNotices = fetchedNotices
          .filter(notice => notice.isVisible !== false)
          .sort((a, b) => {
            const dateA = a.createdAt?.toMillis?.() || 0;
            const dateB = b.createdAt?.toMillis?.() || 0;
            return dateB - dateA;
          });
          
        setNotices(visibleNotices);
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
    <div className="bg-brand-light min-h-screen py-12 lg:py-32 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto space-y-10 md:space-y-20">
        <div className="text-center space-y-4">
          <span className="text-brand-secondary font-black text-[10px] tracking-[0.4em] uppercase">Hospital News</span>
          <h2 className="text-xl md:text-3xl font-bold text-brand-primary">메디피아 소식</h2>
        </div>
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20 text-brand-primary/50 font-bold">불러오는 중...</div>
          ) : notices.length > 0 ? (
            notices.map((item) => (
              <div key={item.id} className="bg-white p-5 md:p-10 rounded-[16px] md:rounded-[40px] border border-brand-primary/5 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8 hover-glow touch-scale">
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">{item.createdAt?.toDate?.().toLocaleDateString() || ''}</span>
                  <h3 className="text-base md:text-xl font-black text-brand-primary group-hover:text-brand-secondary transition-colors">{item.title}</h3>
                  <div 
                    className="text-brand-primary/80 font-medium text-sm leading-relaxed max-w-3xl quill-content" 
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[20px] shadow-sm border border-brand-primary/5 text-brand-primary/50 font-bold">등록된 소식이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// -- ScrollToTop: 페이지 이동 시 항상 최상단으로 스크롤 --
// 모바일에서 서브메뉴 클릭 후 이전 스크롤 위치 유지되는 문제 해결
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // html.home-snap 클래스도 함께 제거 (홈 이탈 시 스냅 해제)
    document.documentElement.classList.remove('home-snap');
    // 스크롤 최상단으로 즉시 이동
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
};

// ── 푸터 컴포넌트 (navigate를 위해 BrowserRouter 내부에서 분리) ──
const SiteFooter: React.FC = () => {
  const navigate = useNavigate();
  return (
    <footer className="py-10 px-4 md:py-16 md:px-6 pb-24 lg:pb-16 text-white/50 text-[12px]"
      style={{ background: 'linear-gradient(135deg, #3D3535 0%, #5a4555 100%)' }}>
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-left">
        <div className="space-y-4">
          <div className="flex flex-col">
            <HospitalLogo primaryColor="text-white/80" secondaryColor="text-brand-secondary" />
          </div>
          <p className="max-w-md leading-relaxed font-light text-[12px] text-white/50">
            남양주를 대표하는 프리미엄 여성 건강의 안식처로서 끊임없이 정진하겠습니다. 산과 전문의 24시간 원내 상주로 안전한 출산과 여성 건강을 지킵니다.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="section-eng-label text-brand-secondary/80">Contact Information</h4>
            <p className="text-white/60 font-light text-[12px]">{HOSPITAL_INFO.address}</p>
            <p className="text-white/90 text-[18px] font-medium">{HOSPITAL_INFO.phone}</p>
          </div>
          <div className="space-y-4">
            <h4 className="section-eng-label text-brand-secondary/80">Legal Information</h4>
            <p className="font-light text-[12px] text-white/40">사업자등록번호: {HOSPITAL_INFO.regNumber}</p>
            <p className="font-light text-[12px] text-white/40">대표자: {HOSPITAL_INFO.director}</p>
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => navigate('/privacy')}
                className="text-[11px] font-light hover:text-white/80 transition-colors underline underline-offset-2"
              >개인정보처리방침</button>
              <button
                onClick={() => navigate('/terms')}
                className="text-[11px] font-light hover:text-white/80 transition-colors underline underline-offset-2"
              >이용약관</button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-white/10 text-center text-[11px] font-light opacity-40">
        © {new Date().getFullYear()} {HOSPITAL_INFO.name}. All Rights Reserved.
      </div>
    </footer>
  );
};

// -- Main App Component --

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PopupManager />
      {/* 전체 배경: 크리미 페일 핑크 (#FDF5F5) */}
      <div className="min-h-screen" style={{ backgroundColor: '#FDF5F5' }}>
        <Header />
        <ProgressBar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/brand" element={<BrandPage />} />
            <Route path="/brand/:sub" element={<BrandPage />} />
            <Route path="/medical/staff" element={<MedicalStaffPage />} />
            <Route path="/medical/:category/:service" element={<MedicalServicePage />} />
            <Route path="/postpartum" element={<PostpartumPage />} />
            <Route path="/postpartum/:sub" element={<PostpartumPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="/centers/:centerId" element={<SpecializedCenters />} />
            <Route path="/international-women" element={<InternationalClinic />} />
            <Route path="/international-women/:service" element={<MedicalServicePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </main>
        
        {/* 푸터 컴포넌트 (useNavigate 사용을 위해 분리) */}
        <SiteFooter />
        
        <GeminiChat />
      </div>
    </BrowserRouter>
  );
};

export default App;
