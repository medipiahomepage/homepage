
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

export const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '안녕하세요. 메디피아 프리미엄 상담원 메디입니다. 무엇을 도와드릴까요?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(currentInput, messages);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-10 right-10 z-[80] bg-brand-primary text-brand-secondary p-5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles size={28} strokeWidth={1.5} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-10 md:right-10 z-[200] w-full md:w-[450px] h-full md:h-[700px] bg-white shadow-2xl flex flex-col border border-brand-primary/5 animate-fade-in-up">
          {/* 헤더 */}
          <div className="bg-brand-primary px-8 py-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <Sparkles size={24} className="text-brand-secondary" />
              <div>
                <h3 className="serif-title italic font-bold text-lg">상담원 메디</h3>
                <p className="text-[10px] text-brand-secondary uppercase tracking-widest font-black">인공지능 상담 센터</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <X size={24} strokeWidth={1} />
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-brand-light no-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 text-[14px] font-medium leading-relaxed ${msg.role === 'user' ? 'bg-brand-primary text-white' : 'bg-white border border-brand-primary/5 text-brand-primary'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-5 border border-brand-primary/5 flex gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* 입력창 */}
          <div className="p-8 bg-white border-t border-brand-primary/5">
            <div className="flex items-center gap-4 border-b border-brand-primary/10 pb-4 focus-within:border-brand-secondary transition-all">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="상담 내용을 입력하세요."
                className="flex-1 bg-transparent outline-none text-[15px] text-brand-primary placeholder-brand-primary/30 font-medium"
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !inputText.trim()} 
                className="text-brand-secondary disabled:opacity-20 transition-all"
              >
                <Send size={24} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
