import React from 'react';

interface PageHeroProps {
  category: string;
  title: React.ReactNode;
  description: string;
  imageSrc?: string;
  videoSrc?: string;
  children?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({ category, title, description, imageSrc, videoSrc, children }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-6 md:pt-10">
      <div className="relative w-full h-[40vh] md:h-[50vh] min-h-[350px] max-h-[500px] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl mb-12 md:mb-16">
        {videoSrc ? (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <img src={imageSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 md:p-8 z-10 animate-fade-in-up">
          <span className="inline-block px-4 md:px-5 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] md:text-[12px] text-white font-black uppercase tracking-[0.3em] mb-4 md:mb-6 shadow-sm border border-white/10">
            {category}
          </span>
          <h1 className="serif-title text-3xl md:text-5xl lg:text-5xl font-bold text-white mb-4 md:mb-6 italic leading-tight">
            {title}
          </h1>
          <p className="text-white/90 text-[13px] md:text-lg font-bold max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          {children && (
            <div className="mt-8">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
