/**
 * AI Assistant Service — Context-Aware Maternal & Infant Guidance
 * Grounded in Kenya Ministry of Health & WHO Guidelines
 * Multilingual (Kiswahili & English), with danger sign pre-screening and safety guardrails.
 */

import { GoogleGenAI } from '@google/genai';
import { scanForDangerSigns } from './emergencyDetection';

export const MOH_KNOWLEDGE_BASE = [
  {
    topic: 'Exclusive Breastfeeding (0-6 Months)',
    text: 'MoH Kenya recommends exclusive breastfeeding for the first 6 months. Colostrum is thick and yellow and must be given as it acts as baby’s first vaccine with high antibodies. No extra water, tea, glucose, or animal milk should be given because breastmilk is 88% water and provides all hydration, nutrients, and immune factors. Feed on demand at least 8-12 times in 24 hours.'
  },
  {
    topic: 'Complementary Feeding (6-24 Months)',
    text: 'At 6 months, begin complementary foods while continuing frequent breastfeeding. Start with thick porridge (Uji wa wimbi/mtama) fortified with milk, groundnut paste, or egg yolk. Introduce mashed pumpkin, sweet potato, ripe avocado, soft liver, and pureed greens (spinach, sukuma wiki, managu). Never dilute porridge to watery consistency. Increase to 3-4 meals plus 2 healthy snacks by 12 months.'
  },
  {
    topic: 'Umbilical Cord Care',
    text: 'MoH Kenya guidelines recommend 7.1% Chlorhexidine digluconate gel applied to the umbilical cord stump daily for the first week, or keeping it clean and dry with boiled cooled water. Never apply cow dung, ash, soot, saliva, coin, or unprescribed oils to the cord, as this introduces tetanus and lethal neonatal sepsis.'
  },
  {
    topic: 'KEPI Immunization Reactions',
    text: 'Mild fever, fretfulness, and swelling at the injection site (such as after Pentavalent or PCV) are normal signs the immune system is learning. Give paracetamol syrup at recommended pediatric dosage and apply a cool clean damp cloth. For BCG, a small red bump appears after 2-4 weeks and may form a small ulcer or crust that heals into a scar; never press, squeeze, rub, or put ointment on the BCG scar.'
  },
  {
    topic: 'Postpartum Maternal Wellbeing & Depression',
    text: 'First-time mothers often experience tiredness and emotional changes. If tearfulness, overwhelming anxiety, inability to sleep when baby sleeps, or feelings of detachment persist beyond 2 weeks, it may be postpartum depression. MoH encourages opening up to family, visiting the local maternal child health (MCH) clinic, and receiving counseling support.'
  },
  {
    topic: 'Malaria Prevention in Infants',
    text: 'In Kenya’s endemic zones (Western, Lake Victoria, Coastal counties), always ensure mother and child sleep under a Long-Lasting Insecticidal Net (LLIN). Ensure the child receives the Malaria Vaccine (RTS,S or R21) at 6, 7, 9, and 24 months where available.'
  }
];

export interface IAssistantContext {
  childName?: string;
  childAgeMonths?: number;
  gender?: 'male' | 'female';
  weightKg?: number;
  upcomingVaccine?: string;
  preferredLanguage?: 'sw' | 'en';
}

interface SmartFallbackTopic {
  keywords: string[];
  swTitle: string;
  enTitle: string;
  swAnswer: string;
  enAnswer: string;
}

