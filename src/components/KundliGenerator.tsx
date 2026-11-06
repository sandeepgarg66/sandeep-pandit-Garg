import React, { useState } from 'react';
import { Compass, Sparkles, AlertCircle, ShieldAlert, CheckCircle, FileText, Download, Calendar } from 'lucide-react';
import { generateKundli } from '../data/astrologyData';
import { KundliChartSVG } from './KundliChartSVG';
import { KundliDetails } from '../types';

interface KundliGeneratorProps {
  onBookWithKundli: (kundli: KundliDetails) => void;
}

export const KundliGenerator: React.FC<KundliGeneratorProps> = ({ onBookWithKundli }) => {
  const [name, setName] = useState('Sandeep Sharma');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('1994-08-18');
  const [tob, setTob] = useState('09:45');
  const [pob, setPob] = useState('Patiala, Punjab');
  const [activeTab, setActiveTab] = useState<'chart' | 'planets' | 'doshas' | 'remedies'>('chart');
  const [kundli, setKundli] = useState<KundliDetails>(() =>
    generateKundli('Sandeep Sharma', 'Male', '1994-08-18', '09:45', 'Patiala, Punjab')
  );
  const [isCalculated, setIsCalculated] = useState(true);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = generateKundli(name, gender, dob, tob, pob);
    setKundli(result);
    setIsCalculated(true);
  };

  return (
    <div className="py-12 bg-amber-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>सटीक जन्म पत्री विश्लेषण</span>
          </div>
          <h2 className="font-cinzel text-3xl font-bold text-stone-900 tracking-tight">
            वैदिक जन्म कुंडली (Vedic Birth Chart)
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Enter your exact birth parameters to calculate your Ascendant (Lagna), planetary positions, Mahadasha cycles, and Dosha reports instantly.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-200/80 p-6 sm:p-8 mb-10">
          <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                नाम (Full Name) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                लिंग (Gender) *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 text-sm outline-none transition bg-white"
              >
                <option value="Male">पुरुष (Male)</option>
                <option value="Female">महिला (Female)</option>
                <option value="Other">अन्य (Other)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                जन्म तिथि (Date of Birth) *
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                जन्म समय (Time of Birth) *
              </label>
              <input
                type="time"
                required
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                जन्म स्थान (Birth City) *
              </label>
              <input
                type="text"
                required
                value={pob}
                onChange={(e) => setPob(e.target.value)}
                placeholder="e.g. Patiala, Delhi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 text-sm outline-none transition"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-5 flex justify-end pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>कुंडली बनाएं (Generate Kundli)</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results Area */}
        {isCalculated && kundli && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Quick Profile Summary Bar */}
            <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-stone-900 text-white p-6 rounded-2xl shadow-xl border border-amber-600/30 flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                  Janam Kundli Report
                </span>
                <h3 className="font-cinzel text-2xl font-bold text-amber-100">
                  {kundli.name}
                </h3>
                <p className="text-xs text-amber-200/80">
                  Born: {kundli.dob} at {kundli.tob} • {kundli.pob}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="bg-stone-800/80 px-3.5 py-2 rounded-xl border border-amber-500/30">
                  <span className="block text-stone-400">लग्न (Lagna):</span>
                  <span className="font-bold text-amber-300 text-sm">{kundli.lagnaRashi}</span>
                </div>
                <div className="bg-stone-800/80 px-3.5 py-2 rounded-xl border border-amber-500/30">
                  <span className="block text-stone-400">चन्द्र राशि (Moon Sign):</span>
                  <span className="font-bold text-amber-300 text-sm">{kundli.moonRashi}</span>
                </div>
                <div className="bg-stone-800/80 px-3.5 py-2 rounded-xl border border-amber-500/30">
                  <span className="block text-stone-400">नक्षत्र (Nakshatra):</span>
                  <span className="font-bold text-amber-300 text-sm">
                    {kundli.nakshatra} (पाद {kundli.nakshatraPada})
                  </span>
                </div>
                <div className="bg-stone-800/80 px-3.5 py-2 rounded-xl border border-amber-500/30">
                  <span className="block text-stone-400">वर्तमान महादशा (Current Dasha):</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {kundli.currentDasha.mahadasha} / {kundli.currentDasha.antardasha}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-200 gap-2 sm:gap-4 overflow-x-auto pb-1 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
                  activeTab === 'chart'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                ☸ लग्न चक्र (Kundli Chart)
              </button>
              <button
                onClick={() => setActiveTab('planets')}
                className={`px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
                  activeTab === 'planets'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                ♃ ग्रह स्थिति (Planetary Positions)
              </button>
              <button
                onClick={() => setActiveTab('doshas')}
                className={`px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
                  activeTab === 'doshas'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                ⚠ दोष विश्लेषण (Dosha Analysis)
              </button>
              <button
                onClick={() => setActiveTab('remedies')}
                className={`px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
                  activeTab === 'remedies'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                ॐ वैदिक उपाय (Custom Remedies)
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'chart' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7">
                  <KundliChartSVG planets={kundli.planets} lagnaRashi={kundli.lagnaRashi} />
                </div>
                <div className="lg:col-span-5 space-y-5">
                  <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-md">
                    <h4 className="font-cinzel text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      कुंडली सारांश (Quick Chart Insights)
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Your Lagna is <strong className="text-amber-800">{kundli.lagnaRashi}</strong>, giving you innate resilience and intellectual adaptability. Your Moon sign is <strong className="text-amber-800">{kundli.moonRashi}</strong> under <strong className="text-amber-800">{kundli.nakshatra}</strong> nakshatra, reflecting an empathetic disposition with sharp intuition.
                    </p>

                    <div className="mt-4 pt-4 border-t border-stone-100 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-stone-50">
                        <span className="text-stone-500">लग्न स्वामी (Lagna Lord):</span>
                        <span className="font-semibold text-stone-800">{kundli.planets[0]?.name.split(' ')[0]}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-50">
                        <span className="text-stone-500">सूर्य राशि (Sun Sign):</span>
                        <span className="font-semibold text-stone-800">{kundli.sunRashi}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-50">
                        <span className="text-stone-500">सक्रिय दशा (Active Dasha):</span>
                        <span className="font-semibold text-amber-700">{kundli.currentDasha.mahadasha} (until {kundli.currentDasha.until})</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => onBookWithKundli(kundli)}
                        className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>इस कुंडली पर पंडित संदीप गर्ग से परामर्श लें</span>
                      </button>
                    </div>
                  </div>

                  {/* Dosha Badges Card */}
                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/80">
                    <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                      दोष सारांश (Dosha Summary)
                    </h5>
                    <div className="space-y-2 text-xs">
                      {kundli.doshas.map((d, i) => (
                        <div key={i} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-amber-200/60">
                          <span className="font-medium text-stone-800">{d.name.split('(')[0]}</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            d.present ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {d.present ? `${d.intensity} Presence` : 'Absent (शुभ)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'planets' && (
              <div className="bg-white rounded-2xl shadow-md border border-stone-200 overflow-hidden">
                <div className="p-5 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-stone-900">
                      नवग्रह स्थिति एवं दृष्टि (Planetary Positions & Dignity)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Accurate degrees and placement across the 12 houses according to Lahiri Ayanamsha.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-stone-100/80 text-stone-600 text-xs uppercase tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="px-4 py-3">ग्रह (Planet)</th>
                        <th className="px-4 py-3">भाव (House)</th>
                        <th className="px-4 py-3">राशि (Rashi)</th>
                        <th className="px-4 py-3">अंश (Degree)</th>
                        <th className="px-4 py-3">गति (Motion)</th>
                        <th className="px-4 py-3">गरिमा (Dignity)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      {kundli.planets.map((p, idx) => (
                        <tr key={idx} className="hover:bg-amber-50/40 transition">
                          <td className="px-4 py-3 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                              {p.symbol}
                            </span>
                            <div>
                              <div className="font-bold text-stone-900">{p.name}</div>
                              <div className="text-[11px] text-stone-500">{p.hindiName}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-amber-700">
                            House {p.house} ({p.house === 1 ? 'Lagna' : p.house === 10 ? 'Karma' : p.house === 7 ? 'Vivah' : p.house === 9 ? 'Bhagya' : p.house})
                          </td>
                          <td className="px-4 py-3 text-stone-800">{p.rashi}</td>
                          <td className="px-4 py-3 text-stone-600 font-mono text-xs">{p.degree}</td>
                          <td className="px-4 py-3">
                            {p.isRetrograde ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                                वक्री (Retrograde)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                मार्गी (Direct)
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                              p.dignity === 'Exalted' ? 'bg-amber-200 text-amber-900 font-bold' :
                              p.dignity === 'Own Sign' ? 'bg-emerald-100 text-emerald-900' :
                              p.dignity === 'Debilitated' ? 'bg-rose-100 text-rose-900' :
                              'bg-stone-100 text-stone-700'
                            }`}>
                              {p.dignity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'doshas' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kundli.doshas.map((dosha, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border transition shadow-sm ${
                      dosha.present
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-emerald-50/50 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {dosha.present ? (
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        )}
                        <h4 className="font-cinzel text-base font-bold text-stone-900">
                          {dosha.name.split('(')[0]}
                        </h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        dosha.present ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                      }`}>
                        {dosha.present ? `${dosha.intensity}` : 'Absent'}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed mb-4">
                      {dosha.description}
                    </p>

                    <div className="pt-3 border-t border-stone-200/60">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-1">
                        सुझाया गया उपाय (Vedic Remedy):
                      </div>
                      <p className="text-xs text-stone-800 bg-white p-3 rounded-xl border border-amber-200">
                        {dosha.remedy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'remedies' && (
              <div className="bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 text-stone-100 p-8 rounded-2xl shadow-xl border border-amber-500/30">
                <div className="max-w-2xl mb-6">
                  <h3 className="font-cinzel text-2xl font-bold text-amber-200">
                    वैदिक सुरक्षा एवं अनुकूलता उपाय (Your Personalised Vedic Remedies)
                  </h3>
                  <p className="text-xs text-amber-100/70 mt-1">
                    Calculated specifically for {kundli.lagnaRashi} Lagna and current {kundli.currentDasha.mahadasha} Mahadasha by Pandit Sandeep Garg.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <div className="bg-stone-800/80 p-4 rounded-xl border border-amber-500/20">
                    <span className="text-[11px] uppercase tracking-wider text-amber-400 block font-semibold">
                      भाग्य रत्न (Lucky Gemstone)
                    </span>
                    <span className="text-base font-bold text-amber-100 mt-1 block">
                      {kundli.remedies.gemstone}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      Wear in ring finger on auspicious hora
                    </span>
                  </div>

                  <div className="bg-stone-800/80 p-4 rounded-xl border border-amber-500/20">
                    <span className="text-[11px] uppercase tracking-wider text-amber-400 block font-semibold">
                      रुद्राक्ष (Rudraksha)
                    </span>
                    <span className="text-base font-bold text-amber-100 mt-1 block">
                      {kundli.remedies.rudraksha}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      Strung in silk thread or red thread
                    </span>
                  </div>

                  <div className="bg-stone-800/80 p-4 rounded-xl border border-amber-500/20">
                    <span className="text-[11px] uppercase tracking-wider text-amber-400 block font-semibold">
                      इष्ट बीज मन्त्र (Beej Mantra)
                    </span>
                    <span className="text-base font-bold text-amber-300 mt-1 block font-cinzel">
                      {kundli.remedies.mantra}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      Chant 108 times daily facing East
                    </span>
                  </div>

                  <div className="bg-stone-800/80 p-4 rounded-xl border border-amber-500/20">
                    <span className="text-[11px] uppercase tracking-wider text-amber-400 block font-semibold">
                      व्रत दिवस (Auspicious Fasting)
                    </span>
                    <span className="text-base font-bold text-amber-100 mt-1 block">
                      {kundli.remedies.fastDay}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      Satvik intake or single fruit meal
                    </span>
                  </div>

                  <div className="bg-stone-800/80 p-4 rounded-xl border border-amber-500/20">
                    <span className="text-[11px] uppercase tracking-wider text-amber-400 block font-semibold">
                      शुभ रंग (Auspicious Color)
                    </span>
                    <span className="text-base font-bold text-amber-100 mt-1 block">
                      {kundli.remedies.color}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      Favors important business meetings
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-800/40 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-amber-200/80 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Always verify gemstone authenticity and weight with Pandit Sandeep Garg before wearing.</span>
                  </div>
                  <button
                    onClick={() => onBookWithKundli(kundli)}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shadow cursor-pointer"
                  >
                    पंडित जी से व्यक्तिगत उपाय परामर्श लें
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
