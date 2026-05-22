
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SPECIALIZED_CENTERS_DATA } from '../constants';
import { Activity, Clock, ShieldCheck, Stethoscope, ChevronLeft, ArrowRight, CheckCircle2, Info } from 'lucide-react';

import { PageHero } from './PageHero';

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
    <div className="bg-brand-light min-h-screen pb-20">
      <PageHero 
        category="Specialized Medical Center" 
        title={center.title} 
        description={center.subtitle} 
        imageSrc={center.image || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=2000'}
      />
      <div className="max-w-5xl mx-auto px-6 animate-fade-in-up">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-brand-primary/60 font-black text-[11px] uppercase tracking-widest mb-10 hover:text-brand-primary transition-all group"
        >
          <ChevronLeft size={16} /> BACK TO PREVIOUS
        </button>

        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-brand-primary/5 p-10 md:p-16 space-y-12">
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
        
        {/* 안내 정보 박스 렌더링 */}
        {center.infoBox && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
            {center.infoBox.map((box: any, i: number) => (
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

        {/* 검진 항목 테이블 렌더링 */}
        {center.checkupTable && (
          <div className="bg-white rounded-[20px] md:rounded-[40px] border border-brand-primary/5 shadow-xl overflow-hidden hover-glow mt-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse premium-table">
                <thead>
                  <tr>
                    <th className="p-4 md:p-6 text-[13px] md:text-[15px] font-bold border-b border-white/10 whitespace-nowrap tracking-wide">검진 항목</th>
                    <th className="p-4 md:p-6 text-[13px] md:text-[15px] font-bold border-b border-white/10 tracking-wide">상세 내용</th>
                    {center.checkupTable[0]?.cycle && <th className="p-4 md:p-6 text-[13px] md:text-[15px] font-bold border-b border-white/10 whitespace-nowrap tracking-wide">주기</th>}
                  </tr>
                </thead>
                <tbody>
                  {center.checkupTable.map((row: any, i: number) => (
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
        
        {/* 하단 배너 */}
        <div className="bg-brand-light py-8 px-8 text-center border-t border-brand-primary/5">
          <p className="text-brand-primary/30 text-[9px] font-black uppercase tracking-[0.4em]">Heritage & Haven Since 1998</p>
        </div>
      </div>
    </div>
  );
};