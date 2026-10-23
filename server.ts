/**
 * MamaCare+ Kenya — Full-Stack Server
 * Express REST API + Vite Middleware Integration + AI Service Proxy
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateChildVaccinationSchedule, KEPI_VACCINE_CATALOG } from './server/services/kepiScheduler.ts';
import { calculateZScores, MILESTONES_CATALOG, NUTRITION_BY_AGE_KENYA, WHO_GROWTH_REFERENCE } from './server/services/growthStandards.ts';
import { scanForDangerSigns, KENYA_REFERRAL_FACILITIES } from './server/services/emergencyDetection.ts';
import { generateMamaCareAdvice } from './server/services/aiAssistantService.ts';
import { AfricasTalkingProvider, SimulatedSmsProvider } from './server/services/smsProvider.ts';
import { mapChildToFhirPatient, mapVaccinationToFhirImmunization, mapGrowthToFhirObservation, exportToMoHCsv } from './server/services/fhirInteroperability.ts';
import { IChild, IVaccinationRecord, IGrowthMeasurement, IJournalEntry, IMedicalRecord, IAuditLog, IEducationArticle } from './server/models/schemas.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database Store (with Seed Data for Demo & Evaluation)
export const db = {
  users: [
    {
      _id: 'usr-mother-1',
      phone: '+254712345678',
      email: 'jane.muthoni@example.ke',
      fullName: 'Jane Muthoni',
      role: 'mother',
      preferredLanguage: 'sw' as const,
      county: 'Nairobi',
      subCounty: 'Westlands',
      emergencyContact: {
        name: 'Peter Mwangi (Husband)',
        relationship: 'Husband',
        phone: '+254722998877'
      }
    },
    {
      _id: 'usr-clinician-1',
      phone: '+254733112233',
      email: 'dr.faith.wanjiku@health.go.ke',
      fullName: 'Dr. Faith Wanjiku, MBChB',
      role: 'clinician',
      preferredLanguage: 'en' as const,
      cadre: 'Pediatrician / Medical Officer',
      registrationCouncilNumber: 'KMPDC/A-94821',
      facilityName: 'Pumwani Maternity Hospital'
    },
    {
      _id: 'usr-admin-1',
      phone: '+254700998877',
      email: 'admin.kiprop@nairobihealth.go.ke',
      fullName: 'Joseph Kiprop (Facility Admin)',
      role: 'admin',
      preferredLanguage: 'en' as const,
      facilityName: 'Pumwani Maternity Hospital'
    }
  ],

  children: [
    {
      _id: 'child-1',
      motherId: 'usr-mother-1',
      multipleBirthGroupId: 'group-twins-1',
      isMultipleBirth: true,
      birthOrderInMultiple: 1,
      fullName: 'Amani Otieno (Twin A)',
      dateOfBirth: '2026-05-10', // ~5 months old
      gender: 'female' as const,
      birthWeightKg: 2.8,
      birthLengthCm: 48.0,
      birthHeadCircumferenceCm: 33.5,
      birthFacility: 'Pumwani Maternity Hospital, Nairobi',
      paperBookletNumber: 'MOH216-NRB-2026-0841',
      opaqueQrToken: 'MC-KE-2026-AMANI-78921',
      verifiedAgainstPaperBooklet: true,
      status: 'active' as const
    },
    {
      _id: 'child-2',
      motherId: 'usr-mother-1',
      multipleBirthGroupId: 'group-twins-1',
      isMultipleBirth: true,
      birthOrderInMultiple: 2,
      fullName: 'Baraka Otieno (Twin B)',
      dateOfBirth: '2026-05-10',
      gender: 'male' as const,
      birthWeightKg: 2.9,
      birthLengthCm: 48.5,
      birthHeadCircumferenceCm: 34.0,
      birthFacility: 'Pumwani Maternity Hospital, Nairobi',
      paperBookletNumber: 'MOH216-NRB-2026-0842',
      opaqueQrToken: 'MC-KE-2026-BARAKA-91024',
      verifiedAgainstPaperBooklet: true,
      status: 'active' as const
    },
    {
      _id: 'child-3',
      motherId: 'usr-mother-1',
      multipleBirthGroupId: undefined,
      isMultipleBirth: false,
      fullName: 'Zawadi Mwangi',
      dateOfBirth: '2025-10-15', // ~12 months old
      gender: 'female' as const,
      birthWeightKg: 3.2,
      birthLengthCm: 50.0,
      birthHeadCircumferenceCm: 35.0,
      birthFacility: 'Kenyatta National Hospital',
      paperBookletNumber: 'MOH216-KNH-2025-4109',
      opaqueQrToken: 'MC-KE-2025-ZAWADI-33211',
      verifiedAgainstPaperBooklet: false,
      status: 'active' as const
    }
  ] as IChild[],

  vaccinations: [] as IVaccinationRecord[],
  growthMeasurements: [] as IGrowthMeasurement[],
  medicalRecords: [] as IMedicalRecord[],
  journalEntries: [] as IJournalEntry[],
  auditLogs: [] as IAuditLog[],
  emergencyAlerts: [] as Array<Record<string, unknown>>,
  
  maternalHealth: {
    ancVisits: [
      { visitNumber: 1, date: '2025-11-12', facility: 'Pumwani Clinic', gestationalAgeWeeks: 12, weightKg: 58.5, bloodPressure: '118/75', hbLevel: 12.1, verifiedAgainstPaperBooklet: true, notes: 'Routine first trimester booking. Tetanus toxoid given.' },
      { visitNumber: 2, date: '2026-01-20', facility: 'Pumwani Clinic', gestationalAgeWeeks: 20, weightKg: 62.0, bloodPressure: '120/78', hbLevel: 11.8, verifiedAgainstPaperBooklet: true, notes: 'Ultrasound confirmed twin intrauterine gestation.' },
      { visitNumber: 3, date: '2026-03-15', facility: 'Pumwani Clinic', gestationalAgeWeeks: 28, weightKg: 65.4, bloodPressure: '122/80', hbLevel: 11.5, verifiedAgainstPaperBooklet: true, notes: 'Fetal movements active. Iron and folic acid replenished.' },
      { visitNumber: 4, date: '2026-04-22', facility: 'Pumwani Clinic', gestationalAgeWeeks: 34, weightKg: 67.2, bloodPressure: '124/82', hbLevel: 11.7, verifiedAgainstPaperBooklet: true, notes: 'Birth preparedness and danger signs explained.' }
    ],
    postnatalChecks: [
      { date: '2026-05-12', daysPostpartum: 2, facility: 'Pumwani Postnatal Ward', lochiaNormal: true, bp: '120/80', breastfeedingEstablished: true, mood: 'Tired but happy', verifiedAgainstPaperBooklet: true },
      { date: '2026-05-24', daysPostpartum: 14, facility: 'Westlands Health Centre', lochiaNormal: true, bp: '118/76', breastfeedingEstablished: true, mood: 'Calm', verifiedAgainstPaperBooklet: true },
      { date: '2026-06-22', daysPostpartum: 42, facility: 'Westlands Health Centre', lochiaNormal: true, bp: '116/74', breastfeedingEstablished: true, mood: 'Supported', verifiedAgainstPaperBooklet: true }
    ],
    epdsScores: [
      { date: '2026-06-22', score: 4, risk: 'low', notes: 'Edinburgh Postnatal Depression Scale score within normal range.' },
      { date: '2026-08-10', score: 6, risk: 'low', notes: 'Routine check-in, doing well with family support.' }
    ]
  },

  articles: [
    {
      _id: 'art-1',
      slug: 'exclusive-breastfeeding-kenya',
      category: 'nutrition',
      titleEn: 'Why Exclusive Breastfeeding Protects Baby for the First 6 Months',
      titleSw: 'Kwa Nini Maziwa ya Mama Pekee Yanakinga Mtoto kwa Miezi 6 ya Kwanza',
      summaryEn: 'Learn why colostrum is baby’s first vaccine and why even in warm Kenyan weather, baby requires no additional water.',
      summarySw: 'Jifunze kwa nini maziwa ya kwanza ya manjano (colostrum) ni chanjo ya asili na mtoto hahitaji maji ya ziada hata kukiwa na joto.',
      contentEn: 'Exclusive breastfeeding means giving only breastmilk and no other foods or drinks—not even water—for the first 6 months of life. Breastmilk contains 88% pure water, antibodies, growth hormones, and vital proteins specifically tailored to your baby’s immune system. Feeding on demand (8 to 12 times in 24 hours) promotes high maternal prolactin and oxytocin levels, strengthening attachment and bonding.',
      contentSw: 'Kunyonyesha maziwa ya mama pekee humaanisha kumpa mtoto maziwa ya mama bila chakula au kinywaji kingine chochote—hata maji—kwa miezi sita ya kwanza ya maisha. Maziwa ya mama yana 88% ya maji safi ya asili, kingamwili, na virutubisho vyote vinavyohitajika. Usitupe maziwa ya kwanza ya manjano (colostrum) kwani ndiyo ngao kuu ya kwanza ya mtoto.',
      published: true,
      authorAgency: 'MoH Kenya',
      readTimeMinutes: 3,
      tags: ['breastfeeding', 'nutrition', 'moh-guidelines']
    },
    {
      _id: 'art-2',
      slug: 'kepi-vaccine-reactions',
      category: 'immunization',
      titleEn: 'Understanding Childhood Vaccines & Mild Normal Reactions',
      titleSw: 'Kuelewa Chanjo za Watoto na Madhara Madogo ya Kawaida',
      summaryEn: 'How to manage mild fever or swelling after Pentavalent or PCV vaccines, and how the BCG scar heals.',
      summarySw: 'Jinsi ya kushughulikia homa ndogo baada ya chanjo za Pentavalent na namna kovu la BCG linavyopona.',
      contentEn: 'Vaccines train your child’s body to resist deadly diseases like polio, pneumonia, rotavirus diarrhea, and measles. After 6-week and 10-week injections, mild fever or swelling at the thigh is common for 24-48 hours. Give paracetamol syrup at pediatric dose if advised by nurse, and apply a cool damp cloth. For the BCG vaccine on the arm, a red pimple forms in 2-4 weeks. Do not squeeze or apply ointments; it heals naturally into a protective scar.',
      contentSw: 'Chanjo humsaidia mtoto kuwa na kinga imara dhidi ya magonjwa hatari kama polio, nimonia, kuhara kwa rotavirus na surua. Ni kawaida kwa mtoto kupata homa ndogo au uvimbe mdogo kwenye paja baada ya sindano ya wiki ya sita. Mpe mtoto dawa ya paracetamol kulingana na maagizo ya muuguzi. Kwa chanjo ya BCG mkononi, kipele kidogo kitatokea na kupona chenyewe na kuacha kovu; usikikamue wala kupaka mafuta.',
      published: true,
      authorAgency: 'MoH Kenya',
      readTimeMinutes: 4,
      tags: ['kepi', 'vaccines', 'fever']
    },
    {
      _id: 'art-3',
      slug: 'danger-signs-young-infant',
      category: 'danger_signs',
      titleEn: 'Critical Danger Signs in Infants: When to Rush to Hospital',
      titleSw: 'Dalili Hatari kwa Mtoto Mchanga: Wakati wa Kukimbilia Hospitali',
      summaryEn: 'Recognize signs such as chest indrawing, convulsions, lethargy, or failure to feed that require immediate emergency care.',
      summarySw: 'Tambua dalili hatari kama kifua kuzama, degedege, kulegea, au kushindwa kunyonya zinazohitaji matibabu ya dharura.',
      contentEn: 'Under the MoH Integrated Management of Childhood Illness (IMCI), seek emergency care immediately if baby has: 1. Chest indrawing or rapid grunting breathing; 2. Convulsions or abnormal twitching; 3. Unable to feed or vomits everything; 4. High fever (>38.5°C) or body unusually cold to touch; 5. Severe lethargy or unresponsiveness; 6. Sunken eyes or sunken fontanelle with dry tongue.',
      contentSw: 'Kulingana na miongozo ya Wizara ya Afya, mpeleke mtoto hospitali ya dharura haraka iwapo ana: 1. Kifua kuzama ndani anapovuta pumzi; 2. Degedege au mikono na macho kugeuka; 3. Kushindwa kabisa kunyonya au kutapika kila kitu; 4. Homa kali au mwili kuwa baridi kama barafu; 5. Kulegea kupita kiasi na kutozinduka; 6. Utosi kuzama ndani sana na kukosa machozi.',
      published: true,
      authorAgency: 'MoH Kenya',
      readTimeMinutes: 3,
      tags: ['emergency', 'danger-signs', 'imci']
    }
  ] as IEducationArticle[]
};

// Seed initial vaccinations and growth measurements for each child
for (const child of db.children) {
  const schedule = generateChildVaccinationSchedule(child._id!, child.dateOfBirth);
  
  // Mark birth doses and 6-week doses as completed for 5-month-old twins
  if (child._id === 'child-1' || child._id === 'child-2') {
    schedule.forEach(v => {
      if (['BCG', 'OPV-0'].includes(v.vaccineCode)) {
        v.status = 'completed';
        v.administeredDate = child.dateOfBirth;
        v.facilityName = 'Pumwani Maternity Hospital';
        v.batchNumber = 'KEPI-BCG-2026A';
        v.verifiedAgainstPaperBooklet = true;
        v.paperBookletPageNumber = 4;
      } else if (['OPV-1', 'PENTA-1', 'PCV-1', 'ROTA-1'].includes(v.vaccineCode)) {
        v.status = 'completed';
        v.administeredDate = '2026-06-22';
        v.facilityName = 'Westlands Health Centre';
        v.batchNumber = 'KEPI-PNT-9912';
        v.verifiedAgainstPaperBooklet = true;
        v.paperBookletPageNumber = 5;
      } else if (['OPV-2', 'PENTA-2', 'PCV-2', 'ROTA-2'].includes(v.vaccineCode)) {
        v.status = 'completed';
        v.administeredDate = '2026-07-20';
        v.facilityName = 'Westlands Health Centre';
        v.batchNumber = 'KEPI-PNT-9944';
        v.verifiedAgainstPaperBooklet = true;
        v.paperBookletPageNumber = 6;
      } else if (['OPV-3', 'IPV', 'PENTA-3', 'PCV-3'].includes(v.vaccineCode)) {
        v.status = 'completed';
        v.administeredDate = '2026-08-20';
        v.facilityName = 'Westlands Health Centre';
        v.batchNumber = 'KEPI-IPV-3021';
        v.verifiedAgainstPaperBooklet = true;
        v.paperBookletPageNumber = 7;
      }
    });
  }

  db.vaccinations.push(...schedule);

  // Seed sample growth history
  const monthsArr = [0, 1.5, 3, 5];
  monthsArr.forEach((m) => {
    const baseW = child.birthWeightKg + m * 0.8;
    const baseH = child.birthLengthCm + m * 3.5;
    const z = calculateZScores(child.gender, m, baseW, baseH);

    const mDate = new Date(child.dateOfBirth);
    mDate.setDate(mDate.getDate() + Math.round(m * 30.4));

    db.growthMeasurements.push({
      _id: `growth-${child._id}-${m}`,
      childId: child._id!,
      measurementDate: mDate.toISOString().split('T')[0],
      ageInMonths: m,
      weightKg: Number(baseW.toFixed(2)),
      heightLengthCm: Number(baseH.toFixed(1)),
      headCircumferenceCm: Number((child.birthHeadCircumferenceCm! + m * 1.3).toFixed(1)),
      muacCm: 13.5,
      zScores: z.zScores,
      nutritionalStatus: z.nutritionalStatus,
      verifiedAgainstPaperBooklet: true,
      recordedByRole: 'clinician',
      recordedByUserId: 'usr-clinician-1',
      notes: 'Growth progressing along normal WHO percentiles.'
    });
  });

  // Seed a sample medical visit
  db.medicalRecords.push({
    _id: `med-${child._id}-1`,
    childId: child._id!,
    clinicianId: 'usr-clinician-1',
    facilityId: 'fac-pumwani',
    visitDate: '2026-08-20',
    visitType: 'routine_well_child',
    chiefComplaint: '14-week routine immunization and growth check',
    temperatureCelsius: 36.8,
    respiratoryRate: 38,
    heartRate: 124,
    diagnoses: ['Well child check', 'Normal developmental milestones achieved'],
    treatmentPlan: 'Administered 14-week KEPI vaccines. Exclusive breastfeeding advised until 6 months.',
    prescribedMedications: [
      { name: 'Paracetamol syrup 120mg/5ml', dosage: '2.5ml', frequency: 'PRN for post-vaccine fever', durationDays: 2 }
    ],
    verifiedAgainstPaperBooklet: true,
    paperBookletSignature: 'Dr. Faith Wanjiku (Pumwani MCH)'
  });
}

// Seed initial journal entries
db.journalEntries.push(
  {
    _id: 'j-1',
    motherId: 'usr-mother-1',
    childId: 'child-1',
    date: '2026-05-11',
    title: 'Welcoming Amani & Baraka into the world',
    content: 'The journey was intense but holding both of them in my arms at Pumwani Maternity made all the pain disappear. The nurses helped us start skin-to-skin kangaroo care immediately.',
    moodTag: 'joyful',
    isPrivate: true
  },
  {
    _id: 'j-2',
    motherId: 'usr-mother-1',
    childId: 'child-2',
    date: '2026-07-22',
    title: '6-week vaccinations day',
    content: 'Both babies had slight fever after their pentavalent injection, but giving them cool compresses and plenty of breastmilk calmed them down by the evening.',
    moodTag: 'calm',
    isPrivate: true
  }
);

// Audit Logger Helper
function logAudit(
  userId: string,
  userRole: string,
  action: IAuditLog['action'],
  resourceType: IAuditLog['resourceType'],
  resourceId: string,
  metadata?: Record<string, unknown>
) {
  db.auditLogs.unshift({
    _id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    userId,
    userRole,
    action,
    resourceType,
    resourceId,
    metadata
  });
  if (db.auditLogs.length > 200) db.auditLogs.pop();
}

/* ========================================================================= */
/* REST API ROUTES                                                           */
/* ========================================================================= */

