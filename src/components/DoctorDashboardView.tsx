import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  QrCode, 
  ShieldCheck, 
  Plus, 
  Syringe, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  FileText, 
  Send,
  Building2,
  Calendar,
  Check,
  ChevronRight
} from 'lucide-react';
import { AppLanguage, Child, VaccinationRecord, GrowthMeasurement } from '../types';

interface DoctorDashboardViewProps {
  childrenList: Child[];
  activeChild: Child;
  vaccinations: VaccinationRecord[];
  growth: GrowthMeasurement[];
  language: AppLanguage;
  onSelectChild: (c: Child) => void;
  onRefresh: () => void;
  onOpenPrintBooklet: () => void;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
  childrenList,
  activeChild,
  vaccinations,
  growth,
  language,
  onSelectChild,
  onRefresh,
  onOpenPrintBooklet
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [qrTokenInput, setQrTokenInput] = useState('');
  const [quickAdministerVaccine, setQuickAdministerVaccine] = useState<string>('PENTA-3');
  const [batchNo, setBatchNo] = useState('KEPI-PWM-2026-08');
  const [bookletPage, setBookletPage] = useState('7');
  const [isMarkingDone, setIsMarkingDone] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Today's clinic queue
  const clinicQueue = [
    {
      child: childrenList[0],
      time: '08:45 AM',
      reason: '14-week KEPI vaccinations & growth check',
      triageStatus: 'routine' as const,
      waitMins: 12
    },
    {
      child: childrenList[1],
      time: '09:00 AM',
      reason: 'Twin B - 14-week routine vaccination',
      triageStatus: 'routine' as const,
      waitMins: 8
    },
    {
      child: childrenList[2] || childrenList[0],
      time: '09:20 AM',
      reason: 'Mild fever check & 9-month Measles catch-up',
      triageStatus: 'urgent' as const,
      waitMins: 4
    }
  ];

