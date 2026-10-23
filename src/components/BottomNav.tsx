import React from 'react';
import { LayoutDashboard, Syringe, LineChart, Sparkles, Stethoscope, BookOpen } from 'lucide-react';
import { AppLanguage, UserRole } from '../types';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: AppLanguage;
  role: UserRole;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  language,
  role
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'dashboard' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-semibold tracking-tight mt-1 truncate">
            {language === 'sw' ? 'Mwanzo' : 'Home'}
          </span>
        </button>

        {/* Tab 2: Vaccines & Reminders */}
        <button
          onClick={() => setCurrentTab('reminders')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'reminders' || currentTab === 'vaccination' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Syringe className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-semibold tracking-tight mt-1 truncate">
            {language === 'sw' ? 'Chanjo' : 'Reminders'}
          </span>
        </button>

        {/* Tab 3: Growth */}
        <button
          onClick={() => setCurrentTab('growth')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'growth' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LineChart className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-semibold tracking-tight mt-1 truncate">
            {language === 'sw' ? 'Ukuaji' : 'Growth'}
          </span>
        </button>

        {/* Tab 4: AI Assistant */}
        <button
          onClick={() => setCurrentTab('ai')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'ai' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-semibold tracking-tight mt-1 truncate">
            {language === 'sw' ? 'Msaidizi' : 'AI Help'}
          </span>
        </button>

        {/* Tab 5: Doctor Dashboard or Mother Health */}
        {role === 'clinician' || role === 'admin' ? (
          <button
            onClick={() => setCurrentTab('doctor')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'doctor' || currentTab === 'clinician' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="w-5 h-5 shrink-0" />
            <span className="text-[10px] font-semibold tracking-tight mt-1 truncate">
              {language === 'sw' ? 'Daktari' : 'Doctor'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentTab('maternal')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'maternal' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-5 h-5 shrink-0" />
            <span className="text-[10px] font-semibold tracking-tight mt-1 truncate">
              {language === 'sw' ? 'Mama' : 'Mother'}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