// Current Session & Auth Me
app.get('/api/auth/me', (req: Request, res: Response) => {
  const role = (req.query.role as string) || 'mother';
  const user = db.users.find(u => u.role === role) || db.users[0];
  res.json({ success: true, user });
});

// Switch role for quick testing and evaluation
app.post('/api/auth/switch-role', (req: Request, res: Response) => {
  const { role } = req.body;
  const user = db.users.find(u => u.role === role);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Role user not found' });
  }
  logAudit(user._id, user.role, 'READ', 'ConsentRecord', user._id, { switchedToRole: role });
  res.json({ success: true, user });
});

// Children Endpoints
app.get('/api/children', (req: Request, res: Response) => {
  res.json({ success: true, children: db.children });
});

app.post('/api/children', (req: Request, res: Response) => {
  const { fullName, dateOfBirth, gender, birthWeightKg, birthLengthCm, birthFacility, isMultipleBirth, multipleBirthGroupId, paperBookletNumber } = req.body;
  
  const newChild: IChild = {
    _id: `child-${Date.now()}`,
    motherId: 'usr-mother-1',
    multipleBirthGroupId: isMultipleBirth ? (multipleBirthGroupId || `group-mult-${Date.now()}`) : undefined,
    isMultipleBirth: Boolean(isMultipleBirth),
    fullName,
    dateOfBirth,
    gender,
    birthWeightKg: Number(birthWeightKg),
    birthLengthCm: Number(birthLengthCm),
    birthHeadCircumferenceCm: 34.0,
    birthFacility: birthFacility || 'Kenya Health Facility',
    paperBookletNumber: paperBookletNumber || `MOH216-GEN-${Date.now()}`,
    opaqueQrToken: `MC-KE-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    verifiedAgainstPaperBooklet: false,
    status: 'active'
  };

  db.children.push(newChild);

  // Generate KEPI schedule
  const schedule = generateChildVaccinationSchedule(newChild._id!, newChild.dateOfBirth);
  db.vaccinations.push(...schedule);

  // Seed birth growth measurement
  const z = calculateZScores(newChild.gender, 0, newChild.birthWeightKg, newChild.birthLengthCm);
  db.growthMeasurements.push({
    _id: `growth-${newChild._id}-0`,
    childId: newChild._id!,
    measurementDate: newChild.dateOfBirth,
    ageInMonths: 0,
    weightKg: newChild.birthWeightKg,
    heightLengthCm: newChild.birthLengthCm,
    headCircumferenceCm: newChild.birthHeadCircumferenceCm,
    muacCm: 11.5,
    zScores: z.zScores,
    nutritionalStatus: z.nutritionalStatus,
    verifiedAgainstPaperBooklet: false,
    recordedByRole: 'mother',
    notes: 'Birth measurement recorded.'
  });

  logAudit('usr-mother-1', 'mother', 'WRITE', 'Child', newChild._id!, { name: newChild.fullName });

  res.status(201).json({ success: true, child: newChild });
});

app.get('/api/children/:id', (req: Request, res: Response) => {
  const child = db.children.find(c => c._id === req.params.id);
  if (!child) return res.status(404).json({ success: false, message: 'Child not found' });
  
  const vaccinations = db.vaccinations.filter(v => v.childId === child._id);
  const growth = db.growthMeasurements.filter(g => g.childId === child._id);
  const medical = db.medicalRecords.filter(m => m.childId === child._id);

  logAudit('usr-mother-1', 'mother', 'READ', 'Child', child._id!);

  res.json({ success: true, child, vaccinations, growth, medical });
});

// Vaccination Management & KEPI
app.get('/api/children/:id/vaccinations', (req: Request, res: Response) => {
  const childVaccinations = db.vaccinations.filter(v => v.childId === req.params.id);
  res.json({ success: true, vaccinations: childVaccinations, catalog: KEPI_VACCINE_CATALOG });
});

app.post('/api/children/:id/vaccinations/:recId/administer', (req: Request, res: Response) => {
  const { batchNumber, facilityName, verifiedAgainstPaperBooklet, paperBookletPageNumber } = req.body;
  const rec = db.vaccinations.find(v => v._id === req.params.recId && v.childId === req.params.id);
  
  if (!rec) return res.status(404).json({ success: false, message: 'Vaccination record not found' });

  rec.status = 'completed';
  rec.administeredDate = new Date().toISOString().split('T')[0];
  rec.batchNumber = batchNumber || 'KEPI-LIVE-BATCH';
  rec.facilityName = facilityName || 'Pumwani Maternity Hospital';
  rec.verifiedAgainstPaperBooklet = Boolean(verifiedAgainstPaperBooklet);
  if (paperBookletPageNumber) rec.paperBookletPageNumber = Number(paperBookletPageNumber);

  logAudit('usr-clinician-1', 'clinician', 'UPDATE', 'VaccinationRecord', rec._id!, {
    vaccine: rec.vaccineCode,
    verifiedAgainstPaperBooklet: rec.verifiedAgainstPaperBooklet
  });

  res.json({ success: true, record: rec });
});

// Toggle Verification Against Paper Booklet for any record
app.post('/api/children/:id/paper-booklet-sync', (req: Request, res: Response) => {
  const { isVerified, bookletSerial } = req.body;
  const child = db.children.find(c => c._id === req.params.id);
  if (!child) return res.status(404).json({ success: false, message: 'Child not found' });

  child.verifiedAgainstPaperBooklet = Boolean(isVerified);
  if (bookletSerial) child.paperBookletNumber = bookletSerial;

  logAudit('usr-clinician-1', 'clinician', 'UPDATE', 'Child', child._id!, {
    verifiedAgainstPaperBooklet: child.verifiedAgainstPaperBooklet,
    bookletSerial: child.paperBookletNumber
  });

  res.json({ success: true, child });
});

// Growth Tracking & WHO Standards
app.get('/api/children/:id/growth', (req: Request, res: Response) => {
  const measurements = db.growthMeasurements.filter(g => g.childId === req.params.id);
  res.json({ success: true, measurements, referenceTable: WHO_GROWTH_REFERENCE });
});

app.post('/api/children/:id/growth', (req: Request, res: Response) => {
  const { weightKg, heightLengthCm, headCircumferenceCm, muacCm, notes, verifiedAgainstPaperBooklet, ageInMonths } = req.body;
  const child = db.children.find(c => c._id === req.params.id);
  if (!child) return res.status(404).json({ success: false, message: 'Child not found' });

  const calculatedAge = ageInMonths !== undefined ? Number(ageInMonths) : (() => {
    const dob = new Date(child.dateOfBirth);
    const now = new Date();
    return Number(((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)).toFixed(1));
  })();

  const z = calculateZScores(child.gender, calculatedAge, Number(weightKg), Number(heightLengthCm));

  const newMeasurement: IGrowthMeasurement = {
    _id: `growth-${child._id}-${Date.now()}`,
    childId: child._id!,
    measurementDate: new Date().toISOString().split('T')[0],
    ageInMonths: calculatedAge,
    weightKg: Number(weightKg),
    heightLengthCm: Number(heightLengthCm),
    headCircumferenceCm: headCircumferenceCm ? Number(headCircumferenceCm) : undefined,
    muacCm: muacCm ? Number(muacCm) : undefined,
    zScores: z.zScores,
    nutritionalStatus: z.nutritionalStatus,
    verifiedAgainstPaperBooklet: Boolean(verifiedAgainstPaperBooklet),
    recordedByRole: 'clinician',
    notes: notes || 'Routine growth monitoring.'
  };

  db.growthMeasurements.push(newMeasurement);

  logAudit('usr-clinician-1', 'clinician', 'WRITE', 'GrowthMeasurement', newMeasurement._id!, {
    weight: newMeasurement.weightKg,
    nutritionalStatus: newMeasurement.nutritionalStatus
  });

  res.status(201).json({ success: true, measurement: newMeasurement });
});

// Developmental Milestones
app.get('/api/milestones', (_req: Request, res: Response) => {
  res.json({ success: true, milestones: MILESTONES_CATALOG, nutrition: NUTRITION_BY_AGE_KENYA });
});

// FHIR R4 & MoH KHIS CSV Export Endpoints
app.get('/api/children/:id/fhir', (req: Request, res: Response) => {
  const child = db.children.find(c => c._id === req.params.id);
  if (!child) return res.status(404).json({ success: false, message: 'Child not found' });

  const childVaccinations = db.vaccinations.filter(v => v.childId === child._id);
  const childGrowth = db.growthMeasurements.filter(g => g.childId === child._id);

  const fhirPatient = mapChildToFhirPatient(child, '+254712345678');
  const fhirImmunizations = childVaccinations.map(v => mapVaccinationToFhirImmunization(v, child));
  const fhirObservations = childGrowth.map(g => mapGrowthToFhirObservation(g, child));

  logAudit('usr-clinician-1', 'clinician', 'DATA_EXPORT', 'Child', child._id!, { format: 'FHIR_R4_BUNDLE' });

  res.json({
    resourceType: 'Bundle',
    type: 'collection',
    timestamp: new Date().toISOString(),
    entry: [
      { resource: fhirPatient },
      ...fhirImmunizations.map(i => ({ resource: i })),
      ...fhirObservations.map(o => ({ resource: o }))
    ]
  });
});

app.get('/api/children/:id/moh-csv', (req: Request, res: Response) => {
  const child = db.children.find(c => c._id === req.params.id);
  if (!child) return res.status(404).json({ success: false, message: 'Child not found' });

  const childVaccinations = db.vaccinations.filter(v => v.childId === child._id);
  const csvData = exportToMoHCsv(childVaccinations, child);

  logAudit('usr-clinician-1', 'clinician', 'DATA_EXPORT', 'Child', child._id!, { format: 'CSV' });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="MoH216_${child.fullName.replace(/\s+/g, '_')}.csv"`);
  res.send(csvData);
});