  const handleAdministerNow = async (vaccineCode: string) => {
    setIsMarkingDone(true);
    try {
      const rec = vaccinations.find(v => v.vaccineCode === vaccineCode && v.status !== 'completed');
      if (rec) {
        await fetch(`/api/children/${activeChild._id}/vaccinations/${rec._id}/administer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            batchNumber: batchNo,
            facilityName: 'Pumwani Maternity Hospital (MCH Unit)',
            verifiedAgainstPaperBooklet: true,
            paperBookletPageNumber: Number(bookletPage)
          })
        });
      }
      setSuccessMsg(language === 'sw' 
        ? `Chanjo ya ${vaccineCode} imerekodiwa kwa mafanikio na kuthibitishwa kwenye kitabu cha karatasi!` 
        : `Vaccine ${vaccineCode} administered and signed in physical MoH 216 paper booklet!`);
      setTimeout(() => setSuccessMsg(null), 4000);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsMarkingDone(false);
    }
  };

  const handleLookupQr = async () => {
    const token = qrTokenInput || activeChild.opaqueQrToken;
    try {
      const res = await fetch('/api/qr/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrToken: token })
      });
      const d = await res.json();
      if (d.success) {
        onSelectChild(d.child);
        setSuccessMsg(language === 'sw' ? `Faili ya ${d.child.fullName} imefunguliwa salama!` : `Patient record loaded: ${d.child.fullName}`);
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Clinician & Facility Command Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/30 text-teal-400 flex items-center justify-center font-bold text-2xl shrink-0">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight">Dr. Faith Wanjiku, MBChB</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-teal-500 text-slate-950 rounded-md">
                Doctor / Clinician
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-teal-400" />
                Pumwani Maternity Hospital · Level 6 Specialized Referral
              </span>
              <span aria-hidden="true">·</span>
              <span>License: <strong className="font-mono text-white">KMPDC/A-94821</strong></span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Authorized MoH 216 Signatory</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            onClick={onOpenPrintBooklet}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-teal-400" />
            <span>{language === 'sw' ? 'Chapisha Kitabu (MoH 216)' : 'Print MoH 216 Booklet'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. Today's Clinic Queue & Active Patient Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 span): Today's Queue */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">
                {language === 'sw' ? 'Foleni ya Kliniki Leo' : 'Today\'s Clinic Queue'}
              </h2>
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
              {clinicQueue.length} {language === 'sw' ? 'Wagonjwa' : 'Patients'}
            </span>
          </div>

          <div className="space-y-2">
            {clinicQueue.map((item, idx) => {
              const isSelected = activeChild._id === item.child._id;
              return (
                <div
                  key={idx}
                  onClick={() => onSelectChild(item.child)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.child.fullName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.reason}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.triageStatus === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.time}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Kitabu: {item.child.paperBookletNumber}</span>
                    <span className="text-teal-700 font-semibold flex items-center gap-0.5">
                      {isSelected ? (language === 'sw' ? 'Inafunguliwa sasa' : 'Active Chart') : (language === 'sw' ? 'Fungua' : 'Inspect')}
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* QR Scanner Quick Token Input */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-teal-600" />
              <span>{language === 'sw' ? 'Skani Kadi ya QR ya Kitabu:' : 'Lookup by Opaque QR Token:'}</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={qrTokenInput}
                onChange={e => setQrTokenInput(e.target.value)}
                placeholder={activeChild.opaqueQrToken}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <button
                onClick={handleLookupQr}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
              >
                {language === 'sw' ? 'Tafuta' : 'Find'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (2 spans): Rapid Clinical Chart & Rapid Administer Console */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Patient Bio Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wide">
                  {language === 'sw' ? 'Faili ya Mgonjwa Aliyechaguliwa' : 'Active Patient Clinical Chart'}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {activeChild.fullName}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>DOB: <strong>{activeChild.dateOfBirth}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>{language === 'sw' ? 'Kitabu cha MoH 216' : 'MCH Booklet No.'}: <strong className="font-mono text-slate-800">{activeChild.paperBookletNumber}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>{activeChild.birthFacility}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'sw' ? 'Kitabu cha Karatasi Kimehakikiwa' : 'MoH 216 Verified'}</span>
                </span>
              </div>
            </div>

            {/* Doctor's 1-Click KEPI Administration Console */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-950 uppercase tracking-wide">
                  <Syringe className="w-4 h-4 text-teal-700" />
                  <span>{language === 'sw' ? 'Utoaji wa Chanjo ya Haraka (Inasasisha Simu ya Mama Mara Moja)' : 'Direct Vaccine Administration (Real-Time Sync)'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-teal-900 mb-1">
                    {language === 'sw' ? 'Chagua Chanjo' : 'Select Vaccine'}
                  </label>
                  <select
                    value={quickAdministerVaccine}
                    onChange={e => setQuickAdministerVaccine(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-teal-300 rounded-xl bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="PENTA-3">Pentavalent 3 (DPT-HepB-Hib)</option>
                    <option value="PCV-3">PCV 3 (Pneumococcal 3)</option>
                    <option value="OPV-3">OPV 3 (Oral Polio 3)</option>
                    <option value="IPV">IPV (Inactivated Polio Injection)</option>
                    <option value="ROTA-2">Rotavirus 2</option>
                    <option value="MR-1">Measles-Rubella 1 (9 Months)</option>
                    <option value="VIT-A-1">Vitamin A (100,000 IU)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-teal-900 mb-1">
                    {language === 'sw' ? 'Nambari ya Bachi (Batch)' : 'Vaccine Batch Number'}
                  </label>
                  <input
                    type="text"
                    value={batchNo}
                    onChange={e => setBatchNo(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-teal-300 rounded-xl bg-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-teal-900 mb-1">
                    {language === 'sw' ? 'Ukurasa wa Kitabu' : 'Booklet Page Number'}
                  </label>
                  <input
                    type="number"
                    value={bookletPage}
                    onChange={e => setBookletPage(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-teal-300 rounded-xl bg-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-teal-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'sw' ? 'Hutia sahihi ya dijitali ya Daktari na kuweka muhuri wa Pumwani' : 'Digitally signed by Dr. Faith Wanjiku with facility stamp'}</span>
                </div>

                <button
                  onClick={() => handleAdministerNow(quickAdministerVaccine)}
                  disabled={isMarkingDone}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isMarkingDone ? 'Inarekodi...' : (language === 'sw' ? 'Thibitisha Utoaji & Saini Kitabu' : 'Mark Administered & Sign')}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Summary of Child's Current Vaccines */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                {language === 'sw' ? 'Hali ya Chanjo za Mtoto Huyu' : 'Child\'s Immunization Ledger'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {vaccinations.slice(0, 8).map(v => (
                  <div key={v._id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <div className="font-bold text-slate-900 truncate">{v.vaccineCode}</div>
                    <div className="text-[10px] text-slate-500 truncate">{v.scheduledDate}</div>
                    <div className="mt-1">
                      {v.status === 'completed' ? (
                        <span className="text-[10px] font-bold text-emerald-700">✓ Given</span>
                      ) : (
                        <span className="text-[10px] font-medium text-amber-700">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
