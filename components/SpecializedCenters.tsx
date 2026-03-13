
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SPECIALIZED_CENTERS_DATA } from '../constants';
import { Activity, Clock, ShieldCheck, Stethoscope, ChevronLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SpecializedCenters: React.FC = () => {
  const { centerId } = useParams<{ centerId: string }>();
  const navigate = useNavigate();
  const center = centerId ? SPECIALIZED_CENTERS_DATA[centerId] : null;

  if (!center) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-400 font-bold">센터 정보를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-brand-primary font-bold hover:underline transition-all">홈으로 가기</button>
      </div>
    );
  }

  return (
    <div className="pt-10 md:pt-20 pb-20 max-w-5xl mx-auto px-6 animate-fade-in-up">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-brand-primary/60 font-black text-[11px] uppercase tracking-widest mb-10 hover:text-brand-primary transition-all group"
      >
        <ChevronLeft size={16} /> BACK TO PREVIOUS
      </button>

      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-brand-primary/5">
        {/* 히어로 헤더 */}
        <div className="bg-brand-primary p-12 md:p-20 text-white text-center">
          <span className="inline-block px-4 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-6">Specialized Medical Center</span>
          <h1 className="serif-title text-3xl md:text-4xl font-bold mb-4 italic leading-tight">{center.title}</h1>
          <p className="text-white/70 text-base md:text-lg font-bold max-w-xl mx-auto leading-relaxed">{center.subtitle}</p>
        </div>

        <div className="p-10 md:p-16 space-y-12">
          {/* 소개 섹션 */}
          <div className="bg-brand-light p-10 rounded-3xl border border-brand-primary/5">
            <p className="text-brand-primary/70 text-base md:text-lg leading-relaxed text-center font-bold">
              {center.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* 왼쪽: 주요 진료 분야 */}
            <div className="lg:col-span-7 space-y-8">
              <h3 className="serif-title text-xl font-bold text-brand-primary flex items-center gap-3 border-b border-brand-light pb-4 italic">
                <Stethoscope size={20} className="text-brand-secondary" /> Clinical Services
              </h3>
              
              <div className="space-y-4">
                {(center.departments || center.services || center.menu || center.programs).map((item: any, i: number) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-brand-primary/5 shadow-sm hover:shadow-md transition-all group">
                    <h4 className="font-black text-brand-primary text-base mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-brand-secondary" />
                        {item.name || item.title}
                      </span>
                    </h4>
                    <p className="text-brand-primary/50 text-[13px] font-bold leading-relaxed ml-6">
                      {item.symptoms || item.detail || item.target || item.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽: 특징 및 운영 */}
            <div className="lg:col-span-5 space-y-8">
              <h3 className="serif-title text-xl font-bold text-brand-primary flex items-center gap-3 border-b border-brand-light pb-4 italic">
                <Activity size={20} className="text-brand-secondary" /> Key Features
              </h3>
              
              <div className="bg-brand-light p-8 rounded-3xl border border-brand-primary/5 space-y-8">
                <ul className="space-y-4">
                  {(center.features || center.targets || []).map((text: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <ShieldCheck size={18} className="text-brand-primary mt-1 shrink-0" />
                      <span className="text-brand-primary/80 font-bold text-[14px] leading-snug">{text}</span>
                    </li>
                  ))}
                </ul>
                
                {center.hours && (
                  <div className="pt-6 border-t border-brand-primary/5">
                    <h4 className="text-[10px] font-black text-brand-secondary uppercase mb-3 flex items-center gap-2 tracking-widest">
                      <Clock size={14} /> Service Hours
                    </h4>
                    <p className="text-brand-primary font-bold text-[15px] bg-white p-4 rounded-xl shadow-sm">
                      {center.hours}
                    </p>
                  </div>
                )}

                <button onClick={() => navigate('/reservation')} className="w-full bg-brand-primary text-white py-4 rounded-full font-black text-[12px] tracking-widest uppercase shadow-lg hover:opacity-90 transition-all">
                  Book an Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 하단 배너 */}
        <div className="bg-brand-light py-8 px-8 text-center border-t border-brand-primary/5">
          <p className="text-brand-primary/30 text-[9px] font-black uppercase tracking-[0.4em]">Heritage & Haven Since 1998</p>
        </div>
      </div>
    </div>
  );
};