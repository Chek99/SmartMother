/**
 * MamaCare+ Kenya — Mongoose Schemas and TypeScript Interfaces
 * 
 * Compliant with:
 * - Kenya Data Protection Act (KDPA) 2019
 * - Kenya Expanded Programme on Immunization (KEPI)
 * - WHO Child Growth Standards
 * - Ministry of Health Kenya (MoH 216 Mother and Child Health Booklet)
 */

export interface IUser {
  _id?: string;
  phone: string; // E.164 format (+254...)
  email?: string;
  passwordHash: string;
  role: 'mother' | 'clinician' | 'admin';
  fullName: string;
  preferredLanguage: 'sw' | 'en';
  status: 'active' | 'suspended' | 'pending_verification';
  twoFactorEnabled?: boolean;
  refreshTokens?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMotherProfile {
  _id?: string;
  userId: string;
  nationalIdOrPassport?: string;
  county: string; // e.g. Nairobi, Kiambu, Mombasa, Kisumu
  subCounty?: string;
  primaryFacilityId?: string; // Linked MoH dispensary/hospital
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  gravida?: number; // Total pregnancies
  parity?: number; // Viable births
  ancVisits?: Array<{
    visitNumber: number;
    date: string;
    facility: string;
    gestationalAgeWeeks: number;
    weightKg: number;
    bloodPressure: string;
    hbLevel: number; // g/dL
    notes: string;
    verifiedAgainstPaperBooklet: boolean;
  }>;
  mentalHealthScreenings?: Array<{
    date: string;
    tool: 'EPDS' | 'PHQ-9';
    score: number;
    riskLevel: 'low' | 'moderate' | 'high';
    followUpRequired: boolean;
    notes?: string;
  }>;
  consentRecordId?: string;
  createdAt?: Date;
}

export interface IChild {
  _id?: string;
  motherId: string;
  multipleBirthGroupId?: string; // If part of twins/triplets
  isMultipleBirth: boolean;
  birthOrderInMultiple?: number;
  fullName: string;
  dateOfBirth: string; // ISO date YYYY-MM-DD
  gender: 'male' | 'female';
  birthWeightKg: number;
  birthLengthCm: number;
  birthHeadCircumferenceCm?: number;
  birthFacility: string;
  birthCertificateOrNotifNumber?: string;
  bloodGroup?: string;
  apgarScore1Min?: number;
  apgarScore5Min?: number;
  specialConditions?: string[];
  opaqueQrToken: string; // Unique cryptographically random non-guessable string
  paperBookletNumber?: string; // Serial printed on physical MOH booklet
  verifiedAgainstPaperBooklet: boolean;
  avatarUrl?: string;
  status: 'active' | 'archived';
  createdAt?: Date;
}

export interface IMultipleBirthGroup {
  _id?: string;
  motherId: string;
  type: 'twins' | 'triplets' | 'higher_order';
  deliveryDate: string;
  facility: string;
  childrenIds: string[];
  notes?: string;
}

export interface IVaccineDefinition {
  _id?: string;
  vaccineCode: string; // e.g. BCG, OPV-0, PENTA-1, PCV-1, ROTA-1, MEASLES-1
  name: string;
  targetDisease: string;
  recommendedAgeWeeks: number; // 0, 6, 10, 14, 24, 36 (9 mos), 78 (18 mos)
  gracePeriodDays: number; // Grace period before marked overdue
  routeOfAdministration: 'Intradermal' | 'Oral' | 'Intramuscular' | 'Subcutaneous';
  dosage: string;
  mandatoryKepi: boolean;
  manufacturerInfo?: string;
  notesSwahili: string;
  notesEnglish: string;
}

export interface IVaccinationRecord {
  _id?: string;
  childId: string;
  vaccineCode: string;
  vaccineName: string;
  doseNumber: number;
  scheduledDate: string; // Estimated based on DOB
  predictedDate?: string; // Smart ML/heuristics recommended catch-up date
  administeredDate?: string;
  status: 'upcoming' | 'due' | 'overdue' | 'completed' | 'missed';
  administeredByClinicianId?: string;
  facilityName?: string;
  batchNumber?: string;
  verifiedAgainstPaperBooklet: boolean;
  paperBookletPageNumber?: number;
  adverseReactionsReported?: string;
  createdAt?: Date;
}

export interface IGrowthMeasurement {
  _id?: string;
  childId: string;
  measurementDate: string;
  ageInMonths: number;
  weightKg: number;
  heightLengthCm: number;
  headCircumferenceCm?: number;
  muacCm?: number; // Mid-upper arm circumference (malnutrition screen)
  zScores: {
    weightForAge: number;
    heightForAge: number;
    weightForHeight: number;
    bmiForAge: number;
  };
  nutritionalStatus: 'normal' | 'moderate_malnutrition' | 'severe_acute_malnutrition' | 'stunted' | 'overweight';
  verifiedAgainstPaperBooklet: boolean;
  recordedByRole: 'mother' | 'clinician';
  recordedByUserId?: string;
  notes?: string;
  createdAt?: Date;
}

export interface IMilestoneDefinition {
  _id?: string;
  category: 'gross_motor' | 'fine_motor' | 'language_speech' | 'cognitive_social';
  titleEn: string;
  titleSw: string;
  descriptionEn: string;
  descriptionSw: string;
  expectedAgeMonthsMin: number;
  expectedAgeMonthsMax: number;
  guidanceIfDelayedEn: string;
  guidanceIfDelayedSw: string;
}

export interface IMilestoneRecord {
  _id?: string;
  childId: string;
  milestoneId: string;
  status: 'achieved' | 'emerging' | 'delayed' | 'not_yet';
  achievedDate?: string;
  observedByMother: boolean;
  verifiedByClinician: boolean;
  notes?: string;
  createdAt?: Date;
}

export interface IMedicalRecord {
  _id?: string;
  childId: string;
  clinicianId: string;
  facilityId: string;
  visitDate: string;
  visitType: 'routine_well_child' | 'sick_child' | 'emergency' | 'follow_up';
  chiefComplaint?: string;
  temperatureCelsius?: number;
  respiratoryRate?: number;
  heartRate?: number;
  diagnoses: string[];
  treatmentPlan: string;
  prescribedMedications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    durationDays: number;
  }>;
  referralToFacility?: string;
  verifiedAgainstPaperBooklet: boolean;
  paperBookletSignature?: string;
  auditTrailId?: string;
  createdAt?: Date;
}

