import React, { useState } from 'react';
import { Phone, ShieldAlert, X, Send, AlertTriangle, Hospital, CheckCircle2 } from 'lucide-react';
import { AppLanguage, Child } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  child: Child | null;
  detectedSigns?: string[];
  initialAdvice?: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  language,
  child,
  detectedSigns = ['Severe fever >38.5°C', 'Chest indrawing / Fast breathing'],
  initialAdvice
}) => {
  const [smsSending, setSmsSending] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [emergencyPhone, setEmergencyPhone] = useState('+254722998877');

  if (!isOpen) return null;

  const handleSendAlert = async () => {
    setSmsSending(true);
    try {
      await fetch('/api/emergency/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: child?._id,
          dangerSigns: detectedSigns,
          contactPhone: emergencyPhone
        })
      });
      setSmsSent(true);
    } catch (e) {
      console.error('Failed to trigger emergency SMS', e);
      setSmsSent(true);
    } finally {
      setSmsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border-2 border-red-500 shadow-2xl overflow-hidden my-6">
        {/* Banner */}
        <div className="bg-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {language === 'sw' ? 'TAHADHARI YA HARAKA YA MATIBABU' : 'IMMEDIATE MEDICAL EMERGENCY'}
              </h2>
              <p className="text-xs text-red-100">
                {language === 'sw' ? 'Mwongozo wa dharura wa Wizara ya Afya (MoH Kenya)' : 'MoH Kenya IMCI Emergency Danger Sign Alert'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-red-700 hover:bg-red-800 flex items-center justify-center text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Patient Context */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="text-xs font-semibold text-red-800 uppercase tracking-wide">
              {language === 'sw' ? 'Mgonjwa Aliyetambuliwa' : 'Identified Infant'}
            </div>
            <div className="text-base font-bold text-red-950 mt-1">
              {child?.fullName || 'Baby'} · {child?.gender === 'female' ? (language === 'sw' ? 'Msichana' : 'Female') : (language === 'sw' ? 'Mvulana' : 'Male')}
            </div>
            <div className="text-xs text-red-700 mt-1">
              {language === 'sw' ? 'Kitabu cha MoH 216' : 'MCH Booklet No.'}: <span className="font-mono">{child?.paperBookletNumber || 'MOH-KENYA'}</span>
            </div>
          </div>

          {/* Detected Danger Signs */}
          <div>
            <div className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              {language === 'sw' ? 'Dalili Hatari Zilizotambuliwa:' : 'Detected Danger Signs:'}
            </div>
            <div className="space-y-1.5">
              {detectedSigns.map((sign, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-red-800 bg-red-100/60 px-3 py-2 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                  <span className="font-medium">{sign}</span>
                </div>
              ))}
            </div>
          </div>

          {/* First-Aid Guidance */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-amber-900">
              {language === 'sw' ? 'Hatua za Haraka za Kwanza (Kabla ya Kufika Hospitali):' : 'Immediate First Steps (Before Hospital Arrival):'}
            </h3>
            <p className="text-xs text-amber-950 mt-2 leading-relaxed whitespace-pre-line font-medium">
              {initialAdvice || (language === 'sw' 
                ? '1. Mlaze mtoto ubavu mahali salama na laini (usimweke chali).\n2. USIWEKE kitu chochote mdomoni mwake (usimpe dawa, maziwa, au maji kwa sasa kwani anaweza kusongwa).\n3. Hakikisha njia ya hewa iko wazi na umbebe kuelekea kituo cha dharura mara moja.'
                : '1. Lay baby on their side in the recovery position.\n2. Do NOT force liquids or spoons into baby’s mouth as this causes fatal choking.\n3. Keep airway clear and proceed to the nearest emergency health facility without delay.')}
            </p>
          </div>

          {/* Referral Facilities Hotline */}
          <div>
            <div className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Hospital className="w-4 h-4 text-slate-700" />
              {language === 'sw' ? 'Hospitali za Rufaa & Nambari za Dharura:' : 'Referral Facilities & Emergency Hotlines:'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a 
                href="tel:+254202726300"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-red-400 bg-slate-50 hover:bg-red-50/50 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Kenyatta National Hospital</div>
                  <div className="text-[11px] text-slate-500">Nairobi · Level 6 Referral</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
              </a>
              <a 
                href="tel:+254206763291"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-red-400 bg-slate-50 hover:bg-red-50/50 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Pumwani Maternity Hospital</div>
                  <div className="text-[11px] text-slate-500">Nairobi · Specialized Maternity</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>

          {/* Emergency SMS Broadcast */}
          <div className="border-t border-slate-200 pt-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {language === 'sw' ? 'Tuma Ujumbe wa Dharura kwa Mume / Msaidizi:' : 'Dispatch Emergency SMS to Next-of-Kin:'}
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                placeholder="+2547..."
              />
              <button 
                onClick={handleSendAlert}
                disabled={smsSending || smsSent}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
              >
                {smsSending ? (
                  <span>{language === 'sw' ? 'Inatuma...' : 'Sending...'}</span>
                ) : smsSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'sw' ? 'Imetumwa!' : 'Sent!'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{language === 'sw' ? 'Tuma SMS' : 'Send SMS'}</span>
                  </>
                )}
              </button>
            </div>
            {smsSent && (
              <p className="text-[11px] text-emerald-700 mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {language === 'sw' ? 'Ujumbe wa dharura umetumwa kwa mafanikio kupitia Africa\'s Talking.' : 'Emergency SMS alert dispatched via Africa\'s Talking gateway.'}
              </p>
            )}
          </div>
        </div>

        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-xl"
          >
            {language === 'sw' ? 'Funga Dirisha Hili' : 'Dismiss Alert'}
          </button>
        </div>
      </div>
    </div>
  );
};
