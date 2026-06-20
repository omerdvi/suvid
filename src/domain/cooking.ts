import type { SousVideOption } from './types';

/**
 * Heating physics for sous vide, derived from Douglas Baldwin's "A Practical Guide
 * to Sous Vide Cooking" (douglasbaldwin.com/sous-vide.html).
 *
 * Time to heat the core of a slab to the bath temperature scales with the square of
 * the thickness. Baldwin's slab table (from refrigerator, ~5°C) fits well to
 * t[min] ≈ 0.14 · d[mm]². We treat the curated `timeHours` in the seed as correct
 * for a *typical* thickness per category, and only ADD time when the cut is thicker
 * than that reference — so the trusted default times never change, and thicker cuts
 * get the longer, safe-side time they physically need.
 */
export const SLAB_COEFF_MIN_PER_MM2 = 0.14;

/** Typical thickness (cm) the curated seed times assume, per category. */
export function referenceThicknessCm(category: string): number {
  if (category === 'דגים' || category === 'פירות ים') return 2;
  return 2.5;
}

const roundToQuarter = (hours: number): number => Math.round(hours * 4) / 4;

/** Extra heating time (hours) for a cut thicker than the reference, plus a frozen penalty. */
export function thicknessExtraHours(thicknessCm: number, referenceCm: number, frozen: boolean): number {
  const d = thicknessCm * 10;
  const ref = referenceCm * 10;
  let extraMin = SLAB_COEFF_MIN_PER_MM2 * Math.max(0, d * d - ref * ref);
  if (frozen) {
    // Cooking from frozen adds roughly half of the full heating time again.
    extraMin += SLAB_COEFF_MIN_PER_MM2 * d * d * 0.5;
  }
  return extraMin / 60;
}

/**
 * Recommended cook time (hours) for an option at a given thickness.
 * - Tenderness-bound long cooks (base ≥ 6h, e.g. short ribs) are limited by collagen
 *   breakdown, not heating, so thickness barely matters — we keep the base time and
 *   add only a small capped penalty when frozen.
 * - Heating-bound options (steaks, fish, chicken breast) get the base time plus any
 *   extra the thickness/frozen state requires.
 */
export function recommendedCookHours(
  option: Pick<SousVideOption, 'timeHours'>,
  thicknessCm: number,
  referenceCm: number,
  frozen: boolean
): number {
  if (option.timeHours >= 6) {
    const frozenAdd = frozen ? Math.min(2, (SLAB_COEFF_MIN_PER_MM2 * (thicknessCm * 10) ** 2 * 0.5) / 60) : 0;
    return roundToQuarter(option.timeHours + frozenAdd);
  }
  const adjusted = option.timeHours + thicknessExtraHours(thicknessCm, referenceCm, frozen);
  return Math.max(0.25, roundToQuarter(adjusted));
}

export type SafetyLevel = 'pasteurized' | 'cooked' | 'immediate' | 'raw';

export interface SafetyAssessment {
  level: SafetyLevel;
  /** Short badge text. */
  label: string;
  /** One-line explanation shown under the badge. */
  note: string;
}

const IMMEDIATE_NOTE =
  'מבושל ובטוח לאכילה מיד עם צריבה חיצונית. אינו מפוסטר — לא לאחסון ממושך ולא לנשים בהריון, ילדים קטנים, קשישים או חולים.';
const RAW_NOTE =
  'טמפרטורה זו אינה מפסטרת — להשתמש רק בדג טרי באיכות סושי, ולהגיש מיד. לא מומלץ לקבוצות סיכון.';

/**
 * Food-safety classification for an option, based on Baldwin's pasteurization
 * guidance. Conservative by design: when in doubt it under-claims safety.
 */
