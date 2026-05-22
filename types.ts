
export interface NavItem {
  label: string;
  path?: string;
  children?: NavItem[];
}

export interface Schedule {
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

export interface Doctor {
  name: string;
  role: string;
  image: string;
  philosophy: string;
  expertise: string[];
  fields?: string[];
  // schedule은 선택 필드 — 마취과처럼 외래 진료 일정이 없는 의료진은 미표시
  schedule?: {
    am: Schedule;
    pm: Schedule;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any;
  isVisible: boolean;
  author: string;
}

export interface Popup {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isVisible: boolean;
  createdAt: any;
  updatedAt: any;
}
