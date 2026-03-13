
import { NavItem, Doctor } from './types';

export const HOSPITAL_INFO = {
  name: "메디피아산부인과",
  engName: "MEDIPIA OB & GYN",
  address: "경기도 남양주시 경춘로 1511 (호평동 14, 메디피아 빌딩)",
  regNumber: "132-90-25046",
  openYear: "1998",
  phone: "031-595-8400",
  director: "한상철"
};

export const DIRECTOR_GREETING_IMAGE = "https://www.dropbox.com/scl/fi/w6c0hiht6huwm39x0id0l/Gemini_Generated_Image_u3gj0xu3gj0xu3gj-1.png?rlkey=jtitxfeo1htvdvd53xargwfao&st=q64f45us&raw=1";
export const HOME_HERO_VIDEO = "https://www.dropbox.com/scl/fi/003cpx88e9b0vb3b0e19a/grok-video-57991cbc-336f-4ff4-bd5a-eb7d1f6df436.mp4?rlkey=a453wpn3z5a746xhwoeehkmbm&st=wdfsvsoj&dl=1";

// 사용자 제공 로비/라운지 이미지
export const LOBBY_IMAGE_URL = "https://www.dropbox.com/scl/fi/8cln6bzu2olr7de5ap9j9/_.png?rlkey=wgb3n1819t59bgwxhwaro3xoc&st=rkdro8og&raw=1";

// 산후조리원 메인 이미지
export const POSTPARTUM_MAIN_IMAGE = "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=1600";

export const NAV_ITEMS: NavItem[] = [
  { 
    label: '병원소개', 
    path: '/brand',
    children: [
      { label: '대표 인사말', path: '/brand' },
      { label: '의료진 소개', path: '/medical/staff' },
      { label: '진료시간', path: '/brand/hours' },
      { label: '시설 안내', path: '/brand/preview' },
      { label: '오시는 길', path: '/brand/location' }
    ]
  },
  {
    label: '분만센터',
    path: '/medical/obs/high-risk',
    children: [
      { label: '고위험임신', path: '/medical/obs/high-risk' },
      { label: '임신 주기별 검사', path: '/medical/obs/basic' },
      { label: '4D 정밀 초음파', path: '/medical/obs/ultrasound' }
    ]
  },
  { 
    label: '여성센터', 
    path: '/medical/gyn/laparoscopy',
    children: [
      { label: '복강경 수술', path: '/medical/gyn/laparoscopy' },
      { label: '자궁경 수술', path: '/medical/gyn/hysteroscopy' },
      { label: '여성암 정밀 검진', path: '/medical/gyn/cancer' },
      { label: '질염·골반염·방광염', path: '/medical/gyn/inflammation' },
      { label: '갱년기·폐경기 관리', path: '/medical/gyn/menopause' },
      { label: '유방 맘모톰', path: '/medical/gyn/mammotome' }
    ]
  },
  {
    label: '요실금·성형센터',
    path: '/centers/incontinence-plastic'
  },
  { 
    label: '내과·종합검진센터', 
    path: '/medical/internal/national',
    children: [
      { label: '국가 건강검진', path: '/medical/internal/national' },
      { label: '맞춤 종합 검진', path: '/medical/internal/comprehensive' },
      { label: '채용 신체검사', path: '/medical/internal/employment' },
      { label: '위/대장 내시경', path: '/medical/internal/endoscopy' },
      { label: '초음파', path: '/medical/internal/us-exam' },
      { label: '만성질환클리닉', path: '/medical/internal/chronic' }
    ]
  },
  { 
    label: '산후조리원', 
    path: '/postpartum',
    children: [
      { label: '프로그램', path: '/postpartum/program' },
      { label: '예약 및 비용 안내', path: '/postpartum/rooms' },
      { label: '이용후기', path: '/postpartum/reviews' }
    ]
  },
  { label: '온라인상담', path: '/reservation' },
  { label: '메디피아소식', path: '/community' },
];

