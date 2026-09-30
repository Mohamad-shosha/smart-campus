import '../css/style.css';
import confetti from 'canvas-confetti';
import { createIcon } from './icons.js';

// ============================================================================
// Audio Synthesizer (Professional Subtle Feedback)
// ============================================================================
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(523.25, now);
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.16);
    osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.28);

    osc2.frequency.setValueAtTime(261.63, now);
    osc2.frequency.exponentialRampToValueAtTime(523.25, now + 0.28);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  }

  playScan() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(1100, now + 0.22);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playGateOpen() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(554.37, now + 0.12);
    osc.frequency.setValueAtTime(659.25, now + 0.24);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

const soundFX = new AudioSynthesizer();

// ============================================================================
// University Data & Personas
// ============================================================================
const USERS = {
  eyad: {
    id: '20210045',
    name: 'إياد الحربي',
    nameEn: 'Eyad Al-Harbi',
    role: 'طالب - كلية الهندسة',
    roleEn: 'Student - College of Engineering',
    car: 'تويوتا كامري 2023',
    carEn: 'Toyota Camry 2023',
    plateLetters: 'ب ط ك',
    plateNumbers: '1234',
    walletBalance: 72.50,
    primarySpot: 1,
    schedule: 'أحد / ثلاثاء (08:00 - 10:00 & 01:30 - 03:30)'
  },
  rakan: {
    id: '20220088',
    name: 'راكان البلوي',
    nameEn: 'Rakan Al-Balawi',
    role: 'طالب - كلية الحاسب الآلي',
    roleEn: 'Student - College of Computing',
    car: 'هيونداي سوناتا 2024',
    carEn: 'Hyundai Sonata 2024',
    plateLetters: 'د ل س',
    plateNumbers: '8892',
    walletBalance: 120.00,
    primarySpot: 2,
    schedule: 'أحد / ثلاثاء (10:15 - 01:00)'
  },
  doctor: {
    id: 'FAC-9912',
    name: 'د. عبد الله الغامدي',
    nameEn: 'Dr. Abdullah Al-Ghamdi',
    role: 'أستاذ مشارك - عمادة كلية الحاسب',
    roleEn: 'Associate Prof. - Computing Dean',
    car: 'جينيسيس G80',
    carEn: 'Genesis G80',
    plateLetters: 'أ ح م',
    plateNumbers: '5501',
    walletBalance: 350.00,
    primarySpot: 19,
    schedule: 'يومي (08:00 - 04:00)'
  }
};

// 30 Detailed Parking Spots
const INITIAL_PARKING_SPOTS = [
  // Zone A: College of Computing & Engineering (1 - 10)
  { id: 1, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'occupied', occupant: 'إياد الحربي', car: 'تويوتا كامري', plate: 'ب ط ك 1234', timeLeft: 'بريك بعد 15 د', distance: '30 م (ملاصق للمبنى)', isFlexEligible: true },
  { id: 2, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '35 م', isFlexEligible: false },
  { id: 3, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '40 م', isFlexEligible: false },
  { id: 4, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'occupied', occupant: 'سعود الشهري', car: 'شيفروليه كابرس', plate: 'ع س ر 4040', timeLeft: '1 س 45 د', distance: '45 م', isFlexEligible: false },
  { id: 5, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '50 م', isFlexEligible: false },
  { id: 6, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'occupied', occupant: 'فيصل العطوي', car: 'لكزس ES', plate: 'ط ب ك 2030', timeLeft: '2 س 10 د', distance: '55 م', isFlexEligible: false },
  { id: 7, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '60 م', isFlexEligible: false },
  { id: 8, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'flex-share', occupant: 'محمد الحويطي (في بريك)', car: 'نيسان التيما', plate: 'ر ح ل 7711', timeLeft: 'متاح للتبادل: 2 س 15 د', distance: '65 م', isFlexEligible: true },
  { id: 9, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '70 م', isFlexEligible: false },
  { id: 10, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'occupied', occupant: 'عمر البلوي', car: 'فورد تورس', plate: 'د ر ع 9090', timeLeft: '45 د', distance: '75 م', isFlexEligible: false },

  // Zone B: College of Business & Management & Medicine (11 - 18)
  { id: 11, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '40 م', isFlexEligible: false },
  { id: 12, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'occupied', occupant: 'خالد العنزي', car: 'هوندا أكورد', plate: 'ن ج م 3321', timeLeft: '3 س', distance: '45 م', isFlexEligible: false },
  { id: 13, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '50 م', isFlexEligible: false },
  { id: 14, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'flex-share', occupant: 'سلطان القحطاني (بريك)', car: 'تويوتا أفالون', plate: 'ق ح ط 5050', timeLeft: 'متاح للتبادل: 1 س 50 د', distance: '55 م', isFlexEligible: true },
  { id: 15, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '60 م', isFlexEligible: false },
  { id: 16, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'occupied', occupant: 'ماجد الرشيدي', car: 'كيا K5', plate: 'س هـ م 1400', timeLeft: '1 س 15 د', distance: '65 م', isFlexEligible: false },
  { id: 17, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '70 م', isFlexEligible: false },
  { id: 18, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '75 م', isFlexEligible: false },

  // Zone C: Faculty Members & Doctors (19 - 24)
  { id: 19, zone: 'C', college: 'كادر التدريس (دكاترة)', collegeEn: 'Faculty Members', status: 'faculty-spot', occupant: 'د. عبد الله الغامدي', car: 'جينيسيس G80', plate: 'أ ح م 5501', timeLeft: 'محجوز يوم كامل', distance: '15 م (بوابة الإدارة)', isFaculty: true },
  { id: 20, zone: 'C', college: 'كادر التدريس (دكاترة)', collegeEn: 'Faculty Members', status: 'faculty-spot', occupant: 'د. سمير كمال', car: 'مرسيدس E300', plate: 'س م ر 2020', timeLeft: 'محاضرة حتى 02:00 م', distance: '20 م', isFaculty: true },
  { id: 21, zone: 'C', college: 'كادر التدريس (دكاترة)', collegeEn: 'Faculty Members', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '25 م', isFaculty: true },
  { id: 22, zone: 'C', college: 'كادر التدريس (دكاترة)', collegeEn: 'Faculty Members', status: 'faculty-spot', occupant: 'د. ريم العمراني', car: 'بي إم دبليو X5', plate: 'ر ي م 7070', timeLeft: 'معمل حتى 01:00 م', distance: '20 م', isFaculty: true },
  { id: 23, zone: 'C', college: 'كادر التدريس (دكاترة)', collegeEn: 'Faculty Members', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '25 م', isFaculty: true },
  { id: 24, zone: 'C', college: 'كادر التدريس (دكاترة)', collegeEn: 'Faculty Members', status: 'faculty-spot', occupant: 'د. طارق السعيد', car: 'أودي A6', plate: 'ط ر ق 1111', timeLeft: 'اجتماع مجلس الكلية', distance: '25 م', isFaculty: true },

  // Zone D: EV Charging & Accessible (25 - 30)
  { id: 25, zone: 'D', college: 'شحن سيارات كهربائية EV', collegeEn: 'EV Fast Charging (50kW)', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '50 م', isEV: true },
  { id: 26, zone: 'D', college: 'شحن سيارات كهربائية EV', collegeEn: 'EV Fast Charging (50kW)', status: 'occupied', occupant: 'لوسيد آير (طالب ماجستير)', car: 'Lucid Air Pure', plate: 'ل و س 2024', timeLeft: 'شحن 84% - متبقي 20 د', distance: '55 م', isEV: true },
  { id: 27, zone: 'D', college: 'شحن سيارات كهربائية EV', collegeEn: 'EV Fast Charging (50kW)', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '60 م', isEV: true },
  { id: 28, zone: 'D', college: 'مواقف ذوي الاحتياجات', collegeEn: 'Accessible Parking', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '10 م (منحدر مباشر)', isAccessible: true },
  { id: 29, zone: 'D', college: 'مواقف ذوي الاحتياجات', collegeEn: 'Accessible Parking', status: 'occupied', occupant: 'طالب ذوي همم', car: 'تويوتا برادو', plate: 'أ م ل 1010', timeLeft: 'محاضرة حتى 12:00 ظ', distance: '10 م', isAccessible: true },
  { id: 30, zone: 'D', college: 'شحن سيارات كهربائية EV', collegeEn: 'EV Fast Charging (50kW)', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '65 م', isEV: true }
];

// App Global State
const appState = {
  currentUser: USERS.eyad,
  isLoggedIn: true,
  currentLang: 'ar',
  activeTab: 'map',
  activeZoneFilter: 'all',
  parkingSpots: JSON.parse(JSON.stringify(INITIAL_PARKING_SPOTS)),

  // Simulator State
  simStep: 0,
  simAutoPlaying: false,
  simTimer: null,

  // Gate Scanner State
  gateStatus: 'idle',
  gateArmOpen: false,
  gateScannedPlate: 'ب ط ك 1234',

  selectedSpot: null
};

// ============================================================================
// Vector Generators
// ============================================================================
function getCarSVG(color = '#116E63') {
  return `
    <svg class="car-svg-icon" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="85" rx="42" ry="70" fill="rgba(0,0,0,0.4)" filter="blur(6px)"/>
      <rect x="18" y="10" width="64" height="135" rx="24" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <path d="M 26 52 Q 50 42 74 52 L 70 76 Q 50 72 30 76 Z" fill="#0c1f1c" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
      <path d="M 28 114 Q 50 118 72 114 L 68 98 Q 50 101 32 98 Z" fill="#0c1f1c" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
      <rect x="12" y="55" width="7" height="15" rx="3" fill="${color}" stroke="#ffffff" stroke-width="1"/>
      <rect x="81" y="55" width="7" height="15" rx="3" fill="${color}" stroke="#ffffff" stroke-width="1"/>
      <rect x="23" y="14" width="14" height="8" rx="3" fill="#fef08a" opacity="0.9"/>
      <rect x="63" y="14" width="14" height="8" rx="3" fill="#fef08a" opacity="0.9"/>
      <rect x="23" y="136" width="14" height="6" rx="2" fill="#ef4444"/>
      <rect x="63" y="136" width="14" height="6" rx="2" fill="#ef4444"/>
      <rect x="33" y="138" width="34" height="7" rx="1.5" fill="#ffffff"/>
    </svg>
  `;
}

function renderSaudiPlate(plateString) {
  const parts = plateString.split(' ');
  const letters = `${parts[0] || ''} ${parts[1] || ''} ${parts[2] || ''}`;
  const numbers = parts[3] || '';

  return `
    <div class="saudi-license-plate">
      <div class="plate-ksa-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#116E63" stroke-width="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        <span style="font-size:0.6rem; font-weight:900; color:#116E63; margin-top:2px;">KSA</span>
      </div>
      <div class="plate-letters-ar">${letters}</div>
      <div class="plate-digits-en">${numbers}</div>
    </div>
  `;
}

function getQRSvg(content = 'FBSU-PARK-PASS') {
  return `
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white" rx="10"/>
      <rect x="20" y="20" width="45" height="45" rx="6" fill="#116E63"/>
      <rect x="28" y="28" width="29" height="29" rx="3" fill="white"/>
      <rect x="34" y="34" width="17" height="17" rx="2" fill="#116E63"/>

      <rect x="135" y="20" width="45" height="45" rx="6" fill="#116E63"/>
      <rect x="143" y="28" width="29" height="29" rx="3" fill="white"/>
      <rect x="149" y="34" width="17" height="17" rx="2" fill="#116E63"/>

      <rect x="20" y="135" width="45" height="45" rx="6" fill="#116E63"/>
      <rect x="28" y="143" width="29" height="29" rx="3" fill="white"/>
      <rect x="34" y="149" width="17" height="17" rx="2" fill="#116E63"/>

      <circle cx="80" cy="30" r="4" fill="#116E63"/>
      <circle cx="95" cy="30" r="4" fill="#116E63"/>
      <circle cx="110" cy="40" r="4" fill="#116E63"/>
      <circle cx="80" cy="50" r="4" fill="#116E63"/>
      <circle cx="100" cy="65" r="4" fill="#116E63"/>

      <circle cx="40" cy="85" r="4" fill="#116E63"/>
      <circle cx="60" cy="85" r="4" fill="#116E63"/>
      <circle cx="80" cy="85" r="4" fill="#d7a237"/>
      <circle cx="100" cy="85" r="4" fill="#116E63"/>
      <circle cx="120" cy="85" r="4" fill="#116E63"/>
      <circle cx="140" cy="85" r="4" fill="#116E63"/>
      <circle cx="160" cy="85" r="4" fill="#116E63"/>

      <circle cx="30" cy="105" r="4" fill="#116E63"/>
      <circle cx="60" cy="105" r="4" fill="#116E63"/>
      <circle cx="85" cy="105" r="5" fill="#d7a237"/>
      <circle cx="100" cy="105" r="5" fill="#d7a237"/>
      <circle cx="115" cy="105" r="5" fill="#d7a237"/>
      <circle cx="140" cy="105" r="4" fill="#116E63"/>

      <circle cx="80" cy="130" r="4" fill="#116E63"/>
      <circle cx="100" cy="130" r="4" fill="#116E63"/>
      <circle cx="130" cy="130" r="4" fill="#116E63"/>
      <circle cx="160" cy="130" r="4" fill="#116E63"/>

      <circle cx="80" cy="155" r="4" fill="#116E63"/>
      <circle cx="110" cy="155" r="4" fill="#116E63"/>
      <circle cx="130" cy="165" r="4" fill="#116E63"/>
      <circle cx="150" cy="155" r="4" fill="#116E63"/>
      <circle cx="170" cy="170" r="4" fill="#116E63"/>

      <circle cx="100" cy="100" r="16" fill="#ffffff" stroke="#d7a237" stroke-width="2"/>
      <text x="100" y="104" font-size="9" font-weight="900" fill="#116E63" text-anchor="middle" font-family="'Tajawal', sans-serif">FBSU</text>
    </svg>
  `;
}

