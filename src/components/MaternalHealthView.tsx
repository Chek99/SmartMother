import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  BookHeart, 
  Plus, 
  ShieldCheck, 
  Calendar, 
  Smile, 
  Frown, 
  Meh, 
  HelpCircle,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { AppLanguage, JournalEntry } from '../types';

interface MaternalHealthViewProps {
  language: AppLanguage;
}

export const MaternalHealthView: React.FC<MaternalHealthViewProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'journal' | 'anc' | 'pnc' | 'mental'>('journal');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMood, setNewMood] = useState<JournalEntry['moodTag']>('calm');
  const [submittingJournal, setSubmittingJournal] = useState(false);

  // EPDS Screening interactive state
  const [epdsAnswers, setEpdsAnswers] = useState<number[]>([0, 1, 0, 1, 0]);
  const [epdsResult, setEpdsResult] = useState<{ score: number; risk: string } | null>(null);

  useEffect(() => {
    fetch('/api/journal')
      .then(res => res.json())
      .then(data => {
        if (data.success) setJournalEntries(data.entries);
      })
      .catch(console.error);
  }, []);

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmittingJournal(true);
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          moodTag: newMood
        })
      });
      const data = await res.json();
      if (data.success) {
        setJournalEntries(prev => [data.entry, ...prev]);
        setIsJournalModalOpen(false);
        setNewTitle('');
        setNewContent('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingJournal(false);
    }
  };

  const handleScoreEpds = () => {
    const totalScore = epdsAnswers.reduce((a, b) => a + b, 0);
    const risk = totalScore >= 8 ? 'moderate_to_high' : 'low';
    setEpdsResult({ score: totalScore, risk });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wide">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Kenya Ministry of Health Maternal Health Charter</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            {language === 'sw' ? 'Afya ya Mama & Shajara Binafsi' : 'Maternal Health & Digital Journal'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'sw'
              ? 'Fuatilia kliniki za ujauzito (ANC), ukaguzi wa baada ya kujifungua (PNC), na hali yako ya kisaikolojia na shajara.'
              : 'Record ANC visits, postnatal checkups, mental wellbeing screening, and private reflections.'}
          </p>
        </div>

        {activeTab === 'journal' && (
          <button
            onClick={() => setIsJournalModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'sw' ? 'Andika kwenye Shajara' : 'New Journal Entry'}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('journal')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'journal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'sw' ? 'Shajara ya Mama' : 'Mother Journal'} ({journalEntries.length})
        </button>
        <button
          onClick={() => setActiveTab('anc')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'anc' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'sw' ? 'Kliniki za Ujauzito (ANC)' : 'ANC Visits (4+)'}
        </button>
        <button
          onClick={() => setActiveTab('pnc')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'pnc' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'sw' ? 'Ukaguzi Baada ya Kujifungua (PNC)' : 'Postnatal Checks'}
        </button>
        <button
          onClick={() => setActiveTab('mental')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'mental' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'sw' ? 'Ustawi wa Kisaikolojia (EPDS)' : 'Mental Wellbeing'}
        </button>
      </div>

      {/* TAB 1: Digital Mother Journal */}
      {activeTab === 'journal' && (
        <div className="space-y-4">
          <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl text-xs text-rose-950 flex items-start gap-3">
            <BookHeart className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">
                {language === 'sw' ? 'Shajara Yako Binafsi ya Siri' : 'Private & Confidential Mother Journal'}
              </span>
              <p className="mt-0.5 leading-relaxed">
                {language === 'sw'
                  ? 'Kulea mtoto mchanga kuna furaha na uchovu mwingi. Andika hisia zako bila woga. Rekodi hizi ni za siri kwako tu.'
                  : 'Motherhood is rewarding yet exhausting. Record your unfiltered reflections, milestones, and daily moods.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {journalEntries.map(j => (
              <div key={j._id} className="p-5 bg-white rounded-3xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate">{j.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">{j.date}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {j.content}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">
                    {language === 'sw' ? 'Hali ya Moyo:' : 'Mood:'} <strong className="text-slate-800 capitalize">{j.moodTag}</strong>
                  </span>
                  <span className="text-teal-700 font-medium">
                    {language === 'sw' ? 'Ya Siri' : 'Private'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ANC Visits (MoH 216 Section 1) */}
      {activeTab === 'anc' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'sw' ? 'Rekodi za Kliniki za Ujauzito (ANC Visits)' : 'Antenatal Care (ANC) Clinic Records'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'sw' ? 'Miongozo ya MoH Kenya inahimiza angalau kliniki 4 hadi 8.' : 'Kenya MoH recommends a minimum of 4 to 8 focused ANC contacts.'}
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                {language === 'sw' ? '4 Zimekamilika' : '4 Completed'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Tarehe / Date</th>
                    <th className="p-3">Kituo / Facility</th>
                    <th className="p-3">Muda / Gestation</th>
                    <th className="p-3">Uzito / Weight</th>
                    <th className="p-3">BP</th>
                    <th className="p-3">Hb (g/dL)</th>
                    <th className="p-3">Kitabu cha Karatasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold">ANC 1</td>
                    <td className="p-3 font-mono">2025-11-12</td>
                    <td className="p-3">Pumwani Maternity</td>
                    <td className="p-3">12 wks</td>
                    <td className="p-3 font-semibold">58.5 kg</td>
                    <td className="p-3 font-mono">118/75</td>
                    <td className="p-3">12.1</td>
                    <td className="p-3 text-emerald-700 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? 'Imethibitishwa' : 'Verified'}</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold">ANC 2</td>
                    <td className="p-3 font-mono">2026-01-20</td>
                    <td className="p-3">Pumwani Maternity</td>
                    <td className="p-3">20 wks</td>
                    <td className="p-3 font-semibold">62.0 kg</td>
                    <td className="p-3 font-mono">120/78</td>
                    <td className="p-3">11.8</td>
                    <td className="p-3 text-emerald-700 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? 'Imethibitishwa' : 'Verified'}</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold">ANC 3</td>
                    <td className="p-3 font-mono">2026-03-15</td>
                    <td className="p-3">Pumwani Maternity</td>
                    <td className="p-3">28 wks</td>
                    <td className="p-3 font-semibold">65.4 kg</td>
                    <td className="p-3 font-mono">122/80</td>
                    <td className="p-3">11.5</td>
                    <td className="p-3 text-emerald-700 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? 'Imethibitishwa' : 'Verified'}</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold">ANC 4</td>
                    <td className="p-3 font-mono">2026-04-22</td>
                    <td className="p-3">Pumwani Maternity</td>
                    <td className="p-3">34 wks</td>
                    <td className="p-3 font-semibold">67.2 kg</td>
                    <td className="p-3 font-mono">124/82</td>
                    <td className="p-3">11.7</td>
                    <td className="p-3 text-emerald-700 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? 'Imethibitishwa' : 'Verified'}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PNC Postnatal Checks */}
      {activeTab === 'pnc' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-teal-800">PNC 1: Ndani ya Saa 48 (48 Hours)</div>
              <div className="text-sm font-bold text-slate-900">Hospital Ward Discharge</div>
              <p className="text-xs text-slate-600">
                {language === 'sw' ? 'Kuangalia damu (lochia), joto, na kuanzisha unyonyeshaji wa maziwa ya kwanza.' : 'Checked bleeding, vitals, cord care, and initiation of exclusive breastfeeding.'}
              </p>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pumwani Ward 4 · Verified</span>
              </div>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-teal-800">PNC 2: Wiki ya 2 (Day 14)</div>
              <div className="text-sm font-bold text-slate-900">Maternal Healing Check</div>
              <p className="text-xs text-slate-600">
                {language === 'sw' ? 'Uchunguzi wa kovu, shinikizo la damu, na jinsi mama anavyolala na kupata msaada.' : 'Episiotomy/C-section scar healing, BP check, and sleep support assessment.'}
              </p>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Westlands Clinic · Verified</span>
              </div>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-teal-800">PNC 3: Wiki ya 6 (Day 42)</div>
              <div className="text-sm font-bold text-slate-900">Full Postnatal Assessment</div>
              <p className="text-xs text-slate-600">
                {language === 'sw' ? 'Ushauri wa upangaji uzazi, ukaguzi wa mwili, na kumpa mtoto chanjo za wiki ya 6.' : 'Family planning counseling, cervical check, and baby 6-week immunization.'}
              </p>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Westlands Clinic · Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Mental Wellbeing & EPDS */}
      {activeTab === 'mental' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wide">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Edinburgh Postnatal Depression Scale (EPDS) Check-in</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            {language === 'sw'
              ? 'Wazazi wengi hupitia mabadiliko ya hisia baada ya kujifungua. Jibu maswali haya mafupi 5 kwa uaminifu ili kutathmini afya yako ya kisaikolojia.'
              : 'Postpartum changes affect many new mothers. Take this gentle 5-question check-in to assess emotional wellbeing.'}
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <label className="text-xs font-semibold text-slate-800 block">
                1. {language === 'sw' ? 'Nimeweza kucheka na kuona mambo mazuri ya maisha:' : 'I have been able to laugh and see the bright side of things:'}
              </label>
              <div className="flex gap-2 flex-wrap text-xs">
                {['Kama kawaida / As much as always', 'Kidogo / Rather less', 'Mara chache / Not so much', 'Hapana kabisa / Not at all'].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const next = [...epdsAnswers];
                      next[0] = i;
                      setEpdsAnswers(next);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                      epdsAnswers[0] === i ? 'bg-rose-600 text-white border-rose-600' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <label className="text-xs font-semibold text-slate-800 block">
                2. {language === 'sw' ? 'Nimekuwa na wasiwasi au hofu bila sababu ya wazi:' : 'I have been anxious or worried for no good reason:'}
              </label>
              <div className="flex gap-2 flex-wrap text-xs">
                {['Hapana kamwe / No, not at all', 'Mara chache / Hardly ever', 'Wakati mwingine / Yes, sometimes', 'Mara nyingi sana / Yes, very often'].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const next = [...epdsAnswers];
                      next[1] = i;
                      setEpdsAnswers(next);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                      epdsAnswers[1] === i ? 'bg-rose-600 text-white border-rose-600' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleScoreEpds}
              className="mt-3 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              {language === 'sw' ? 'Kadiria Alama Zangu za EPDS' : 'Calculate Wellbeing Score'}
            </button>

            {epdsResult && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                <div className="font-bold text-sm">
                  {language === 'sw' ? `Alama za EPDS: ${epdsResult.score} / 15` : `EPDS Score: ${epdsResult.score} / 15`}
                </div>
                <p className="mt-1 leading-relaxed">
                  {epdsResult.risk === 'low'
                    ? (language === 'sw'
                        ? 'Alama zako ziko katika kiwango salama cha kawaida. Unaendelea vizuri na malezi. Endelea kupata mapumziko.'
                        : 'Your score reflects healthy, well-supported postpartum adjustment. Continue resting whenever baby sleeps.')
                    : (language === 'sw'
                        ? 'Alama zako zinaonyesha hisia za uchovu au wasiwasi. Tafadhali zungumza na muuguzi kliniki au mpigie simu mhudumu wa afya.'
                        : 'Your score suggests noticeable anxiety or fatigue. We recommend discussing how you feel with your clinic nurse.')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Journal Entry Modal */}
      {isJournalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'sw' ? 'Andika Kwenye Shajara Yako ya Siri' : 'New Private Journal Entry'}
            </h3>
            <form onSubmit={handleSaveJournal} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {language === 'sw' ? 'Kichwa cha Somo' : 'Title'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. A peaceful afternoon with Amani"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {language === 'sw' ? 'Hisia / Mood' : 'Mood Tag'}
                </label>
                <select
                  value={newMood}
                  onChange={e => setNewMood(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  <option value="joyful">{language === 'sw' ? 'Furaha Tele (Joyful)' : 'Joyful'}</option>
                  <option value="calm">{language === 'sw' ? 'Utulivu (Calm)' : 'Calm'}</option>
                  <option value="exhausted">{language === 'sw' ? 'Uchovu Mkubwa (Exhausted)' : 'Exhausted'}</option>
                  <option value="anxious">{language === 'sw' ? 'Wasiwasi (Anxious)' : 'Anxious'}</option>
                  <option value="supported">{language === 'sw' ? 'Kupata Msaada (Supported)' : 'Supported'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {language === 'sw' ? 'Maandishi Yako Binafsi' : 'Your Thoughts'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Write freely here..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJournalModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  {language === 'sw' ? 'Ghairi' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submittingJournal}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  {submittingJournal ? 'Inahifadhi...' : (language === 'sw' ? 'Hifadhi Shajara' : 'Save Entry')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