const SMART_TOPICS: SmartFallbackTopic[] = [
  {
    keywords: ['crying', 'colic', 'lilia', 'kulia', 'chozi', 'tulia', 'soothe'],
    swTitle: 'Kutuliza Mtoto Anayelia Sana / Colic',
    enTitle: 'Soothing a Crying Baby / Colic Guidance',
    swAnswer: `Mtoto kulia ni njia yake ya kuwasiliana. Iwapo mtoto analia mara kwa mara jioni au baada ya kunyonya:
1. Mbebe kifuani mwako ngozi kwa ngozi (Kangaroo Mother Care) ili asikie mapigo ya moyo wako.
2. Msugue mgongo taratibu na mpige migongo ili atoe hewa (kupiga mbweu).
3. Mweke mkao wa "baiskeli" kwa kukunja miguu yake kwa upole kuelekea tumboni kusaidia gesi kutoka.
4. Epuka kumpa dawa za kienyeji au chai ya mitishamba.
Kumbuka: Iwapo analia bila kusimama kwa saa nyingi akiwa na homa kali au akitapika mfululizo, mpeleke kliniki mara moja.`,
    enAnswer: `Crying is your baby's primary communication. If baby is fussy or experiencing colic:
1. Practice skin-to-skin contact (Kangaroo Care) which naturally stabilizes baby's heart rate and cortisol levels.
2. Burp baby gently upright after every feed to release trapped tummy gas.
3. Gently pedal baby’s legs in a "bicycle" motion to relieve abdominal discomfort.
4. Avoid unprescribed gripe water, herbal concoctions, or traditional remedies.
Always consult a healthcare worker if crying is accompanied by high fever or vomiting.`
  },
  {
    keywords: ['water', 'maji', 'thirst', 'kiu', 'glucose', 'formula', 'kunywa'],
    swTitle: 'Je Mtoto wa Chini ya Miezi 6 Anahitaji Maji?',
    enTitle: 'Does a Baby Under 6 Months Need Water?',
    swAnswer: `Hapana, mtoto aliye chini ya miezi 6 HAHITAJI maji hata kidogo!
- Maziwa ya mama yana 88% ya maji safi ya asili yenye uwiano kamili wa chumvichumvi na virutubisho.
- Hata wakati wa joto kali (kama Mombasa, Garissa, au Kisumu), maziwa ya mama yanakata kiu ya mtoto kikamilifu.
- Kumpa mtoto maji, glukosi au chai kabla ya miezi 6 huleta maambukizi tumboni (diarrhea) na kumfanya ashindwe kunyonya maziwa ya kutosha.`,
    enAnswer: `No, an infant under 6 months old should NOT be given water!
- Breastmilk is 88% pure water perfectly balanced with electrolytes and antibodies.
- Even in hot Kenyan weather, breastmilk satisfies 100% of your baby's hydration needs.
- Giving water or teas fills baby's tiny stomach, reduces nutrient intake, and exposes them to diarrheal pathogens.`
  },
  {
    keywords: ['breastfeed', 'latch', 'nipple', 'ziwa', 'maziwa', 'chuchu', 'nyonyesha', 'supply'],
    swTitle: 'Mbinu za Kunyonyesha na Kuongeza Maziwa',
    enTitle: 'Breastfeeding Latch & Boosting Milk Supply',
    swAnswer: `Kunyonyesha vizuri kunahitaji mshiko sahihi (latch):
1. Hakikisha mdomo wa mtoto umefunguka kwa upana na sehemu kubwa ya eneo jeusi la titi (areola) iko mdomoni, sio chuchu pekee.
2. Kadri unavyonyonyesha mara kwa mara (kila mtoto anapotaka, mara 8-12 kwa siku), ndivyo mwili unavyotengeneza maziwa zaidi.
3. Kunywa maji safi ya kutosha, supu ya mifupa au kunde, na uji wa wimbi/mtama.
4. Mpe mtoto titi moja limalizike kabisa kabla ya kuhamia lingine ili apate maziwa ya mwisho (hindmilk) yenye mafuta na virutubisho vya kumshibisha.`,
    enAnswer: `Optimal breastfeeding technique and milk supply tips:
1. Ensure a deep latch: baby's mouth should be wide open like a yawn, covering most of the lower areola, not just the nipple tip.
2. The more frequently baby suckles on demand (8 to 12+ times in 24 hours), the higher your prolactin signals to produce abundant milk.
3. Stay well-hydrated with safe drinking water, clear bone or bean soups, and nutritious porridge.
4. Allow baby to empty one breast fully before switching, ensuring they receive the calorie-rich hindmilk.`
  },
  {
    keywords: ['teething', 'meno', 'drool', 'mate', 'gum', 'fizi'],
    swTitle: 'Uotaji wa Meno kwa Mtoto (Teething)',
    enTitle: 'Teething Symptoms and Relief',
    swAnswer: `Watoto huanza kuota meno kati ya miezi 4 hadi 9:
1. Dalili: Kutokwa na mate mengi, kupenda kuuma vitu vigumu, kuvimba fizi, na kuwa msumbufu kidogo.
2. Msaada: Mpe kitambaa safi kilicholoweshwa na maji baridi au kidole chako kilichooshwa vizuri asugue fizi.
3. Onyo la MoH: Usitumie ushanga wa meno shingoni (teething necklace) kwani unaweza kumnyonga mtoto.
4. Meno hayawezi kusababisha homa kali au kuhara mfululizo; iwapo mtoto ana homa, muone daktari kliniki.`,
    enAnswer: `Teething typically begins between 4 and 9 months:
1. Common signs: Excessive drooling, swollen gums, chewing on hands, and mild irritability.
2. Safe comfort: Gently massage baby's gums with a clean finger or offer a clean, chilled (not frozen) damp washcloth.
3. MoH Kenya Safety Warning: Do NOT use amber teething necklaces or unprescribed local teething powders (choking and poisoning risk).
4. Teething does NOT cause high fever or severe diarrhea; if fever occurs, it indicates an infection requiring clinic evaluation.`
  },
  {
    keywords: ['fever', 'homa', 'joto', 'temperature', 'panadol', 'paracetamol'],
    swTitle: 'Kushughulikia Homa Ndogo Baada ya Chanjo',
    enTitle: 'Managing Mild Post-Vaccination Fever',
    swAnswer: `Homa ndogo baada ya chanjo (kama Pentavalent au PCV) ni ishara kwamba kinga ya mwili inajenga ulinzi:
1. Mvike nguo nyepesi za pamba; usimfunike kwa mablanketi mazito.
2. Mnyonyeshe mara kwa mara kuzuia upungufu wa maji mwilini.
3. Mweke kitambaa safi kilicholoweshwa maji ya kawaida (sio maji ya barafu) kwenye paji la uso au shingoni.
4. Mpe paracetamol ya watoto (syrup) kwa kipimo sahihi kilichotolewa na muuguzi kliniki.
TAHADHARI: Iwapo mtoto yuko chini ya miezi 2 au homa inafika 38.5°C na kuendelea, mpeleke hospitali mara moja!`,
    enAnswer: `Mild fever following KEPI immunizations (such as Pentavalent or PCV) is a normal immune reaction:
1. Dress baby in light cotton clothing; never over-bundle with heavy blankets.
2. Increase breastfeeding frequency to prevent dehydration.
3. Apply a clean washcloth dampened with lukewarm water to baby's forehead and neck.
4. Administer pediatric paracetamol syrup strictly at the dosage recommended by your nurse.
CRITICAL: If baby is under 2 months old or fever exceeds 38.5°C, seek immediate emergency medical care!`
  },
  {
    keywords: ['cord', 'kitovu', 'umbilical', 'chlorhexidine', 'stump', 'pus'],
    swTitle: 'Utunzaji Salama wa Kitovu cha Mtoto',
    enTitle: 'Safe Umbilical Cord Care',
    swAnswer: `Miongozo rasmi ya Wizara ya Afya ya Kenya (MoH Kenya):
1. Tumia dawa ya Chlorhexidine digluconate 7.1% gel kila siku kwa wiki ya kwanza au weka kitovu safi na kikavu.
2. USIPAKE kabisa kinyesi cha ng’ombe, majivu, unga, poda ya watoto, au mafuta yoyote kwenye kitovu—hii husababisha pepopunda (tetanus) na maambukizi hatari ya damu.
3. Kitovu huanguka chenyewe kati ya siku 5 hadi 14.
4. Muone daktari haraka iwapo kitovu kinanuka, kinatoa usaha, au ngozi pembeni ni nyekundu sana na inawaka moto.`,
    enAnswer: `Official Ministry of Health Kenya Umbilical Cord Protocol:
1. Apply 7.1% Chlorhexidine digluconate gel once daily for the first week, or keep the cord clean and dry.
2. Absolutely NEVER apply cow dung, ash, soot, saliva, powder, or unprescribed oils to the cord stump (major cause of neonatal tetanus and sepsis).
3. The stump naturally dries and separates within 5 to 14 days.
4. Urgent clinic check required if there is foul-smelling discharge, pus, or red spreading inflammation around the navel.`
  },
  {
    keywords: ['food', 'uji', 'weaning', 'chakula', 'porridge', 'solid', 'lishe', 'wimbi', 'mtama', 'pumpkin', 'avocado'],
    swTitle: 'Kuanzisha Vyakula vya Nyongeza (Miezi 6 na Zaidi)',
    enTitle: 'Nutritious Complementary Feeding at 6 Months',
    swAnswer: `Mtoto anapofikisha miezi 6 kamili:
1. Anza na uji mzito uliorutubishwa wa unga wa mtama au wimbi (usitengeneze uji mwepesi kama chai).
2. Weka kijiko cha unga wa njugu zilizosagwa, maziwa, au kiini cha yai lililochemshwa kuongeza protini.
3. Mpe vyakula vilivyopondwa vizuri: malenge, parachichi mbivu, viazi vitamu, na maini laini.
4. Mlishe mara 2 hadi 3 kwa siku pamoja na kuendelea kumnyonyesha maziwa ya mama hadi miaka 2 au zaidi.`,
    enAnswer: `At exactly 6 months of age, introduce nutritious complementary foods:
1. Begin with thick, energy-dense millet or sorghum porridge (Uji wa wimbi/mtama). Never make it watery.
2. Enrich porridge with ground peanut paste, milk, or well-boiled egg yolk for protein and zinc.
3. Offer pureed traditional nutrient foods: mashed pumpkin, sweet potato, ripe avocado, soft liver, and cooked greens.
4. Feed 2 to 3 times daily while continuing frequent breastfeeding up to 2 years or beyond.`
  },
  {
    keywords: ['sleep', 'lala', 'usingizi', 'sids', 'night', 'usiku'],
    swTitle: 'Usingizi Salama wa Mtoto Mchanga',
    enTitle: 'Infant Safe Sleep Guidelines',
    swAnswer: `Ili kumkinga mtoto dhidi ya hatari ya kukosa hewa au SIDS:
1. Daima mlaze mtoto chali (mgongo ukiwa kitandani), sio kwa tumbo.
2. Kitanda kiwe na godoro thabiti lisilozama; usiweke mito laini, vibonzo vya kuchezea, au mablanketi mazito karibu na uso wake.
3. Mtoto alale kwenye chumba kimoja na mama lakini kwenye kitanda chake salama au eneo salama lisilomweka hatarini kupondwa.
4. Hakikisha chumba kina hewa safi na chandarua (ITN net) imetandikwa kuzuia mbu wa malaria.`,
    enAnswer: `To protect your infant against Sudden Infant Death Syndrome (SIDS) and suffocation:
1. Always place baby to sleep on their BACK on a firm, flat mattress.
2. Keep the sleep area bare: no soft pillows, heavy blankets, or stuffed toys around baby's face.
3. Room-share (baby sleeps in the same room as mother, but in their own designated safe sleeping space).
4. Always sleep under a treated mosquito net (ITN) to protect against malaria.`
  },
  {
    keywords: ['poop', 'stool', 'choo', 'constipation', 'diarrhea', 'green', 'yellow'],
    swTitle: 'Kuelewa Choo cha Mtoto Mchanga',
    enTitle: 'Understanding Baby Stool and Bowel Habits',
    swAnswer: `Choo cha mtoto anayenyonya maziwa ya mama:
- Kawaida: Rangi ya manjano kama haradali, chenye chembechembe ndogo (seedy), na harufu ya kawaida.
- Choo cha kijani kidogo kinaweza kutokea iwapo mtoto ananyonya maziwa ya kwanza ya mwanzoni (foremilk) zaidi; mwachie anyonye titi moja hadi limalizike ili apate mafuta ya hindmilk.
- Watoto wanaonyonya wanaweza kutoa choo mara 5 kwa siku au mara 1 kwa siku 3-5 na bado ikawa kawaida ikiwa tumbo ni laini na hana maumivu.
- Hatari: Choo chenye damu, ute mwingi, au kinachotoka kama maji mfululizo (diarrhea) kinahitaji kliniki mara moja.`,
    enAnswer: `Normal bowel habits for breastfed infants:
- Typical stool: Mustard-yellow color, seedy texture, soft consistency.
- Occasional greenish stool can happen when baby receives more lactose-rich foremilk; ensure baby finishes one breast completely before switching to get fatty hindmilk.
- Breastfed babies can pass stool several times a day, or once every 3-5 days; both are normal if stool is soft and abdomen is non-tender.
- Danger signs: Watery stool passed frequently (diarrhea), blood or excessive mucus, or hard pellet-like stools require clinic assessment.`
  },
  {
    keywords: ['sad', 'depress', 'overwhelm', 'cry', 'huzuni', 'msongo', 'uchovu', 'baby blues', 'mama'],
    swTitle: 'Ustawi wa Kisaikolojia wa Mama Baada ya Kujifungua',
    enTitle: 'Maternal Emotional Wellbeing & Postpartum Blues',
    swAnswer: `Kulea mtoto mchanga kunaleta mabadiliko makubwa ya homoni na uchovu:
1. 'Baby blues' (huzuni na hisia za kulia kwa urahisi) ni kawaida katika siku 14 za kwanza kutokana na homoni kushuka na kukosa usingizi.
2. Ikiwa hisia za wasiwasi mkubwa, kukosa usingizi hata mtoto anapolala, au kukosa hamu ya kuishi zinaendelea zaidi ya wiki 2, huenda ni Sonona ya Baada ya Kujifungua (Postpartum Depression).
3. Hili sio kosa lako mama! Tafadhali funguka kwa mume wako, ndugu, au mhudumu wa afya kliniki ya MCH upate ushauri na msaada.`,
    enAnswer: `Postpartum recovery involves massive hormonal shifts and profound sleep deprivation:
1. Baby blues (mild tearfulness, fatigue, mood swings) are very common during the first 10-14 days.
2. If overwhelming sadness, inability to sleep when baby sleeps, persistent detachment, or severe anxiety last beyond 2 weeks, it may be Postpartum Depression.
3. This is a treatable medical condition, not a personal weakness. Please talk openly with your partner, family, or clinic nurse at your next MCH visit for compassionate support.`
  }
];

