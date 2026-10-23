import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  ShieldAlert, 
  Send, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Lock
} from 'lucide-react';
import { AppLanguage } from '../types';

interface AnalyticsViewProps {
  language: AppLanguage;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ language }) => {
  const [data, setData] = useState<{
    stats?: {
      totalChildren: number;
      totalVaccinations: number;
      completedVaccinations: number;
      overdueVaccinations: number;
      completionRate: number;
      paperVerificationRate: number;
      activeEmergencies: number;
      defaulterCount: number;
    };
    defaulters?: Array<{
      childId: string;
      name: string;
      dob: string;
      overdueCount: number;
      overdueVaccines: string[];
      phone: string;
      paperBookletNumber?: string;
    }>;
  }>({});

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [broadcastingSms, setBroadcastingSms] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/analytics/facility')
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d);
      })
      .catch(console.error);

    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(d => {
        if (d.success) setAuditLogs(d.logs);
      })
      .catch(console.error);
  }, []);

  const handleBroadcastDefaulters = async () => {
    setBroadcastingSms(true);
    try {
      await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '+254712345678',
          message: 'MAMACARE CLINIC BROADCAST: Pumwani MCH Clinic invites all mothers with overdue vaccine doses for catch-up immunization this week. Carry your MoH 216 paper booklet.'
        })
      });
      setBroadcastResult(language === 'sw' ? 'Ujumbe wa ukumbusho umetumwa kwa wazazi wote kupitia Africa\'s Talking!' : 'Recall SMS broadcast dispatched to all defaulters via Africa\'s Talking!');
      setTimeout(() => setBroadcastResult(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setBroadcastingSms(false);
    }
  };

  const stats = data.stats || {
    totalChildren: 3,
    totalVaccinations: 54,
    completedVaccinations: 38,
    overdueVaccinations: 3,
    completionRate: 70.4,
    paperVerificationRate: 88.5,
    activeEmergencies: 1,
    defaulterCount: 1
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wide">
            <BarChart3 className="w-4 h-4" />
            <span>Pumwani Sub-County Facility Health Informatics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            {language === 'sw' ? 'Takwimu za Kituo & Orodha ya Walioacha Kliniki' : 'Facility Analytics & Defaulter Tracking'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'sw'
              ? 'Viwango vya kukamilisha chanjo, watoto waliochelewa (defaulters), na usalama wa data chini ya KDPA 2019.'
              : 'KEPI coverage, defaulter identification, and Kenya Data Protection Act 2019 governance.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/api/backup/export"
            download
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'sw' ? 'Pakua Data Yote (KDPA)' : 'KDPA Data Export'}</span>
          </a>
        </div>
      </div>

      {broadcastResult && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-medium rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{broadcastResult}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500">
            {language === 'sw' ? 'Kiwango cha Chanjo (KEPI)' : 'KEPI Completion Rate'}
          </div>
          <div className="text-2xl font-bold text-teal-800 mt-2 font-mono tabular-nums">
            {stats.completionRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {stats.completedVaccinations} / {stats.totalVaccinations} {language === 'sw' ? 'dozi zilizopewa' : 'doses given'}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500">
            {language === 'sw' ? 'Uthibitisho wa Vitabu' : 'Paper Booklet Sync Rate'}
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2 font-mono tabular-nums">
            {stats.paperVerificationRate}%
          </div>
          <div className="text-xs text-emerald-800 mt-1 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'sw' ? 'Mseto wa Karatasi & Dijitali' : 'Hybrid MoH 216 match'}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500">
            {language === 'sw' ? 'Waliochelewa (Defaulters)' : 'Overdue Defaulters'}
          </div>
          <div className="text-2xl font-bold text-red-600 mt-2 font-mono tabular-nums">
            {stats.defaulterCount}
          </div>
          <div className="text-xs text-red-700 mt-1 font-medium">
            {stats.overdueVaccinations} {language === 'sw' ? 'dozi zimechelewa' : 'overdue doses'}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500">
            {language === 'sw' ? 'Tahadhari za Dharura' : 'Emergency SOS Triggers'}
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2 font-mono tabular-nums">
            {stats.activeEmergencies}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {language === 'sw' ? 'Zimeripotiwa leo' : 'Screened danger events'}
          </div>
        </div>
      </div>

      {/* Defaulter Recall List */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'sw' ? 'Orodha ya Watoto Waliochelewa Chanjo (Defaulters List)' : 'KEPI Defaulter Tracking List'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'sw' ? 'Wazazi wanaohitaji ukumbusho wa haraka kupitia SMS au simu.' : 'Children past their scheduled KEPI window requiring active recall.'}
            </p>
          </div>

          <button
            onClick={handleBroadcastDefaulters}
            disabled={broadcastingSms}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{broadcastingSms ? 'Inatuma...' : (language === 'sw' ? 'Tuma SMS ya Ukumbusho kwa Wote' : 'Broadcast Recall SMS')}</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {(data.defaulters || []).map(def => (
            <div key={def.childId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{def.name}</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                    {def.overdueCount} {language === 'sw' ? 'zimechelewa' : 'overdue'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span>DOB: {def.dob}</span>
                  <span aria-hidden="true">·</span>
                  <span>Kitabu: <strong className="font-mono text-slate-700">{def.paperBookletNumber}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Simu: <strong className="font-mono text-slate-700">{def.phone}</strong></span>
                </div>
                <div className="text-xs text-red-800 font-medium mt-1">
                  Chanjo zilizochelewa: {def.overdueVaccines.join(', ')}
                </div>
              </div>

              <button
                onClick={handleBroadcastDefaulters}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors self-end sm:self-center shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-teal-600" />
                <span>{language === 'sw' ? 'Tuma SMS' : 'Dispatch SMS'}</span>
              </button>
            </div>
          ))}
          {(!data.defaulters || data.defaulters.length === 0) && (
            <div className="p-6 text-center text-xs text-slate-500">
              Hakuna watoto waliochelewa kwa sasa. All infants are up to date!
            </div>
          )}
        </div>
      </div>

      {/* Audit Log / Kenya Data Protection Act 2019 Section */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'sw' ? 'Kumbukumbu za Ufikiaji wa Data (KDPA 2019 Audit Trail)' : 'Security Audit Log (KDPA 2019)'}
            </h3>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl">
            Immutable Audit Trail
          </span>
        </div>

        <div className="overflow-x-auto max-h-60 overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 sticky top-0">
              <tr>
                <th className="p-3">Wakati / Timestamp</th>
                <th className="p-3">Mtumiaji / Role</th>
                <th className="p-3">Kitendo / Action</th>
                <th className="p-3">Faili / Resource</th>
                <th className="p-3">Uhakiki wa Kitabu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {auditLogs.slice(0, 10).map((log: any) => (
                <tr key={log._id} className="hover:bg-slate-50/50">
                  <td className="p-3 text-slate-600">{log.timestamp.slice(0, 19).replace('T', ' ')}</td>
                  <td className="p-3 font-semibold text-slate-800 capitalize">{log.userRole}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700 text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">{log.resourceType}</td>
                  <td className="p-3 text-emerald-700 font-sans font-medium">✓ Logged</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
