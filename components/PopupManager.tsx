import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Popup } from '../types';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PopupManager: React.FC = () => {
  const [activePopups, setActivePopups] = useState<Popup[]>([]);
  const navigate = useNavigate();

  // KST(한국 표준시) 기준 오늘 날짜 구하기 (YYYY-MM-DD)
  const getKSTDateString = () => {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return kst.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const today = getKSTDateString();
        const q = query(
          collection(db, 'popups'),
          where('isVisible', '==', true)
        );
        const snapshot = await getDocs(q);
        const popups: Popup[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data() as Popup;
          // Client-side date filtering
          if (data.startDate <= today && data.endDate >= today) {
            // Check if user dismissed it today
            const dismissedData = localStorage.getItem(`popup_dismissed_${doc.id}`);
            if (dismissedData !== today) {
              popups.push({ id: doc.id, ...data });
            }
          }
        });
        
        setActivePopups(popups);
      } catch (error) {
        console.error('Error fetching popups:', error);
      }
    };

    fetchPopups();
  }, []);

  const closePopup = (id: string, noShowToday: boolean) => {
    if (noShowToday) {
      const today = getKSTDateString();
      localStorage.setItem(`popup_dismissed_${id}`, today);
    }
    setActivePopups(prev => prev.filter(p => p.id !== id));
  };

  const handlePopupClick = (popup: Popup) => {
    if (popup.linkUrl) {
      if (popup.linkUrl.startsWith('http')) {
        window.open(popup.linkUrl, '_blank');
      } else {
        navigate(popup.linkUrl);
        closePopup(popup.id, false);
      }
    }
  };

  if (activePopups.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center sm:items-start sm:justify-start sm:p-10 gap-4 flex-wrap overflow-y-auto">
      {/* Background Overlay - only for mobile to focus on popup, on desktop it floats */}
      <div className="absolute inset-0 bg-black/40 pointer-events-auto sm:hidden" />
      
      {activePopups.map((popup) => (
        <div key={popup.id} className="relative z-10 w-[90vw] max-w-[400px] md:max-w-[500px] lg:max-w-[600px] max-h-[85vh] bg-white rounded-[32px] border-4 border-brand-light shadow-[0_20px_50px_-12px_rgba(223,139,172,0.3)] overflow-hidden pointer-events-auto animate-fade-in-up m-auto sm:m-0 flex flex-col">
          
          <div className="overflow-y-auto flex-1 w-full custom-scrollbar">
            {popup.imageUrl && (
              <div 
                className={`w-full bg-brand-light/30 relative p-5 pb-2 ${popup.linkUrl ? 'cursor-pointer' : ''}`}
                onClick={() => handlePopupClick(popup)}
              >
                <div className="overflow-hidden rounded-[20px] shadow-md border border-brand-primary/10">
                  <img src={popup.imageUrl} alt={popup.title} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            )}
            
            {(!popup.imageUrl || popup.content) && (
              <div className={`p-6 px-8 bg-white ${popup.linkUrl ? 'cursor-pointer hover:bg-brand-light/20 transition-colors' : ''}`} onClick={() => handlePopupClick(popup)}>
                <h3 className="font-black text-brand-primary text-xl mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-secondary shrink-0"></span>
                  {popup.title}
                </h3>
                {popup.content && <p className="text-brand-primary/70 font-bold text-[14px] whitespace-pre-line leading-relaxed">{popup.content}</p>}
              </div>
            )}
          </div>

          <div className="flex bg-white shrink-0 p-3 gap-3 border-t border-brand-primary/5">
            <button 
              onClick={() => closePopup(popup.id, true)}
              className="flex-1 py-3 text-[13px] font-bold text-brand-primary/60 bg-brand-light/50 hover:bg-brand-light hover:text-brand-primary transition-colors rounded-xl"
            >
              오늘 하루 보지 않기
            </button>
            <button 
              onClick={() => closePopup(popup.id, false)}
              className="flex-1 py-3 text-[13px] font-black text-white bg-brand-primary hover:bg-brand-secondary transition-colors rounded-xl shadow-md"
            >
              닫기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
