/**
 * WHO Child Growth Standards (0-24 months) & Developmental Milestones
 * Formulated with WHO Multicentre Growth Reference Study & MoH Kenya Nutritional Guidelines
 */

import { IMilestoneDefinition } from '../models/schemas';

// Median (M) and Standard Deviation (SD) for boys and girls (approximated WHO tables)
export interface IWhoStandardCohort {
  ageMonths: number;
  weightMedianKgBoy: number;
  weightSdBoy: number;
  weightMedianKgGirl: number;
  weightSdGirl: number;
  lengthMedianCmBoy: number;
  lengthSdBoy: number;
  lengthMedianCmGirl: number;
  lengthSdGirl: number;
}

export const WHO_GROWTH_REFERENCE: IWhoStandardCohort[] = [
  { ageMonths: 0, weightMedianKgBoy: 3.3, weightSdBoy: 0.5, weightMedianKgGirl: 3.2, weightSdGirl: 0.45, lengthMedianCmBoy: 49.9, lengthSdBoy: 1.9, lengthMedianCmGirl: 49.1, lengthSdGirl: 1.9 },
  { ageMonths: 1, weightMedianKgBoy: 4.5, weightSdBoy: 0.6, weightMedianKgGirl: 4.2, weightSdGirl: 0.55, lengthMedianCmBoy: 54.7, lengthSdBoy: 2.0, lengthMedianCmGirl: 53.7, lengthSdGirl: 2.0 },
  { ageMonths: 2, weightMedianKgBoy: 5.6, weightSdBoy: 0.7, weightMedianKgGirl: 5.1, weightSdGirl: 0.65, lengthMedianCmBoy: 58.4, lengthSdBoy: 2.1, lengthMedianCmGirl: 57.1, lengthSdGirl: 2.1 },
  { ageMonths: 3, weightMedianKgBoy: 6.4, weightSdBoy: 0.8, weightMedianKgGirl: 5.8, weightSdGirl: 0.7, lengthMedianCmBoy: 61.4, lengthSdBoy: 2.2, lengthMedianCmGirl: 59.8, lengthSdGirl: 2.2 },
  { ageMonths: 4, weightMedianKgBoy: 7.0, weightSdBoy: 0.8, weightMedianKgGirl: 6.4, weightSdGirl: 0.75, lengthMedianCmBoy: 63.9, lengthSdBoy: 2.2, lengthMedianCmGirl: 62.1, lengthSdGirl: 2.2 },
  { ageMonths: 5, weightMedianKgBoy: 7.5, weightSdBoy: 0.85, weightMedianKgGirl: 6.9, weightSdGirl: 0.8, lengthMedianCmBoy: 65.9, lengthSdBoy: 2.3, lengthMedianCmGirl: 64.0, lengthSdGirl: 2.3 },
  { ageMonths: 6, weightMedianKgBoy: 7.9, weightSdBoy: 0.9, weightMedianKgGirl: 7.3, weightSdGirl: 0.85, lengthMedianCmBoy: 67.6, lengthSdBoy: 2.3, lengthMedianCmGirl: 65.7, lengthSdGirl: 2.3 },
  { ageMonths: 7, weightMedianKgBoy: 8.3, weightSdBoy: 0.9, weightMedianKgGirl: 7.6, weightSdGirl: 0.85, lengthMedianCmBoy: 69.2, lengthSdBoy: 2.4, lengthMedianCmGirl: 67.3, lengthSdGirl: 2.4 },
  { ageMonths: 8, weightMedianKgBoy: 8.6, weightSdBoy: 0.95, weightMedianKgGirl: 7.9, weightSdGirl: 0.9, lengthMedianCmBoy: 70.6, lengthSdBoy: 2.4, lengthMedianCmGirl: 68.7, lengthSdGirl: 2.4 },
  { ageMonths: 9, weightMedianKgBoy: 8.9, weightSdBoy: 1.0, weightMedianKgGirl: 8.2, weightSdGirl: 0.9, lengthMedianCmBoy: 72.0, lengthSdBoy: 2.5, lengthMedianCmGirl: 70.1, lengthSdGirl: 2.5 },
  { ageMonths: 10, weightMedianKgBoy: 9.2, weightSdBoy: 1.0, weightMedianKgGirl: 8.5, weightSdGirl: 0.95, lengthMedianCmBoy: 73.3, lengthSdBoy: 2.5, lengthMedianCmGirl: 71.5, lengthSdGirl: 2.5 },
  { ageMonths: 11, weightMedianKgBoy: 9.4, weightSdBoy: 1.0, weightMedianKgGirl: 8.7, weightSdGirl: 0.95, lengthMedianCmBoy: 74.5, lengthSdBoy: 2.5, lengthMedianCmGirl: 72.8, lengthSdGirl: 2.5 },
  { ageMonths: 12, weightMedianKgBoy: 9.6, weightSdBoy: 1.05, weightMedianKgGirl: 8.9, weightSdGirl: 1.0, lengthMedianCmBoy: 75.7, lengthSdBoy: 2.6, lengthMedianCmGirl: 74.0, lengthSdGirl: 2.6 },
  { ageMonths: 15, weightMedianKgBoy: 10.3, weightSdBoy: 1.1, weightMedianKgGirl: 9.6, weightSdGirl: 1.05, lengthMedianCmBoy: 79.1, lengthSdBoy: 2.7, lengthMedianCmGirl: 77.5, lengthSdGirl: 2.7 },
  { ageMonths: 18, weightMedianKgBoy: 10.9, weightSdBoy: 1.15, weightMedianKgGirl: 10.2, weightSdGirl: 1.1, lengthMedianCmBoy: 82.3, lengthSdBoy: 2.8, lengthMedianCmGirl: 80.7, lengthSdGirl: 2.8 },
  { ageMonths: 21, weightMedianKgBoy: 11.5, weightSdBoy: 1.2, weightMedianKgGirl: 10.9, weightSdGirl: 1.15, lengthMedianCmBoy: 85.1, lengthSdBoy: 2.9, lengthMedianCmGirl: 83.7, lengthSdGirl: 2.9 },
  { ageMonths: 24, weightMedianKgBoy: 12.2, weightSdBoy: 1.25, weightMedianKgGirl: 11.5, weightSdGirl: 1.2, lengthMedianCmBoy: 87.8, lengthSdBoy: 3.0, lengthMedianCmGirl: 86.4, lengthSdGirl: 3.0 }
];

