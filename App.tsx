
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Menu, X, Phone, ChevronRight, MapPin, Clock, Heart, CheckCircle2, ArrowRight, Zap, Camera, Bus, Car, Baby, Info } from 'lucide-react';
import { NAV_ITEMS, DOCTORS, SPECIALIZED_CENTERS_DATA, SUB_SERVICE_DETAILS, NOTICE_DATA, FACILITY_GALLERY, HOSPITAL_INFO, POSTPARTUM_PROGRAM, POSTPARTUM_MAIN_IMAGE, HOME_HERO_VIDEO, LOBBY_IMAGE_URL } from './constants';
import { GeminiChat } from './components/GeminiChat';
import { SpecializedCenters } from './components/SpecializedCenters';



// -- Shared Components (Updated) --

const PhoneConsultButton: React.FC<{ className?: string, variant?: 'outline' | 'filled' }> = ({ className, variant = 'filled' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleClick = () => {
    if (isMobile) {
      window.location.href = `tel:${HOSPITAL_INFO.phone}`;
    }
  };

  // 기존 디자인 시스템의 클래스를 유지하며 w-full을 추가하여 외부에서 크기 조절이 가능하게 합니다.
  const filledStyles = "w-full px-10 py-4 bg-brand-secondary text-white font-black tracking-widest text-[11px] uppercase hover:bg-white hover:text-brand-primary transition-all rounded-full shadow-lg flex items-center justify-center gap-2";
  const outlineStyles = "border border-brand-secondary text-brand-secondary px-6 py-2 text-[10px] tracking-widest font-black hover:bg-brand-secondary hover:text-white transition-all uppercase rounded-full flex items-center justify-center gap-2";

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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-[100] glass-nav border-b border-brand-primary/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div onClick={() => navigate('/')} className="cursor-pointer active-scale flex flex-col justify-center">
              <span className="serif-title font-bold text-lg lg:text-xl tracking-tighter text-brand-primary uppercase leading-tight">
                {HOSPITAL_INFO.name}
              </span>
              <span className="text-[9px] font-black text-brand-secondary tracking-[0.3em] uppercase leading-none mt-0.5">
                {HOSPITAL_INFO.engName}
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="relative group">
                  <button
                    onClick={() => item.path && navigate(item.path)}
                    className={`text-[13px] tracking-tight transition-all duration-300 ${
                      location.pathname.startsWith(item.path || '###') 
                      ? 'text-brand-secondary font-black' 
                      : 'text-brand-primary/70 hover:text-brand-secondary font-bold'
                    }`}
                  >
                    {item.label}
                  </button>
                  {item.children && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 py-4 border border-brand-primary/5 rounded-xl">
                      {item.children.map((child) => (
                        <button
                          key={child.label}
                          onClick={() => child.path && navigate(child.path)}
                          className="block w-full text-left px-6 py-2.5 text-[12px] font-bold text-brand-primary/50 hover:text-brand-secondary hover:bg-brand-light transition-all"
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <PhoneConsultButton variant="outline" className="hidden lg:flex" />
              <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 text-brand-primary">
                <Menu size={24} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[200] bg-white transition-all duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden flex flex-col`}>
        <div className="flex justify-between items-center px-8 py-5 border-b border-brand-primary/5">
          <div className="flex flex-col">
            <span className="serif-title font-bold text-lg text-brand-primary tracking-tighter uppercase">{HOSPITAL_INFO.name}</span>
            <span className="text-[9px] text-brand-secondary font-black uppercase tracking-widest leading-none">{HOSPITAL_INFO.engName}</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-brand-primary bg-brand-light rounded-full"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8 no-scrollbar">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="space-y-4">
              <h3 className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.2em]">{item.label}</h3>
              <div className="grid grid-cols-1 gap-4">
                {item.children?.map((child) => (
                  <button key={child.label} onClick={() => { child.path && navigate(child.path); setIsOpen(false); }} className="text-left text-xl font-bold text-brand-primary">
                    {child.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// -- Page Components --

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <section className="relative h-[80vh] lg:h-[90vh] w-full overflow-hidden bg-brand-primary">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        >
          <source src={HOME_HERO_VIDEO} type="video/mp4" />
        </video>
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-full flex flex-col justify-center relative z-20">
          <div className="animate-fade-in-up max-w-3xl text-center lg:text-left">
            <h1 className="serif-title text-4xl lg:text-5xl text-white font-black mb-8 leading-[1.2] tracking-tighter hero-text-shadow">
              여성의 가장 <span className="noble-moment-highlight italic">고귀한 순간</span>을<br />함께 합니다.
            </h1>
            <p className="text-white text-base lg:text-lg max-w-xl mx-auto lg:mx-0 mb-10 font-bold leading-relaxed strong-shadow opacity-100">
              1998년 개원 이래 27년의 깊은 신뢰.<br />남양주 프리미엄 여성 건강의 절대적 안식처.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              {/* 버튼 크기를 동일하게 w-full sm:w-[220px]로 고정 */}
              <PhoneConsultButton className="w-full sm:w-[220px]" />
              <button onClick={() => navigate('/brand')} className="w-full sm:w-[220px] px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/40 font-black tracking-widest text-[11px] uppercase hover:bg-white hover:text-brand-primary transition-all rounded-full flex items-center justify-center">브랜드 스토리</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up order-2 lg:order-1">
              <span className="text-brand-secondary font-black text-[11px] tracking-[0.4em] uppercase">The Medipia Heritage</span>
              <h2 className="serif-title text-3xl lg:text-4xl font-bold text-brand-primary leading-tight italic">
                한 세대의 역사가 증명하는<br />여성 의료의 정점
              </h2>
              <p className="text-brand-primary/60 text-base lg:text-lg font-bold leading-relaxed text-justify">
                메디피아 여성병원은 1998년 개원 이후, 산과 전문의의 24시간 원내 상주라는 원칙을 단 한 번도 어기지 않았습니다. 우리는 단순한 치료를 넘어, 여성의 전 생애 주기에 걸친 품격 있는 삶을 설계합니다.
              </p>
              <div className="pt-6 flex flex-wrap gap-8 justify-center lg:justify-start">
                <div className="flex flex-col"><span className="text-3xl font-black text-brand-primary">27+</span><span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Years of Trust</span></div>
                <div className="flex flex-col"><span className="text-3xl font-black text-brand-primary">30,000+</span><span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Safe Births</span></div>
                <div className="flex flex-col"><span className="text-3xl font-black text-brand-primary">365/24</span><span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Care System</span></div>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-[48px] shadow-2xl order-1 lg:order-2">
              <img src={LOBBY_IMAGE_URL} alt="Hospital Lobby" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-brand-primary/10"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-secondary py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-8 flex flex-col lg:flex-row items-center justify-between gap-10">
           <div className="text-center lg:text-left space-y-3">
              <h2 className="serif-title text-3xl lg:text-4xl text-brand-primary font-bold italic">365 야간·응급진료센터</h2>
              <p className="text-brand-primary font-bold text-base lg:text-xl">산과 전문의 24시간 원내 상주 시스템 운영</p>
           </div>
           <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
              <button onClick={() => navigate('/centers/emergency')} className="px-10 py-4 bg-brand-primary text-white font-black tracking-widest text-[11px] uppercase hover:opacity-90 transition-all rounded-full">상세 안내</button>
              <a href={`tel:${HOSPITAL_INFO.phone}`} className="px-10 py-4 border border-brand-primary text-brand-primary font-black tracking-widest text-[11px] uppercase hover:bg-brand-primary hover:text-white transition-all text-center rounded-full flex items-center justify-center gap-2">
                <Phone size={14} /> 문의: {HOSPITAL_INFO.phone}
              </a>
           </div>
        </div>
      </section>

      <section className="py-32 lg:py-40 bg-brand-light">
        <div className="max-w-[1400px] mx-auto px-6 text-center mb-20">
           <span className="text-brand-secondary font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Our Facilities</span>
           <h2 className="serif-title text-3xl lg:text-4xl font-bold text-brand-primary italic leading-tight">품격이 다른 프리미엄 의료 공간</h2>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {FACILITY_GALLERY.map((item, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="aspect-[4/5] overflow-hidden rounded-[32px] mb-8 border border-brand-primary/5 shadow-xl relative">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                   <div className="text-white text-left translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.3em] mb-2">Heritage Space 0{idx+1}</p>
                      <h4 className="serif-title text-xl font-bold mb-4 italic">{item.title}</h4>
                      <button className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">Explore <ArrowRight size={14}/></button>
                   </div>
                </div>
              </div>
              <div className="text-center md:text-left px-4">
                <h3 className="serif-title text-xl font-bold text-brand-primary mb-3 italic">{item.title}</h3>
                <p className="text-brand-primary/50 font-bold text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
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
          <div className="animate-fade-in-up space-y-20">
            <div className="space-y-4 border-b border-brand-primary/10 pb-10">
              <span className="text-brand-secondary font-black text-[11px] tracking-[0.4em] uppercase">Specialized Recovery System</span>
              <h3 className="serif-title text-3xl lg:text-4xl font-bold text-brand-primary italic">산후조리원 전문 프로그램 안내</h3>
              <p className="text-brand-primary/60 font-bold max-w-2xl leading-relaxed">
                산모님의 빠른 회복과 아기의 건강한 성장을 위해 분야별 전문가들이 구성한 체계적인 교육 및 케어 시스템입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {POSTPARTUM_PROGRAM.scheduleEvents.map((ev, idx) => (
                <div key={idx} className="bg-white overflow-hidden rounded-[48px] border border-brand-primary/5 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={ev.image} 
                      alt={ev.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                    <span className="absolute bottom-6 left-8 px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl backdrop-blur-md" style={{ backgroundColor: `${ev.color}CC`, color: ev.textColor }}>
                      {ev.cycle}
                    </span>
                  </div>
                  
                  <div className="p-10 lg:p-12 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: ev.color }}>
                        <Baby size={20} style={{ color: ev.textColor }} />
                      </div>
                      <span className="text-[11px] font-black tracking-widest uppercase opacity-40">Program Details</span>
                    </div>
                    
                    <h4 className="text-2xl font-black text-brand-primary mb-6">{ev.name}</h4>
                    <div className="h-0.5 w-12 bg-brand-secondary mb-8 group-hover:w-24 transition-all duration-500"></div>
                    
                    <p className="text-brand-primary/70 font-bold leading-relaxed text-base mb-10">
                      {ev.desc}
                    </p>
                    
                    <div className="mt-auto pt-8 border-t border-brand-light flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-brand-secondary" />
                      <span className="text-[12px] font-black text-brand-primary/40 uppercase tracking-widest">Medical Professional Led</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'rooms':
        return (
          <div className="animate-fade-in-up space-y-16">
             <h3 className="serif-title text-3xl font-bold text-brand-primary italic">예약 및 비용 안내</h3>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {POSTPARTUM_PROGRAM.rooms.map((room, idx) => (
                  <div key={idx} className="bg-white rounded-[40px] overflow-hidden border border-brand-primary/5 shadow-xl group">
                    <div className="aspect-video bg-brand-light flex items-center justify-center">
                       <Camera size={48} className="text-brand-secondary opacity-20" />
                    </div>
                    <div className="p-12">
                       <h4 className="serif-title text-2xl font-bold text-brand-primary mb-6">{room.name}</h4>
                       <ul className="space-y-3 mb-10">
                          {room.features.map((f, i) => (
                            <li key={i} className="flex gap-3 font-bold text-[14px] text-brand-primary"><CheckCircle2 className="text-brand-secondary shrink-0" size={18} /> {f}</li>
                          ))}
                       </ul>
                       <p className="text-lg font-black text-brand-secondary border-t border-brand-light pt-6">비용 안내: {room.price}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="animate-fade-in-up space-y-16">
            <div className="space-y-4 border-b border-brand-primary/10 pb-10">
              <span className="text-brand-secondary font-black text-[11px] tracking-[0.4em] uppercase">Guest Reviews</span>
              <h3 className="serif-title text-3xl lg:text-4xl font-bold text-brand-primary italic">이용후기</h3>
              <p className="text-brand-primary/60 font-bold max-w-2xl leading-relaxed">
                메디피아 산후조리원을 이용하신 산모님들의 생생한 후기를 모아드립니다.
              </p>
            </div>
            <div className="py-32 text-center">
              <p className="text-brand-primary/20 font-black text-[11px] uppercase tracking-[0.4em]">Coming Soon</p>
              <p className="text-brand-primary/50 font-bold mt-4">이용후기 서비스 준비 중입니다.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="animate-fade-in-up">
            <div className="relative h-[60vh] lg:h-[70vh] rounded-[60px] overflow-hidden mb-24 shadow-2xl">
              <img src={POSTPARTUM_MAIN_IMAGE} alt="Postpartum Care" className="w-full h-full object-cover brightness-[0.85]" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-16 left-12 lg:left-24 max-w-2xl text-white">
                <span className="text-brand-secondary font-black text-[11px] tracking-[0.4em] uppercase mb-6 block">Heritage Haven Care</span>
                <h2 className="serif-title text-4xl lg:text-6xl font-bold italic mb-8 leading-tight">
                  생애 가장 아름다운<br />회복의 시간
                </h2>
                <p className="text-lg font-bold opacity-80 leading-relaxed">
                  산모님의 온전한 휴식과 신생아의 안전을 위해 27년 의료 노하우를 집약했습니다. 메디피아 조리원은 단순한 휴식을 넘어 '건강한 가족의 시작'을 설계합니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: '의료진 밀착 협진', desc: '산부인과 & 소아과 전문의의 유기적인 회진 시스템을 통해 이상 징후를 조기에 발견하고 즉각 대응합니다.' },
                { title: '호텔식 고품격 공간', desc: 'VVIP 전용 테라스와 개별 수유 공간, 최고급 모션베드를 갖춘 쾌적한 1인실에서 프라이빗한 회복을 선사합니다.' },
                { title: '전문적 육아 코칭', desc: '1:1 수유 지도부터 아기 목욕, 수면 교육까지 퇴소 후에도 자신감 있는 육아가 가능하도록 실습 위주로 가이드합니다.' }
              ].map((item, i) => (
                <div key={i} className="p-12 bg-white border border-brand-primary/5 rounded-[40px] shadow-sm hover:shadow-xl transition-all">
                  <h4 className="serif-title text-xl font-bold text-brand-primary mb-4 italic">{item.title}</h4>
                  <p className="text-brand-primary/50 font-bold text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-brand-light min-h-screen py-20 lg:py-32 px-6">
      <div className="max-w-[1300px] mx-auto">
        <div className="mb-20 flex gap-10 border-b border-brand-primary/5 pb-6 overflow-x-auto no-scrollbar">
         {['조리원 소개', '프로그램', '예약 및 비용 안내', '이용후기'].map((label, idx) => {
             const paths = ['/postpartum', '/postpartum/program', '/postpartum/rooms', '/postpartum/reviews'];
             const isActive = ((paths[idx] === '/postpartum' && !sub) || (sub && paths[idx].includes(sub)));
             return (
               <button key={label} onClick={() => navigate(paths[idx])} className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all relative whitespace-nowrap ${isActive ? 'text-brand-secondary' : 'text-brand-primary/30 hover:text-brand-primary'}`}>
                 {label}
                 {isActive && <span className="absolute -bottom-[26px] left-0 w-full h-0.5 bg-brand-secondary"></span>}
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
      case 'location':
        return (
          <div className="animate-fade-in-up space-y-16">
             <h3 className="serif-title text-3xl font-bold text-brand-primary italic">오시는 길</h3>
             <div className="bg-white border border-brand-primary/5 rounded-[48px] shadow-xl p-10 lg:p-16">
                <div className="aspect-video bg-brand-light rounded-[32px] mb-12 flex items-center justify-center overflow-hidden">
                   <div className="text-center p-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-brand-primary/5 z-10">
                      <MapPin size={48} className="text-brand-secondary mx-auto mb-4" />
                      <p className="text-brand-primary font-bold text-xl leading-tight">{HOSPITAL_INFO.address}</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="flex gap-3 items-center"><Bus className="text-brand-secondary" size={24} /> <h4 className="text-lg font-black text-brand-primary">버스 이용 안내</h4></div>
                    <p className="text-brand-primary/70 font-bold text-[14px] leading-relaxed pl-9">
                      '구룡터.효성해링턴플레이스' 정류장 하차<br />
                      직행: 1000-1, 1200, 1100 / 일반: 1-4, 30, 55, 65, 165
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex gap-3 items-center"><Car className="text-brand-secondary" size={24} /> <h4 className="text-lg font-black text-brand-primary">자가용 이용 안내</h4></div>
                    <p className="text-brand-primary/70 font-bold text-[14px] leading-relaxed pl-9">
                      내비게이션 '메디피아 여성병원' 검색<br />
                      건물 내 전용 주차장 무료 이용 가능
                    </p>
                  </div>
                </div>
             </div>
          </div>
        );
      case 'hours':
        return (
          <div className="animate-fade-in-up space-y-12">
             <h3 className="serif-title text-3xl font-bold text-brand-primary italic">진료시간</h3>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-12 border border-brand-primary/5 rounded-[40px] shadow-sm">
                   <div className="flex items-center gap-3 mb-10 border-b border-brand-light pb-6">
                      <Clock className="text-brand-secondary" size={24} />
                      <span className="serif-title text-2xl font-bold text-brand-primary">일반 외래 진료</span>
                   </div>
                   <div className="space-y-6 text-base font-bold text-brand-primary">
                      <div className="flex justify-between"><span>평 일</span><span>09:00 - 18:00</span></div>
                      <div className="flex justify-between"><span>토요일</span><span>09:00 - 13:00</span></div>
                      <div className="flex justify-between text-brand-primary/20"><span>점심시간</span><span>13:00 - 14:00</span></div>
                   </div>
                </div>
                <div className="bg-brand-primary p-12 rounded-[40px] shadow-xl text-white">
                   <Zap className="text-brand-secondary mb-8" size={28} />
                   <h4 className="serif-title text-2xl font-bold mb-6">365 응급 분만</h4>
                   <p className="text-base font-bold leading-relaxed opacity-80 mb-8">전문의가 24시간 원내 상주하며<br />모든 응급 상황에 즉각 대응하고 있습니다.</p>
                   <a href={`tel:${HOSPITAL_INFO.phone}`} className="inline-block px-8 py-3 bg-brand-secondary text-white font-black rounded-full text-[12px] tracking-widest uppercase">Emergency: {HOSPITAL_INFO.phone}</a>
                </div>
             </div>
          </div>
        );
      case 'preview':
        return (
          <div className="animate-fade-in-up space-y-16">
             <h3 className="serif-title text-3xl font-bold text-brand-primary italic">시설 안내</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {FACILITY_GALLERY.map((item, i) => (
                  <div key={i} className="group">
                    <div className="aspect-[16/10] overflow-hidden mb-6 rounded-3xl shadow-sm border border-brand-primary/5">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <h4 className="serif-title text-xl font-bold text-brand-primary mb-3">{item.title}</h4>
                    <p className="text-brand-primary/60 font-bold text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
          </div>
        );
      default:
        return (
          <div className="space-y-12 lg:space-y-32">
            <div className="animate-fade-in-up">
              <div className="space-y-8 lg:space-y-12 max-w-3xl">
                <div className="space-y-1 lg:space-y-4">
                  <h3 className="text-3xl lg:text-[54px] font-bold text-brand-primary leading-tight tracking-tight">
                    여성의 전 생애 주기를 위한
                  </h3>
                  <h3 className="text-3xl lg:text-[54px] font-bold text-brand-secondary leading-tight tracking-tight italic">
                    가장 정교한 안식처
                  </h3>
                </div>
                
                <div className="space-y-6 lg:space-y-8 text-[16px] lg:text-[19px] font-medium text-brand-primary/80 text-justify leading-relaxed tracking-tight">
                  <p>안녕하십니까. 메디피아산부인과를 찾아주셔서 감사합니다.</p>
                  <p>1998년 개원 이후 27년이라는 시간 동안 저희는 생명의 경외심을 바탕으로 환자 한 분 한 분의 고귀한 삶을 존중해 왔습니다.</p>
                  <p>단순한 진료를 넘어 마음의 회복까지 돕는 인술의 공간이 되겠습니다. 여러분의 가장 아름답고 고귀한 순간에 메디피아가 든든한 동반자가 되어 드릴 것을 약속합니다.</p>
                  
                  <div className="pt-4 lg:pt-8">
                    <p className="text-2xl lg:text-[28px] font-bold text-brand-primary tracking-tighter">대표원장 한상철</p>
                  </div>
                </div>

                <div className="pt-20 hidden lg:block">
                  <p className="text-[120px] font-black tracking-tighter text-black/5 leading-none uppercase select-none">
                    MEDIPIA
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-primary p-12 lg:p-24 rounded-[40px] lg:rounded-[60px] text-white">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <span className="text-brand-secondary font-black text-[11px] tracking-[0.4em] uppercase">Core Identity</span>
                  <h4 className="serif-title text-3xl lg:text-4xl font-bold italic">메디피아의 3가지 철학</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { title: 'Authority', desc: '27년간 축적된 산과 전문 데이터와 임상 경험으로 최상의 의료 품질을 유지합니다.' },
                    { title: 'Compassion', desc: '환자를 단순히 질환의 대상이 아닌, 존중받아야 할 고귀한 생명으로 대합니다.' },
                    { title: 'Heritage', desc: '어머니에서 딸로 이어지는 세대를 아우르는 믿음의 역사를 써 내려갑니다.' }
                  ].map((item, i) => (
                    <div key={i} className="text-center space-y-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-brand-secondary font-black">0{i+1}</span>
                      </div>
                      <h5 className="serif-title text-xl font-bold italic">{item.title}</h5>
                      <p className="text-white/50 text-sm font-bold leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-brand-light min-h-screen py-10 lg:py-32 px-6">
      <div className="max-w-[1300px] mx-auto">
        <div className="mb-10 lg:mb-20 flex gap-6 lg:gap-10 border-b border-brand-primary/5 pb-6 overflow-x-auto no-scrollbar">
           {['대표 인사말', '진료시간', '시설 안내', '오시는 길'].map((label, idx) => {
             const paths = ['/brand', '/brand/hours', '/brand/preview', '/brand/location'];
             const isActive = ((paths[idx] === '/brand' && !sub) || (sub && paths[idx].includes(sub)));
             return (
               <button key={label} onClick={() => navigate(paths[idx])} className={`text-[12px] lg:text-[14px] font-bold uppercase tracking-tight transition-all relative ${isActive ? 'text-brand-secondary' : 'text-brand-primary/30 hover:text-brand-primary'}`}>
                 {label}
                 {isActive && <span className="absolute -bottom-[26px] left-0 w-full h-0.5 bg-brand-secondary"></span>}
               </button>
             )
           })}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

// Display specialized medical staff
const MedicalStaffPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] lg:h-[50vh] w-full overflow-hidden bg-brand-primary">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={HOME_HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-full flex flex-col justify-center relative z-20">
          <div className="animate-fade-in-up">
            <span className="text-white/70 font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Medical Specialists</span>
            <h1 className="serif-title text-4xl lg:text-5xl text-white font-black italic leading-tight hero-text-shadow">
              품격 있는 진료를 위한<br />분야별 전문 의료진
            </h1>
          </div>
        </div>
      </section>

      <div className="max-w-[1300px] mx-auto py-20 lg:py-32 px-6">

        <div className="space-y-32">
          {DOCTORS.map((doc, idx) => (
            <div key={idx} className={`grid grid-cols-1 lg:grid-cols-12 gap-16 items-start ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`lg:col-span-5 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className="aspect-[3/4] overflow-hidden rounded-[60px] shadow-2xl border border-brand-primary/5">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="lg:col-span-7 space-y-10">
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-brand-primary">{doc.name}</h3>
                  <p className="text-brand-secondary font-black text-[14px] uppercase tracking-widest">{doc.role}</p>
                </div>
                <div className="p-8 bg-white border border-brand-primary/5 rounded-[40px] shadow-sm">
                  <p className="text-lg font-bold text-brand-primary leading-relaxed italic">"{doc.philosophy}"</p>
                </div>
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.3em] border-b border-brand-light pb-2">Academic & Experience</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doc.expertise.map((item, i) => (
                      <li key={i} className="flex gap-3 text-brand-primary/70 font-bold text-sm">
                        <CheckCircle2 size={16} className="text-brand-secondary shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Display detailed medical service info
const MedicalServicePage: React.FC = () => {
  const { service } = useParams();
  const data = service ? SUB_SERVICE_DETAILS[service] : null;

  if (!data) return <div className="py-40 text-center font-bold text-brand-primary/30 uppercase tracking-widest">Service Not Found</div>;

  return (
    <div className="bg-brand-light min-h-screen py-20 lg:py-32 px-6">
      <div className="max-w-[1100px] mx-auto space-y-24">
        {data.image && (
          <div className="w-full aspect-[21/9] rounded-[48px] overflow-hidden shadow-2xl border border-brand-primary/5">
            <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="text-center space-y-8 animate-fade-in-up">
          <span className="text-brand-secondary font-black text-[11px] tracking-[0.4em] uppercase">{data.category}</span>
          <h2 className="serif-title text-4xl lg:text-5xl font-bold text-brand-primary italic leading-tight">{data.title}</h2>
          <div className="h-0.5 w-16 bg-brand-secondary mx-auto"></div>
          <p className="max-w-3xl mx-auto text-brand-primary/60 font-bold text-lg leading-relaxed">{data.intro}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {data.items.map((item: any, i: number) => (
            <div key={i} className="bg-white p-12 rounded-[48px] border border-brand-primary/5 shadow-xl hover:-translate-y-2 transition-transform duration-500">
              <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center mb-8">
                <Heart size={20} className="text-brand-secondary" />
              </div>
              <h4 className="text-xl font-black text-brand-primary mb-6">{item.title}</h4>
              <p className="text-brand-primary/50 font-bold text-[14px] leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>

        {data.process && (
          <div className="bg-brand-primary p-16 lg:p-24 rounded-[60px] text-white">
            <h3 className="serif-title text-3xl font-bold italic mb-12 text-center">Medical Process</h3>
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
    <div className="bg-brand-light min-h-screen py-20 lg:py-32 px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="bg-white rounded-[60px] overflow-hidden shadow-2xl border border-brand-primary/5">
          <div className="bg-brand-primary p-20 text-white text-center">
            <Phone size={48} className="text-brand-secondary mx-auto mb-8" />
            <h2 className="serif-title text-4xl font-bold italic mb-6">진료 상담 및 안내</h2>
            <p className="text-white/60 font-bold max-w-lg mx-auto leading-relaxed">
              메디피아는 27년 전통의 신뢰를 바탕으로 한 분 한 분 정성껏 상담해 드립니다. 
              현재 모든 예약 및 상담은 **전화**를 통해 진행되고 있습니다.
            </p>
          </div>
          <div className="p-16 space-y-16">
            <div className="text-center space-y-8">
              <h4 className="text-[14px] font-black text-brand-secondary uppercase tracking-[0.3em]">Representative Consultation</h4>
              <div 
                className={`text-5xl lg:text-7xl font-black text-brand-primary hover:text-brand-secondary transition-colors ${isMobile ? 'cursor-pointer' : ''}`}
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
                <h4 className="text-lg font-black text-brand-primary italic">평일 상담 시간</h4>
                <div className="space-y-2 text-sm font-bold text-brand-primary/60">
                   <p className="flex justify-between"><span>오전 진료</span><span>09:00 - 13:00</span></p>
                   <p className="flex justify-between"><span>오후 진료</span><span>14:00 - 18:00</span></p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-black text-brand-primary italic">주말 및 공휴일</h4>
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

// Display hospital notices and community updates
const CommunityPage: React.FC = () => {
  return (
    <div className="bg-brand-light min-h-screen py-20 lg:py-32 px-6">
      <div className="max-w-[1200px] mx-auto space-y-20">
        <div className="text-center space-y-4">
          <span className="text-brand-secondary font-black text-[10px] tracking-[0.4em] uppercase">Hospital News</span>
          <h2 className="serif-title text-4xl font-bold text-brand-primary italic">메디피아 소식</h2>
        </div>
        <div className="space-y-6">
          {NOTICE_DATA.map((item) => (
            <div key={item.id} className="bg-white p-10 rounded-[40px] border border-brand-primary/5 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">{item.date}</span>
                <h3 className="text-xl font-black text-brand-primary group-hover:text-brand-secondary transition-colors">{item.title}</h3>
                <p className="text-brand-primary/50 font-bold text-sm leading-relaxed max-w-2xl">{item.content}</p>
              </div>
              <button className="p-4 bg-brand-light rounded-full text-brand-primary group-hover:bg-brand-secondary group-hover:text-white transition-all">
                <ChevronRight size={24} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// -- Main App Component --

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brand" element={<BrandPage />} />
            <Route path="/brand/:sub" element={<BrandPage />} />
            <Route path="/medical/staff" element={<MedicalStaffPage />} />
            <Route path="/medical/:category/:service" element={<MedicalServicePage />} />
            <Route path="/postpartum" element={<PostpartumPage />} />
            <Route path="/postpartum/:sub" element={<PostpartumPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/centers/:centerId" element={<SpecializedCenters />} />
          </Routes>
        </main>
        
        <footer className="bg-brand-primary py-16 px-6 text-white/40 text-[12px] border-t border-white/5">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="serif-title font-bold text-lg text-white/80 tracking-tighter uppercase">{HOSPITAL_INFO.name}</span>
                <span className="text-[9px] text-brand-secondary font-black tracking-widest uppercase mt-1">{HOSPITAL_INFO.engName}</span>
              </div>
              <p className="max-w-md leading-relaxed">
                {HOSPITAL_INFO.openYear}년 개원 이래 27년간 여성의 건강과 생명의 가치를 최우선으로 지켜왔습니다. 남양주를 대표하는 프리미엄 여성 건강의 안식처로서 끊임없이 정진하겠습니다.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Contact Information</h4>
                <p className="text-white/70 font-bold">{HOSPITAL_INFO.address}</p>
                <p className="text-white text-lg font-black">{HOSPITAL_INFO.phone}</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Legal Information</h4>
                <p>사업자등록번호: {HOSPITAL_INFO.regNumber}</p>
                <p>대표자: {HOSPITAL_INFO.director}</p>
                <div className="flex gap-4 pt-2">
                  <button className="hover:text-white transition-colors">개인정보처리방침</button>
                  <button className="hover:text-white transition-colors">이용약관</button>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-white/5 text-center opacity-50">
            © {new Date().getFullYear()} {HOSPITAL_INFO.name}. All Rights Reserved.
          </div>
        </footer>
        
        <GeminiChat />
      </div>
    </HashRouter>
  );
};

export default App;
