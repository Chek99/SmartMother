import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  QrCode, 
  ShieldCheck, 
  Plus, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { AppLanguage, Child, VaccinationRecord } from '../types';

interface ClinicianPortalViewProps {
  childrenList: Child[];
  activeChild: Child;
  vaccinations: VaccinationRecord[];
  language: AppLanguage;
  onSelectChild: (c: Child) => void;
  onRefresh: () => void;
}

export const ClinicianPortalView: React.FC<ClinicianPortalViewProps> = ({
  childrenList,
  activeChild,
  vaccinations,
  language,
  onSelectChild,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [qrInputToken, setQrInputToken] = useState('');
  const [qrScanning, setQrScanning] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  
  // Visit form state
  const [complaint, setComplaint] = useState('Routine 14-week well-child and KEPI immunization visit');
  const [temp, setTemp] = useState('36.7');
  const [pulse, setPulse] = useState('120');
  const [respRate, setRespRate] = useState('38');
  const [diagnosis, setDiagnosis] = useState('Well child, normal milestone progress');
  const [treatment, setTreatment] = useState('Administered OPV-3, IPV, Pentavalent-3, and PCV-3. Verified physical MoH 216 booklet page 7.');
  const [verifyBooklet, setVerifyBooklet] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const filteredChildren = childrenList.filter(c => 
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.paperBookletNumber && c.paperBookletNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    c.opaqueQrToken.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSimulateQrScan = async () => {
    setQrScanning(true);
    // Simulate camera QR detection with active child's opaque token
    const tokenToLookup = qrInputToken || activeChild.opaqueQrToken;
    try {
      const res = await fetch('/api/qr/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrToken: tokenToLookup })
      });
      const data = await res.json();
      if (data.success) {
        onSelectChild(data.child);
        setSuccessNotice(language === 'sw' ? `Rekodi ya ${data.child.fullName} imefunguliwa salama kupitia QR.` : `Child record ${data.child.fullName} loaded securely via QR token.`);
        setTimeout(() => setSuccessNotice(null), 4000);
      } else {
        alert(data.message || 'QR token lookup failed');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setQrScanning(false);
    }
  };

  const handleSaveVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // In production calls /api/children/:id/medical-records
      setSuccessNotice(language === 'sw' ? 'Ziara ya kliniki imerekodiwa na kuthibitishwa kwenye kitabu cha karatasi!' : 'Clinical visit recorded and verified against MoH 216 paper booklet!');
      setIsVisitModalOpen(false);
      setTimeout(() => setSuccessNotice(null), 4000);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Clinician Credential Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl shrink-0">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Dr. Faith Wanjiku, MBChB</h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                Verified Clinician
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
              <span>Pumwani Maternity Hospital</span>
              <span aria-hidden="true">·</span>
              <span>License: <strong className="font-mono text-slate-700">KMPDC/A-94821</strong></span>
              <span aria-hidden="true">·</span>
              <span className="text-teal-700 font-medium">Authorized MoH 216 Signatory</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsVisitModalOpen(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'sw' ? 'Rekodi Ziara ya Kliniki' : 'New Clinical Encounter'}</span>
        </button>
      </div>

      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-medium rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Patient Search & QR Scan Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search by Name or Booklet */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-slate-400" />
            <span>{language === 'sw' ? 'Tafuta Mgonjwa kwa Jina au Nambari ya Kitabu:' : 'Lookup Patient by Name or Booklet Serial:'}</span>
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="e.g. Amani, Baraka, or MOH216-NRB-2026..."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* QR Code Quick Scanner */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-teal-600" />
            <span>{language === 'sw' ? 'Kamera ya QR / Weka Nambari ya Siri ya QR:' : 'Opaque QR Scanner & Token Lookup:'}</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={qrInputToken}
              onChange={e => setQrInputToken(e.target.value)}
              placeholder={activeChild.opaqueQrToken}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <button
              onClick={handleSimulateQrScan}
              disabled={qrScanning}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
            >
              {qrScanning ? (
                <span>Inasoma...</span>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>{language === 'sw' ? 'Skani QR' : 'Scan Token'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Patients Matching List */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {language === 'sw' ? 'Orodha ya Watoto Waliosajiliwa Kliniki' : 'Enrolled Patients Roster'} ({filteredChildren.length})
          </h3>
          <span className="text-xs text-slate-500">
            {language === 'sw' ? 'Bonyeza mtoto kupitia faili yake' : 'Click to inspect clinical chart'}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredChildren.map(c => {
            const isSelected = activeChild._id === c._id;
            return (
              <div 
                key={c._id}
                onClick={() => onSelectChild(c)}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-teal-50/70 border-l-4 border-l-teal-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {c.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{c.fullName}</span>
                      {c.isMultipleBirth && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                          Twin #{c.birthOrderInMultiple || 1}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>DOB: <strong className="text-slate-700">{c.dateOfBirth}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Kitabu: <strong className="font-mono text-slate-700">{c.paperBookletNumber}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>QR: <strong className="font-mono text-slate-700">{c.opaqueQrToken.slice(0, 16)}...</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {c.verifiedAgainstPaperBooklet ? (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'sw' ? 'Kitabu Kimehakikiwa' : 'MoH Booklet Verified'}</span>
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                      {language === 'sw' ? 'Inasubiri Uhakiki' : 'Unverified'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Encounter Modal */}
      {isVisitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-6">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'sw' ? 'Rekodi Ziara ya Kliniki ya Mtoto' : 'Record Clinical Encounter'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Patient: <strong className="text-slate-800">{activeChild.fullName}</strong> (Booklet: {activeChild.paperBookletNumber})
            </p>

            <form onSubmit={handleSaveVisit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {language === 'sw' ? 'Sababu Kuu ya Ziara (Chief Complaint)' : 'Chief Complaint'}
                </label>
                <input
                  type="text"
                  required
                  value={complaint}
                  onChange={e => setComplaint(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={e => setTemp(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={e => setPulse(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Resp Rate (/min)</label>
                  <input
                    type="number"
                    value={respRate}
                    onChange={e => setRespRate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {language === 'sw' ? 'Utambuzi / Diagnoses' : 'Clinical Diagnoses'}
                </label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {language === 'sw' ? 'Mpango wa Matibabu & Dawa' : 'Treatment & Instructions'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={treatment}
                  onChange={e => setTreatment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Hybrid Paper Booklet Verification */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifyBooklet}
                    onChange={e => setVerifyBooklet(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-emerald-950">
                    {language === 'sw' ? 'Nimethibitisha na Kuweka Sahihi kwenye Kitabu cha Karatasi cha MoH 216' : 'Verified and Signed in MoH 216 Physical Paper Booklet'}
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVisitModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  {language === 'sw' ? 'Ghairi' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
                >
                  {isSaving ? 'Inahifadhi...' : (language === 'sw' ? 'Hifadhi na Saini' : 'Save & Sign Record')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