// QR Code Lookup (Clinician scanning child QR code badge)
app.post('/api/qr/lookup', (req: Request, res: Response) => {
  const { qrToken } = req.body;
  const child = db.children.find(c => c.opaqueQrToken === qrToken);

  if (!child) {
    return res.status(404).json({ success: false, message: 'No child found matching this QR token.' });
  }

  logAudit('usr-clinician-1', 'clinician', 'QR_LOOKUP', 'Child', child._id!, { token: qrToken });

  const vaccinations = db.vaccinations.filter(v => v.childId === child._id);
  const growth = db.growthMeasurements.filter(g => g.childId === child._id);

  res.json({ success: true, child, vaccinations, growth });
});

// AI Assistant & Triage Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, childId, preferredLanguage } = req.body;
  const child = db.children.find(c => c._id === childId) || db.children[0];

  const now = new Date();
  const dob = new Date(child.dateOfBirth);
  const ageMonths = Number(((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)).toFixed(1));

  const upcomingVaccine = db.vaccinations.find(v => v.childId === child._id && (v.status === 'upcoming' || v.status === 'due'))?.vaccineName;

  const result = await generateMamaCareAdvice(message, {
    childName: child.fullName,
    childAgeMonths: ageMonths,
    gender: child.gender,
    weightKg: child.birthWeightKg + 3.0,
    upcomingVaccine,
    preferredLanguage: preferredLanguage || 'sw'
  });

  if (result.dangerSignDetected) {
    logAudit('usr-mother-1', 'mother', 'EMERGENCY_TRIGGER', 'Child', child._id!, {
      matchedRules: result.emergencyData?.matchedRules.map(r => r.nameEn)
    });
  }

  res.json({ success: true, ...result });
});