export function assessSafety(category: string, temperatureC: number, timeHours: number): SafetyAssessment {
  if (category === 'ירקות' || category === 'טופו') {
    return {
      level: 'cooked',
      label: 'מבושל — ללא סיכון בשרי',
      note: 'ירק/מוצר צמחי מבושל היטב. אין כאן חשש בטיחות כמו בבשר או עוף.'
    };
  }

  if (category === 'ביצים') {
    return {
      level: 'pasteurized',
      label: 'בטוח לאכילה',
      note: 'בטמפרטורה ובזמן אלה הביצה בטוחה לאכילה.'
    };
  }

  if (category === 'עוף') {
    if (temperatureC >= 60) {
      return {
        level: 'pasteurized',
        label: 'מפוסטר — בטוח לכולם',
        note: 'בטמפרטורה ובזמן אלה העוף מפוסטר ובטוח לכל הסועדים (לפי Baldwin).'
      };
    }
    return { level: 'immediate', label: 'דורש זהירות', note: 'לעוף מומלץ להישאר ב-60°C ומעלה כדי להבטיח פסטור.' };
  }

  if (category === 'חזיר') {
    if (temperatureC >= 58) {
      return {
        level: 'pasteurized',
        label: 'מפוסטר — בטוח לכולם',
        note: 'בטמפרטורה ובזמן אלה החזיר מפוסטר ובטוח לכל הסועדים (לפי Baldwin).'
      };
    }
    return { level: 'immediate', label: 'בטוח לאכילה מיידית', note: IMMEDIATE_NOTE };
  }

  if (category === 'בקר' || category === 'טלה' || category === 'ברווז') {
    // Long, low cooks pasteurize tough cuts; medium-rare pasteurizes from ~54.5°C.
    if (timeHours >= 4 && temperatureC >= 55) {
      return {
        level: 'pasteurized',
        label: 'מפוסטר — בטוח לכולם',
        note: 'בישול ארוך בטמפרטורה זו מפסטר את הנתח — בטוח לכל הסועדים.'
      };
    }
    if (temperatureC >= 54.5) {
      return {
        level: 'pasteurized',
        label: 'מפוסטר — בטוח לכולם',
        note: 'מ-54.5°C ומעלה, בזמן הבישול הזה הנתח מפוסטר ובטוח לכל הסועדים.'
      };
    }
    return { level: 'immediate', label: 'בטוח לאכילה מיידית', note: IMMEDIATE_NOTE };
  }

  if (category === 'דגים' || category === 'פירות ים') {
    if (temperatureC >= 55) {
      return { level: 'cooked', label: 'מבושל ובטוח', note: 'הדג מבושל לכל אורכו ובטוח לאכילה.' };
    }
    if (temperatureC >= 50) {
      return { level: 'immediate', label: 'בטוח לאכילה מיידית', note: IMMEDIATE_NOTE };
    }
    return { level: 'raw', label: 'כמו סשימי — דג גלם בלבד', note: RAW_NOTE };
  }

  return { level: 'immediate', label: 'בטוח לאכילה מיידית', note: IMMEDIATE_NOTE };
}

/** Concrete searing/finishing guidance per category, including how long to sear. */
export function searGuide(category: string): string {
  switch (category) {
    case 'בקר':
    case 'טלה':
    case 'חזיר':
      return 'צריבה: לייבש היטב ולצרוב במחבת נירוסטה/ברזל חמה מאוד או גריל, כ-45-60 שניות לכל צד עד קרום זהוב. לנוח דקה לפני חיתוך.';
    case 'עוף':
      return 'צריבה: לייבש את העור ולצרוב 1-2 דקות לכל צד במחבת חמה מאוד עד עור פריך. אפשר טורף/גריל לסיום.';
    case 'ברווז':
      return 'צריבה: להתחיל מצד העור במחבת קרה ולהעלות חום בהדרגה 4-6 דקות עד עור פריך, ואז 30-60 שניות בצד השני.';
    case 'דגים':
      return 'צריבה: לייבש בעדינות ולצרוב על צד העור בלבד 30-60 שניות. לא להפוך יותר מדי — הדג עדין.';
    case 'פירות ים':
      return 'צריבה: לייבש מצוין ולצרוב חזק וקצר מאוד, 30-45 שניות לכל צד, לקבלת קרום בלי לייבש.';
    case 'ירקות':
    case 'טופו':
      return 'סיום: לצרוב או לקרמל קצר במחבת חמה / תנור חזק לפי הצורך, או להגיש ישר מהשקית.';
    default:
      return 'סיום: לייבש היטב ולצרוב קצר במחבת חמה לקבלת קרום וצבע.';
  }
}
