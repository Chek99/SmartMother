/**
 * Emergency Detection and Danger Signs Triage Engine
 * Based on Integrated Management of Childhood Illness (IMCI) / MoH Kenya Guidelines
 */

export interface IDangerSignRule {
  id: string;
  nameEn: string;
  nameSw: string;
  keywordsEn: string[];
  keywordsSw: string[];
  criticality: 'immediate_emergency' | 'urgent_referral';
  immediateAdviceEn: string;
  immediateAdviceSw: string;
  targetAgeMaxMonths?: number;
}

export const DANGER_SIGN_RULES: IDangerSignRule[] = [
  {
    id: 'convulsions',
    nameEn: 'Convulsions / Fits',
    nameSw: 'Kifafa / Degedege',
    keywordsEn: ['convulsion', 'fit', 'seizure', 'shaking', 'jerking', 'rolling eyes', 'twitching violently'],
    keywordsSw: ['degedege', 'kifafa', 'kushikwa', 'kutetemeka', 'macho kugeuka', 'kutupa mikono'],
    criticality: 'immediate_emergency',
    immediateAdviceEn: '1. Lay baby on their side on a soft, flat surface (recovery position). 2. Do NOT put anything into their mouth (no spoons, herbs, or fingers). 3. Loosen tight clothing. 4. Rush to the nearest hospital immediately!',
    immediateAdviceSw: '1. Mlaze mtoto kwa ubavu mahali salama na laini. 2. USIWEKE chochote mdomoni (usimpe kijiko, dawa za kienyeji au vidole). 3. Legeza nguo. 4. Mpeleke hospitali mara moja!'
  },
  {
    id: 'chest_indrawing_breathing',
    nameEn: 'Difficulty Breathing / Chest Indrawing',
    nameSw: 'Kushindwa Kupumua / Kifua Kuzama Ndani',
    keywordsEn: ['chest indrawing', 'difficulty breathing', 'fast breathing', 'grunting', 'stridor', 'gasping', 'short of breath'],
    keywordsSw: ['kifua kinazama', 'kupumua kwa shida', 'kuhema haraka', 'kuguna', 'kushindwa kuhema'],
    criticality: 'immediate_emergency',
    immediateAdviceEn: '1. Keep baby calm and held in an upright, supported position. 2. Clear any visible nasal mucus gently. 3. Do not feed or give liquids right now as it can cause choking. 4. Transport to health facility with oxygen immediately.',
    immediateAdviceSw: '1. Mbebe mtoto akiwa wima kwa utulivu. 2. Safisha kamasi puani kwa kitambaa safi. 3. Usimlishe chakula au maji kwa sasa. 4. Nenda hospitalini mara moja anahitaji hewa ya oksijeni.'
  },
  {
    id: 'high_fever_newborn',
    nameEn: 'High Fever in Young Infant / Cold to Touch',
    nameSw: 'Homa Kali kwa Mtoto Mchanga / Mwili Kuwa Baridi',
    keywordsEn: ['high fever', 'burning hot', '38.5', '39', '40 degrees', 'hypothermia', 'cold skin', 'freezing'],
    keywordsSw: ['homa kali', 'mwili unawaka moto', 'moto sana', 'mwili baridi kama barafu', 'kutopata joto'],
    criticality: 'immediate_emergency',
    targetAgeMaxMonths: 2,
    immediateAdviceEn: '1. In infants under 2 months, fever or cold body is a medical emergency requiring urgent antibiotics for neonatal sepsis. 2. Keep warm against mother\'s chest (Kangaroo Mother Care). 3. Seek emergency facility evaluation instantly.',
    immediateAdviceSw: '1. Kwa mtoto chini ya miezi 2, homa kali au ubaridi ni hatari ya maambukizi makali ya damu. 2. Mweke kifuani mwako kumpa joto (Kangaroo Care). 3. Nenda kituo cha afya mara moja.'
  },
  {
    id: 'unable_to_feed',
    nameEn: 'Not Feeding / Vomiting Everything',
    nameSw: 'Kushindwa Kunyonya / Kutapika Kila Kitu',
    keywordsEn: ['unable to feed', 'cannot drink', 'stops breastfeeding', 'vomiting everything', 'cannot keep down anything', 'refusing breast'],
    keywordsSw: ['hanyonyi kabisa', 'hataki ziwa', 'anatapika kila kitu', 'hawezi kunywa', 'kugoma kula'],
    criticality: 'immediate_emergency',
    immediateAdviceEn: '1. Baby is at severe risk of rapid hypoglycemia and shock. 2. Continue offering breast gently while en route. 3. Do not give over-the-counter anti-vomiting pills. 4. Seek immediate IV drip stabilization at clinic.',
    immediateAdviceSw: '1. Mtoto yuko katika hatari ya sukari kushuka na kupoteza nguvu. 2. Endelea kumpa ziwa kwa upole ukiwa njiani. 3. Usimpe dawa za dukani bila vipimo. 4. Mpeleke hospitali apewe maji ya dripu.'
  },
  {
    id: 'lethargy_unresponsive',
    nameEn: 'Lethargy / Unresponsiveness',
    nameSw: 'Kulegea Kupita Kiasi / Kutozinduka',
    keywordsEn: ['unresponsive', 'cannot wake up', 'floppy', 'lethargic', 'limp', 'unconscious', 'hard to rouse'],
    keywordsSw: ['amelegea', 'hazinduki', 'hawezi kuamka', 'kupoteza fahamu', 'kama mzoga', 'hafungui macho'],
    criticality: 'immediate_emergency',
    immediateAdviceEn: '1. Gently rub baby\'s soles and back to stimulate. 2. Ensure airway is open and baby is breathing. 3. Call ambulance or emergency transport immediately.',
    immediateAdviceSw: '1. Msugue taratibu nyayo za miguu na mgongo kumuamsha. 2. Hakikisha pua na mdomo havijazibwa. 3. Tafuta usafiri wa haraka kuelekea hospitali kuu.'
  },
  {
    id: 'sunken_fontanelle_dehydration',
    nameEn: 'Severe Dehydration / Sunken Fontanelle',
    nameSw: 'Upungufu Mkubwa wa Maji / Utosi Kuzama',
    keywordsEn: ['sunken fontanelle', 'sunken eyes', 'severe dehydration', 'skin pinch goes back very slowly', 'no tears', 'dry mouth'],
    keywordsSw: ['utosi umezama', 'macho yamezama ndani', 'ngozi hairejei', 'kutoa choo cha maji mengi', 'hana machozi', 'upungufu wa maji'],
    criticality: 'immediate_emergency',
    immediateAdviceEn: '1. If child can swallow, give ORS (Oral Rehydration Salts) with clean water in small sips. 2. Continue breastfeeding. 3. Go straight to clinic for rehydration assessment.',
    immediateAdviceSw: '1. Iwapo mtoto anaweza kumeza, mpe maji ya ORS kwa vijiko vidogo. 2. Endelea kumnyonyesha. 3. Nenda kliniki haraka apewe huduma ya maji mwilini.'
  }
];

