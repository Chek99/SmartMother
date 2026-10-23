import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, VolumeX, Sparkles, Clock, CheckCircle2, Search, Heart } from 'lucide-react';
import { AppLanguage, EducationArticle } from '../types';

interface EducationViewProps {
  language: AppLanguage;
}

export const EducationView: React.FC<EducationViewProps> = ({ language }) => {
  const [articles, setArticles] = useState<EducationArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<EducationArticle | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    fetch('/api/education')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setArticles(data.articles);
          setActiveArticle(data.articles[0]);
        }
      })
      .catch(console.error);
  }, []);

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'sw' ? 'sw-KE' : 'en-GB';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const categories = [
    { id: 'all', labelEn: 'All Guides', labelSw: 'Miongozo Yote' },
    { id: 'nutrition', labelEn: 'Infant Nutrition', labelSw: 'Lishe ya Mtoto' },
    { id: 'immunization', labelEn: 'KEPI Vaccines', labelSw: 'Chanjo za KEPI' },
    { id: 'danger_signs', labelEn: 'Danger Signs', labelSw: 'Dalili Hatari' }
  ];

  const filteredArticles = articles.filter(a => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wide">
          <BookOpen className="w-4 h-4" />
          <span>Ministry of Health Kenya Community Health Strategy</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
          {language === 'sw' ? 'Elimu ya Afya ya Mama na Mtoto' : 'Maternal & Infant Health Education'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'sw'
            ? 'Makala yaliyoidhinishwa na wataalamu wa afya nchini Kenya, yanayopatikana kwa sauti na maandishi.'
            : 'Vetted clinical guidelines with text-to-speech audio support for all literacy levels.'}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
              selectedCategory === c.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {language === 'sw' ? c.labelSw : c.labelEn}
          </button>
        ))}
      </div>

      {/* Articles Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="space-y-3">
          {filteredArticles.map(art => {
            const isSelected = activeArticle?.slug === art.slug;
            return (
              <div
                key={art.slug}
                onClick={() => {
                  setActiveArticle(art);
                  if (isSpeaking) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-teal-50/70 border-teal-500 shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 line-clamp-2">
                  {language === 'sw' ? art.titleSw : art.titleEn}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {language === 'sw' ? art.summarySw : art.summaryEn}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{art.readTimeMinutes} min read</span>
                  <span className="font-semibold text-teal-700">{art.authorAgency}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Reader */}
        {activeArticle && (
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-md">
                  {activeArticle.authorAgency}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                  {language === 'sw' ? activeArticle.titleSw : activeArticle.titleEn}
                </h2>
              </div>

              {/* Audio Listen Button */}
              <button
                onClick={() => handleSpeak(language === 'sw' ? `${activeArticle.titleSw}. ${activeArticle.contentSw}` : `${activeArticle.titleEn}. ${activeArticle.contentEn}`)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isSpeaking
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
                title="Listen to full article"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>{language === 'sw' ? 'Sitisha Sauti' : 'Stop Audio'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{language === 'sw' ? 'Sikiliza kwa Sauti' : 'Listen Aloud'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {language === 'sw' ? activeArticle.contentSw : activeArticle.contentEn}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{language === 'sw' ? 'Mwongozo wa Afya ya Msingi' : 'Primary Health Care Standard'}</span>
              <div className="flex gap-1">
                {activeArticle.tags.map((t, idx) => (
                  <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-600">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
