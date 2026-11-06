import React from 'react';
import { Clock, Calendar, Award, FileText, Layers, BookMarked, ArrowUpRight } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { TestCategory } from '../types/quiz';

interface CategoryCard {
  id: TestCategory;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

export const QuickCategories: React.FC = () => {
  const { setActiveSection, tests } = useQuiz();

  const categories: CategoryCard[] = [
    {
      id: 'Daily Test',
      title: 'Daily Tests',
      subtitle: 'प्रतिदिन अभ्यास',
      description: 'Quick morning speed drills with instant rank calculation to sharpen recall and exam reflexes.',
      icon: Clock,
      color: 'text-orange-400'
    },
    {
      id: 'Weekly Test',
      title: 'Weekly Tests',
      subtitle: 'साप्ताहिक परीक्षा',
      description: 'Full syllabus sectional drills held every weekend to consolidate weekly preparation.',
      icon: Calendar,
      color: 'text-amber-400'
    },
    {
      id: 'Mock Test',
      title: 'Mock Tests',
      subtitle: 'सम्पूर्ण मॉक टेस्ट',
      description: 'Exact exam simulation matching real exam timeframes, question weights, and negative marking.',
      icon: Award,
      color: 'text-rose-400'
    },
    {
      id: 'PYQ Test',
      title: 'Previous Year Questions (PYQ)',
      subtitle: 'विगत वर्ष प्रश्न',
      description: 'Authentic previous year question papers categorized by exam year with verified answer keys.',
      icon: FileText,
      color: 'text-sky-400'
    },
    {
      id: 'Chapter Test',
      title: 'Chapter Tests',
      subtitle: 'अध्याय-वार टेस्ट',
      description: 'Micro-tests targeting single constitutional articles, physics formulas, or history dynasties.',
      icon: Layers,
      color: 'text-emerald-400'
    },
    {
      id: 'Subject-wise Test',
      title: 'Subject-wise Tests',
      subtitle: 'विषय-वार टेस्ट',
      description: 'Deep-dive subject mastery evaluations across Polity, Science, Quant, History, and Reasoning.',
      icon: BookMarked,
      color: 'text-purple-400'
    }
  ];

  const handleSelectCategory = (category: TestCategory) => {
    setActiveSection('student-new-tests');
  };

  return (
    <section className="py-14 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#FF8C32] font-semibold mb-1">
              Examination Modules
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Quick Access Categories
            </h2>
          </div>
          <button
            onClick={() => setActiveSection('student-new-tests')}
            className="text-xs text-slate-400 hover:text-[#FF8C32] transition flex items-center gap-1 font-semibold"
          >
            <span>View All Tests</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = tests.filter(t => t.category === cat.id).length;

            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="glass-card p-6 rounded-2xl cursor-pointer group transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition">
                      <Icon className={`w-6 h-6 ${cat.color}`} />
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                      {count} Available
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#FF8C32] transition">
                    {cat.title}
                  </h3>
                  <div className="text-xs text-[#FF8C32]/80 font-medium mt-0.5">
                    {cat.subtitle}
                  </div>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-300 font-semibold group-hover:text-[#FF8C32]">
                  <span>Explore Drills</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