// ============================================================================
// Simulator Stages (Clean wording without any mention of voice notes)
// ============================================================================
const SIMULATOR_STAGES = [
  {
    step: 0,
    time: '08:00 AM',
    title: 'الصباح: إياد يركن في موقفه #01',
    titleEn: 'Morning: Eyad parks in Spot #01',
    desc: 'وصل الطالب إياد الحربي لحضور محاضرته الأولى في كلية الهندسة (08:00 - 10:00 ص) وركن سيارته كامري في موقفه المخصص #01. زميله راكان البلوي لا يزال في منزله ومحاضرته تبدأ الساعة 10:15 ص وفق جدول (أحد/ثلاثاء).',
    descEn: 'Student Eyad arrived for his first lecture at College of Engineering (08:00 - 10:00 AM) and parked in Spot #01. Student Rakan is at home as his lecture starts at 10:15 AM (Sun/Tue schedule).',
    spot1Status: 'occupied',
    spot1Occupant: 'إياد الحربي',
    spot1Badge: 'مشغول - إياد',
    spot1Plate: 'ب ط ك 1234',
    eyadStatus: 'يحضر المحاضرة',
    rakanStatus: 'في المنزل (محاضرته 10:15)',
    actionText: 'بدء مغادرة إياد للبريك',
    carColor: '#116E63'
  },
  {
    step: 1,
    time: '10:00 AM',
    title: 'إياد يغادر الجامعة في بريك (3 ساعات ونصف)',
    titleEn: 'Eyad leaves for a 3.5h break',
    desc: 'انتهت محاضرة إياد ولديه بريك طويل حتى الساعة 01:30 م. عند خروجه، رصدت كاميرا البوابة (ALPR) سيارته خارجة. قام نظام الذكاء الاصطناعي بتحويل الموقف #01 فوراً إلى "موقف متاح للتبادل الذكي (Flex Share)" بدلاً من تركه فارغاً ومهدوراً طوال اليوم!',
    descEn: 'Eyad finished his morning lecture and has a 3.5h break until 01:30 PM. The gate ALPR camera detected his car exiting. FBSU AI automatically flagged Spot #01 as "Flex Share Available" instead of leaving it wasted all day!',
    spot1Status: 'flex-share',
    spot1Occupant: 'متاح للتبادل (بريك إياد)',
    spot1Badge: 'تبادل ذكي - متاح للزملاء',
    spot1Plate: null,
    eyadStatus: 'غادر الجامعة (بريك 3.5 س)',
    rakanStatus: 'في الطريق إلى الجامعة',
    actionText: 'مطابقة الذكاء الاصطناعي مع راكان',
    carColor: null
  },
  {
    step: 2,
    time: '10:05 AM',
    title: 'خوارزمية الذكاء الاصطناعي تطابق جدول راكان',
    titleEn: 'AI algorithm matches Rakan schedule',
    desc: 'الذكاء الاصطناعي المرتبط بالبوابة الأكاديمية حلل الجداول، واكتشف أن الطالب راكان لديه كلاس الساعة 10:15 ص في كلية الحاسب (ملاصقة للموقف #01). أرسل النظام إشعاراً فورياً لهاتفه: "تم حجز موقف رقم #01 لك حتى 01:00 م بتعرفة ذكية مخفضة 5.75 ر.س/ساعة"!',
    descEn: 'AI parsed academic schedules and found student Rakan has a class at 10:15 AM at Computing College (next to Spot #01). It instantly notified Rakan and reserved Spot #01 for his exact time window (10:15 - 01:00)!',
    spot1Status: 'flex-share',
    spot1Occupant: 'محجوز لراكان (مؤقت)',
    spot1Badge: 'حجز ذكي مؤكد لراكان',
    spot1Plate: 'د ل س 8892',
    eyadStatus: 'في بريك (يحصل على رصيد محفظة)',
    rakanStatus: 'تم توجيهه إلى موقف #01',
    actionText: 'وصول سيارة راكان إلى البوابة',
    carColor: '#0b6d87'
  },
  {
    step: 3,
    time: '10:15 AM',
    title: 'وصول راكان: كاميرا البوابة تتعرف على اللوحة وترفع الحاجز',
    titleEn: 'Rakan arrives: ALPR scans plate & opens gate',
    desc: 'وصل راكان إلى بوابة الجامعة الرئيسية. كاميرا الذكاء الاصطناعي قرأت لوحته (د ل س 8892)، تحققت من الحجز الذكي، ورفعت ذراع البوابة تلقائياً مع شاشة إرشادية: "أهلاً راكان - توجه للموقف #01". ركن راكان في ثوانٍ دون البحث أو الدوران في المواقف!',
    descEn: 'Rakan arrived at the main gate. The AI camera scanned his plate (D L S 8892), validated his flex pass, and lifted the barrier automatically. Rakan parked in seconds without searching!',
    spot1Status: 'occupied',
    spot1Occupant: 'راكان البلوي',
    spot1Badge: 'مشغول - راكان',
    spot1Plate: 'د ل س 8892',
    eyadStatus: 'بريك خارجي مستمر',
    rakanStatus: 'راكن في الموقف #01',
    actionText: 'انتهاء راكان وعودة إياد',
    carColor: '#0b6d87'
  },
  {
    step: 4,
    time: '01:30 PM',
    title: 'راكان يغادر وإياد يعود ويكسب 17.25 ر.س!',
    titleEn: 'Rakan leaves, Eyad returns & earns 17.25 SAR!',
    desc: 'غادر راكان الساعة 01:00 م بعد انتهاء محاضرته. عاد إياد الساعة 01:30 م لحضور محاضرته المسائية ليجد موقفه جاهزاً ونظيفاً! والأروع: أضاف النظام 17.25 ر.س كاش في محفظة إياد مكافأة لمشاركة موقفه (مما خفض تكلفة اشتراكه الشهري بنسبة 50%)!',
    descEn: 'Rakan finished class and left at 01:00 PM. Eyad returned at 01:30 PM to find his spot ready. Best of all: the system credited 17.25 SAR to Eyad’s university wallet for sharing, saving him 50% on his monthly pass!',
    spot1Status: 'occupied',
    spot1Occupant: 'إياد الحربي (مكافأة 17.25 ر.س)',
    spot1Badge: 'إياد - ربح 17.25 ر.س',
    spot1Plate: 'ب ط ك 1234',
    eyadStatus: 'عاد للموقف + رصيد +17.25 ر.س',
    rakanStatus: 'أنهى يومه بنجاح ودون عناء',
    actionText: 'إعادة تشغيل المحاكاة',
    carColor: '#116E63'
  }
];

// ============================================================================
// Main Application Renderer
// ============================================================================
function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  const user = appState.currentUser;
  const isAr = appState.currentLang === 'ar';

  const totalSpots = appState.parkingSpots.length;
  const availableCount = appState.parkingSpots.filter(s => s.status === 'available').length;
  const flexCount = appState.parkingSpots.filter(s => s.status === 'flex-share').length;

  app.innerHTML = `
    <!-- Top Institutional Ribbon -->
    <div class="uni-ribbon">
      <div class="container ribbon-flex-row">
        <div style="display:flex; align-items:center; gap:1.25rem;">
          <span class="ribbon-item">
            <span class="pulse-dot-green"></span>
            <strong>${isAr ? 'جامعة فهد بن سلطان - تبوك' : 'Fahad Bin Sultan University - Tabuk'}</strong>
          </span>
          <span class="ribbon-item" style="color:var(--text-muted);">
            ${createIcon('shieldCheck', { size: 14, color: 'var(--fbsu-primary)' })}
            ${isAr ? 'بوابة المواقف الذكية المعتمدة' : 'Official Smart Campus Gateway'}
          </span>
          <span class="ribbon-item" style="color:var(--fbsu-gold);">
            <span class="pulse-dot-gold"></span>
            ${isAr ? 'التبادل الذكي نشط: ' + flexCount + ' مواقف متاحة للتبادل' : 'Flex Active: ' + flexCount + ' spots open'}
          </span>
        </div>
        <div style="display:flex; align-items:center; gap:1.25rem;">
          <span class="ribbon-item">
            ${createIcon('calendar', { size: 14, color: 'var(--fbsu-gold)' })}
            ${isAr ? 'الفصل الدراسي الأول 1448 هـ' : 'Academic Term 1448H'}
          </span>
          <span class="ribbon-item">
            ${createIcon('clock', { size: 14, color: 'var(--text-muted)' })}
            <span id="live-time-clock">--:--:--</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Main Header (Ultra-Responsive Mobile & Desktop Design) -->
    <header class="main-header">
      <div class="header-compact-container">
        <!-- Right Group: University Brand & Navigation Menu (يمين الهيدر) -->
        <div class="header-right-group">
          <div class="brand-section">
            <img src="./assets/branding/fbsu-logo.png" alt="شعار جامعة فهد بن سلطان" class="brand-logo-img" />
            <h1 class="brand-uni-name">${isAr ? 'جامعة فهد بن سلطان' : 'Fahad Bin Sultan University'}</h1>
          </div>

          <!-- Navigation Menu (Right side in Arabic RTL) -->
          <nav class="nav-menu">
            <button class="nav-item ${appState.activeTab === 'map' ? 'active' : ''}" data-tab="map">
              ${createIcon('mapPin', { size: 14 })}
              <span>${isAr ? 'خريطة المواقف' : 'Live Map'}</span>
            </button>
            <button class="nav-item ${appState.activeTab === 'simulator' ? 'active' : ''}" data-tab="simulator">
              ${createIcon('zap', { size: 14 })}
              <span>${isAr ? 'محاكاة التبادل' : 'Flex Swap Demo'}</span>
            </button>
            <button class="nav-item ${appState.activeTab === 'gate' ? 'active' : ''}" data-tab="gate">
              ${createIcon('camera', { size: 14 })}
              <span>${isAr ? 'كاميرات ALPR' : 'Gate ALPR'}</span>
            </button>
            <button class="nav-item ${appState.activeTab === 'booking' ? 'active' : ''}" data-tab="booking">
              ${createIcon('calendar', { size: 14 })}
              <span>${isAr ? 'حجز موقف' : 'Book Parking'}</span>
            </button>
            <button class="nav-item ${appState.activeTab === 'share' ? 'active' : ''}" data-tab="share">
              ${createIcon('refreshCw', { size: 14 })}
              <span>${isAr ? 'شارك واربح' : 'Share & Earn'}</span>
            </button>
            <button class="nav-item ${appState.activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics">
              ${createIcon('barChart3', { size: 14 })}
              <span>${isAr ? 'التحليلات' : 'Analytics'}</span>
            </button>
          </nav>
        </div>

        <!-- Left Group: Utilities, Wallet, Profile & Figma Link (شمال الهيدر) -->
        <div class="header-left-cluster">
          <div class="system-utilities-capsule">
            <button class="utility-pill-btn ${soundFX.enabled ? 'sound-active' : ''}" id="sound-toggle-btn" title="${soundFX.enabled ? (isAr ? 'كتم المؤثرات الصوتية' : 'Mute Sound Effects') : (isAr ? 'تشغيل المؤثرات الصوتية' : 'Enable Sound Effects')}">
              ${soundFX.enabled ? createIcon('volume2', { size: 14 }) : createIcon('volumeX', { size: 14 })}
              <span class="utility-text-label">${soundFX.enabled ? (isAr ? 'صوت' : 'Sound') : (isAr ? 'صامت' : 'Muted')}</span>
            </button>
            <span class="utility-divider"></span>
            <button class="utility-pill-btn" id="lang-toggle-btn" title="${isAr ? 'التحويل إلى اللغة الإنجليزية' : 'Switch to Arabic'}">
              ${createIcon('globe', { size: 14 })}
              <span class="utility-text-label" style="font-weight:800; font-size:0.75rem;">${isAr ? 'EN' : 'عربي'}</span>
            </button>
            <span class="utility-divider"></span>
            <button class="utility-pill-btn" id="theme-toggle-btn" title="${isAr ? 'تبديل المظهر النهاري / الليلي' : 'Toggle Day/Night Theme'}">
              ${document.body.classList.contains('theme-light') ? createIcon('sun', { size: 14, color: 'var(--fbsu-gold)' }) : createIcon('moon', { size: 14 })}
              <span class="utility-text-label">${isAr ? (document.body.classList.contains('theme-light') ? 'نهاري' : 'ليلي') : (document.body.classList.contains('theme-light') ? 'Light' : 'Dark')}</span>
            </button>
          </div>

          <!-- Wallet Button -->
          <button class="wallet-badge-btn" id="open-wallet-btn" title="${isAr ? 'رصيد المحفظة الجامعية' : 'University Wallet Balance'}">
            ${createIcon('wallet', { size: 13, color: 'var(--fbsu-gold)' })}
            <span>${user.walletBalance.toFixed(2)} ر.س</span>
          </button>

          <!-- Auth / Profile Button -->
          <button class="auth-btn-header" id="open-auth-btn" title="${isAr ? 'الملف الشخصي والحساب الأكاديمي' : 'Academic Profile'}">
            ${createIcon('user', { size: 13, color: '#ffffff' })}
            <span>${appState.isLoggedIn ? (user.name.split(' ')[0] + ' (' + user.role.split(' ')[0] + ')') : (isAr ? 'تسجيل الدخول' : 'Sign In')}</span>
          </button>

          <!-- Figma UI/UX Showcase Link Button -->
          <a href="./index.html" class="showcase-nav-btn" title="${isAr ? 'استعراض لوحة فيجما وتوثيق UI/UX' : 'Open Figma Showcase'}">
            <svg width="12" height="12" viewBox="0 0 38 57" fill="none"><path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/><path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/><path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/><path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/><path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/></svg>
            <span>${isAr ? 'معرض فيجما' : 'Figma System'}</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Main Body Container -->
    <main>
      ${renderHeroSection(isAr, totalSpots, availableCount, flexCount)}
      
      <div class="container" style="margin-top:2.5rem;">
        ${appState.activeTab === 'map' ? renderParkingMapTab(isAr) : ''}
        ${appState.activeTab === 'simulator' ? renderSimulatorTab(isAr) : ''}
        ${appState.activeTab === 'gate' ? renderGateScannerTab(isAr) : ''}
        ${appState.activeTab === 'booking' ? renderBookingTab(isAr) : ''}
        ${appState.activeTab === 'share' ? renderShareTab(isAr) : ''}
        ${appState.activeTab === 'analytics' ? renderAnalyticsTab(isAr) : ''}
      </div>
    </main>

    <!-- Footer -->
    ${renderFooter(isAr)}

    <!-- Dynamic Modals Container -->
    <div id="modal-container"></div>
  `;

  updateLiveClock();
  attachEventListeners();
}

