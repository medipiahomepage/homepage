
import React, { useState } from 'react';
import { Lock, Play, Activity } from 'lucide-react';

export const BebeCam: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id && pw) {
      // 모의 로그인
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-brand-light">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-brand-primary/5">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-brand-primary" />
            </div>
            <h2 className="text-2xl font-serif text-brand-primary">베베캠 (Bebe Cam)</h2>
            <p className="text-gray-500 text-sm mt-2">보호자를 위한 실시간 신생아 모니터링</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">산모 성함 또는 ID</label>
              <input 
                type="text" 
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-secondary transition-colors"
                placeholder="ID를 입력해주세요"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">비밀번호</label>
              <input 
                type="password" 
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-secondary transition-colors"
                placeholder="비밀번호를 입력해주세요"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-brand-primary text-white py-4 rounded-lg font-bold hover:bg-brand-secondary transition-colors shadow-lg"
            >
              카메라 접속하기
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-gray-400">
            * 의료진 및 사전에 등록된 보호자 외 접근을 금지합니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pt-10">
      <div className="bg-black rounded-xl overflow-hidden shadow-2xl relative aspect-video">
        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-2 py-1 rounded animate-pulse flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full"></div> 실시간 중계 중
        </div>
        <div className="absolute bottom-4 right-4 text-white/50 text-sm">캠 04: 신생아실 A구역</div>
        
        {/* 모의 비디오 피드 */}
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <img 
                src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=1200" 
                alt="Baby Cam Stream" 
                className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <Play size={48} className="text-white/30" />
            </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <h3 className="text-lg font-bold text-brand-primary">아이: 기쁨이 (김지민 님 보호)</h3>
            <p className="text-sm text-gray-500">생후 12일 | 몸무게: 3.4kg</p>
        </div>
        <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <Activity size={16} />
                <span>상태: 양호</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                <span>체온: 36.5°C</span>
            </div>
        </div>
      </div>
    </div>
  );
};