function getBestMatchingTopic(query: string): SmartFallbackTopic | null {
  const queryLower = query.toLowerCase();
  let bestMatch: SmartFallbackTopic | null = null;
  let maxScore = 0;

  for (const topic of SMART_TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (queryLower.includes(kw)) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = topic;
    }
  }

  return maxScore > 0 ? bestMatch : null;
}

/**
 * Retrieve relevant knowledge from MoH Kenya / WHO guidelines
 */
function retrieveRelevantKnowledge(query: string): string[] {
  const queryLower = query.toLowerCase();
  const matched = MOH_KNOWLEDGE_BASE.filter(item => {
    const terms = item.topic.toLowerCase().split(' ');
    return terms.some(t => queryLower.includes(t)) ||
      (queryLower.includes('breast') && item.topic.includes('Breast')) ||
      (queryLower.includes('food') && item.topic.includes('Complementary')) ||
      (queryLower.includes('uji') && item.topic.includes('Complementary')) ||
      (queryLower.includes('cord') && item.topic.includes('Cord')) ||
      (queryLower.includes('fever') && item.topic.includes('Immunization')) ||
      (queryLower.includes('vaccine') && item.topic.includes('Immunization'));
  });

  return (matched.length > 0 ? matched : MOH_KNOWLEDGE_BASE.slice(0, 3)).map(m => `[${m.topic}]: ${m.text}`);
}

