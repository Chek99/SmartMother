/**
 * MamaCare+ Kenya — Main Application Shell
 * Integrated PWA for First-Time Mothers, Healthcare Clinicians, and Hospital Administrators.
 */

import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { VaccinationView } from './components/VaccinationView';
import { VaccineRemindersView } from './components/VaccineRemindersView';
import { GrowthView } from './components/GrowthView';
import { AiAssistantView } from './components/AiAssistantView';
import { MaternalHealthView } from './components/MaternalHealthView';
import { ClinicianPortalView } from './components/ClinicianPortalView';
import { DoctorDashboardView } from './components/DoctorDashboardView';
import { SyncBackupView } from './components/SyncBackupView';
import { PaperBookletPrintView } from './components/PaperBookletPrintView';
import { EducationView } from './components/EducationView';
import { AnalyticsView } from './components/AnalyticsView';
import { EmergencyModal } from './components/EmergencyModal';
import { AddChildModal } from './components/AddChildModal';
import { LoginPage } from './components/LoginPage';
import { UserRole, AppLanguage, Child, VaccinationRecord, GrowthMeasurement } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [language, setLanguage] = useState<AppLanguage>('sw');
  const [role, setRole] = useState<UserRole>('mother');

  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [activeChild, setActiveChild] = useState<Child | null>(null);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [growth, setGrowth] = useState<GrowthMeasurement[]>([]);

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isPrintBookletOpen, setIsPrintBookletOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [emergencySigns, setEmergencySigns] = useState<string[]>(['High Fever >38.5°C', 'Chest Indrawing']);
  const [emergencyAdvice, setEmergencyAdvice] = useState<string>('');

  // Initial load
  const loadChildren = async () => {
    try {
      const res = await fetch('/api/children');
      const data = await res.json();
      if (data.success && data.children.length > 0) {
        setChildrenList(data.children);
        if (!activeChild) {
          setActiveChild(data.children[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load children', err);
    }
  };

  const loadChildData = async (childId: string) => {
    try {
      const res = await fetch(`/api/children/${childId}`);
      const data = await res.json();
      if (data.success) {
        setVaccinations(data.vaccinations || []);
        setGrowth(data.growth || []);
      }
    } catch (err) {
      console.error('Failed to load child records', err);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    if (activeChild) {
      loadChildData(activeChild._id);
    }
  }, [activeChild]);

  const handleSelectChild = (ch: Child) => {
    setActiveChild(ch);
  };

  const handleTriggerEmergencyWithContext = (signs: string[], advice: string) => {
    setEmergencySigns(signs);
    setEmergencyAdvice(advice);
    setIsEmergencyOpen(true);
  };

  const handleLoginSuccess = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'clinician') {
      setCurrentTab('doctor');
    } else {
      setCurrentTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900 pb-20 lg:pb-8">
      {/* Top Bar following Top Bar Contract */}
      <TopNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        role={role}
        setRole={(newRole) => {
          setRole(newRole);
          if (newRole === 'clinician') setCurrentTab('doctor');
          else if (currentTab === 'doctor') setCurrentTab('dashboard');
        }}
        onOpenEmergency={() => {
          setEmergencySigns(['High Fever >38.5°C', 'Chest indrawing', 'Difficulty breathing']);
          setIsEmergencyOpen(true);
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
        childrenList={childrenList}
        activeChild={activeChild}
        onSelectChild={handleSelectChild}
        onOpenAddChild={() => setIsAddChildOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Mother Views */}
        {currentTab === 'dashboard' && activeChild && (
          <DashboardView
            child={activeChild}
            vaccinations={vaccinations}
            growth={growth}
            language={language}
            onNavigateTab={setCurrentTab}
            onOpenPrintBooklet={() => setIsPrintBookletOpen(true)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        )}

        {/* Vaccines & Reminders to Mother via Notifications */}
        {currentTab === 'reminders' && activeChild && (
          <VaccineRemindersView
            child={activeChild}
            vaccinations={vaccinations}
            language={language}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'vaccination' && activeChild && (
          <VaccinationView
            child={activeChild}
            vaccinations={vaccinations}
            language={language}
            onRefresh={() => loadChildData(activeChild._id)}
          />
        )}

        {currentTab === 'growth' && activeChild && (
          <GrowthView
            child={activeChild}
            growth={growth}
            language={language}
            onRefresh={() => loadChildData(activeChild._id)}
          />
        )}

        {currentTab === 'ai' && activeChild && (
          <AiAssistantView
            child={activeChild}
            language={language}
            onTriggerEmergency={handleTriggerEmergencyWithContext}
          />
        )}

        {currentTab === 'maternal' && (
          <MaternalHealthView
            language={language}
          />
        )}

        {currentTab === 'education' && (
          <EducationView
            language={language}
          />
        )}

        {/* Dedicated Doctor Dashboard */}
        {currentTab === 'doctor' && activeChild && (
          <DoctorDashboardView
            childrenList={childrenList}
            activeChild={activeChild}
            vaccinations={vaccinations}
            growth={growth}
            language={language}
            onSelectChild={handleSelectChild}
            onRefresh={() => loadChildData(activeChild._id)}
            onOpenPrintBooklet={() => setIsPrintBookletOpen(true)}
          />
        )}

        {currentTab === 'clinician' && activeChild && (
          <ClinicianPortalView
            childrenList={childrenList}
            activeChild={activeChild}
            vaccinations={vaccinations}
            language={language}
            onSelectChild={handleSelectChild}
            onRefresh={() => loadChildData(activeChild._id)}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            language={language}
          />
        )}

        {/* Sync & Backup Hub */}
        {currentTab === 'sync' && activeChild && (
          <SyncBackupView
            child={activeChild}
            language={language}
            onRefresh={() => {
              loadChildren();
              loadChildData(activeChild._id);
            }}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        role={role}
      />

      {/* Login Page / Modal */}
      <LoginPage
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        language={language}
        currentRole={role}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Emergency Danger Sign Triage Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        language={language}
        child={activeChild}
        detectedSigns={emergencySigns}
        initialAdvice={emergencyAdvice}
      />

      {/* Printable MoH 216 Paper Booklet & QR Sticker Modal */}
      {isPrintBookletOpen && activeChild && (
        <PaperBookletPrintView
          child={activeChild}
          vaccinations={vaccinations}
          growth={growth}
          language={language}
          onClose={() => setIsPrintBookletOpen(false)}
        />
      )}

      {/* Add Child Profile Modal */}
      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={() => setIsAddChildOpen(false)}
        language={language}
        onChildAdded={loadChildren}
      />
    </div>
  );
}