export interface IAppointment {
  _id?: string;
  childId: string;
  motherId: string;
  facilityId: string;
  facilityName: string;
  appointmentType: 'vaccination' | 'growth_monitoring' | 'postnatal' | 'pediatric_consultation';
  appointmentDate: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'defaulter';
  smsReminderSent: boolean;
  notes?: string;
  createdAt?: Date;
}

export interface IJournalEntry {
  _id?: string;
  motherId: string;
  childId?: string;
  date: string;
  title: string;
  content: string;
  moodTag: 'joyful' | 'calm' | 'exhausted' | 'anxious' | 'overwhelmed' | 'supported';
  photoUrl?: string;
  isPrivate: boolean;
  createdAt?: Date;
}

export interface IChatSession {
  _id?: string;
  motherId: string;
  childId?: string;
  title: string;
  language: 'sw' | 'en';
  messages: Array<{
    id: string;
    sender: 'user' | 'assistant' | 'system';
    text: string;
    timestamp: string;
    audioUrl?: string;
    dangerSignDetected?: boolean;
    referencedMoHGuideline?: string;
  }>;
  status: 'active' | 'archived';
  deletedByMother?: boolean;
  createdAt?: Date;
}

export interface IEmergencyEvent {
  _id?: string;
  motherId: string;
  childId?: string;
  detectedAt: string;
  triggerSource: 'chatbot_nlp' | 'manual_sos_button' | 'symptom_logger' | 'clinician_triage';
  dangerSigns: string[]; // e.g. "Convulsions", "High fever >38.5C in <2 months", "Chest indrawing"
  childVitalsSnapshot?: {
    ageMonths: number;
    weightKg?: number;
  };
  recommendedImmediateActionEn: string;
  recommendedImmediateActionSw: string;
  nearestFacilityName: string;
  nearestFacilityPhone: string;
  emergencySmsDispatched: boolean;
  smsRecipientPhone?: string;
  resolvedAt?: string;
  resolutionStatus: 'pending' | 'referred' | 'at_hospital' | 'resolved';
}

export interface INotification {
  _id?: string;
  recipientUserId: string;
  channel: 'sms' | 'in_app' | 'both';
  category: 'vaccine_reminder' | 'appointment' | 'growth_faltering' | 'danger_alert' | 'mother_wellbeing';
  titleEn: string;
  titleSw: string;
  bodyEn: string;
  bodySw: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  retryCount: number;
  scheduledFor: string;
  sentAt?: string;
  smsGatewayProvider: 'africas_talking' | 'simulated';
  smsMessageId?: string;
  isRead: boolean;
}

export interface IFacility {
  _id?: string;
  mflCode: string; // Kenya Master Facility List code (e.g. 12864)
  name: string;
  county: string;
  subCounty: string;
  facilityLevel: 'Level 2 Dispensary' | 'Level 3 Health Centre' | 'Level 4 Sub-County Hospital' | 'Level 5 County Referral' | 'Level 6 National Referral';
  latitude: number;
  longitude: number;
  emergencyPhone: string;
  isKepiAccredited: boolean;
  coldChainCertified: boolean;
}