/**
 * Generate medical assistance response using Gemini API + RAG + safety guardrails
 */
export async function generateMamaCareAdvice(
  userQuery: string,
  context: IAssistantContext
): Promise<{
  reply: string;
  dangerSignDetected: boolean;
  emergencyData?: ReturnType<typeof scanForDangerSigns>;
  language: 'sw' | 'en';
}> {
  const isSwahili = context.preferredLanguage === 'sw' || 
    /homa|mtoto|chanjo|kunyonya|ziwa|chakula|kutapika|degedege|mgonjwa|joto|lala|maji|meno|habari|nifanye/i.test(userQuery);
  const lang: 'sw' | 'en' = isSwahili ? 'sw' : 'en';

  // 1. Strict deterministic danger sign pre-screening
  const dangerCheck = scanForDangerSigns(userQuery, context.childAgeMonths);
  if (dangerCheck.detected) {
    const alertText = lang === 'sw'
      ? `🚨 TAHADHARI YA HARAKA YA MATIBABU:\nDalili uliyotaja inaonyesha hatari kwa mtoto (${context.childName || 'mchanga'}).\n\n${dangerCheck.immediateAdviceSw}\n\nTafadhali mpeleke mtoto katika kituo cha afya au hospitali iliyo karibu nawe mara moja!`
      : `🚨 IMMEDIATE MEDICAL ALERT:\nThe symptoms described indicate a critical danger sign for ${context.childName || 'your baby'}.\n\n${dangerCheck.immediateAdviceEn}\n\nPlease take baby to the nearest health facility or hospital immediately!`;

    return {
      reply: alertText,
      dangerSignDetected: true,
      emergencyData: dangerCheck,
      language: lang
    };
  }

  // 2. Synthesize via Gemini if available
  try {
    if (process.env.GEMINI_API_KEY) {
      const retrievedDocs = retrieveRelevantKnowledge(userQuery);
      const ai = new GoogleGenAI();
      const systemInstruction = `You are MamaCare+, an empathetic, evidence-based maternal and child health assistant for first-time mothers in Kenya.
Rules:
1. ALWAYS ground your guidance in Ministry of Health (MoH) Kenya and WHO guidelines.
2. Directly answer the user's question with warm, practical, specific advice.
3. NEVER diagnose medical conditions or prescribe prescription drugs. Always include a calm reminder: "Kumbuka kushauriana na mhudumu wa afya kliniki" (or in English: "Always consult a healthcare worker at your clinic").
4. Language: Respond in ${lang === 'sw' ? 'fluent, warm Kenyan Kiswahili' : 'clear, encouraging English'}.
5. Context: Child is ${context.childName || 'Baby'}, age: ${context.childAgeMonths ?? 'infant'} months, weight: ${context.weightKg ? context.weightKg + 'kg' : 'healthy'}. Upcoming vaccine: ${context.upcomingVaccine || 'on schedule'}.
6. Use culturally relevant examples for Kenya (e.g., Uji wa wimbi, sukuma wiki, pumpkin, KMC kangaroo mother care, MoH 216 clinic booklet).
7. Format with clean bullet points and numbered steps for high readability on mobile.`;

      const prompt = `Vetted Health References:\n${retrievedDocs.join('\n\n')}\n\nMother's Question: "${userQuery}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3
        }
      });

      if (response.text && response.text.trim().length > 10) {
        return {
          reply: response.text,
          dangerSignDetected: false,
          language: lang
        };
      }
    }
  } catch (err) {
    console.warn('Gemini API call bypassed or errored, using smart vetted knowledge engine:', err);
  }

  // 3. Smart Clinical Engine Fallback (guarantees an exact, personalized answer to the topic)
  const matchedTopic = getBestMatchingTopic(userQuery);
  if (matchedTopic) {
    const formattedReply = lang === 'sw'
      ? `Habari mama. Kuhusu swali lako kuhusu ${matchedTopic.swTitle} kwa mtoto ${context.childName || 'wako'}:\n\n${matchedTopic.swAnswer}\n\nKumbuka: MamaCare+ inatoa elimu ya afya kulingana na miongozo ya MoH Kenya. Daima shauriana na muuguzi au daktari kliniki.`
      : `Hello mama. Regarding ${matchedTopic.enTitle} for ${context.childName || 'your baby'}:\n\n${matchedTopic.enAnswer}\n\nNote: MamaCare+ provides health education aligned with Kenya Ministry of Health guidelines. Always consult your clinic healthcare worker for individualized care.`;

    return {
      reply: formattedReply,
      dangerSignDetected: false,
      language: lang
    };
  }

  // Comprehensive General Guidance
  const defaultReply = lang === 'sw'
    ? `Habari mama. Kuhusu malezi ya ${context.childName || 'mtoto wako'} (umri wa miezi ${context.childAgeMonths || 'mchanga'}):\n\n1. Hakikisha anapata maziwa ya mama pekee au lishe bora inayolingana na umri wake kulingana na miongozo ya MoH 216.\n2. Fuatilia chanjo zote za KEPI kliniki kwa wakati.\n3. Hakikisha mtoto anapata usingizi mzuri kwenye chandarua safi iliyotibiwa (ITN).\n4. Mwoshe na umtunze kwa mikono safi kuzuia maambukizi ya bakteria.\n\nKumbuka kushauriana na muuguzi au daktari katika kituo chako cha afya unapoona mabadiliko yoyote yasiyo ya kawaida.`
    : `Hello mama. Regarding caring for ${context.childName || 'your baby'} (age ${context.childAgeMonths || 'infant'} months):\n\n1. Ensure baby receives optimal age-appropriate feeding (exclusive breastfeeding up to 6 months, nutrient-dense complementary foods thereafter) as recorded in your MoH 216 booklet.\n2. Keep up with scheduled KEPI vaccinations and routine growth monitoring.\n3. Ensure baby sleeps on their back under a treated mosquito net.\n4. Maintain good hygiene and handwashing before handling baby.\n\nAlways feel free to consult your clinic healthcare worker whenever you have questions or observe unusual symptoms.`;

  return {
    reply: defaultReply,
    dangerSignDetected: false,
    language: lang
  };
}
