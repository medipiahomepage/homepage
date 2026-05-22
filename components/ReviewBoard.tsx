import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { Send, Lock, User, MessageSquare, AlertCircle, Calendar, Trash2, X } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  period: string;
  content: string;
  password?: string;
  createdAt: any;
  rating: number;
}

export const ReviewBoard: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [period, setPeriod] = useState('2주 입실');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'postpartum_reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewData: Review[] = [];
      snapshot.forEach((doc) => {
        reviewData.push({ id: doc.id, ...doc.data() } as Review);
      });
      setReviews(reviewData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim() || !content.trim()) {
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
      await addDoc(collection(db, 'postpartum_reviews'), {
        name: name.trim() + ' 산모님',
        password: password.trim(),
        period: period,
        content: content.trim(),
        rating: 5,
        createdAt: serverTimestamp(),
      });
      setName('');
      setPassword('');
      setContent('');
      setShowForm(false);
    } catch (error) {
      console.error('Error adding review:', error);
      setErrorMsg('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    if (deletePassword.length !== 4 || isNaN(Number(deletePassword))) {
      setDeleteError('비밀번호는 숫자 4자리로 입력해주세요.');
      return;
    }

    setDeleteError('');
    try {
      const docRef = doc(db, 'postpartum_reviews', deleteTargetId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.password === deletePassword) {
          await deleteDoc(docRef);
          setDeleteTargetId(null);
          setDeletePassword('');
        } else {
          setDeleteError('비밀번호가 일치하지 않습니다.');
        }
      } else {
        setDeleteError('존재하지 않는 후기입니다.');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setDeleteError('삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* 작성 버튼 */}
      {!showForm && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-secondary transition-colors shadow-lg flex items-center gap-2"
          >
            <MessageSquare size={18} />
            후기 작성하기
          </button>
        </div>
      )}

      {/* 후기 작성 폼 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-6 md:p-10 shadow-xl border border-brand-primary/5 animate-fade-in-up">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-bold text-brand-primary">산후조리원 이용 후기 작성</h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-primary hover:bg-brand-secondary/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold">
              <AlertCircle size={18} />
              {errorMsg}
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 닉네임 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-brand-primary mb-2">
                  <User size={16} className="text-brand-secondary" />
                  성함 (실명 또는 별명)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 김지영"
                  className="w-full px-5 py-4 bg-brand-light/30 border border-brand-primary/10 rounded-xl focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                  maxLength={10}
                />
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-brand-primary mb-2">
                  <Lock size={16} className="text-brand-secondary" />
                  비밀번호 4자리 (수정/삭제용)
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
              </div>
            </div>

            {/* 입실 기간 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-brand-primary mb-2">
                <Calendar size={16} className="text-brand-secondary" />
                이용 기간
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-5 py-4 bg-brand-light/30 border border-brand-primary/10 rounded-xl focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all text-brand-primary font-medium"
              >
                <option value="1주 입실">1주 입실</option>
                <option value="2주 입실">2주 입실</option>
                <option value="3주 입실">3주 입실</option>
                <option value="기타">기타</option>
              </select>
            </div>

            {/* 후기 내용 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-brand-primary mb-2">
                <MessageSquare size={16} className="text-brand-secondary" />
                후기 내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="메디피아 산후조리원에서의 경험을 자유롭게 작성해주세요."
                className="w-full h-40 px-5 py-4 bg-brand-light/30 border border-brand-primary/10 rounded-xl focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all resize-none custom-scrollbar"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-brand-primary text-white font-bold text-lg rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg"
              >
                {isSubmitting ? '등록 중...' : '후기 등록하기'}
                {!isSubmitting && <Send size={20} />}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 삭제 모달 */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setDeleteTargetId(null)}>
          <div className="bg-white rounded-[24px] p-8 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-brand-primary mb-4 text-center">후기 삭제</h3>
            <p className="text-brand-primary/60 text-sm font-medium mb-6 text-center">작성 시 입력한 비밀번호를 입력해주세요.</p>
            
            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold text-center">
                {deleteError}
              </div>
            )}

            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="비밀번호 4자리"
              className="w-full px-5 py-4 mb-6 bg-brand-light/30 border border-brand-primary/10 rounded-xl focus:outline-none text-center tracking-widest text-lg"
              maxLength={4}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-3 bg-brand-light text-brand-primary font-bold rounded-xl"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-brand-secondary text-white font-bold rounded-xl hover:opacity-90"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 후기 리스트 */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-brand-primary/5">
            <MessageSquare size={48} className="text-brand-primary/20 mx-auto mb-4" />
            <p className="text-brand-primary/60 font-bold">아직 등록된 후기가 없습니다.<br/>첫 후기를 남겨주세요!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-[20px] md:rounded-[32px] border border-brand-primary/5 shadow-sm hover:shadow-xl transition-all p-6 md:p-10 space-y-4 hover-lift group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-secondary/15 flex items-center justify-center text-brand-secondary font-black text-lg shrink-0">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-brand-primary text-[15px]">{review.name}</p>
                    <p className="text-brand-primary/50 text-[12px] font-bold mt-0.5">{formatDate(review.createdAt)} · {review.period}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-0.5 shrink-0">
                    {Array.from({ length: review.rating || 5 }).map((_, i) => (
                      <span key={i} className="text-amber-400 text-[16px]">★</span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setDeleteTargetId(review.id);
                      setDeletePassword('');
                      setDeleteError('');
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-primary/30 hover:text-red-500 text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 size={12} /> 삭제
                  </button>
                </div>
              </div>
              <p className="text-brand-primary/75 font-medium text-[14px] md:text-[15px] leading-[1.9] whitespace-pre-wrap">
                "{review.content}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
