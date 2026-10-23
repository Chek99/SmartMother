/**
 * Kenya Expanded Programme on Immunization (KEPI) Service
 * Grounded in Ministry of Health (MoH) Kenya Guidelines & MoH 216 Child Health Booklet
 */

import { IVaccineDefinition, IVaccinationRecord } from '../models/schemas';

export const KEPI_VACCINE_CATALOG: IVaccineDefinition[] = [
  {
    vaccineCode: 'BCG',
    name: 'BCG (Bacille Calmette-Guérin)',
    targetDisease: 'Tuberculosis (TB)',
    recommendedAgeWeeks: 0,
    gracePeriodDays: 28,
    routeOfAdministration: 'Intradermal',
    dosage: '0.05 ml right forearm',
    mandatoryKepi: true,
    notesEnglish: 'Given at birth or first contact. Causes a small papule that develops into a tiny scar.',
    notesSwahili: 'Hupewa wakati wa kuzaliwa. Hukinga kifua kikuu (TB).'
  },
  {
    vaccineCode: 'OPV-0',
    name: 'OPV Birth (Oral Polio 0)',
    targetDisease: 'Poliomyelitis',
    recommendedAgeWeeks: 0,
    gracePeriodDays: 14,
    routeOfAdministration: 'Oral',
    dosage: '2 drops orally',
    mandatoryKepi: true,
    notesEnglish: 'Must be given within the first two weeks of life.',
    notesSwahili: 'Matone mawili ya kwanza mdomoni mara tu mtoto anapozaliwa.'
  },
  {
    vaccineCode: 'OPV-1',
    name: 'OPV 1 (Oral Polio 1)',
    targetDisease: 'Poliomyelitis',
    recommendedAgeWeeks: 6,
    gracePeriodDays: 21,
    routeOfAdministration: 'Oral',
    dosage: '2 drops orally',
    mandatoryKepi: true,
    notesEnglish: 'Protects infant against polio virus paralytic effects.',
    notesSwahili: 'Matone 2 mdomoni katika wiki ya sita.'
  },
  {
    vaccineCode: 'PENTA-1',
    name: 'Pentavalent 1 (DPT-HepB-Hib 1)',
    targetDisease: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Haemophilus Influenzae B',
    recommendedAgeWeeks: 6,
    gracePeriodDays: 21,
    routeOfAdministration: 'Intramuscular',
    dosage: '0.5 ml upper left outer thigh',
    mandatoryKepi: true,
    notesEnglish: 'Five-in-one protection. Mild fever is normal after injection; give paracetamol syrup if recommended.',
    notesSwahili: 'Kinga ya magonjwa matano: Pepopunda, Dondakoo, Kifaduro, Homa ya Ini na Nimonia.'
  },
  {
    vaccineCode: 'PCV-1',
    name: 'PCV 1 (Pneumococcal Conjugate 1)',
    targetDisease: 'Pneumonia and Meningitis',
    recommendedAgeWeeks: 6,
    gracePeriodDays: 21,
    routeOfAdministration: 'Intramuscular',
    dosage: '0.5 ml upper right outer thigh',
    mandatoryKepi: true,
    notesEnglish: 'Protects lungs against severe Streptococcus pneumoniae infections.',
    notesSwahili: 'Hukinga mtoto dhidi ya nimonia kali na homa ya uti wa mgongo.'
  },
  {
    vaccineCode: 'ROTA-1',
    name: 'Rotavirus 1',
    targetDisease: 'Rotavirus Diarrhea & Dehydration',
    recommendedAgeWeeks: 6,
    gracePeriodDays: 21,
    routeOfAdministration: 'Oral',
    dosage: '1.5 ml oral liquid',
    mandatoryKepi: true,
    notesEnglish: 'Protects against life-threatening dehydrating diarrhea in infants.',
    notesSwahili: 'Hukinga mtoto dhidi ya ugonjwa hatari wa kuhara unaosababishwa na rotavirus.'
  },
  {
    vaccineCode: 'OPV-2',
    name: 'OPV 2 (Oral Polio 2)',
    targetDisease: 'Poliomyelitis',
    recommendedAgeWeeks: 10,
    gracePeriodDays: 21,
    routeOfAdministration: 'Oral',
    dosage: '2 drops orally',
    mandatoryKepi: true,
    notesEnglish: 'Second booster dose for polio immunity.',
    notesSwahili: 'Dozi ya pili ya matone ya polio.'
  },
  {
    vaccineCode: 'PENTA-2',
    name: 'Pentavalent 2 (DPT-HepB-Hib 2)',
    targetDisease: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib',
    recommendedAgeWeeks: 10,
    gracePeriodDays: 21,
    routeOfAdministration: 'Intramuscular',
    dosage: '0.5 ml upper left outer thigh',
    mandatoryKepi: true,
    notesEnglish: 'Second dose of 5-in-1 vaccine.',
    notesSwahili: 'Dozi ya pili ya pentavalent wiki ya 10.'
  },
  {
    vaccineCode: 'PCV-2',
    name: 'PCV 2 (Pneumococcal Conjugate 2)',
    targetDisease: 'Pneumonia and Meningitis',
    recommendedAgeWeeks: 10,
    gracePeriodDays: 21,
    routeOfAdministration: 'Intramuscular',
    dosage: '0.5 ml upper right outer thigh',
    mandatoryKepi: true,
    notesEnglish: 'Second dose of pneumococcal vaccine.',
    notesSwahili: 'Dozi ya pili ya PCV.'
  },
  {
    vaccineCode: 'ROTA-2',
    name: 'Rotavirus 2',
    targetDisease: 'Rotavirus Diarrhea',
    recommendedAgeWeeks: 10,
    gracePeriodDays: 21,
    routeOfAdministration: 'Oral',
    dosage: '1.5 ml oral liquid',
    mandatoryKepi: true,
    notesEnglish: 'Completes primary series for rotavirus diarrhea.',
    notesSwahili: 'Kukamilisha dozi ya kinga ya kuhara.'
  },
  {
    vaccineCode: 'OPV-3',
    name: 'OPV 3 (Oral Polio 3)',
    targetDisease: 'Poliomyelitis',
    recommendedAgeWeeks: 14,
    gracePeriodDays: 21,
    routeOfAdministration: 'Oral',
    dosage: '2 drops orally',
    mandatoryKepi: true,
    notesEnglish: 'Final primary dose for oral polio series.',
    notesSwahili: 'Dozi ya tatu ya matone ya polio.'
  },
  {
    vaccineCode: 'IPV',
    name: 'IPV (Inactivated Polio Vaccine)',
    targetDisease: 'Poliomyelitis',
    recommendedAgeWeeks: 14,
    gracePeriodDays: 21,
    routeOfAdministration: 'Intramuscular',
    dosage: '0.5 ml upper right outer thigh',
    mandatoryKepi: true,
    notesEnglish: 'Injectable booster providing heightened systemic immunity against polio.',
    notesSwahili: 'Sindano ya ziada ya polio kuzuia ulemavu.'
  },
  {
    vaccineCode: 'PENTA-3',
    name: 'Pentavalent 3 (DPT-HepB-Hib 3)',
    targetDisease: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib',
    recommendedAgeWeeks: 14,
    gracePeriodDays: 21,
    routeOfAdministration: 'Intramuscular',
    dosage: '0.5 ml upper left outer thigh',
    mandatoryKepi: true,
    notesEnglish: 'Completes the infant primary series for DPT-HepB-Hib.',
    notesSwahili: 'Dozi ya tatu ya kukamilisha msingi wa pentavalent.'
  },
  {
    vaccineCode: 'PCV-3',
    name: 'PCV 3 (Pneumococcal Conjugate 3)',
    targetDisease: 'Pneumonia and Meningitis',
    recommendedAgeWeeks: 14,
    gracePeriodDays: 21,
    routeOfAdministration: 'Intramuscular',
    dosage: '0.5 ml upper right outer thigh',
    mandatoryKepi: true,
    notesEnglish: 'Final primary series dose for pneumococcal protection.',
    notesSwahili: 'Dozi ya tatu ya PCV kuzuia nimonia.'
  },
  {
    vaccineCode: 'VIT-A-1',
    name: 'Vitamin A (Dose 1)',
    targetDisease: 'Vitamin A Deficiency & Eye Health',
    recommendedAgeWeeks: 26, // 6 months
    gracePeriodDays: 30,
    routeOfAdministration: 'Oral',
    dosage: '100,000 IU (blue capsule)',
    mandatoryKepi: true,
    notesEnglish: 'Crucial for eyesight and immune defense. Repeat every 6 months up to 5 years.',
    notesSwahili: 'Husaidia kuimarisha kinga ya mwili na macho.'
  },
  {
    vaccineCode: 'MR-1',
    name: 'Measles-Rubella 1 (MR 1)',
    targetDisease: 'Measles and Rubella (German Measles)',
    recommendedAgeWeeks: 39, // 9 months
    gracePeriodDays: 30,
    routeOfAdministration: 'Subcutaneous',
    dosage: '0.5 ml upper right deltoid',
    mandatoryKepi: true,
    notesEnglish: 'Critical milestone at 9 months. Highly effective protection against measles outbreaks.',
    notesSwahili: 'Kinga kuu ya ugonjwa wa surua na rubella katika miezi tisa.'
  },
  {
    vaccineCode: 'YELLOW-FEVER',
    name: 'Yellow Fever Vaccine',
    targetDisease: 'Yellow Fever',
    recommendedAgeWeeks: 39, // 9 months
    gracePeriodDays: 30,
    routeOfAdministration: 'Subcutaneous',
    dosage: '0.5 ml upper left deltoid',
    mandatoryKepi: false, // Endemic/regional high-risk counties
    notesEnglish: 'Given at 9 months in select designated counties across Rift Valley and Western Kenya.',
    notesSwahili: 'Hupewa katika miezi 9 katika kaunti zenye hatari ya homa ya manjano.'
  },
  {
    vaccineCode: 'VIT-A-2',
    name: 'Vitamin A (Dose 2)',
    targetDisease: 'Vitamin A Deficiency',
    recommendedAgeWeeks: 52, // 12 months
    gracePeriodDays: 30,
    routeOfAdministration: 'Oral',
    dosage: '200,000 IU (red capsule)',
    mandatoryKepi: true,
    notesEnglish: 'Second vitamin A supplement.',
    notesSwahili: 'Dozi ya pili ya Vitamini A (kofia nyekundu).'
  },
  {
    vaccineCode: 'MR-2',
    name: 'Measles-Rubella 2 (MR 2)',
    targetDisease: 'Measles and Rubella Booster',
    recommendedAgeWeeks: 78, // 18 months
    gracePeriodDays: 45,
    routeOfAdministration: 'Subcutaneous',
    dosage: '0.5 ml right deltoid',
    mandatoryKepi: true,
    notesEnglish: 'Essential booster dose to ensure long-term lifetime measles immunity.',
    notesSwahili: 'Dozi ya pili na ya mwisho ya surua katika miezi 18.'
  }
];

