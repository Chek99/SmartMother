import React, { useState } from 'react';
import { 
  Bell, 
  Syringe, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send, 
  Smartphone, 
  Check, 
  Trash2, 
  Sparkles,
  Settings,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { AppLanguage, Child, VaccinationRecord, NotificationItem } from '../types';

interface VaccineRemindersViewProps {
  child: Child;
  vaccinations: VaccinationRecord[];
  language: AppLanguage;
  onNavigateTab: (tab: string) => void;
}

export const VaccineRemindersView: React.FC<VaccineRemindersViewProps> = ({
  child,
  vaccinations,
  language,
  onNavigateTab
}) => {
  // Notification preferences
  const [remind3DaysBefore, setRemind3DaysBefore] = useState(true);
  const [remindOnDay, setRemindOnDay] = useState(true);
  const [remind1DayOverdue, setRemind1DayOverdue] = useState(true);
  const [notifySpouse, setNotifySpouse] = useState(true);
  const [channel, setChannel] = useState<'both' | 'sms' | 'in_app'>('both');
  const [motherPhone, setMotherPhone] = useState('+254712345678');
  const [spousePhone, setSpousePhone] = useState('+254722998877');

  // Interactive In-App Notification Inbox
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      _id: 'notif-1',
      category: 'vaccine_upcoming',
      titleEn: `Upcoming: ${child.fullName}'s 14-Week KEPI Vaccines`,
      titleSw: `Inakaribia: Chanjo ya Wiki ya 14 ya ${child.fullName}`,
      bodyEn: `Scheduled for OPV-3, IPV, Pentavalent-3, and PCV-3 in 3 days. Please carry your MoH 216 paper booklet to Pumwani Maternity or your local clinic.`,
      bodySw: `Mtoto anatarajiwa kupokea OPV-3, IPV, Pentavalent-3 na PCV-3 baada ya siku 3. Beba kitabu cha karatasi cha MoH 216 unapoelekea kliniki.`,
      timestamp: 'Leo / Today, 08:30 AM',
      isRead: false,
      channel: 'both',
      smsDelivered: true,
      smsMessageId: 'AT-KEPI-9042'
    },
    {
      _id: 'notif-2',
      category: 'growth_check',
      titleEn: 'Monthly Growth & Weight Check Due',
      titleSw: 'Muda wa Kupima Uzito wa Mtoto',
      bodyEn: 'WHO growth monitoring is due. Take baby to the clinic to track height, weight, and nutritional percentiles.',
      bodySw: 'Muda wa kupima uzito na urefu wa mtoto umefika ili kulinganisha na viwango vya WHO.',
      timestamp: 'Jana / Yesterday, 09:15 AM',
      isRead: false,
      channel: 'in_app'
    },
    {
      _id: 'notif-3',
      category: 'postnatal',
      titleEn: 'Postnatal Health & Wellbeing Reminder',
      titleSw: 'Ukumbusho wa Afya ya Mama Baada ya Kujifungua',
      bodyEn: 'Remember to rest, drink plenty of fluids, and log your thoughts in your private mother journal.',
      bodySw: 'Kumbuka kupumzika, kunywa maji na supu ya kutosha, na kuandika hisia zako kwenye shajara.',
      timestamp: 'Siku 3 zilizopita / 3 days ago',
      isRead: true,
      channel: 'in_app'
    }
  ]);

  const [testingDispatch, setTestingDispatch] = useState(false);
  const [testResultNotice, setTestResultNotice] = useState<string | null>(null);

  // Compute upcoming/due vaccines
  const upcomingVaccines = vaccinations.filter(v => v.status === 'upcoming' || v.status === 'due' || v.status === 'overdue');

  const handleSendTestNotification = async () => {
    setTestingDispatch(true);
    try {
      const nextVac = upcomingVaccines[0] || { vaccineCode: 'PENTA-3', vaccineName: 'Pentavalent 3', scheduledDate: '2026-08-20' };
      const msgBody = `MAMACARE REMINDER: Jambo Mama Jane! Baby ${child.fullName} is due for ${nextVac.vaccineName} (${nextVac.vaccineCode}) on ${nextVac.scheduledDate}. Visit Pumwani or local clinic with your MoH 216 paper booklet!`;

      await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: motherPhone,
          message: msgBody
        })
      });

      const newNotif: NotificationItem = {
        _id: `notif-${Date.now()}`,
        category: 'vaccine_upcoming',
        titleEn: `Live Test SMS Dispatched: ${nextVac.vaccineCode}`,
        titleSw: `Jaribio la SMS Limetumwa: ${nextVac.vaccineCode}`,
        bodyEn: `SMS dispatched via Africa's Talking gateway to ${motherPhone}. Carry your physical MoH 216 paper booklet.`,
        bodySw: `Ujumbe wa SMS umetumwa kupitia Africa's Talking kwenda nambari ${motherPhone}. Kumbuka kitabu cha karatasi.`,
        timestamp: 'Hivi punde / Just now',
        isRead: false,
        channel: 'both',
        smsDelivered: true,
        smsMessageId: `AT-SIM-${Date.now().toString().slice(-4)}`
      };

      setNotifications(prev => [newNotif, ...prev]);
      setTestResultNotice(language === 'sw' ? 'Ujumbe wa ukumbusho umetumwa kwa nambari yako kupitia Africa\'s Talking!' : 'Reminder notification and SMS delivered successfully!');
      setTimeout(() => setTestResultNotice(null), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setTestingDispatch(false);
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wide">
            <Bell className="w-4 h-4" />
            <span>Smart Immunization Alerts &amp; Notification Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            {language === 'sw' ? 'Arifa na Vikumbusho vya Chanjo kwa Mama' : 'Vaccines & Mother Notification Reminders'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'sw'
              ? `Vikumbusho vya SMS vya Africa's Talking na arifa za kidijitali ili ${child.fullName} asikose chanjo yoyote ya KEPI.`
              : `Automated SMS and in-app alerts powered by Africa's Talking so ${child.fullName} never misses a KEPI dose.`}
          </p>
        </div>

        <button
          onClick={handleSendTestNotification}
          disabled={testingDispatch}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          {testingDispatch ? (
            <span>{language === 'sw' ? 'Inatuma...' : 'Dispatching...'}</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{language === 'sw' ? 'Jaribu Kutuma SMS Sasa' : 'Send Test SMS Reminder'}</span>
            </>
          )}
        </button>
      </div>

      {testResultNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{testResultNotice}</span>
        </div>
      )}

      {/* 2-Column Layout: Notification Inbox vs Notification Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Active Notifications Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'sw' ? 'Kikasha cha Arifa za Mama' : 'Mother Notification Inbox'} ({notifications.length})
                </h3>
              </div>

              <button
                onClick={markAllRead}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                {language === 'sw' ? 'Soma Zote' : 'Mark all read'}
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {notifications.map(n => (
                <div 
                  key={n._id}
                  className={`p-4 sm:p-5 transition-colors ${n.isRead ? 'bg-white' : 'bg-teal-50/40'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        n.category === 'vaccine_upcoming' ? 'bg-teal-100 text-teal-800' :
                        n.category === 'growth_check' ? 'bg-sky-100 text-sky-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {n.category === 'vaccine_upcoming' ? <Syringe className="w-4 h-4" /> :
                         n.category === 'growth_check' ? <Clock className="w-4 h-4" /> :
                         <Bell className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold ${n.isRead ? 'text-slate-800' : 'text-slate-950'}`}>
                            {language === 'sw' ? n.titleSw : n.titleEn}
                          </span>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-teal-600" />
                          )}
                        </div>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {language === 'sw' ? n.bodySw : n.bodyEn}
                        </p>

                        <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                          <span>{n.timestamp}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-600 flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-slate-500" />
                            {n.smsDelivered ? (
                              <span className="text-emerald-700 font-medium">SMS Delivered ({n.smsMessageId || 'AT-GATEWAY'})</span>
                            ) : (
                              <span>In-App Alert</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteNotification(n._id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-lg"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500">
                  {language === 'sw' ? 'Hakuna arifa mpya kwa sasa.' : 'No notifications in inbox.'}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Vaccines Schedule List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'sw' ? 'Chanjo Zinazofuata na Vikumbusho Vinavyosubiriwa' : 'Next Scheduled Vaccine Reminders'}
              </h3>
              <button
                onClick={() => onNavigateTab('vaccination')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                {language === 'sw' ? 'Fungua Ratiba ya KEPI' : 'View Full Schedule'}
              </button>
            </div>

            <div className="space-y-3">
              {upcomingVaccines.slice(0, 4).map(v => (
                <div key={v._id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {v.vaccineCode.slice(0, 3)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{v.vaccineName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Scheduled: {v.scheduledDate}</span>
                        {v.status === 'overdue' && (
                          <span className="text-red-600 font-semibold">(Overdue)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    v.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    v.status === 'due' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mother Notification Settings */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
              <Settings className="w-4 h-4 text-teal-600" />
              <span>{language === 'sw' ? 'Mipangilio ya Vikumbusho' : 'Reminder Preferences'}</span>
            </div>

            {/* Intervals */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-700">
                {language === 'sw' ? 'Wakati wa Kutuma Arifa:' : 'Reminder Intervals:'}
              </div>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-600">
                  {language === 'sw' ? 'Siku 3 kabla ya tarehe ya chanjo' : '3 days before due date'}
                </span>
                <input
                  type="checkbox"
                  checked={remind3DaysBefore}
                  onChange={e => setRemind3DaysBefore(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-600">
                  {language === 'sw' ? 'Siku ya chanjo (Asubuhi saa 2:00)' : 'On the day (Morning 8:00 AM)'}
                </span>
                <input
                  type="checkbox"
                  checked={remindOnDay}
                  onChange={e => setRemindOnDay(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-600">
                  {language === 'sw' ? 'Siku 1 baada ya kuchelewa' : '1 day overdue catch-up reminder'}
                </span>
                <input
                  type="checkbox"
                  checked={remind1DayOverdue}
                  onChange={e => setRemind1DayOverdue(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
              </label>
            </div>

            {/* Channels */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-xs font-semibold text-slate-700">
                {language === 'sw' ? 'Njia ya Kupokea:' : 'Delivery Channel:'}
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  onClick={() => setChannel('both')}
                  className={`py-1.5 px-2 rounded-xl text-center font-medium border transition-colors ${
                    channel === 'both' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  SMS + App
                </button>
                <button
                  onClick={() => setChannel('sms')}
                  className={`py-1.5 px-2 rounded-xl text-center font-medium border transition-colors ${
                    channel === 'sms' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  SMS Tu
                </button>
                <button
                  onClick={() => setChannel('in_app')}
                  className={`py-1.5 px-2 rounded-xl text-center font-medium border transition-colors ${
                    channel === 'in_app' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  In-App Tu
                </button>
              </div>
            </div>

            {/* Recipient Phone Numbers */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {language === 'sw' ? 'Nambari ya Simu ya Mama (Safaricom/Airtel):' : 'Mother Phone Number (Kenya):'}
                </label>
                <input
                  type="text"
                  value={motherPhone}
                  onChange={e => setMotherPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  {language === 'sw' ? 'Nambari ya Mume / Mlezi Msaidizi:' : 'Spouse / Next-of-Kin Phone:'}
                </label>
                <input
                  type="text"
                  value={spousePhone}
                  onChange={e => setSpousePhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-[11px] text-teal-900 leading-relaxed">
              {language === 'sw'
                ? 'Hakuna malipo kwa mama kupokea SMS hizi. Gharama inagharamiwa na mfumo wa Africa\'s Talking wa kituo cha afya.'
                : 'Free of charge for mothers. Zero SMS balance required on mother\'s Safaricom or Airtel SIM card.'}
            </div>
          </div>

          {/* Paper booklet reminder banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-xs text-amber-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <FileCheck2 className="w-4 h-4 text-amber-700" />
              <span>{language === 'sw' ? 'Usiache Kitabu Nyumbani' : 'Always Carry Paper Booklet'}</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              {language === 'sw'
                ? 'Unapoelekea kliniki ya chanjo, hakikisha umebeba kitabu cha karatasi cha MoH 216 ili muuguzi akieze kusaini na kuweka muhuri rasmi.'
                : 'Whenever attending clinic appointments, ensure your physical MoH 216 booklet is presented to the nurse for official verification stamps.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