export const SUB_SERVICE_DETAILS: Record<string, any> = {
  'high-risk': { 
    title: "고위험 임신 집중 케어 클리닉", 
    category: "OBSTETRICS",
    image: "https://www.dropbox.com/scl/fi/hec8qjfi2l9qn38vg96xd/.png?rlkey=tirn53eypdlkdx44wobgn94yo&st=rjg8sfdd&raw=1",
    intro: "35세 이상의 고령 임신, 다태아 임신, 임신성 당뇨 및 고혈압, 조기 진통 등 특별한 주의가 필요한 모든 산모님을 위해 27년 경력의 산과 전문의 팀이 24시간 밀착 케어와 정밀 진단을 제공합니다.", 
    items: [
      { title: "임신중독증 및 자궁경부 무력증 관리", detail: "조기 진단 시스템을 통해 고위험군을 선별하고, 원내 상주 전문의가 실시간 모니터링을 시행하며 필요한 경우 즉각적인 처치를 진행합니다." },
      { title: "조기 진통 및 조산 예방 집중 치료", detail: "안정적인 임신 유지를 위한 집중 케어 병동을 운영하며, 조기 양막 파수 시 응급 분만 대응 시스템을 24시간 가동하여 산모와 태아의 안전을 최우선으로 합니다." },
      { title: "정밀 태아 안녕 검사 (NST)", detail: "태아의 심박수 변화와 산모의 자궁 수축 정도를 정교하게 분석하여 뱃속 아기의 건강 상태를 실시간으로 확인하고 이상 징후를 조기에 발견합니다." }
    ],
    process: ["사전 위험도 선별 문진", "정밀 초음파 및 혈액 검사", "전문의 맞춤 관리 계획 수립", "정기적 NST 모니터링", "분만 시 응급 대응 팀 대기"]
  },
  'basic': { 
    title: "임신 주기별 필수 정기 검진", 
    category: "OBSTETRICS",
    image: "https://www.dropbox.com/scl/fi/3t20zju7g686czrccked5/.png?rlkey=c63fs8itgr9ilpbvcr8v0iw9o&st=4c39abtx&raw=1",
    intro: "임신 초기부터 출산까지 산모와 아기의 건강한 10개월을 위해 각 주기에 반드시 필요한 검사를 철저히 시행하여 안전한 만남을 준비합니다.", 
    items: [
      { title: "임신 초기 검사 (1~12주)", detail: "태아 심박 확인, 산전 기본 혈액 검사(빈혈, 혈액형, 풍진 등), 요검사, 1차 기형아 검사(목덜미 투명대 측정)를 시행합니다." },
      { title: "임신 중기 검사 (13~28주)", detail: "2차 기형아 검사(쿼드/니프티 등), 정밀 초음파를 통한 장기 형성 확인, 임신성 당뇨 검사 및 빈혈 재검사를 진행합니다." },
      { title: "임신 후기 검사 (29~40주)", detail: "태아 위치 및 발육 상태 확인, 태동 검사(NST), 분만 전 최종 검사(심전도, 흉부 X-ray)를 통해 안전한 출산을 대비합니다." }
    ]
  },
  'ultrasound': { 
    title: "4D 정밀 입체 초음파 센터", 
    category: "OBSTETRICS",
    image: "https://www.dropbox.com/scl/fi/wtn5vk8mkkbtwrcah64j1/4D.png?rlkey=9dhzrw6dejdrxlv4djpsrtyy8&st=jvb29mhn&raw=1",
    intro: "대학병원급 초정밀 초음파 장비를 도입하여 태아의 미세한 움직임부터 주요 장기의 구조적 이상까지 정확하게 관찰하고 판독합니다.", 
    items: [
      { title: "태아 심장 정밀 초음파", detail: "선천성 심장 기형 여부를 판별하기 위해 심실, 심방의 구조와 판막의 움직임, 혈류의 흐름을 면밀히 분석합니다." },
      { title: "4D 생생한 입체 영상 촬영", detail: "뱃속 아기의 오밀조밀한 이목구비와 손가락, 발가락 등 외형적 발달 상태를 실제와 가까운 입체 영상으로 확인하며 가족과 첫 교감을 나눕니다." }
    ]
  },
  'delivery-info': { 
    title: "젠틀버스(Gentle Birth) 인권 분만", 
    category: "OBSTETRICS",
    image: "https://www.dropbox.com/scl/fi/9xwutthyuqwx7mxlp8mqy/.png?rlkey=v2vcj6oifqa1cj2gajqsh638p&st=npan12xe&raw=1",
    intro: "아기에게는 스트레스 없는 평화로운 환경을 제공하고, 산모님께는 주체적이고 존중받는 분만 경험을 드리는 메디피아만의 분만 철학입니다.", 
    items: [
      { title: "인권을 존중하는 젠틀버스 분만", detail: "조명과 소음을 절제한 환경에서 아기가 부드럽게 세상에 나오도록 돕고, 탯줄 자르기 지연과 캥거루 케어를 통해 산모와 아기의 유대감을 강화합니다." },
      { title: "무흉터/미세봉합 제왕절개 수술", detail: "성형외과적 정교한 봉합 기술을 도입하여 수술 흉터 노출을 최소화하고, 수술 부위의 빠른 회복을 위해 최적의 술기를 적용합니다." },
      { title: "무통/통증 제어 시스템 (Pain-Buster)", detail: "분만 및 수술 후 통증을 획기적으로 줄여주는 정밀 약물 주입 시스템을 운영하여 산모님의 신체적, 심리적 안정을 돕습니다." }
    ]
  },
  'laparoscopy': { 
    title: "단일공 미세 침습 복강경 수술", 
    category: "GYNECOLOGY",
    image: "https://www.dropbox.com/scl/fi/udgcu38n8dtygtdbydk2u/.png?rlkey=3c9e73s2n611u3m02nli5ushi&st=0mz8bg5i&raw=1",
    intro: "배꼽 한 곳만 최소 절개하여 흉터가 거의 남지 않으며, 통증이 적고 일상 복귀가 매우 빠른 첨단 수술법으로 자궁과 난소의 건강을 지킵니다.", 
    items: [
      { title: "자궁근종 및 선근증 수술", detail: "자궁의 정상 조직을 최대한 보존하면서 병변만 정교하게 제거하여 여성의 가임력을 유지하고 삶의 질을 개선합니다." },
      { title: "난소 낭종 및 난관 수술", detail: "난소 기능을 손상시키지 않는 세밀한 박리 기술로 여성 호르몬 밸런스를 지키고 난소 건강을 보존합니다." }
    ]
  },
  'hysteroscopy': { 
    title: "무절개 자궁경 내시경 수술", 
    category: "GYNECOLOGY",
    image: "https://www.dropbox.com/scl/fi/9co3w405ack46fmaik1wb/.png?rlkey=44oxfbya3h2p4s1zsfq01o21r&st=fujrg2cs&raw=1",
    intro: "복부 절개 없이 자궁 내부로 내시경을 삽입하여 폴립이나 근종을 직접 보면서 안전하게 제거하는 환자 친화적 수술입니다.", 
    items: [
      { title: "자궁 내막 폴립 및 점막하 근종 제거", detail: "부정 출혈이나 난임의 원인이 되는 자궁 내막의 이상 조직을 정밀하게 제거하여 최적의 자궁 환경을 조성합니다." },
      { title: "자궁 내부 유착 박리술", detail: "내시경으로 유착 부위를 정확히 분리하여 정상적인 생리 주기 회복과 착상 성공률을 높이는 데 기여합니다." }
    ]
  },
  'cancer': { 
    title: "여성암 정밀 스크리닝 센터", 
    category: "GYNECOLOGY",
    image: "https://www.dropbox.com/scl/fi/ikgsj2pdqf2qgaf2og5cu/.png?rlkey=lc9fz9jm6re0xpsw8ji7m55w1&st=lw43rjci&raw=1",
    intro: "자궁경부암, 유방암 등 여성에게 흔히 발생하는 주요 암을 조기에 발견하고 예방하기 위한 전문적인 검진 프로그램을 운영합니다.", 
    items: [
      { title: "액상 자궁경부 세포 검사", detail: "일반 세포 검사보다 높은 정확도를 가진 액상법을 도입하여 암 전단계의 미세한 변화를 신속하게 진단합니다." },
      { title: "HPV DNA 정밀 타이핑 검사", detail: "자궁경부암의 주요 원인인 인유두종 바이러스의 감염 여부와 고위험군 유형을 분석하여 개인별 예방 계획을 수립합니다." }
    ]
  },
  'menopause': { 
    title: "갱년기·폐경기 관리 센터", 
    category: "GYNECOLOGY",
    image: "https://www.dropbox.com/scl/fi/77epivd0pdbzwo739zlsw/.png?rlkey=8ijm7ooca90fjfehnghjnqln5&st=fkeyb65j&raw=1",
    intro: "여성의 제2의 인생인 갱년기·폐경기를 건강하게 설계합니다. 안면홍조, 골다공증, 수면장애 등 다양한 증상에 대해 정밀 검사 후 맞춤형 솔루션을 제공합니다.", 
    items: [
      { title: "개인별 맞춤 호르몬 보충 요법", detail: "안면홍조, 골다공증 등 갱년기 증상 완화를 위해 정밀 검사 후 최적화된 안전한 호르몬 솔루션을 제안합니다." },
      { title: "갱년기 정밀 스크리닝", detail: "여성 호르몬 수치 검사, 골밀도 검사, 심혈관 위험 평가를 통해 폐경 전후 건강 상태를 종합적으로 평가하고 관리합니다." }
    ]
  },
  'national': { 
    title: "국가 건강검진 가이드 (5대 암 검진)", 
    category: "INTERNAL MEDICINE",
    image: "https://www.dropbox.com/scl/fi/cgqsvwt9647u2h6xkmnj9/.png?rlkey=l5kd5f0qhp1zj0zi3g2pb1j35&st=i4mquvyb&raw=1",
    intro: "메디피아는 국민건강보험공단 지정 우수 검진 기관으로, 대학병원급 장비를 통해 질병의 조기 발견과 예방에 앞장섭니다.", 
    items: [
      { title: "일반 검진 및 5대 암 검진 항목", detail: "위암(40세~, 위내시경), 대장암(50세~, 분변검사), 유방암, 자궁암, 간암 검진을 전문적으로 시행합니다." },
      { title: "위/대장 내시경 원스톱 시스템", detail: "내과 전문의가 직접 시행하며, 검사 중 발견된 선종성 용종을 당일 즉시 제거하여 암 발생 원인을 사전에 차단합니다." }
    ]
  },
  'endoscopy': { 
    title: "CO2 무통 내시경 센터", 
    category: "INTERNAL MEDICINE",
    image: "https://www.dropbox.com/scl/fi/6mu44ja0qmrjs51wacufy/CO2.png?rlkey=a2y6oyj7yd7ktagtkir460iz1&st=fhe8r78q&raw=1",
    intro: "검사 후 복부 팽만감과 통증을 획기적으로 줄여주는 CO2 주입 시스템을 도입하여 가장 편안한 수면 내시경 경험을 제공합니다.", 
    items: [
      { title: "내과 전문의 수면 내시경 시스템", detail: "풍부한 경험의 전문의가 직접 시행하며, 실시간 환자 감시 모니터링을 통해 안전한 수면 상태를 보장합니다." },
      { title: "엄격한 멸균 및 세척 소독 시스템", detail: "대학병원급 자동 세척기를 이용한 1인 1기구 원칙의 엄격한 소독 관리로 감염 걱정 없는 위생적인 검사를 약속합니다." }
    ]
  },
  'chronic': { 
    title: "만성질환 집중 관리 클리닉", 
    category: "INTERNAL MEDICINE",
    image: "https://www.dropbox.com/scl/fi/h8fg9xb8htp5twayf19bo/.png?rlkey=25arcmiv9bpqj4uom26m35vnq&st=mokl1yyt&raw=1",
    intro: "고혈압, 당뇨, 고지혈증 등 평생 관리가 필요한 현대인의 만성질환을 내과 전문의가 데이터 기반으로 체계적으로 케어합니다.", 
    items: [
      { title: "개인별 맞춤 수치 관리 솔루션", detail: "단순 약물 처방을 넘어 식이 조절, 운동 상담 등 환자의 라이프스타일 전반을 가이드하여 목표 수치를 안전하게 유지합니다." },
      { title: "심혈관 합병증 정밀 스크리닝", detail: "경동맥 초음파, 심전도, 골밀도 검사 등을 정기적으로 시행하여 만성질환으로 인한 2차 합병증을 사전에 방지합니다." }
    ]
  },
  'inflammation': {
    title: "질염·골반염·방광염 클리닉",
    category: "GYNECOLOGY",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=1600",
    intro: "여성에게 흔하지만 방치하면 만성화되기 쉬운 질염·골반염·방광염을 정확한 진단과 맞춤 치료로 빠르게 회복시켜 드립니다. 불편하고 예민한 증상, 혼자 고민하지 마세요.",
    items: [
      { title: "질염 (세균성·칸디다·트리코모나스)", detail: "다양한 원인균에 의한 질염을 정밀 배양 검사로 정확하게 구분하고 원인에 맞는 맞춤 치료를 시행합니다." },
      { title: "골반염(PID) 집중 치료", detail: "자궁, 난관 등 골반 장기의 감염으로 발생하는 골반염을 조기에 진단하고 항생제 요법 및 입원 치료를 통해 합병증을 예방합니다." },
      { title: "방광염 및 재발성 요로감염 관리", detail: "단순 항생제 처방을 넘어 재발을 막는 생활 교정과 함께 맞춤형 예방 프로그램을 제공합니다." }
    ]
  },
  'mammotome': {
    title: "유방 맘모톰(VAB) 무절개 시술 센터",
    category: "GYNECOLOGY",
    image: "https://www.dropbox.com/scl/fi/77epivd0pdbzwo739zlsw/.png?rlkey=8ijm7ooca90fjfehnghjnqln5&st=fkeyb65j&raw=1",
    intro: "바늘 하나로 유방 내 종양을 완전히 제거하고 동시에 정밀 조직 검사를 시행합니다. 흉터 없이 당일 시술과 퇴원이 가능한 여성 친화적 치료입니다.",
    items: [
      { title: "유방 맘모톰(VAB) 무절개 시술", detail: "유방 종양(섬유선종, 낭종 등)을 절개 없이 진공흡인 방식으로 완전 제거하며 동시에 조직 검사가 이루어져 별도 입원 없이 당일 퇴원이 가능합니다." },
      { title: "유방 정밀 초음파 및 조기 검진", detail: "고해상도 초음파 장비를 이용하여 유방 내 미세한 이상 소견을 조기에 발견하고 적절한 치료 시기를 놓치지 않도록 합니다." }
    ]
  },
  'comprehensive': {
    title: "맞춤 종합 검진 프로그램",
    category: "INTERNAL MEDICINE",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1600",
    intro: "나이, 성별, 가족력, 생활 습관을 종합적으로 고려한 맞춤형 건강검진 패키지로 숨겨진 위험 인자를 미리 발견하고 건강 수명을 연장합니다.",
    items: [
      { title: "생애주기별 여성 맞춤 검진 패키지", detail: "20~30대 기본 건강 확인부터 40대 이후 암·심뇌혈관 위험 집중 스크리닝까지 연령과 상태에 맞는 최적의 검진 항목을 구성합니다." },
      { title: "가족력·생활습관 기반 맞춤 설계", detail: "상담을 통해 가족력, 흡연·음주·식습관 등 개인별 위험 요인을 파악하고 그에 맞는 검진 항목을 설계하여 정확도를 높입니다." }
    ]
  },
  'employment': {
    title: "채용 신체검사 센터",
    category: "INTERNAL MEDICINE",
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=1600",
    intro: "취업·전직·복직 시 필요한 채용 신체검사를 당일 신속하게 처리합니다. 결과서는 즉일 또는 익일 발급되어 빠른 업무 진행이 가능합니다.",
    items: [
      { title: "일반 채용 신체검사", detail: "시력, 청력, 혈압, 혈액 검사, 흉부 X-ray 등 기본 항목을 빠르고 정확하게 진행하며 공무원·대기업·중소기업 등 다양한 채용 양식을 지원합니다." },
      { title: "당일 신속 결과 발급", detail: "결과서 및 건강진단서를 당일 또는 익일 발급하여 채용 절차가 지연되지 않도록 빠른 행정 처리를 지원합니다." }
    ]
  },
  'us-exam': {
    title: "복부·부인과 초음파 정밀 검사",
    category: "INTERNAL MEDICINE",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1600",
    intro: "고해상도 초음파 장비를 이용하여 간·담낭·췌장·신장 등 복부 장기와 자궁·난소 등 부인과 장기를 방사선 피폭 없이 안전하고 정밀하게 검사합니다.",
    items: [
      { title: "복부 초음파 (간·담낭·췌장·신장·비장)", detail: "지방간, 담낭 용종, 신장 결석, 췌장 이상 등을 방사선 피폭 없이 실시간 영상으로 확인하고 이상 소견을 즉시 판독합니다." },
      { title: "부인과 초음파 (자궁·난소)", detail: "자궁근종, 난소 낭종 등 부인과 이상 소견을 정밀하게 확인하고 필요 시 즉시 전문 진료와 연계하는 원스톱 시스템을 운영합니다." }
    ]
  }
};

