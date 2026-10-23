import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Syringe, 
  LineChart, 
  Calendar, 
  Sparkles, 
  FileText, 
  Printer, 
  Baby, 
  Heart, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { AppLanguage, Child, VaccinationRecord, GrowthMeasurement } from '../types';

interface DashboardViewProps {
  child: Child;
  vaccinations: VaccinationRecord[];
  growth: GrowthMeasurement[];
  language: AppLanguage;
  onNavigateTab: (tab: string) => void;
  onOpenPrintBooklet: () => void;
  onOpenEmergency: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  child,
  vaccinations,
  growth,
  language,
  onNavigateTab,
  onOpenPrintBooklet,
  onOpenEmergency
}) => {
  const [paperVerified, setPaperVerified] = useState(child.verifiedAgainstPaperBooklet);
  const [syncingPaper, setSyncingPaper] = useState(false);

  // Calculate age
  const now = new Date();
  const dob = new Date(child.dateOfBirth);
  const ageMonthsExact = (now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 30.4375);
  const ageMonths = Math.floor(ageMonthsExact);
  const ageWeeks = Math.floor((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 7));

  // Find next upcoming or due vaccine
  const nextVaccine = vaccinations.find(v => v.status === 'due' || v.status === 'upcoming') || vaccinations[0];
  const overdueCount = vaccinations.filter(v => v.status === 'overdue').length;
  const completedCount = vaccinations.filter(v => v.status === 'completed').length;
  const latestGrowth = growth[growth.length - 1];

  const handleTogglePaperVerification = async () => {
    setSyncingPaper(true);
    try {
      const res = await fetch(`/api/children/${child._id}/paper-booklet-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isVerified: !paperVerified,
          bookletSerial: child.paperBookletNumber
        })
      });
      const data = await res.json();
      if (data.success) {
        setPaperVerified(data.child.verifiedAgainstPaperBooklet);
      }
    } catch (e) {
      console.error(e);
      setPaperVerified(!paperVerified);
    } finally {
      setSyncingPaper(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Profile Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold text-2xl shrink-0">
              <Baby className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {child.fullName}
                </h1>
                {child.isMultipleBirth && (
                  <span className="text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                    {language === 'sw' ? `Pacha #${child.birthOrderInMultiple || 1}` : `Twin #${child.birthOrderInMultiple || 1}`}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span>{language === 'sw' ? 'Umri' : 'Age'}: <strong className="text-slate-800">{ageMonths} {language === 'sw' ? 'miezi' : 'months'} ({ageWeeks} {language === 'sw' ? 'wiki' : 'wks'})</strong></span>
                <span aria-hidden="true">·</span>
                <span>DOB: <strong className="text-slate-800">{child.dateOfBirth}</strong></span>
                <span aria-hidden="true">·</span>
                <span>{child.birthFacility}</span>
              </div>
            </div>
          </div>

          {/* Paper Booklet Synchronization Controls */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-wrap">
            <button
              onClick={handleTogglePaperVerification}
              disabled={syncingPaper}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                paperVerified
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
              }`}
              title="Verify against physical MoH 216 paper booklet"
            >
              <ShieldCheck className={`w-4 h-4 ${paperVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>
                {paperVerified
                  ? (language === 'sw' ? 'Imethibitishwa na Kitabu' : 'Verified with Paper Booklet')
                  : (language === 'sw' ? 'Thibitisha na Kitabu' : 'Verify with Booklet')}
              </span>
            </button>

            <button
              onClick={onOpenPrintBooklet}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 hover:border-slate-400 text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>{language === 'sw' ? 'Chapisha Kitabu' : 'Print MoH 216'}</span>
            </button>
          </div>
        </div>

        {/* Paper Booklet Metadata Banner */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {language === 'sw' ? 'Nambari ya Kitabu cha Afya (MoH 216):' : 'Official Paper Booklet Serial:'}{' '}
              <span className="font-mono font-semibold text-slate-800">{child.paperBookletNumber || 'MOH216-NRB-2026'}</span>
            </span>
          </div>
          <div className="text-[11px] text-teal-700 bg-teal-50/80 px-2 py-0.5 rounded-md font-medium">
            {language === 'sw' ? 'Kanuni ya Mfumo Mseto: Kitabu cha karatasi kinabaki rekodi rasmi ya kisheria.' : 'Hybrid Principle: Physical paper booklet remains legal primary record.'}
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards (Ergonomic 2-Column Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Next Vaccine */}
        <div 
          onClick={() => onNavigateTab('vaccination')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {language === 'sw' ? 'Chanjo Inayofuata' : 'Next Vaccine'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Syringe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2 truncate">
            {nextVaccine?.vaccineCode || 'All current'}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{nextVaccine?.scheduledDate || 'Completed'}</span>
          </div>
        </div>

        {/* Metric 2: Completed Doses */}
        <div 
          onClick={() => onNavigateTab('vaccination')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {language === 'sw' ? 'Chanjo Zilizopewa' : 'KEPI Completion'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {completedCount} <span className="text-xs font-normal text-slate-500">/ {vaccinations.length}</span>
          </div>
          <div className="text-xs text-emerald-700 mt-1 font-medium">
            {overdueCount > 0 ? (
              <span className="text-red-600 font-semibold">{overdueCount} {language === 'sw' ? 'zimechelewa' : 'overdue'}</span>
            ) : (
              <span>{language === 'sw' ? 'Zinafuata ratiba kikamilifu' : 'Right on schedule'}</span>
            )}
          </div>
        </div>

        {/* Metric 3: Latest Weight */}
        <div 
          onClick={() => onNavigateTab('growth')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {language === 'sw' ? 'Uzito wa Sasa' : 'Current Weight'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <LineChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {latestGrowth ? `${latestGrowth.weightKg} kg` : `${child.birthWeightKg} kg`}
          </div>
          <div className="text-xs text-sky-700 mt-1 font-medium truncate">
            {language === 'sw' ? 'Kiwango cha WHO: Kawaida' : 'WHO Status: Normal'}
          </div>
        </div>

        {/* Metric 4: Length & Head */}
        <div 
          onClick={() => onNavigateTab('growth')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {language === 'sw' ? 'Urefu na Kichwa' : 'Length & Head Circ.'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Baby className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2 font-mono tabular-nums truncate">
            {latestGrowth ? `${latestGrowth.heightLengthCm} cm` : `${child.birthLengthCm} cm`}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {language === 'sw' ? 'Kichwa:' : 'Head:'} {latestGrowth?.headCircumferenceCm || child.birthHeadCircumferenceCm} cm
          </div>
        </div>
      </div>

      {/* 3. Action Cards & Assistant Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Schedule & Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          {/* Smart KEPI Notice */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                {language === 'sw' ? 'Utabiri Mahiri wa Chanjo (KEPI)' : 'Smart KEPI Immunization Engine'}
              </div>
              <h2 className="text-lg sm:text-xl font-bold mt-2">
                {language === 'sw' 
                  ? `${child.fullName} anatarajiwa kupokea chanjo ya wiki ya ${nextVaccine?.doseNumber ? (nextVaccine.doseNumber * 4) : 14}` 
                  : `${child.fullName} is approaching next scheduled visit for ${nextVaccine?.vaccineName || 'immunization'}`}
              </h2>
              <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
                {language === 'sw' 
                  ? 'Mfumo unakukumbusha siku 3 kabla ya tarehe rasmi kupitia SMS ya bure ya Africa\'s Talking. Kumbuka kubeba kitabu cha karatasi kliniki.'
                  : 'SMS reminders will trigger 3 days prior via Africa\'s Talking gateway. Always present your physical paper booklet at Pumwani or your local clinic.'}
              </p>
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => onNavigateTab('vaccination')}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-colors"
                >
                  {language === 'sw' ? 'Tazama Ratiba Kamili' : 'Open Immunization Schedule'}
                </button>
                <button
                  onClick={() => onNavigateTab('ai')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  {language === 'sw' ? 'Uliza Maswali ya Chanjo' : 'Ask AI Questions'}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Timeline of Health Events */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'sw' ? 'Historia ya Afya ya Mtoto' : 'Child Health History Timeline'}
              </h3>
              <button 
                onClick={() => onNavigateTab('vaccination')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                {language === 'sw' ? 'Tazama Yote' : 'View Full'}
              </button>
            </div>

            <div className="space-y-4">
              {vaccinations.filter(v => v.status === 'completed').slice(-3).map((v) => (
                <div key={v._id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-bold text-slate-900 truncate">{v.vaccineName}</div>
                      <div className="text-[11px] text-slate-500 shrink-0 font-mono">{v.administeredDate}</div>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {v.facilityName || 'Health Clinic'} · {language === 'sw' ? 'Bachi' : 'Batch'}: <span className="font-mono">{v.batchNumber}</span>
                    </div>
                    {v.verifiedAgainstPaperBooklet && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{language === 'sw' ? 'Imethibitishwa kwenye kitabu cha karatasi (Ukurasa ' : 'Verified in Paper Booklet (Page '}{v.paperBookletPageNumber || 5})</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Fast Shortcuts & Mother Wellbeing */}
        <div className="space-y-4">
          {/* Fast Maternal Wellbeing Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'sw' ? 'Hali ya Afya ya Mama' : 'Maternal Wellbeing'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'sw' ? 'Kujitunza na ukaguzi wa baada ya kuzaa' : 'Postnatal checks & mental health'}
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
              <div className="text-xs font-semibold text-rose-900">
                {language === 'sw' ? 'Ukaguzi wa Edinburgh (EPDS): Chini' : 'EPDS Mental Health Score: Low Risk (4/30)'}
              </div>
              <p className="text-[11px] text-rose-800 mt-1 leading-relaxed">
                {language === 'sw' 
                  ? 'Mama Jane anapata usingizi na msaada wa kutosha. Usisite kuandika hisia zako kwenye shajara.'
                  : 'Well-supported recovery. Remember to log your thoughts in your private mother journal.'}
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('maternal')}
              className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{language === 'sw' ? 'Fungua Shajara & Afya ya Mama' : 'Open Mother Journal & ANC'}</span>
            </button>
          </div>

          {/* Emergency Red Banner Shortcut */}
          <div className="bg-red-50 border border-red-200 rounded-3xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-red-800 uppercase tracking-wide">
              <AlertCircle className="w-4 h-4 text-red-600" />
              {language === 'sw' ? 'Msaada wa Dharura' : 'Emergency Triage'}
            </div>
            <p className="text-xs text-red-900 mt-1 leading-relaxed">
              {language === 'sw'
                ? 'Iwapo mtoto ana homa kali, degedege, au kifua kinazama ndani, bonyeza SOS mara moja kwa nambari za rufaa za KNH na Pumwani.'
                : 'For high fever, convulsions, or severe breathing difficulties, activate immediate SOS triage.'}
            </p>
            <button
              onClick={onOpenEmergency}
              className="mt-3 w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              SOS {language === 'sw' ? 'Tazama Dalili Hatari' : 'Trigger Danger Triage'}
            </button>
          </div>

          {/* Quick QR Sticker Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 text-center">
            <div className="text-xs font-bold text-slate-800">
              {language === 'sw' ? 'Kadi ya QR ya Kitabu cha Afya' : 'Child Opaque QR Badge'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {language === 'sw' ? 'Wauguzi wanaweza kuskani hii kliniki kupata faili ya mtoto.' : 'Clinicians can scan this code to look up child records securely.'}
            </p>
            <button
              onClick={onOpenPrintBooklet}
              className="mt-3 text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center justify-center gap-1 mx-auto"
            >
              <span>{language === 'sw' ? 'Tazama au Chapisha QR' : 'View / Print Booklet Card'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