/**
 * Generate a complete vaccination schedule tailored for a child based on Date of Birth
 */
export function generateChildVaccinationSchedule(
  childId: string,
  dobString: string
): IVaccinationRecord[] {
  const dob = new Date(dobString);
  const now = new Date();

  return KEPI_VACCINE_CATALOG.map((vDef, idx) => {
    // Add weeks to DOB
    const targetDate = new Date(dob);
    targetDate.setDate(targetDate.getDate() + vDef.recommendedAgeWeeks * 7);

    const isoScheduled = targetDate.toISOString().split('T')[0];
    const daysSinceTarget = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

    let status: IVaccinationRecord['status'] = 'upcoming';
    let predictedDate = isoScheduled;

    if (daysSinceTarget < -7) {
      status = 'upcoming';
    } else if (daysSinceTarget >= -7 && daysSinceTarget <= vDef.gracePeriodDays) {
      status = 'due';
    } else if (daysSinceTarget > vDef.gracePeriodDays) {
      status = 'overdue';
      // Recommend catch-up within next 3 days
      const catchUp = new Date(now);
      catchUp.setDate(catchUp.getDate() + 2);
      predictedDate = catchUp.toISOString().split('T')[0];
    }

    return {
      _id: `rec-${childId}-${vDef.vaccineCode}`,
      childId,
      vaccineCode: vDef.vaccineCode,
      vaccineName: vDef.name,
      doseNumber: idx + 1,
      scheduledDate: isoScheduled,
      predictedDate,
      status,
      verifiedAgainstPaperBooklet: false,
    };
  });
}
