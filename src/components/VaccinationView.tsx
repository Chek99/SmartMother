import React, { useState } from 'react';
import { 
  Syringe, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Download, 
  Send, 
  Plus, 
  FileSpreadsheet,
  Calendar,
  Sparkles
} from 'lucide-react';
import { AppLanguage, Child, VaccinationRecord } from '../types';

interface VaccinationViewProps {
  child: Child;
  vaccinations: VaccinationRecord[];
  language: AppLanguage;
  onRefresh: () => void;
}

export const VaccinationView: React.FC<VaccinationViewProps> = ({
  child,
  vaccinations,
  language,
  onRefresh
}) => {
  const [filter, setFilter] = useState<'all' | 'due' | 'overdue' | 'completed'>('all');
  const [administerModalRec, setAdministerModalRec] = useState<VaccinationRecord | null>(null);
  const [batchNo, setBatchNo] = useState('KEPI-BATCH-2026');
  const [facilityName, setFacilityName] = useState('Pumwani Maternity Hospital');
  const [verifyWithPaper, setVerifyWithPaper] = useState(true);
  const [pageNumber, setPageNumber] = useState('5');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smsTriggerStatus, setSmsTriggerStatus] = useState<string | null>(null);

  const filteredVaccinations = vaccinations.filter(v => {
    if (filter === 'all') return true;
    if (filter === 'due') return v.status === 'due';
    if (filter === 'overdue') return v.status === 'overdue';
    if (filter === 'completed') return v.status === 'completed';
    return true;
  });

  const handleAdminister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!administerModalRec) return;
    setIsSubmitting(true);

    try {
      await fetch(`/api/children/${child._id}/vaccinations/${administerModalRec._id}/administer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchNumber: batchNo,
          facilityName,
          verifiedAgainstPaperBooklet: verifyWithPaper,
          paperBookletPageNumber: pageNumber
        })
      });
      setAdministerModalRec(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReminder = async (v: VaccinationRecord) => {
    setSmsTriggerStatus(`Inatuma SMS ya ${v.vaccineCode}...`);
    try {
      const msg = `MAMACARE KEPI REMINDER: ${child.fullName} is due for ${v.vaccineName} on ${v.scheduledDate}. Please visit Pumwani Maternity or your nearest health facility. Carry your MoH 216 paper booklet!`;
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '+254712345678',
          message: msg
        })
      });
      const data = await res.json();
      if (data.success) {
        setSmsTriggerStatus(language === 'sw' ? 'SMS imetumwa kwa mama kupitia Africa\'s Talking!' : 'SMS dispatched to mother via Africa\'s Talking!');
        setTimeout(() => setSmsTriggerStatus(null), 4000);
      }
    } catch (e) {
      console.error(e);
      setSmsTriggerStatus('SMS dispatch error.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wide">
            <Syringe className="w-4 h-4" />
            <span>Kenya Expanded Programme on Immunization (KEPI)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            {language === 'sw' ? 'Ratiba ya Chanjo za Mtoto' : 'Child Immunization Schedule'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'sw' 
              ? `Imehesabiwa kiotomatiki kutoka tarehe ya kuzaliwa (${child.dateOfBirth}) kulingana na miongozo ya Wizara ya Afya.`
              : `Auto-computed from DOB (${child.dateOfBirth}) according to Kenya Ministry of Health standards.`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={`/api/children/${child._id}/moh-csv`}
            download
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{language === 'sw' ? 'Pakua CSV (DHIS2)' : 'Export CSV (DHIS2)'}</span>
          </a>
          <a
            href={`/api/children/${child._id}/fhir`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>{language === 'sw' ? 'Pakua FHIR R4' : 'HL7 FHIR JSON'}</span>
          </a>
        </div>
      </div>

      {smsTriggerStatus && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium rounded-2xl flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{smsTriggerStatus}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'sw' ? 'Zote' : 'All Doses'} ({vaccinations.length})
        </button>
        <button
          onClick={() => setFilter('due')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            filter === 'due' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'sw' ? 'Zinazotakiwa Sasa' : 'Due Now'} ({vaccinations.filter(v => v.status === 'due').length})
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            filter === 'overdue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'sw' ? 'Zilizochelewa' : 'Overdue'} ({vaccinations.filter(v => v.status === 'overdue').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            filter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'sw' ? 'Zilizopewa' : 'Completed'} ({vaccinations.filter(v => v.status === 'completed').length})
        </button>
      </div>

      {/* Vaccine List Cards */}
      <div className="space-y-3">
        {filteredVaccinations.map((vac) => {
          const isDone = vac.status === 'completed';
          const isOverdue = vac.status === 'overdue';
          const isDue = vac.status === 'due';

          return (
            <div 
              key={vac._id}
              className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all ${
                isDone 
                  ? 'border-emerald-200' 
                  : isOverdue 
                    ? 'border-red-300 bg-red-50/20' 
                    : isDue 
                      ? 'border-amber-300 bg-amber-50/20' 
                      : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isDone 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : isOverdue 
                        ? 'bg-red-100 text-red-800' 
                        : isDue 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isOverdue ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-slate-900">{vac.vaccineName}</span>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {vac.vaccineCode}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                      <span>{language === 'sw' ? 'Tarehe ya Ratiba' : 'Scheduled'}: <strong className="text-slate-800">{vac.scheduledDate}</strong></span>
                      {vac.predictedDate && vac.status !== 'completed' && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-teal-700 font-medium">
                            {language === 'sw' ? 'Tarehe ya Kufidia' : 'Recommended Catch-Up'}: {vac.predictedDate}
                          </span>
                        </>
                      )}
                      {vac.administeredDate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 font-semibold">
                            {language === 'sw' ? 'Ilipewa' : 'Administered'}: {vac.administeredDate}
                          </span>
                        </>
                      )}
                    </div>

                    {isDone && (
                      <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                        <span>{language === 'sw' ? 'Kituo' : 'Facility'}: {vac.facilityName || 'Clinic'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{language === 'sw' ? 'Bachi' : 'Batch'}: <strong className="font-mono text-slate-800">{vac.batchNumber}</strong></span>
                        {vac.verifiedAgainstPaperBooklet && (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            {language === 'sw' ? `Imeandikwa Kitabuni (Uk. ${vac.paperBookletPageNumber || 5})` : `In MoH Booklet (p. ${vac.paperBookletPageNumber || 5})`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!isDone && (
                    <>
                      <button
                        onClick={() => handleSendReminder(vac)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1 transition-colors"
                        title="Simulate SMS reminder to mother"
                      >
                        <Send className="w-3.5 h-3.5 text-teal-600" />
                        <span>SMS</span>
                      </button>

                      <button
                        onClick={() => {
                          setAdministerModalRec(vac);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{language === 'sw' ? 'Rekodi Chanjo' : 'Mark Administered'}</span>
                      </button>
                    </>
                  )}

                  {isDone && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      {language === 'sw' ? 'Imekamilika' : 'Administered'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Administration Modal */}
      {administerModalRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'sw' ? 'Rekodi Utoaji wa Chanjo' : 'Administer Vaccine Record'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {administerModalRec.vaccineName} ({administerModalRec.vaccineCode})
            </p>

            <form onSubmit={handleAdminister} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {language === 'sw' ? 'Nambari ya Bachi ya Chanjo' : 'Vaccine Batch / Lot Number'}
                </label>
                <input
                  type="text"
                  required
                  value={batchNo}
                  onChange={e => setBatchNo(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {language === 'sw' ? 'Kituo cha Afya' : 'Administering Facility'}
                </label>
                <input
                  type="text"
                  required
                  value={facilityName}
                  onChange={e => setFacilityName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Hybrid Booklet Verification Checkbox */}
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifyWithPaper}
                    onChange={e => setVerifyWithPaper(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-emerald-950">
                    {language === 'sw' ? 'Imethibitishwa kwenye Kitabu cha Karatasi (MoH 216)' : 'Verified against Paper Booklet (MoH 216)'}
                  </span>
                </label>
                {verifyWithPaper && (
                  <div>
                    <label className="block text-[11px] font-medium text-emerald-900 mb-1">
                      {language === 'sw' ? 'Ukurasa wa Kitabu' : 'Booklet Page Number'}
                    </label>
                    <input
                      type="number"
                      value={pageNumber}
                      onChange={e => setPageNumber(e.target.value)}
                      className="w-24 px-2 py-1 text-xs border border-emerald-300 rounded-lg bg-white"
                      placeholder="e.g. 5"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdministerModalRec(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  {language === 'sw' ? 'Ghairi' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
                >
                  {isSubmitting ? 'Inahifadhi...' : (language === 'sw' ? 'Hifadhi Rekodi' : 'Save Record')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