// ============================================================================
// Hero Section
// ============================================================================
function renderHeroSection(isAr, totalSpots, availableCount, flexCount) {
  return `
    <section class="hero-section">
      <div class="hero-backdrop"></div>
      <div class="container">
        <div class="hero-grid">
          <div>
            <div class="hero-tag">
              ${createIcon('sparkles', { size: 14, color: '#38c2b0' })}
              <span>${isAr ? 'مبادرة التحول الرقمي بالذكاء الاصطناعي - جامعة فهد بن سلطان' : 'AI Digital Transformation - FBSU Campus'}</span>
            </div>
            <h2 class="hero-title">
              ${isAr
      ? 'مواقف ذكية بتبادل مرن تلقائي <span class="highlight">دون إهدار لأي موقف</span>'
      : 'Smart Parking with AI Flex Sharing <span class="highlight">Zero Wasted Spaces</span>'
    }
            </h2>
            <p class="hero-desc">
              ${isAr
      ? 'حل هندسي متكامل ينهي أزمة مواقف الجامعة: عندما يغادر الطالب في أوقات البريك (2-4 ساعات)، يتعرف النظام تلقائياً على خروجه عبر كاميرات قراءة اللوحات (ALPR) ويفتح الموقف لزميله القادم للمحاضرة، مع كسب رصيد مكافأة وحجز متوافق مع جداول الكليات!'
      : 'An intelligent platform solving campus parking congestion: when a student leaves during breaks (2-4 hrs), AI ALPR cameras detect departure and dynamically reallocate the spot to incoming students based on class schedules, earning cashback rewards!'
    }
            </p>
            <div class="hero-cta-group">
              <button class="btn-primary" id="hero-explore-map-btn">
                ${createIcon('mapPin', { size: 18, color: '#ffffff' })}
                <span>${isAr ? 'عرض خريطة المواقف الـ 30' : 'Explore 30 Spots Map'}</span>
              </button>
              <button class="btn-gold" id="hero-run-sim-btn">
                ${createIcon('zap', { size: 18, color: '#0b1a17' })}
                <span>${isAr ? 'تجربة سيناريو التبادل الذكي (إياد وراكان)' : 'Experience Smart Swapping Scenario'}</span>
              </button>
              <button class="btn-outline" id="hero-quick-gate-btn">
                ${createIcon('camera', { size: 18 })}
                <span>${isAr ? 'محاكاة قارئ اللوحات' : 'Test Gate ALPR'}</span>
              </button>
            </div>
          </div>

          <!-- Feature Showcase Card -->
          <div class="glass-panel" style="padding:1.75rem; border-color:var(--fbsu-primary-border);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:0.85rem; margin-bottom:1.25rem;">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <div style="width:40px; height:40px; border-radius:var(--radius-md); background:var(--fbsu-primary-light); color:var(--fbsu-primary); display:flex; align-items:center; justify-content:center;">
                  ${createIcon('sparkles', { size: 22, color: 'var(--fbsu-primary)' })}
                </div>
                <div>
                  <h3 style="font-size:1.05rem; font-weight:800; color:var(--text-main);">${isAr ? 'مبدأ التبادل الذكي (Flex Share)' : 'Smart Flex Share Logic'}</h3>
                  <span style="font-size:0.75rem; color:var(--text-muted);">${isAr ? 'نموذج محاكاة واقعي للتبادل الذكي بين الطلاب' : 'Realistic Student Flex Sharing Model'}</span>
                </div>
              </div>
              <span class="badge badge-flex">
                ${createIcon('zap', { size: 13, color: 'var(--fbsu-gold)' })}
                ${isAr ? 'نشط الآن' : 'Active'}
              </span>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.85rem;">
              <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.95rem; display:flex; align-items:center; gap:0.85rem;">
                <div style="width:30px; height:30px; border-radius:50%; background:var(--fbsu-primary-light); color:var(--fbsu-primary); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem; flex-shrink:0;">
                  1
                </div>
                <div>
                  <div style="font-size:0.9rem; font-weight:800; color:var(--text-main);">رصد خروج إياد بالذكاء الاصطناعي</div>
                  <div style="font-size:0.78rem; color:var(--text-muted);">كاميرا البوابة تقرأ لوحة (ب ط ك 1234) وترصد خروج إياد في بريك 3 ساعات.</div>
                </div>
              </div>

              <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.95rem; display:flex; align-items:center; gap:0.85rem;">
                <div style="width:30px; height:30px; border-radius:50%; background:var(--fbsu-gold-light); color:var(--fbsu-gold); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem; flex-shrink:0;">
                  2
                </div>
                <div>
                  <div style="font-size:0.9rem; font-weight:800; color:var(--text-main);">تحويل الموقف #01 إلى "تبادل ذكي"</div>
                  <div style="font-size:0.78rem; color:var(--text-muted);">بدل إهدار الموقف فارغاً، يفتحه النظام تلقائياً لمن لديه كلاس بنفس التوقيت.</div>
                </div>
              </div>

              <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.95rem; display:flex; align-items:center; gap:0.85rem;">
                <div style="width:30px; height:30px; border-radius:50%; background:var(--fbsu-primary-light); color:var(--fbsu-primary); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem; flex-shrink:0;">
                  3
                </div>
                <div>
                  <div style="font-size:0.9rem; font-weight:800; color:var(--text-main);">توجيه راكان وربح إياد للمكافأة</div>
                  <div style="font-size:0.78rem; color:var(--text-muted);">راكان يركن فور وصوله، وإياد يكسب 17.25 ر.س في محفظته الجامعية!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hero Stats Banner -->
        <div class="hero-stats-banner">
          <div class="stat-chip">
            <div class="stat-chip-icon">
              ${createIcon('car', { size: 22, color: 'var(--fbsu-primary)' })}
            </div>
            <div>
              <div class="stat-chip-num">${totalSpots}</div>
              <div class="stat-chip-label">${isAr ? 'إجمالي مواقف القطاع' : 'Total Pilot Bays'}</div>
            </div>
          </div>

          <div class="stat-chip">
            <div class="stat-chip-icon" style="background:var(--status-available-bg); color:var(--status-available);">
              ${createIcon('checkCircle2', { size: 22, color: 'var(--status-available)' })}
            </div>
            <div>
              <div class="stat-chip-num" style="color:var(--status-available);">${availableCount}</div>
              <div class="stat-chip-label">${isAr ? 'مواقف شاغرة الآن' : 'Available Right Now'}</div>
            </div>
          </div>

          <div class="stat-chip">
            <div class="stat-chip-icon" style="background:var(--fbsu-gold-light); color:var(--fbsu-gold);">
              ${createIcon('refreshCw', { size: 22, color: 'var(--fbsu-gold)' })}
            </div>
            <div>
              <div class="stat-chip-num" style="color:var(--fbsu-gold);">${flexCount}</div>
              <div class="stat-chip-label">${isAr ? 'مواقف بالتبادل الذكي' : 'In Flex Mode'}</div>
            </div>
          </div>

          <div class="stat-chip">
            <div class="stat-chip-icon">
              ${createIcon('shieldCheck', { size: 22, color: 'var(--fbsu-primary)' })}
            </div>
            <div>
              <div class="stat-chip-num">99.4%</div>
              <div class="stat-chip-label">${isAr ? 'دقة قارئ اللوحات' : 'ALPR Accuracy'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ============================================================================
// Tab 1: Live Interactive 30-Spot Parking Lot Grid
// ============================================================================
function renderParkingMapTab(isAr) {
  const filter = appState.activeZoneFilter;
  const filteredSpots = appState.parkingSpots.filter(spot => {
    if (filter === 'all') return true;
    return spot.zone === filter;
  });

  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('mapPin', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'خريطة المواقف التفاعلية' : 'Interactive Map'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'المخطط الرقمي المباشر لمواقف جامعة فهد بن سلطان (30 موقف)' : 'FBSU Live Digital Parking Lot (30 Bays)'}</h3>
      <p class="section-subtitle">
        ${isAr
      ? 'عرض لحظي لحالة الحساسات الأرضية وكاميرات الرؤية الحاسوبية. اضغط على أي موقف لعرض التفاصيل الكاملة، أو حجزه، أو تفعيل التبادل الذكي!'
      : 'Real-time sensor & computer vision status. Click any bay to view details, reserve, or initiate AI flex exchange!'
    }
      </p>
    </div>

    <!-- Parking Toolbar: Filters & Legend -->
    <div class="parking-toolbar">
      <div class="zone-filter-tabs">
        <button class="zone-btn ${filter === 'all' ? 'active' : ''}" data-zone="all">
          ${createIcon('building2', { size: 14 })}
          <span>${isAr ? 'جميع القطاعات (30 موقف)' : 'All Zones (30)'}</span>
        </button>
        <button class="zone-btn ${filter === 'A' ? 'active' : ''}" data-zone="A">
          <span>${isAr ? 'قطاع A - الحاسب والهندسة' : 'Zone A - Computing & Eng'}</span>
        </button>
        <button class="zone-btn ${filter === 'B' ? 'active' : ''}" data-zone="B">
          <span>${isAr ? 'قطاع B - إدارة الأعمال والطب' : 'Zone B - Business & Med'}</span>
        </button>
        <button class="zone-btn ${filter === 'C' ? 'active' : ''}" data-zone="C">
          <span>${isAr ? 'قطاع C - كادر التدريس' : 'Zone C - Faculty VIP'}</span>
        </button>
        <button class="zone-btn ${filter === 'D' ? 'active' : ''}" data-zone="D">
          <span>${isAr ? 'قطاع D - شحن كهربائي EV' : 'Zone D - EV Charging'}</span>
        </button>
      </div>

      <div class="legend-list">
        <div class="legend-item"><span class="legend-chip avail"></span> ${isAr ? 'متاح' : 'Available'}</div>
        <div class="legend-item"><span class="legend-chip occ"></span> ${isAr ? 'مشغول' : 'Occupied'}</div>
        <div class="legend-item"><span class="legend-chip flx"></span> ${isAr ? 'تبادل ذكي (بريك)' : 'AI Flex (Break)'}</div>
        <div class="legend-item"><span class="legend-chip res"></span> ${isAr ? 'محجوز لك' : 'Your Spot'}</div>
        <div class="legend-item"><span class="legend-chip fac"></span> ${isAr ? 'أعضاء التدريس' : 'Faculty'}</div>
      </div>
    </div>

    <!-- 2D/3D Parking Lot Canvas -->
    <div class="parking-lot-canvas">
      <!-- Simulated Campus Road Signage -->
      <div class="campus-road-header">
        <div style="display:flex; align-items:center; gap:0.4rem;">
          ${createIcon('arrowUp', { size: 14, color: 'var(--fbsu-primary)' })}
          <span>${isAr ? 'طريق الملك خالد - بوابة الحرم الجامعي الرئيسية' : 'King Khalid Road - Main Gate'}</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.4rem; color:var(--fbsu-gold);">
          ${createIcon('shieldCheck', { size: 14, color: 'var(--fbsu-gold)' })}
          <span>${isAr ? 'مزامنة إنترنت الأشياء IoT نشطة' : 'IoT Real-time Sync Active'}</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.4rem;">
          ${createIcon('arrowDown', { size: 14, color: 'var(--fbsu-primary)' })}
          <span>${isAr ? 'مبنى كلية الهندسة والحاسب الآلي' : 'College of Engineering & Computing'}</span>
        </div>
      </div>

      <!-- Bays Grid -->
      <div class="parking-bays-container">
        ${filteredSpots.map(spot => renderSpotCard(spot, isAr)).join('')}
      </div>
    </div>
  `;
}

