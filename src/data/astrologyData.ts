import {
  RashiForecast,
  PanchangInfo,
  KundliDetails,
  MatchResult,
  ServiceItem,
  PlanetPosition,
  DoshaReport,
  GunaScore
} from '../types';

export const PANDIT_PROFILE = {
  name: "Pandit Sandeep Garg",
  title: "Vedic Astrologer, Vastu & Jyotish Acharya",
  experienceYears: 18,
  email: "sandeepgarg6375494692@gmail.com",
  phone: "+91 63754 94692",
  location: "Patiala, Punjab & New Delhi (Online Worldwide)",
  languages: ["Hindi", "Punjabi", "English", "Sanskrit"],
  lineage: "Traditional Gurukul & Rigvedic Parampara",
  quote: "ज्योतिषं वेदानां चक्षुः — Astrology is the sacred divine eye of the Vedas that reveals life's righteous path (Dharma) and shields from negative karma.",
  stats: [
    { label: "Kundlis Analyzed", value: "24,000+" },
    { label: "Years Experience", value: "18+" },
    { label: "Countries Served", value: "32+" },
    { label: "Client Satisfaction", value: "99.4%" },
  ],
};

export const RASHIS: RashiForecast[] = [
  {
    id: "aries",
    name: "Aries",
    hindiName: "मेष (Mesh)",
    englishSign: "Aries",
    ruler: "Mars (Mangal)",
    element: "Fire (Agni)",
    symbol: "♈ Ram",
    daily: {
      overview: "Mars energizes your 1st house today, giving you tremendous courage to take initiative. New opportunities in professional ventures will yield high rewards.",
      career: "Leadership tasks assigned to you will showcase your strategic vision. Great day to sign business contracts.",
      love: "Open communication with your partner clears minor misunderstandings. Singleness may end soon through an unexpected mutual acquaintance.",
      finance: "Financial inflows look steady. Avoid speculative crypto trades; focus on stable physical assets.",
      health: "High vitality, but stay hydrated and avoid spicy food to keep pitta dosha in check.",
      luckyNumber: 9,
      luckyColor: "Crimson Red & Deep Saffron",
      compatibility: "Leo & Sagittarius"
    },
    monthly: "This month marks a turning point in professional ventures. Jupiter's benevolent drishti on your 10th house rewards persistent efforts with prestige.",
    yearly: "Year 2026 brings spiritual elevation, real estate gains, and domestic peace after Rahu's transition."
  },
  {
    id: "taurus",
    name: "Taurus",
    hindiName: "वृषभ (Vrishabh)",
    englishSign: "Taurus",
    ruler: "Venus (Shukra)",
    element: "Earth (Prithvi)",
    symbol: "♉ Bull",
    daily: {
      overview: "Venus radiates calm and elegance in your financial quadrant. It is an auspicious day for investments, artistic endeavors, and luxury purchases.",
      career: "Creative collaborations bring sudden recognition. Colleagues look up to your composure during tight deadlines.",
      love: "Harmony blossoms in marital relations. A thoughtful surprise gift will delight your beloved.",
      finance: "Outstanding payments may finally get cleared today. Favorable day to buy gold or silver.",
      health: "Throat and vocal care needed. Drink warm herbal infusions with cardamom and honey.",
      luckyNumber: 6,
      luckyColor: "Lotus Pink & Opal White",
      compatibility: "Virgo & Capricorn"
    },
    monthly: "Significant gains through inherited property or long-term stocks. Cultivate patience in family disputes.",
    yearly: "A golden period for marriage, foreign travel, and starting independent family enterprises."
  },
  {
    id: "gemini",
    name: "Gemini",
    hindiName: "मिथुन (Mithun)",
    englishSign: "Gemini",
    ruler: "Mercury (Budh)",
    element: "Air (Vayu)",
    symbol: "♊ Twins",
    daily: {
      overview: "Mercury stimulates your intellect and communication skills. Ideal day for interviews, public speaking, software architecture, and networking.",
      career: "Your sharp intellect cracks a challenging operational bottleneck. Your supervisors will commend your agility.",
      love: "Witty conversations and shared laughter rejuvenate your relationship. An old friend might express deeper feelings.",
      finance: "Short-term investment ideas pay off nicely. Keep bookkeeping accurate to avoid billing confusion.",
      health: "Calm mental restlessness with 15 minutes of Pranayama (Anulom-Vilom).",
      luckyNumber: 5,
      luckyColor: "Emerald Green & Light Turquoise",
      compatibility: "Libra & Aquarius"
    },
    monthly: "Excellent for academic publications, competitive exams, and new technological skill acquisitions.",
    yearly: "Major promotions and overseas business expansion become viable as Saturn blesses your karmic house."
  },
  {
    id: "cancer",
    name: "Cancer",
    hindiName: "कर्क (Kark)",
    englishSign: "Cancer",
    ruler: "Moon (Chandra)",
    element: "Water (Jal)",
    symbol: "♋ Crab",
    daily: {
      overview: "The Moon illuminates your intuition and domestic happiness. Spending meaningful hours with elders and children brings profound peace.",
      career: "Trust your gut feeling on business partnerships. Avoid entering arguments with superiors.",
      love: "Emotional depth in love life brings reassurance. Express your deepest feelings without fear.",
      finance: "Expenses on home renovation or auspicious domestic ceremonies may occur today.",
      health: "Maintain peace of mind. Chanting 'Om Somaya Namah' will balance fluid and emotional cycles.",
      luckyNumber: 2,
      luckyColor: "Pearl White & Silver Cream",
      compatibility: "Scorpio & Pisces"
    },
    monthly: "Emotional clarity and spiritual pilgrimage bring inner bliss. Real estate purchases finalize smoothly.",
    yearly: "Domestic happiness and blessings from mother's lineage. Health requires regular seasonal mindfulness."
  },
  {
    id: "leo",
    name: "Leo",
    hindiName: "सिंह (Singh)",
    englishSign: "Leo",
    ruler: "Sun (Surya)",
    element: "Fire (Agni)",
    symbol: "♌ Lion",
    daily: {
      overview: "Surya Dev shines brightly on your career house. Your presence commands respect in public forums and official government meetings.",
      career: "Huge strides in authority and executive responsibility. High chances of winning bids or promotions.",
      love: "Pride should not come between you and your partner. Practice humble appreciation.",
      finance: "Strong wealth prospects through government or corporate incentives.",
      health: "Spine and cardiovascular health in prime condition. Offer Arghya (water) to rising Sun with Gayatri Mantra.",
      luckyNumber: 1,
      luckyColor: "Royal Gold & Copper Orange",
      compatibility: "Aries & Sagittarius"
    },
    monthly: "A stellar month for prestige, public recognition, political or administrative success.",
    yearly: "Consolidation of wealth, social philanthropy, and mentoring future generations."
  },
  {
    id: "virgo",
    name: "Virgo",
    hindiName: "कन्या (Kanya)",
    englishSign: "Virgo",
    ruler: "Mercury (Budh)",
    element: "Earth (Prithvi)",
    symbol: "♍ Virgin Maiden",
    daily: {
      overview: "Your analytical precision and attention to detail save the day. Favorable for accounting, audits, research, and legal paperwork.",
      career: "Complex datasets or legal contracts get resolved with your keen scrutiny.",
      love: "Support your partner in their professional ambitions; they deeply value your grounded guidance.",
      finance: "Smart budgeting allows you to make a profitable pre-planned asset acquisition.",
      health: "Digestive system requires light, satvik meals. Include ginger tea and cumin water.",
      luckyNumber: 5,
      luckyColor: "Parrot Green & Earth Brown",
      compatibility: "Taurus & Capricorn"
    },
    monthly: "Relief from old debts and victory over hidden competitors in business negotiations.",
    yearly: "Substantial professional mastery, international recognition, and stable property acquisition."
  },
  {
    id: "libra",
    name: "Libra",
    hindiName: "तुला (Tula)",
    englishSign: "Libra",
    ruler: "Venus (Shukra)",
    element: "Air (Vayu)",
    symbol: "♎ Scales",
    daily: {
      overview: "Venus restores balance and diplomacy. Perfect day for resolving longstanding social disputes and organizing cultural gatherings.",
      career: "Negotiations and trade diplomacy succeed effortlessly under your magnetic charm.",
      love: "Romance is in the air. A candlelight dinner or joint outing will deepen marital devotion.",
      finance: "Joint investments and spousal gains are highlighted favorably.",
      health: "Kidneys and lower back need care. Ensure adequate water intake throughout the day.",
      luckyNumber: 7,
      luckyColor: "Pastel Blue & Diamond White",
      compatibility: "Gemini & Aquarius"
    },
    monthly: "Expansion of professional brand. New joint ventures and international clientele flourish.",
    yearly: "Harmonious union, spiritual pilgrimage across sacred rivers, and prosperous family life."
  },
  {
    id: "scorpio",
    name: "Scorpio",
    hindiName: "वृश्चिक (Vrishchik)",
    englishSign: "Scorpio",
    ruler: "Mars & Ketu",
    element: "Water (Jal)",
    symbol: "♏ Scorpion",
    daily: {
      overview: "Deep transformative energy permeates your day. Your capacity for profound occult, scientific, or financial research is at an all-time peak.",
      career: "You uncover crucial data that changes the direction of a major company strategy.",
      love: "Intense loyalty and emotional bonding. Release old grudges and embrace emotional rebirth.",
      finance: "Unexpected financial gains or dividend distributions brighten your day.",
      health: "Immunity is strong. Practice meditation to harness kundalini energy positively.",
      luckyNumber: 9,
      luckyColor: "Deep Maroon & Rust Coral",
      compatibility: "Cancer & Pisces"
    },
    monthly: "Triumph in hidden challenges, inheritance matters resolved, spiritual awakening.",
    yearly: "Unshakable resilience, breakthrough career leap, and acquisition of valuable real estate."
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    hindiName: "धनु (Dhanu)",
    englishSign: "Sagittarius",
    ruler: "Jupiter (Brihaspati / Guru)",
    element: "Fire (Agni)",
    symbol: "♐ Archer / Centaur",
    daily: {
      overview: "Guru's wisdom guides your thoughts. Higher philosophical insights, teacher-student relationships, and travel plans flourish.",
      career: "Mentoring colleagues and advising top management earns you immense goodwill.",
      love: "Mutual spiritual alignment enriches your relationship. Plan a visit to a revered temple together.",
      finance: "Wealth comes through consulting, teaching, or ethical advisory services.",
      health: "Liver and thigh health in good shape. Include turmeric milk in your evening regimen.",
      luckyNumber: 3,
      luckyColor: "Bright Yellow & Haldi Saffron",
      compatibility: "Aries & Leo"
    },
    monthly: "Auspicious blessings from spiritual mentors (Guru Kripa). Education and foreign endeavors succeed.",
    yearly: "Divine grace, birth of child or family expansion, and publication of wisdom/books."
  },
  {
    id: "capricorn",
    name: "Capricorn",
    hindiName: "मकर (Makar)",
    englishSign: "Capricorn",
    ruler: "Saturn (Shani Dev)",
    element: "Earth (Prithvi)",
    symbol: "♑ Sea-Goat",
    daily: {
      overview: "Shani Dev instills discipline and perseverance. Steady, methodical hard work produces undeniable results that silence all critics.",
      career: "Major milestone achieved in long-term engineering, administrative, or corporate projects.",
      love: "Actions speak louder than words today. Being dependable builds lasting trust with your spouse.",
      finance: "Frugal and calculated decisions yield long-term compound security. Avoid rash spending.",
      health: "Joints and knees need gentle stretching. Massage with sesame seed oil before bath.",
      luckyNumber: 8,
      luckyColor: "Navy Blue & Charcoal Gray",
      compatibility: "Taurus & Virgo"
    },
    monthly: "Elevation in civic status. Unshakable foundation laid for the next decade of your enterprise.",
    yearly: "Saturn's hard-earned boons, enduring financial stability, and ancestral property gains."
  },
  {
    id: "aquarius",
    name: "Aquarius",
    hindiName: "कुम्भ (Kumbh)",
    englishSign: "Aquarius",
    ruler: "Saturn & Rahu",
    element: "Air (Vayu)",
    symbol: "♒ Water-Bearer",
    daily: {
      overview: "A day filled with progressive ideas, humanitarian service, and high-tech innovations. Community connections prove very rewarding.",
      career: "Innovative disruption in your domain. Great day to pitch visionary projects to venture capitalists.",
      love: "Cherish intellectual companionship. Respecting individuality creates deeper affection.",
      finance: "Multiple modern income streams begin to yield passive cash flow.",
      health: "Circulation and ankles need movement. Take evening walks in natural fresh air.",
      luckyNumber: 4,
      luckyColor: "Electric Blue & Silver Violet",
      compatibility: "Gemini & Libra"
    },
    monthly: "Social networks open unprecedented doors. Philanthropic works bring soul satisfaction.",
    yearly: "Major tech breakthroughs, global alliances, and emancipation from obsolete restrictions."
  },
  {
    id: "pisces",
    name: "Pisces",
    hindiName: "मीन (Meen)",
    englishSign: "Pisces",
    ruler: "Jupiter (Guru)",
    element: "Water (Jal)",
    symbol: "♓ Two Fishes",
    daily: {
      overview: "Deep compassion and mystical vision guide your actions. Creative arts, devotional singing, and charitable deeds bring immense inner light.",
      career: "Creative solutions and empathetic leadership make your team accomplish miracles.",
      love: "Soulful connection with your life partner. Unconditional love heals old wounds.",
      finance: "Spending on pilgrimage, charity, or spiritual books brings tenfold spiritual merit.",
      health: "Feet and lymphatic system require relaxation. A warm salt foot soak before sleep is miraculous.",
      luckyNumber: 3,
      luckyColor: "Sea Green & Golden Saffron",
      compatibility: "Cancer & Scorpio"
    },
    monthly: "Foreign travel, spiritual retreats, and closure of karmic debts bring radiant tranquility.",
    yearly: "Supreme spiritual awakening, artistic mastery, and divine protection in all travels."
  }
];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

