import React, { useState } from 'react';
import { Heart, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Calendar, ArrowRight } from 'lucide-react';
import { calculateKundliMilan, NAKSHATRAS, RASHIS } from '../data/astrologyData';
import { MatchResult } from '../types';

interface KundliMilanProps {
  onBookMarriageConsult: (boyName: string, girlName: string) => void;
}

export const KundliMilan: React.FC<KundliMilanProps> = ({ onBookMarriageConsult }) => {
  const [boyName, setBoyName] = useState('Rahul Verma');
  const [girlName, setGirlName] = useState('Priyanka Sharma');
  const [boyRashi, setBoyRashi] = useState('Mesh (Aries)');
  const [girlRashi, setGirlRashi] = useState('Singh (Leo)');
  const [boyNakshatra, setBoyNakshatra] = useState(NAKSHATRAS[0]); // Ashwini
  const [girlNakshatra, setGirlNakshatra] = useState(NAKSHATRAS[9]); // Magha

  const [matchResult, setMatchResult] = useState<MatchResult>(() =>
    calculateKundliMilan(
      'Rahul Verma',
      'Priyanka Sharma',
      'Mesh (Aries)',
      'Singh (Leo)',
      NAKSHATRAS[0],
      NAKSHATRAS[9]
    )
  );

  const handleMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateKundliMilan(
      boyName,
      girlName,
      boyRashi,
      girlRashi,
      boyNakshatra,
      girlNakshatra
    );
    setMatchResult(result);
  };

  const getVerdictBadgeColor = (verdict: MatchResult['verdict']) => {
    switch (verdict) {
      case 'Excellent Match':
        return 'bg-emerald-600 text-white';
      case 'Good Match':
        return 'bg-amber-600 text-white';
      case 'Average / Remedy Needed':
        return 'bg-amber-500 text-stone-950';
      case 'Incompatible / Not Recommended':
        return 'bg-rose-600 text-white';
    }
  };

  return (
    <div className="py-12 bg-rose-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-900 text-xs font-semibold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            <span>अष्टकूट 36 गुण मिलान</span>
          </div>
          <h2 className="font-cinzel text-3xl font-bold text-stone-900 tracking-tight">
            कुंडली मिलान (Horoscope Compatibility)
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Classical 36-point Ashtakoot analysis assessing emotional harmony, longevity, family prosperity, and Nadi-Manglik compatibility for lifelong marital bliss.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-rose-200/80 p-6 sm:p-8 mb-10">
          <form onSubmit={handleMatch}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* Center Divider Icon */}
              <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-rose-100 border border-rose-300 items-center justify-center text-rose-600 z-10 shadow-sm">
                <Heart className="w-5 h-5 fill-rose-600" />
              </div>

              {/* Boy's Details */}
              <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-200/60 space-y-4">
                <div className="flex items-center gap-2 border-b border-blue-200/60 pb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    ♂
                  </span>
                  <h3 className="font-cinzel font-bold text-stone-900 text-base">
                    वर विवरण (Groom / Boy Details)
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    वर का नाम (Boy Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={boyName}
                    onChange={(e) => setBoyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm outline-none bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      चन्द्र राशि (Moon Sign) *
                    </label>
                    <select
                      value={boyRashi}
                      onChange={(e) => setBoyRashi(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-blue-600 text-xs sm:text-sm bg-white"
                    >
                      {RASHIS.map((r) => (
                        <option key={r.id} value={r.hindiName}>
                          {r.hindiName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      जन्म नक्षत्र (Birth Nakshatra) *
                    </label>
                    <select
                      value={boyNakshatra}
                      onChange={(e) => setBoyNakshatra(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-blue-600 text-xs sm:text-sm bg-white"
                    >
                      {NAKSHATRAS.map((nak) => (
                        <option key={nak} value={nak}>
                          {nak}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Girl's Details */}
              <div className="p-5 rounded-xl bg-rose-50/50 border border-rose-200/60 space-y-4">
                <div className="flex items-center gap-2 border-b border-rose-200/60 pb-2">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center">
                    ♀
                  </span>
                  <h3 className="font-cinzel font-bold text-stone-900 text-base">
                    कन्या विवरण (Bride / Girl Details)
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    कन्या का नाम (Girl Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={girlName}
                    onChange={(e) => setGirlName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100 text-sm outline-none bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      चन्द्र राशि (Moon Sign) *
                    </label>
                    <select
                      value={girlRashi}
                      onChange={(e) => setGirlRashi(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-rose-600 text-xs sm:text-sm bg-white"
                    >
                      {RASHIS.map((r) => (
                        <option key={r.id} value={r.hindiName}>
                          {r.hindiName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      जन्म नक्षत्र (Birth Nakshatra) *
                    </label>
                    <select
                      value={girlNakshatra}
                      onChange={(e) => setGirlNakshatra(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-rose-600 text-xs sm:text-sm bg-white"
                    >
                      {NAKSHATRAS.map((nak) => (
                        <option key={nak} value={nak}>
                          {nak}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2 text-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>गुण मिलान करें (Calculate 36 Gunas)</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results Card */}
        {matchResult && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Score Banner */}
            <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-rose-500/30 flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${getVerdictBadgeColor(matchResult.verdict)}`}>
                    {matchResult.verdict}
                  </span>
                  <span className="text-xs text-rose-200">
                    {boyName} & {girlName}
                  </span>
                </div>
                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-rose-100">
                  कुल गुण मिलान: <span className="text-amber-300">{matchResult.totalScore}</span> / 36
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {matchResult.summary}
                </p>
              </div>

              {/* Circular Score Badge */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-amber-400/80 bg-stone-900/90 flex flex-col items-center justify-center p-2 text-center shadow-inner">
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-cinzel">
                  {matchResult.totalScore}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                  out of 36 points
                </span>
              </div>
            </div>

            {/* Dosha & Compatibility Flags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="block text-xs text-stone-500">वर मांगलिक स्थिति</span>
                  <span className="font-bold text-sm text-stone-800">
                    {matchResult.manglikBoy ? 'मांगलिक (Manglik)' : 'सामान्य (Non-Manglik)'}
                  </span>
                </div>
                <span className={`w-3 h-3 rounded-full ${matchResult.manglikBoy ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="block text-xs text-stone-500">कन्या मांगलिक स्थिति</span>
                  <span className="font-bold text-sm text-stone-800">
                    {matchResult.manglikGirl ? 'मांगलिक (Manglik)' : 'सामान्य (Non-Manglik)'}
                  </span>
                </div>
                <span className={`w-3 h-3 rounded-full ${matchResult.manglikGirl ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="block text-xs text-stone-500">नाड़ी दोष (Nadi Dosh)</span>
                  <span className={`font-bold text-sm ${matchResult.nadiDosh ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {matchResult.nadiDosh ? 'दोष उपस्थित (Present)' : 'दोष मुक्त (Clean)'}
                  </span>
                </div>
                <span className={`w-3 h-3 rounded-full ${matchResult.nadiDosh ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="block text-xs text-stone-500">भकूट दोष (Bhakoot Dosh)</span>
                  <span className={`font-bold text-sm ${matchResult.bhakootDosh ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {matchResult.bhakootDosh ? 'दोष उपस्थित (Present)' : 'दोष मुक्त (Clean)'}
                  </span>
                </div>
                <span className={`w-3 h-3 rounded-full ${matchResult.bhakootDosh ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              </div>
            </div>

            {/* Ashtakoot Guna Table */}
            <div className="bg-white rounded-2xl shadow-md border border-stone-200 overflow-hidden">
              <div className="p-5 bg-stone-50 border-b border-stone-200">
                <h3 className="font-cinzel text-lg font-bold text-stone-900">
                  अष्टकूट गुण तालिका (Detailed 8 Guna Breakdown)
                </h3>
                <p className="text-xs text-stone-500">
                  Each Guna measures distinct psychological, biological, and karmic compatibility dimensions.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-stone-100/70 text-stone-600 uppercase text-xs tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="px-4 py-3">कूट (Guna)</th>
                      <th className="px-4 py-3">महत्व (Dimension)</th>
                      <th className="px-4 py-3 text-center">अधिकतम (Max)</th>
                      <th className="px-4 py-3 text-center">प्राप्तांक (Obtained)</th>
                      <th className="px-4 py-3">प्रभाव (Significance)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {matchResult.gunas.map((g, idx) => (
                      <tr key={idx} className="hover:bg-rose-50/30 transition">
                        <td className="px-4 py-3">
                          <span className="font-bold text-stone-900 block">{g.name}</span>
                          <span className="text-[11px] text-stone-500">{g.hindiName}</span>
                        </td>
                        <td className="px-4 py-3 text-stone-600 text-xs">{g.description}</td>
                        <td className="px-4 py-3 text-center font-bold text-stone-500">{g.maxPoints}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            g.obtainedPoints === g.maxPoints
                              ? 'bg-emerald-100 text-emerald-800'
                              : g.obtainedPoints === 0
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {g.obtainedPoints}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-stone-600 text-xs">{g.significance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Remedies & Astrologer Action Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 p-6 sm:p-8 rounded-2xl shadow-md">
              <h4 className="font-cinzel text-lg font-bold text-amber-950 flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                पंडित जी की वैदिक अनुशंसा एवं उपाय (Pandit Ji's Remedial Recommendations)
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700 mb-6">
                {matchResult.remediesRecommended.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-amber-200 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-amber-900 font-medium">
                  Have questions about dosha cancellation or auspicious wedding dates (Shubh Vivah Muhurat)?
                </p>
                <button
                  onClick={() => onBookMarriageConsult(boyName, girlName)}
                  className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow transition flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>विवाह परामर्श सत्र बुक करें (Book Marriage Consultation)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
