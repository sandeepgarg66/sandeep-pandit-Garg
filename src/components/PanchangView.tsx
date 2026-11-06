import React, { useState } from 'react';
import { Moon, Sun, Clock, Calendar, Sparkles, AlertTriangle, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { calculatePanchang } from '../data/astrologyData';
import { PanchangInfo } from '../types';

export const PanchangView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [panchang, setPanchang] = useState<PanchangInfo>(() => calculatePanchang(new Date().toISOString().split('T')[0]));

  const handleDateChange = (newDateStr: string) => {
    setSelectedDate(newDateStr);
    setPanchang(calculatePanchang(newDateStr));
  };

  const stepDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    const updated = current.toISOString().split('T')[0];
    handleDateChange(updated);
  };

  return (
    <div className="py-12 bg-amber-50/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-900 text-xs font-semibold uppercase tracking-wider mb-2">
            <Moon className="w-3.5 h-3.5 text-sky-700" />
            <span>दैनिक काल गणना एवं शुभ मुहूर्त</span>
          </div>
          <h2 className="font-cinzel text-3xl font-bold text-stone-900 tracking-tight">
            दैनिक वैदिक पंचांग (Daily Vedic Panchang)
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Tithi, Nakshatra, Yoga, Karana, Abhijit Muhurat, and Rahu Kaal timings according to traditional Surya Siddhanta principles.
          </p>
        </div>

        {/* Date Selector Navigation Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-200/80 p-4 mb-8 flex flex-wrap items-center justify-between gap-4 max-w-3xl mx-auto">
          <button
            onClick={() => stepDate(-1)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition border border-stone-200 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>पिछला दिन (Previous)</span>
          </button>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-700" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 font-semibold text-stone-800 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-200"
            />
            <button
              onClick={() => handleDateChange(new Date().toISOString().split('T')[0])}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              आज (Today)
            </button>
          </div>

          <button
            onClick={() => stepDate(1)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition border border-stone-200 cursor-pointer"
          >
            <span>अगला दिन (Next)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Panchang Card */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-amber-500/30 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-amber-700/30 pb-6 mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                दिनांक एवं वार (Vedic Calendar)
              </span>
              <h3 className="font-cinzel text-2xl sm:text-4xl font-bold text-amber-100 mt-1">
                {panchang.date}
              </h3>
              <p className="text-sm text-amber-200/80 mt-1 font-medium">
                वार: <span className="text-amber-300 font-semibold">{panchang.vaar}</span>
              </p>
            </div>

            {/* Special Vrat / Festival Badge */}
            {panchang.specialFestival && (
              <div className="bg-amber-600/30 border border-amber-400/40 px-4 py-2.5 rounded-2xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-amber-300/80 font-bold uppercase block">
                    विशेष पर्व / व्रत (Auspicious Observance)
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-amber-100">
                    {panchang.specialFestival}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 5 Core Limbs of Panchang (पञ्च-अङ्ग) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-stone-800/80 p-4 rounded-2xl border border-amber-500/20 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                1. तिथि (Tithi)
              </span>
              <div className="text-base font-bold text-amber-100">{panchang.tithi}</div>
              <div className="text-xs text-stone-400">{panchang.tithiType}</div>
            </div>

            <div className="bg-stone-800/80 p-4 rounded-2xl border border-amber-500/20 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                2. नक्षत्र (Nakshatra)
              </span>
              <div className="text-base font-bold text-amber-100">{panchang.nakshatra}</div>
              <div className="text-xs text-stone-400">Lunar Mansion</div>
            </div>

            <div className="bg-stone-800/80 p-4 rounded-2xl border border-amber-500/20 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                3. योग (Yoga)
              </span>
              <div className="text-base font-bold text-amber-100">{panchang.yoga}</div>
              <div className="text-xs text-stone-400">Solar-Lunar Blend</div>
            </div>

            <div className="bg-stone-800/80 p-4 rounded-2xl border border-amber-500/20 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                4. करण (Karana)
              </span>
              <div className="text-base font-bold text-amber-100">{panchang.karana}</div>
              <div className="text-xs text-stone-400">Half Tithi Interval</div>
            </div>

            <div className="bg-stone-800/80 p-4 rounded-2xl border border-amber-500/20 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                5. वार (Vaar)
              </span>
              <div className="text-base font-bold text-amber-100">{panchang.vaar.split(' ')[0]}</div>
              <div className="text-xs text-stone-400">Day Lord: Surya/Graha</div>
            </div>
          </div>

          {/* Sun & Moon Cycle Times */}
          <div className="mt-8 pt-6 border-t border-amber-700/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center gap-3 bg-stone-950/50 p-3 rounded-xl border border-amber-700/20">
              <Sun className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <span className="text-[11px] text-stone-400 block">सूर्योदय (Sunrise)</span>
                <span className="text-sm font-bold text-amber-200">{panchang.sunrise}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 bg-stone-950/50 p-3 rounded-xl border border-amber-700/20">
              <Sun className="w-5 h-5 text-orange-400" />
              <div className="text-left">
                <span className="text-[11px] text-stone-400 block">सूर्यास्त (Sunset)</span>
                <span className="text-sm font-bold text-amber-200">{panchang.sunset}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 bg-stone-950/50 p-3 rounded-xl border border-amber-700/20">
              <Moon className="w-5 h-5 text-sky-300" />
              <div className="text-left">
                <span className="text-[11px] text-stone-400 block">चन्द्रोदय (Moonrise)</span>
                <span className="text-sm font-bold text-sky-200">{panchang.moonrise}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timings: Auspicious (Shubh) vs Inauspicious (Ashubh) Muhurats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shubh Muhurats */}
          <div className="bg-white rounded-2xl shadow-md border border-emerald-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-stone-900">
                  शुभ मुहूर्त (Auspicious Intervals)
                </h3>
                <p className="text-xs text-stone-500">
                  Ideal for contracts, property registration, travel, and new ventures.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-emerald-950 block">
                    अभिजित मुहूर्त (Abhijit Muhurat)
                  </span>
                  <span className="text-xs text-emerald-800">
                    Highest auspicious midday hour removes all minor doshas
                  </span>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold shadow-sm">
                  {panchang.abhijitMuhurat.split('(')[0]}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-emerald-950 block">
                    अमृत काल (Amrit Kaal)
                  </span>
                  <span className="text-xs text-emerald-800">
                    Nectarine period for prayer, meditation, and medicine intake
                  </span>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold shadow-sm">
                  {panchang.amritKaal}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-emerald-950 block">
                    ब्रह्म मुहूर्त (Brahma Muhurat)
                  </span>
                  <span className="text-xs text-emerald-800">
                    Pre-dawn divine hour for spiritual awakening and memory retention
                  </span>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold shadow-sm">
                  04:38 AM - 05:26 AM
                </span>
              </div>
            </div>
          </div>

          {/* Inauspicious / Varjya Timings */}
          <div className="bg-white rounded-2xl shadow-md border border-rose-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-stone-900">
                  अशुभ काल (Inauspicious / Varjya Periods)
                </h3>
                <p className="text-xs text-stone-500">
                  Avoid initiating brand new agreements or major purchases during these hours.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-rose-950 block">
                    राहु काल (Rahu Kaal)
                  </span>
                  <span className="text-xs text-rose-800">
                    Rahu's afflicted hour; avoid starting journeys or financial signing
                  </span>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-mono text-xs font-bold shadow-sm">
                  {panchang.rahuKaal}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-rose-950 block">
                    यमगण्ड काल (Yamaganda)
                  </span>
                  <span className="text-xs text-rose-800">
                    Associated with Ketu and obstacles in new undertakings
                  </span>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-mono text-xs font-bold shadow-sm">
                  {panchang.yamaganda}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-rose-950 block">
                    गुलिक काल (Gulika Kaal)
                  </span>
                  <span className="text-xs text-rose-800">
                    Saturn's son Gulika influence; causes delayed outcomes
                  </span>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-mono text-xs font-bold shadow-sm">
                  {panchang.gulikaKaal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
