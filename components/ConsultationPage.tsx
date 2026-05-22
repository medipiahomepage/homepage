import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PageHero } from './PageHero';
import { Send, Lock, User, MessageSquare, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ConsultationPage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !password.trim() || !content.trim()) {
      setErrorMsg('모든 항목을 입력해주세요.');
      return;
    }
    if (password.length !== 4 || isNaN(Number(password))) {
      setErrorMsg('비밀번호는 숫자 4자리로 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await addDoc(collection(db, 'consultations'), {
        nickname: nickname.trim(),
        password: password.trim(),
        content: content.trim(),
        status: '대기중',
        createdAt: serverTimestamp(),
      });
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error adding consultation:', error);
      setErrorMsg('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-light min-h-screen pb-20 lg:pb-32">
      <PageHero 
        category="Consultation"
        title={
          <>
            무엇이든 물어보세요<br />상담내용 남기기
          </>
        }
        description="궁금한 점을 남겨주시면 담당자가 빠르고 친절하게 답변해 드립니다."
        imageSrc="/images/consultation_hero.png" // User provided image
      />
      
      <div className="max-w-[800px] mx-auto px-4 md:px-6">
        {submitSuccess ? (
          <div className="bg-white rounded-3xl p-10 md:p-16 text-center shadow-xl border border-brand-primary/5 animate-fade-in-up">
            <div className="w-20 h-20 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send size={32} className="text-brand-secondary" />
            </div>
            <h3 className="serif-title text-2xl font-bold text-brand-primary mb-4">상담 접수가 완료되었습니다!</h3>
            <p className="text-brand-primary/60 font-medium leading-relaxed mb-10">
              남겨주신 소중한 문의는 담당자가 확인 후<br className="md:hidden" />빠른 시일 내에 연락드리거나 답변을 남겨드리겠습니다.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-secondary transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-brand-primary/5 animate-fade-in-up">
            
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold">
                <AlertCircle size={18} />
                {errorMsg}
              </div>
            )}

            <div className="space-y-6 md:space-y-8">
              {/* 닉네임 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-brand-primary mb-2">
                  <User size={16} className="text-brand-secondary" />
                  닉네임 (성함)
                </label>
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-5 py-4 bg-brand-light/30 border border-brand-primary/10 rounded-xl focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                  maxLength={20}
                />
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-brand-primary mb-2">
                  <Lock size={16} className="text-brand-secondary" />
                  비밀번호 4자리
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="숫자 4자리 입력 (예: 1234)"
                  className="w-full px-5 py-4 bg-brand-light/30 border border-brand-primary/10 rounded-xl focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                  maxLength={4}
                  pattern="\d{4}"
                />
                <p className="text-brand-primary/40 text-xs mt-2 font-medium">※ 추후 본인의 상담 내용을 확인할 때 필요합니다.</p>
              </div>

              {/* 상담 내용 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-brand-primary mb-2">
                  <MessageSquare size={16} className="text-brand-secondary" />
                  상담하고 싶은 내용
                </label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="궁금하신 점이나 상담을 원하시는 내용을 자세히 적어주세요."
                  className="w-full h-48 px-5 py-4 bg-brand-light/30 border border-brand-primary/10 rounded-xl focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all resize-none custom-scrollbar"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-brand-primary text-white font-bold text-lg rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg"
                >
                  {isSubmitting ? '전송 중...' : '상담 내용 남기기'}
                  {!isSubmitting && <Send size={20} />}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