export const POSTPARTUM_PROGRAM = {
  intro: "1998년부터 수만 명의 산모님과 함께해온 메디피아만의 고품격 회복 시스템입니다. 산과와 소아과 전문의의 유기적인 협진으로 산모님의 회복과 신생아의 건강을 완벽하게 책임집니다.",
  scheduleEvents: [
    { name: "요가", image: "https://www.dropbox.com/scl/fi/4o2534ee2cslyq0d5hmvs/.jpeg?rlkey=2w2gtsykrez51mqd0d3qto30h&st=yhu4fjzq&raw=1", color: "#FDE2E2", textColor: "#E53E3E", desc: "산후 체형 교정 및 골반 회복을 위한 부드러운 스트레칭과 명상 (매주 화, 목)", cycle: "주 2회 (화/목)" },
    { name: "초점책자 만들기", image: "https://www.dropbox.com/scl/fi/xa531jbwd4q2zrdsn9w94/.jpeg?rlkey=cnhb2ajc93xl9jqijz9k0k2i1&st=3lmzwtap&raw=1", color: "#E6FFFA", textColor: "#319795", desc: "신생아의 시각 발달을 돕는 고대비 초점책 제작 실습 (격주 수요일)", cycle: "격주 수요일" },
    { name: "수면 교육", image: "https://www.dropbox.com/scl/fi/tkt0mc6io8dzej2ux64jv/.jpeg?rlkey=92mw9omnx1pchaqm2czvix28j&st=gelspbc8&raw=1", color: "#EBF8FF", textColor: "#3182CE", desc: "영아의 올바른 수면 습관 형성과 부모의 대응 전략 교육 (격주 금요일)", cycle: "격주 금요일" },
    { name: "아기 목욕 배우기", image: "https://www.dropbox.com/scl/fi/tkt0mc6io8dzej2ux64jv/.jpeg?rlkey=92mw9omnx1pchaqm2czvix28j&st=gelspbc8&raw=1", color: "#FEFCBF", textColor: "#B7791F", desc: "안전하고 편안한 신생아 목욕법 교육 및 실습 (격주 토요일)", cycle: "격주 토요일" }
  ],
  rooms: [
    { name: "로얄 스위트 (Royal Suite)", features: ["프라이빗 전용 가든 테라스 & 햇살 채광", "최고급 전동 모션베드 (산모 및 보호자용)", "프리미엄 바디프랜드 안마의자 설치", "개별 거실 및 독립 수유 공간 확보"], price: "전화 상담 문의" },
    { name: "프리미엄 룸 (Premium Room)", features: ["스마트 전동 모션베드 및 메디컬 매트리스", "신생아 전용 원목 침대 및 개별 수유 쿠션", "H13 등급 개별 공기청정 시스템 가동", "호텔식 어메니티 및 프라이빗 욕실"], price: "전화 상담 문의" }
  ]
};