function renderSpotCard(spot, isAr) {
  let statusClass = 'available';
  let badgeText = isAr ? 'متاح الآن' : 'Available';
  let statusColor = 'var(--status-available)';
  let subInfo = isAr ? 'احجز الآن' : 'Reserve now';

  if (spot.status === 'occupied') {
    statusClass = 'occupied';
    badgeText = isAr ? 'مشغول' : 'Occupied';
    statusColor = 'var(--status-occupied)';
    subInfo = spot.timeLeft || (isAr ? 'حتى نهاية المحاضرة' : 'Until class end');
  } else if (spot.status === 'flex-share') {
    statusClass = 'flex-share';
    badgeText = isAr ? 'تبادل ذكي' : 'AI Flex Share';
    statusColor = 'var(--fbsu-gold)';
    subInfo = isAr ? 'متاح خلال البريك' : 'Available during break';
  } else if (spot.status === 'faculty-spot') {
    statusClass = 'faculty-spot';
    badgeText = isAr ? 'دكاترة' : 'Faculty';
    statusColor = 'var(--status-faculty)';
    subInfo = isAr ? 'مخصص للكادر' : 'Staff Only';
  }

  if (appState.currentUser && appState.currentUser.primarySpot === spot.id) {
    statusClass += ' reserved-user';
  }

  let visualCenter = '';
  if (spot.status === 'occupied' || spot.status === 'faculty-spot') {
    const carColor = spot.id === 1 ? '#116E63' : (spot.id === 2 ? '#0b6d87' : (spot.isFaculty ? '#8b5cf6' : '#d97706'));
    visualCenter = getCarSVG(carColor);
  } else if (spot.status === 'flex-share') {
    visualCenter = `
      <div style="text-align:center; padding:0.6rem 0;">
        ${createIcon('refreshCw', { size: 32, color: 'var(--fbsu-gold)' })}
        <span style="font-size:0.7rem; color:var(--fbsu-gold); font-weight:800; display:block; margin-top:0.35rem;">AI FLEX</span>
      </div>
    `;
  } else {
    visualCenter = `
      <div style="width:40px; height:68px; border:1.5px dashed var(--border-subtle); border-radius:6px; display:flex; align-items:center; justify-content:center; color:var(--text-dim); font-size:0.75rem; font-weight:800;">
        ${spot.isEV ? createIcon('zap', { size: 18, color: 'var(--fbsu-primary)' }) : (spot.isAccessible ? createIcon('shieldCheck', { size: 18 }) : 'P')}
      </div>
    `;
  }

  return `
    <div class="parking-spot-card ${statusClass}" data-spot-id="${spot.id}">
      <div class="spot-top-meta">
        <span class="spot-number">#${String(spot.id).padStart(2, '0')}</span>
        <span class="spot-zone-badge">${spot.zone} - ${spot.college}</span>
      </div>

      <div class="spot-visual-center">
        ${visualCenter}
      </div>

      <div class="spot-bottom-status">
        <span class="status-text" style="color:${statusColor};">${badgeText}</span>
        <span class="status-sub-info">${spot.occupant || subInfo}</span>
      </div>
    </div>
  `;
}