/**
 * Calculate standard WHO Z-Scores for given infant anthropometrics
 */
export function calculateZScores(
  gender: 'male' | 'female',
  ageMonths: number,
  weightKg: number,
  heightCm: number
) {
  // Find nearest cohort in WHO reference table
  const roundedAge = Math.min(24, Math.max(0, Math.round(ageMonths)));
  const ref = WHO_GROWTH_REFERENCE.find(r => r.ageMonths === roundedAge) || WHO_GROWTH_REFERENCE[0];

  const medianWeight = gender === 'male' ? ref.weightMedianKgBoy : ref.weightMedianKgGirl;
  const sdWeight = gender === 'male' ? ref.weightSdBoy : ref.weightSdGirl;
  const medianLength = gender === 'male' ? ref.lengthMedianCmBoy : ref.lengthMedianCmGirl;
  const sdLength = gender === 'male' ? ref.lengthSdBoy : ref.lengthSdGirl;

  const waz = Number(((weightKg - medianWeight) / sdWeight).toFixed(2));
  const haz = Number(((heightCm - medianLength) / sdLength).toFixed(2));

  // BMI = weight (kg) / [height (m)]^2
  const heightMeters = heightCm / 100;
  const bmi = heightMeters > 0 ? weightKg / (heightMeters * heightMeters) : 0;
  const medianBmi = 16.0;
  const sdBmi = 1.3;
  const baz = Number(((bmi - medianBmi) / sdBmi).toFixed(2));

  let nutritionalStatus: 'normal' | 'moderate_malnutrition' | 'severe_acute_malnutrition' | 'stunted' | 'overweight' = 'normal';

  if (waz < -3 || haz < -3) {
    nutritionalStatus = 'severe_acute_malnutrition';
  } else if (waz < -2) {
    nutritionalStatus = 'moderate_malnutrition';
  } else if (haz < -2) {
    nutritionalStatus = 'stunted';
  } else if (waz > 2 || baz > 2) {
    nutritionalStatus = 'overweight';
  }

  return {
    zScores: {
      weightForAge: waz,
      heightForAge: haz,
      weightForHeight: waz,
      bmiForAge: baz
    },
    nutritionalStatus,
    bmi: Number(bmi.toFixed(1))
  };
}

