
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
  schedule: {
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
