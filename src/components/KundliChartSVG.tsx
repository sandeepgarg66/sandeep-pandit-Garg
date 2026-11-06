import React, { useState } from 'react';
import { PlanetPosition } from '../types';

interface KundliChartSVGProps {
  planets: PlanetPosition[];
  lagnaRashi: string;
}

export const KundliChartSVG: React.FC<KundliChartSVGProps> = ({ planets, lagnaRashi }) => {
  const [chartType, setChartType] = useState<'north' | 'south'>('north');

  // Group planets by house number (1 through 12)
  const planetsByHouse: Record<number, PlanetPosition[]> = {};
  for (let i = 1; i <= 12; i++) {
    planetsByHouse[i] = [];
  }
  planets.forEach(p => {
    if (planetsByHouse[p.house]) {
      planetsByHouse[p.house].push(p);
    }
  });

  return (
    <div className="bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950 p-6 rounded-2xl border border-amber-600/30 shadow-2xl text-stone-100">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-amber-700/30 pb-3">
        <div>
          <h3 className="font-cinzel text-lg font-bold text-amber-300 flex items-center gap-2">
            <span>☸</span> वैदिक जन्म चक्र (Vedic Lagna Kundli)
          </h3>
          <p className="text-xs text-amber-200/70 mt-0.5">
            Lagna: <span className="font-semibold text-amber-300">{lagnaRashi}</span> • 12 Bhavas (Houses)
          </p>
        </div>
        <div className="flex bg-stone-800/90 rounded-lg p-1 border border-amber-500/20 text-xs">
          <button
            onClick={() => setChartType('north')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              chartType === 'north'
                ? 'bg-amber-600 text-amber-50 shadow-sm'
                : 'text-stone-400 hover:text-amber-200'
            }`}
          >
            उत्तर भारतीय (North Indian)
          </button>
          <button
            onClick={() => setChartType('south')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              chartType === 'south'
                ? 'bg-amber-600 text-amber-50 shadow-sm'
                : 'text-stone-400 hover:text-amber-200'
            }`}
          >
            दक्षिण भारतीय (South Indian)
          </button>
        </div>
      </div>

      {chartType === 'north' ? (
        /* Traditional North Indian Diamond Chart SVG */
        <div className="relative w-full max-w-[480px] mx-auto aspect-square select-none">
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_4px_20px_rgba(217,119,6,0.2)]">
            {/* Background square */}
            <rect x="10" y="10" width="380" height="380" fill="#1c1917" stroke="#b45309" strokeWidth="2.5" rx="8" />
            
            {/* Outer diagonals */}
            <line x1="10" y1="10" x2="390" y2="390" stroke="#b45309" strokeWidth="1.8" />
            <line x1="390" y1="10" x2="10" y2="390" stroke="#b45309" strokeWidth="1.8" />
            
            {/* Inner diamond connecting midpoints */}
            <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke="#b45309" strokeWidth="2" />

            {/* House Numbers & Planets Labels */}
            {/* House 1: Top Diamond (Center Top) */}
            <g transform="translate(200, 110)">
              <text textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">1 (तनु / Lagna)</text>
              <text textAnchor="middle" y="20" fill="#fef3c7" fontSize="11" fontWeight="600">
                {planetsByHouse[1]?.map(p => `${p.symbol} ${p.name.split(' ')[0]}`).join(', ') || '—'}
              </text>
            </g>

            {/* House 2: Top-left triangle */}
            <g transform="translate(100, 65)">
              <text textAnchor="middle" fill="#d97706" fontSize="11">2</text>
              <text textAnchor="middle" y="16" fill="#fef3c7" fontSize="10">
                {planetsByHouse[2]?.map(p => `${p.symbol} ${p.name.split(' ')[0]}`).join(', ') || ''}
              </text>
            </g>

            {/* House 12: Top-right triangle */}
            <g transform="translate(300, 65)">
              <text textAnchor="middle" fill="#d97706" fontSize="11">12</text>
              <text textAnchor="middle" y="16" fill="#fef3c7" fontSize="10">
                {planetsByHouse[12]?.map(p => `${p.symbol} ${p.name.split(' ')[0]}`).join(', ') || ''}
              </text>
            </g>

            {/* House 3: Upper-left corner triangle */}
            <g transform="translate(55, 120)">
              <text textAnchor="middle" fill="#d97706" fontSize="11">3</text>
              <text textAnchor="middle" y="16" fill="#fef3c7" fontSize="10">
                {planetsByHouse[3]?.map(p => `${p.symbol} ${p.name.split(' ')[0]}`).join(', ') || ''}
              </text>
            </g>

            {/* House 4: Left Diamond */}
            <g transform="translate(110, 200)">
              <text textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">4 (सुख)</text>
              <text textAnchor="middle" y="20" fill="#fef3c7" fontSize="11" fontWeight="600">
                {planetsByHouse[4]?.map(p => `${p.symbol} ${p.name.split(' ')[0]}`).join(', ') || '—'}
              </text>
            </g>

            {/* House 5: Lower-left corner triangle */}
            <g transform="translate(55, 280)">
              <text textAnchor="middle" fill="#d97706" fontSize="11">5</text>
              <text textAnchor="middle" y="16" fill="#fef3c7" fontSize="10">
                {planetsByHouse[5]?.map(p => `${p.symbol} ${p.name.split(' ')[0]}`).join(', ') || ''}
              </text>
            </g>

            {/* House 6: Bottom-left triangle */}
            <g transform="translate(100, 335)">
              <text textAnchor="middle" fill="#d97706" fontSize="11">6</text>
              <text textAnchor="middle" y="16" fill="#fef3c7" fontSize="10">
                {planetsByHouse[6]?.map(p => `${p.symbol} ${p.name.split(' ')[0]}`).join(', ') || ''}
              </text>
            </g>

            {/* House 7: Bottom Diamond */}
            <g transform="translate(200, 290)">
              <text textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">7 (जाया / Vivah)</text>
              <text textAnchor="middle" y="20" fill="#fef3c7" fontSize="11" fontWeight="600">
                {planetsByHouse[7]?.map(p => `${p.symbol} ${p.name.split(' ')[0]}`).join(', ') || '—'}
              </text>
            </g>

            {/* House 8: Bottom-right triangle */}
            <g transform="translate(300, 335)">
              <text textAnchor="middle" fill="#d97706" fontSize="11">8</text>
              <text textAnchor="middle" y="16" fill="#fef3c7" fontSize="10">
                {planetsByHouse[8]?.map(p => `${p.symbol} ${p.name.split(' ')[0]}`).join(', ') || ''}
              </text>
            </g>

            {/* House 9: Lower-right corner triangle */}
            <g transform="translate(345, 280)">
              <text textAnchor="middle" fill="#d97706" fontSize="11">9</text>
              <text textAnchor="middle" y="16" fill="#fef3c7" fontSize="10">
                {planetsByHouse[9]?.map(p => `${p.symbol} ${p.name.split(' ')[0]}`).join(', ') || ''}
              </text>
            </g>

            {/* House 10: Right Diamond */}
            <g transform="translate(290, 200)">
              <text textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">10 (कर्म / Karma)</text>
              <text textAnchor="middle" y="20" fill="#fef3c7" fontSize="11" fontWeight="600">
                {planetsByHouse[10]?.map(p => `${p.symbol} ${p.name.split(' ')[0]}`).join(', ') || '—'}
              </text>
            </g>

            {/* House 11: Upper-right corner triangle */}
            <g transform="translate(345, 120)">
              <text textAnchor="middle" fill="#d97706" fontSize="11">11</text>
              <text textAnchor="middle" y="16" fill="#fef3c7" fontSize="10">
                {planetsByHouse[11]?.map(p => `${p.symbol} ${p.name.split(' ')[0]}`).join(', ') || ''}
              </text>
            </g>
          </svg>
        </div>
      ) : (
        /* South Indian Grid Chart */
        <div className="w-full max-w-[480px] mx-auto aspect-square grid grid-cols-4 grid-rows-4 gap-1 p-2 bg-stone-950 rounded-xl border border-amber-600/40">
          {[
            { sign: "Pisces (मीन)", house: 12 },
            { sign: "Aries (मेष)", house: 1 },
            { sign: "Taurus (वृषभ)", house: 2 },
            { sign: "Gemini (मिथुन)", house: 3 },
            { sign: "Aquarius (कुम्भ)", house: 11 },
            null, null,
            { sign: "Cancer (कर्क)", house: 4 },
            { sign: "Capricorn (मकर)", house: 10 },
            null, null,
            { sign: "Leo (सिंह)", house: 5 },
            { sign: "Sagittarius (धनु)", house: 9 },
            { sign: "Scorpio (वृश्चिक)", house: 8 },
            { sign: "Libra (तुला)", house: 7 },
            { sign: "Virgo (कन्या)", house: 6 }
          ].map((cell, idx) => {
            if (!cell) {
              if (idx === 5) {
                return (
                  <div key={idx} className="col-span-2 row-span-2 flex flex-col items-center justify-center p-3 text-center bg-stone-900/60 rounded border border-amber-800/30">
                    <span className="font-cinzel text-amber-400 font-bold text-sm">रासी चक्र</span>
                    <span className="text-xs text-amber-200/70 mt-1">Lagna: {lagnaRashi}</span>
                  </div>
                );
              }
              return null;
            }
            return (
              <div
                key={idx}
                className="p-1.5 bg-stone-900/90 rounded border border-amber-700/30 flex flex-col justify-between overflow-hidden text-[10px]"
              >
                <div className="text-amber-400 font-semibold truncate">{cell.sign.split(' ')[0]}</div>
                <div className="text-amber-100 font-medium my-auto leading-tight truncate">
                  {planetsByHouse[cell.house]?.map(p => p.name.split(' ')[0]).join(', ') || '—'}
                </div>
                <div className="text-[9px] text-stone-500 self-end">H{cell.house}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Planetary glyphs key */}
      <div className="mt-4 pt-3 border-t border-amber-700/20 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-stone-300">
        <span className="text-amber-400/80">संकेत:</span>
        <span>☉ सूर्य (Sun)</span>
        <span>☽ चन्द्र (Moon)</span>
        <span>♂ मंगल (Mars)</span>
        <span>☿ बुध (Mercury)</span>
        <span>♃ गुरु (Jupiter)</span>
        <span>♀ शुक्र (Venus)</span>
        <span>♄ शनि (Saturn)</span>
        <span>☊ राहु (Rahu)</span>
        <span>☋ केतु (Ketu)</span>
      </div>
    </div>
  );
};
