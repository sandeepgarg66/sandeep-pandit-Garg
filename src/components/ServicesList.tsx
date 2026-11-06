import React from 'react';
import { Calendar, Clock, CheckCircle2, Shield, Heart, Sparkles, Compass } from 'lucide-react';
import { SERVICES, PANDIT_PROFILE } from '../data/astrologyData';
import { ServiceItem } from '../types';

interface ServicesListProps {
  onSelectServiceToBook: (serviceId: string) => void;
}

export const ServicesList: React.FC<ServicesListProps> = ({ onSelectServiceToBook }) => {
  return (
    <div className="py-12 bg-amber-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>वैदिक परामर्श एवं अनुष्ठान सेवाएं</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            पंडित संदीप गर्ग द्वारा प्रदत्त सेवाएं (Services)
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Each consultation is personal, Shastra-conforming, and designed to provide actionable solutions for life's pressing dilemmas. Available in Hindi, Punjabi, and English.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-amber-200/90 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-amber-400"
            >
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    {service.duration}
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    Dakshina: <strong className="text-amber-800">{service.recommendedDonation}</strong>
                  </span>
                </div>

                <div>
                  <h3 className="font-cinzel text-lg font-bold text-stone-900 group-hover:text-amber-700 transition">
                    {service.title}
                  </h3>
                  <div className="text-xs font-medium text-amber-700 mt-0.5">
                    {service.hindiTitle}
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {service.description}
                </p>

                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-[11px] text-stone-700">
                  <strong className="text-amber-900 block mb-0.5">आदर्श (Ideal For):</strong>
                  {service.idealFor}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                  <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                    शामिल मुख्य बिंदु (Included):
                  </div>
                  {service.includedPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectServiceToBook(service.id)}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>यह परामर्श बुक करें (Book This Session)</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Anushthan & Gotra Query Banner */}
        <div className="mt-14 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-8 sm:p-10 border border-amber-500/30 shadow-xl flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-200">
              Need a Customized Gotra Puja or International Home Vastu?
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/75 leading-relaxed">
              Pandit Sandeep Garg regularly conducts live virtual Havans and remote blueprint audits for devotees worldwide across USA, Canada, UK, Australia, and UAE.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${PANDIT_PROFILE.phone}`}
              className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-amber-200 rounded-xl font-bold text-xs border border-amber-400/30 transition flex items-center gap-2"
            >
              <span>{PANDIT_PROFILE.phone}</span>
            </a>
            <button
              onClick={() => onSelectServiceToBook('navagraha-shanti-puja')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shadow cursor-pointer"
            >
              विशेष अनुष्ठान संपर्क
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
