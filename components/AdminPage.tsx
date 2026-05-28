import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Notice, Popup, Consultation, Review } from '../types';
import { LogOut, Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notices' | 'popups' | 'consultations' | 'reviews'>('notices');
  const navigate = useNavigate();

  // Notices State
  const [notices, setNotices] = useState<Notice[]>([]);
  const [editingNotice, setEditingNotice] = useState<Partial<Notice> | null>(null);

  // Popups State
  const [popups, setPopups] = useState<Popup[]>([]);
  const [editingPopup, setEditingPopup] = useState<Partial<Popup> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Consultations & Reviews State
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const noticesQuery = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubscribeNotices = onSnapshot(noticesQuery, (snapshot) => {
      setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notice)));
    });

    const popupsQuery = query(collection(db, 'popups'), orderBy('createdAt', 'desc'));
    const unsubscribePopups = onSnapshot(popupsQuery, (snapshot) => {
      setPopups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Popup)));
    });

    const consultationsQuery = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'));
    const unsubscribeConsultations = onSnapshot(consultationsQuery, (snapshot) => {
      setConsultations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Consultation)));
    });

    const reviewsQuery = query(collection(db, 'postpartum_reviews'), orderBy('createdAt', 'desc'));
    const unsubscribeReviews = onSnapshot(reviewsQuery, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    });

    return () => {
      unsubscribeNotices();
      unsubscribePopups();
      unsubscribeConsultations();
      unsubscribeReviews();
    };
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // --- React Quill 설정 (공지사항 에디터) ---
  const quillRef = React.useRef<ReactQuill>(null);

  const imageHandler = React.useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const storageRef = ref(storage, `notices/${Date.now()}_${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', url);
        }
      } catch (error) {
        console.error('Image upload failed', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    };
  }, []);

  const quillModules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  // --- Notice Actions ---
  const saveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice?.title || !editingNotice?.content) return;

    try {
      if (editingNotice.id) {
        await updateDoc(doc(db, 'notices', editingNotice.id), {
          ...editingNotice,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'notices'), {
          ...editingNotice,
          author: user?.email,
          isVisible: editingNotice.isVisible ?? true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setEditingNotice(null);
    } catch (error) {
      console.error(error);
      alert('저장에 실패했습니다.');
    }
  };

  const deleteNotice = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'notices', id));
    }
  };

  // --- Popup Actions ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    
    try {
      const storageRef = ref(storage, `popups/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setEditingPopup(prev => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error(error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploadingImage(false);
    }
  };

  const savePopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPopup?.title || !editingPopup?.startDate || !editingPopup?.endDate) {
      alert('제목과 시작/종료일은 필수입니다.');
      return;
    }

    try {
      if (editingPopup.id) {
        await updateDoc(doc(db, 'popups', editingPopup.id), {
          ...editingPopup,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'popups'), {
          ...editingPopup,
          isVisible: editingPopup.isVisible ?? true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setEditingPopup(null);
    } catch (error) {
      console.error(error);
      alert('저장에 실패했습니다.');
    }
  };

  const deletePopup = async (id: string) => {
    if (window.confirm('정말 이 팝업을 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'popups', id));
    }
  };

  // --- Consultation Actions ---
  const toggleConsultationStatus = async (consultation: Consultation) => {
    const newStatus = consultation.status === '대기중' ? '답변완료' : '대기중';
    await updateDoc(doc(db, 'consultations', consultation.id), { status: newStatus });
  };

  const deleteConsultation = async (id: string) => {
    if (window.confirm('정말 이 상담 내역을 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'consultations', id));
    }
  };

  // --- Review Actions ---
  const deleteReview = async (id: string) => {
    if (window.confirm('정말 이 후기를 삭제하시겠습니까? (관리자 권한)')) {
      await deleteDoc(doc(db, 'postpartum_reviews', id));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-black text-brand-primary text-center mb-6">관리자 로그인</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-primary/80 mb-1">이메일</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-primary/80 mb-1">비밀번호</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-brand-secondary transition-colors mt-4">
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      <header className="bg-white shadow-sm border-b border-brand-primary/10 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black text-brand-primary">메디피아 관리자 센터</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-brand-primary/60">{user.email}</span>
          <button onClick={handleLogout} className="text-brand-primary/60 hover:text-brand-primary flex items-center gap-2 text-sm font-bold">
            <LogOut size={16} /> 로그아웃
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('notices')} 
            className={`px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'notices' ? 'bg-brand-primary text-white shadow-md' : 'bg-white text-brand-primary/60 hover:bg-gray-50'}`}
          >
            공지사항 관리
          </button>
          <button 
            onClick={() => setActiveTab('popups')} 
            className={`px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'popups' ? 'bg-brand-primary text-white shadow-md' : 'bg-white text-brand-primary/60 hover:bg-gray-50'}`}
          >
            팝업 관리
          </button>
          <button 
            onClick={() => setActiveTab('consultations')} 
            className={`px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'consultations' ? 'bg-brand-primary text-white shadow-md' : 'bg-white text-brand-primary/60 hover:bg-gray-50'}`}
          >
            상담 내역 관리
          </button>
          <button 
            onClick={() => setActiveTab('reviews')} 
            className={`px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'bg-brand-primary text-white shadow-md' : 'bg-white text-brand-primary/60 hover:bg-gray-50'}`}
          >
            조리원 후기 관리
          </button>
        </div>

        {activeTab === 'notices' && (
          <div className="space-y-6">
            {!editingNotice ? (
              <div className="bg-white rounded-2xl shadow-sm border border-brand-primary/10 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-black text-brand-primary">공지사항 목록</h2>
                  <button onClick={() => setEditingNotice({ isVisible: true })} className="bg-brand-secondary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-primary transition-colors">
                    <Plus size={16} /> 새 공지사항 등록
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-brand-light">
                        <th className="py-3 px-4 font-bold text-brand-primary/60">상태</th>
                        <th className="py-3 px-4 font-bold text-brand-primary/60">제목</th>
                        <th className="py-3 px-4 font-bold text-brand-primary/60">등록일</th>
                        <th className="py-3 px-4 font-bold text-brand-primary/60">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notices.map(notice => (
                        <tr key={notice.id} className="border-b border-brand-light last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${notice.isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {notice.isVisible ? '표시중' : '숨김'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-brand-primary">{notice.title}</td>
                          <td className="py-3 px-4 text-sm text-brand-primary/60">{notice.createdAt?.toDate?.().toLocaleDateString()}</td>
                          <td className="py-3 px-4 flex gap-2">
                            <button onClick={() => setEditingNotice(notice)} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><Edit2 size={16}/></button>
                            <button onClick={() => deleteNotice(notice.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-brand-primary/10 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-black text-brand-primary">{editingNotice.id ? '공지사항 수정' : '새 공지사항'}</h2>
                  <button onClick={() => setEditingNotice(null)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                </div>
                <form onSubmit={saveNotice} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">제목</label>
                    <input type="text" value={editingNotice.title || ''} onChange={e => setEditingNotice({...editingNotice, title: e.target.value})} className="w-full border rounded-lg px-4 py-2" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">내용</label>
                    <div className="bg-white">
                      <ReactQuill 
                        ref={quillRef}
                        theme="snow"
                        value={editingNotice.content || ''} 
                        onChange={(content) => setEditingNotice({...editingNotice, content})} 
                        modules={quillModules}
                        className="h-64 mb-12"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isVisible" checked={editingNotice.isVisible !== false} onChange={e => setEditingNotice({...editingNotice, isVisible: e.target.checked})} className="w-4 h-4" />
                    <label htmlFor="isVisible" className="font-bold text-sm">목록에 표시</label>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setEditingNotice(null)} className="px-6 py-2 border rounded-lg font-bold hover:bg-gray-50">취소</button>
                    <button type="submit" className="px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-secondary">저장</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'popups' && (
          <div className="space-y-6">
            {!editingPopup ? (
              <div className="bg-white rounded-2xl shadow-sm border border-brand-primary/10 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-black text-brand-primary">팝업 목록</h2>
                  <button onClick={() => setEditingPopup({ isVisible: true, startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0] })} className="bg-brand-secondary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-primary transition-colors">
                    <Plus size={16} /> 새 팝업 등록
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {popups.map(popup => (
                    <div key={popup.id} className="border border-brand-light rounded-xl overflow-hidden shadow-sm">
                      {popup.imageUrl ? (
                        <div className="aspect-video bg-gray-100"><img src={popup.imageUrl} alt="" className="w-full h-full object-cover" /></div>
                      ) : (
                        <div className="aspect-video bg-gray-50 flex items-center justify-center text-gray-400"><ImageIcon size={32}/></div>
                      )}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${popup.isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {popup.isVisible ? '진행중' : '종료/숨김'}
                          </span>
                        </div>
                        <h3 className="font-bold text-brand-primary truncate">{popup.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{popup.startDate} ~ {popup.endDate}</p>
                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                          <button onClick={() => setEditingPopup(popup)} className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-sm font-bold hover:bg-blue-100">수정</button>
                          <button onClick={() => deletePopup(popup.id)} className="flex-1 py-1.5 bg-red-50 text-red-600 rounded text-sm font-bold hover:bg-red-100">삭제</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-brand-primary/10 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-black text-brand-primary">{editingPopup.id ? '팝업 수정' : '새 팝업'}</h2>
                  <button onClick={() => setEditingPopup(null)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                </div>
                <form onSubmit={savePopup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">팝업 제목</label>
                    <input type="text" value={editingPopup.title || ''} onChange={e => setEditingPopup({...editingPopup, title: e.target.value})} className="w-full border rounded-lg px-4 py-2" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">이미지</label>
                    <div className="flex items-center gap-4">
                      {editingPopup.imageUrl && <img src={editingPopup.imageUrl} alt="preview" className="h-20 rounded border" />}
                      <label className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer font-bold text-sm">
                        {uploadingImage ? '업로드 중...' : '이미지 선택'}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">내용 (텍스트가 필요한 경우)</label>
                    <textarea value={editingPopup.content || ''} onChange={e => setEditingPopup({...editingPopup, content: e.target.value})} className="w-full border rounded-lg px-4 py-2 h-24"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">클릭 시 이동할 링크 URL (선택사항)</label>
                    <input type="url" value={editingPopup.linkUrl || ''} onChange={e => setEditingPopup({...editingPopup, linkUrl: e.target.value})} className="w-full border rounded-lg px-4 py-2" placeholder="https://" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">노출 시작일</label>
                      <input type="date" value={editingPopup.startDate || ''} onChange={e => setEditingPopup({...editingPopup, startDate: e.target.value})} className="w-full border rounded-lg px-4 py-2" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">노출 종료일</label>
                      <input type="date" value={editingPopup.endDate || ''} onChange={e => setEditingPopup({...editingPopup, endDate: e.target.value})} className="w-full border rounded-lg px-4 py-2" required />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isPopupVisible" checked={editingPopup.isVisible !== false} onChange={e => setEditingPopup({...editingPopup, isVisible: e.target.checked})} className="w-4 h-4" />
                    <label htmlFor="isPopupVisible" className="font-bold text-sm">활성화 (체크 해제 시 기간과 무관하게 노출되지 않음)</label>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setEditingPopup(null)} className="px-6 py-2 border rounded-lg font-bold hover:bg-gray-50">취소</button>
                    <button type="submit" className="px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-secondary">저장</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'consultations' && (
          <div className="bg-white rounded-2xl shadow-sm border border-brand-primary/10 p-6">
            <h2 className="text-lg font-black text-brand-primary mb-6">상담 내역 관리</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-brand-primary/10">
                    <th className="py-3 px-4 font-bold text-brand-primary/70">상태</th>
                    <th className="py-3 px-4 font-bold text-brand-primary/70">작성자</th>
                    <th className="py-3 px-4 font-bold text-brand-primary/70 min-w-[300px]">내용</th>
                    <th className="py-3 px-4 font-bold text-brand-primary/70">비밀번호</th>
                    <th className="py-3 px-4 font-bold text-brand-primary/70">작성일</th>
                    <th className="py-3 px-4 text-right font-bold text-brand-primary/70">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-brand-primary/50">등록된 상담이 없습니다.</td></tr>
                  ) : consultations.map((item) => (
                    <tr key={item.id} className="border-b border-brand-primary/5 hover:bg-brand-light/30 transition-colors">
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => toggleConsultationStatus(item)}
                          className={`px-3 py-1 rounded-full text-[12px] font-bold ${item.status === '답변완료' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                        >
                          {item.status}
                        </button>
                      </td>
                      <td className="py-4 px-4 font-bold">{item.nickname}</td>
                      <td className="py-4 px-4 text-sm whitespace-pre-line">{item.content}</td>
                      <td className="py-4 px-4 text-sm font-mono text-gray-500">{item.password || '-'}</td>
                      <td className="py-4 px-4 text-sm text-brand-primary/60">{item.createdAt?.toDate?.().toLocaleDateString() || ''}</td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button onClick={() => deleteConsultation(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="삭제">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl shadow-sm border border-brand-primary/10 p-6">
            <h2 className="text-lg font-black text-brand-primary mb-6">조리원 후기 관리 (전체)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-brand-primary/10">
                    <th className="py-3 px-4 font-bold text-brand-primary/70">평점</th>
                    <th className="py-3 px-4 font-bold text-brand-primary/70">작성자</th>
                    <th className="py-3 px-4 font-bold text-brand-primary/70">이용시기</th>
                    <th className="py-3 px-4 font-bold text-brand-primary/70 min-w-[300px]">내용</th>
                    <th className="py-3 px-4 font-bold text-brand-primary/70">작성일</th>
                    <th className="py-3 px-4 text-right font-bold text-brand-primary/70">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-brand-primary/50">등록된 후기가 없습니다.</td></tr>
                  ) : reviews.map((item) => (
                    <tr key={item.id} className="border-b border-brand-primary/5 hover:bg-brand-light/30 transition-colors">
                      <td className="py-4 px-4 text-yellow-500 font-black">{'★'.repeat(item.rating)}</td>
                      <td className="py-4 px-4 font-bold">{item.name}</td>
                      <td className="py-4 px-4 text-sm text-brand-primary/60">{item.period}</td>
                      <td className="py-4 px-4 text-sm whitespace-pre-line">{item.content}</td>
                      <td className="py-4 px-4 text-sm text-brand-primary/60">{item.createdAt?.toDate?.().toLocaleDateString() || ''}</td>
                      <td className="py-4 px-4 text-right">
                        <button onClick={() => deleteReview(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="삭제">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
