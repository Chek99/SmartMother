import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Printer, X, Download, ShieldCheck, QrCode, FileText, CheckCircle2 } from 'lucide-react';
import { AppLanguage, Child, VaccinationRecord, GrowthMeasurement } from '../types';

interface PaperBookletPrintViewProps {
  child: Child;
  vaccinations: VaccinationRecord[];
  growth: GrowthMeasurement[];
  language: AppLanguage;
  onClose: () => void;
}

export const PaperBookletPrintView: React.FC<PaperBookletPrintViewProps> = ({
  child,
  vaccinations,
  growth,
  language,
  onClose
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate QR code for the opaque token
    QRCode.toDataURL(child.opaqueQrToken, {
      width: 200,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    }).then(url => {
      setQrDataUrl(url);
    }).catch(err => {
      console.error('Failed to generate QR', err);
    });
  }, [child.opaqueQrToken]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-300 shadow-2xl overflow-hidden my-6 print:m-0 print:border-none print:shadow-none">
        {/* Header Action Bar (Hidden during print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm sm:text-base font-bold">
                {language === 'sw' ? 'Kitabu cha Afya ya Mama na Mtoto (MoH 216)' : 'Mother-Child Health (MCH) Booklet Format'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {language === 'sw' ? 'Nakala inayoweza kuchapishwa au kuambatanishwa kwenye kitabu cha karatasi' : 'Official printable counterpart & paper booklet QR card sticker'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'sw' ? 'Chapisha / Hifadhi PDF' : 'Print / Export PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable MoH 216 Layout */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 print:p-4">
          {/* Top MoH Kenya Crest / Republic Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <div className="text-xs uppercase font-bold tracking-widest text-slate-700">
              REPUBLIC OF KENYA · MINISTRY OF HEALTH
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 mt-1 uppercase">
              MOTHER AND CHILD HEALTH BOOKLET (MOH 216)
            </h1>
            <div className="text-xs font-semibold text-slate-600 mt-1">
              DIGITAL SYSTEM COMPANION &amp; HYBRID VERIFICATION RECORD
            </div>
          </div>

          {/* Child Bio & QR Sticker Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start border border-slate-300 p-5 rounded-2xl bg-slate-50/50">
            {/* Left Col: Demographics */}
            <div className="md:col-span-2 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 font-medium">Child Full Name:</span>
                  <div className="text-sm font-bold text-slate-950">{child.fullName}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Paper Booklet Serial No.:</span>
                  <div className="text-sm font-mono font-bold text-slate-950">{child.paperBookletNumber || 'MOH216-NRB-2026-0841'}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div>
                  <span className="text-slate-500 font-medium">Date of Birth:</span>
                  <div className="font-semibold text-slate-900">{child.dateOfBirth}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Sex / Gender:</span>
                  <div className="font-semibold text-slate-900 capitalize">{child.gender}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Birth Weight:</span>
                  <div className="font-semibold text-slate-900">{child.birthWeightKg} kg</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <span className="text-slate-500 font-medium">Birth Facility:</span>
                  <div className="font-semibold text-slate-900">{child.birthFacility}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Multiple Birth:</span>
                  <div className="font-semibold text-slate-900">
                    {child.isMultipleBirth ? `Twin #${child.birthOrderInMultiple || 1}` : 'Single birth'}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Status: Verified Against Physical MoH 216 Paper Records</span>
              </div>
            </div>

            {/* Right Col: Printable QR Sticker Card for paper booklet */}
            <div className="border-2 border-dashed border-slate-400 p-3 rounded-2xl bg-white text-center space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                MoH Booklet QR Sticker
              </div>
              <div className="flex justify-center py-1">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Child QR Code" className="w-32 h-32 object-contain" />
                ) : (
                  <div className="w-32 h-32 bg-slate-100 flex items-center justify-center">QR Loading</div>
                )}
              </div>
              <div className="text-[10px] font-mono text-slate-600 truncate max-w-full">
                {child.opaqueQrToken}
              </div>
              <div className="text-[9px] text-slate-400">
                Stick on physical paper booklet cover for fast clinic scanning
              </div>
            </div>
          </div>

          {/* Section: KEPI Immunization Table */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Part II: Kenya Expanded Programme on Immunization (KEPI)
            </h3>
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2.5">Vaccine Code</th>
                    <th className="p-2.5">Vaccine Name</th>
                    <th className="p-2.5">Scheduled Date</th>
                    <th className="p-2.5">Date Given</th>
                    <th className="p-2.5">Batch No.</th>
                    <th className="p-2.5">Health Facility</th>
                    <th className="p-2.5 text-center">Paper Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {vaccinations.slice(0, 10).map((v) => (
                    <tr key={v._id}>
                      <td className="p-2 font-mono font-bold text-slate-900">{v.vaccineCode}</td>
                      <td className="p-2 text-slate-800">{v.vaccineName}</td>
                      <td className="p-2 font-mono">{v.scheduledDate}</td>
                      <td className="p-2 font-mono font-bold text-emerald-800">
                        {v.administeredDate || '—'}
                      </td>
                      <td className="p-2 font-mono text-slate-700">{v.batchNumber || '—'}</td>
                      <td className="p-2 text-slate-700">{v.facilityName || '—'}</td>
                      <td className="p-2 text-center">
                        {v.verifiedAgainstPaperBooklet ? (
                          <span className="font-bold text-emerald-700">✓ YES</span>
                        ) : (
                          <span className="text-slate-400">PENDING</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Growth Anthropometrics */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Part III: Anthropometric Growth Records (WHO Standards)
            </h3>
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Age</th>
                    <th className="p-2.5">Weight (kg)</th>
                    <th className="p-2.5">Length (cm)</th>
                    <th className="p-2.5">Head Circ (cm)</th>
                    <th className="p-2.5">WAZ Z-Score</th>
                    <th className="p-2.5">Clinician Signature / Stamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {growth.map((g) => (
                    <tr key={g._id}>
                      <td className="p-2 font-mono">{g.measurementDate}</td>
                      <td className="p-2">{g.ageInMonths} months</td>
                      <td className="p-2 font-bold text-slate-900">{g.weightKg} kg</td>
                      <td className="p-2">{g.heightLengthCm} cm</td>
                      <td className="p-2">{g.headCircumferenceCm ? `${g.headCircumferenceCm} cm` : '—'}</td>
                      <td className="p-2 font-mono font-bold text-teal-800">{g.zScores?.weightForAge ?? '0.0'}</td>
                      <td className="p-2 text-slate-600 font-serif italic">Dr. F. Wanjiku (MOH)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures & Certification Footer */}
          <div className="pt-4 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <div className="font-semibold text-slate-800">Hospital Sub-County Medical Officer:</div>
              <div className="mt-6 border-b border-slate-400 w-48" />
              <div className="text-[11px] mt-1 text-slate-500">Official Facility Stamp &amp; Date</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-800">Mother / Legal Guardian Acknowledgement:</div>
              <div className="mt-6 border-b border-slate-400 w-48 ml-auto" />
              <div className="text-[11px] mt-1 text-slate-500">Signed with physical paper booklet present</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