// Emergency Alert Dispatch
app.post('/api/emergency/trigger', async (req: Request, res: Response) => {
  const { childId, dangerSigns, contactPhone } = req.body;
  const child = db.children.find(c => c._id === childId) || db.children[0];

  const smsProvider = new SimulatedSmsProvider();
  const smsBody = `MAMACARE EMERGENCY ALERT: Urgent danger signs detected for baby ${child.fullName} (DOB: ${child.dateOfBirth}). Immediate referral to Pumwani or KNH required. Hotline: +254 20 2726300.`;

  const smsResult = await smsProvider.sendSms({
    to: contactPhone || '+254722998877',
    message: smsBody,
    from: 'MAMACARE'
  });

  const alertRecord = {
    _id: `alert-${Date.now()}`,
    childId: child._id,
    childName: child.fullName,
    dangerSigns: dangerSigns || ['Severe fever', 'Difficulty breathing'],
    detectedAt: new Date().toISOString(),
    smsDispatched: smsResult.success,
    smsMessageId: smsResult.messageId,
    facilities: KENYA_REFERRAL_FACILITIES
  };

  db.emergencyAlerts.unshift(alertRecord);

  logAudit('usr-mother-1', 'mother', 'EMERGENCY_TRIGGER', 'Child', child._id!, {
    alertId: alertRecord._id,
    smsDispatched: smsResult.success
  });

  res.json({ success: true, alert: alertRecord, smsResult });
});

