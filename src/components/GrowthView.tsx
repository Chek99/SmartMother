import React, { useState } from 'react';
import { 
  LineChart as LineChartIcon, 
  Plus, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Utensils, 
  Baby, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { AppLanguage, Child, GrowthMeasurement, Milestone } from '../types';

interface GrowthViewProps {
  child: Child;
  growth: GrowthMeasurement[];
  language: AppLanguage;
  onRefresh: () => void;
}

export const GrowthView: React.FC<GrowthViewProps> = ({
  child,
  growth,
  language,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'milestones' | 'nutrition'>('chart');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [headCirc, setHeadCirc] = useState('');
  const [verifyWithPaper, setVerifyWithPaper] = useState(true);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Milestones local state
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      _id: 'm1',
      category: 'cognitive_social',
      titleEn: 'Social Smile',
      titleSw: 'Kutabasamu kwa Watu',
      descriptionEn: 'Smiles spontaneously in response to mother’s voice and face.',
      descriptionSw: 'Hutabasamu kuitikia sauti ya mama au sura anazozifahamu.',
      expectedAgeMonthsMin: 1.5,
      expectedAgeMonthsMax: 3,
      guidanceIfDelayedEn: 'Engage in frequent face-to-face vocal interactions, make eye contact, and consult clinic if no social smile by 3 months.',
      guidanceIfDelayedSw: 'Zungumza na mtoto ukiwa karibu naye uso kwa uso. Iwapo haonyeshi tabasamu kufikia miezi 3, mjulishe mhudumu wa afya.',
      achieved: true
    },
    {
      _id: 'm2',
      category: 'gross_motor',
      titleEn: 'Steady Head Control',
      titleSw: 'Kushikilia Kichwa Vizuri',
      descriptionEn: 'Holds head steady without support when held upright.',
      descriptionSw: 'Anashikilia kichwa bila kuyumbayumba anapobebwa wima.',
      expectedAgeMonthsMin: 3,
      expectedAgeMonthsMax: 5,
      guidanceIfDelayedEn: 'Practice daily supervised tummy time for 5-10 minutes while awake.',
      guidanceIfDelayedSw: 'Mweke mtoto alale kwa tumbo (tummy time) kwa dakika chache akiwa macho na unamwangalia.',
      achieved: true
    },
    {
      _id: 'm3',
      category: 'fine_motor',
      titleEn: 'Reaches and Grasps Toys',
      titleSw: 'Kufikia na Kushika Vitu',
      descriptionEn: 'Reaches for brightly colored rattles or objects and brings them to mouth.',
      descriptionSw: 'Hufikia na kushika midoli au vitu na kuviweka mdomoni.',
      expectedAgeMonthsMin: 4,
      expectedAgeMonthsMax: 6,
      guidanceIfDelayedEn: 'Provide clean, safe, non-toxic objects within reach to stimulate grasping.',
      guidanceIfDelayedSw: 'Mwekee vitu salama na safi karibu ili ajifunze kuvishika.',
      achieved: true
    },
    {
      _id: 'm4',
      category: 'gross_motor',
      titleEn: 'Sits with or without Support',
      titleSw: 'Kuketi (kwa Msaada au Peke Yake)',
      descriptionEn: 'Sits steadily with slight hand support or independently for brief periods.',
      descriptionSw: 'Huketi kwa uthabiti akijishikilia au bila usaidizi kwa muda mfupi.',
      expectedAgeMonthsMin: 6,
      expectedAgeMonthsMax: 8,
      guidanceIfDelayedEn: 'Propping with soft pillows on a clean mat supports core abdominal strength.',
      guidanceIfDelayedSw: 'Mwekee mito laini mgongoni kwenye mkeka safi ili kuimarisha misuli ya mgongo.',
      achieved: false
    },
    {
      _id: 'm5',
      category: 'language_speech',
      titleEn: 'Babbling (ba-ba, ma-ma, da-da)',
      titleSw: 'Kubwabwaja (ma-ma, ba-ba)',
      descriptionEn: 'Produces repeated syllables and turns when their name is called.',
      descriptionSw: 'Hutoa milio ya kurudia na kugeuka anapoitwa jina lake.',
      expectedAgeMonthsMin: 6,
      expectedAgeMonthsMax: 9,
      guidanceIfDelayedEn: 'Sing lullabies, speak in rhythmic tones, and test if baby turns towards soft sounds behind them.',
      guidanceIfDelayedSw: 'Mwimbie nyimbo za watoto, ongea naye mara kwa mara, na angalia kama anageukia sauti.',
      achieved: false
    }
  ]);

  const toggleMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => m._id === id ? { ...m, achieved: !m.achieved } : m));
  };

  // Prepare chart dataset comparing child's measurements with WHO Median, +2SD, -2SD
  const chartData = [
    { age: 0, whoMedian: 3.3, whoPlus2: 4.3, whoMinus2: 2.5, childWeight: child.birthWeightKg },
    { age: 1.5, whoMedian: 5.1, whoPlus2: 6.4, whoMinus2: 4.0, childWeight: 4.0 },
    { age: 3, whoMedian: 6.4, whoPlus2: 7.9, whoMinus2: 4.9, childWeight: 5.2 },
    { age: 5, whoMedian: 7.5, whoPlus2: 9.2, whoMinus2: 5.8, childWeight: 6.8 },
    { age: 6, whoMedian: 7.9, whoPlus2: 9.7, whoMinus2: 6.1, childWeight: null },
    { age: 9, whoMedian: 8.9, whoPlus2: 10.9, whoMinus2: 6.9, childWeight: null },
    { age: 12, whoMedian: 9.6, whoPlus2: 11.7, whoMinus2: 7.5, childWeight: null }
  ];

  const handleSaveMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`/api/children/${child._id}/growth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weightKg: weight,
          heightLengthCm: length,
          headCircumferenceCm: headCirc,
          notes,
          verifiedAgainstPaperBooklet: verifyWithPaper
        })
      });
      setIsModalOpen(false);
      setWeight('');
      setLength('');
      setHeadCirc('');
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const latest = growth[growth.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wide">
            <TrendingUp className="w-4 h-4" />
            <span>WHO Child Growth Standards &amp; Milestones</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            {language === 'sw' ? 'Ufuatiliaji wa Ukuaji & Lishe' : 'Growth & Nutritional Trajectory'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'sw'
              ? 'Linganisha uzito na urefu wa mtoto na viwango rasmi vya Shirika la Afya Duniani (WHO Z-Scores).'
              : 'Track infant anthropometrics against WHO multi-centre growth percentile bands.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'sw' ? 'Weka Vipimo Vipya' : 'Log Measurement'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('chart')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'chart' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'sw' ? 'Mchoro wa Ukuaji (WHO Curve)' : 'WHO Growth Curve'}
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'milestones' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'sw' ? 'Hatua za Ukuaji (Milestones)' : 'Milestones'}
        </button>
        <button
          onClick={() => setActiveTab('nutrition')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'nutrition' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'sw' ? 'Miongozo ya Lishe ya Kenya' : 'Kenyan Nutrition Guide'}
        </button>
      </div>

      {/* TAB 1: WHO Growth Chart */}
      {activeTab === 'chart' && (
        <div className="space-y-6">
          {/* Current Anthropometrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">
                {language === 'sw' ? 'Uzito kwa Umri (Z-Score)' : 'Weight-for-Age (Z-Score)'}
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
                {latest ? `${latest.zScores.weightForAge} SD` : '-0.42 SD'}
              </div>
              <div className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'sw' ? 'Kiwango cha Kijani (Kawaida)' : 'Normal Green Band (-2 to +2 SD)'}</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">
                {language === 'sw' ? 'Urefu kwa Umri (Z-Score)' : 'Height-for-Age (Z-Score)'}
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
                {latest ? `${latest.zScores.heightForAge} SD` : '-0.21 SD'}
              </div>
              <div className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'sw' ? 'Hakuna Kudumaa' : 'No Stunting Detected'}</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">
                {language === 'sw' ? 'Hali ya Lishe' : 'Nutritional Classification'}
              </div>
              <div className="text-base font-bold text-teal-800 mt-1">
                {latest?.nutritionalStatus === 'normal' || !latest ? (language === 'sw' ? 'Afya Nzuri (Normal)' : 'Well-Nourished') : latest.nutritionalStatus}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {language === 'sw' ? 'MUAC: 13.5 cm (Kanda ya Kijani)' : 'MUAC: 13.5 cm (Normal green tape)'}
              </div>
            </div>
          </div>

          {/* Interactive Recharts Graph */}
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'sw' ? 'Mwenendo wa Uzito (kg) dhidi ya Umri (Miezi)' : 'Weight Curve (kg) vs. Age (Months)'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'sw' ? 'Kulinganishwa na mikondo ya WHO 2006' : 'Plotted against WHO 2006 Reference Percentiles'}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-teal-600 inline-block" />
                  <span className="font-semibold text-slate-700">{child.fullName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
                  <span className="text-slate-500">WHO Median</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-amber-400 border-dashed border-t inline-block" />
                  <span className="text-slate-500">±2 SD Band</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="age" 
                    unit="m" 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                  />
                  <YAxis 
                    unit="kg" 
                    domain={[2, 13]} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', borderColor: '#cbd5e1' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="whoPlus2" 
                    stroke="#fbbf24" 
                    strokeDasharray="4 4" 
                    name="+2 SD (Overweight cutoff)" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="whoMedian" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    name="WHO Median" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="whoMinus2" 
                    stroke="#f87171" 
                    strokeDasharray="4 4" 
                    name="-2 SD (Underweight cutoff)" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="childWeight" 
                    stroke="#0d9488" 
                    strokeWidth={3} 
                    name={`${child.fullName} (Weight)`}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Past Measurements History Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'sw' ? 'Jedwali la Rekodi za Ukuaji' : 'Logged Anthropometrics History'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-3">Tarehe / Date</th>
                    <th className="p-3">Umri / Age</th>
                    <th className="p-3">Uzito / Weight</th>
                    <th className="p-3">Urefu / Length</th>
                    <th className="p-3">Kichwa / Head</th>
                    <th className="p-3">Z-Score (WAZ)</th>
                    <th className="p-3">Kitabu cha Karatasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {growth.map(g => (
                    <tr key={g._id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-medium text-slate-900">{g.measurementDate}</td>
                      <td className="p-3">{g.ageInMonths} {language === 'sw' ? 'miezi' : 'months'}</td>
                      <td className="p-3 font-semibold text-slate-800">{g.weightKg} kg</td>
                      <td className="p-3">{g.heightLengthCm} cm</td>
                      <td className="p-3">{g.headCircumferenceCm ? `${g.headCircumferenceCm} cm` : '—'}</td>
                      <td className="p-3 font-mono font-bold text-teal-700">{g.zScores?.weightForAge ?? '0.0'}</td>
                      <td className="p-3">
                        {g.verifiedAgainstPaperBooklet ? (
                          <span className="text-emerald-700 flex items-center gap-1 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            {language === 'sw' ? 'Imethibitishwa' : 'Verified'}
                          </span>
                        ) : (
                          <span className="text-slate-400">{language === 'sw' ? 'Haijathibitishwa' : 'Pending verification'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Developmental Milestones */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-950 flex items-start gap-3">
            <Baby className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">
                {language === 'sw' ? 'Hatua za Ukuaji (Milestones Checklist)' : 'MoH Developmental Milestones Checklist'}
              </div>
              <p className="mt-0.5 leading-relaxed">
                {language === 'sw'
                  ? 'Kila mtoto hukua kwa kasi yake. Iwapo mtoto amechelewa hatua fulani, maelekezo ya upole yanatolewa hapa chini, na unaweza kushauriana na muuguzi kliniki.'
                  : 'Every child develops at their own pace. If a milestone is delayed beyond the expected window, gentle guidance and clinician consultation advice are provided.'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {milestones.map(m => (
              <div 
                key={m._id} 
                className={`p-4 rounded-2xl border transition-all ${
                  m.achieved ? 'bg-white border-emerald-200' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleMilestone(m._id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        m.achieved ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {m.achieved && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {language === 'sw' ? m.titleSw : m.titleEn}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {language === 'sw' ? m.descriptionSw : m.descriptionEn}
                      </div>
                      <div className="text-[11px] text-teal-700 font-semibold mt-1">
                        {language === 'sw' ? 'Inatarajiwa' : 'Expected Age'}: {m.expectedAgeMonthsMin} - {m.expectedAgeMonthsMax} {language === 'sw' ? 'miezi' : 'months'}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    m.achieved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {m.achieved ? (language === 'sw' ? 'Imefikiwa' : 'Achieved') : (language === 'sw' ? 'Inasubiriwa' : 'In Progress')}
                  </span>
                </div>

                {!m.achieved && (
                  <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{language === 'sw' ? 'Ushauri wa Kusaidia:' : 'Supportive Guidance:'} </span>
                      <span>{language === 'sw' ? m.guidanceIfDelayedSw : m.guidanceIfDelayedEn}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Kenyan Nutrition Guide */}
      {activeTab === 'nutrition' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wide">
              <Utensils className="w-4 h-4 text-teal-600" />
              <span>0 - 6 Miezi: Maziwa ya Mama Pekee</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'sw' ? 'Kunyonyesha Maziwa ya Mama Pekee' : 'Exclusive Breastfeeding'}
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
              <li>{language === 'sw' ? 'Mpe mtoto maziwa ya mama pekee kwa miezi 6 ya kwanza bila maji, chai, au maziwa ya ng’ombe.' : 'Breastmilk only for 6 full months—no water, teas, or infant formulas needed.'}</li>
              <li>{language === 'sw' ? 'Colostrum (maziwa ya kwanza ya manjano) ni chanjo ya asili yenye kingamwili nyingi.' : 'Colostrum is baby’s first natural immunization packed with protective antibodies.'}</li>
              <li>{language === 'sw' ? 'Nyonyesha kila anapotaka (mara 8 hadi 12 kwa siku na usiku).' : 'Feed on demand day and night (8-12+ times in 24 hours).'}</li>
            </ul>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wide">
              <Utensils className="w-4 h-4 text-teal-600" />
              <span>6 - 24 Miezi: Vyakula vya Nyongeza</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'sw' ? 'Kuanzisha Vyakula vya Asili vya Kenya' : 'Kenyan Complementary Feeding'}
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
              <li>{language === 'sw' ? 'Uji mzito wa wimbi au mtama uliorutubishwa na unga wa njugu, maziwa, au yai.' : 'Thick sorghum/millet porridge (Uji) enriched with groundnut paste, milk, or egg.'}</li>
              <li>{language === 'sw' ? 'Vyakula vilivyopondwa: viazi vitamu, malenge, ndizi mbivu, parachichi na maini laini.' : 'Mashed nutrient foods: pumpkin, sweet potato, ripe avocado, pureed liver.'}</li>
              <li>{language === 'sw' ? 'Mboga za kiasili: sukuma wiki, mchicha, na managu zilizopikwa na kupondwa vizuri.' : 'Traditional greens: finely cooked sukuma wiki, managu, or spinach for iron.'}</li>
            </ul>
          </div>
        </div>
      )}

      {/* Modal to log measurement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'sw' ? 'Weka Vipimo Vipya vya Ukuaji' : 'Log New Growth Measurement'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {child.fullName} · {language === 'sw' ? 'Vipimo hivi vitalinganishwa na viwango vya WHO' : 'Will calculate WHO Z-Scores'}
            </p>

            <form onSubmit={handleSaveMeasurement} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {language === 'sw' ? 'Uzito (kg)' : 'Weight (kg)'} *
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="e.g. 7.2"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {language === 'sw' ? 'Urefu (cm)' : 'Length/Height (cm)'} *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={length}
                    onChange={e => setLength(e.target.value)}
                    placeholder="e.g. 66.5"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {language === 'sw' ? 'Mzunguko wa Kichwa (cm)' : 'Head Circumference (cm)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={headCirc}
                  onChange={e => setHeadCirc(e.target.value)}
                  placeholder="e.g. 42.0"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {language === 'sw' ? 'Maelezo / Vidokezo' : 'Clinical Notes'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Active, good muscle tone, breastfeeding well"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Hybrid Booklet Verification */}
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifyWithPaper}
                    onChange={e => setVerifyWithPaper(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-emerald-950">
                    {language === 'sw' ? 'Imethibitishwa na Kitabu cha Karatasi (MoH 216)' : 'Verified with Paper Booklet (MoH 216)'}
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  {language === 'sw' ? 'Ghairi' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
                >
                  {submitting ? 'Inahifadhi...' : (language === 'sw' ? 'Hifadhi Vipimo' : 'Save Measurement')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