export const SERVICES: ServiceItem[] = [
  {
    id: "janam-kundli-full",
    title: "Complete Janam Kundli & Life Path Reading",
    hindiTitle: "विस्तृत जन्म कुंडली एवं जीवन विश्लेषण",
    duration: "60 Minutes",
    description: "In-depth birth chart analysis covering all 12 bhavas (houses), planetary dashas, Sade Sati, career peaks, marriage timing, and customized Vedic remedies.",
    idealFor: "Anyone seeking total life clarity, career direction, health forewarnings, or major life decisions.",
    includedPoints: [
      "Full 12-house Vedic chart evaluation",
      "Vimshottari Mahadasha & Antardasha timeline",
      "Analysis of Manglik, Kaal Sarp & Pitra Dosha",
      "Exact gemstone, Rudraksha, & Mantra recommendations",
      "PDF Summary & Recording provided after session"
    ],
    recommendedDonation: "₹2,100 / $51"
  },
  {
    id: "kundli-milan-marriage",
    title: "Kundli Milan & Marriage Compatibility (Gun Milan)",
    hindiTitle: "कुंडली मिलान एवं वैवाहिक मार्गदर्शन",
    duration: "45 Minutes",
    description: "Detailed Ashtakoot 36-guna matching for prospective brides and grooms. Complete evaluation of Nadi Dosh, Bhakoot Dosh, Manglik matching, and post-marriage harmony.",
    idealFor: "Couples and families planning marriage or looking for astrological resolution of marital discord.",
    includedPoints: [
      "36-point Ashtakoot Guna matching breakdown",
      "Manglik Dosh presence and exact cancellation checks",
      "Longevity, financial prosperity & progeny compatibility",
      "Remedial pujas and rituals if doshas are present",
      "Auspicious Shubh Vivah Muhurat selection"
    ],
    recommendedDonation: "₹1,500 / $35"
  },
  {
    id: "career-business-jyotish",
    title: "Career, Job Switch & Business Growth Jyotish",
    hindiTitle: "करियर, नौकरी एवं व्यापारिक ज्योतिष",
    duration: "45 Minutes",
    description: "Focused analysis of 10th house (Karma Bhava), 2nd house (Dhana), and 11th house (Labha). Timing for job promotions, business investments, startup launch, or relocation.",
    idealFor: "Professionals experiencing stagnant careers, job loss, or business owners seeking growth.",
    includedPoints: [
      "Favorable industries suited to your ruling grahas",
      "Timing of job changes and salary hikes",
      "Partnership suitability and auspicious business names",
      "Yantra installation guidelines for commercial prosperity",
      "Remedies to overcome workplace competition and rivalry"
    ],
    recommendedDonation: "₹1,800 / $41"
  },
  {
    id: "vastu-shastra-audit",
    title: "Vastu Shastra Consultation (Home / Office / Factory)",
    hindiTitle: "वास्तु शास्त्र निरीक्षण एवं दोष निवारण",
    duration: "60 Minutes",
    description: "Spatial energy audit based on the 16 Vastu zones and Pancha Mahabhutas. Practical remedies without structural demolition to invite wealth, health, and peaceful living.",
    idealFor: "Homeowners, renters, shopkeepers, and factory promoters facing persistent obstacles.",
    includedPoints: [
      "Directional mapping of Brahmasthan, Ishanya (NE), Nairutya (SW)",
      "Main entrance, kitchen, master bedroom, and temple positioning",
      "Remedies using copper wire, pyramids, crystals, and colors",
      "Vastu guidelines for safe placement and cash drawer",
      "Floor plan review over video call"
    ],
    recommendedDonation: "₹3,500 / $75"
  },
  {
    id: "navagraha-shanti-puja",
    title: "Navagraha Shanti & Special Vedic Anushthan",
    hindiTitle: "नवग्रह शांति एवं विशिष्ट वैदिक अनुष्ठान",
    duration: "Personalized",
    description: "Ritualistic Vedic chanting and Havana performed according to classical Shastras to pacify malefic planets (Rahu, Ketu, Shani, Mangal) and activate Raj Yoga.",
    idealFor: "Overcoming severe Sade Sati, Mahadasha transitions, debt recovery, and persistent chronic obstacles.",
    includedPoints: [
      "Sankalp in your Gotra and Nakshatra",
      "Vedic mantras chanted with proper swara intonation",
      "Samidha and herbs sanctified for specific grahas",
      "Live video stream or recorded darshan of the ritual",
      "Sanctified Prashad & Raksha Sutra dispatched to address"
    ],
    recommendedDonation: "₹5,100 / $110"
  },
  {
    id: "gemstone-rudraksha-prescription",
    title: "Authentic Gemstone & Rudraksha Prescription",
    hindiTitle: "रत्न एवं रुद्राक्ष परामर्श",
    duration: "30 Minutes",
    description: "Precise calculation of your Yogakaraka and functional benefic planets to prescribe the single most life-altering natural untreated gemstone and energized Rudraksha.",
    idealFor: "Individuals wanting to amplify luck, mental peace, leadership, or immunity without negative side effects.",
    includedPoints: [
      "Ascertaining safe vs dangerous gemstones for your Lagna",
      "Carat weight, finger, metal (Gold/Silver/Panchdhatu) spec",
      "Auspicious weekday and planetary hora for wearing",
      "Prana Pratishtha mantra energization guide",
      "Guidance on identifying untreated, natural gems"
    ],
    recommendedDonation: "₹1,100 / $25"
  }
];

