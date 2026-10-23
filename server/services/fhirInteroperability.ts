/**
 * HL7 FHIR R4 & KenyaEMR / DHIS2 Interoperability Layer
 * Formats MamaCare+ child records into standard international and national healthcare exchanges.
 */

import { IChild, IVaccinationRecord, IGrowthMeasurement } from '../models/schemas';

export function mapChildToFhirPatient(child: IChild, motherPhone?: string) {
  return {
    resourceType: 'Patient',
    id: child._id,
    identifier: [
      {
        system: 'urn:oid:ke.go.health.kmfl',
        value: child.birthCertificateOrNotifNumber || `MOH-MCH-${child._id}`
      },
      {
        system: 'urn:oid:ke.mamacare.qr',
        value: child.opaqueQrToken
      }
    ],
    active: true,
    name: [
      {
        use: 'official',
        text: child.fullName
      }
    ],
    gender: child.gender === 'male' ? 'male' : 'female',
    birthDate: child.dateOfBirth,
    telecom: motherPhone ? [
      {
        system: 'phone',
        value: motherPhone,
        use: 'mobile'
      }
    ] : [],
    extension: [
      {
        url: 'http://hl7.org/fhir/StructureDefinition/patient-birthPlace',
        valueAddress: {
          text: child.birthFacility
        }
      },
      {
        url: 'https://health.go.ke/fhir/StructureDefinition/verifiedAgainstPaperBooklet',
        valueBoolean: child.verifiedAgainstPaperBooklet
      }
    ]
  };
}

export function mapVaccinationToFhirImmunization(rec: IVaccinationRecord, child: IChild) {
  return {
    resourceType: 'Immunization',
    id: rec._id,
    status: rec.status === 'completed' ? 'completed' : 'not-done',
    vaccineCode: {
      coding: [
        {
          system: 'urn:oid:ke.go.health.kepi',
          code: rec.vaccineCode,
          display: rec.vaccineName
        }
      ],
      text: rec.vaccineName
    },
    patient: {
      reference: `Patient/${child._id}`,
      display: child.fullName
    },
    occurrenceDateTime: rec.administeredDate || rec.scheduledDate,
    primarySource: true,
    lotNumber: rec.batchNumber || 'KEPI-STANDARD',
    location: {
      display: rec.facilityName || 'Kenya Health Facility'
    },
    extension: [
      {
        url: 'https://health.go.ke/fhir/StructureDefinition/paperBookletPage',
        valueInteger: rec.paperBookletPageNumber || 1
      },
      {
        url: 'https://health.go.ke/fhir/StructureDefinition/verifiedAgainstPaperBooklet',
        valueBoolean: rec.verifiedAgainstPaperBooklet
      }
    ]
  };
}

export function mapGrowthToFhirObservation(growth: IGrowthMeasurement, child: IChild) {
  return {
    resourceType: 'Observation',
    id: growth._id,
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs'
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '29463-7',
          display: 'Body weight'
        }
      ],
      text: 'Infant Anthropometric Growth Assessment'
    },
    subject: {
      reference: `Patient/${child._id}`,
      display: child.fullName
    },
    effectiveDateTime: growth.measurementDate,
    component: [
      {
        code: { text: 'Weight (kg)' },
        valueQuantity: {
          value: growth.weightKg,
          unit: 'kg',
          system: 'http://unitsofmeasure.org',
          code: 'kg'
        }
      },
      {
        code: { text: 'Length/Height (cm)' },
        valueQuantity: {
          value: growth.heightLengthCm,
          unit: 'cm',
          system: 'http://unitsofmeasure.org',
          code: 'cm'
        }
      },
      {
        code: { text: 'Weight-for-age Z-Score' },
        valueQuantity: {
          value: growth.zScores?.weightForAge ?? 0
        }
      }
    ]
  };
}

/**
 * Generate CSV representation for DHIS2 / MoH KHIS Aggregate Upload
 */
export function exportToMoHCsv(records: IVaccinationRecord[], child: IChild): string {
  const headers = ['ChildName', 'DOB', 'PaperBookletNo', 'VaccineCode', 'VaccineName', 'ScheduledDate', 'AdministeredDate', 'Status', 'Batch', 'Facility', 'VerifiedAgainstPaper'];
  const rows = records.map(r => [
    `"${child.fullName}"`,
    child.dateOfBirth,
    child.paperBookletNumber || 'N/A',
    r.vaccineCode,
    `"${r.vaccineName}"`,
    r.scheduledDate,
    r.administeredDate || '',
    r.status,
    r.batchNumber || '',
    `"${r.facilityName || ''}"`,
    r.verifiedAgainstPaperBooklet ? 'YES' : 'NO'
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}
