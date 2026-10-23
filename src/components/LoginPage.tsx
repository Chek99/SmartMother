import React, { useState } from 'react';
import { 
  Baby, 
  Stethoscope, 
  ShieldCheck, 
  Lock, 
  Phone, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  X,
  UserCheck
} from 'lucide-react';
import { AppLanguage, UserRole } from '../types';

interface LoginPageProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  currentRole: UserRole;
  onLoginSuccess: (role: UserRole, userMeta?: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  isOpen,
  onClose,
  language,
  currentRole,
  onLoginSuccess
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [phone, setPhone] = useState(currentRole === 'clinician' ? '+254733112233' : '+254712345678');
  const [password, setPassword] = useState('••••••••');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleTab = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'clinician') {
      setPhone('+254733112233');
    } else {
      setPhone('+254712345678');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    setSubmitting(true);
    setNotice(language === 'sw' ? 'Inaingia kwenye mfumo...' : 'Signing in...');
    setTimeout(() => {
      onLoginSuccess(role);
      setSubmitting(false);
      onClose();
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      onLoginSuccess(selectedRole);
      setSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-sm">
              M+
            </div>
            <div>
              <h2 className="text-lg font-bold">MamaCare+ Kenya</h2>
              <p className="text-xs text-teal-200">
                {language === 'sw' ? 'Lango la Kuingia: Mama au Daktari/Muuguzi' : 'Sign In as Mother or Doctor / Clinician'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Role Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleRoleTab('mother')}
              className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === 'mother'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Baby className="w-4 h-4 text-teal-600" />
              <span>{language === 'sw' ? 'Mama (Mother)' : 'Mother'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleTab('clinician')}
              className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === 'clinician'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>{language === 'sw' ? 'Daktari / Muuguzi' : 'Doctor / Nurse'}</span>
            </button>
          </div>

          {/* Quick One-Click Switcher for Instant Testing */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {language === 'sw' ? 'Akaunti za Mfano za Haraka:' : 'One-Click Demo Profiles:'}
            </div>

            {selectedRole === 'mother' ? (
              <button
                type="button"
                onClick={() => handleQuickLogin('mother')}
                className="w-full p-3 rounded-2xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-left transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    JM
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Jane Muthoni (First-Time Mother)</div>
                    <div className="text-[11px] text-slate-500">Nairobi · Twins: Amani &amp; Baraka</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-teal-700" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleQuickLogin('clinician')}
                className="w-full p-3 rounded-2xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-left transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    FW
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Dr. Faith Wanjiku, MBChB</div>
                    <div className="text-[11px] text-slate-500">Pumwani Maternity · KMPDC/A-94821</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-teal-700" />
              </button>
            )}
          </div>

          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-2 text-[11px] text-slate-400 uppercase tracking-wider">
              {language === 'sw' ? 'Au Ingia kwa Nambari ya Simu' : 'Or Custom Phone & Password'}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {language === 'sw' ? 'Nambari ya Simu (Kenya)' : 'Mobile Phone (Kenya)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+2547..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {language === 'sw' ? 'Nenosiri / PIN' : 'Password or PIN'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>
                {selectedRole === 'mother'
                  ? (language === 'sw' ? 'Ingia kama Mama' : 'Sign In as Mother')
                  : (language === 'sw' ? 'Ingia kama Daktari' : 'Sign In as Doctor')}
              </span>
            </button>
          </form>

          {notice && (
            <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 text-xs text-center rounded-xl font-medium">
              {notice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