export const FACILITY_GALLERY = [
  { 
    title: "고품격 VVIP 1인실", 
    desc: "환자의 회복에 최적화된 대학병원급 모션베드와 프라이빗한 숲 뷰를 갖춘 상위 1% 입원실입니다.", 
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200" 
  },
  { 
    title: "대학병원급 첨단 수술센터", 
    desc: "무균 양압 시스템과 정교한 미세 수술 장비로 여성 건강의 골든타임을 지킵니다.", 
    img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200" 
  },
  { 
    title: "프리미엄 컨시어지 라운지", 
    desc: "내원하시는 모든 순간이 안식이 되도록, 부티크 호텔 수준의 차별화된 서비스를 제공합니다.", 
    img: LOBBY_IMAGE_URL 
  }
];

export const POLICY_TEXTS = {
  privacy: { 
    title: "개인정보처리방침 (전문)", 
    content: `메디피아 여성병원(이하 '본원')은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다. ...`
  },
  terms: { 
    title: "서비스 이용약관 (전문)", 
    content: `제1조 (목적) ...`
  }
};

export const DOCTORS: Doctor[] = [
  {
    name: "한상철 대표원장",
    role: "전문의학박사 / 산부인과 전문의",
    image: DIRECTOR_GREETING_IMAGE,
    philosophy: "여성의 전 생애 주기에 걸쳐 가장 정교하고 품격 있는 의료 안식처를 제공하는 것이 저의 소명입니다.",
    expertise: ["한림대학교 의과대학 졸업", "한양대학교 의료원 외래교수 역임", "대한 산부인과학회 및 산부인과 초음파학회 정회원", "27년 이상의 고위험 분만 및 복강경 수술 경력"],
    schedule: { am: { mon: '진료', tue: '진료', wed: '진료', thu: '진료', fri: '진료', sat: '진료', sun: '응급' }, pm: { mon: '진료', tue: '진료', wed: '진료', thu: '진료', fri: '진료', sat: '진료', sun: '응급' } }
  },
  {
    name: "송경민 원장",
    role: "산부인과 전문의",
    image: "https://www.dropbox.com/scl/fi/dnowlvb4q0hebvik0ugo2/enhanced_Gemini_Generated_Image_ruwb2druwb2druwb.png?rlkey=9t0fbkqhycke3laz6287dz77e&st=uxv4b3ej&raw=1",
    philosophy: "여성 환자분들의 마음까지 헤아리는 섬세한 진료로 가장 편안한 치료 경험을 약속드립니다.",
    expertise: ["산부인과 전문의 취득", "대한 산부인과학회 정회원", "여성 성형 및 요실금 수술 5,000례 이상 집도", "미세 침습 단일공 복강경 수술 전문"],
    schedule: { am: { mon: '진료', tue: '휴진', wed: '진료', thu: '휴진', fri: '진료', sat: '진료', sun: '휴진' }, pm: { mon: '진료', tue: '휴진', wed: '진료', thu: '휴진', fri: '진료', sat: '진료', sun: '휴진' } }
  },
  {
    name: "박상미 원장",
    role: "내과 전문의",
    image: "https://www.dropbox.com/scl/fi/mqij8vj4q3lmo9klo8oas/enhanced_K-2571.png?rlkey=wfxpd54e14ukw63ma3ei7ibne&st=9kdm2hy9&raw=1",
    philosophy: "정확한 진단은 내 몸의 소리에 귀 기울이는 것에서 시작합니다. 가족 같은 정성으로 돌보겠습니다.",
    expertise: ["내과 전문의 취득", "대한 내과학회 정회원", "소화기 내시경 세부전문의", "국가 5대 암 검진 및 만성질환 관리 전문가"],
    schedule: { am: { mon: '진료', tue: '진료', wed: '진료', thu: '진료', fri: '진료', sat: '진료', sun: '휴진' }, pm: { mon: '진료', tue: '진료', wed: '휴진', thu: '진료', fri: '휴진', sat: '휴진', sun: '휴진' } }
  }
];