/**
 * Developmental Milestones (Kenyan MoH and WHO guidelines)
 */
export const MILESTONES_CATALOG: IMilestoneDefinition[] = [
  {
    _id: 'm-smile-2m',
    category: 'cognitive_social',
    titleEn: 'Social Smile',
    titleSw: 'Kutabasamu kwa Watu',
    descriptionEn: 'Smiles spontaneously in response to mother’s voice and familiar faces.',
    descriptionSw: 'Hutabasamu kuitikia sauti ya mama au sura anazozifahamu.',
    expectedAgeMonthsMin: 1.5,
    expectedAgeMonthsMax: 3,
    guidanceIfDelayedEn: 'Engage in frequent face-to-face vocal interactions, make eye contact, and consult clinic if no social smile by 3 months.',
    guidanceIfDelayedSw: 'Zungumza na mtoto ukiwa karibu naye uso kwa uso. Iwapo haonyeshi tabasamu kufikia miezi 3, mjulishe mhudumu wa afya.'
  },
  {
    _id: 'm-head-control-4m',
    category: 'gross_motor',
    titleEn: 'Steady Head Control',
    titleSw: 'Kushikilia Kichwa Vizuri',
    descriptionEn: 'Holds head steady without support when held upright.',
    descriptionSw: 'Anashikilia kichwa bila kuyumbayumba anapobebwa wima.',
    expectedAgeMonthsMin: 3,
    expectedAgeMonthsMax: 5,
    guidanceIfDelayedEn: 'Practice daily supervised tummy time for 5-10 minutes while awake.',
    guidanceIfDelayedSw: 'Mweke mtoto alale kwa tumbo (tummy time) kwa dakika chache akiwa macho na unamwangalia.'
  },
  {
    _id: 'm-grasp-5m',
    category: 'fine_motor',
    titleEn: 'Reaches and Grasps Toys',
    titleSw: 'Kufikia na Kushika Vitu',
    descriptionEn: 'Reaches for brightly colored rattles or objects and brings them to mouth.',
    descriptionSw: 'Hufikia na kushika midoli au vitu na kuviweka mdomoni.',
    expectedAgeMonthsMin: 4,
    expectedAgeMonthsMax: 6,
    guidanceIfDelayedEn: 'Provide clean, safe, non-toxic objects within reach to stimulate grasping.',
    guidanceIfDelayedSw: 'Mwekee vitu salama na safi karibu ili ajifunze kuvishika.'
  },
  {
    _id: 'm-sit-6m',
    category: 'gross_motor',
    titleEn: 'Sits with or without Support',
    titleSw: 'Kuketi (kwa Msaada au Peke Yake)',
    descriptionEn: 'Sits steadily with slight hand support or independently for brief periods.',
    descriptionSw: 'Huketi kwa uthabiti akijishikilia au bila usaidizi kwa muda mfupi.',
    expectedAgeMonthsMin: 6,
    expectedAgeMonthsMax: 8,
    guidanceIfDelayedEn: 'Propping with soft pillows on a clean mat supports core abdominal strength.',
    guidanceIfDelayedSw: 'Mwekee mito laini mgongoni kwenye mkeka safi ili kuimarisha misuli ya mgongo.'
  },
  {
    _id: 'm-babble-7m',
    category: 'language_speech',
    titleEn: 'Babbling (ba-ba, ma-ma, da-da)',
    titleSw: 'Kubwabwaja (ma-ma, ba-ba)',
    descriptionEn: 'Produces repeated syllables and responds when their name is spoken.',
    descriptionSw: 'Hutoa milio ya kurudia na kugeuka anapoitwa jina lake.',
    expectedAgeMonthsMin: 6,
    expectedAgeMonthsMax: 9,
    guidanceIfDelayedEn: 'Sing lullabies, speak in rhythmic tones, and test if baby turns towards soft sounds behind them.',
    guidanceIfDelayedSw: 'Mwimbie nyimbo za watoto, ongea naye mara kwa mara, na angalia kama anageukia sauti.'
  },
  {
    _id: 'm-crawl-9m',
    category: 'gross_motor',
    titleEn: 'Crawling or Scooting',
    titleSw: 'Kutambaa',
    descriptionEn: 'Moves across the floor on hands and knees or army crawls forward.',
    descriptionSw: 'Hutambaa sakafuni kwa mikono na magoti kufuata vitu anavyovipenda.',
    expectedAgeMonthsMin: 7,
    expectedAgeMonthsMax: 10,
    guidanceIfDelayedEn: 'Place colorful toys just out of reach on a clean blanket to motivate forward movement.',
    guidanceIfDelayedSw: 'Weka kitu kizuri mbele kidogo ya mkeka ili ajitahidi kusogea mbele.'
  },
  {
    _id: 'm-stand-10m',
    category: 'gross_motor',
    titleEn: 'Pulls to Stand',
    titleSw: 'Kujivuta Kusimama',
    descriptionEn: 'Pulls up to a standing position holding onto sturdy furniture or mother’s hands.',
    descriptionSw: 'Hujivuta kusimama akishikilia viti imara au mikono ya mama.',
    expectedAgeMonthsMin: 9,
    expectedAgeMonthsMax: 12,
    guidanceIfDelayedEn: 'Allow bare-foot floor play to build ankle balance and foot sensory awareness.',
    guidanceIfDelayedSw: 'Mruhusu kucheza pekupeku sakafuni ili kuimarisha vifundo vya miguu.'
  },
  {
    _id: 'm-words-12m',
    category: 'language_speech',
    titleEn: 'First Meaningful Words',
    titleSw: 'Kutamka Maneno ya Kwanza yenye Maana',
    descriptionEn: 'Says 1-2 recognizable words specifically (e.g. Mama, Baba, Chai, Maji).',
    descriptionSw: 'Husema neno 1 au 2 kueleza kitu maalum kama Mama, Baba, au Maji.',
    expectedAgeMonthsMin: 11,
    expectedAgeMonthsMax: 15,
    guidanceIfDelayedEn: 'Label objects in daily routine: "Hapa maji", "Hiki kikombe". Read picture books together.',
    guidanceIfDelayedSw: 'Taja majina ya vitu unapomlisha au kumuosha. Epuka skrini za simu au runinga.'
  },
  {
    _id: 'm-walk-13m',
    category: 'gross_motor',
    titleEn: 'Walking Independently',
    titleSw: 'Kutembea Peke Yake',
    descriptionEn: 'Takes first steady steps without holding on to hands or walls.',
    descriptionSw: 'Hupiga hatua za kwanza bila kushikiliwa.',
    expectedAgeMonthsMin: 11,
    expectedAgeMonthsMax: 16,
    guidanceIfDelayedEn: 'Normal range is up to 18 months. Consult clinician if not bearing weight on legs by 15 months.',
    guidanceIfDelayedSw: 'Watoto wengi huanza kutembea hadi miezi 18. Mpeleke kliniki akichelewa kusimama baada ya miezi 15.'
  }
];

