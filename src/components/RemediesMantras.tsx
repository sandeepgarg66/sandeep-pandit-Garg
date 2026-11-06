import React, { useState } from 'react';
import { BookOpen, Sparkles, Shield, Heart, Sun, Moon, Flame } from 'lucide-react';

export const RemediesMantras: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'navagraha' | 'shlokas' | 'gemstones' | 'doshas'>('navagraha');

  const navagrahaMantras = [
    {
      graha: "Surya (सूर्य देव - Sun)",
      mantra: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः ॥",
      gayatri: "ॐ आदित्याय विद्महे मार्तण्डाय धीमहि तन्नः सूर्यः प्रचोदयात् ॥",
      purpose: "Boosts immunity, leadership, executive prestige, and removes father-related afflictions.",
      count: "7,000 chants / 108 daily at sunrise",
      gemstone: "Ruby (Manikya) in Gold / Copper"
    },
    {
      graha: "Chandra (चन्द्र देव - Moon)",
      mantra: "ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः ॥",
      gayatri: "ॐ क्षीरपुत्राय विद्महे अमृततत्त्वाय धीमहि तन्नश्चन्द्रः प्रचोदयात् ॥",
      purpose: "Brings emotional serenity, removes anxiety, stabilizes sleep and mother's health.",
      count: "11,000 chants / 108 daily on Mondays",
      gemstone: "Natural Pearl (Moti) in Silver"
    },
    {
      graha: "Mangal (मंगल देव - Mars)",
      mantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः ॥",
      gayatri: "ॐ अङ्गारकाय विद्महे शक्तिहस्ताय धीमहि तन्नो भौमः प्रचोदयात् ॥",
      purpose: "Resolves blood disorders, debt burden, property litigation, and shields from accidents.",
      count: "10,000 chants / 108 daily on Tuesdays",
      gemstone: "Red Coral (Moonga) in Copper / Gold"
    },
    {
      graha: "Budh (बुध देव - Mercury)",
      mantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः ॥",
      gayatri: "ॐ सौम्यरूपाय विद्महे वाणेशाय धीमहि तन्नो सौम्यः प्रचोदयात् ॥",
      purpose: "Sharpens intellect, business acumen, speech clarity, and mathematical memory.",
      count: "9,000 chants / 108 daily on Wednesdays",
      gemstone: "Emerald (Panna) in Bronze / Gold"
    },
    {
      graha: "Guru (बृहस्पति - Jupiter)",
      mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः ॥",
      gayatri: "ॐ वृषभध्वजाय विद्महे कृणीहस्ताय धीमहि तन्नो गुरुः प्रचोदयात् ॥",
      purpose: "Expands wisdom, higher spiritual learning, child prosperity, and moral righteousness.",
      count: "19,000 chants / 108 daily on Thursdays",
      gemstone: "Yellow Sapphire (Pukhraj) in Gold"
    },
    {
      graha: "Shukra (शुक्र देव - Venus)",
      mantra: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः ॥",
      gayatri: "ॐ भृगुपुत्राय विद्महे दिव्यदेहाय धीमहि तन्नः शुक्रः प्रचोदयात् ॥",
      purpose: "Elevates artistic creativity, marital romance, vehicle acquisition, and luxury.",
      count: "16,000 chants / 108 daily on Fridays",
      gemstone: "Diamond / White Sapphire in Silver / Platinum"
    },
    {
      graha: "Shani (शनि देव - Saturn)",
      mantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः ॥",
      gayatri: "ॐ सूर्यपुत्राय विद्महे मृत्युरूपाय धीमहि तन्नः सौरिः प्रचोदयात् ॥",
      purpose: "Neutralizes Sade Sati, teaches endurance, grants sudden legacy and long lifespan.",
      count: "23,000 chants / 108 daily on Saturdays",
      gemstone: "Blue Sapphire (Neelam) in Iron / Panchdhatu"
    },
    {
      graha: "Rahu (राहु देव - North Node)",
      mantra: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः ॥",
      gayatri: "ॐ नागाधिपाय विद्महे पद्मनेत्राय धीमहि तन्नो राहुः प्रचोदयात् ॥",
      purpose: "Neutralizes sudden optical illusions, foreign hurdles, tech confusion, and addictions.",
      count: "18,000 chants after sunset",
      gemstone: "Hessonite Garnet (Gomed) in Silver"
    },
    {
      graha: "Ketu (केतु देव - South Node)",
      mantra: "ॐ स्रां स्रीं स्रौं सः केतवे नमः ॥",
      gayatri: "ॐ गदाहस्ताय विद्महे अमृतेशाय धीमहि तन्नः केतुः प्रचोदयात् ॥",
      purpose: "Accelerates Moksha, occult insight, intuitive diagnosis, and spiritual detachment.",
      count: "17,000 chants at dawn",
      gemstone: "Cat's Eye (Lehsuniya) in Silver"
    }
  ];

  return (
    <div className="py-12 bg-amber-50/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>वैदिक मन्त्र साधना एवं उपाय</span>
          </div>
          <h2 className="font-cinzel text-3xl font-bold text-stone-900 tracking-tight">
            वैदिक मन्त्र एवं अनुभूत उपाय (Mantras & Remedies)
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Sanctified Vedic sound vibrations and practical Shastra rituals formulated by Pandit Sandeep Garg for karma pacification and planetary alignment.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-amber-200 justify-center gap-2 sm:gap-4 mb-8 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('navagraha')}
            className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
              activeTab === 'navagraha'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            ☉ नवग्रह बीज मन्त्र (Navagraha Mantras)
          </button>
          <button
            onClick={() => setActiveTab('shlokas')}
            className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
              activeTab === 'shlokas'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            ॐ महामृत्युंजय एवं गायत्री (Supreme Stotras)
          </button>
          <button
            onClick={() => setActiveTab('gemstones')}
            className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
              activeTab === 'gemstones'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            💎 रत्न धारण नियम (Gemstone Rules)
          </button>
          <button
            onClick={() => setActiveTab('doshas')}
            className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
              activeTab === 'doshas'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            🛡 साढ़े साती एवं मांगलिक निवारण (Dosha Cures)
          </button>
        </div>

        {/* Tab 1: Navagraha Mantras */}
        {activeTab === 'navagraha' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navagrahaMantras.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-amber-200 shadow-md p-6 flex flex-col justify-between hover:border-amber-400 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <h3 className="font-cinzel text-base font-bold text-stone-900">
                      {item.graha}
                    </h3>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      बीज मन्त्र
                    </span>
                  </div>

                  {/* Mantra Chant Box */}
                  <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/70 text-center">
                    <div className="font-cinzel text-base sm:text-lg font-bold text-amber-950 leading-relaxed">
                      {item.mantra}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                      गायत्री रूप:
                    </span>
                    <p className="text-xs text-stone-700 italic mt-0.5">
                      {item.gayatri}
                    </p>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    <strong>प्रभाव:</strong> {item.purpose}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">जप संख्या:</span>
                    <span className="font-semibold text-stone-800">{item.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">अनुकूल रत्न:</span>
                    <span className="font-semibold text-amber-800">{item.gemstone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Supreme Stotras */}
        {activeTab === 'shlokas' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Maha Mrityunjaya */}
            <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg font-cinzel">
                  ॐ
                </div>
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-stone-900">
                    महामृत्युंजय मन्त्र (Maha Mrityunjaya Mantra)
                  </h3>
                  <p className="text-xs text-stone-500">Rigveda 7.59.12 — The supreme conqueror of death, physical afflictions, and fear.</p>
                </div>
              </div>

              <div className="bg-stone-900 text-amber-200 p-6 rounded-2xl text-center space-y-2 border border-amber-600/30">
                <div className="font-cinzel text-lg sm:text-xl font-bold text-amber-300 leading-loose">
                  ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।<br />
                  उर्वारुकमिव बन्धनान्मृत्यchains मुक्षीय माऽमृतात् ॥
                </div>
                <div className="text-xs text-amber-100/70 italic pt-2 border-t border-stone-800">
                  "Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam | Urvarukam-Iva Bandhanan-Mrityor-Mukshiya Maamritat ||"
                </div>
              </div>

              <div className="text-xs text-stone-600 leading-relaxed space-y-2">
                <p>
                  <strong>भावार्थ:</strong> We worship the Three-Eyed Lord Shiva, who is fragrant and who nourishes and nurtures all beings. As the ripe cucumber is liberated from its bondage to the vine, may He liberate us from death and suffering, for the sake of immortality.
                </p>
                <p>
                  <strong>विधि (Chanting Protocol):</strong> Best chanted 108 times at dawn facing North-East with a sanctified Rudraksha mala after lighting a pure Cow Ghee lamp.
                </p>
              </div>
            </div>

            {/* Gayatri Mantra */}
            <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-lg">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-stone-900">
                    गायत्री मन्त्र (The Sacred Gayatri Mantra)
                  </h3>
                  <p className="text-xs text-stone-500">Rigveda 3.62.10 — Mother of all Vedic hymns granting luminous wisdom.</p>
                </div>
              </div>

              <div className="bg-stone-900 text-amber-200 p-6 rounded-2xl text-center space-y-2 border border-amber-600/30">
                <div className="font-cinzel text-lg sm:text-xl font-bold text-amber-300 leading-loose">
                  ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥
                </div>
                <div className="text-xs text-amber-100/70 italic pt-2 border-t border-stone-800">
                  "Om Bhur Bhuvaḥ Svaḥ Tat-Savitur Vareṇyaṁ Bhargo Devasya Dhīmahi Dhiyo Yo Naḥ Pracodayāt ||"
                </div>
              </div>

              <div className="text-xs text-stone-600 leading-relaxed space-y-2">
                <p>
                  <strong>भावार्थ:</strong> May the divine Supreme Light of Savita illuminate and inspire our intellect and wisdom onto the righteous path of truth.
                </p>
                <p>
                  <strong>विधि:</strong> Chant 24 or 108 times at Sandhya periods (dawn, noon, sunset) to clear subconscious mental fog and karmic weight.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Gemstones */}
        {activeTab === 'gemstones' && (
          <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-xl space-y-6 max-w-4xl mx-auto">
            <h3 className="font-cinzel text-xl font-bold text-stone-900">
              रत्न धारण की शास्त्रीय विधि एवं सावधानियां (Classical Gemstone Guidelines)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Vedic astrology treats gemstones as celestial radio receivers that channel cosmic rays directly into the human aura. Wearing a contraindicated stone can amplify negative house lords. Follow Pandit Sandeep Garg's 5 rules:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1 text-xs">
                <strong className="text-amber-900 block font-bold">1. केवल योगकारक अथवा शुभ भाव स्वामी का रत्न पहनें:</strong>
                <p className="text-stone-700">Never wear the stone of 6th, 8th, or 12th lord without expert chart balancing.</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1 text-xs">
                <strong className="text-amber-900 block font-bold">2. प्राकृतिक एवं अनुपचारित (Natural & Untreated):</strong>
                <p className="text-stone-700">Glass-filled or heated synthetic stones lack cosmic pranic frequency. Always seek certified untreated specimens.</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1 text-xs">
                <strong className="text-amber-900 block font-bold">3. प्राण प्रतिष्ठा एवं शुद्धि संस्कार:</strong>
                <p className="text-stone-700">Purify the ring in raw cow milk and Gangajal before sunrise, then chant the corresponding planet's beej mantra 108 times.</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1 text-xs">
                <strong className="text-amber-900 block font-bold">4. सही धातु एवं उंगली का चयन:</strong>
                <p className="text-stone-700">Ruby & Yellow Sapphire favor Gold/Copper (Ring & Index fingers); Blue Sapphire favors Iron/Panchdhatu (Middle finger); Emerald favors Bronze/Gold (Little finger).</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Dosha Cures */}
        {activeTab === 'doshas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Shani Sade Sati */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md space-y-3">
              <h4 className="font-cinzel text-base font-bold text-stone-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-700" />
                शनि साढ़े साती एवं ढैय्या शांति उपाय
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Saturn represents discipline and justice. To soften difficult transits:
              </p>
              <ul className="text-xs text-stone-700 space-y-2 list-disc pl-4">
                <li>Light a mustard oil diya under a Peepal tree every Saturday evening after sunset.</li>
                <li>Recite <em>Dasharatha Krit Shani Stotram</em> or Hanuman Chalisa.</li>
                <li>Donate black sesame seeds (Kaale Til), whole urad dal, or iron utensils to the needy.</li>
                <li>Serve physically disabled individuals or laborers on Saturdays.</li>
              </ul>
            </div>

            {/* Manglik Dosha */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md space-y-3">
              <h4 className="font-cinzel text-base font-bold text-stone-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-600" />
                मांगलिक दोष निवारण उपाय
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Mars in 1st, 4th, 7th, 8th, or 12th bhava requires calming fire balance:
              </p>
              <ul className="text-xs text-stone-700 space-y-2 list-disc pl-4">
                <li>Observe fast on Tuesdays and offer red flowers (Gudhal) to Lord Hanuman.</li>
                <li>Chant Sundarkand on Tuesdays or recite Hanuman Bahuk for temperamental peace.</li>
                <li>In severe cases, Kumbh Vivah or Vishnu Pratima Vivah can be performed prior to marriage.</li>
                <li>Donate red lentils (Masoor dal) or copper utensils.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