export const KENYA_REFERRAL_FACILITIES = [
  {
    name: 'Kenyatta National Hospital (KNH)',
    county: 'Nairobi',
    hotline: '+254 20 2726300',
    emergencyContact: '0709 854 000',
    level: 'Level 6 National Referral Hospital',
    location: 'Hospital Rd, Upper Hill, Nairobi'
  },
  {
    name: 'Pumwani Maternity Hospital',
    county: 'Nairobi',
    hotline: '+254 20 6763291',
    emergencyContact: '020 6763292',
    level: 'Specialized National Maternity Referral',
    location: 'Digo Rd, Majengo, Nairobi'
  },
  {
    name: 'Coast General Teaching & Referral Hospital (CGTRH)',
    county: 'Mombasa',
    hotline: '+254 41 2314204',
    emergencyContact: '0722 207 865',
    level: 'Level 6 Regional Referral',
    location: 'Kisauni Rd, Mombasa'
  },
  {
    name: 'Moi Teaching and Referral Hospital (MTRH)',
    county: 'Uasin Gishu / Eldoret',
    hotline: '+254 53 2033471',
    emergencyContact: '0780 348 830',
    level: 'Level 6 National Referral',
    location: 'Nandi Rd, Eldoret'
  },
  {
    name: 'Jaramogi Oginga Odinga Teaching & Referral Hospital (JOOTRH)',
    county: 'Kisumu',
    hotline: '+254 57 2020801',
    emergencyContact: '0710 400 900',
    level: 'Level 5/6 Referral Hospital',
    location: 'Hospital Rd, Kisumu'
  },
  {
    name: 'Nakuru Level 5 Teaching and Referral Hospital',
    county: 'Nakuru',
    hotline: '+254 51 2215580',
    emergencyContact: '0720 000 000',
    level: 'Level 5 County Referral',
    location: 'Hospital Rd, Nakuru'
  }
];

/**
 * Scan input text (chat message or symptom report) for danger signs
 */
export function scanForDangerSigns(
  text: string,
  childAgeMonths?: number
): {
  detected: boolean;
  matchedRules: IDangerSignRule[];
  immediateAdviceEn: string;
  immediateAdviceSw: string;
} {
  const lower = text.toLowerCase();
  const matched: IDangerSignRule[] = [];

  for (const rule of DANGER_SIGN_RULES) {
    if (rule.targetAgeMaxMonths && childAgeMonths !== undefined && childAgeMonths > rule.targetAgeMaxMonths) {
      // Rule specific to younger infants (e.g., neonatal fever)
      continue;
    }

    const enMatch = rule.keywordsEn.some(kw => lower.includes(kw));
    const swMatch = rule.keywordsSw.some(kw => lower.includes(kw));

    if (enMatch || swMatch) {
      matched.push(rule);
    }
  }

  if (matched.length > 0) {
    return {
      detected: true,
      matchedRules: matched,
      immediateAdviceEn: matched.map(m => `⚠️ [${m.nameEn}]: ${m.immediateAdviceEn}`).join('\n\n'),
      immediateAdviceSw: matched.map(m => `⚠️ [${m.nameSw}]: ${m.immediateAdviceSw}`).join('\n\n')
    };
  }

  return {
    detected: false,
    matchedRules: [],
    immediateAdviceEn: '',
    immediateAdviceSw: ''
  };
}