export const TESTIMONIALS = [
  {
    id: "1",
    clientName: "Rajinder Sharma",
    location: "Chandigarh",
    service: "Career & Business Jyotish",
    rating: 5,
    text: "Pandit Sandeep Garg's analysis of my 10th house was astonishingly accurate. He predicted the exact month my pending export contract would clear. His simple remedy of chanting Surya Gayatri gave me immense confidence.",
    date: "2 weeks ago"
  },
  {
    id: "2",
    clientName: "Meenakshi & Alok Verma",
    location: "Delhi NCR",
    service: "Kundli Milan & Marriage",
    rating: 5,
    text: "Other pandits had panicked our families over a Nadi dosha issue. Pandit Ji calmly explained the planetary degrees and showed how Jupiter's aspect resolved the cancellation. We have been happily married for 3 years now!",
    date: "1 month ago"
  },
  {
    id: "3",
    clientName: "Harpreet Singh Dhillon",
    location: "Toronto, Canada",
    service: "Janam Kundli Reading",
    rating: 5,
    text: "Even across time zones, the video consultation felt personal and profoundly uplifting. Pandit Sandeep Ji has deep mastery over Vimshottari dasha and explained complex Vedic concepts with utmost humility.",
    date: "3 weeks ago"
  },
  {
    id: "4",
    clientName: "Pooja Singhal",
    location: "Jaipur",
    service: "Vastu Shastra & Gemstones",
    rating: 5,
    text: "After implementing his non-demolition Vastu remedies for our showroom entrance, sales picked up within 40 days. His recommended Yellow Sapphire was certified and brought exceptional clarity.",
    date: "2 months ago"
  }
];