// SMS Outbox & Dispatch
app.get('/api/sms/outbox', (_req: Request, res: Response) => {
  res.json({ success: true, outbox: SimulatedSmsProvider.getOutbox() });
});

app.post('/api/sms/send', async (req: Request, res: Response) => {
  const { to, message } = req.body;
  const provider = process.env.AFRICASTALKING_API_KEY ? new AfricasTalkingProvider() : new SimulatedSmsProvider();
  const result = await provider.sendSms({ to, message, from: 'MAMACARE' });
  res.json({ success: true, result });
});

// Maternal Health & Wellbeing
app.get('/api/maternal-health', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.maternalHealth });
});

app.post('/api/maternal-health/epds', (req: Request, res: Response) => {
  const { score, notes } = req.body;
  const risk = score >= 10 ? 'high' : score >= 7 ? 'moderate' : 'low';
  const entry = {
    date: new Date().toISOString().split('T')[0],
    score: Number(score),
    risk,
    notes: notes || 'Edinburgh Postnatal Depression check completed.'
  };
  db.maternalHealth.epdsScores.unshift(entry);
  res.json({ success: true, entry });
});

// Digital Mother Journal
app.get('/api/journal', (_req: Request, res: Response) => {
  res.json({ success: true, entries: db.journalEntries });
});

