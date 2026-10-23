/**
 * MamaCare+ Kenya — Test Suite
 * Tests KEPI Scheduler, WHO Anthropometric Z-Score Math, and IMCI Emergency Rule Scanner.
 */

import { generateChildVaccinationSchedule, KEPI_VACCINE_CATALOG } from '../services/kepiScheduler';
import { calculateZScores, WHO_GROWTH_REFERENCE } from '../services/growthStandards';
import { scanForDangerSigns } from '../services/emergencyDetection';

export function runTestSuite() {
  console.log('--- Running MamaCare+ Kenya Test Suite ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. KEPI Scheduler Tests
  const testDob = '2026-01-01';
  const schedule = generateChildVaccinationSchedule('test-child-1', testDob);
  assert(schedule.length === KEPI_VACCINE_CATALOG.length, 'Generates full KEPI schedule for all cataloged vaccines');
  
  const bcg = schedule.find(s => s.vaccineCode === 'BCG');
  assert(bcg !== undefined && bcg.scheduledDate === '2026-01-01', 'BCG is scheduled at birth (0 weeks)');

  const penta1 = schedule.find(s => s.vaccineCode === 'PENTA-1');
  assert(penta1 !== undefined, 'Pentavalent 1 is generated');

  // 2. WHO Anthropometric Z-Scores Tests
  const boyAtBirth = calculateZScores('male', 0, 3.3, 49.9);
  assert(Math.abs(boyAtBirth.zScores.weightForAge) <= 0.1, 'Boy at median weight (3.3kg) has WAZ ~ 0.0');
  assert(boyAtBirth.nutritionalStatus === 'normal', 'Median infant classified as normal nutritional status');

  const malnourishedChild = calculateZScores('female', 12, 6.0, 72.0); // Severely low weight for 12m girl
  assert(malnourishedChild.zScores.weightForAge < -2.0, 'Detects moderate or severe acute malnutrition when WAZ < -2.0');

  // 3. IMCI Emergency Rules Scanner Tests
  const feverScan = scanForDangerSigns('Mtoto ana homa kali sana na anawaka moto', 1);
  assert(feverScan.detected === true, 'Detects neonatal high fever danger sign in Swahili');

  const convulsionScan = scanForDangerSigns('Baby is having convulsions and twitching eyes');
  assert(convulsionScan.detected === true, 'Detects infant convulsions danger sign in English');

  const normalMessage = scanForDangerSigns('Mtoto ananyonya vizuri na amelala salama');
  assert(normalMessage.detected === false, 'Normal healthy update produces no emergency false positives');

  console.log(`--- Test Summary: ${passed} passed, ${failed} failed ---`);
  return { passed, failed };
}

if (process.env.RUN_TESTS === 'true') {
  runTestSuite();
}