// Calculation helper for dynamic daily panchang based on date
export function calculatePanchang(dateString: string): PanchangInfo {
  const d = new Date(dateString || new Date());
  const dayIndex = d.getDay();
  const dayOfMonth = d.getDate();
  const month = d.getMonth();
  
  const vaars = [
    "रविवार (Sunday - Sun)",
    "सोमवार (Monday - Moon)",
    "मंगलवार (Tuesday - Mars)",
    "बुधवार (Wednesday - Mercury)",
    "गुरुवार (Thursday - Jupiter)",
    "शुक्रवार (Friday - Venus)",
    "शनिवार (Saturday - Saturn)"
  ];
  
  const tithis = [
    "Pratipada (प्रतिपदा)", "Dwitiya (द्वितीया)", "Tritiya (तृतीया)", "Chaturthi (चतुर्थी)",
    "Panchami (पंचमी)", "Shashthi (षष्ठी)", "Saptami (सप्तमी)", "Ashtami (अष्टमी)",
    "Navami (नवमी)", "Dashami (दशमी)", "Ekadashi (एकादशी)", "Dwadashi (द्वादशी)",
    "Trayodashi (त्रयोदशी)", "Chaturdashi (चतुर्दशी)", "Purnima / Amavasya"
  ];
  
  const tithiIndex = (dayOfMonth + month * 2) % 15;
  const isShukla = (dayOfMonth + month) % 2 === 0;
  const nakshatraIndex = (dayOfMonth * 3 + month * 5 + dayIndex) % 27;
  const yogas = ["Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
  const yogaIndex = (dayOfMonth + month * 3) % yogas.length;
  
  const karanas = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti (Bhadra)", "Shakuni", "Chatushpada", "Naga", "Kintughna"];
  const karanaIndex = (dayOfMonth * 2 + dayIndex) % karanas.length;

  // Rahu kaal variations by weekday
  const rahuTimes = [
    "04:30 PM - 06:00 PM", // Sun
    "07:30 AM - 09:00 AM", // Mon
    "03:00 PM - 04:30 PM", // Tue
    "12:00 PM - 01:30 PM", // Wed
    "01:30 PM - 03:00 PM", // Thu
    "10:30 AM - 12:00 PM", // Fri
    "09:00 AM - 10:30 AM"  // Sat
  ];

  const yamagandaTimes = [
    "12:00 PM - 01:30 PM",
    "10:30 AM - 12:00 PM",
    "09:00 AM - 10:30 AM",
    "07:30 AM - 09:00 AM",
    "06:00 AM - 07:30 AM",
    "03:00 PM - 04:30 PM",
    "01:30 PM - 03:00 PM"
  ];

  const festivals: Record<number, string> = {
    1: "Auspicious Vinayaka Chaturthi Vrat",
    5: "Skanda Sashti & Guruvar Pujan",
    11: "Pavitra Ekadashi Vrat & Hari Kirtan",
    13: "Pradosh Vrat (Shiva Anushthan)",
    15: "Purnima Satyanarayan Katha / Amavasya Pitru Tarpan"
  };

  return {
    date: d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    tithi: `${tithis[tithiIndex]} (${isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष'})`,
    tithiType: isShukla ? 'Shukla Paksha' : 'Krishna Paksha',
    nakshatra: `${NAKSHATRAS[nakshatraIndex]} (चरण ${((dayOfMonth % 4) + 1)})`,
    yoga: `${yogas[yogaIndex]} योग`,
    karana: `${karanas[karanaIndex]} करण`,
    vaar: vaars[dayIndex],
    sunrise: "06:14 AM",
    sunset: "06:32 PM",
    moonrise: "07:45 PM",
    rahuKaal: rahuTimes[dayIndex],
    yamaganda: yamagandaTimes[dayIndex],
    gulikaKaal: "01:45 PM - 03:15 PM",
    abhijitMuhurat: "11:58 AM - 12:48 PM (अत्यंत शुभ)",
    amritKaal: "02:15 PM - 03:50 PM",
    specialFestival: festivals[tithiIndex] || "Auspicious Nitya Karma & Devi Pujan Day"
  };
}

// Generate realistic, consistent Kundli based on birth inputs
export function generateKundli(
  name: string,
  gender: string,
  dob: string,
  tob: string,
  pob: string
): KundliDetails {
  const d = new Date(dob || '1995-05-15');
  const [hours] = (tob || '10:30').split(':').map(Number);
  const seed = (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + (hours || 10) * 13) % 100000;

  const rashiNames = [
    "Mesh (Aries)", "Vrishabh (Taurus)", "Mithun (Gemini)", "Kark (Cancer)",
    "Singh (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchik (Scorpio)",
    "Dhanu (Sagittarius)", "Makar (Capricorn)", "Kumbh (Aquarius)", "Meen (Pisces)"
  ];

  const lagnaIndex = (Math.floor((hours || 6) / 2) + d.getDate() + d.getMonth()) % 12;
  const moonRashiIndex = (seed * 3 + 7) % 12;
  const sunRashiIndex = d.getMonth() % 12;
  const nakshatraIndex = (seed + moonRashiIndex * 2) % 27;

  // Grahas
  const planets: PlanetPosition[] = [
    {
      name: "Sun (Surya)",
      hindiName: "सूर्य देव",
      symbol: "☉",
      house: ((sunRashiIndex - lagnaIndex + 12) % 12) + 1,
      rashi: rashiNames[sunRashiIndex],
      degree: "14° 28' 11\"",
      isRetrograde: false,
      dignity: sunRashiIndex === 4 ? "Own Sign" : sunRashiIndex === 0 ? "Exalted" : sunRashiIndex === 6 ? "Debilitated" : "Friendly"
    },
    {
      name: "Moon (Chandra)",
      hindiName: "चन्द्र देव",
      symbol: "☽",
      house: ((moonRashiIndex - lagnaIndex + 12) % 12) + 1,
      rashi: rashiNames[moonRashiIndex],
      degree: "22° 10' 45\"",
      isRetrograde: false,
      dignity: moonRashiIndex === 3 ? "Own Sign" : moonRashiIndex === 1 ? "Exalted" : moonRashiIndex === 7 ? "Debilitated" : "Friendly"
    },
    {
      name: "Mars (Mangal)",
      hindiName: "मंगल देव",
      symbol: "♂",
      house: ((lagnaIndex + 3) % 12) + 1,
      rashi: rashiNames[(lagnaIndex + 3) % 12],
      degree: "08° 42' 19\"",
      isRetrograde: seed % 7 === 0,
      dignity: ((lagnaIndex + 3) % 12) === 9 ? "Exalted" : "Friendly"
    },
    {
      name: "Mercury (Budh)",
      hindiName: "बुध देव",
      symbol: "☿",
      house: ((sunRashiIndex - lagnaIndex + 13) % 12) + 1,
      rashi: rashiNames[(sunRashiIndex + 1) % 12],
      degree: "19° 05' 33\"",
      isRetrograde: seed % 3 === 0,
      dignity: "Own Sign"
    },
    {
      name: "Jupiter (Guru)",
      hindiName: "बृहस्पति (गुरु)",
      symbol: "♃",
      house: ((lagnaIndex + 8) % 12) + 1,
      rashi: rashiNames[(lagnaIndex + 8) % 12],
      degree: "27° 19' 04\"",
      isRetrograde: false,
      dignity: "Exalted"
    },
    {
      name: "Venus (Shukra)",
      hindiName: "शुक्र देव",
      symbol: "♀",
      house: ((lagnaIndex + 1) % 12) + 1,
      rashi: rashiNames[(lagnaIndex + 1) % 12],
      degree: "11° 50' 18\"",
      isRetrograde: false,
      dignity: "Own Sign"
    },
    {
      name: "Saturn (Shani)",
      hindiName: "शनि देव",
      symbol: "♄",
      house: ((lagnaIndex + 10) % 12) + 1,
      rashi: rashiNames[(lagnaIndex + 10) % 12],
      degree: "04° 33' 52\"",
      isRetrograde: seed % 4 === 0,
      dignity: "Friendly"
    },
    {
      name: "Rahu",
      hindiName: "राहु (उत्तर नोड)",
      symbol: "☊",
      house: ((lagnaIndex + 5) % 12) + 1,
      rashi: rashiNames[(lagnaIndex + 5) % 12],
      degree: "16° 12' 40\"",
      isRetrograde: true,
      dignity: "Neutral"
    },
    {
      name: "Ketu",
      hindiName: "केतु (दक्षिण नोड)",
      symbol: "☋",
      house: ((lagnaIndex + 11) % 12) + 1,
      rashi: rashiNames[(lagnaIndex + 11) % 12],
      degree: "16° 12' 40\"",
      isRetrograde: true,
      dignity: "Neutral"
    }
  ];

  // Check Mangal dosha: Mars in house 1, 4, 7, 8, 12
  const marsHouse = planets.find(p => p.name.includes("Mars"))?.house || 1;
  const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);

  // Check Kaal Sarp
  const isKaalSarp = seed % 5 === 0;

  // Sade Sati check: Saturn in 12th, 1st, or 2nd from Moon
  const saturnHouse = planets.find(p => p.name.includes("Saturn"))?.house || 1;
  const moonHouse = planets.find(p => p.name.includes("Moon"))?.house || 1;
  const diff = (saturnHouse - moonHouse + 12) % 12;
  const isSadeSati = diff === 11 || diff === 0 || diff === 1;

  const doshas: DoshaReport[] = [
    {
      name: "Manglik Dosha (मांगलिक दोष)",
      present: isManglik,
      intensity: isManglik ? (marsHouse === 7 || marsHouse === 8 ? "Moderate" : "Mild") : "None",
      description: isManglik
        ? `Mars is placed in House ${marsHouse}. May create temperamental friction if unchanneled. Can be balanced through matching with a compatible chart or Hanuman Chalisa recitation.`
        : "No significant Manglik Dosha detected. Mars is favorably placed promoting physical endurance and courage.",
      remedy: isManglik
        ? "Recite Hanuman Chalisa on Tuesdays. Offer red lentils (Masoor dal) to needy persons or observe Mangalwar Vrat."
        : "Continue regular prayers to Lord Hanuman for ongoing vitality."
    },
    {
      name: "Kaal Sarp Yoga (कालसर्प योग)",
      present: isKaalSarp,
      intensity: isKaalSarp ? "Moderate" : "None",
      description: isKaalSarp
        ? "All planets are clustered between Rahu and Ketu axis, creating sudden shifts in career and mental unrest during early youth."
        : "Planetary distribution is free from Kaal Sarp hem. Direct trajectory in life endeavors.",
      remedy: isKaalSarp
        ? "Perform Rudrabhisheka on Mondays with raw milk and water. Chant 'Om Namah Shivaya' 108 times daily."
        : "Regular Lord Shiva darshan maintains divine grace."
    },
    {
      name: "Shani Sade Sati (शनि साढ़े साती)",
      present: isSadeSati,
      intensity: isSadeSati ? "Moderate" : "None",
      description: isSadeSati
        ? `Currently passing through Saturn's transformational 7.5-year cycle (${diff === 11 ? 'Rising Phase' : diff === 0 ? 'Peak Core Phase' : 'Setting Phase'}). Encourages discipline, patience, and elimination of false pride.`
        : "Currently not under Shani Sade Sati. Shani Dev provides steady support for career building.",
      remedy: isSadeSati
        ? "Light a mustard oil lamp (Diya) under a Peepal tree on Saturday evenings. Recite Dashrath Krit Shani Stotram."
        : "Feed birds or stray dogs on Saturdays to earn Saturn's blessings."
    }
  ];

  const dashas = ["Jupiter (Brihaspati)", "Saturn (Shani)", "Mercury (Budh)", "Ketu", "Venus (Shukra)", "Sun (Surya)", "Moon (Chandra)", "Mars (Mangal)", "Rahu"];
  const currentMahadasha = dashas[seed % dashas.length];
  const antardashas = ["Venus", "Sun", "Moon", "Mars", "Jupiter", "Saturn", "Mercury"];
  const currentAntardasha = antardashas[(seed * 2) % antardashas.length];

  const gemstonesByLagna = [
    { gem: "Red Coral (Moonga)", rudraksha: "3 Mukhi Rudraksha", mantra: "ॐ भौमाय नमः", fast: "Tuesday", color: "Red / Saffron" },
    { gem: "Diamond / White Sapphire", rudraksha: "6 Mukhi Rudraksha", mantra: "ॐ शुं शुक्राय नमः", fast: "Friday", color: "White / Pink" },
    { gem: "Emerald (Panna)", rudraksha: "4 Mukhi Rudraksha", mantra: "ॐ बुं बुधाय नमः", fast: "Wednesday", color: "Green" },
    { gem: "Natural Pearl (Moti)", rudraksha: "2 Mukhi Rudraksha", mantra: "ॐ सों सोमाय नमः", fast: "Monday", color: "Milk White" },
    { gem: "Ruby (Manikya)", rudraksha: "1 Mukhi / 12 Mukhi", mantra: "ॐ घृणि सूर्याय नमः", fast: "Sunday", color: "Golden Orange" },
    { gem: "Emerald (Panna)", rudraksha: "4 Mukhi Rudraksha", mantra: "ॐ बुं बुधाय नमः", fast: "Wednesday", color: "Parrot Green" },
    { gem: "White Zircon / Diamond", rudraksha: "6 Mukhi Rudraksha", mantra: "ॐ शुं शुक्राय नमः", fast: "Friday", color: "Sky Blue" },
    { gem: "Red Coral (Moonga)", rudraksha: "3 Mukhi Rudraksha", mantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः", fast: "Tuesday", color: "Deep Red" },
    { gem: "Yellow Sapphire (Pukhraj)", rudraksha: "5 Mukhi Rudraksha", mantra: "ॐ बृं बृहस्पतये नमः", fast: "Thursday", color: "Yellow" },
    { gem: "Blue Sapphire (Neelam) / Amethyst", rudraksha: "7 Mukhi Rudraksha", mantra: "ॐ शं शनैश्चराय नमः", fast: "Saturday", color: "Navy Blue" },
    { gem: "Blue Sapphire / Iolite", rudraksha: "7 Mukhi Rudraksha", mantra: "ॐ शं शनैश्चराय नमः", fast: "Saturday", color: "Black / Blue" },
    { gem: "Yellow Sapphire (Pukhraj)", rudraksha: "5 Mukhi Rudraksha", mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः", fast: "Thursday", color: "Golden Yellow" },
  ];

  const remedy = gemstonesByLagna[lagnaIndex % 12];

  return {
    name: name || "Seeker",
    gender: gender || "Male",
    dob: dob || "1995-05-15",
    tob: tob || "10:30",
    pob: pob || "Patiala, Punjab",
    lagnaRashi: rashiNames[lagnaIndex],
    moonRashi: rashiNames[moonRashiIndex],
    sunRashi: rashiNames[sunRashiIndex],
    nakshatra: NAKSHATRAS[nakshatraIndex],
    nakshatraPada: ((seed % 4) + 1),
    planets,
    doshas,
    currentDasha: {
      mahadasha: currentMahadasha,
      antardasha: currentAntardasha,
      until: `December 2028`
    },
    remedies: {
      gemstone: remedy.gem,
      rudraksha: remedy.rudraksha,
      mantra: remedy.mantra,
      fastDay: remedy.fast,
      color: remedy.color
    }
  };
}

// Ashtakoot Guna Milan Matchmaking Calculator (36 points)
export function calculateKundliMilan(
  boyName: string,
  girlName: string,
  boyRashi: string,
  girlRashi: string,
  boyNakshatra: string,
  girlNakshatra: string
): MatchResult {
  const bIndex = NAKSHATRAS.indexOf(boyNakshatra) >= 0 ? NAKSHATRAS.indexOf(boyNakshatra) : 2;
  const gIndex = NAKSHATRAS.indexOf(girlNakshatra) >= 0 ? NAKSHATRAS.indexOf(girlNakshatra) : 6;
  const hash = (bIndex * 13 + gIndex * 7 + (boyName.length + girlName.length) * 3) % 100;

  // 8 Gunas
  // 1. Varna (1 point): Spiritual compatibility & egos
  const varna = hash % 2 === 0 ? 1 : 1;
  // 2. Vashya (2 points): Dominance & mutual magnetic attraction
  const vashya = (hash % 3 === 0) ? 2 : (hash % 2 === 0 ? 1.5 : 1);
  // 3. Tara (3 points): Destiny, health and longevity
  const tara = (hash % 3 === 0) ? 3 : (hash % 2 === 0 ? 2 : 1.5);
  // 4. Yoni (4 points): Biological and intimate compatibility
  const yoni = ((hash % 4) + 1);
  // 5. Graha Maitri (5 points): Psychological harmony and friendship
  const maitri = ((hash % 3) + 3);
  // 6. Gana (6 points): Temperament (Deva, Manushya, Rakshasa)
  const gana = (bIndex % 3 === gIndex % 3) ? 6 : ((bIndex % 3 === 0 || gIndex % 3 === 0) ? 5 : 1);
  // 7. Bhakoot (7 points): Emotional attachment and family welfare
  const bhakootDosh = (Math.abs(bIndex - gIndex) % 6 === 2) && hash % 3 === 0;
  const bhakoot = bhakootDosh ? 0 : 7;
  // 8. Nadi (8 points): Genetic health, progeny and physiological harmony
  const sameNadi = (bIndex % 3) === (gIndex % 3);
  const nadiDosh = sameNadi && hash % 4 === 0;
  const nadi = nadiDosh ? 0 : 8;

  const totalScore = Math.min(36, Math.max(12, Math.round(varna + vashya + tara + yoni + maitri + gana + bhakoot + nadi)));

  const gunas: GunaScore[] = [
    { name: "Varna", hindiName: "वर्ण (अहं एवं स्वभाव)", maxPoints: 1, obtainedPoints: varna, description: "Spiritual alignment and ego coordination between both souls.", significance: "Ensures mutual mutual respect without dominance." },
    { name: "Vashya", hindiName: "वश्य (पारस्परिक आकर्षण)", maxPoints: 2, obtainedPoints: vashya, description: "Mutual magnetic attraction and control balance.", significance: "Guarantees enduring loyalty." },
    { name: "Tara", hindiName: "तारा (स्वास्थ्य एवं भाग्य)", maxPoints: 3, obtainedPoints: tara, description: "Birth star auspiciousness, physical health and destiny support.", significance: "Aids long and prosperous lifespan." },
    { name: "Yoni", hindiName: "योनि (शारीरिक सामंजस्य)", maxPoints: 4, obtainedPoints: yoni, description: "Intimacy, sexual compatibility and physiological harmony.", significance: "Harmonious marital bedroom bliss." },
    { name: "Graha Maitri", hindiName: "ग्रह मैत्री (मानसिक मित्रता)", maxPoints: 5, obtainedPoints: maitri, description: "Friendship between ruling Moon sign lords.", significance: "Creates best-friend bonding in day-to-day life." },
    { name: "Gana", hindiName: "गण (स्वभाव मिलान)", maxPoints: 6, obtainedPoints: gana, description: "Temperamental traits (Deva, Manushya, Rakshasa).", significance: "Prevents clashing life philosophies." },
    { name: "Bhakoot", hindiName: "भकूट (पारिवारिक समृद्धि)", maxPoints: 7, obtainedPoints: bhakoot, description: "Financial growth, emotional depth and domestic peace.", significance: "Protects against sudden family setbacks." },
    { name: "Nadi", hindiName: "नाड़ी (संतान एवं स्वास्थ्य)", maxPoints: 8, obtainedPoints: nadi, description: "Genetic compatibility and healthy childbearing.", significance: "Highest weighted guna for healthy progeny." }
  ];

  let verdict: MatchResult['verdict'] = 'Good Match';
  let summary = '';

  if (totalScore >= 28) {
    verdict = 'Excellent Match';
    summary = `Auspicous alignment! A score of ${totalScore}/36 indicates supreme celestial harmony. The union promises mutual spiritual elevation, family prosperity, and enduring joy.`;
  } else if (totalScore >= 20) {
    verdict = 'Good Match';
    summary = `Very favorable compatibility! With ${totalScore}/36 points, this marriage is strongly recommended. Minor differences can be effortlessly bridged with mutual understanding.`;
  } else if (totalScore >= 16) {
    verdict = 'Average / Remedy Needed';
    summary = `Score is ${totalScore}/36. While workable, specific remedial measures and consultation with Pandit Sandeep Garg are advised to neutralize subtle astrological friction.`;
  } else {
    verdict = 'Incompatible / Not Recommended';
    summary = `Low score of ${totalScore}/36. Traditional texts urge extreme caution. In-depth individual chart verification is mandatory before proceeding.`;
  }

  const remediesRecommended: string[] = [];
  if (nadiDosh) {
    remediesRecommended.push("Nadi Dosha detected: Perform Mahamrityunjaya Japa (1,25,000 chants) and donate gold / cow (Gau Daan) to a pious Brahmin.");
  }
  if (bhakootDosh) {
    remediesRecommended.push("Bhakoot Dosha remedy: Jointly worship Lord Shiva and Goddess Parvati together every Monday and perform Shiva-Parvati Vivah Puja.");
  }
  if (totalScore < 24) {
    remediesRecommended.push("Perform Navagraha Shanti Havan before the wedding day to invoke all planetary blessings.");
  }
  remediesRecommended.push("Seek Pandit Sandeep Garg's one-on-one Vivah Consultation for individualized muhurat and sankalpa.");

  return {
    totalScore,
    maxScore: 36,
    verdict,
    summary,
    gunas,
    manglikBoy: hash % 3 === 0,
    manglikGirl: hash % 4 === 0,
    nadiDosh,
    bhakootDosh,
    remediesRecommended
  };
}