// ============================================================================
// Tab 2: The Eyad & Rakan AI Sharing Simulator
// ============================================================================
function renderSimulatorTab(isAr) {
  const stage = SIMULATOR_STAGES[appState.simStep];

  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('zap', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'المحاكي التفاعلي الذكي' : 'Interactive AI Simulator'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'المحاكاة الذكية للتبادل المرن بين الطلاب (نموذج إياد وراكان)' : 'Smart Student Flex Swapping Simulation'}</h3>
      <p class="section-subtitle">
        ${isAr
      ? 'محاكاة هندسية دقيقة لكيفية القضاء على الشواغر المهدورة: عندما يغادر الطالب في بريك دراسي، يُعاد تخصيص الموقف تلقائياً لزميله المحتاج مع ضمان عدم حدوث أي تعارض!'
      : 'Zero-conflict automated parking slot reallocation when students depart during campus breaks.'
    }
      </p>
    </div>

    <div class="simulator-box">
      <!-- 5-Step Timeline Navigation -->
      <div class="sim-timeline-bar">
        ${SIMULATOR_STAGES.map((s, idx) => `
          <button class="sim-step-btn ${idx === appState.simStep ? 'current' : (idx < appState.simStep ? 'completed' : '')}" data-sim-step="${idx}">
            <span class="sim-time-tag">${s.time}</span>
            <span class="sim-label">${idx + 1}. ${isAr ? s.title.split(':')[0] : 'Step ' + (idx + 1)}</span>
          </button>
        `).join('')}
      </div>

      <!-- Simulator Viewport -->
      <div class="sim-viewport-grid">
        <!-- Visual Stage: Spot #01 Live State -->
        <div class="sim-visual-stage">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <span class="badge badge-gold">
                ${createIcon('mapPin', { size: 13, color: 'var(--fbsu-gold)' })}
                <span>${isAr ? 'موقف رقم #01 - كلية الهندسة والحاسب' : 'Bay #01 - Engineering & Computing'}</span>
              </span>
              <span class="badge ${stage.spot1Status === 'occupied' ? 'badge-occupied' : 'badge-flex'}">
                ${stage.spot1Badge}
              </span>
            </div>

            <!-- Spotlight Visual -->
            <div class="sim-spot-spotlight ${stage.spot1Status === 'occupied' ? 'occupied' : 'flex-active'}">
              <div style="font-size:0.8rem; font-weight:800; color:var(--text-muted); margin-bottom:0.5rem; display:flex; align-items:center; justify-content:center; gap:0.4rem;">
                ${createIcon('camera', { size: 14, color: 'var(--fbsu-primary)' })}
                <span>${isAr ? 'المستشعر الأرضي وكاميرا الرؤية الحاسوبية' : 'IoT Bay Sensor & Vision'}</span>
              </div>

              ${stage.carColor ? `
                <div style="width:120px; height:180px; margin:0.85rem auto;">
                  ${getCarSVG(stage.carColor)}
                </div>
                <div style="font-weight:800; font-size:1.1rem; color:var(--text-main); margin-top:0.35rem;">${stage.spot1Occupant}</div>
                <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">
                  <span>${isAr ? 'اللوحة المسجلة:' : 'Registered Plate:'} <strong>${stage.spot1Plate}</strong></span>
                </div>
              ` : `
                <div style="height:180px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.5rem;">
                  ${createIcon('refreshCw', { size: 44, color: 'var(--fbsu-gold)' })}
                  <div style="font-weight:800; font-size:1.1rem; color:var(--fbsu-gold);">
                    ${isAr ? 'الموقف شاغر ومتاح للتبادل الذكي' : 'Vacant & Open for AI Flex Share'}
                  </div>
                  <div style="font-size:0.8rem; color:var(--text-muted);">
                    ${isAr ? 'نافذة التبادل: من 10:00 ص إلى 01:30 م (3.5 ساعات)' : 'Flex Window: 10:00 AM - 01:30 PM (3.5 hrs)'}
                  </div>
                </div>
              `}
            </div>
          </div>

          <!-- Quick Metrics inside simulator -->
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; margin-top:1.5rem;">
            <div class="stat-chip" style="padding:0.75rem;">
              <div>
                <div style="font-size:1.2rem; font-weight:800; color:var(--status-available);">+100%</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${isAr ? 'استغلال السعة' : 'Capacity Boost'}</div>
              </div>
            </div>
            <div class="stat-chip" style="padding:0.75rem;">
              <div>
                <div style="font-size:1.2rem; font-weight:800; color:var(--fbsu-gold);">${appState.simStep === 4 ? '17.25 ر.س' : '0.00 ر.س'}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${isAr ? 'أرباح إياد (محفظة)' : 'Eyad Cashback'}</div>
              </div>
            </div>
            <div class="stat-chip" style="padding:0.75rem;">
              <div>
                <div style="font-size:1.2rem; font-weight:800; color:var(--fbsu-primary);">0 دقيقة</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${isAr ? 'وقت بحث راكان' : 'Search Time for Rakan'}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Narrative & Participants Status Panel -->
        <div style="display:flex; flex-direction:column; justify-content:space-between;">
          <div class="sim-narrative-box">
            <div class="sim-narrative-title">
              ${createIcon('clock', { size: 18, color: 'var(--fbsu-gold)' })}
              <span>${stage.time} - ${isAr ? stage.title : stage.titleEn}</span>
            </div>
            <p class="sim-narrative-text">
              ${isAr ? stage.desc : stage.descEn}
            </p>
          </div>

          <!-- Participants Status Cards -->
          <div class="sim-participants-row">
            <div class="participant-card ${stage.step === 0 || stage.step === 4 ? 'active' : ''}">
              <div class="participant-avatar-icon">
                ${createIcon('graduationCap', { size: 20, color: '#ffffff' })}
              </div>
              <div class="participant-info">
                <h4>إياد الحربي (هندسة)</h4>
                <p>الحالة: <strong>${stage.eyadStatus}</strong></p>
                <p style="color:var(--fbsu-gold);">موقفه الأساسي: #01</p>
              </div>
            </div>

            <div class="participant-card ${stage.step === 2 || stage.step === 3 ? 'active' : ''}">
              <div class="participant-avatar-icon" style="background:#0b6d87;">
                ${createIcon('user', { size: 20, color: '#ffffff' })}
              </div>
              <div class="participant-info">
                <h4>راكان البلوي (حاسب)</h4>
                <p>الحالة: <strong>${stage.rakanStatus}</strong></p>
                <p style="color:var(--fbsu-primary);">كلاسه: 10:15 ص</p>
              </div>
            </div>
          </div>

          <!-- Simulation Controls -->
          <div class="sim-controls-footer">
            <div style="display:flex; gap:0.5rem;">
              <button class="btn-outline" id="sim-prev-btn" ${appState.simStep === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                ${createIcon('arrowRight', { size: 16 })}
                <span>${isAr ? 'السابق' : 'Previous'}</span>
              </button>
              <button class="btn-gold" id="sim-next-btn">
                <span>${stage.actionText}</span>
                ${createIcon('arrowLeft', { size: 16, color: '#0b1a17' })}
              </button>
            </div>

            <button class="btn-primary" id="sim-autoplay-btn">
              ${appState.simAutoPlaying ? createIcon('pause', { size: 16, color: '#ffffff' }) : createIcon('play', { size: 16, color: '#ffffff' })}
              <span>${appState.simAutoPlaying ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تشغيل تلقائي' : 'Auto Play')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// Tab 3: AI Gate & ALPR License Plate Camera Simulator
// ============================================================================
function renderGateScannerTab(isAr) {
  const isGranted = appState.gateStatus === 'granted';
  const isScanning = appState.gateStatus === 'scanning';

  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('camera', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'محاكي بوابات الجامعة والذكاء الاصطناعي' : 'Gate & ALPR Computer Vision'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'نظام التعرف التلقائي على اللوحات (ALPR) وفتح البوابات الذكي' : 'Automated License Plate Recognition & Smart Barrier'}</h3>
      <p class="section-subtitle">
        ${isAr
      ? 'كاميرات عالية الدقة مثبتة على البوابات الرئيسية لجامعة فهد بن سلطان تحلل لوحات السيارات، تتحقق من الحجوزات والتبادل الذكي، وترفع الحواجز دون الحاجة للتوقف أو إبراز بطاقات!'
      : 'High-speed AI cameras at FBSU main gates recognize Saudi license plates, verify schedule permits and flex slots, and lift the barrier seamlessly!'
    }
      </p>
    </div>

    <div class="sim-viewport-grid">
      <!-- Camera Feed Simulated Viewport -->
      <div class="camera-feed-box">
        <div class="camera-header-overlay">
          <div style="display:flex; align-items:center; gap:0.5rem; color:#ff3344; font-weight:800; font-family:var(--font-en);">
            <span style="width:8px; height:8px; background:#ff3344; border-radius:50%;"></span>
            <span>LIVE: CAM-01 (MAIN_NORTH_GATE_FBSU)</span>
          </div>
          <div style="color:var(--text-dim); font-family:var(--font-en); font-size:0.75rem;">
            60 FPS | 4K HDR | MODEL: FBSU-ALPR-v4.2
          </div>
        </div>

        <div class="camera-viewport">
          <div class="cam-target-bracket ${isGranted ? 'locked' : ''}">
            ${isScanning ? '<div class="scan-laser-line"></div>' : ''}
            <div style="position:absolute; top:-22px; right:0; font-size:0.7rem; color:var(--status-available); font-family:var(--font-en); font-weight:800;">
              AI CONFIDENCE: ${isScanning ? 'ANALYZING...' : (isGranted ? '99.8%' : 'READY')}
            </div>
          </div>

          <!-- Saudi Plate Component -->
          ${renderSaudiPlate(appState.gateScannedPlate)}
        </div>

        <!-- Physical Barrier Gate Simulation View -->
        <div class="gate-barrier-stage">
          <div class="barrier-pillar">
            <div class="barrier-led ${appState.gateArmOpen ? 'green' : ''}"></div>
          </div>
          <div class="barrier-arm ${appState.gateArmOpen ? 'open' : ''}"></div>
          <div style="margin-right:2rem; margin-bottom:0.75rem; font-size:0.85rem; font-weight:800; color:${appState.gateArmOpen ? 'var(--status-available)' : '#ef4444'};">
            ${appState.gateArmOpen ? (isAr ? 'البوابة مفتوحة - تفضل بالمرور' : 'GATE OPEN') : (isAr ? 'البوابة مغلقة - بانتظار الفحص' : 'GATE CLOSED')}
          </div>
        </div>
      </div>

      <!-- Controls & AI Recognition Result -->
      <div class="glass-panel" style="padding:1.75rem; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <h4 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
            ${createIcon('camera', { size: 18, color: 'var(--fbsu-primary)' })}
            <span>${isAr ? 'لوحة تحكم فحص البوابة' : 'Gate Simulator Controls'}</span>
          </h4>

          <div class="form-group">
            <label class="form-label">${isAr ? 'اختر سيارة للتجربة والفحص المباشر:' : 'Select Vehicle to Scan:'}</label>
            <div style="display:grid; grid-template-columns:1fr; gap:0.6rem;">
              <button class="pattern-option ${appState.gateScannedPlate === 'ب ط ك 1234' ? 'selected' : ''}" data-plate="ب ط ك 1234" style="text-align:right;">
                <h5>سيارة الطالب إياد الحربي (كامري)</h5>
                <span>لوحة: <strong>ب ط ك 1234</strong> - موقف #01 (كلية الهندسة)</span>
              </button>
              <button class="pattern-option ${appState.gateScannedPlate === 'د ل س 8892' ? 'selected' : ''}" data-plate="د ل س 8892" style="text-align:right;">
                <h5>سيارة الطالب راكان البلوي (سوناتا)</h5>
                <span>لوحة: <strong>د ل س 8892</strong> - حجز تبادل ذكي في بريك إياد</span>
              </button>
              <button class="pattern-option ${appState.gateScannedPlate === 'أ ح م 5501' ? 'selected' : ''}" data-plate="أ ح م 5501" style="text-align:right;">
                <h5>سيارة د. عبد الله الغامدي (جينيسيس)</h5>
                <span>لوحة: <strong>أ ح م 5501</strong> - كادر التدريس - موقف #19</span>
              </button>
              <button class="pattern-option ${appState.gateScannedPlate === 'ق ر ط 9921' ? 'selected' : ''}" data-plate="ق ر ط 9921" style="text-align:right;">
                <h5>سيارة زائر خارجي</h5>
                <span>لوحة: <strong>ق ر ط 9921</strong> - حجز مسبق عبر التطبيق</span>
              </button>
            </div>
          </div>

          <div style="margin-top:1.25rem;">
            <button class="btn-primary" id="trigger-scan-btn" style="width:100%; justify-content:center;" ${isScanning ? 'disabled' : ''}>
              ${createIcon('camera', { size: 18, color: '#ffffff' })}
              <span>${isScanning ? (isAr ? 'جاري الفحص والمعالجة...' : 'Scanning...') : (isAr ? 'مسح اللوحة والتحقق بالذكاء الاصطناعي' : 'Scan & Validate Plate')}</span>
            </button>
          </div>
        </div>

        <!-- Result Box -->
        <div style="background:rgba(255,255,255,0.03); border:1px solid ${isGranted ? 'var(--status-available-border)' : 'var(--border-subtle)'}; border-radius:var(--radius-md); padding:1rem; margin-top:1rem;">
          ${isGranted ? `
            <div style="display:flex; align-items:center; gap:0.75rem;">
              ${createIcon('checkCircle2', { size: 28, color: 'var(--status-available)' })}
              <div>
                <h5 style="color:var(--status-available); font-weight:800; font-size:0.95rem;">
                  ${isAr ? 'تم التحقق بنجاح - مرحباً بك في جامعة فهد بن سلطان' : 'Access Granted - Welcome to FBSU'}
                </h5>
                <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">
                  ${isAr ? 'اللوحة مصرح لها بالدخول. توجه إلى الموقف المخصص وتم تفعيل إضاءة التوجيه الذكية.' : 'Authorized plate. Proceed to assigned spot with dynamic lighting guide.'}
                </p>
              </div>
            </div>
          ` : `
            <div style="display:flex; align-items:center; gap:0.75rem;">
              ${createIcon('shieldCheck', { size: 28, color: 'var(--text-dim)' })}
              <div>
                <h5 style="color:var(--text-main); font-weight:700; font-size:0.9rem;">
                  ${isAr ? 'بانتظار اقتراب السيارة من البوابة' : 'Waiting for vehicle approach'}
                </h5>
                <p style="font-size:0.78rem; color:var(--text-muted);">
                  ${isAr ? 'اضغط زر المسح أعلاه لتشغيل قارئ الكاميرا ورفع الذراع آلياً.' : 'Click scan above to test ALPR recognition and barrier lifting.'}
                </p>
              </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// Tab 4: Booking Wizard & Pricing Calculator
// ============================================================================
function renderBookingTab(isAr) {
  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('calendar', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'حجز موقف جديد' : 'Parking Booking'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'حجز موقف ذكي متوافق مع جدولك الدراسي' : 'Reserve Spot Synchronized with Academic Schedule'}</h3>
      <p class="section-subtitle">
        ${isAr
      ? 'نظام تعرفة ذكي ومرن مطابق لمعايير المطارات والمواقف الذكية (5.75 ر.س / ساعة، أو سقف يومي 15 ر.س، أو اشتراك شهري مع خصم التبادل الذكي).'
      : 'Flexible tariff structure compliant with Saudi smart parking standards (5.75 SAR/hr, 15 SAR daily cap, or monthly pass with 50% sharing discount).'
    }
      </p>
    </div>

    <div class="booking-split-grid">
      <!-- Booking Form -->
      <div class="glass-panel" style="padding:2rem;">
        <h4 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem;">
          ${createIcon('calendar', { size: 18, color: 'var(--fbsu-primary)' })}
          <span>${isAr ? 'بيانات الحجز الأكاديمي' : 'Reservation Details'}</span>
        </h4>

        <!-- Academic Schedule Pattern Selector -->
        <div class="form-group">
          <label class="form-label">${isAr ? '1. نظام الجدول الأكاديمي بجامعة فهد بن سلطان:' : '1. FBSU Class Schedule Pattern:'}</label>
          <div class="schedule-pattern-picker" id="pattern-picker">
            <div class="pattern-option selected" data-pattern="sun-tue">
              <h5>الأحد / الثلاثاء</h5>
              <span>محاضرات منتظمة</span>
            </div>
            <div class="pattern-option" data-pattern="mon-wed">
              <h5>الاثنين / الأربعاء</h5>
              <span>محاضرات منتظمة</span>
            </div>
            <div class="pattern-option" data-pattern="thu-labs">
              <h5>الخميس (معامل)</h5>
              <span>أيام اللابات والمختبرات</span>
            </div>
          </div>
        </div>

        <!-- Target College -->
        <div class="form-group">
          <label class="form-label">${isAr ? '2. الكلية المستهدفة (لاختيار أقرب موقف):' : '2. Target College:'}</label>
          <select id="booking-college" class="form-control">
            <option value="computing">كلية الحاسب الآلي (علوم حاسب - هندسة حاسب)</option>
            <option value="engineering">كلية الهندسة (مدنية - كهربائية - ميكانيكية - طاقة متجددة)</option>
            <option value="business">كلية الأعمال والإدارة (تسويق - لوجستيات - محاسبة)</option>
            <option value="medicine">كلية الطب والعلوم الطبية</option>
            <option value="sciences">كلية العلوم والدراسات الإنسانية والقانون</option>
          </select>
        </div>

        <!-- Tariff Plan -->
        <div class="form-group">
          <label class="form-label">${isAr ? '3. نوع الباقة / التعرفة:' : '3. Tariff Plan:'}</label>
          <div class="tariff-picker-grid" id="tariff-picker">
            <div class="pattern-option selected" data-tariff="hourly">
              <h5>بالساعة</h5>
              <span style="color:var(--fbsu-gold);">5.75 ر.س / ساعة</span>
            </div>
            <div class="pattern-option" data-tariff="daily">
              <h5>يومي كامل</h5>
              <span style="color:var(--fbsu-gold);">15.00 ر.س / يوم</span>
            </div>
            <div class="pattern-option" data-tariff="monthly">
              <h5>اشتراك شهري</h5>
              <span style="color:var(--fbsu-gold);">450 ر.س (أو 225 ر.س*)</span>
            </div>
          </div>
        </div>

        <!-- Time Range Picker -->
        <div class="form-group" id="hourly-time-group">
          <label class="form-label">${isAr ? '4. الساعات المطلوبة للموقف:' : '4. Required Hours:'}</label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div>
              <span style="font-size:0.78rem; color:var(--text-muted);">${isAr ? 'من الساعة:' : 'From:'}</span>
              <input type="time" id="booking-time-from" class="form-control" value="09:00" />
            </div>
            <div>
              <span style="font-size:0.78rem; color:var(--text-muted);">${isAr ? 'إلى الساعة:' : 'To:'}</span>
              <input type="time" id="booking-time-to" class="form-control" value="12:00" />
            </div>
          </div>
        </div>

        <!-- Smart Share Checkbox -->
        <div class="form-group" style="background:var(--fbsu-gold-light); border:1px solid var(--fbsu-gold-border); padding:1rem; border-radius:var(--radius-md);">
          <label style="display:flex; align-items:center; gap:0.6rem; cursor:pointer;">
            <input type="checkbox" id="smart-share-optin" checked style="width:18px; height:18px; accent-color:var(--fbsu-gold);" />
            <div>
              <strong style="color:var(--fbsu-gold); font-size:0.9rem;">
                ${isAr ? 'تفعيل ميزة التبادل الذكي التلقائي (اربح حتى 50% خصم)' : 'Opt-in for AI Flex Sharing (Save up to 50%)'}
              </strong>
              <p style="font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">
                ${isAr ? 'عند خروجك من الجامعة في أوقات البريك، يُتاح الموقف لزملائك وتُضاف الأرباح فوراً لمحفظتك.' : 'Whenever you leave campus during breaks, your spot is shared and you earn instant credit.'}
              </p>
            </div>
          </label>
        </div>

        <button class="btn-gold" id="confirm-booking-btn" style="width:100%; justify-content:center; padding:0.95rem;">
          ${createIcon('shieldCheck', { size: 18, color: '#0b1a17' })}
          <span>${isAr ? 'تأكيد الحجز وإصدار التصريح الرقمي الذكي' : 'Confirm & Generate Digital Gate Pass'}</span>
        </button>
      </div>

      <!-- Live Pricing & Order Ticket -->
      <div class="glass-panel" style="padding:2rem; border-color:var(--fbsu-primary-border);">
        <div style="text-align:center; border-bottom:1px dashed var(--border-subtle); padding-bottom:1.25rem; margin-bottom:1.5rem;">
          <img src="./assets/branding/fbsu-logo.png" style="height:38px; margin-bottom:0.5rem;" alt="FBSU" />
          <h4 style="color:var(--text-main); font-weight:800; font-size:1.05rem;">جامعة فهد بن سلطان</h4>
          <span style="font-size:0.75rem; color:var(--fbsu-primary);">فاتورة تصريح المواقف الذكية (Smart Pass Receipt)</span>
        </div>

        <div style="display:flex; justify-content:space-between; padding:0.6rem 0; font-size:0.88rem; color:var(--text-muted);">
          <span>المركبة المسجلة:</span>
          <strong style="color:var(--text-main);" id="ticket-car">${appState.currentUser.car}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; padding:0.6rem 0; font-size:0.88rem; color:var(--text-muted);">
          <span>رقم اللوحة:</span>
          <strong style="color:var(--fbsu-gold); font-family:var(--font-en);" id="ticket-plate">${appState.currentUser.plateLetters} ${appState.currentUser.plateNumbers}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; padding:0.6rem 0; font-size:0.88rem; color:var(--text-muted);">
          <span>الموقف المخصص:</span>
          <strong style="color:var(--status-available);">موقف #02 (كلية الحاسب)</strong>
        </div>
        <div style="display:flex; justify-content:space-between; padding:0.6rem 0; font-size:0.88rem; color:var(--text-muted);">
          <span>فترة الحجز:</span>
          <span id="ticket-hours">3 ساعات (09:00 - 12:00)</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding:0.6rem 0; font-size:0.88rem; color:var(--text-muted);">
          <span>التعرفة الأساسية:</span>
          <span>5.75 ر.س / س</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding:0.6rem 0; font-size:0.88rem; color:var(--text-muted);">
          <span>خصم التبادل المتوقع:</span>
          <span style="color:var(--status-available);">- 5.75 ر.س</span>
        </div>

        <div style="border-top:1px dashed var(--border-subtle); margin-top:0.75rem; padding-top:1rem; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:800; font-size:1.1rem; color:var(--text-main);">الإجمالي المستحق:</span>
          <div style="font-size:1.6rem; font-weight:900; color:var(--fbsu-gold); font-family:var(--font-en);" id="ticket-total-price">11.50 ر.س</div>
        </div>

        <div style="margin-top:1.25rem; font-size:0.75rem; color:var(--text-dim); text-align:center;">
          * متوافق مع نظام الدفع الموحد: مدى، أبل باي، والمحفظة الجامعية.
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// Tab 5: "Share My Spot & Earn"
// ============================================================================
function renderShareTab(isAr) {
  const user = appState.currentUser;

  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('refreshCw', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'بوابة التبادل الذكي' : 'Flex Share Portal'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'شارك موقفك في أوقات البريك واربح رصيداً في محفظتك' : 'Share Your Spot During Breaks & Earn Credits'}</h3>
      <p class="section-subtitle">
        ${isAr
      ? 'الميزة الجوهرية للمشروع: بدل ترك موقفك فارغاً أثناء خروجك في بريك، فعّل وضع المغادرة وسيقوم النظام بتأجيره لزميل يحتاجه ويحوّل الأرباح فوراً لمحفظتك!'
      : 'The core innovation: instead of leaving your spot vacant during long breaks, activate flex share and AI will allocate it to a peer, crediting your wallet immediately!'
    }
      </p>
    </div>

    <div style="max-width:850px; margin:0 auto;" class="glass-panel" style="padding:2.5rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:1.5rem; margin-bottom:2rem;">
        <div>
          <h4 style="font-size:1.25rem; font-weight:800; color:var(--text-main);">
            ${user.name} (${user.role})
          </h4>
          <p style="color:var(--text-muted); font-size:0.85rem; margin-top:0.25rem;">
            ${isAr ? 'الموقف المسجل لك حالياً: ' : 'Your Assigned Spot: '} 
            <strong style="color:var(--fbsu-gold);">موقف رقم #${user.primarySpot || '01'}</strong>
          </p>
        </div>

        <div style="text-align:left;">
          <span style="font-size:0.8rem; color:var(--text-muted);">${isAr ? 'رصيدك الحالي' : 'Current Balance'}</span>
          <div style="font-size:1.6rem; font-weight:800; color:var(--fbsu-gold);">${user.walletBalance.toFixed(2)} ر.س</div>
        </div>
      </div>

      <!-- Break Selector -->
      <div class="form-group">
        <label class="form-label" style="font-size:0.95rem;">
          ${createIcon('clock', { size: 16, color: 'var(--fbsu-primary)' })}
          <span>${isAr ? 'كم مدة البريك المتوقعة التي ستغادر فيها الجامعة؟' : 'Expected Break Duration Outside Campus:'}</span>
        </label>
        <div class="break-hours-grid" id="break-hours-picker">
          <div class="pattern-option" data-hours="1">
            <h5>1 ساعة</h5>
            <span>بريك قصير</span>
          </div>
          <div class="pattern-option" data-hours="2">
            <h5>2 ساعتان</h5>
            <span>بريك متوسط</span>
          </div>
          <div class="pattern-option selected" data-hours="3">
            <h5>3 ساعات</h5>
            <span style="color:var(--fbsu-gold);">نموذج البريك المعتاد</span>
          </div>
          <div class="pattern-option" data-hours="4">
            <h5>4 ساعات</h5>
            <span>بريك طويل</span>
          </div>
        </div>
      </div>

      <!-- Calculation Card -->
      <div style="background:var(--fbsu-gold-light); border:1px solid var(--fbsu-gold-border); border-radius:var(--radius-lg); padding:1.5rem; margin:1.75rem 0;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h5 style="color:var(--fbsu-gold); font-size:1.05rem; font-weight:800; display:flex; align-items:center; gap:0.45rem;">
              ${createIcon('wallet', { size: 18, color: 'var(--fbsu-gold)' })}
              <span>${isAr ? 'العائد المالي المضاف لمحفظتك الجامعية فوراً:' : 'Direct Wallet Cashback Earning:'}</span>
            </h5>
            <p style="color:var(--text-muted); font-size:0.825rem; margin-top:0.35rem;">
              ${isAr ? 'محسوب وفق تعرفة 5.75 ر.س/ساعة مع ضمان توفير الموقف لك فور عودتك بنسبة 100%.' : 'Calculated at standard 5.75 SAR/hr with guaranteed vacancy upon your return.'}
            </p>
          </div>
          <div style="font-size:2rem; font-weight:900; color:var(--fbsu-gold); font-family:var(--font-en);" id="calculated-earn">
            17.25 ر.س
          </div>
        </div>
      </div>

      <!-- Activation CTA -->
      <button class="btn-gold" id="activate-flex-share-btn" style="width:100%; justify-content:center; padding:1rem; font-size:1rem;">
        ${createIcon('refreshCw', { size: 18, color: '#0b1a17' })}
        <span>${isAr ? 'أنا مغادر الآن - إتاحة موقفي للزملاء وإيداع المكافأة' : 'I am Leaving Now - Activate Flex Share & Earn'}</span>
      </button>
    </div>
  `;
}

// ============================================================================
// Tab 6: AI Analytics & University Insights
// ============================================================================
function renderAnalyticsTab(isAr) {
  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('barChart3', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'لوحة تحليلات الذكاء الاصطناعي' : 'AI Analytics'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'مؤشرات الأداء والكفاءة التشغيلية لمواقف الجامعة' : 'FBSU Smart Parking Efficiency & Forecast'}</h3>
      <p class="section-subtitle">
        ${isAr
      ? 'بيانات حية توضح التحسن الناتج عن خوارزمية التبادل الذكي في زيادة السعة الاستيعابية وخفض الازدحام.'
      : 'Real-time metrics demonstrating how AI flex swapping increases capacity and eliminates traffic congestion.'
    }
      </p>
    </div>

    <div class="analytics-kpi-grid">
      <div class="stat-chip" style="padding:1.5rem;">
        <div>
          <div style="font-size:2.2rem; font-weight:800; color:var(--status-available);">+42%</div>
          <div style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0.35rem 0;">زيادة في سعة المواقف الفعلية</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">دون بناء أي خرسانات أو مساحات إضافية</div>
        </div>
      </div>
      <div class="stat-chip" style="padding:1.5rem;">
        <div>
          <div style="font-size:2.2rem; font-weight:800; color:var(--fbsu-gold);">14.2 دقيقة</div>
          <div style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0.35rem 0;">توفير في وقت كل طالب</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">اختفاء ظاهرة الدوران والبحث عن موقف</div>
        </div>
      </div>
      <div class="stat-chip" style="padding:1.5rem;">
        <div>
          <div style="font-size:2.2rem; font-weight:800; color:var(--fbsu-primary);">98.8%</div>
          <div style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0.35rem 0;">مستوى رضا طلاب ودكاترة الجامعة</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">وفق استبيان عمادة شؤون الطلاب بتبوك</div>
        </div>
      </div>
    </div>

    <!-- AI Hourly Heatmap -->
    <div class="glass-panel" style="padding:2rem;">
      <h4 style="font-size:1.1rem; font-weight:800; color:var(--text-main); margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem;">
        ${createIcon('barChart3', { size: 18, color: 'var(--fbsu-primary)' })}
        <span>التوزيع الذكي للطلب على المواقف حسب ساعات الدوام الجامعي (FBSU Daily Peak Hours)</span>
      </h4>

      <div style="display:grid; grid-template-columns:repeat(9, 1fr); gap:0.75rem; text-align:center;">
        ${[
      { time: '08:00', load: 85, color: '#f59e0b', label: 'ذروة 1' },
      { time: '09:00', load: 95, color: '#ef4444', label: 'ذروة قصوى' },
      { time: '10:00', load: 70, color: '#10b981', label: 'فترة خروج البريك' },
      { time: '11:00', load: 90, color: '#ef4444', label: 'محاضرات الظهر' },
      { time: '12:00', load: 80, color: '#f59e0b', label: 'صلاة الظهر' },
      { time: '01:00', load: 65, color: '#10b981', label: 'تبادل المواقف' },
      { time: '02:00', load: 75, color: '#f59e0b', label: 'عودة الطلاب' },
      { time: '03:00', load: 50, color: '#10b981', label: 'هدوء' },
      { time: '04:00', load: 25, color: '#10b981', label: 'نهاية الدوام' },
    ].map(item => `
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1rem 0.5rem;">
            <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:0.5rem;">${item.time}</div>
            <div style="height:120px; display:flex; align-items:flex-end; justify-content:center; margin-bottom:0.5rem;">
              <div style="width:26px; height:${item.load}%; background:${item.color}; border-radius:4px; box-shadow:0 0 10px ${item.color}50; transition:height 1s;"></div>
            </div>
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-main);">${item.load}%</div>
            <div style="font-size:0.7rem; color:${item.color}; font-weight:700; margin-top:0.25rem;">${item.label}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============================================================================
// Footer Component (100% High Contrast & Readable)
// ============================================================================
function renderFooter(isAr) {
  return `
    <footer class="main-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
              <img src="./assets/branding/fbsu-logo.png" style="height:40px;" alt="FBSU Logo" />
              <h4 style="font-size:1.15rem; font-weight:800; color:#ffffff !important;">جامعة فهد بن سلطان</h4>
            </div>
            <p style="font-size:0.85rem; line-height:1.8; color:#e2e8f0 !important; max-width:380px;">
              ${isAr
      ? 'منظومة المواقف الذكية التفاعلية بالذكاء الاصطناعي وإنترنت الأشياء. صُممت خصيصاً لتواكب رؤية المملكة 2030 وتوفر تجربة تنقل أكاديمية فائقة الذكاء لطلاب ومنسوبي الجامعة في تبوك.'
      : 'Intelligent IoT & AI parking management engineered for Fahad Bin Sultan University in Tabuk, aligned with Saudi Vision 2030.'
    }
            </p>
          </div>

          <div>
            <h5 style="color:#ffffff !important; font-weight:800; margin-bottom:1rem;">كليات الجامعة</h5>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.55rem; font-size:0.85rem;">
              <li><a href="https://fbsu.edu.sa/Ar/All/computing-college" target="_blank" style="color:#e2e8f0 !important;">كلية الحاسب الآلي</a></li>
              <li><a href="https://fbsu.edu.sa/Ar/All/engineering-college" target="_blank" style="color:#e2e8f0 !important;">كلية الهندسة</a></li>
              <li><a href="https://fbsu.edu.sa/Ar/All/College-of-Business-and-Management" target="_blank" style="color:#e2e8f0 !important;">كلية الأعمال والإدارة</a></li>
              <li><a href="https://fbsu.edu.sa/Ar/All/College-of-Medicine" target="_blank" style="color:#e2e8f0 !important;">كلية الطب</a></li>
              <li><a href="https://fbsu.edu.sa/Ar/All/College-of-Sciences-and-Humanities" target="_blank" style="color:#e2e8f0 !important;">كلية العلوم والدراسات الإنسانية</a></li>
            </ul>
          </div>

          <div>
            <h5 style="color:#ffffff !important; font-weight:800; margin-bottom:1rem;">روابط المنظومة</h5>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.55rem; font-size:0.85rem;">
              <li><a href="#booking" style="color:#e2e8f0 !important;">حجز تصريح مواقف</a></li>
              <li><a href="#simulator" style="color:#e2e8f0 !important;">محاكاة التبادل الذكي</a></li>
              <li><a href="#wallet" style="color:#e2e8f0 !important;">المحفظة الجامعية والاشتراكات</a></li>
              <li><a href="#gate" style="color:#e2e8f0 !important;">بوابات ALPR والتحقق التلقائي</a></li>
              <li><a href="https://fbsu.edu.sa" target="_blank" style="color:#e2e8f0 !important;">بوابة الجامعة الرسمية</a></li>
            </ul>
          </div>

          <div>
            <h5 style="color:#ffffff !important; font-weight:800; margin-bottom:1rem;">موقع الجامعة والتواصل</h5>
            <p style="font-size:0.85rem; color:#e2e8f0 !important; margin-bottom:0.5rem;">
              طريق الملك خالد، تبوك 47721، المملكة العربية السعودية
            </p>
            <p style="font-size:0.85rem; color:#e2e8f0 !important; margin-bottom:0.5rem;">
              هاتف: +966 14 425 2500
            </p>
            <p style="font-size:0.85rem; color:#e2e8f0 !important;">
              info@fbsu.edu.sa
            </p>
          </div>
        </div>

        <div class="footer-bottom">
          <div>
            © 2026 جميع الحقوق محفوظة - جامعة فهد بن سلطان (FBSU AI Smart Parking System)
          </div>
          <div style="display:flex; gap:1.25rem;">
            <span>سياسة الخصوصية</span>
            <span>الشروط والأحكام</span>
            <span>بوابة الاتصال المؤسسي</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// ============================================================================
// Interactive Modals: Auth (Login & Register), Digital Pass, Spot Info, Wallet
// ============================================================================

// Complete Login & Register Modal
function openAuthModal(initialTab = 'login') {
  soundFX.playClick();
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-overlay open" id="auth-modal-backdrop">
      <div class="modal-content-box" style="max-width:520px;">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div style="text-align:center; margin-bottom:1.5rem;">
          <img src="./assets/branding/fbsu-logo.png" style="height:48px; margin-bottom:0.6rem;" alt="FBSU" />
          <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main);">بوابة الدخول الموحد لجامعة فهد بن سلطان</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">نظام إدارة وتصاريح المواقف الذكية بالذكاء الاصطناعي</p>
        </div>

        <!-- Tab Switcher: Login vs Register -->
        <div class="auth-tab-buttons">
          <button class="auth-tab-btn ${initialTab === 'login' ? 'active' : ''}" id="tab-login-btn">
            ${createIcon('user', { size: 15 })}
            <span>تسجيل الدخول</span>
          </button>
          <button class="auth-tab-btn ${initialTab === 'register' ? 'active' : ''}" id="tab-register-btn">
            ${createIcon('shieldCheck', { size: 15 })}
            <span>إنشاء حساب جديد</span>
          </button>
        </div>

        <!-- Login Form -->
        <div id="login-form-section" style="${initialTab === 'login' ? 'display:block;' : 'display:none;'}">
          <div class="form-group">
            <label class="form-label">الرقم الجامعي / الوظيفي:</label>
            <input type="text" id="login-id" class="form-control" value="20210045" placeholder="مثال: 20210045" />
          </div>

          <div class="form-group">
            <label class="form-label">كلمة المرور:</label>
            <input type="password" id="login-pwd" class="form-control" value="••••••••" placeholder="أدخل كلمة المرور" />
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:var(--text-muted); margin-bottom:1.25rem;">
            <label style="display:flex; align-items:center; gap:0.4rem; cursor:pointer;">
              <input type="checkbox" checked style="accent-color:var(--fbsu-primary);" />
              <span>تذكر بيانات الدخول</span>
            </label>
            <a href="#" style="color:var(--fbsu-gold);">نسيت كلمة المرور؟</a>
          </div>

          <!-- Quick Demo Buttons -->
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.85rem; margin-bottom:1.25rem;">
            <span style="font-size:0.75rem; color:var(--text-dim); display:block; margin-bottom:0.5rem;">دخول سريع بحسابات تجريبية:</span>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.4rem;">
              <button class="zone-btn" style="text-align:center; padding:0.35rem 0.5rem; font-size:0.75rem;" id="quick-login-eyad">
                إياد (هندسة)
              </button>
              <button class="zone-btn" style="text-align:center; padding:0.35rem 0.5rem; font-size:0.75rem;" id="quick-login-rakan">
                راكان (حاسب)
              </button>
              <button class="zone-btn" style="text-align:center; padding:0.35rem 0.5rem; font-size:0.75rem;" id="quick-login-doctor">
                د. الغامدي
              </button>
            </div>
          </div>

          <button class="btn-primary" style="width:100%; justify-content:center; padding:0.95rem; font-size:0.95rem;" id="submit-login-btn">
            ${createIcon('shieldCheck', { size: 18, color: '#ffffff' })}
            <span>تسجيل الدخول (FBSU SSO)</span>
          </button>
        </div>

        <!-- Register Form -->
        <div id="register-form-section" style="${initialTab === 'register' ? 'display:block;' : 'display:none;'}">
          <div class="form-group">
            <label class="form-label">الاسم الثلاثي الكامل:</label>
            <input type="text" id="reg-name" class="form-control" placeholder="مثال: عبد العزيز فهد الشمري" />
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label">الصفة الأكاديمية:</label>
              <select id="reg-role" class="form-control">
                <option value="طالب">طالب جامعي</option>
                <option value="عضو هيئة تدريس">عضو هيئة تدريس (دكتور)</option>
                <option value="موظف إداري">موظف إداري</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">الرقم الجامعي / الوظيفي:</label>
              <input type="text" id="reg-id" class="form-control" placeholder="مثال: 20240192" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">الكلية التابع لها:</label>
            <select id="reg-college" class="form-control">
              <option value="كلية الحاسب الآلي">كلية الحاسب الآلي</option>
              <option value="كلية الهندسة">كلية الهندسة</option>
              <option value="كلية الأعمال والإدارة">كلية الأعمال والإدارة</option>
              <option value="كلية الطب">كلية الطب</option>
              <option value="كلية العلوم والدراسات">كلية العلوم والدراسات الإنسانية</option>
            </select>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label">حروف اللوحة (عربي):</label>
              <input type="text" id="reg-plate-letters" class="form-control" placeholder="مثال: ن ص ر" />
            </div>
            <div class="form-group">
              <label class="form-label">أرقام اللوحة:</label>
              <input type="text" id="reg-plate-numbers" class="form-control" placeholder="مثال: 5020" />
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label">طراز ولون المركبة:</label>
              <input type="text" id="reg-car" class="form-control" placeholder="تويوتا كامري أبيض" />
            </div>
            <div class="form-group">
              <label class="form-label">رقم الجوال:</label>
              <input type="tel" id="reg-phone" class="form-control" placeholder="05XXXXXXXX" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">كلمة المرور:</label>
            <input type="password" id="reg-pwd" class="form-control" placeholder="أنشئ كلمة مرور قوية" />
          </div>

          <button class="btn-gold" style="width:100%; justify-content:center; padding:0.95rem; font-size:0.95rem;" id="submit-register-btn">
            ${createIcon('sparkles', { size: 18, color: '#0b1a17' })}
            <span>إنشاء الحساب وتفعيل تصريح المواقف الذكي</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach auth modal events
  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('auth-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'auth-modal-backdrop') closeModal();
  });

  document.getElementById('tab-login-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    document.getElementById('login-form-section').style.display = 'block';
    document.getElementById('register-form-section').style.display = 'none';
    document.getElementById('tab-login-btn').classList.add('active');
    document.getElementById('tab-register-btn').classList.remove('active');
  });

  document.getElementById('tab-register-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    document.getElementById('login-form-section').style.display = 'none';
    document.getElementById('register-form-section').style.display = 'block';
    document.getElementById('tab-register-btn').classList.add('active');
    document.getElementById('tab-login-btn').classList.remove('active');
  });

  // Quick login presets
  document.getElementById('quick-login-eyad')?.addEventListener('click', () => {
    appState.currentUser = USERS.eyad;
    appState.isLoggedIn = true;
    soundFX.playSuccess();
    closeModal();
    renderApp();
  });

  document.getElementById('quick-login-rakan')?.addEventListener('click', () => {
    appState.currentUser = USERS.rakan;
    appState.isLoggedIn = true;
    soundFX.playSuccess();
    closeModal();
    renderApp();
  });

  document.getElementById('quick-login-doctor')?.addEventListener('click', () => {
    appState.currentUser = USERS.doctor;
    appState.isLoggedIn = true;
    soundFX.playSuccess();
    closeModal();
    renderApp();
  });

  document.getElementById('submit-login-btn')?.addEventListener('click', () => {
    const enteredId = document.getElementById('login-id').value;
    if (enteredId.includes('88') || enteredId.includes('rakan')) {
      appState.currentUser = USERS.rakan;
    } else if (enteredId.includes('FAC') || enteredId.includes('doctor')) {
      appState.currentUser = USERS.doctor;
    } else {
      appState.currentUser = USERS.eyad;
    }
    appState.isLoggedIn = true;
    soundFX.playSuccess();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    closeModal();
    renderApp();
  });

  document.getElementById('submit-register-btn')?.addEventListener('click', () => {
    const name = document.getElementById('reg-name').value || 'طالب جديد';
    const role = document.getElementById('reg-role').value || 'طالب';
    const college = document.getElementById('reg-college').value || 'كلية الحاسب الآلي';
    const id = document.getElementById('reg-id').value || '20249901';
    const letters = document.getElementById('reg-plate-letters').value || 'س ع د';
    const numbers = document.getElementById('reg-plate-numbers').value || '2030';
    const car = document.getElementById('reg-car').value || 'هيونداي إلنترا 2024';

    const newUser = {
      id: id,
      name: name,
      nameEn: name,
      role: `${role} - ${college}`,
      roleEn: `${role} - ${college}`,
      car: car,
      carEn: car,
      plateLetters: letters,
      plateNumbers: numbers,
      walletBalance: 100.00,
      primarySpot: 3,
      schedule: 'أحد / ثلاثاء'
    };

    appState.currentUser = newUser;
    appState.isLoggedIn = true;
    soundFX.playSuccess();
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
    alert(`🎉 تم إنشاء الحساب بنجاح، مرحباً بك يا ${name}! تم تخصيص رصيد ترحيبي 100 ر.س في محفظتك وتفعيل قارئ البوابة لمركبتك.`);
    closeModal();
    renderApp();
  });
}

function openDigitalPassModal(passData) {
  soundFX.playSuccess();
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 }
  });

  const modal = document.getElementById('modal-container');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-overlay open" id="pass-modal-backdrop">
      <div class="modal-content-box" style="max-width:480px; padding:2rem;">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div class="digital-pass-card">
          <div class="pass-header">
            <div>
              <div style="font-size:0.75rem; color:var(--fbsu-gold); font-weight:800;">FBSU SMART PASS</div>
              <h3 style="font-size:1.15rem; font-weight:800; color:#fff;">تصريح دخول المواقف الذكي</h3>
            </div>
            <img src="./assets/branding/fbsu-logo.png" style="height:36px;" alt="FBSU" />
          </div>

          <div style="text-align:center;">
            <div style="font-size:0.85rem; color:var(--text-muted);">الموقف المخصص</div>
            <div style="font-size:2.5rem; font-weight:900; color:var(--fbsu-gold); line-height:1.2;">
              #${String(passData.spotId).padStart(2, '0')}
            </div>
            <span class="badge badge-fbsu">${passData.college}</span>
          </div>

          <div class="pass-qr-box">
            ${getQRSvg('FBSU-PASS-' + passData.spotId + '-' + passData.plate)}
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.825rem; border-top:1px dashed rgba(215,162,55,0.3); padding-top:1rem;">
            <div>
              <span style="color:var(--text-muted); display:block;">المستفيد:</span>
              <strong style="color:#ffffff;">${passData.userName}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">الرقم الجامعي:</span>
              <strong style="color:#ffffff;">${passData.userId}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">لوحة المركبة:</span>
              <strong style="color:var(--fbsu-gold);">${passData.plate}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">الصلاحية:</span>
              <strong style="color:var(--status-available);">${passData.duration}</strong>
            </div>
          </div>

          <div style="margin-top:1.5rem;">
            <button class="btn-primary" style="width:100%; justify-content:center;" id="simulate-gate-open-from-pass-btn">
              ${createIcon('camera', { size: 16, color: '#ffffff' })}
              <span>فتح البوابة الذكية تلقائياً (NFC)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('pass-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'pass-modal-backdrop') closeModal();
  });
  document.getElementById('simulate-gate-open-from-pass-btn')?.addEventListener('click', () => {
    closeModal();
    appState.activeTab = 'gate';
    appState.gateScannedPlate = passData.plate;
    renderApp();
    setTimeout(() => {
      triggerGateScan();
    }, 300);
  });
}

