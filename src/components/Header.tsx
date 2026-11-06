import React, { useState } from 'react';
import { Calendar, Compass, Heart, Moon, Phone, Sparkles, BookOpen, User, Menu, X, ShieldCheck } from 'lucide-react';
import { PANDIT_PROFILE } from '../data/astrologyData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'kundli', label: 'जन्म कुंडली (Kundli)', icon: Compass },
    { id: 'milan', label: 'कुंडली मिलान (Match)', icon: Heart },
    { id: 'panchang', label: 'दैनिक पंचांग (Panchang)', icon: Moon },
    { id: 'horoscope', label: 'राशिफल (Horoscope)', icon: Sparkles },
    { id: 'services', label: 'सेवाएं (Services)', icon: Calendar },
    { id: 'remedies', label: 'उपाय व मन्त्र (Remedies)', icon: BookOpen },
    { id: 'about', label: 'पंडित जी परिचय (About)', icon: User },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-amber-600/30 text-stone-100 shadow-xl transition-all">
      {/* Sacred Top Ribbon */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 py-1 px-4 text-center text-xs font-semibold tracking-wider text-amber-100 flex items-center justify-between border-b border-amber-500/30">
        <span className="hidden sm:inline font-cinzel text-amber-200">
          ॥ श्री गणेशाय नमः ॥
        </span>
        <div className="mx-auto flex items-center gap-3 text-[11px] sm:text-xs">
          <span className="flex items-center gap-1 text-amber-100 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            18+ Years Vedic Jyotish Parampara • 24,000+ Kundlis Analyzed
          </span>
          <span className="hidden md:inline text-amber-400/80">|</span>
          <span className="hidden md:inline text-amber-200">
            Patiala (PB) & New Delhi • Online Worldwide
          </span>
        </div>
        <a
          href={`mailto:${PANDIT_PROFILE.email}`}
          className="hidden sm:inline text-amber-200 hover:text-white transition font-medium text-xs underline"
        >
          {PANDIT_PROFILE.email}
        </a>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => handleNavClick('kundli')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-lg group-hover:scale-105 transition">
              <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center border border-amber-400/30">
                <span className="text-2xl text-amber-400 select-none font-cinzel font-bold">ॐ</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-cinzel text-lg sm:text-xl font-bold tracking-tight text-amber-100 group-hover:text-amber-300 transition">
                  {PANDIT_PROFILE.name}
                </h1>
                <span className="hidden lg:inline-block text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Acharya
                </span>
              </div>
              <p className="text-xs text-amber-200/75 truncate max-w-[240px] sm:max-w-md">
                {PANDIT_PROFILE.title}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-600 text-stone-900 font-bold shadow-md'
                      : 'text-stone-300 hover:text-amber-200 hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-900' : 'text-amber-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Button & Contact */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${PANDIT_PROFILE.phone}`}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-stone-800/70 hover:bg-stone-800 rounded-lg border border-amber-500/30 transition"
              title="Direct Phone Consultation"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{PANDIT_PROFILE.phone}</span>
            </a>
            <button
              onClick={onOpenBooking}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-bold rounded-xl group bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <span className="px-3.5 py-2 transition-all ease-in duration-75 bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 font-bold rounded-[10px] group-hover:bg-opacity-0">
                परामर्श बुक करें (Book Now)
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="sm:hidden px-2.5 py-1.5 text-xs font-bold bg-amber-500 text-stone-900 rounded-lg shadow"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-amber-300 hover:bg-stone-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-stone-950/98 border-b border-amber-600/30 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-left transition ${
                    isActive
                      ? 'bg-amber-600 text-stone-950 font-bold'
                      : 'text-stone-300 hover:bg-stone-800/80 hover:text-amber-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-amber-800/30 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 text-center text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl shadow-md transition"
            >
              परामर्श अपॉइंटमेंट बुक करें (Book Consultation)
            </button>
            <div className="flex items-center justify-between px-2 pt-2 text-xs text-amber-300">
              <a href={`tel:${PANDIT_PROFILE.phone}`} className="flex items-center gap-1 hover:underline">
                <Phone className="w-3.5 h-3.5" /> {PANDIT_PROFILE.phone}
              </a>
              <span className="text-stone-500">•</span>
              <a href={`mailto:${PANDIT_PROFILE.email}`} className="truncate hover:underline">
                {PANDIT_PROFILE.email}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
