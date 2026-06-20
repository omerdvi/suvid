import type { Ingredient, PreparationRecommendation } from './types';

/**
 * Extra "serving direction" tabs appended to each ingredient's own signature
 * recommendation, so every cut offers a few different flavor directions. These are
 * culinary serving/flavor variations (not temperatures), tailored per category and
 * templated with the ingredient's name.
 */

type DirectionSpec = {
  slug: string;
  title: string;
  summary: string;
  extras: string[];
  steps: string[];
};

const CATEGORY_DIRECTIONS: Record<string, DirectionSpec[]> = {
  בקר: [
    {
      slug: 'garlic-butter',
      title: 'ברוטב חמאת שום',
      summary: 'סיום עשיר: חמאה מוקצפת עם שום וטימין שמצפה את הנתח אחרי הצריבה.',
      extras: ['חמאה', 'שום', 'טימין', 'מלח גס'],
      steps: ['לצרוב את הנתח עד קרום זהוב', 'להנמיך אש, להוסיף חמאה, שום וטימין', 'לערות את החמאה על הנתח שוב ושוב', 'לנוח דקה ולפרוס נגד כיוון הסיבים']
    },
    {
      slug: 'chimichurri',
      title: 'עם צ׳ימיצ׳ורי',
      summary: 'רוטב ארגנטינאי טרי של פטרוזיליה, שום וחומץ שמאזן את השומן.',
      extras: ['פטרוזיליה', 'שום', 'חומץ יין אדום', 'שמן זית', 'פתיתי צ׳ילי'],
      steps: ['לקצוץ דק פטרוזיליה ושום', 'לערבב עם חומץ, שמן זית, צ׳ילי ומלח', 'לצרוב ולפרוס את הנתח', 'למזוג צ׳ימיצ׳ורי נדיב מעל']
    }
  ],
  עוף: [
    {
      slug: 'lemon-herb',
      title: 'לימון ועשבי תיבול',
      summary: 'סיום ים-תיכוני קליל, מצוין לסלטים, פיתות וכריכים.',
      extras: ['לימון', 'שום', 'אורגנו או טימין', 'שמן זית'],
      steps: ['לצרוב עד זהוב ופריך', 'לסחוט לימון טרי מעל', 'לפזר עשבי תיבול ולזלף שמן זית']
    },
    {
      slug: 'asian-glaze',
      title: 'גלייז אסייתי',
      summary: 'סויה, דבש וג׳ינג׳ר ללכה מבריקה ומתוקה-מלוחה.',
      extras: ['סויה', 'דבש', 'ג׳ינג׳ר', 'שום', 'שומשום'],
      steps: ['לחמם סויה, דבש, ג׳ינג׳ר ושום עד שמסמיך', 'לצרוב את העוף', 'למרוח גלייז ולפזר שומשום ובצל ירוק']
    }
  ],
  ברווז: [
    {
      slug: 'orange',
      title: 'ברוטב תפוזים',
      summary: 'קלאסיקה צרפתית — חמיצות-מתיקות של תפוז שמאזנת את השומן.',
      extras: ['תפוז', 'דבש', 'חומץ', 'חמאה'],
      steps: ['לצמצם מיץ תפוזים עם דבש וחומץ', 'להוסיף חמאה לרוטב מבריק', 'לצרוב את העור עד פריך ולמזוג רוטב']
    },
    {
      slug: 'pomegranate',
      title: 'רוטב רימונים',
      summary: 'רכז רימונים ודבש לרוטב חמצמץ-מתוק בסגנון מזרחי.',
      extras: ['רכז רימונים', 'דבש', 'שום', 'גרגרי רימון'],
      steps: ['לחמם רכז רימונים עם דבש ושום', 'לצרוב את חזה הברווז על העור', 'לפרוס, למזוג רוטב ולפזר גרגרי רימון']
    }
  ],
  דגים: [
    {
      slug: 'lemon-dill-butter',
      title: 'חמאת לימון ושמיר',
      summary: 'סיום עדין וקלאסי שמדגיש את הדג בלי להעמיס.',
      extras: ['חמאה', 'לימון', 'שמיר', 'מלח'],
      steps: ['להמיס חמאה עם מיץ לימון ושמיר', 'לצרוב קצר על צד העור', 'למזוג את חמאת הלימון מעל ולהגיש מיד']
    },
    {
      slug: 'asian-soy',
      title: 'סויה, ג׳ינג׳ר ושומשום',
      summary: 'כיוון אסייתי רענן עם שמן שומשום ובצל ירוק.',
      extras: ['סויה', 'ג׳ינג׳ר', 'שמן שומשום', 'בצל ירוק'],
      steps: ['לערבב סויה, ג׳ינג׳ר מגורר ושמן שומשום', 'לצרוב קצר את הדג', 'לזלף את הרוטב ולפזר בצל ירוק ושומשום']
    }
  ],
  'פירות ים': [
    {
      slug: 'garlic-chili',
      title: 'שום, צ׳ילי ולימון',
      summary: 'סיום חריף-רענן שמתאים מצוין לכל פירות הים.',
      extras: ['שום', 'צ׳ילי', 'לימון', 'שמן זית', 'פטרוזיליה'],
      steps: ['לחמם שמן זית עם שום וצ׳ילי', 'לצרוב חזק וקצר', 'לסחוט לימון ולפזר פטרוזיליה']
    },
    {
      slug: 'herb-butter',
      title: 'חמאת עשבי תיבול',
      summary: 'חמאה חומה עם שום ועשבי תיבול לסיום עשיר.',
      extras: ['חמאה', 'שום', 'פטרוזיליה', 'לימון'],
      steps: ['להמיס חמאה עם שום עד ארומטי', 'לצרוב חזק וקצר', 'למזוג חמאה ולסיים בלימון']
    }
  ],
  חזיר: [
    {
      slug: 'honey-mustard',
      title: 'גלייז דבש-חרדל',
      summary: 'ציפוי מתקתק-חריף שמשתלב מצוין עם חזיר.',
      extras: ['דבש', 'חרדל', 'שום'],
      steps: ['לערבב דבש, חרדל ושום', 'למרוח על הנתח', 'לצרוב או לצלות חזק עד שהגלייז מקרמל']
    },
    {
      slug: 'bbq',
      title: 'ברביקיו מעושן',
      summary: 'רוטב BBQ ופפריקה מעושנת לסיום בסגנון דרומי.',
      extras: ['רוטב BBQ', 'פפריקה מעושנת', 'סוכר חום'],
      steps: ['לתבל בפפריקה מעושנת', 'למרוח רוטב BBQ', 'לצרוב/לצלות עד קרום דביק ומבריק']
    }
  ],
  טלה: [
    {
      slug: 'garlic-rosemary',
      title: 'שום, רוזמרין ולימון',
      summary: 'תיבול ים-תיכוני קלאסי שמשלים את הטלה.',
      extras: ['שום', 'רוזמרין', 'לימון', 'שמן זית'],
      steps: ['לצרוב עם שום ורוזמרין', 'לסחוט לימון בסיום', 'לזלף שמן זית טוב ולהגיש']
    },
    {
      slug: 'middle-eastern',
      title: 'תיבול מזרחי וטחינה',
      summary: 'כמון וכוסברה עם טחינה גולמית — שילוב מנצח עם טלה.',
      extras: ['כמון', 'כוסברה', 'שום', 'טחינה', 'לימון'],
      steps: ['לתבל בכמון וכוסברה ולצרוב', 'להכין טחינה עם שום ולימון', 'להגיש את הטלה על טחינה ולפזר כוסברה']
    }
  ],
  ביצים: [
    {
      slug: 'avocado-toast',
      title: 'על טוסט אבוקדו',
      summary: 'ארוחת בוקר מנצחת — חלמון קרמי על אבוקדו.',
      extras: ['לחם', 'אבוקדו', 'מלח', 'פלפל', 'שמן זית'],
      steps: ['למעוך אבוקדו על טוסט', 'להניח מעל את הביצה', 'לתבל במלח, פלפל ושמן זית']
    },
    {
      slug: 'rice-bowl',
      title: 'בקערת אורז',
      summary: 'חלמון נוזלי שעוטף אורז חם וירקות.',
      extras: ['אורז', 'סויה', 'בצל ירוק', 'שומשום'],
      steps: ['לסדר אורז חם בקערה', 'להניח ביצה ולפתוח', 'לזלף סויה ולפזר בצל ירוק ושומשום']
    }
  ],
  טופו: [
    {
      slug: 'stir-fry',
      title: 'במוקפץ אסייתי',
      summary: 'טופו יציב שסופג רוטב במוקפץ ירקות מהיר.',
      extras: ['ירקות', 'סויה', 'שום', 'ג׳ינג׳ר', 'שמן שומשום'],
      steps: ['לצרוב את הטופו עד זהוב', 'להקפיץ ירקות עם שום וג׳ינג׳ר', 'להחזיר טופו, לזלף סויה ושמן שומשום']
    },
    {
      slug: 'teriyaki',
      title: 'בגלייז טריאקי',
      summary: 'לכה מתוקה-מלוחה מבריקה על קוביות טופו.',
      extras: ['סויה', 'דבש', 'ג׳ינג׳ר', 'שומשום'],
      steps: ['לצמצם סויה, דבש וג׳ינג׳ר לטריאקי', 'לצרוב טופו', 'לערבב בגלייז ולפזר שומשום']
    }
  ],
  ירקות: [
    {
      slug: 'herb-butter',
      title: 'חמאה ועשבי תיבול',
      summary: 'סיום עשיר וביתי שמתאים לכל ירק.',
      extras: ['חמאה', 'שום', 'טימין', 'מלח'],
      steps: ['להמיס חמאה עם שום וטימין', 'לצרף את הירק ולגלגל', 'לצרוב/לקרמל קצר ולהגיש']
    },
    {
      slug: 'honey-glaze',
      title: 'גלייז דבש ולימון',
      summary: 'מתיקות מאוזנת בחמיצות לימון לתוספת מבריקה.',
      extras: ['דבש', 'לימון', 'שמן זית', 'מלח'],
      steps: ['לערבב דבש, לימון ושמן זית', 'לצפות את הירק', 'לקרמל קצר במחבת חמה ולהגיש']
    }
  ]
};

export function categoryDirections(ingredient: Ingredient): PreparationRecommendation[] {
  const specs = CATEGORY_DIRECTIONS[ingredient.category];
  if (!specs) return [];
  return specs.map((spec) => ({
    id: `${ingredient.id}-${spec.slug}`,
    title: spec.title,
    summary: spec.summary,
    ingredients: [ingredient.name, ...spec.extras],
    steps: spec.steps
  }));
}

/** Returns the ingredient with its own recommendations plus category direction tabs. */
export function withDirections(ingredient: Ingredient): Ingredient {
  const extra = categoryDirections(ingredient).filter(
    (direction) => !ingredient.recommendations.some((existing) => existing.title === direction.title)
  );
  if (extra.length === 0) return ingredient;
  return { ...ingredient, recommendations: [...ingredient.recommendations, ...extra] };
}