function openSpotModal(spot) {
  soundFX.playClick();
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  const isAvailable = spot.status === 'available';
  const isFlex = spot.status === 'flex-share';

  modal.innerHTML = `
    <div class="modal-overlay open" id="spot-modal-backdrop">
      <div class="modal-content-box">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem;">
          <div>
            <span class="badge badge-gold">قطاع ${spot.zone} - ${spot.college}</span>
            <h3 style="font-size:1.6rem; font-weight:800; color:var(--text-main); margin-top:0.35rem;">
              موقف رقم #${String(spot.id).padStart(2, '0')}
            </h3>
            <span style="font-size:0.85rem; color:var(--text-muted);">المسافة حتى مدخل الكلية: ${spot.distance}</span>
          </div>
          <span class="badge ${spot.status === 'available' ? 'badge-available' : (spot.status === 'flex-share' ? 'badge-flex' : 'badge-occupied')}">
            ${spot.status === 'available' ? 'متاح الآن' : (spot.status === 'flex-share' ? 'تبادل ذكي نشط' : 'مشغول')}
          </span>
        </div>

        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.5rem;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-size:0.9rem;">
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.8rem;">الحالة الحالية:</span>
              <strong style="color:var(--text-main);">${spot.occupant || 'شاغر وجاهز للاستخدام'}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.8rem;">المستشعر الذكي IoT:</span>
              <strong style="color:var(--status-available);">متصل (إشارة ممتازة)</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.8rem;">المركبة الحالية:</span>
              <strong style="color:var(--text-main);">${spot.car || 'لا يوجد'}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.8rem;">الوقت المتبقي:</span>
              <strong style="color:var(--fbsu-gold);">${spot.timeLeft || 'متاح فوري'}</strong>
            </div>
          </div>
        </div>

        ${isAvailable || isFlex ? `
          <div style="display:flex; gap:1rem;">
            <button class="btn-gold" style="flex:1; justify-content:center;" id="quick-book-spot-btn" data-spot-id="${spot.id}">
              ${createIcon('zap', { size: 16, color: '#0b1a17' })}
              <span>احجز هذا الموقف الآن (${isFlex ? 'تعرفة مخفضة 5.75 ر.س' : 'حجز فوري'})</span>
            </button>
          </div>
        ` : `
          <div style="text-align:center; padding:0.5rem; color:var(--text-muted); font-size:0.85rem;">
            هذا الموقف مشغول حالياً وسيتاح تلقائياً فور مغادرة صاحبه أو في وقت البريك القادم.
          </div>
        `}
      </div>
    </div>
  `;

  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('spot-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'spot-modal-backdrop') closeModal();
  });
  document.getElementById('quick-book-spot-btn')?.addEventListener('click', () => {
    closeModal();
    openDigitalPassModal({
      spotId: spot.id,
      college: spot.college,
      userName: appState.currentUser.name,
      userId: appState.currentUser.id,
      plate: `${appState.currentUser.plateLetters} ${appState.currentUser.plateNumbers}`,
      duration: '3 ساعات (09:00 - 12:00)'
    });
  });
}