export const SPECIALIZED_CENTERS_DATA: Record<string, any> = {
  'emergency': {
    title: "365 야간·응급진료센터",
    subtitle: "24시간 잠들지 않는 생명의 안식처",
    intro: "산과 전문의가 365일 24시간 병원 내 상주하며, 응급 분만 및 위급 상황에 즉각적으로 대응합니다. 남양주 지역 산모님들의 안전한 출산을 위해 밤낮없이 깨어있습니다.",
    features: ["산과 전문의 24시간 원내 상주 시스템", "응급 제왕절개 및 집중 케어 즉시 가동 가능", "철저한 감염 관리 및 무균 수술실 운영"],
    departments: [
      { name: "응급 분만 대응", detail: "야간, 공휴일 등 예기치 못한 분만 상황에 전문의 즉시 집도" },
      { name: "긴급 산과 진료", detail: "임신 중 이상 출혈, 복통, 고혈압 등 응급 증상 관리" }
    ],
    hours: "365일 24시간 연중무휴"
  },
  'incontinence-plastic': {
    title: "요실금 · 성형센터",
    subtitle: "여성의 말 못할 고민, 정교한 술기로 해결합니다.",
    intro: "99%에 달하는 수술 성공률과 수천례의 임상 경험을 바탕으로 여성의 삶의 질을 획기적으로 개선합니다. 최소 침습 수술부터 비수술적 레이저 치료까지 최적의 솔루션을 제공합니다.",
    features: ["99% 이상의 높은 수술 성공률 보유", "15분 내외의 짧은 수술 시간 (당일 퇴원 가능)", "흉터 및 통증을 최소화하는 개량 TOT 술기"],
    departments: [
      { name: "요실금 클리닉", detail: "복압성 요실금 정밀 진단 및 TOT 수술, 체외자기장 치료" },
      { name: "여성 성형 센터", detail: "질성형, 소음순 성형 등 기능적/미적 회복" }
    ],
    hours: "평일 09:00 - 18:00 | 토요일 09:00 - 13:00"
  }
};

export const NOTICE_DATA = [
  { id: 1, title: '메디피아 365 야간·응급진료센터 안내', date: '2025.01.10', content: '24시간 산과 전문의 상주로 안전한 분만과 야간 응급 진료를 책임집니다.' },
  { id: 2, title: '1998년 개원 이래 27년의 신뢰', date: '2025.01.01', content: '남양주 여성 건강의 든든한 동반자가 되어왔습니다. 개원 당시의 초심을 잊지 않겠습니다.' },
  { id: 3, title: '국가 건강검진 5대암 지정 병원 안내', date: '2024.12.15', content: '위암, 대장암, 간암, 유방암, 자궁경부암 검진을 본원에서 한 번에 받으실 수 있습니다.' }
];
