export interface PlanetPosition {
  name: string;
  hindiName: string;
  symbol: string;
  house: number;
  rashi: string;
  degree: string;
  isRetrograde: boolean;
  dignity: 'Exalted' | 'Own Sign' | 'Friendly' | 'Neutral' | 'Enemy' | 'Debilitated';
}

export interface DoshaReport {
  name: string;
  present: boolean;
  intensity: 'None' | 'Mild' | 'Moderate' | 'High';
  description: string;
  remedy: string;
}

export interface KundliDetails {
  name: string;
  gender: string;
  dob: string;
  tob: string;
  pob: string;
  lagnaRashi: string;
  moonRashi: string;
  sunRashi: string;
  nakshatra: string;
  nakshatraPada: number;
  planets: PlanetPosition[];
  doshas: DoshaReport[];
  currentDasha: {
    mahadasha: string;
    antardasha: string;
    until: string;
  };
  remedies: {
    gemstone: string;
    rudraksha: string;
    mantra: string;
    fastDay: string;
    color: string;
  };
}

export interface RashiForecast {
  id: string;
  name: string;
  hindiName: string;
  englishSign: string;
  ruler: string;
  element: string;
  symbol: string;
  daily: {
    overview: string;
    career: string;
    love: string;
    finance: string;
    health: string;
    luckyNumber: number;
    luckyColor: string;
    compatibility: string;
  };
  monthly: string;
  yearly: string;
}

export interface GunaScore {
  name: string;
  hindiName: string;
  maxPoints: number;
  obtainedPoints: number;
  description: string;
  significance: string;
}

export interface MatchResult {
  totalScore: number;
  maxScore: number;
  verdict: 'Excellent Match' | 'Good Match' | 'Average / Remedy Needed' | 'Incompatible / Not Recommended';
  summary: string;
  gunas: GunaScore[];
  manglikBoy: boolean;
  manglikGirl: boolean;
  nadiDosh: boolean;
  bhakootDosh: boolean;
  remediesRecommended: string[];
}

export interface PanchangInfo {
  date: string;
  tithi: string;
  tithiType: 'Shukla Paksha' | 'Krishna Paksha';
  nakshatra: string;
  yoga: string;
  karana: string;
  vaar: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  rahuKaal: string;
  yamaganda: string;
  gulikaKaal: string;
  abhijitMuhurat: string;
  amritKaal: string;
  specialFestival?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  hindiTitle: string;
  duration: string;
  description: string;
  idealFor: string;
  includedPoints: string[];
  recommendedDonation: string;
}

export interface BookingSubmission {
  id: string;
  serviceId: string;
  serviceTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  dob: string;
  tob: string;
  pob: string;
  consultationMode: 'Video Call' | 'Phone Call' | 'In-Person';
  preferredDate: string;
  preferredTime: string;
  queryTopic: string;
  specificNotes: string;
  createdAt: string;
}
