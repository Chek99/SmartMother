import React, { useState } from 'react';
import { X, Baby, ShieldCheck } from 'lucide-react';
import { AppLanguage } from '../types';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onChildAdded: () => void;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({
  isOpen,
  onClose,
  language,
  onChildAdded
}) => {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2026-06-01');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [birthWeight, setBirthWeight] = useState('3.1');
  const [birthLength, setBirthLength] = useState('49.5');
  const [birthFacility, setBirthFacility] = useState('Pumwani Maternity Hospital, Nairobi');
  const [paperBookletNumber, setPaperBookletNumber] = useState('MOH216-NRB-2026-');
  const [isMultipleBirth, setIsMultipleBirth] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/children', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          dateOfBirth,
          gender,
          birthWeightKg: birthWeight,
          birthLengthCm: birthLength,
          birthFacility,
          paperBookletNumber,
          isMultipleBirth
        })
      });
      const data = await res.json();
      if (data.success) {
        onChildAdded();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Baby className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'sw' ? 'Sajili Mtoto Mpya Kliniki' : 'Register New Child Profile'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {language === 'sw' ? 'Jina Kamili la Mtoto' : 'Child Full Name'} *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Zawadi Nekesa Otieno"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {language === 'sw' ? 'Tarehe ya Kuzaliwa (DOB)' : 'Date of Birth (DOB)'} *
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {language === 'sw' ? 'Jinsia / Sex' : 'Gender / Sex'} *
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
              >
                <option value="female">{language === 'sw' ? 'Msichana (Female)' : 'Female'}</option>
                <option value="male">{language === 'sw' ? 'Mvulana (Male)' : 'Male'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {language === 'sw' ? 'Uzito Wakati wa Kuzaliwa (kg)' : 'Birth Weight (kg)'} *
              </label>
              <input
                type="number"
                step="0.05"
                required
                value={birthWeight}
                onChange={e => setBirthWeight(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {language === 'sw' ? 'Urefu Wakati wa Kuzaliwa (cm)' : 'Birth Length (cm)'} *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={birthLength}
                onChange={e => setBirthLength(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {language === 'sw' ? 'Hospitali au Kituo cha Kuzaliwa' : 'Birth Health Facility'} *
            </label>
            <input
              type="text"
              required
              value={birthFacility}
              onChange={e => setBirthFacility(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {language === 'sw' ? 'Nambari ya Kitabu cha Karatasi (MoH 216 Booklet)' : 'Paper Booklet Serial Number (MoH 216)'}
            </label>
            <input
              type="text"
              value={paperBookletNumber}
              onChange={e => setPaperBookletNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Multiple Birth Option */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isMultipleBirth}
                onChange={e => setIsMultipleBirth(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span className="text-xs font-semibold text-slate-800">
                {language === 'sw' ? 'Mtoto huyu ni pacha au uzazi wa zaidi ya mmoja (Twin / Multiple Birth)' : 'Part of a Multiple Birth (Twins / Multiples Group)'}
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              {language === 'sw' ? 'Ghairi' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
            >
              {submitting ? 'Inasajili...' : (language === 'sw' ? 'Sajili Mtoto & Unda Ratiba' : 'Save & Generate KEPI')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