function openWalletModal() {
  soundFX.playClick();
  const user = appState.currentUser;
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-overlay open" id="wallet-modal-backdrop">
      <div class="modal-content-box" style="max-width:520px;">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.5rem;">
          <div style="width:40px; height:40px; border-radius:var(--radius-md); background:var(--fbsu-gold-light); color:var(--fbsu-gold); display:flex; align-items:center; justify-content:center;">
            ${createIcon('wallet', { size: 20, color: 'var(--fbsu-gold)' })}
          </div>
          <div>
            <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-main);">المحفظة الجامعية الذكية</h3>
            <span style="font-size:0.8rem; color:var(--fbsu-primary);">جامعة فهد بن سلطان - نظام المدفوعات والمكافآت</span>
          </div>
        </div>

        <!-- Balance Card -->
        <div style="background:var(--fbsu-primary-light); border:1px solid var(--fbsu-gold-border); border-radius:var(--radius-lg); padding:1.75rem; margin-bottom:1.5rem;">
          <span style="font-size:0.85rem; color:var(--text-muted);">الرصيد المتاح حالياً</span>
          <div style="font-size:2.5rem; font-weight:900; color:var(--fbsu-gold); margin:0.35rem 0;">
            ${user.walletBalance.toFixed(2)} ر.س
          </div>
          <div style="font-size:0.8rem; color:var(--text-main);">
            المستفيد: <strong>${user.name}</strong> (${user.id})
          </div>
        </div>

        <h5 style="color:var(--text-main); font-weight:800; margin-bottom:0.75rem;">سجل العمليات الأخيرة:</h5>
        <div style="display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1.5rem;">
          <div style="background:rgba(255,255,255,0.03); padding:0.75rem 1rem; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; font-size:0.85rem;">
            <div>
              <strong style="color:var(--status-available);">+ 17.25 ر.س</strong>
              <div style="font-size:0.75rem; color:var(--text-muted);">مكافأة تبادل ذكي (بريك إياد - موقف #01)</div>
            </div>
            <span style="font-size:0.75rem; color:var(--text-dim);">اليوم 10:05 ص</span>
          </div>
          <div style="background:rgba(255,255,255,0.03); padding:0.75rem 1rem; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; font-size:0.85rem;">
            <div>
              <strong style="color:var(--status-occupied);">- 11.50 ر.س</strong>
              <div style="font-size:0.75rem; color:var(--text-muted);">حجز موقف ساعتين (كلية الهندسة)</div>
            </div>
            <span style="font-size:0.75rem; color:var(--text-dim);">أمس 08:30 ص</span>
          </div>
        </div>

        <div style="display:flex; gap:0.75rem;">
          <button class="btn-gold" style="flex:1; justify-content:center;" id="add-wallet-funds-btn">
            ${createIcon('wallet', { size: 16, color: '#0b1a17' })}
            <span>شحن المحفظة (مدى / Apple Pay)</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('wallet-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'wallet-modal-backdrop') closeModal();
  });
  document.getElementById('add-wallet-funds-btn')?.addEventListener('click', () => {
    user.walletBalance += 50.00;
    soundFX.playSuccess();
    closeModal();
    renderApp();
  });
}

