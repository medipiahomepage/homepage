import React from 'react';

interface PageHeroProps {
  category: string;
  title: React.ReactNode;
  description: string;
  imageSrc?: string;
  videoSrc?: string;
  children?: React.ReactNode;
  showLanguageSelector?: boolean;
  lang?: string;
  onLangChange?: (lang: any) => void;
}

// 서브페이지 공통 히어로 배너
// 모바일에서 높이/패딩/radius를 축소하여 콘텐츠 영역을 최대화합니다.
export const PageHero: React.FC<PageHeroProps> = ({ 
  category, 
  title, 
  description, 
  imageSrc, 
  videoSrc, 
  children,
  showLanguageSelector = false,
  lang,
  onLangChange
}) => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 pt-2 md:px-6 md:pt-10">
      <div className="relative w-full h-[25vh] md:h-[50vh] min-h-[200px] md:min-h-[240px] max-h-[500px] rounded-[20px] md:rounded-[40px] lg:rounded-[60px] overflow-hidden shadow-2xl mb-6 md:mb-16">
        {videoSrc ? (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <img src={imageSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-5 md:p-8 z-10 animate-fade-in-up">
          <span className="inline-block px-3 md:px-5 py-1.5 md:py-2 bg-white/20 backdrop-blur-md rounded-full text-[9px] md:text-[12px] text-white font-black uppercase tracking-[0.25em] md:tracking-[0.3em] mb-3 md:mb-6 shadow-sm border border-white/10">
            {category}
          </span>
          <h1 className="serif-title text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-white/90 text-[12px] md:text-base lg:text-lg font-bold max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          {children && (
            <div className="mt-6 md:mt-8">
              {children}
            </div>
          )}
        </div>

        {showLanguageSelector && lang && onLangChange && (
          <div className="absolute right-4 bottom-4 md:right-8 md:bottom-8 z-30 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 shadow-lg flex items-center gap-2 md:gap-3 animate-fade-in-up no-scrollbar">
            {[
              { key: 'ko', flagUrl: 'https://flagcdn.com/w80/kr.png', name: '한국어' },
              { key: 'en', flagUrl: 'https://flagcdn.com/w80/us.png', name: 'English' },
              { key: 'ja', flagUrl: 'https://flagcdn.com/w80/jp.png', name: '日本語' },
              { key: 'vi', flagUrl: 'https://flagcdn.com/w80/vn.png', name: 'Tiếng Việt' },
              { key: 'th', flagUrl: 'https://flagcdn.com/w80/th.png', name: 'ภาษาไทย' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => onLangChange(item.key)}
                title={item.name}
                className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center p-0.5 transition-all duration-300 relative overflow-hidden ${
                  lang === item.key
                    ? 'bg-white shadow-md scale-110 ring-2 ring-brand-primary/20'
                    : 'bg-white/15 hover:bg-white/35 active:scale-90 hover:scale-105'
                }`}
              >
                <img 
                  src={item.flagUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover rounded-full"
                />
                {lang === item.key && (
                  <span className="absolute top-0 right-0 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-secondary"></span>
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