export interface IClinicianProfile {
  _id?: string;
  userId: string;
  facilityId: string;
  cadre: 'Nurse' | 'Clinical Officer' | 'Medical Doctor' | 'Pediatrician' | 'CHW';
  registrationCouncilNumber: string; // KMPDC or NCK license
  authorizedToSignBooklet: boolean;
  digitalSignatureHash?: string;
}

export interface IEducationArticle {
  _id?: string;
  slug: string;
  category: 'newborn_care' | 'nutrition' | 'immunization' | 'hygiene' | 'mental_health' | 'danger_signs';
  titleEn: string;
  titleSw: string;
  summaryEn: string;
  summarySw: string;
  contentEn: string;
  contentSw: string;
  audioVoiceFileEn?: string;
  audioVoiceFileSw?: string;
  tags: string[];
  published: boolean;
  authorAgency: 'MoH Kenya' | 'WHO' | 'MamaCare Medical Advisory';
  readTimeMinutes: number;
}

export interface IAuditLog {
  _id?: string;
  timestamp: string;
  userId: string;
  userRole: string;
  action: 'READ' | 'WRITE' | 'UPDATE' | 'DELETE' | 'QR_LOOKUP' | 'EMERGENCY_TRIGGER' | 'DATA_EXPORT';
  resourceType: 'Child' | 'VaccinationRecord' | 'MedicalRecord' | 'GrowthMeasurement' | 'ConsentRecord';
  resourceId: string;
  ipAddress?: string;
  userAgent?: string;
  verifiedAgainstPaperBooklet?: boolean;
  metadata?: Record<string, unknown>;
}

export interface IBackupJob {
  _id?: string;
  jobId: string;
  initiatedAt: string;
  completedAt?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  backupType: 'automated_daily' | 'manual_snapshot';
  encryptedArchiveChecksum: string;
  storageLocation: string; // e.g. 's3://mamacare-backups-nairobi/encrypted/'
  recordCount: number;
  error?: string;
}

export interface IConsentRecord {
  _id?: string;
  motherUserId: string;
  consentedAt: string;
  kdpaCompliantVersion: '2026.1';
  dataProcessingAgreed: boolean;
  emergencyContactAlertAgreed: boolean;
  hospitalClinicianAccessAgreed: boolean;
  anonymizedResearchAgreed: boolean;
  ipAddress?: string;
  withdrawnAt?: string;
}

/**
 * Raw Mongoose Schema Definitions (for MongoDB / Mongoose connection)
 */
export const MongooseSchemaDefinitions = {
  User: {
    phone: { type: String, required: true, unique: true, index: true },
    email: { type: String, sparse: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['mother', 'clinician', 'admin'], default: 'mother', index: true },
    fullName: { type: String, required: true },
    preferredLanguage: { type: String, enum: ['sw', 'en'], default: 'sw' },
    status: { type: String, enum: ['active', 'suspended', 'pending_verification'], default: 'active' },
    refreshTokens: [{ type: String }],
  },
  Child: {
    motherId: { type: String, required: true, index: true },
    multipleBirthGroupId: { type: String, sparse: true, index: true },
    isMultipleBirth: { type: Boolean, default: false },
    birthOrderInMultiple: { type: Number },
    fullName: { type: String, required: true },
    dateOfBirth: { type: String, required: true, index: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    birthWeightKg: { type: Number, required: true },
    birthLengthCm: { type: Number, required: true },
    birthFacility: { type: String, required: true },
    opaqueQrToken: { type: String, required: true, unique: true, index: true },
    verifiedAgainstPaperBooklet: { type: Boolean, default: false },
    paperBookletNumber: { type: String, index: true },
  },
  VaccinationRecord: {
    childId: { type: String, required: true, index: true },
    vaccineCode: { type: String, required: true, index: true },
    scheduledDate: { type: String, required: true, index: true },
    administeredDate: { type: String },
    status: { type: String, enum: ['upcoming', 'due', 'overdue', 'completed', 'missed'], default: 'upcoming', index: true },
    batchNumber: { type: String },
    verifiedAgainstPaperBooklet: { type: Boolean, default: false, index: true },
    facilityName: { type: String },
  },
  GrowthMeasurement: {
    childId: { type: String, required: true, index: true },
    measurementDate: { type: String, required: true, index: true },
    ageInMonths: { type: Number, required: true },
    weightKg: { type: Number, required: true },
    heightLengthCm: { type: Number, required: true },
    nutritionalStatus: { type: String, index: true },
    verifiedAgainstPaperBooklet: { type: Boolean, default: false },
  },
  EmergencyEvent: {
    motherId: { type: String, required: true, index: true },
    childId: { type: String, sparse: true, index: true },
    detectedAt: { type: String, required: true, index: true },
    resolutionStatus: { type: String, default: 'pending', index: true },
  },
  AuditLog: {
    timestamp: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true },
    resourceType: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
  }
};
