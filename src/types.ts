export type UserRole = 'mother' | 'clinician' | 'admin';
export type AppLanguage = 'sw' | 'en';

export interface Child {
  _id: string;
  motherId: string;
  multipleBirthGroupId?: string;
  isMultipleBirth: boolean;
  birthOrderInMultiple?: number;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  birthWeightKg: number;
  birthLengthCm: number;
  birthHeadCircumferenceCm?: number;
  birthFacility: string;
  paperBookletNumber?: string;
  opaqueQrToken: string;
  verifiedAgainstPaperBooklet: boolean;
  status: 'active' | 'archived';
}

export interface VaccinationRecord {
  _id: string;
  childId: string;
  vaccineCode: string;
  vaccineName: string;
  doseNumber: number;
  scheduledDate: string;
  predictedDate?: string;
  administeredDate?: string;
  status: 'upcoming' | 'due' | 'overdue' | 'completed' | 'missed';
  batchNumber?: string;
  facilityName?: string;
  verifiedAgainstPaperBooklet: boolean;
  paperBookletPageNumber?: number;
}

export interface GrowthMeasurement {
  _id: string;
  childId: string;
  measurementDate: string;
  ageInMonths: number;
  weightKg: number;
  heightLengthCm: number;
  headCircumferenceCm?: number;
  muacCm?: number;
  zScores: {
    weightForAge: number;
    heightForAge: number;
    weightForHeight: number;
    bmiForAge: number;
  };
  nutritionalStatus: string;
  verifiedAgainstPaperBooklet: boolean;
  notes?: string;
}

export interface Milestone {
  _id: string;
  category: 'gross_motor' | 'fine_motor' | 'language_speech' | 'cognitive_social';
  titleEn: string;
  titleSw: string;
  descriptionEn: string;
  descriptionSw: string;
  expectedAgeMonthsMin: number;
  expectedAgeMonthsMax: number;
  guidanceIfDelayedEn: string;
  guidanceIfDelayedSw: string;
  achieved?: boolean;
}

export interface JournalEntry {
  _id: string;
  motherId: string;
  childId?: string;
  date: string;
  title: string;
  content: string;
  moodTag: 'joyful' | 'calm' | 'exhausted' | 'anxious' | 'overwhelmed' | 'supported';
  isPrivate: boolean;
}

export interface EducationArticle {
  _id: string;
  slug: string;
  category: string;
  titleEn: string;
  titleSw: string;
  summaryEn: string;
  summarySw: string;
  contentEn: string;
  contentSw: string;
  readTimeMinutes: number;
  authorAgency: string;
  tags: string[];
}

export interface NotificationItem {
  _id: string;
  category: 'vaccine_upcoming' | 'vaccine_overdue' | 'growth_check' | 'postnatal' | 'danger_alert' | 'journal_prompt';
  titleEn: string;
  titleSw: string;
  bodyEn: string;
  bodySw: string;
  timestamp: string;
  isRead: boolean;
  channel: 'sms' | 'in_app' | 'both';
  smsDelivered?: boolean;
  smsMessageId?: string;
}

export interface BackupSnapshot {
  exportedAt: string;
  governingAct: string;
  checksum: string;
  recordsCount: {
    children: number;
    vaccinations: number;
    growth: number;
    journal: number;
  };
}
