import React, { useState } from 'react';
import { User, ShieldCheck, Award, Heart, Star, MapPin, Mail, Phone, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { PANDIT_PROFILE, TESTIMONIALS } from '../data/astrologyData';

interface AboutPanditJiProps {
  onOpenBooking: () => void;
}

export const AboutPanditJi: React.FC<AboutPanditJiProps> = ({ onOpenBooking }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "यदि जन्म समय में कुछ मिनटों का अंतर हो, तो क्या सटीक भविष्यवाणी संभव है?",
      a: "हां, यदि आपके पास सटीक जन्म समय नहीं है, तो पंडित संदीप गर्ग 'जन्म समय शोधन' (Birth Time Rectification) तकनीक तथा 'प्रश्न कुंडली' (Horary Astrology) के माध्यम से सूक्ष्म गणना करते हैं, जिससे भूतकाल की मुख्य घटनाओं का मिलान कर सटीक समय निर्धारित किया जाता है।"
    },
    {
      q: "क्या ऑनलाइन (वीडियो/फोन) परामर्श व्यक्तिगत मिलने जितना ही प्रभावी है?",
      a: "निश्चित रूप से। वैदिक ज्योतिष में ग्रहों की गति और जातक की जन्म पत्रिका सार्वभौमिक है। पंडित जी वीडियो कॉल (गूगल मीट) अथवा फोन पर संपूर्ण पत्रिका स्क्रीन पर साझा कर आमने-सामने विस्तार से समझाते हैं और परामर्श के पश्चात रिकॉर्डिंग व सारांश भी उपलब्ध कराते हैं।"
    },
    {
      q: "क्या मुझे महंगे रत्न खरीदना अनिवार्य होगा?",
      a: "कदापि नहीं। पंडित संदीप गर्ग का सिद्धांत है कि सबसे पहले सात्विक मन्त्र जप, ध्यान, स्तोत्र पाठ, दान और जीवनशैली में सकारात्मक परिवर्तन से ग्रहों को शांत किया जाए। रत्न केवल तभी अनुशंसित किया जाता है जब कोई योगकारक ग्रह अनुकूल हो किन्तु अंश बल में कमजोर हो।"
    },
    {
      q: "वास्तु परामर्श के लिए क्या घर या प्रतिष्ठान में तोड़-फोड़ करनी होगी?",
      a: "बिल्कुल नहीं। पंडित जी वैदिक एवं ऊर्जा वास्तु के विशेषज्ञ हैं, जिसमें बिना किसी संरचनात्मक तोड़-फोड़ (No Demolition) के केवल 16 वास्तु क्षेत्रों की ऊर्जा संतुलन, रंग, तांबे की पट्टियां, ऊर्जा पिरामिड और दिशा संशोधन द्वारा दोषों का पूर्ण निवारण किया जाता है।"
    },
    {
      q: "परामर्श के बाद क्या मुझे फॉलो-अप प्रश्न पूछने की सुविधा मिलती है?",
      a: "हां, प्रत्येक सशुल्क परामर्श सत्र के पश्चात 15 दिनों तक आपको व्हाट्सएप अथवा ईमेल के माध्यम से अपने फॉलो-अप प्रश्न पूछने की पूरी सुविधा प्रदान की जाती है।"
    }
  ];

  return (
    <div className="py-12 bg-amber-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card & Bio */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-12 shadow-2xl border border-amber-500/30 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Portrait / Emblem */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-700 p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-stone-900 flex flex-col items-center justify-center p-4 border-2 border-amber-300/40 text-center">
                    <span className="font-cinzel text-5xl text-amber-300 font-bold select-none">ॐ</span>
                    <span className="font-cinzel text-xs text-amber-100 font-semibold mt-2">
                      Pandit Sandeep Garg
                    </span>
                    <span className="text-[10px] text-amber-300/80">Vedic Jyotish Acharya</span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-amber-500 text-stone-950 p-2 rounded-full shadow-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h3 className="font-cinzel text-2xl font-bold text-amber-100">
                  {PANDIT_PROFILE.name}
                </h3>
                <p className="text-xs text-amber-300 font-medium">
                  {PANDIT_PROFILE.title}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2 text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="text-white ml-1 font-bold">4.98 / 5.0</span>
                </div>
              </div>
            </div>

            {/* Bio text */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
                <Award className="w-3.5 h-3.5" />
                <span>18+ Years Gurukul Parampara & Rigvedic Heritage</span>
              </div>

              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-100">
                मार्गदर्शन जो जीवन में प्रकाश और आत्मविश्वास लाए
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Pandit Sandeep Garg is a distinguished Vedic Astrologer, Vastu Visharad, and spiritual counselor with over 18 years of experience. Steeped in the authentic lineage of classical Parashara and Jaimini Jyotish, he has examined more than 24,000 birth charts for entrepreneurs, professionals, civil servants, and families across India, the United States, Canada, Europe, and the Middle East.
              </p>

              <blockquote className="p-4 rounded-2xl bg-stone-900/80 border-l-4 border-amber-400 text-xs italic text-amber-200/90 leading-relaxed">
                "{PANDIT_PROFILE.quote}"
              </blockquote>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                <div className="bg-stone-800/80 p-3 rounded-xl border border-amber-500/20">
                  <span className="block text-stone-400 text-[10px]">Office Locations:</span>
                  <span className="font-semibold text-amber-200">Patiala & New Delhi</span>
                </div>
                <div className="bg-stone-800/80 p-3 rounded-xl border border-amber-500/20">
                  <span className="block text-stone-400 text-[10px]">Languages:</span>
                  <span className="font-semibold text-amber-200">Hindi, Punjabi, English</span>
                </div>
                <div className="bg-stone-800/80 p-3 rounded-xl border border-amber-500/20">
                  <span className="block text-stone-400 text-[10px]">Contact Phone:</span>
                  <span className="font-semibold text-amber-200">{PANDIT_PROFILE.phone}</span>
                </div>
                <div className="bg-stone-800/80 p-3 rounded-xl border border-amber-500/20">
                  <span className="block text-stone-400 text-[10px]">Email:</span>
                  <span className="font-semibold text-amber-200 truncate block">{PANDIT_PROFILE.email}</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onOpenBooking}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm transition shadow-lg cursor-pointer"
                >
                  पंडित संदीप गर्ग के साथ परामर्श अपॉइंटमेंट बुक करें
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Client Testimonials */}
        <div className="mb-14">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="font-cinzel text-2xl font-bold text-stone-900">
              भक्तों एवं जातकों के अनुभव (Client Testimonials)
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Real stories of life transformation, marital clarity, and career elevation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md flex flex-col justify-between hover:border-amber-300 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block">{t.clientName}</span>
                    <span className="text-[11px] text-stone-500">{t.location} • {t.service}</span>
                  </div>
                  <span className="text-[10px] text-stone-400">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-cinzel text-2xl font-bold text-stone-900">
              अक्सर पूछे जाने वाले प्रश्न (Frequently Asked Questions)
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Have inquiries about your horoscope, online consultation, or remedies?
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-stone-900 hover:text-amber-800 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