app.post('/api/journal', (req: Request, res: Response) => {
  const { title, content, moodTag, childId } = req.body;
  const newEntry: IJournalEntry = {
    _id: `j-${Date.now()}`,
    motherId: 'usr-mother-1',
    childId: childId || db.children[0]._id,
    date: new Date().toISOString().split('T')[0],
    title,
    content,
    moodTag: moodTag || 'calm',
    isPrivate: true
  };
  db.journalEntries.unshift(newEntry);
  res.status(201).json({ success: true, entry: newEntry });
});

// Community Education Articles
app.get('/api/education', (_req: Request, res: Response) => {
  res.json({ success: true, articles: db.articles });
});

// Facility Analytics Dashboard
app.get('/api/analytics/facility', (_req: Request, res: Response) => {
  const totalChildren = db.children.length;
  const totalVaccinations = db.vaccinations.length;
  const completedVaccinations = db.vaccinations.filter(v => v.status === 'completed').length;
  const overdueVaccinations = db.vaccinations.filter(v => v.status === 'overdue').length;
  const paperVerifiedVaccinations = db.vaccinations.filter(v => v.verifiedAgainstPaperBooklet).length;

  const completionRate = totalVaccinations > 0 ? Number(((completedVaccinations / totalVaccinations) * 100).toFixed(1)) : 0;
  const paperVerificationRate = completedVaccinations > 0 ? Number(((paperVerifiedVaccinations / completedVaccinations) * 100).toFixed(1)) : 0;

  // Defaulter list: children with overdue vaccinations
  const defaulters = db.children.filter(c => {
    return db.vaccinations.some(v => v.childId === c._id && v.status === 'overdue');
  }).map(c => {
    const overdueList = db.vaccinations.filter(v => v.childId === c._id && v.status === 'overdue');
    return {
      childId: c._id,
      name: c.fullName,
      dob: c.dateOfBirth,
      overdueCount: overdueList.length,
      overdueVaccines: overdueList.map(v => v.vaccineCode),
      phone: '+254712345678',
      paperBookletNumber: c.paperBookletNumber
    };
  });

  res.json({
    success: true,
    stats: {
      totalChildren,
      totalVaccinations,
      completedVaccinations,
      overdueVaccinations,
      completionRate,
      paperVerificationRate,
      activeEmergencies: db.emergencyAlerts.length,
      defaulterCount: defaulters.length
    },
    defaulters,
    facilities: KENYA_REFERRAL_FACILITIES
  });
});

// Audit Logs
app.get('/api/audit-logs', (_req: Request, res: Response) => {
  res.json({ success: true, logs: db.auditLogs });
});

// Data Portability / Export under KDPA 2019
app.get('/api/backup/export', (_req: Request, res: Response) => {
  const fullSnapshot = {
    exportedAt: new Date().toISOString(),
    governingAct: 'Kenya Data Protection Act, 2019 (KDPA)',
    dataSubject: db.users[0],
    children: db.children,
    vaccinations: db.vaccinations,
    growth: db.growthMeasurements,
    journal: db.journalEntries,
    maternalHealth: db.maternalHealth
  };

  logAudit('usr-mother-1', 'mother', 'DATA_EXPORT', 'ConsentRecord', 'usr-mother-1', {
    reason: 'KDPA Right to Data Portability'
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="MamaCare_KDPA_Export.json"');
  res.send(JSON.stringify(fullSnapshot, null, 2));
});

/* ========================================================================= */
/* VITE DEV SERVER MIDDLEWARE MOUNTING                                      */
/* ========================================================================= */

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MamaCare+ Kenya server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