export const NUTRITION_BY_AGE_KENYA = [
  {
    ageStage: '0 - 6 Months',
    titleEn: 'Exclusive Breastfeeding (Maziwa ya Mama Pekee)',
    titleSw: 'Kunyonyesha Maziwa ya Mama Pekee',
    keyPointsEn: [
      'Give only breastmilk for the first 6 months of life—no water, glucose, formula, or animal milk.',
      'Breastfeed on demand at least 8 to 12 times in 24 hours, day and night.',
      'Colostrum (the initial thick yellowish milk) is the baby’s first natural immunization—never discard it.',
      'Breastmilk contains 88% water; even on hot days in Garissa, Mombasa, or Kisumu, baby needs no extra water.'
    ],
    keyPointsSw: [
      'Mpe mtoto maziwa ya mama pekee kwa miezi 6 ya kwanza—bila maji, chai, au maziwa ya ng’ombe.',
      'Nyonyesha kila mtoto anapotaka (mara 8 hadi 12 au zaidi kwa masaa 24).',
      'Maziwa ya kwanza ya manjano (colostrum) yana kinga muhimu ya mwili, usiyamwage kabisa.',
      'Maziwa ya mama yana maji ya kutosha; hata kukiwa na joto kali, mtoto hahitaji maji ya ziada.'
    ]
  },
  {
    ageStage: '6 - 9 Months',
    titleEn: 'Introduction of Complementary Feeding (Kuanzisha Chakula)',
    titleSw: 'Kuanza Vyakula vya Nyongeza',
    keyPointsEn: [
      'Continue breastfeeding on demand before giving meals.',
      'Start with thick porridge (Uji wa wimbi/mtama) enriched with peanut paste or milk (not watery).',
      'Introduce mashed nutrient-dense foods: sweet potato, pumpkin, ripe banana, avocado, and soft liver puree.',
      'Feed 2 to 3 times a day, 2-3 tablespoons per meal, gradually increasing consistency.'
    ],
    keyPointsSw: [
      'Endelea kunyonyesha kabla ya kumpa mtoto chakula kingine.',
      'Anza na uji mzito uliorutubishwa wa mtama au wimbi (sio mwepesi kama chai).',
      'Mpe vyakula vilivyopondwa kama malenge, viazi vitamu, parachichi, na ndizi mbivu.',
      'Mlishe mara 2 hadi 3 kwa siku, vijiko 2-3 kila mlo kisha ongeza kidogo kidogo.'
    ]
  },
  {
    ageStage: '9 - 12 Months',
    titleEn: 'Variety and Finger Foods (Kupanua Lishe)',
    titleSw: 'Vyakula vya Kushika na Mchanganyiko',
    keyPointsEn: [
      'Feed 3 to 4 meals a day plus 1 healthy snack (e.g. fresh pawpaw, banana).',
      'Add animal-source proteins: finely minced boiled meat, eggs, fish (omena powder), and mashed beans.',
      'Add dark leafy greens (sukuma wiki, spinach, managu) finely chopped for iron.',
      'Allow baby to practice self-feeding with small soft pieces of sweet potato or ripe fruit.'
    ],
    keyPointsSw: [
      'Mlishe milo 3 hadi 4 pamoja na vitafunwa vyenye afya kama papai au ndizi.',
      'Weka protini: yai lililochemshwa, samaki (unga wa omena), maini yaliyopondwa au maharagwe.',
      'Ongeza mboga za majani kama sukuma wiki, managu au mchicha zilizopikwa vizuri.',
      'Mruhusu ale mwenyewe vyakula laini ili kujenga ujasiri.'
    ]
  },
  {
    ageStage: '12 - 24 Months',
    titleEn: 'Family Diet and Transition (Chakula cha Familia)',
    titleSw: 'Kula Chakula cha Familia Yote',
    keyPointsEn: [
      'Child can eat regular modified family foods: Ugali, beans, vegetables, fish, chicken.',
      'Offer 3 wholesome family meals plus 2 nutritious snacks per day.',
      'Continue breastfeeding alongside family food until at least 2 years of age or beyond.',
      'Ensure safe drinking water is boiled and stored in a clean covered container.'
    ],
    keyPointsSw: [
      'Mtoto anaweza kula chakula cha familia: Ugali, mboga, samaki, ndengu, mayai na maziwa.',
      'Mpe milo 3 mikuu na vitafunwa 2 vyenye lishe kila siku.',
      'Endelea kunyonyesha hadi mtoto afikishe miaka miwili au zaidi.',
      'Hakikisha maji ya kunywa yamechemshwa na kuwekwa kwenye chombo safi chenye mfuniko.'
    ]
  }
];
