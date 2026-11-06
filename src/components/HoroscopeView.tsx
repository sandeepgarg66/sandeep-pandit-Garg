import React, { useState } from 'react';
import { Sparkles, Briefcase, Heart, TrendingUp, Activity, Compass, Shield } from 'lucide-react';
import { RASHIS } from '../data/astrologyData';
import { RashiForecast } from '../types';

export const HoroscopeView: React.FC = () => {
  const [selectedRashi, setSelectedRashi] = useState<RashiForecast>(RASHIS[0]);
  const [timeframe, setTimeframe] = useState<'daily' | 'monthly' | 'yearly'>('daily');

  return (
    <div className="py-12 bg-amber-50/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-900 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>सटीक वैदिक राशिफल</span>
          </div>
          <h2 className="font-cinzel text-3xl font-bold text-stone-900 tracking-tight">
            द्वादश राशि भविष्यफल (12 Zodiac Horoscope)
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Personalized Vedic transits based on Moon sign and Gochara movements of Brihaspati, Shani, and Rahu-Ketu.
          </p>
        </div>

        {/* 12 Rashi Selection Grid / Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mb-8">
          {RASHIS.map((rashi) => {
            const isSelected = selectedRashi.id === rashi.id;
            return (
              <button
                key={rashi.id}
                onClick={() => setSelectedRashi(rashi)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-amber-50/80 text-stone-800 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{rashi.symbol.split(' ')[0]}</span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-amber-700/60 text-amber-100' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {rashi.element.split(' ')[0]}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="font-bold text-sm leading-tight">{rashi.hindiName.split(' ')[0]}</div>
                  <div className={`text-xs ${isSelected ? 'text-amber-100' : 'text-stone-500'}`}>
                    {rashi.englishSign}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Rashi Detail View */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-200/80 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg">
                <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center text-3xl">
                  {selectedRashi.symbol.split(' ')[0]}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-200">
                    {selectedRashi.hindiName}
                  </h3>
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                    {selectedRashi.englishSign}
                  </span>
                </div>
                <p className="text-xs text-amber-100/70 mt-1">
                  स्वामी ग्रह (Lord): <strong className="text-amber-300">{selectedRashi.ruler}</strong> • तत्व (Element): <strong className="text-amber-300">{selectedRashi.element}</strong>
                </p>
              </div>
            </div>

            {/* Timeframe Switcher */}
            <div className="flex bg-stone-800/90 rounded-xl p-1 border border-amber-500/30 text-xs">
              <button
                onClick={() => setTimeframe('daily')}
                className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
                  timeframe === 'daily'
                    ? 'bg-amber-600 text-stone-950 shadow'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                दैनिक (Today)
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
                  timeframe === 'monthly'
                    ? 'bg-amber-600 text-stone-950 shadow'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                मासिक (Month)
              </button>
              <button
                onClick={() => setTimeframe('yearly')}
                className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
                  timeframe === 'yearly'
                    ? 'bg-amber-600 text-stone-950 shadow'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                वार्षिक (2026)
              </button>
            </div>
          </div>

          {/* Forecast Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {timeframe === 'daily' ? (
              <>
                {/* General Overview Card */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-stone-800 text-sm leading-relaxed">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    आज का सामान्य गोचर फल (Daily Transit Overview)
                  </div>
                  <p>{selectedRashi.daily.overview}</p>
                </div>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Career & Business */}
                  <div className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-amber-300 transition shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                      <Briefcase className="w-4 h-4" />
                      <span>करियर एवं व्यवसाय (Career & Profession)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {selectedRashi.daily.career}
                    </p>
                  </div>

                  {/* Love & Marriage */}
                  <div className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-amber-300 transition shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                      <Heart className="w-4 h-4" />
                      <span>प्रेम एवं वैवाहिक जीवन (Love & Relationships)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {selectedRashi.daily.love}
                    </p>
                  </div>

                  {/* Wealth & Finance */}
                  <div className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-amber-300 transition shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>धन एवं संपत्ति (Finance & Investments)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {selectedRashi.daily.finance}
                    </p>
                  </div>

                  {/* Health */}
                  <div className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-amber-300 transition shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-sky-600 font-bold text-sm">
                      <Activity className="w-4 h-4" />
                      <span>स्वास्थ्य एवं ऊर्जा (Health & Wellness)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {selectedRashi.daily.health}
                    </p>
                  </div>
                </div>

                {/* Lucky Matrix */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block">
                      लकी नंबर (Lucky Number)
                    </span>
                    <span className="text-2xl font-cinzel font-bold text-amber-700 mt-1 block">
                      {selectedRashi.daily.luckyNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block">
                      शुभ रंग (Auspicious Color)
                    </span>
                    <span className="text-sm font-bold text-stone-800 mt-1 block">
                      {selectedRashi.daily.luckyColor}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block">
                      मैत्री राशि (Compatible Zodiacs)
                    </span>
                    <span className="text-sm font-bold text-stone-800 mt-1 block">
                      {selectedRashi.daily.compatibility}
                    </span>
                  </div>
                </div>
              </>
            ) : timeframe === 'monthly' ? (
              <div className="p-6 rounded-2xl bg-stone-50 border border-amber-200/80 space-y-4">
                <h4 className="font-cinzel text-lg font-bold text-stone-900">
                  {selectedRashi.hindiName} — इस माह का विशेष राशिफल
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {selectedRashi.monthly}
                </p>
                <div className="text-xs text-amber-900 bg-amber-100/70 p-4 rounded-xl border border-amber-300">
                  <strong>पंडित संदीप गर्ग का विशेष सुझाव:</strong> Maintain disciplined morning meditation and avoid signing irreversible partnership contracts during planetary combustions.
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-stone-50 border border-amber-200/80 space-y-4">
                <h4 className="font-cinzel text-lg font-bold text-stone-900">
                  {selectedRashi.hindiName} — वर्ष 2026 संपूर्ण वार्षिक भविष्यवाणी
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {selectedRashi.yearly}
                </p>
                <div className="text-xs text-amber-900 bg-amber-100/70 p-4 rounded-xl border border-amber-300">
                  <strong>वार्षिक ग्रह गोचर प्रभाव:</strong> Major karmic transitions open up international opportunities, residential stabilization, and spiritual peace.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
