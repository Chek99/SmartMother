import React from 'react';
import { ShieldAlert, Globe, UserCheck, Baby, Stethoscope, RefreshCw, LogIn, Bell } from 'lucide-react';
import { UserRole, AppLanguage, Child } from '../types';

interface TopNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  onOpenEmergency: () => void;
  onOpenLogin: () => void;
  childrenList: Child[];
  activeChild: Child | null;
  onSelectChild: (c: Child) => void;
  onOpenAddChild: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  role,
  setRole,
  onOpenEmergency,
  onOpenLogin,
  childrenList,
  activeChild,
  onSelectChild,
  onOpenAddChild
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            M+
          </div>
          <button 
            onClick={() => setCurrentTab(role === 'clinician' ? 'doctor' : 'dashboard')}
            className="text-left"
          >
            <div className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
              MamaCare+ <span className="text-teal-600 font-semibold text-xs">Kenya</span>
            </div>
            <div className="text-[10px] text-slate-500 hidden sm:block whitespace-nowrap">
              {language === 'sw' ? 'Kitabu cha Kidijitali cha MoH 216' : 'Smart MCH Booklet & AI Triage'}
            </div>
          </button>
        </div>

        {/* Zone 2: Primary Nav Links (Dynamic for Mother vs Doctor) */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
          {role === 'mother' ? (
            <>
              <button 
                onClick={() => setCurrentTab('dashboard')}
                className={`whitespace-nowrap transition-colors ${currentTab === 'dashboard' ? 'text-teal-700 font-bold border-b-2 border-teal-600 pb-0.5' : 'hover:text-slate-900'}`}
              >
                {language === 'sw' ? 'Dashibodi' : 'Dashboard'}
              </button>
              <button 
                onClick={() => setCurrentTab('reminders')}
                className={`whitespace-nowrap transition-colors flex items-center gap-1 ${currentTab === 'reminders' ? 'text-teal-700 font-bold border-b-2 border-teal-600 pb-0.5' : 'hover:text-slate-900'}`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{language === 'sw' ? 'Chanjo & Vikumbusho' : 'Vaccines & Reminders'}</span>
              </button>
              <button 
                onClick={() => setCurrentTab('growth')}
                className={`whitespace-nowrap transition-colors ${currentTab === 'growth' ? 'text-teal-700 font-bold border-b-2 border-teal-600 pb-0.5' : 'hover:text-slate-900'}`}
              >
                {language === 'sw' ? 'Ukuaji & Milestones' : 'Growth & WHO'}
              </button>
              <button 
                onClick={() => setCurrentTab('maternal')}
                className={`whitespace-nowrap transition-colors ${currentTab === 'maternal' ? 'text-teal-700 font-bold border-b-2 border-teal-600 pb-0.5' : 'hover:text-slate-900'}`}
              >
                {language === 'sw' ? 'Afya ya Mama' : 'Maternal Health'}
              </button>
              <button 
                onClick={() => setCurrentTab('ai')}
                className={`whitespace-nowrap transition-colors ${currentTab === 'ai' ? 'text-teal-700 font-bold border-b-2 border-teal-600 pb-0.5' : 'hover:text-slate-900'}`}
              >
                {language === 'sw' ? 'Msaidizi wa AI' : 'AI Assistant'}
              </button>
              <button 
                onClick={() => setCurrentTab('education')}
                className={`whitespace-nowrap transition-colors ${currentTab === 'education' ? 'text-teal-700 font-bold border-b-2 border-teal-600 pb-0.5' : 'hover:text-slate-900'}`}
              >
                {language === 'sw' ? 'Elimu ya Afya' : 'Education'}
              </button>
              <button 
                onClick={() => setCurrentTab('sync')}
                className={`whitespace-nowrap transition-colors flex items-center gap-1 ${currentTab === 'sync' ? 'text-teal-700 font-bold border-b-2 border-teal-600 pb-0.5' : 'hover:text-slate-900'}`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{language === 'sw' ? 'Sync & Backup' : 'Sync & Backup'}</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setCurrentTab('doctor')}
                className={`whitespace-nowrap transition-colors flex items-center gap-1 ${currentTab === 'doctor' ? 'text-teal-700 font-bold border-b-2 border-teal-600 pb-0.5' : 'hover:text-slate-900'}`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{language === 'sw' ? 'Dashibodi ya Daktari' : 'Doctor Dashboard'}</span>
              </button>
              <button 
                onClick={() => setCurrentTab('clinician')}
                className={`whitespace-nowrap transition-colors ${currentTab === 'clinician' ? 'text-teal-700 font-bold border-b-2 border-teal-600 pb-0.5' : 'hover:text-slate-900'}`}
              >
                {language === 'sw' ? 'Faili za Wagonjwa' : 'Patient Records'}
              </button>
              <button 
                onClick={() => setCurrentTab('vaccination')}
                className={`whitespace-nowrap transition-colors ${currentTab === 'vaccination' ? 'text-teal-700 font-bold border-b-2 border-teal-600 pb-0.5' : 'hover:text-slate-900'}`}
              >
                {language === 'sw' ? 'Chanjo (KEPI)' : 'Immunization (KEPI)'}
              </button>
              <button 
                onClick={() => setCurrentTab('analytics')}
                className={`whitespace-nowrap transition-colors ${currentTab === 'analytics' ? 'text-teal-700 font-bold border-b-2 border-teal-600 pb-0.5' : 'hover:text-slate-900'}`}
              >
                {language === 'sw' ? 'Takwimu za Kituo' : 'Facility Analytics'}
              </button>
              <button 
                onClick={() => setCurrentTab('sync')}
                className={`whitespace-nowrap transition-colors flex items-center gap-1 ${currentTab === 'sync' ? 'text-teal-700 font-bold border-b-2 border-teal-600 pb-0.5' : 'hover:text-slate-900'}`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync &amp; Backup</span>
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Emergency SOS Button */}
          <button
            onClick={onOpenEmergency}
            className="px-2.5 sm:px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            title="Immediate Medical Emergency"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 animate-pulse" />
            <span className="whitespace-nowrap">SOS {language === 'sw' ? 'Dharura' : 'Emergency'}</span>
          </button>

          {/* Bilingual Switcher (Swahili / English) */}
          <button
            onClick={() => setLanguage(language === 'sw' ? 'en' : 'sw')}
            className="h-8 px-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            title="Switch Language / Badilisha Lugha"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase">{language}</span>
          </button>

          {/* Login / Role Trigger Button */}
          <button
            onClick={onOpenLogin}
            className="h-8 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Sign in as Mother or Doctor"
          >
            <LogIn className="w-3.5 h-3.5 text-teal-400" />
            <span className="whitespace-nowrap">
              {role === 'mother' ? 'Jane (Mama)' : 'Dr. Faith (Doctor)'}
            </span>
          </button>
        </div>
      </div>

      {/* Child Switcher Ribbon (Supports Multi-Child & Twins) */}
      <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto text-xs">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Baby className="w-3.5 h-3.5 text-teal-600" />
              {language === 'sw' ? 'Mtoto Anayefuatiliwa:' : 'Current Child:'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {childrenList.map((ch) => {
              const isSelected = activeChild?._id === ch._id;
              return (
                <button
                  key={ch._id}
                  onClick={() => onSelectChild(ch)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-xs font-semibold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{ch.fullName}</span>
                  {ch.isMultipleBirth && (
                    <span className={`text-[10px] px-1 py-0.2 rounded font-normal ${isSelected ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-500'}`}>
                      {language === 'sw' ? 'Pacha' : 'Twin'}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={onOpenAddChild}
              className="px-2.5 py-1 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg whitespace-nowrap transition-colors"
            >
              + {language === 'sw' ? 'Ongeza Mtoto' : 'Add Child'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