function closeModal() {
  const modal = document.getElementById('modal-container');
  if (modal) modal.innerHTML = '';
}

// ============================================================================
// Interactive Listeners
// ============================================================================
function attachEventListeners() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      const tab = e.currentTarget.getAttribute('data-tab');
      if (tab) {
        appState.activeTab = tab;
        renderApp();
      }
    });
  });

  document.getElementById('hero-explore-map-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    appState.activeTab = 'map';
    renderApp();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  });

  document.getElementById('hero-run-sim-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    appState.activeTab = 'simulator';
    renderApp();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  });

  document.getElementById('hero-quick-gate-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    appState.activeTab = 'gate';
    renderApp();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  });

  // Auth Button
  document.getElementById('open-auth-btn')?.addEventListener('click', () => {
    openAuthModal('login');
  });

  document.getElementById('open-wallet-btn')?.addEventListener('click', openWalletModal);

  document.getElementById('sound-toggle-btn')?.addEventListener('click', () => {
    soundFX.enabled = !soundFX.enabled;
    if (soundFX.enabled) soundFX.playClick();
    renderApp();
  });

  document.getElementById('lang-toggle-btn')?.addEventListener('click', () => {
    appState.currentLang = appState.currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = appState.currentLang;
    document.documentElement.dir = appState.currentLang === 'ar' ? 'rtl' : 'ltr';
    renderApp();
  });

  document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    document.body.classList.toggle('theme-light');
    renderApp();
  });

  document.querySelectorAll('.zone-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      const zone = e.currentTarget.getAttribute('data-zone');
      appState.activeZoneFilter = zone;
      renderApp();
    });
  });

  document.querySelectorAll('.parking-spot-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const spotId = parseInt(e.currentTarget.getAttribute('data-spot-id'));
      const spot = appState.parkingSpots.find(s => s.id === spotId);
      if (spot) {
        openSpotModal(spot);
      }
    });
  });

  document.querySelectorAll('.sim-step-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      const stepIdx = parseInt(e.currentTarget.getAttribute('data-sim-step'));
      goToSimStep(stepIdx);
    });
  });

  document.getElementById('sim-prev-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    if (appState.simStep > 0) {
      goToSimStep(appState.simStep - 1);
    }
  });

  document.getElementById('sim-next-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    if (appState.simStep < SIMULATOR_STAGES.length - 1) {
      goToSimStep(appState.simStep + 1);
    } else {
      goToSimStep(0);
    }
  });

  document.getElementById('sim-autoplay-btn')?.addEventListener('click', () => {
    toggleSimAutoPlay();
  });

  document.querySelectorAll('.pattern-option[data-plate]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      const plate = e.currentTarget.getAttribute('data-plate');
      appState.gateScannedPlate = plate;
      appState.gateStatus = 'idle';
      appState.gateArmOpen = false;
      renderApp();
    });
  });

  document.getElementById('trigger-scan-btn')?.addEventListener('click', triggerGateScan);

  document.querySelectorAll('#pattern-picker .pattern-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      document.querySelectorAll('#pattern-picker .pattern-option').forEach(el => el.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
    });
  });

  document.querySelectorAll('#tariff-picker .pattern-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      document.querySelectorAll('#tariff-picker .pattern-option').forEach(el => el.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
      const tariff = e.currentTarget.getAttribute('data-tariff');
      const timeGroup = document.getElementById('hourly-time-group');
      const totalEl = document.getElementById('ticket-total-price');
      if (tariff === 'hourly') {
        if (timeGroup) timeGroup.style.display = 'block';
        if (totalEl) totalEl.textContent = '11.50 ر.س';
      } else if (tariff === 'daily') {
        if (timeGroup) timeGroup.style.display = 'none';
        if (totalEl) totalEl.textContent = '15.00 ر.س';
      } else {
        if (timeGroup) timeGroup.style.display = 'none';
        if (totalEl) totalEl.textContent = '225.00 ر.س*';
      }
    });
  });

  document.getElementById('confirm-booking-btn')?.addEventListener('click', () => {
    const user = appState.currentUser;
    openDigitalPassModal({
      spotId: 2,
      college: 'كلية الحاسب الآلي',
      userName: user.name,
      userId: user.id,
      plate: `${user.plateLetters} ${user.plateNumbers}`,
      duration: 'أحد / ثلاثاء (10:15 - 01:00)'
    });
  });

  document.querySelectorAll('#break-hours-picker .pattern-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      document.querySelectorAll('#break-hours-picker .pattern-option').forEach(el => el.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
      const hours = parseInt(e.currentTarget.getAttribute('data-hours') || '3');
      const earn = (hours * 5.75).toFixed(2);
      const earnEl = document.getElementById('calculated-earn');
      if (earnEl) earnEl.textContent = `${earn} ر.س`;
    });
  });

  document.getElementById('activate-flex-share-btn')?.addEventListener('click', () => {
    soundFX.playSuccess();
    const spot1 = appState.parkingSpots.find(s => s.id === 1);
    if (spot1) {
      spot1.status = 'flex-share';
      spot1.occupant = 'متاح للتبادل الذكي';
      spot1.timeLeft = 'بريك 3 ساعات';
    }
    appState.currentUser.walletBalance += 17.25;
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
    alert('تم تفعيل وضع التبادل الذكي لموقفك بنجاح! موعد عودتك مضمون بنسبة 100%، وتم إيداع 17.25 ر.س في محفظتك الجامعية!');
    renderApp();
  });
}

function goToSimStep(stepIdx) {
  appState.simStep = stepIdx;
  const stage = SIMULATOR_STAGES[stepIdx];

  const spot1 = appState.parkingSpots.find(s => s.id === 1);
  if (spot1) {
    spot1.status = stage.spot1Status;
    spot1.occupant = stage.spot1Occupant;
    spot1.plate = stage.spot1Plate;
  }

  renderApp();
}

function toggleSimAutoPlay() {
  if (appState.simAutoPlaying) {
    clearInterval(appState.simTimer);
    appState.simAutoPlaying = false;
    renderApp();
  } else {
    appState.simAutoPlaying = true;
    renderApp();
    appState.simTimer = setInterval(() => {
      if (appState.simStep < SIMULATOR_STAGES.length - 1) {
        goToSimStep(appState.simStep + 1);
      } else {
        goToSimStep(0);
      }
    }, 4500);
  }
}

function triggerGateScan() {
  soundFX.playScan();
  appState.gateStatus = 'scanning';
  appState.gateArmOpen = false;
  renderApp();

  setTimeout(() => {
    soundFX.playGateOpen();
    appState.gateStatus = 'granted';
    appState.gateArmOpen = true;
    renderApp();

    setTimeout(() => {
      appState.gateArmOpen = false;
      renderApp();
    }, 4000);
  }, 1200);
}

function updateLiveClock() {
  const clockEl = document.getElementById('live-time-clock');
  if (!clockEl) return;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  clockEl.textContent = timeStr;
  setTimeout(updateLiveClock, 1000);
}

// Initial Render
renderApp();
