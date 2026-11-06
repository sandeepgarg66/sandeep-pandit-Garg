import React, { useState } from 'react';
import { Calendar, Clock, Video, Phone, MapPin, CheckCircle, Sparkles, X, Shield, ArrowRight, Mail } from 'lucide-react';
import { SERVICES, PANDIT_PROFILE } from '../data/astrologyData';
import { ServiceItem, BookingSubmission } from '../types';

interface ServicesBookingProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  prefilledKundli?: {
    name?: string;
    dob?: string;
    tob?: string;
    pob?: string;
  };
}

export const ServicesBooking: React.FC<ServicesBookingProps> = ({
  isOpen,
  onClose,
  preselectedServiceId,
  prefilledKundli
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem>(() => {
    const found = SERVICES.find(s => s.id === preselectedServiceId);
    return found || SERVICES[0];
  });

  const [clientName, setClientName] = useState(prefilledKundli?.name || '');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [dob, setDob] = useState(prefilledKundli?.dob || '');
  const [tob, setTob] = useState(prefilledKundli?.tob || '');
  const [pob, setPob] = useState(prefilledKundli?.pob || '');
  const [consultationMode, setConsultationMode] = useState<'Video Call' | 'Phone Call' | 'In-Person'>('Video Call');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('11:00 AM - 12:00 PM');
  const [queryTopic, setQueryTopic] = useState('Career & Financial Growth');
  const [specificNotes, setSpecificNotes] = useState('');

  const [bookingConfirmed, setBookingConfirmed] = useState<BookingSubmission | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submission: BookingSubmission = {
      id: `SPG-${Math.floor(100000 + Math.random() * 900000)}`,
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      clientName,
      clientEmail,
      clientPhone,
      dob,
      tob,
      pob,
      consultationMode,
      preferredDate,
      preferredTime,
      queryTopic,
      specificNotes,
      createdAt: new Date().toLocaleString()
    };
    setBookingConfirmed(submission);
  };

  const handleReset = () => {
    setBookingConfirmed(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-white rounded-3xl shadow-2xl border border-amber-300 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Sacred Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-cinzel font-bold text-lg">
              ॐ
            </div>
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-amber-200">
                पंडित संदीप गर्ग व्यक्तिगत परामर्श बुकिंग
              </h3>
              <p className="text-xs text-amber-100/70">
                Direct 1-on-1 Consultation with Pandit Sandeep Garg
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookingConfirmed ? (
          /* Confirmation Receipt */
          <div className="p-8 sm:p-10 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                परामर्श अनुरोध सफलतापूर्वक दर्ज हुआ
              </span>
              <h4 className="font-cinzel text-2xl font-bold text-stone-900">
                धन्यवाद, {bookingConfirmed.clientName}!
              </h4>
              <p className="text-sm text-stone-600 max-w-lg mx-auto">
                Your consultation request has been reserved with Pandit Sandeep Garg. A confirmation copy will be sent to <strong>{bookingConfirmed.clientEmail}</strong>.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-200 text-left max-w-lg mx-auto text-xs sm:text-sm space-y-3 font-medium text-stone-800">
              <div className="flex justify-between border-b border-amber-200/80 pb-2">
                <span className="text-stone-500">बुकिंग संदर्भ (Ref ID):</span>
                <span className="font-mono font-bold text-amber-900">{bookingConfirmed.id}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/80 pb-2">
                <span className="text-stone-500">सेवा (Service):</span>
                <span className="font-bold text-stone-900">{bookingConfirmed.serviceTitle}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/80 pb-2">
                <span className="text-stone-500">माध्यम (Mode):</span>
                <span className="font-semibold text-amber-800">{bookingConfirmed.consultationMode}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/80 pb-2">
                <span className="text-stone-500">दिनांक एवं समय (Slot):</span>
                <span className="font-semibold text-stone-900">
                  {bookingConfirmed.preferredDate} ({bookingConfirmed.preferredTime})
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-500">संपर्क फोन (Phone):</span>
                <span className="font-semibold text-stone-900">{bookingConfirmed.clientPhone}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${PANDIT_PROFILE.email}?subject=Consultation%20Booking%20${bookingConfirmed.id}&body=Hello%20Pandit%20Ji,%0A%0AMy%20Booking%20ID%20is%20${bookingConfirmed.id}.%20I%20have%20scheduled%20a%20${bookingConfirmed.consultationMode}%20for%20${bookingConfirmed.serviceTitle}.%0A%0AClient:%20${bookingConfirmed.clientName}%0APhone:%20${bookingConfirmed.clientPhone}`}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow transition flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>पंडित जी को सीधे ईमेल भेजें (Email Details)</span>
              </a>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold text-xs transition cursor-pointer"
              >
                समाप्त (Close)
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Service Chooser */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                चयनित सेवा (Choose Service) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {SERVICES.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={`p-3 rounded-xl border cursor-pointer transition text-left ${
                      selectedService.id === s.id
                        ? 'border-amber-600 bg-amber-50/80 shadow-sm'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm text-stone-900">{s.title}</div>
                    <div className="text-[11px] text-amber-800 mt-0.5">{s.duration} • {s.recommendedDonation}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consultation Mode */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                परामर्श माध्यम (Mode of Consultation) *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { mode: 'Video Call' as const, label: 'वीडियो कॉल (Google Meet)', icon: Video },
                  { mode: 'Phone Call' as const, label: 'फोन कॉल (Direct Audio)', icon: Phone },
                  { mode: 'In-Person' as const, label: 'व्यक्तिगत (Patiala/Delhi)', icon: MapPin },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = consultationMode === item.mode;
                  return (
                    <button
                      type="button"
                      key={item.mode}
                      onClick={() => setConsultationMode(item.mode)}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition cursor-pointer ${
                        active
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-amber-700' : 'text-stone-400'}`} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client Credentials & Birth Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  आपका नाम (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Amit Sharma"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-amber-600 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ईमेल (Email Address) *
                </label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-amber-600 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  फोन / व्हाट्सएप नंबर (Phone / WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-amber-600 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  परामर्श का मुख्य विषय (Topic) *
                </label>
                <select
                  value={queryTopic}
                  onChange={(e) => setQueryTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-amber-600 text-sm outline-none bg-white"
                >
                  <option value="Career & Financial Growth">करियर एवं आर्थिक स्थिति (Career & Wealth)</option>
                  <option value="Marriage & Relationship">विवाह एवं पारिवारिक सामंजस्य (Marriage & Vivah)</option>
                  <option value="Health & Medical Astrology">स्वास्थ्य एवं मानसिक शांति (Health & Peace)</option>
                  <option value="Vastu & Property">वास्तु दोष एवं गृह निर्माण (Vastu & Property)</option>
                  <option value="Child & Education">संतान एवं उच्च शिक्षा (Child & Studies)</option>
                  <option value="General Kundli & Remedies">सम्पूर्ण जीवन विश्लेषण (Comprehensive)</option>
                </select>
              </div>

              {/* Birth Details */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  जन्म तिथि (Date of Birth) *
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-amber-600 text-sm outline-none"
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
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-amber-600 text-sm outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  जन्म स्थान (City, State, Country) *
                </label>
                <input
                  type="text"
                  required
                  value={pob}
                  onChange={(e) => setPob(e.target.value)}
                  placeholder="e.g. Patiala, Punjab, India"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-amber-600 text-sm outline-none"
                />
              </div>
            </div>

            {/* Preferred Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  वांछित दिनांक (Preferred Date) *
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-amber-600 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  वांछित समय स्लॉट (Preferred Time Slot) *
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-amber-600 text-sm outline-none bg-white"
                >
                  <option value="10:00 AM - 11:00 AM">प्रातः काल: 10:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 12:00 PM">दोपहर पूर्व: 11:00 AM - 12:00 PM</option>
                  <option value="03:00 PM - 04:00 PM">अपराह्न: 03:00 PM - 04:00 PM</option>
                  <option value="05:00 PM - 06:00 PM">सायं काल: 05:00 PM - 06:00 PM</option>
                  <option value="07:00 PM - 08:00 PM">रात्रि काल: 07:00 PM - 08:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                विशिष्ट प्रश्न अथवा समस्या (Specific Questions for Pandit Ji)
              </label>
              <textarea
                rows={2}
                value={specificNotes}
                onChange={(e) => setSpecificNotes(e.target.value)}
                placeholder="Mention any specific challenges, job change timeline, health issues, or family details you wish to discuss..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-amber-600 text-sm outline-none"
              />
            </div>

            <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Your birth details are kept strictly sacred and confidential.</span>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-semibold text-xs cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
                >
                  पुष्टि करें एवं स्लॉट आरक्षित करें (Confirm Booking)
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
