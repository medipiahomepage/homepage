import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHero } from './PageHero';

import { 
  ChevronDown,
  Globe, 
  Smartphone, 
  ShieldCheck, 
  Moon, 
  Users, 
  HeartHandshake, 
  Baby, 
  ChevronRight,
  Stethoscope,
  Activity,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const TRANSLATIONS = {
  ko: {
    langName: "한국어",
    heroTag: "International Clinic Center",
    heroTitle: "국제진료센터",
    heroIntro: "언어 장벽 없는 편안한 진료, 다국어 통역 및 안내 시스템으로 외국인 가족들도 내 집처럼 안심하고 출산할 수 있는 특화 센터입니다.",
    tags: ["Multilingual Service", "Transparent Cost", "24/7 Emergency Delivery"],
    visionTitle: "우리의 자긍심 : ",
    visionHighlight: "마음과 진정성",
    visionDesc: "화려한 시설이나 브랜드 포장이 아닌, 외국인 산모들을 향한 열린 마음과 진정성 있는 태도가 우리의 가장 큰 자부심입니다. 환자가 이동하고 분만이 많아도 야간과 휴일 진료를 마다하지 않는 메디피아는 책임감으로 이 자리를 지켜왔습니다.",
    strategies: [
      { title: "다국어 통역 지원", desc: "다누리콜센터 13개국어 24시간 실시간 무료 통역 및 모바일 AI도우미의 즉각적인 의사소통 지원으로 언어 장벽을 허뭅니다." },
      { title: "QR코드 스마트폰 연동", desc: "원내 모든 안내문과 중요 공지에 다국어 번역 QR코드를 배치하여 스마트폰으로 언제든 쉽고 빠르고 내용을 확인할 수 있습니다." },
      { title: "투명한 안심 출산 가이드", desc: "건강보험 미가입 시 발생할 수 있는 예상 진료비, 자연분만, 제왕절개, 검사 비용 등을 투명하게 공개하여 비용에 대한 불안을 해소합니다." },
      { title: "24/7 야간·응급 진료", desc: "타 병원들이 야간과 휴일 진료를 회피할 때, 메디피아는 365일 24시간 진정성 있는 대응으로 산모들의 신뢰와 안전을 지킵니다." },
      { title: "자국민 커뮤니티 연계", desc: "베트남(Zalo), 중국(WeChat), 방글라데시, 네팔 등 각 국가별 전용 메신저와 모임을 활용한 활발한 소통 채널을 운영합니다." },
      { title: "지역 유관 기관 협력", desc: "다문화가족센터 및 외국인 복지센터와 긴밀하게 협력하여 체류 산모의 건강한 출산을 위한 의료 지원 네트워크를 구축하고 있습니다." }
    ],
    guideCoreInsight: "Core Insight",
    guideTitle1: "외국인 산모의 가장 큰 불안 해소:",
    guideTitle2: "투명한 안심 출산 가이드",
    guideDesc: "언어 장벽보다 더 큰 진입 장벽은 '비용에 대한 막연한 우려'입니다. 일괄적이고 명확한 비용 안내를 통해 신뢰의 시작을 만듭니다.",
    guidePoints: [
      "건강보험 미가입 시 예상 비용 완벽 안내",
      "자연분만 및 제왕절개 평균 출산 비용 공개",
      "주기별 필수 임신 검사 및 항목별 비용 안내"
    ],
    guideBoxTitle: "안심 출산 가이드북",
    guideBoxSubtitle: "Safe Delivery Cost Guide",
    detailView: "자세히 보기",
    cta: "상담 및 진료 예약안내",
    insuranceInfo: "Insurance Info",
    deliveryCost: "Delivery Cost",
    examsTests: "Exams & Tests",
    guideDetails: [
      {
        title: "건강보험 미가입 진료 안내",
        contents: [
          "건강보험 자격이 없으신 경우에도 차별 없는 진료를 제공합니다.",
          "초진 진료비: 약 3~5만원 (비급여 기준)",
          "기본 초음파 검사 비용: 약 5~8만원",
          "※ 정확한 비용은 진료 항목에 따라 달라질 수 있습니다."
        ]
      },
      {
        title: "출산(분만) 예상 비용",
        contents: [
          "자연분만: 2박 3일 입원 기준 (약 00만원~)",
          "제왕절개: 5박 6일 입원 기준 (약 00만원~)",
          "무통 주사(페인버스터) 및 선택 항목 비용 별도",
          "※ 병실 등급(다인실/1인실/VIP실) 등에 따라 금액 추가."
        ]
      },
      {
        title: "주기별 필수 검사 비용",
        contents: [
          "임신 초기(1~12주): 산전 검사 및 1차 기형아 검사",
          "임신 중기(13~28주): 2차 기형아, 정밀 초음파, 임당 검사",
          "임신 후기(29주~): 막달 검사 및 태동 검사(NST)",
          "※ 필수 검사만 권장하여 과잉 진료를 예방합니다."
        ]
      }
    ],
    maternityTitle: "메디맘스 출산준비교실",
    maternityDesc: "외국인 산모를 위한 다국어 자료 및 소그룹 클래스 운영 지원을 통해 건강한 출산과 육아를 준비합니다.",
    maternityClasses: [
      { title: "분만 과정의 이해", desc: "출산의 전 과정을 다국어로 쉽게 설명합니다." },
      { title: "호흡법 및 감통 마사지", desc: "진통을 줄이는 호흡과 마사지를 실습합니다." },
      { title: "신생아 돌보기", desc: "목욕, 기저귀 갈기 등 기본적인 신생아 케어 방법을 배웁니다." },
      { title: "모유 수유 교육", desc: "올바른 모유 수유 자세와 관리 방법을 안내합니다." }
    ]
  },
  en: {
    langName: "English",
    heroTag: "International Clinic Center",
    heroTitle: "International Clinic",
    heroIntro: "Comfortable medical care without language barriers. With our multilingual interpretation and guide system, foreign families can feel at home and deliver babies safely.",
    tags: ["Multilingual Service", "Transparent Cost", "24/7 Emergency Delivery"],
    visionTitle: "Our Pride: ",
    visionHighlight: "Sincerity and Heart",
    visionDesc: "Rather than fancy facilities or brand packaging, our open heart and sincere attitude towards foreign mothers are our greatest pride. Medipia, which does not refuse night and holiday treatments, has guarded this place with a sense of responsibility.",
    strategies: [
      { title: "Multilingual Interpretation", desc: "We break down language barriers with 24-hour free real-time interpretation in 13 languages through the Danuri Call Center and instant communication support using a mobile AI assistant." },
      { title: "QR Code Smartphone Link", desc: "Multilingual translation QR codes are placed on all guides and important notices, allowing you to easily and quickly check the contents with your smartphone anytime." },
      { title: "Transparent Cost Guide", desc: "We relieve anxiety about costs by transparently disclosing expected medical expenses, natural delivery, cesarean section, and examination costs that may occur if uninsured." },
      { title: "24/7 Emergency Care", desc: "When other hospitals avoid night and holiday care, Medipia protects the trust and safety of mothers with sincere responses 24 hours a day, 365 days a year." },
      { title: "National Community Linkage", desc: "We operate active communication channels utilizing dedicated messengers and gatherings for each country, such as Vietnam (Zalo), China (WeChat), Bangladesh, and Nepal." },
      { title: "Local Agency Cooperation", desc: "We proactively cooperate with multicultural family centers and foreigner welfare centers to build a medical support network for the healthy childbirth of foreign mothers." }
    ],
    guideCoreInsight: "Core Insight",
    guideTitle1: "Relieving the Greatest Anxiety:",
    guideTitle2: "Transparent Safe Delivery Guide",
    guideDesc: "A bigger barrier to entry than language is 'vague concerns about costs'. We create the beginning of trust through uniform and clear cost guidance.",
    guidePoints: [
      "Perfect guidance on expected costs without health insurance",
      "Disclosure of average delivery costs (natural/C-section)",
      "Guidance on required pregnancy tests by period and costs"
    ],
    guideBoxTitle: "Safe Delivery Guidebook",
    guideBoxSubtitle: "Safe Delivery Cost Guide",
    detailView: "View Details",
    cta: "Consultation & Appointments",
    insuranceInfo: "Insurance Info",
    deliveryCost: "Delivery Cost",
    examsTests: "Exams & Tests",
    guideDetails: [
      {
        title: "Guidance for Uninsured Patients",
        contents: [
          "We provide equal care even without Health Insurance.",
          "Initial consultation: Approx. 30k~50k KRW",
          "Basic ultrasound: Approx. 50k~80k KRW",
          "※ Exact costs may vary depending on medical needs."
        ]
      },
      {
        title: "Estimated Delivery Costs",
        contents: [
          "Natural Delivery: 2-night/3-day stay",
          "Cesarean Section: 5-night/6-day stay",
          "Options like epidural or pain busters are extra.",
          "※ Room charges vary by room type."
        ]
      },
      {
        title: "Essential Pregnancy Tests",
        contents: [
          "1st Trimester: Prenatal tests & 1st anomaly screening",
          "2nd Trimester: 2nd anomaly, anatomy scan, GDM test",
          "3rd Trimester: Late pregnancy tests & NST",
          "※ We only recommend essential tests for your care."
        ]
      }
    ],
    maternityTitle: "Medimoms Childbirth Preparation Class",
    maternityDesc: "We support healthy childbirth and parenting by providing multilingual materials and small group classes for foreign mothers.",
    maternityClasses: [
      { title: "Understanding the Delivery Process", desc: "Easy multilingual explanation of the entire childbirth process." },
      { title: "Breathing & Pain Relief Massage", desc: "Practice breathing techniques and massages to reduce labor pain." },
      { title: "Newborn Care", desc: "Learn basic newborn care such as bathing and diaper changing." },
      { title: "Breastfeeding Education", desc: "Guidance on proper breastfeeding postures and management." }
    ]
  },
  ja: {
    langName: "日本語",
    heroTag: "International Clinic Center",
    heroTitle: "国際診療センター",
    heroIntro: "言葉の壁のない快適な診療。多言語通訳・案内システムにより、外国人ご家族も我が家のように安心して出産できる特化センターです。",
    tags: ["多言語サービス", "透明な費用", "24時間救急診療"],
    visionTitle: "私たちの誇り：",
    visionHighlight: "真心と誠実さ",
    visionDesc: "華麗な施設やブランドの包装ではなく、外国人の妊婦さんに向けた開かれた心と誠実な態度が私たちの最大の誇りです。夜間や休日の診療を厭わないメディピアは、責任感を持ってこの場所を守ってきました。",
    strategies: [
      { title: "多言語通訳サポート", desc: "ダヌリコールセンターによる13ヶ国語24時間リアルタイム無料通訳と、モバイルAIアシスタントを活用した即時のコミュニケーション支援で言葉の壁をなくします。" },
      { title: "QRコード連動案内", desc: "院内のすべての案内文と重要なお知らせに多言語翻訳QRコードを配置し、スマートフォンでいつでも簡単かつすばやく内容を確認できます。" },
      { title: "透明な安心出産ガイド", desc: "健康保険に加入していない場合に発生する予想診療費、自然分娩、帝王切開、検査費用などを透明に公開し、費用に対する不安を解消します。" },
      { title: "24/7 夜間・救急診療", desc: "他病院が夜間や休日の診療を避ける時、メディピアは365日24時間誠実な対応で妊婦さんの信頼と安全を守ります。" },

      { title: "自国民コミュニティ連携", desc: "ベトナム(Zalo)、中国(WeChat)、バングラデシュ、ネパールなど、各国別の専用メッセンジャーや集まりを活用した活発なコミュニケーションチャネルを運営しています。" },
      { title: "地域関係機関との協力", desc: "多文化家族センターおよび外国人福祉センターと緊密に協力し、外国人妊婦の健康な出産のための医療支援ネットワークを構築しています。" }
    ],
    guideCoreInsight: "Core Insight",
    guideTitle1: "外国人妊婦の最大の不安を解消：",
    guideTitle2: "透明な安心出産ガイド",
    guideDesc: "言葉の壁よりも大きな参入障壁は「費用に対する漠然とした懸念」です。一律で明確な費用案内を通して信頼の始まりを作ります。",
    guidePoints: [
      "健康保険未加入時の予想費用を完全案内",
      "自然分娩および帝王切開の平均出産費用を公開",
      "周期別必須妊娠検査および項目別費用の案内"
    ],
    guideBoxTitle: "安心出産ガイドブック",
    guideBoxSubtitle: "Safe Delivery Cost Guide",
    detailView: "詳細を見る",
    cta: "相談および診療予約案内",
    insuranceInfo: "保険情報",
    deliveryCost: "出産費用",
    examsTests: "検査とテスト",
    guideDetails: [
      {
        title: "健康保険未加入時の診療案内",
        contents: [
          "健康保険資格がない場合でもご安心ください。",
          "初診料：約3〜5万ウォン（保険外基準）",
          "基本超音波検査：約5〜8万ウォン",
          "※ 正確な費用は診療項目によって異なります。"
        ]
      },
      {
        title: "出産（分娩）予想費用",
        contents: [
          "自然分娩：2泊3日の入院基準",
          "帝王切開：5泊6日の入院基準",
          "無痛注射などのオプション費用は別途",
          "※ 入院室グレードにより金額が異なります。"
        ]
      },
      {
        title: "必須妊娠検査の費用案内",
        contents: [
          "妊娠初期：産前検査および1次奇形児検査",
          "妊娠中期：2次奇形児検査、精密超音波、妊娠糖尿病検査",
          "妊娠後期：出産前検査および胎動検査（NST）",
          "※ 必須の検査のみを推奨しております。"
        ]
      }
    ],
    maternityTitle: "メディマムズ 出産準備教室",
    maternityDesc: "外国人妊婦のための多言語資料および小グループクラスを提供し、健康な出産と育児の準備をサポートします。",
    maternityClasses: [
      { title: "分娩過程の理解", desc: "出産の全過程を多言語でわかりやすく説明します。" },
      { title: "呼吸法と和痛マッサージ", desc: "陣痛を和らげる呼吸とマッサージを実習します。" },
      { title: "新生児のお世話", desc: "沐浴やオムツ替えなど、基本的な新生児ケアを学びます。" },
      { title: "母乳育児教育", desc: "正しい授乳姿勢とケア方法をご案内します。" }
    ]
  },
  vi: {
    langName: "Tiếng Việt",
    heroTag: "International Clinic Center",
    heroTitle: "Trung tâm Khám Quốc tế",
    heroIntro: "Chăm sóc y tế thoải mái không rào cản ngôn ngữ. Với hệ thống thông dịch và hướng dẫn đa ngôn ngữ, các gia đình người nước ngoài có thể yên tâm sinh con như ở nhà.",
    tags: ["Dịch vụ Đa ngôn ngữ", "Chi phí Minh bạch", "Cấp cứu 24/7"],
    visionTitle: "Niềm tự hào của chúng tôi: ",
    visionHighlight: "Sự Chân thành",
    visionDesc: "Thay vì cơ sở vật chất hào nhoáng hay thương hiệu, trái tim rộng mở và thái độ chân thành đối với sản phụ người nước ngoài mới là niềm tự hào lớn nhất của chúng tôi. Medipia, nơi không từ chối khám ban đêm và ngày lễ, luôn bảo vệ nơi này bằng tinh thần trách nhiệm.",
    strategies: [
      { title: "Thông dịch Đa ngôn ngữ", desc: "Xóa bỏ rào cản ngôn ngữ với dịch vụ thông dịch 24 giờ miễn phí theo thời gian thực ở 13 ngôn ngữ qua Trung tâm Danuri và trợ lý AI di động." },
      { title: "Mã QR cho Smartphone", desc: "Mã QR dịch đa ngôn ngữ được đặt trên tất cả các hướng dẫn và thông báo tại bệnh viện, giúp bạn dễ dàng kiểm tra nội dung bằng điện thoại." },
      { title: "Hướng dẫn Sinh con Minh bạch", desc: "Xóa tan nỗi lo về chi phí bằng cách công khai minh bạch các chi phí y tế dự kiến, sinh thường, sinh mổ và chi phí khám nghiệm nếu không có BHYT." },
      { title: "Khám Cấp cứu 24/7", desc: "Khi các bệnh viện khác tránh khám ban đêm và ngày lễ, Medipia bảo vệ niềm tin và sự an toàn của sản phụ với sự hỗ trợ 24/7 trong 365 ngày." },

      { title: "Liên kết Cộng đồng", desc: "Chúng tôi điều hành các kênh giao tiếp tích cực sử dụng các nhóm và ứng dụng nhắn tin riêng biệt như Việt Nam (Zalo), Trung Quốc (WeChat)." },
      { title: "Hợp tác Cơ quan Địa phương", desc: "Chúng tôi hợp tác chặt chẽ với các trung tâm gia đình đa văn hóa và trung tâm phúc lợi người nước ngoài để xây dựng mạng lưới hỗ trợ y tế." },
      { title: "Lớp học Thai sản Đặc biệt", desc: "Hơn cả giáo dục, chúng tôi cung cấp không gian cộng đồng để các sản phụ giao lưu, chia sẻ văn hóa và tham quan cơ sở bệnh viện một cửa." }
    ],
    guideCoreInsight: "Core Insight",
    guideTitle1: "Giải tỏa nỗi lo lớn nhất:",
    guideTitle2: "Chi phí Sinh con Minh bạch",
    guideDesc: "Rào cản lớn hơn cả ngôn ngữ là 'nỗi lo mơ hồ về chi phí'. Chúng tôi xây dựng sự khởi đầu của niềm tin thông qua việc hướng dẫn chi phí đồng nhất và rõ ràng.",
    guidePoints: [
      "Hướng dẫn hoàn chỉnh chi phí dự kiến khi không có BHYT",
      "Công khai chi phí sinh trung bình (sinh thường/sinh mổ)",
      "Hướng dẫn các xét nghiệm thai kỳ bắt buộc và chi phí tương ứng"
    ],
    guideBoxTitle: "Sách Cẩm nang Sinh con",
    guideBoxSubtitle: "Safe Delivery Cost Guide",
    detailView: "Xem chi tiết",
    cta: "Tư vấn & Đặt lịch khám",
    insuranceInfo: "Thông tin Bảo hiểm",
    deliveryCost: "Chi phí Sinh con",
    examsTests: "Xét nghiệm & Kiểm tra",
    guideDetails: [
      {
        title: "Không có Bảo hiểm y tế",
        contents: [
          "Chúng tôi cung cấp dịch vụ chăm sóc bình đẳng.",
          "Khám ban đầu: Khoảng 30k~50k KRW",
          "Siêu âm cơ bản: Khoảng 50k~80k KRW",
          "※ Chi phí chính xác có thể thay đổi tùy tình trạng."
        ]
      },
      {
        title: "Chi phí sinh con dự kiến",
        contents: [
          "Sinh thường: Lưu trú 3 ngày 2 đêm",
          "Sinh mổ: Lưu trú 6 ngày 5 đêm",
          "Các tùy chọn giảm đau tính phí riêng.",
          "※ Giá thay đổi tùy theo phòng điều trị."
        ]
      },
      {
        title: "Xét nghiệm thai kỳ bắt buộc",
        contents: [
          "3 tháng đầu: Tiền sản & dị tật lần 1",
          "3 tháng giữa: Dị tật lần 2, siêu âm, tiểu đường",
          "3 tháng cuối: Kỳ cuối & đo NST",
          "※ Chúng tôi chỉ khuyên dùng các xét nghiệm cần thiết."
        ]
      }
    ],
    maternityTitle: "Lớp học chuẩn bị sinh Medimoms",
    maternityDesc: "Chúng tôi hỗ trợ sinh con và nuôi dạy con cái khỏe mạnh bằng cách cung cấp tài liệu đa ngôn ngữ và các lớp học nhóm nhỏ cho sản phụ người nước ngoài.",
    maternityClasses: [
      { title: "Hiểu về quá trình sinh", desc: "Giải thích dễ hiểu bằng nhiều ngôn ngữ về toàn bộ quá trình sinh con." },
      { title: "Cách thở và massage giảm đau", desc: "Thực hành các kỹ thuật thở và massage để giảm đau đẻ." },
      { title: "Chăm sóc trẻ sơ sinh", desc: "Học cách chăm sóc trẻ sơ sinh cơ bản như tắm và thay tã." },
      { title: "Giáo dục nuôi con bằng sữa mẹ", desc: "Hướng dẫn tư thế cho con bú đúng cách và cách chăm sóc." }
    ]
  },
  th: {
    langName: "ภาษาไทย",
    heroTag: "International Clinic Center",
    heroTitle: "ศูนย์คลินิกนานาชาติ",
    heroIntro: "ดูแลรักษาพยาบาลสบายใจไร้กำแพงภาษา ช่วยให้ครอบครัวชาวต่างชาติคลอดบุตรได้อย่างอุ่นใจเหมือนอยู่บ้านด้วยระบบล่ามและระบบแนะนำหลายภาษา",
    tags: ["บริการหลายภาษา", "ค่าใช้จ่ายโปร่งใส", "บริการฉุกเฉิน 24 ชั่วโมง"],
    visionTitle: "ความภาคภูมิใจของเรา: ",
    visionHighlight: "ความจริงใจและใจเปิดกว้าง",
    visionDesc: "ไม่ใช่แค่สิ่งอำนวยความสะดวกที่หรูหราหรือแบรนด์ แต่ความเปิดกว้างและความจริงใจต่อคุณแม่ต่างชาติคือความภาคภูมิใจที่ยิ่งใหญ่ที่สุดของเรา Medipia ซึ่งไม่ปฏิเสธการรักษาในเวลากลางคืนและวันหยุด ยืนหยัดดูแลด้วยความรับผิดชอบเสมอมา",
    strategies: [
      { title: "บริการล่ามหลายภาษา", desc: "ทลายกำแพงภาษาด้วยบริการล่ามฟรีแบบเรียลไทม์ 24 ชม. 13 ภาษาผ่าน Danuri Call Center และผู้ช่วย AI บนมือถือ" },
      { title: "คิวอาร์โค้ดบนสมาร์ทโฟน", desc: "คิวอาร์โค้ดแปลหลายภาษาไว้ในป้ายประกาศทั้งหมดในโรงพยาบาล เพื่อให้คุณตรวจสอบเนื้อหาได้ง่ายและรวดเร็วตลอดเวลา" },
      { title: "คู่มือค่าใช้จ่ายโปร่งใส", desc: "บรรเทาความกังวลเรื่องค่าใช้จ่าย เปิดเผยค่าคลอดธรรมชาติ ผ่าคลอด และค่าตรวจต่างๆ อย่างโปร่งใส กรณีที่ไม่มีประกันสุขภาพ" },
      { title: "บริการฉุกเฉิน 24/7", desc: "เมื่อโรงพยาบาลอื่นหลีกเลี่ยงการรักษาในเวลากลางคืน Medipia ปกป้องความปลอดภัยของคุณแม่ด้วยความจริงใจตลอด 24 ชั่วโมง 365 วัน" },

      { title: "เชื่อมโยงชุมชนต่างชาติ", desc: "ช่องทางการสื่อสารที่ใช้โปรแกรมแชทเฉพาะสำหรับแต่ละประเทศ เช่น เวียดนาม (Zalo) จีน (WeChat) บังกลาเทศ เนปาล ฯลฯ" },
      { title: "ความร่วมมือหน่วยงานท้องถิ่น", desc: "เราร่วมมือกับศูนย์ครอบครัวพหุวัฒนธรรมและศูนย์ชาวต่างชาติ เพื่อสร้างเครือข่ายสนับสนุนทางการแพทย์สำหรับการคลอดบุตรอย่างมีสุขภาพดี" },
      { title: "คลาสคุณแม่ตั้งครรภ์ฉบับสากล", desc: "ไม่ใช่แค่คลาสเรียน แต่ยังใช้แลกเปลี่ยนวัฒนธรรมระหว่างคุณแม่ชาวต่างประเทศ และทัวร์ชมสิ่งอำนวยความสะดวกแบบครบวงจร" }
    ],
    guideCoreInsight: "Core Insight",
    guideTitle1: "คลายความกังวลใจ:",
    guideTitle2: "คู่มือโปร่งใสเรื่องค่าคลอดบุตร",
    guideDesc: "อุปสรรคที่ยิ่งใหญ่กว่าภาษาคือ 'ความกังวลเรื่องค่าใช้จ่าย' เราสร้างความไว้วางใจผ่านคำแนะนำส่วนนี้ที่ชัดเจนและเป็นมาตรฐาน",
    guidePoints: [
      "คำแนะนำเกี่ยวกับค่าใช้จ่ายโดยประมาณเมื่อไม่มีประกันสังคม",
      "การเปิดเผยค่าคลอดบุตรโดยเฉลี่ย (คลอดธรรมชาติและผ่าคลอด)",
      "คำแนะนำการตรวจครรภ์และค่าใช้จ่ายในแต่ละช่วงสัปดาห์"
    ],
    guideBoxTitle: "คู่มือการคลอดบุตร",
    guideBoxSubtitle: "Safe Delivery Cost Guide",
    detailView: "ดูรายละเอียด",
    cta: "ให้คำปรึกษาและนัดหมาย",
    insuranceInfo: "ข้อมูลประกัน",
    deliveryCost: "ค่าคลอดบุตร",
    examsTests: "การตรวจเพิ่มเติม",
    guideDetails: [
      {
        title: "ไม่มีประกันสุขภาพ",
        contents: [
          "เราให้บริการดูแลเท่าเทียมกัน",
          "การปรึกษาเบื้องต้น: ประมาณ 30,000~50,000 วอน",
          "อัลตราซาวนด์พื้นฐาน: ประมาณ 50,000~80,000 วอน",
          "※ ค่าใช้จ่ายจริงอาจแตกต่างกันไปตามความจำเป็น"
        ]
      },
      {
        title: "ค่าคลอดโดยประมาณ",
        contents: [
          "คลอดธรรมชาติ: เข้าพัก 2 คืน 3 วัน",
          "ผ่าคลอด: เข้าพัก 5 คืน 6 วัน",
          "ตัวเลือกเช่นยาแก้ปวด มีค่าใช้จ่ายเพิ่มเติม",
          "※ ค่าห้องอาจแตกต่างกันไปตามประเภทของห้องพัก"
        ]
      },
      {
        title: "การตรวจครรภ์ที่จำเป็น",
        contents: [
          "ไตรมาส 1: ตรวจก่อนคลอด & ตรวจความผิดปกติครั้งแรก",
          "ไตรมาส 2: อัลตราซาวนด์ & เบาหวาน",
          "ไตรมาส 3: ตรวจปลายครรภ์ & NST",
          "※ เราแนะนำเฉพาะการตรวจที่จำเป็นเท่านั้น"
        ]
      }
    ],
    maternityTitle: "คลาสเตรียมความพร้อมก่อนคลอด Medimoms",
    maternityDesc: "เราสนับสนุนการคลอดบุตรและการเลี้ยงดูบุตรอย่างมีสุขภาพดี โดยจัดเตรียมเอกสารหลายภาษาและคลาสกลุ่มย่อยสำหรับคุณแม่ชาวต่างชาติ",
    maternityClasses: [
      { title: "ทำความเข้าใจกระบวนการคลอด", desc: "อธิบายกระบวนการคลอดทั้งหมดอย่างเข้าใจง่ายด้วยหลายภาษา" },
      { title: "การหายใจและการนวดบรรเทาปวด", desc: "ฝึกเทคนิคการหายใจและการนวดเพื่อลดอาการปวดท้องคลอด" },
      { title: "การดูแลเด็กแรกเกิด", desc: "เรียนรู้วิธีดูแลเด็กแรกเกิดเบื้องต้น เช่น การอาบน้ำและการเปลี่ยนผ้าอ้อม" },
      { title: "การให้ความรู้เรื่องการให้นมบุตร", desc: "คำแนะนำเกี่ยวกับท่าทางการให้นมที่ถูกต้องและการดูแลรักษา" }
    ]
  }
};

export type SupportedLanguage = keyof typeof TRANSLATIONS;

export const InternationalClinic: React.FC = () => {
  const navigate = useNavigate();
  
  const [lang, setLangState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('medipia_lang') as SupportedLanguage) || 'ko';
  });

  const setLang = (newLang: SupportedLanguage) => {
    localStorage.setItem('medipia_lang', newLang);
    setLangState(newLang);
    window.dispatchEvent(new Event('medipia_lang_changed'));
  };

  useEffect(() => {
    const handleLangChange = () => {
      const stored = (localStorage.getItem('medipia_lang') as SupportedLanguage) || 'ko';
      setLangState(stored);
    };
    window.addEventListener('medipia_lang_changed', handleLangChange);
    return () => window.removeEventListener('medipia_lang_changed', handleLangChange);
  }, []);

  const [openGuide, setOpenGuide] = useState<number | null>(null);

  const t = TRANSLATIONS[lang];

  const icons = [
    <Globe className="text-blue-500" size={32} />,
    <Smartphone className="text-indigo-500" size={32} />,
    <ShieldCheck className="text-emerald-500" size={32} />,
    <Moon className="text-indigo-600" size={32} />,
    <Users className="text-amber-500" size={32} />,
    <HeartHandshake className="text-teal-500" size={32} />,
  ];

  return (
    <div className="pt-10 md:pt-20 pb-20 max-w-[1200px] mx-auto px-6 animate-fade-in-up">
      
      {/* 최고 상단: 언어 선택 메뉴 */}
      <div className="flex justify-end mb-6">
        <div className="bg-brand-light p-1.5 rounded-full inline-flex flex-nowrap gap-1 border border-brand-primary/5 shadow-sm overflow-x-auto no-scrollbar max-w-full">
          {Object.entries(TRANSLATIONS).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setLang(key as SupportedLanguage)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap touch-scale ${
                lang === key 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'text-brand-primary/60 hover:bg-white'
              }`}
            >
              {data.langName}
            </button>
          ))}
        </div>
      </div>

      {/* 5개국어 환영 안내 배너 */}
      <div className="bg-brand-primary rounded-[16px] md:rounded-[24px] px-5 md:px-8 py-4 mb-6 text-center shadow-lg border border-brand-primary/10">
        <span className="text-white/50 text-[10px] font-black uppercase tracking-widest block mb-2">Welcome to Medipia International Clinic</span>
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-2 md:gap-4">
          {[
            { lang: '한국어', text: '메디피아 국제진료센터에 오신 것을 환영합니다.', flag: '🇰🇷' },
            { lang: 'English', text: 'Welcome to Medipia International Clinic.', flag: '🇺🇸' },
            { lang: '日本語', text: 'メディピア国際診療センターへようこそ。', flag: '🇯🇵' },
            { lang: 'Tiếng Việt', text: 'Chào mừng đến với Phòng khám Quốc tế Medipia.', flag: '🇻🇳' },
            { lang: 'ภาษาไทย', text: 'ยินดีต้อนรับสู่คลินิกนานาชาติเมดิเปีย', flag: '🇹🇭' },
          ].map(({ lang, text, flag }) => (
            <div key={lang} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 w-full md:w-auto justify-center">
              <span className="text-[14px]">{flag}</span>
              <span className="text-white text-[12px] font-bold">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 히어로 섹션 */}
      <div className="relative w-full h-[35vh] md:h-[50vh] min-h-[280px] max-h-[500px] rounded-[20px] md:rounded-[48px] lg:rounded-[60px] overflow-hidden shadow-2xl mb-10 md:mb-20">
        <img src="/images/international_clinic_main.png" alt="International Clinic" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-primary/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 md:p-8 z-10 animate-fade-in-up">
            <span className="inline-block px-4 md:px-5 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] md:text-[12px] font-black text-white uppercase tracking-[0.3em] mb-4 md:mb-6 shadow-sm border border-white/10">
              {t.heroTag}
            </span>
            <h1 className="serif-title text-2xl md:text-5xl lg:text-6xl text-white font-bold mb-3 md:mb-6 italic leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-white/90 text-[13px] md:text-lg font-bold max-w-2xl mx-auto leading-relaxed">
              {t.heroIntro}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:gap-4">
              <span className="px-4 md:px-6 py-2 md:py-3 bg-white/5 rounded-2xl flex items-center gap-2 md:gap-3 backdrop-blur-sm border border-white/10 text-white shadow-sm">
                <Globe size={18} className="text-blue-300" />
                <span className="font-bold text-[12px] md:text-sm">{t.tags[0]}</span>
              </span>
              <span className="px-4 md:px-6 py-2 md:py-3 bg-white/5 rounded-2xl flex items-center gap-2 md:gap-3 backdrop-blur-sm border border-white/10 text-white shadow-sm">
                <ShieldCheck size={18} className="text-emerald-300" />
                <span className="font-bold text-[12px] md:text-sm">{t.tags[1]}</span>
              </span>
              <span className="px-4 md:px-6 py-2 md:py-3 bg-white/5 rounded-2xl flex items-center gap-2 md:gap-3 backdrop-blur-sm border border-white/10 text-white shadow-sm">
                <Moon size={18} className="text-indigo-300" />
                <span className="font-bold text-[12px] md:text-sm">{t.tags[2]}</span>
              </span>
            </div>
        </div>

        {/* 배너 우측 하단: 국기 언어 선택기 (Glassmorphism 플로팅 캡슐) */}
        <div className="absolute right-4 bottom-4 md:right-8 md:bottom-8 z-30 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 shadow-lg flex items-center gap-2 md:gap-3 animate-fade-in-up no-scrollbar">
          {[
            { key: 'ko', flag: '🇰🇷', name: '한국어' },
            { key: 'en', flag: '🇺🇸', name: 'English' },
            { key: 'ja', flag: '🇯🇵', name: '日本語' },
            { key: 'vi', flag: '🇻🇳', name: 'Tiếng Việt' },
            { key: 'th', flag: '🇹🇭', name: 'ภาษาไทย' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setLang(item.key as SupportedLanguage)}
              title={item.name}
              className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-lg md:text-xl transition-all duration-300 relative ${
                lang === item.key
                  ? 'bg-white shadow-md scale-110 ring-2 ring-brand-primary/20'
                  : 'bg-white/15 hover:bg-white/35 text-white active:scale-90 hover:scale-105'
              }`}
            >
              <span className="leading-none">{item.flag}</span>
              {lang === item.key && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-20">
        {/* 6대 전략 그리드 위 항목 */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-black text-brand-primary uppercase tracking-tight">
            {t.visionTitle} <span className="text-brand-secondary">{t.visionHighlight}</span>
          </h2>
          <p className="text-brand-primary/60 text-lg md:text-xl leading-relaxed font-bold">
            {t.visionDesc}
          </p>
        </div>

        {/* 8대 전략 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.strategies.map((strategy, idx) => (
            <div key={idx} className="bg-white p-4 md:p-8 rounded-[16px] md:rounded-[30px] border border-brand-primary/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden hover-lift touch-scale">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-light to-transparent opacity-50 rounded-bl-full transition-all group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-brand-light inline-block rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  {icons[idx]}
                </div>
                <h3 className="text-base md:text-lg font-black text-brand-primary mb-2 md:mb-3">
                  {strategy.title}
                </h3>
                <p className="text-brand-primary/60 text-xs md:text-sm font-bold leading-relaxed">
                  {strategy.desc}
                </p>
              </div>
            </div>
          ))}
        </div>


        {/* 산모교실(Medimoms) 영역 추가 */}
        {t.maternityClasses && (
          <div className="bg-white rounded-[20px] md:rounded-[40px] p-5 md:p-10 lg:p-16 border border-brand-primary/5 shadow-xl">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-pale text-brand-secondary rounded-full text-xs font-black uppercase tracking-widest mb-4">
                <Baby size={16} /> Medimoms Culture Center
              </div>
              <h3 className="serif-title text-2xl md:text-3xl lg:text-4xl font-bold text-brand-primary italic">
                {t.maternityTitle}
              </h3>
              <p className="text-brand-primary/60 font-bold mt-4 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                {t.maternityDesc}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {t.maternityClasses.map((cls: any, i: number) => (
                <div key={i} className="flex gap-4 p-4 md:p-6 rounded-2xl bg-brand-light border border-brand-primary/5 hover:bg-brand-pale hover:border-brand-secondary/30 transition-all group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-brand-secondary group-hover:text-brand-primary shrink-0">
                    <span className="font-black text-[15px]">{i+1}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-brand-primary text-[15px] md:text-[16px] mb-1">{cls.title}</h4>
                    <p className="font-medium text-brand-primary/60 text-[13px] md:text-[14px] leading-relaxed">{cls.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 하단 CTA */}
        <div className="flex justify-center pt-8">
          <button 
            onClick={() => navigate('/reservation')} 
            className="px-6 md:px-10 py-4 md:py-5 bg-brand-primary text-white font-black tracking-wider text-sm md:text-base uppercase hover:bg-brand-secondary transition-all rounded-full shadow-2xl flex items-center justify-center gap-3 hover:-translate-y-1 touch-scale"
          >
            {t.cta} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
