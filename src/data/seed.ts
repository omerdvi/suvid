import type { ClarificationGroup, Ingredient } from '../domain/types';

const source = (title: string, url: string) => ({ title, url });

// Douglas Baldwin's peer-reviewed guide is the academic reference for sous-vide times/temperatures
// and safety, covering beef, poultry, pork, lamb, fish and eggs. Used to back recommended options.
const baldwin = source(
  'Douglas Baldwin - Practical Guide to Sous Vide',
  'https://douglasbaldwin.com/sous-vide.html'
);

export const seedIngredients: Ingredient[] = [
  {
    id: 'asado',
    name: 'אסאדו',
    category: 'בקר',
    aliases: ['אסדו', 'שפונדרה', 'שורט ריבס', 'צלעות בקר', 'צלעות'],
    availability: 'זמין בישראל אצל קצבים ובסופרים, לרוב כנתח עם עצם או פרוסות.',
    thickNote: 'נתח עבה מאוד: להוסיף 2-4 שעות או לבקש פרוסות בעובי אחיד.',
    options: [
      {
        id: 'asado-recommended',
        label: 'מומלץ',
        temperatureC: 68,
        timeHours: 36,
        texture: 'רך מאוד ועסיסי, עדיין מחזיק צורה',
        recommended: true,
        whenToChoose: 'האיזון האמין לאסאדו רך באמת: טמפרטורה מתונה וזמן ארוך שממיסים את רקמות החיבור בלי לייבש. פחות מ-24 שעות עלול לצאת קשה.',
        prep: ['להמליח היטב', 'להוסיף פלפל שחור ושום', 'לא חובה שמן בשקית'],
        finish: ['לייבש היטב', 'לצרוב במחבת נירוסטה חמה 60-90 שניות לכל צד'],
        confidence: 'גבוהה',
        sources: [
          source('Serious Eats - Sous Vide Short Ribs', 'https://www.seriouseats.com/sous-vide-short-ribs-recipe'),
          source('ChefSteps - Short Ribs', 'https://www.chefsteps.com/activities/bomb-braised-short-ribs')
        ]
      },
      {
        id: 'asado-juicy',
        label: 'בשרי כמו סטייק',
        temperatureC: 62,
        timeHours: 48,
        texture: 'ורדרד, בשרי ועסיסי — נחתך ולא מתפרק',
        whenToChoose: 'כשלא רוצים תחושת תבשיל אלא נתח בשרי יותר. דורש סבלנות: פחות מ-48 שעות בטמפרטורה הזו יישאר קשה.',
        prep: ['מלח', 'פלפל', 'מעט פפריקה מעושנת'],
        finish: ['לייבש היטב', 'צריבה קצרה וחזקה במחבת נירוסטה'],
        confidence: 'בינונית',
        sources: [
          source('ChefSteps - Short Ribs', 'https://www.chefsteps.com/activities/bomb-braised-short-ribs'),
          source('Anova - Short Ribs', 'https://recipes.anovaculinary.com/recipe/sous-vide-short-ribs')
        ]
      },
      {
        id: 'asado-falling',
        label: 'מתפרק',
        temperatureC: 74,
        timeHours: 30,
        texture: 'מתפרק ורך מאוד',
        whenToChoose: 'כשמחפשים מרקם קרוב לתבשיל ארוך או מילוי לטאקו/כריכים. הזמן הארוך חשוב — זה מה שממיס את הקולגן.',
        prep: ['מלח', 'שום', 'פלפל שחור', 'אפשר מעט רוטב ברביקיו אחרי הבישול'],
        finish: ['לפרק או לפרוס', 'לצרוב במהירות או לקרמל ברוטב במחבת'],
        confidence: 'בינונית',
        sources: [source('Amazing Food Made Easy - Short Ribs', 'https://www.amazingfoodmadeeasy.com/sous-vide-times-temperatures/how-to-sous-vide/short-ribs')]
      }
    ],
    recommendations: [
      {
        id: 'asado-israeli',
        title: 'אסאדו ישראלי עם שום ופלפל',
        summary: 'תיבול נקי, בישול ארוך וסיום חזק במחבת נירוסטה.',
        ingredients: ['אסאדו', 'מלח גס', 'פלפל שחור', 'שום כתוש', 'מעט פפריקה'],
        steps: ['לתבל לפני השקית', 'לבשל לפי האופציה הנבחרת', 'לייבש היטב', 'לצרוב חזק ולהגיש מיד']
      }
    ]
  },
  {
    id: 'chicken-breast',
    name: 'חזה עוף',
    category: 'עוף',
    aliases: ['חזה עוף', 'חזה'],
    availability: 'זמין מאוד בישראל, טרי או קפוא.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש היטב לפני השקית.',
    thickNote: 'חזה עבה במיוחד: לשטח מעט או להוסיף 20-30 דקות.',
    options: [
      {
        id: 'chicken-breast-juicy',
        label: 'עסיסי',
        temperatureC: 63,
        timeHours: 1.5,
        texture: 'עסיסי ורך',
        recommended: true,
        whenToChoose: 'ברירת המחדל לחזה עוף לא יבש.',
        prep: ['מלח', 'פלפל', 'מעט שמן זית או עשבי תיבול'],
        finish: ['לייבש', 'צריבה קצרה בלבד כדי לא לייבש'],
        confidence: 'גבוהה',
        sources: [
          source('Serious Eats - Chicken Breast', 'https://www.seriouseats.com/the-best-sous-vide-chicken-breast-recipe'),
          baldwin
        ]
      },
      {
        id: 'chicken-breast-firmer',
        label: 'יציב יותר',
        temperatureC: 66,
        timeHours: 1.25,
        texture: 'יותר קלאסי ויציב',
        whenToChoose: 'למי שמעדיף מרקם פחות ורדרד ורך.',
        prep: ['מלח', 'פלפל', 'שום גבישי'],
        finish: ['צריבה קצרה במחבת חמה'],
        confidence: 'גבוהה',
        sources: [source('Anova - Chicken Breast', 'https://recipes.anovaculinary.com/recipe/sous-vide-chicken-breast')]
      }
    ],
    recommendations: [
      {
        id: 'chicken-herbs',
        title: 'חזה עוף לימון ועשבי תיבול',
        summary: 'מתאים לסלטים, כריכים וארוחה קלה.',
        ingredients: ['חזה עוף', 'מלח', 'פלפל', 'לימון', 'טימין או רוזמרין'],
        steps: ['לתבל קלות', 'לבשל', 'לייבש', 'לצרוב קצר מאוד']
      }
    ]
  },
  {
    id: 'pargit',
    name: 'פרגית',
    category: 'עוף',
    aliases: ['פרגית', 'ירך עוף ללא עצם', 'סטייק פרגית', 'שווארמה פרגית'],
    availability: 'זמין מאוד בישראל אצל קצבים וסופרים, בדרך כלל טרי ולפעמים קפוא.',
    frozenNote: 'קפוא: להפשיר במקרר, לסנן ולייבש היטב לפני התיבול והסגירה.',
    thickNote: 'פרגית עבה במיוחד: לפתוח מעט לעובי אחיד או להוסיף 20-30 דקות.',
    options: [
      {
        id: 'pargit-juicy',
        label: 'עסיסי וישראלי',
        temperatureC: 64,
        timeHours: 2,
        texture: 'עסיסי ורך, עם נגיסה נעימה',
        recommended: true,
        whenToChoose: 'ברירת המחדל לפרגית: 64°C היא נקודת המתיקות של ירך עוף — עסיסית ומפוסטרת היטב אחרי שעתיים, בלי להתייבש כמו בטמפרטורות גבוהות.',
        prep: ['מלח', 'פלפל', 'פפריקה', 'שום כתוש', 'מעט שמן זית או שמן ניטרלי'],
        finish: ['לייבש היטב', 'לצרוב 60-90 שניות מכל צד במחבת נירוסטה חמה או בגריל גז'],
        confidence: 'גבוהה',
        sources: [
          source('Serious Eats - Sous Vide Chicken Thighs', 'https://www.seriouseats.com/crispy-sous-vide-chicken-thigh-recipe'),
          source('Amazing Food Made Easy - Chicken', 'https://www.amazingfoodmadeeasy.com/sous-vide-times-temperatures/chicken'),
          source('Anova - Chicken Thigh', 'https://recipes.anovaculinary.com/recipe/chicken-thigh')
        ]
      },
      {
        id: 'pargit-firmer',
        label: 'קפיצי ועדין',
        temperatureC: 66,
        timeHours: 2,
        texture: 'עסיסי וקפיצי יותר, פחות ורדרד',
        whenToChoose: 'כשמעדיפים מרקם קרוב יותר לעוף צלוי קלאסי, בלי שמץ ורוד.',
        prep: ['מלח', 'פלפל', 'מעט סויה או לימון אחרי הבישול', 'לא להגזים בנוזלים בשקית'],
        finish: ['לייבש היטב', 'צריבה קצרה וחזקה כדי לא לייבש'],
        confidence: 'גבוהה',
        sources: [
          source('Serious Eats - Sous Vide Chicken Thighs', 'https://www.seriouseats.com/crispy-sous-vide-chicken-thigh-recipe')
        ]
      },
      {
        id: 'pargit-shawarma',
        label: 'מתפרק לשווארמה',
        temperatureC: 74,
        timeHours: 3,
        texture: 'רך מאוד, כמעט מתפרק — כמו שווארמה',
        whenToChoose: 'לפרגית מתפרקת לפיתה או לשווארמה ביתית. בטמפרטורה כזו חייבים זמן ארוך — בישול קצר יוצא קשה ויבש.',
        prep: ['מלח', 'פפריקה', 'כורכום או בהרט', 'מעט שמן'],
        finish: ['לפרוס דק', 'לצרוב במחבת חמה עד שוליים פריכים'],
        confidence: 'בינונית',
        sources: [
          source('Serious Eats - Sous Vide Chicken Thighs', 'https://www.seriouseats.com/crispy-sous-vide-chicken-thigh-recipe'),
          source('Amazing Food Made Easy - Chicken', 'https://www.amazingfoodmadeeasy.com/sous-vide-times-temperatures/chicken')
        ]
      }
    ],
    recommendations: [
      {
        id: 'pargit-paprika',
        title: 'פרגית פפריקה ושום',
        summary: 'תיבול ישראלי פשוט, בישול מדויק וסיום חזק שמחזיר צבע וקרום.',
        ingredients: ['פרגית', 'מלח', 'פלפל', 'פפריקה', 'שום', 'שמן זית'],
        steps: ['לתבל לפני השקית', 'לבשל לפי האפשרות הנבחרת', 'לייבש היטב', 'לצרוב חזק ולהגיש מיד']
      }
    ]
  },
  {
    id: 'salmon',
    name: 'סלמון',
    category: 'דגים',
    aliases: ['סלמון', 'פילה סלמון', 'דג סלמון'],
    availability: 'זמין בישראל טרי או קפוא.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש היטב לפני השקית.',
    thickNote: 'נתח עבה: להוסיף 20-30 דקות או לחלק למנות דקות יותר.',
    options: [
      {
        id: 'salmon-soft',
        label: 'רך ועדין',
        temperatureC: 50,
        timeHours: 0.75,
        texture: 'רך מאוד ועדין',
        recommended: true,
        whenToChoose: 'כשמחפשים סלמון עסיסי ולא יבש.',
        prep: ['מלח עדין', 'מעט שמן זית', 'אפשר שמיר או לימון אחרי הבישול'],
        finish: ['לייבש בזהירות', 'צריבה קצרה על צד העור אם יש'],
        confidence: 'גבוהה',
        sources: [
          source('Serious Eats - Sous Vide Salmon', 'https://www.seriouseats.com/sous-vide-salmon-recipe'),
          baldwin
        ]
      },
      {
        id: 'salmon-firm',
        label: 'יציב',
        temperatureC: 54,
        timeHours: 0.75,
        texture: 'יציב יותר, עדיין עסיסי',
        whenToChoose: 'למי שמעדיף מרקם דג מבושל יותר.',
        prep: ['מלח', 'שמן זית'],
        finish: ['צריבה קצרה במחבת נירוסטה'],
        confidence: 'גבוהה',
        sources: [source('Anova - Salmon', 'https://recipes.anovaculinary.com/recipe/sous-vide-salmon')]
      }
    ],
    recommendations: [
      {
        id: 'salmon-lemon',
        title: 'סלמון לימון ושמיר',
        summary: 'עדין, ישראלי ופשוט, עם סיום קצר במחבת.',
        ingredients: ['סלמון', 'מלח', 'שמן זית', 'לימון', 'שמיר'],
        steps: ['לבשל עם מלח ושמן זית', 'להוסיף לימון ושמיר אחרי הבישול', 'לצרוב קצר אם רוצים']
      }
    ]
  },
  {
    id: 'eggs',
    name: 'ביצים',
    category: 'ביצים',
    aliases: ['ביצה', 'ביצים'],
    availability: 'זמין מאוד בישראל.',
    options: [
      {
        id: 'eggs-ramen',
        label: 'חלמון קרמי',
        temperatureC: 63,
        timeHours: 1,
        texture: 'חלמון קרמי וחלבון רך',
        recommended: true,
        whenToChoose: 'לביצים רכות, קערות אורז או ראמן.',
        prep: ['אין צורך בשקית'],
        finish: ['לקלף בזהירות ולהגיש'],
        confidence: 'גבוהה',
        sources: [
          source('ChefSteps - Eggs', 'https://www.chefsteps.com/activities/the-best-egg-sous-vide'),
          baldwin
        ]
      },
      {
        id: 'eggs-quick-poached',
        label: 'עלומה מהירה',
        temperatureC: 75,
        timeHours: 0.25,
        texture: 'חלבון רך שמחזיק צורה, חלמון נוזלי-קרמי',
        whenToChoose: 'ביצה עלומה בלי חומץ ובלי מערבולות — רבע שעה ומגישים מעל טוסט או שקשוקה של יחיד.',
        prep: ['אין צורך בשקית — מבשלים בקליפה'],
        finish: ['לפתוח מעל טוסט או קערה ולהגיש מיד'],
        confidence: 'גבוהה',
        sources: [
          source('ChefSteps - Eggs', 'https://www.chefsteps.com/activities/the-best-egg-sous-vide'),
          baldwin
        ]
      }
    ],
    recommendations: [
      {
        id: 'eggs-bowl',
        title: 'ביצה קרמית לקערת אורז',
        summary: 'ביצה רכה מאוד שמתאימה מעל אורז, ירקות או נודלס.',
        ingredients: ['ביצים', 'מלח', 'פלפל'],
        steps: ['לבשל בקליפה', 'לקלף', 'להגיש מיד']
      }
    ]
  },
  {
    id: 'tofu',
    name: 'טופו',
    category: 'טופו',
    aliases: ['טופו'],
    availability: 'זמין בישראל ברוב הסופרים.',
    options: [
      {
        id: 'tofu-marinade',
        label: 'סופג מרינדה',
        temperatureC: 82,
        timeHours: 1,
        texture: 'יציב וסופג טעמים',
        recommended: true,
        whenToChoose: 'כשרוצים טופו למוקפץ או צריבה.',
        prep: ['לייבש', 'לחתוך', 'להוסיף סויה, שום וגינגר'],
        finish: ['לייבש', 'לצרוב במחבת חמה'],
        confidence: 'בינונית',
        sources: [
          source('Anova - Tofu', 'https://recipes.anovaculinary.com/recipe/sous-vide-tofu'),
          source('Serious Eats - Crispy Tofu', 'https://www.seriouseats.com/sous-vide-crispy-tofu-recipe')
        ]
      }
    ],
    recommendations: [
      {
        id: 'tofu-soy',
        title: 'טופו סויה-שום',
        summary: 'טופו יציב עם מרינדה פשוטה וסיום במחבת.',
        ingredients: ['טופו', 'סויה', 'שום', 'גינגר', 'שמן ניטרלי'],
        steps: ['לייבש ולחתוך', 'לבשל עם המרינדה', 'לצרוב עד השחמה']
      }
    ]
  },
  {
    id: 'shrimp',
    name: 'שרימפס',
    category: 'פירות ים',
    aliases: ['שרימפס', 'שרימפס קפוא', 'חסילונים'],
    availability: 'זמין בישראל בעיקר קפוא בחנויות דגים ופירות ים.',
    frozenNote: 'להפשיר במקרר, לסנן ולייבש היטב לפני השקית.',
    options: [
      {
        id: 'shrimp-juicy',
        label: 'עסיסי',
        temperatureC: 57,
        timeHours: 0.5,
        texture: 'עסיסי, קפיצי וטרי',
        recommended: true,
        whenToChoose: 'נקודת המתיקות לשרימפס עסיסי שלא נהיה גומי (57°C, לפי Serious Eats).',
        prep: ['מלח', 'מעט שמן זית', 'שום'],
        finish: ['צריבה קצרה מאוד במחבת חמה'],
        confidence: 'בינונית',
        sources: [
          source('Serious Eats - Shrimp', 'https://www.seriouseats.com/sous-vide-shrimp-recipe'),
          baldwin
        ]
      }
    ],
    recommendations: [
      {
        id: 'shrimp-garlic',
        title: 'שרימפס שום ולימון',
        summary: 'הכנה קצרה עם סיום מהיר במחבת.',
        ingredients: ['שרימפס', 'שום', 'לימון', 'שמן זית', 'מלח'],
        steps: ['להפשיר ולייבש', 'לבשל קצר', 'לצרוב עם שום ולימון']
      }
    ]
  },
  {
    id: 'ribeye',
    name: 'אנטריקוט',
    category: 'בקר',
    aliases: ['אנטריקוט', 'סטייק אנטריקוט', 'ריביי'],
    availability: 'זמין בישראל אצל קצבים וסופרים.',
    thickNote: 'סטייק עבה במיוחד: להוסיף 30-45 דקות.',
    options: [
      {
        id: 'ribeye-medium-rare',
        label: 'מדיום-רייר',
        temperatureC: 54,
        timeHours: 1.5,
        texture: 'ורוד, עסיסי ורך',
        recommended: true,
        whenToChoose: 'ברירת מחדל לסטייק עסיסי.',
        prep: ['מלח', 'פלפל אחרי הבישול או לפני הצריבה'],
        finish: ['לייבש היטב', 'צריבה חזקה במחבת נירוסטה'],
        confidence: 'גבוהה',
        sources: [
          source('Serious Eats - Steak', 'https://www.seriouseats.com/food-lab-complete-guide-to-sous-vide-steak'),
          baldwin
        ]
      }
    ],
    recommendations: [
      {
        id: 'ribeye-pan',
        title: 'אנטריקוט במחבת נירוסטה',
        summary: 'בישול מדויק וסיום חם מאוד לקרום טוב.',
        ingredients: ['אנטריקוט', 'מלח', 'פלפל', 'שמן ניטרלי'],
        steps: ['להמליח', 'לבשל', 'לייבש היטב', 'לצרוב חזק']
      }
    ]
  },
  {
    id: 'brisket',
    name: 'בריסקט',
    category: 'בקר',
    aliases: ['בריסקט', 'חזה בקר'],
    availability: 'זמין אצל קצבים, לפעמים צריך להזמין מראש.',
    thickNote: 'נתח עבה: לא בעיה בבישול ארוך, אבל חשוב לקרר/לסיים נכון.',
    options: [
      {
        id: 'brisket-sliceable',
        label: 'פריס',
        temperatureC: 68,
        timeHours: 36,
        texture: 'רך וניתן לפריסה',
        recommended: true,
        whenToChoose: 'כשמחפשים בריסקט פרוס ולא מפורק.',
        prep: ['מלח', 'פלפל שחור', 'פפריקה מעושנת'],
        finish: ['ייבוש', 'צריבה או גריל גז קצר לקבלת קראסט'],
        confidence: 'בינונית',
        sources: [
          source('Amazing Food Made Easy - Brisket', 'https://www.amazingfoodmadeeasy.com/sous-vide-times-temperatures/how-to-sous-vide/brisket'),
          baldwin
        ]
      }
    ],
    recommendations: [
      {
        id: 'brisket-bbq',
        title: 'בריסקט בסגנון BBQ עדין',
        summary: 'תיבול יבש, בישול ארוך וסיום בגריל גז אם רוצים קראסט.',
        ingredients: ['בריסקט', 'מלח', 'פלפל', 'פפריקה מעושנת'],
        steps: ['לתבל', 'לבשל ארוך', 'לייבש', 'לסיים בגריל או מחבת']
      }
    ]
  },
  {
    id: 'pork-ribs',
    name: 'צלעות חזיר',
    category: 'חזיר',
    aliases: ['צלעות חזיר', 'ספריבס', 'ריבס חזיר'],
    availability: 'זמין בישראל בחנויות לא כשרות ובחלק מהקצביות המתמחות, לעיתים קפוא.',
    frozenNote: 'אם קפוא, להפשיר במקרר ולייבש לפני תיבול.',
    options: [
      {
        id: 'pork-ribs-tender',
        label: 'רך',
        temperatureC: 74,
        timeHours: 12,
        texture: 'רך ונשאר על העצם',
        recommended: true,
        whenToChoose: 'לצלעות רכות עם סיום בגריל או מחבת.',
        prep: ['מלח', 'פלפל', 'פפריקה', 'מעט סוכר חום אם רוצים'],
        finish: ['לייבש', 'למרוח רוטב רק בסיום', 'לצרוב בגריל גז'],
        confidence: 'בינונית',
        sources: [
          source('Serious Eats - Pork Ribs', 'https://www.seriouseats.com/sous-vide-pork-ribs-recipe-food-lab'),
          baldwin
        ]
      }
    ],
    recommendations: [
      {
        id: 'pork-ribs-glaze',
        title: 'צלעות חזיר עם גלייז בסיום',
        summary: 'בישול מדויק וסיום קצר עם רוטב מתקתק.',
        ingredients: ['צלעות חזיר', 'מלח', 'פפריקה', 'רוטב BBQ'],
        steps: ['לתבל יבש', 'לבשל', 'לייבש', 'לצרוב עם רוטב בסוף']
      }
    ]
  },
  {
    id: 'lamb-ribs',
    name: 'צלעות טלה',
    category: 'טלה',
    aliases: ['צלעות טלה', 'טלה צלעות'],
    availability: 'זמין בישראל אצל קצבים, לרוב טרי.',
    options: [
      {
        id: 'lamb-ribs-pink',
        label: 'ורוד ועסיסי',
        temperatureC: 56,
        timeHours: 2,
        texture: 'ורוד, עסיסי ורך',
        recommended: true,
        whenToChoose: 'לצלעות טלה בסגנון סטייק.',
        prep: ['מלח', 'פלפל', 'רוזמרין או טימין'],
        finish: ['צריבה מהירה במחבת או גריל גז'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Lamb Chops', 'https://recipes.anovaculinary.com/recipe/sous-vide-lamb-chops'),
          baldwin
        ]
      }
    ],
    recommendations: [
      {
        id: 'lamb-rosemary',
        title: 'צלעות טלה רוזמרין ושום',
        summary: 'קלאסי, קצר ומדויק.',
        ingredients: ['צלעות טלה', 'מלח', 'שום', 'רוזמרין'],
        steps: ['לתבל', 'לבשל', 'לייבש', 'לצרוב חזק']
      }
    ]
  },
  {
    id: 'root-veg',
    name: 'ירקות שורש',
    category: 'ירקות',
    aliases: ['גזר', 'סלק', 'ירקות שורש', 'בטטה'],
    availability: 'זמין מאוד בישראל.',
    options: [
      {
        id: 'root-veg-tender',
        label: 'רך ומרוכז',
        temperatureC: 85,
        timeHours: 1.5,
        texture: 'רך, מתוק ומרוכז',
        recommended: true,
        whenToChoose: 'לתוספת ירקות מדויקת.',
        prep: ['מלח', 'מעט שמן זית', 'אפשר דבש או טימין'],
        finish: ['צריבה קצרה או הגשה ישר מהשקית'],
        confidence: 'גבוהה',
        sources: [
          source('ChefSteps - Vegetables', 'https://www.chefsteps.com/activities/sous-vide-vegetables'),
          source('Anova - Root Vegetables', 'https://recipes.anovaculinary.com/recipe/sous-vide-root-vegetables')
        ]
      }
    ],
    recommendations: [
      {
        id: 'root-veg-honey',
        title: 'ירקות שורש דבש וטימין',
        summary: 'תוספת מתוקה ועדינה שמתאימה לבשר.',
        ingredients: ['גזר או בטטה', 'מלח', 'שמן זית', 'טימין', 'מעט דבש'],
        steps: ['לחתוך אחיד', 'לבשל', 'לצרוב או לקרמל קצר במחבת']
      }
    ]
  },
  {
    id: 'picanha',
    name: 'פיקניה',
    category: 'בקר',
    aliases: ['פיקניה', 'פיקנייה', 'קולמבה', 'picanha'],
    availability: 'נתח ברזילאי פופולרי, זמין בקצביות בישראל, לרוב עם שכבת שומן עבה.',
    thickNote: 'נתח עבה במיוחד: להוסיף שעה ולהאריך מעט את הצריבה של צד השומן.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש היטב לפני התיבול.',
    options: [
      {
        id: 'picanha-medium-rare',
        label: 'מדיום רייר',
        temperatureC: 54,
        timeHours: 2,
        texture: 'ורוד אחיד, עסיסי ורך',
        recommended: true,
        whenToChoose: 'הקלאסי לפיקניה כסטייק עם צריבה חזקה.',
        prep: ['מלח גס', 'פלפל שחור גס', 'להשאיר את שכבת השומן שלמה'],
        finish: ['לייבש היטב', 'לצרוב חזק, כולל צד השומן עד שמשחים'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Picanha', 'https://recipes.anovaculinary.com/recipe/sous-vide-picanha'),
          source('Serious Eats - Steak Guide', 'https://www.seriouseats.com/food-lab-complete-guide-to-sous-vide-steak'),
          baldwin
        ]
      },
      {
        id: 'picanha-medium',
        label: 'מדיום',
        temperatureC: 57,
        timeHours: 2,
        texture: 'מדיום, יציב מעט יותר',
        whenToChoose: 'למי שמעדיף פחות ורוד אבל עדיין עסיסי.',
        prep: ['מלח גס', 'פלפל שחור'],
        finish: ['לייבש', 'צריבה חזקה וקצרה'],
        confidence: 'בינונית',
        sources: [source('Anova - Picanha', 'https://recipes.anovaculinary.com/recipe/sous-vide-picanha')]
      }
    ],
    recommendations: [
      {
        id: 'picanha-brazilian',
        title: 'פיקניה בסגנון ברזילאי',
        summary: 'מלח גס, בישול מדויק וצריבה חזקה של שכבת השומן.',
        ingredients: ['פיקניה', 'מלח גס', 'פלפל שחור'],
        steps: ['לתבל במלח גס', 'לבשל לפי האופציה', 'לייבש', 'לצרוב חזק כולל השומן', 'לחתוך נגד כיוון הסיבים']
      }
    ]
  },
  {
    id: 'sinta',
    name: 'סינטה',
    category: 'בקר',
    aliases: ['סינטה', 'סטייק סינטה', 'striploin', 'ניו יורק', 'נתח קצבים'],
    availability: 'נתח סטייק מרכזי בישראל, זמין טרי בקצביות ובסופרים.',
    thickNote: 'נתח עבה במיוחד: להוסיף 30-45 דקות.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש לפני הצריבה.',
    options: [
      {
        id: 'sinta-medium-rare',
        label: 'מדיום רייר',
        temperatureC: 54,
        timeHours: 1.5,
        texture: 'ורוד, רך ועסיסי',
        recommended: true,
        whenToChoose: 'ברירת המחדל לסטייק סינטה מדויק.',
        prep: ['מלח', 'פלפל שחור', 'אפשר שן שום וחמאה בשקית'],
        finish: ['לייבש היטב', 'צריבה חזקה 45-60 שניות לכל צד'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - New York Strip', 'https://recipes.anovaculinary.com/recipe/sous-vide-new-york-strip-steak'),
          baldwin
        ]
      },
      {
        id: 'sinta-medium',
        label: 'מדיום',
        temperatureC: 57,
        timeHours: 1.5,
        texture: 'מדיום, פחות ורוד',
        whenToChoose: 'למי שאוהב סטייק יותר עשוי אבל עדיין רך.',
        prep: ['מלח', 'פלפל שחור'],
        finish: ['לייבש', 'צריבה חזקה וקצרה'],
        confidence: 'גבוהה',
        sources: [source('Serious Eats - Sous Vide Steak', 'https://www.seriouseats.com/food-lab-complete-guide-to-sous-vide-steak')]
      }
    ],
    recommendations: [
      {
        id: 'sinta-butter',
        title: 'סינטה חמאה ושום',
        summary: 'סטייק קלאסי עם סיום חמאה במחבת נירוסטה.',
        ingredients: ['סינטה', 'מלח', 'פלפל', 'חמאה', 'שום'],
        steps: ['לתבל', 'לבשל לפי האופציה', 'לייבש', 'לצרוב בחמאה ושום ולהגיש מיד']
      }
    ]
  },
  {
    id: 'beef-fillet',
    name: 'פילה בקר',
    category: 'בקר',
    aliases: ['פילה בקר', 'פילה', 'טנדרלוין', 'פילה מיניון', 'tenderloin'],
    availability: 'נתח רך ויקר, זמין בקצביות בישראל טרי.',
    thickNote: 'מדליון עבה במיוחד: להוסיף 20-30 דקות.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש לפני הצריבה.',
    options: [
      {
        id: 'beef-fillet-tender',
        label: 'רך במיוחד',
        temperatureC: 54,
        timeHours: 1.5,
        texture: 'נימוח, ורוד ועדין',
        recommended: true,
        whenToChoose: 'הכי מתאים לפילה — רכות מקסימלית עם ורוד אחיד.',
        prep: ['מלח', 'פלפל', 'חמאה וטימין בשקית'],
        finish: ['לייבש היטב', 'צריבה קצרה וחזקה כדי לא לייבש'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Filet Mignon', 'https://recipes.anovaculinary.com/recipe/sous-vide-filet-mignon'),
          baldwin
        ]
      },
      {
        id: 'beef-fillet-medium',
        label: 'מדיום',
        temperatureC: 56,
        timeHours: 1.5,
        texture: 'מדיום, ורוד עדין',
        whenToChoose: 'למי שמעדיף קצת יותר עשוי.',
        prep: ['מלח', 'פלפל'],
        finish: ['לייבש', 'צריבה קצרה וחזקה'],
        confidence: 'גבוהה',
        sources: [source('Serious Eats - Sous Vide Steak', 'https://www.seriouseats.com/food-lab-complete-guide-to-sous-vide-steak')]
      }
    ],
    recommendations: [
      {
        id: 'beef-fillet-classic',
        title: 'פילה חמאה וטימין',
        summary: 'נתח חגיגי, רך ומדויק עם סיום עדין.',
        ingredients: ['פילה בקר', 'מלח', 'פלפל', 'חמאה', 'טימין'],
        steps: ['לתבל', 'לבשל', 'לייבש', 'לצרוב קצר בחמאה']
      }
    ]
  },
  {
    id: 'chicken-thighs',
    name: 'שוקי עוף',
    category: 'עוף',
    aliases: ['שוקי עוף', 'שוק עוף', 'כרעיים', 'ירכיים', 'ירך עוף'],
    availability: 'זמין מאוד וזול בישראל, טרי או קפוא.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש היטב לפני התיבול.',
    options: [
      {
        id: 'chicken-thighs-tender',
        label: 'רך ונופל',
        temperatureC: 74,
        timeHours: 3,
        texture: 'רך מאוד, כמעט נופל מהעצם',
        recommended: true,
        whenToChoose: 'לשוקיים עסיסיים עם עור פריך אחרי צריבה.',
        prep: ['מלח', 'פלפל', 'פפריקה ושום'],
        finish: ['לייבש את העור היטב', 'לצרוב חזק במחבת נירוסטה עד עור פריך'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Chicken Thighs', 'https://recipes.anovaculinary.com/recipe/sous-vide-chicken-thighs'),
          baldwin
        ]
      },
      {
        id: 'chicken-thighs-firm',
        label: 'יציב יותר',
        temperatureC: 66,
        timeHours: 2.5,
        texture: 'עסיסי ויותר נשכני',
        whenToChoose: 'למי שמעדיף מרקם עוף קלאסי ולא נופל.',
        prep: ['מלח', 'פלפל', 'שום'],
        finish: ['לייבש', 'צריבה חזקה לעור פריך'],
        confidence: 'גבוהה',
        sources: [source('Serious Eats - Sous Vide Chicken Thighs', 'https://www.seriouseats.com/sous-vide-chicken-thighs-recipe')]
      }
    ],
    recommendations: [
      {
        id: 'chicken-thighs-paprika',
        title: 'שוקי עוף פפריקה ושום',
        summary: 'עסיסי בפנים, פריך בחוץ — מתאים לאורז או פיתה.',
        ingredients: ['שוקי עוף', 'מלח', 'פפריקה', 'שום', 'שמן זית'],
        steps: ['לתבל', 'לבשל', 'לייבש את העור', 'לצרוב חזק ולהגיש']
      }
    ]
  },
  {
    id: 'turkey-breast',
    name: 'חזה הודו',
    category: 'עוף',
    aliases: ['חזה הודו', 'הודו', 'שניצל הודו'],
    availability: 'זמין מאוד בישראל, טרי או קפוא, לרוב נתח גדול ורזה.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש לפני התיבול.',
    thickNote: 'נתח עבה במיוחד: להוסיף 30-45 דקות.',
    options: [
      {
        id: 'turkey-breast-juicy',
        label: 'עסיסי',
        temperatureC: 63,
        timeHours: 2.5,
        texture: 'עסיסי ורך, לא יבש',
        recommended: true,
        whenToChoose: 'ברירת המחדל לחזה הודו שלא יוצא יבש.',
        prep: ['מלח', 'פלפל', 'מרווה או טימין ושמן זית'],
        finish: ['לייבש', 'צריבה קצרה כדי לשמור על לחות'],
        confidence: 'גבוהה',
        sources: [
          source('Serious Eats - Sous Vide Turkey Breast', 'https://www.seriouseats.com/sous-vide-turkey-breast-recipe'),
          baldwin
        ]
      },
      {
        id: 'turkey-breast-firm',
        label: 'יציב יותר',
        temperatureC: 66,
        timeHours: 2,
        texture: 'יותר קלאסי ויציב',
        whenToChoose: 'למי שמעדיף מרקם פרוס ויציב לכריכים.',
        prep: ['מלח', 'פלפל'],
        finish: ['לייבש', 'צריבה קצרה'],
        confidence: 'בינונית',
        sources: [source('Anova - Turkey Breast', 'https://recipes.anovaculinary.com/recipe/sous-vide-turkey-breast')]
      }
    ],
    recommendations: [
      {
        id: 'turkey-breast-herbs',
        title: 'חזה הודו עשבי תיבול',
        summary: 'נתח רזה שיוצא עסיסי, מצוין לכריכים ולסלטים.',
        ingredients: ['חזה הודו', 'מלח', 'פלפל', 'מרווה', 'שמן זית'],
        steps: ['לתבל קלות', 'לבשל', 'לייבש', 'לצרוב קצר ולפרוס דק']
      }
    ]
  },
  {
    id: 'denis',
    name: 'דניס',
    category: 'דגים',
    aliases: ['דניס', 'דניס שלם', 'פילה דניס', 'sea bream'],
    availability: 'דג ים פופולרי בישראל, זמין טרי וגם כפילה.',
    frozenNote: 'קפוא: להפשיר לאט במקרר ולייבש בעדינות לפני השקית.',
    options: [
      {
        id: 'denis-delicate',
        label: 'עדין ופתיתי',
        temperatureC: 52,
        timeHours: 0.5,
        texture: 'עדין, לח ופתיתי',
        recommended: true,
        whenToChoose: 'לפילה דניס פתיתי ולח עם עור פריך — מבושל היטב אך לא יבש.',
        prep: ['מלח', 'מעט שמן זית', 'פרוסת לימון'],
        finish: ['לייבש את העור', 'צריבה קצרה על צד העור בלבד'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Sous Vide Fish', 'https://recipes.anovaculinary.com/recipe/sous-vide-fish'),
          baldwin
        ]
      },
      {
        id: 'denis-firm',
        label: 'יציב יותר',
        temperatureC: 56,
        timeHours: 0.5,
        texture: 'פתיתים יציבים יותר',
        whenToChoose: 'למי שמעדיף מרקם דג קלאסי ופחות ג׳לי.',
        prep: ['מלח', 'שמן זית'],
        finish: ['לייבש', 'צריבה קצרה על העור'],
        confidence: 'בינונית',
        sources: [source('ChefSteps - Sous Vide Fish', 'https://www.chefsteps.com/activities/sous-vide-fish')]
      }
    ],
    recommendations: [
      {
        id: 'denis-lemon',
        title: 'דניס לימון ושמן זית',
        summary: 'דג נקי ועדין עם עור פריך.',
        ingredients: ['דניס', 'מלח', 'שמן זית', 'לימון'],
        steps: ['לתבל', 'לבשל קצר', 'לייבש את העור', 'לצרוב על צד העור ולהגיש']
      }
    ]
  },
  {
    id: 'levrak',
    name: 'לברק',
    category: 'דגים',
    aliases: ['לברק', 'בס ים', 'sea bass', 'ברונזינו'],
    availability: 'דג ים נפוץ בישראל, זמין טרי וכפילה.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש בעדינות לפני השקית.',
    options: [
      {
        id: 'levrak-delicate',
        label: 'עדין ופתיתי',
        temperatureC: 52,
        timeHours: 0.5,
        texture: 'לח, רך ופתיתי',
        recommended: true,
        whenToChoose: 'לפילה לברק פתיתי ולח עם עור פריך — מבושל היטב אך לא יבש.',
        prep: ['מלח', 'שמן זית', 'טימין או לימון'],
        finish: ['לייבש את העור', 'צריבה קצרה על צד העור'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Sea Bass', 'https://recipes.anovaculinary.com/recipe/sous-vide-sea-bass'),
          baldwin
        ]
      },
      {
        id: 'levrak-firm',
        label: 'יציב יותר',
        temperatureC: 55,
        timeHours: 0.5,
        texture: 'פתיתים מעט יציבים יותר',
        whenToChoose: 'למרקם דג קצת יותר מוצק.',
        prep: ['מלח', 'שמן זית'],
        finish: ['לייבש', 'צריבה קצרה על העור'],
        confidence: 'בינונית',
        sources: [source('Anova - Sous Vide Fish', 'https://recipes.anovaculinary.com/recipe/sous-vide-fish')]
      }
    ],
    recommendations: [
      {
        id: 'levrak-herbs',
        title: 'לברק עשבי תיבול',
        summary: 'דג ים נקי עם סיום עור פריך ולימון.',
        ingredients: ['לברק', 'מלח', 'שמן זית', 'טימין', 'לימון'],
        steps: ['לתבל', 'לבשל קצר', 'לייבש את העור', 'לצרוב על העור ולהגיש']
      }
    ]
  },
  {
    id: 'tuna',
    name: 'טונה',
    category: 'דגים',
    aliases: ['טונה', 'טונה אדומה', 'אהי', 'ahi', 'סטייק טונה'],
    availability: 'נתח טונה (סטייק) זמין בישראל טרי וקפוא.',
    thickNote: 'נתח עבה במיוחד: להוסיף 15-20 דקות.',
    frozenNote: 'קפוא: להפשיר במקרר; טונה קפואה לסשימי עדיף לבשל לפחות במדיום.',
    options: [
      {
        id: 'tuna-rare',
        label: 'נא בפנים',
        temperatureC: 45,
        timeHours: 0.5,
        texture: 'אדום ולח במרכז, כמו סשימי חמים',
        recommended: true,
        whenToChoose: 'לסטייק טונה עם מרכז נא וצריבה חיצונית.',
        prep: ['מלח', 'מעט שמן', 'אפשר שומשום בציפוי'],
        finish: ['לייבש', 'צריבה מהירה מאוד 10-15 שניות לכל צד'],
        confidence: 'גבוהה',
        sources: [
          source('Serious Eats - Sous Vide Tuna', 'https://www.seriouseats.com/sous-vide-tuna-recipe'),
          baldwin
        ]
      },
      {
        id: 'tuna-medium',
        label: 'מדיום',
        temperatureC: 50,
        timeHours: 0.75,
        texture: 'ורוד ויותר אטום, יציב',
        whenToChoose: 'למי שלא אוהב מרכז נא.',
        prep: ['מלח', 'שמן'],
        finish: ['לייבש', 'צריבה מהירה'],
        confidence: 'בינונית',
        sources: [source('ChefSteps - Sous Vide Fish', 'https://www.chefsteps.com/activities/sous-vide-fish')]
      }
    ],
    recommendations: [
      {
        id: 'tuna-sesame',
        title: 'טונה בציפוי שומשום',
        summary: 'סטייק טונה עם מרכז נא וקראסט שומשום.',
        ingredients: ['טונה', 'מלח', 'שמן', 'שומשום', 'סויה'],
        steps: ['לתבל', 'לבשל קצר', 'לייבש', 'לגלגל בשומשום ולצרוב מהיר']
      }
    ]
  },
  {
    id: 'chuck-beef',
    name: 'כתף בקר',
    category: 'בקר',
    aliases: ['כתף בקר', 'צ׳אק', 'chuck', 'כתף', 'צאק'],
    availability: 'נתח עבודה זול ופופולרי בישראל, מצוין לבישול ארוך.',
    thickNote: 'נתח עבה מאוד: אפשר להאריך עד 36 שעות לרכות מלאה.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש לפני התיבול.',
    options: [
      {
        id: 'chuck-pulled',
        label: 'מתפרק',
        temperatureC: 74,
        timeHours: 24,
        texture: 'מתפרק בקלות, מתאים לפריסה ביד',
        recommended: true,
        whenToChoose: 'לבשר מתפרק לכריכים, טאקו או צלחת עם רוטב.',
        prep: ['מלח גס', 'פלפל שחור', 'שום'],
        finish: ['לפרק במזלג', 'אפשר לצרוב חלקים או לקרמל ברוטב'],
        confidence: 'גבוהה',
        sources: [
          source('Amazing Food Made Easy - Chuck Roast', 'https://www.amazingfoodmadeeasy.com/sous-vide-times-temperatures/how-to-sous-vide/beef'),
          baldwin
        ]
      },
      {
        id: 'chuck-steak',
        label: 'כמו סטייק',
        temperatureC: 56,
        timeHours: 24,
        texture: 'רך ובשרי, נחתך כמו סטייק',
        whenToChoose: 'כשרוצים נתח רך לפריסה ולא בשר מתפרק.',
        prep: ['מלח', 'פלפל'],
        finish: ['לייבש', 'צריבה חזקה'],
        confidence: 'בינונית',
        sources: [source('ChefSteps - Tough Cuts', 'https://www.chefsteps.com/activities/sous-vide-tough-cuts-of-beef')]
      }
    ],
    recommendations: [
      {
        id: 'chuck-pulled-rec',
        title: 'כתף בקר מתפרקת',
        summary: 'בישול ארוך ומדויק שהופך נתח זול לבשר עשיר.',
        ingredients: ['כתף בקר', 'מלח גס', 'פלפל', 'שום'],
        steps: ['לתבל', 'לבשל ארוך', 'לפרק', 'לקרמל ברוטב או לצרוב ולהגיש']
      }
    ]
  },
  {
    id: 'tri-tip',
    name: 'שייטל',
    category: 'בקר',
    aliases: ['שייטל', 'טרי-טיפ', 'tri-tip', 'שפיץ שייטל'],
    availability: 'נתח חסכוני וטעים, זמין בקצביות בישראל.',
    thickNote: 'נתח עבה: להוסיף שעה-שעתיים לרכות.',
    options: [
      {
        id: 'tri-tip-mr',
        label: 'מדיום רייר',
        temperatureC: 55,
        timeHours: 6,
        texture: 'ורוד, רך עם נגיסה נעימה',
        recommended: true,
        whenToChoose: 'לשייטל בסגנון סטייק עם צריבה חזקה.',
        prep: ['מלח גס', 'פלפל שחור', 'שום'],
        finish: ['לייבש היטב', 'לצרוב חזק ולחתוך נגד כיוון הסיבים'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Tri-Tip', 'https://recipes.anovaculinary.com/recipe/sous-vide-tri-tip'),
          baldwin
        ]
      },
      {
        id: 'tri-tip-medium',
        label: 'מדיום',
        temperatureC: 57,
        timeHours: 6,
        texture: 'מדיום, יציב מעט יותר',
        whenToChoose: 'למי שמעדיף פחות ורוד.',
        prep: ['מלח', 'פלפל'],
        finish: ['לייבש', 'צריבה חזקה'],
        confidence: 'בינונית',
        sources: [source('Serious Eats - Steak Guide', 'https://www.seriouseats.com/food-lab-complete-guide-to-sous-vide-steak')]
      }
    ],
    recommendations: [
      {
        id: 'tri-tip-rec',
        title: 'שייטל צרוב',
        summary: 'נתח חסכוני שיוצא רך ועסיסי עם סיום חזק.',
        ingredients: ['שייטל', 'מלח גס', 'פלפל', 'שום'],
        steps: ['לתבל', 'לבשל', 'לייבש', 'לצרוב חזק ולפרוס נגד הסיב']
      }
    ]
  },
  {
    id: 'duck-breast',
    name: 'חזה ברווז',
    category: 'ברווז',
    aliases: ['חזה ברווז', 'ברווז', 'magret', 'מגרה'],
    availability: 'זמין בישראל קפוא ולעיתים טרי, נתח עם שכבת שומן ועור.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש את העור היטב לפני הצריבה.',
    options: [
      {
        id: 'duck-breast-mr',
        label: 'מדיום רייר',
        temperatureC: 55,
        timeHours: 2,
        texture: 'ורוד, רך ועסיסי עם עור פריך',
        recommended: true,
        whenToChoose: 'הקלאסי לחזה ברווז עם עור פריך.',
        prep: ['מלח', 'פלפל', 'לחרוץ את העור ברשת'],
        finish: ['להתחיל מהעור במחבת קרה', 'לצרוב לאט עד שהעור פריך ומשחרר שומן'],
        confidence: 'גבוהה',
        sources: [
          source('Serious Eats - Sous Vide Duck Breast', 'https://www.seriouseats.com/sous-vide-duck-breast-recipe'),
          baldwin
        ]
      },
      {
        id: 'duck-breast-medium',
        label: 'מדיום',
        temperatureC: 58,
        timeHours: 1.5,
        texture: 'מדיום, יציב יותר',
        whenToChoose: 'למי שמעדיף פחות ורוד.',
        prep: ['מלח', 'פלפל', 'לחרוץ עור'],
        finish: ['לצרוב על העור עד פריך'],
        confidence: 'בינונית',
        sources: [source('Anova - Duck Breast', 'https://recipes.anovaculinary.com/recipe/sous-vide-duck-breast')]
      }
    ],
    recommendations: [
      {
        id: 'duck-breast-rec',
        title: 'חזה ברווז עם עור פריך',
        summary: 'בישול מדויק וסיום איטי על העור.',
        ingredients: ['חזה ברווז', 'מלח', 'פלפל'],
        steps: ['לחרוץ עור ולתבל', 'לבשל', 'לייבש', 'לצרוב לאט מצד העור ולפרוס']
      }
    ]
  },
  {
    id: 'scallops',
    name: 'סקאלופ',
    category: 'פירות ים',
    aliases: ['סקאלופ', 'סקלופ', 'scallops', 'צדפות סקאלופ'],
    availability: 'מיובא וקפוא ברובו בישראל (לא כשר), נתח עדין ויקר.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש היטב — לחות עודפת פוגעת בצריבה.',
    options: [
      {
        id: 'scallops-tender',
        label: 'רך וחמאתי',
        temperatureC: 50,
        timeHours: 0.5,
        texture: 'רך, חמאתי וקרמי',
        recommended: true,
        whenToChoose: 'לסקאלופ עדין עם קראסט זהוב חזק.',
        prep: ['מלח', 'מעט חמאה בשקית'],
        finish: ['לייבש מצוין', 'צריבה חזקה מאוד 30-45 שניות לכל צד לקראסט'],
        confidence: 'גבוהה',
        sources: [
          source('Serious Eats - Sous Vide Scallops', 'https://www.seriouseats.com/sous-vide-scallops-recipe'),
          source('ChefSteps - Scallops', 'https://www.chefsteps.com/activities/sous-vide-scallops')
        ]
      },
      {
        id: 'scallops-firm',
        label: 'יציב יותר',
        temperatureC: 52,
        timeHours: 0.5,
        texture: 'מעט יותר מוצק',
        whenToChoose: 'למי שמעדיף מרקם פחות קרמי.',
        prep: ['מלח'],
        finish: ['לייבש', 'צריבה חזקה וקצרה'],
        confidence: 'בינונית',
        sources: [source('Anova - Scallops', 'https://recipes.anovaculinary.com/recipe/sous-vide-scallops')]
      }
    ],
    recommendations: [
      {
        id: 'scallops-rec',
        title: 'סקאלופ בחמאה',
        summary: 'מרקם קרמי וקראסט זהוב — מנה חגיגית.',
        ingredients: ['סקאלופ', 'מלח', 'חמאה'],
        steps: ['לבשל קצר', 'לייבש מצוין', 'לצרוב חזק מאוד ולהגיש מיד']
      }
    ]
  },
  {
    id: 'calamari',
    name: 'קלמרי',
    category: 'פירות ים',
    aliases: ['קלמרי', 'דיונון', 'squid', 'calamari'],
    availability: 'זמין קפוא בישראל (לרוב לא כשר/מיובא).',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש לפני הבישול.',
    options: [
      {
        id: 'calamari-tender',
        label: 'רך',
        temperatureC: 57,
        timeHours: 4,
        texture: 'רך מאוד, בלי תחושת גומי',
        recommended: true,
        whenToChoose: 'כדי להפוך קלמרי קשה לרך באמת.',
        prep: ['מלח', 'שמן זית', 'שום'],
        finish: ['לייבש', 'צריבה מהירה מאוד או הגשה ישר'],
        confidence: 'בינונית',
        sources: [
          source('ChefSteps - Squid', 'https://www.chefsteps.com/activities/sous-vide-squid'),
          source('Anova - Calamari', 'https://recipes.anovaculinary.com/recipe/sous-vide-calamari')
        ]
      },
      {
        id: 'calamari-quick',
        label: 'מהיר',
        temperatureC: 60,
        timeHours: 2,
        texture: 'רך עם נגיסה',
        whenToChoose: 'כשאין זמן לבישול ארוך.',
        prep: ['מלח', 'שמן זית'],
        finish: ['צריבה מהירה'],
        confidence: 'בינונית',
        sources: [source('Amazing Food Made Easy - Squid', 'https://www.amazingfoodmadeeasy.com/sous-vide-times-temperatures/how-to-sous-vide/seafood')]
      }
    ],
    recommendations: [
      {
        id: 'calamari-rec',
        title: 'קלמרי רך',
        summary: 'בישול ארוך ועדין שמבטל את תחושת הגומי.',
        ingredients: ['קלמרי', 'מלח', 'שמן זית', 'שום', 'לימון'],
        steps: ['לתבל', 'לבשל ארוך בעדינות', 'לייבש', 'לצרוב מהיר ולהגיש עם לימון']
      }
    ]
  },
  {
    id: 'potato',
    name: 'תפוח אדמה',
    category: 'ירקות',
    aliases: ['תפוח אדמה', 'תפוחי אדמה', 'potato', 'קרטושקה'],
    availability: 'זמין מאוד וזול בישראל כל השנה.',
    options: [
      {
        id: 'potato-tender',
        label: 'רך ואחיד',
        temperatureC: 87,
        timeHours: 1.5,
        texture: 'רך לגמרי ואחיד, מצוין למחית או לצריבה',
        recommended: true,
        whenToChoose: 'לתפוח אדמה מבושל מושלם, אחיד מהקצה למרכז.',
        prep: ['מלח', 'שמן זית', 'אפשר חמאה ושום בשקית'],
        finish: ['למעוך למחית, או לצרוב/לטגן קצר לקראסט'],
        confidence: 'גבוהה',
        sources: [
          source('ChefSteps - Vegetables', 'https://www.chefsteps.com/activities/sous-vide-vegetables'),
          source('Serious Eats - Sous Vide Potatoes', 'https://www.seriouseats.com/sous-vide-potatoes-recipe')
        ]
      }
    ],
    recommendations: [
      {
        id: 'potato-rec',
        title: 'תפוחי אדמה חמאה ושום',
        summary: 'מרקם אחיד ומדויק, מצוין כתוספת לבשר.',
        ingredients: ['תפוח אדמה', 'מלח', 'חמאה', 'שום', 'טימין'],
        steps: ['לחתוך אחיד', 'לבשל', 'לצרוב או למעוך ולהגיש']
      }
    ]
  },
  {
    id: 'sweet-potato',
    name: 'בטטה',
    category: 'ירקות',
    aliases: ['בטטה', 'בטטות', 'sweet potato'],
    availability: 'זמינה מאוד בישראל.',
    options: [
      {
        id: 'sweet-potato-tender',
        label: 'רכה ומתוקה',
        temperatureC: 85,
        timeHours: 1.5,
        texture: 'רכה, חלקה ומתוקה',
        recommended: true,
        whenToChoose: 'לבטטה אחידה למחית או לתוספת.',
        prep: ['מלח', 'שמן זית', 'אפשר קינמון או דבש'],
        finish: ['למעוך, או לצרוב קצר לקרמול'],
        confidence: 'גבוהה',
        sources: [
          source('ChefSteps - Vegetables', 'https://www.chefsteps.com/activities/sous-vide-vegetables'),
          source('Anova - Sweet Potatoes', 'https://recipes.anovaculinary.com/recipe/sous-vide-sweet-potatoes')
        ]
      }
    ],
    recommendations: [
      {
        id: 'sweet-potato-rec',
        title: 'בטטה צרובה',
        summary: 'מתוקה וחלקה עם קרמול קל בסיום.',
        ingredients: ['בטטה', 'מלח', 'שמן זית', 'דבש'],
        steps: ['לחתוך אחיד', 'לבשל', 'לצרוב קצר ולהגיש']
      }
    ]
  },
  {
    id: 'carrot',
    name: 'גזר',
    category: 'ירקות',
    aliases: ['גזר', 'גזרים', 'carrot'],
    availability: 'זמין מאוד וזול בישראל.',
    options: [
      {
        id: 'carrot-tender',
        label: 'רך ומרוכז',
        temperatureC: 85,
        timeHours: 1,
        texture: 'רך עם מתיקות מרוכזת',
        recommended: true,
        whenToChoose: 'לגזר עם טעם עז וצבע חי.',
        prep: ['מלח', 'חמאה', 'מעט דבש או כמון'],
        finish: ['לקרמל קצר במחבת או להגיש ישר'],
        confidence: 'גבוהה',
        sources: [
          source('ChefSteps - Vegetables', 'https://www.chefsteps.com/activities/sous-vide-vegetables'),
          source('Serious Eats - Glazed Carrots', 'https://www.seriouseats.com/sous-vide-glazed-carrots-recipe')
        ]
      }
    ],
    recommendations: [
      {
        id: 'carrot-rec',
        title: 'גזר בחמאה ודבש',
        summary: 'מתיקות מרוכזת וצבע חי, תוספת מצוינת.',
        ingredients: ['גזר', 'מלח', 'חמאה', 'דבש', 'כמון'],
        steps: ['לחתוך אחיד', 'לבשל', 'לקרמל קצר ולהגיש']
      }
    ]
  },
  {
    id: 'beet',
    name: 'סלק',
    category: 'ירקות',
    aliases: ['סלק', 'סלקים', 'beet', 'beetroot'],
    availability: 'זמין מאוד בישראל.',
    options: [
      {
        id: 'beet-tender',
        label: 'רך וצבעוני',
        temperatureC: 85,
        timeHours: 2,
        texture: 'רך, עמוק וצבעוני',
        recommended: true,
        whenToChoose: 'לסלק לסלטים ולתוספות, בלי לאבד צבע וטעם.',
        prep: ['מלח', 'שמן זית', 'מעט חומץ או תפוז'],
        finish: ['לקלף ולחתוך', 'להגיש בסלט או חם'],
        confidence: 'גבוהה',
        sources: [
          source('ChefSteps - Vegetables', 'https://www.chefsteps.com/activities/sous-vide-vegetables'),
          source('Anova - Beets', 'https://recipes.anovaculinary.com/recipe/sous-vide-beets')
        ]
      }
    ],
    recommendations: [
      {
        id: 'beet-rec',
        title: 'סלק לסלט',
        summary: 'בישול מדויק ששומר צבע וטעם עמוק.',
        ingredients: ['סלק', 'מלח', 'שמן זית', 'חומץ', 'תפוז'],
        steps: ['לבשל שלם בשקית', 'לקלף', 'לחתוך ולתבל']
      }
    ]
  },
  {
    id: 'asparagus',
    name: 'אספרגוס',
    category: 'ירקות',
    aliases: ['אספרגוס', 'asparagus'],
    availability: 'זמין בישראל לפי עונה, טרי או קפוא.',
    options: [
      {
        id: 'asparagus-crisp',
        label: 'רך-פריך',
        temperatureC: 85,
        timeHours: 0.25,
        texture: 'רך עם נגיסה, צבע ירוק חי',
        recommended: true,
        whenToChoose: 'לאספרגוס מדויק שלא נהיה רך מדי.',
        prep: ['מלח', 'שמן זית', 'מעט לימון'],
        finish: ['צריבה קצרה או הגשה ישר'],
        confidence: 'גבוהה',
        sources: [
          source('ChefSteps - Vegetables', 'https://www.chefsteps.com/activities/sous-vide-vegetables'),
          source('Serious Eats - Sous Vide Asparagus', 'https://www.seriouseats.com/sous-vide-asparagus-recipe')
        ]
      }
    ],
    recommendations: [
      {
        id: 'asparagus-rec',
        title: 'אספרגוס לימון',
        summary: 'מרקם מדויק וצבע חי, תוספת אלגנטית.',
        ingredients: ['אספרגוס', 'מלח', 'שמן זית', 'לימון', 'פרמזן'],
        steps: ['לבשל קצר', 'לצרוב או להגיש ישר עם לימון']
      }
    ]
  },
  {
    id: 'corn',
    name: 'תירס',
    category: 'ירקות',
    aliases: ['תירס', 'קלח תירס', 'corn'],
    availability: 'זמין בישראל לפי עונה, טרי או קפוא.',
    options: [
      {
        id: 'corn-juicy',
        label: 'מתוק ועסיסי',
        temperatureC: 85,
        timeHours: 0.5,
        texture: 'מתוק, עסיסי ופריך',
        recommended: true,
        whenToChoose: 'לקלח תירס עסיסי עם חמאה.',
        prep: ['מלח', 'חמאה'],
        finish: ['לצרוב קצר על הגריל או להגיש עם חמאה'],
        confidence: 'גבוהה',
        sources: [
          source('ChefSteps - Vegetables', 'https://www.chefsteps.com/activities/sous-vide-vegetables'),
          source('Anova - Corn on the Cob', 'https://recipes.anovaculinary.com/recipe/sous-vide-corn-on-the-cob')
        ]
      }
    ],
    recommendations: [
      {
        id: 'corn-rec',
        title: 'תירס בחמאה',
        summary: 'עסיסי ומתוק, מצוין עם חמאה ומלח.',
        ingredients: ['תירס', 'מלח', 'חמאה'],
        steps: ['לבשל בשקית עם חמאה', 'לצרוב קצר ולהגיש']
      }
    ]
  },
  {
    id: 'beef-tongue',
    name: 'לשון בקר',
    category: 'בקר',
    aliases: ['לשון בקר', 'לשון', 'beef tongue', 'lengua'],
    availability: 'זמין אצל קצבים בישראל, לרוב שלם וקפוא או טרי בהזמנה.',
    thickNote: 'לשון עבה: אפשר להאריך עד 48 שעות לרכות מקסימלית.',
    frozenNote: 'קפוא: להפשיר במקרר לפני התיבול והסגירה.',
    options: [
      {
        id: 'beef-tongue-tender',
        label: 'נימוח',
        temperatureC: 70,
        timeHours: 24,
        texture: 'רך ונימוח, נחתך בקלות',
        recommended: true,
        whenToChoose: 'ללשון רכה לטאקו, כריכים או פריסה דקה עם צריבה.',
        prep: ['מלח', 'פלפל שחור', 'שום', 'אפשר עלה דפנה בשקית'],
        finish: ['לקלף את הקרום החיצוני בעודה חמה', 'לפרוס ולצרוב קצר במחבת'],
        confidence: 'גבוהה',
        sources: [
          source('Amazing Food Made Easy - Beef Tongue', 'https://www.amazingfoodmadeeasy.com/sous-vide-times-temperatures/how-to-sous-vide/tongue'),
          baldwin
        ]
      },
      {
        id: 'beef-tongue-soft',
        label: 'מתפרק',
        temperatureC: 75,
        timeHours: 24,
        texture: 'רך מאוד, כמעט מתפרק',
        whenToChoose: 'כשרוצים מרקם נימוח במיוחד למילוי.',
        prep: ['מלח', 'פלפל', 'שום'],
        finish: ['לקלף', 'לפרק או לפרוס ולקרמל קצר'],
        confidence: 'בינונית',
        sources: [source('Anova - Beef Tongue', 'https://recipes.anovaculinary.com/recipe/beef-tongue-21')]
      }
    ],
    recommendations: [
      {
        id: 'beef-tongue-rec',
        title: 'לשון בקר לטאקו',
        summary: 'בישול ארוך ומדויק, קילוף וסיום חזק במחבת.',
        ingredients: ['לשון בקר', 'מלח', 'פלפל', 'שום', 'כמון'],
        steps: ['לתבל', 'לבשל ארוך', 'לקלף בעודה חמה', 'לפרוס ולצרוב ולהגיש']
      }
    ]
  },
  {
    id: 'roast-beef',
    name: 'רוסטביף',
    category: 'בקר',
    aliases: ['רוסטביף', 'צלי בקר', 'eye of round', 'נתח צלי'],
    availability: 'נתח רזה לפריסה דקה, זמין בקצביות ובסופרים בישראל.',
    thickNote: 'נתח עבה: להאריך מעט; מתאים לבישול ארוך לרכות.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש לפני הצריבה.',
    options: [
      {
        id: 'roast-beef-sliceable',
        label: 'ורוד לפריסה',
        temperatureC: 56,
        timeHours: 18,
        texture: 'ורוד אחיד, רך ונפרס דק',
        recommended: true,
        whenToChoose: 'לרוסטביף קר לכריכים או חם כצלי, פרוס דק.',
        prep: ['מלח', 'פלפל שחור', 'שום', 'רוזמרין'],
        finish: ['לייבש היטב', 'צריבה חזקה וקצרה לכל הצדדים', 'לקרר מעט ולפרוס דק'],
        confidence: 'גבוהה',
        sources: [
          source('Amazing Food Made Easy - Beef Roasts', 'https://www.amazingfoodmadeeasy.com/sous-vide-times-temperatures/how-to-sous-vide/beef'),
          baldwin
        ]
      },
      {
        id: 'roast-beef-medium',
        label: 'מדיום',
        temperatureC: 60,
        timeHours: 18,
        texture: 'מדיום, יציב יותר',
        whenToChoose: 'למי שמעדיף נתח פחות ורוד.',
        prep: ['מלח', 'פלפל'],
        finish: ['לייבש', 'צריבה חזקה ולפרוס דק'],
        confidence: 'בינונית',
        sources: [source('Serious Eats - Sous Vide Steak Guide', 'https://www.seriouseats.com/food-lab-complete-guide-to-sous-vide-steak')]
      }
    ],
    recommendations: [
      {
        id: 'roast-beef-rec',
        title: 'רוסטביף ביתי לכריכים',
        summary: 'נתח רזה שיוצא ורוד ורך, מצוין פרוס דק קר או חם.',
        ingredients: ['רוסטביף', 'מלח', 'פלפל', 'שום', 'רוזמרין'],
        steps: ['לתבל', 'לבשל', 'לייבש', 'לצרוב חזק', 'לקרר ולפרוס דק']
      }
    ]
  },
  {
    id: 'chicken-wings',
    name: 'כנפי עוף',
    category: 'עוף',
    aliases: ['כנפי עוף', 'כנפיים', 'chicken wings', 'אגפיים'],
    availability: 'זמין מאוד וזול בישראל, טרי או קפוא.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש היטב לפני התיבול.',
    options: [
      {
        id: 'chicken-wings-crispy',
        label: 'עסיסי ופריך',
        temperatureC: 75,
        timeHours: 2,
        texture: 'עסיסי בפנים, מוכן לטיגון/צלייה לעור פריך',
        recommended: true,
        whenToChoose: 'לכנפיים עסיסיות עם עור פריך אחרי טיגון או תנור חזק.',
        prep: ['מלח', 'פלפל', 'פפריקה ושום'],
        finish: ['לייבש היטב', 'לטגן עמוק או לצלות בתנור חזק/מחבת עד עור פריך', 'לערבב ברוטב בסוף'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Buffalo Chicken Wings', 'https://recipes.anovaculinary.com/recipe/sous-vide-buffalo-chicken-wings-1'),
          baldwin
        ]
      }
    ],
    recommendations: [
      {
        id: 'chicken-wings-rec',
        title: 'כנפיים פריכות ברוטב',
        summary: 'בישול מדויק וסיום חזק לעור פריך, ואז גלגול ברוטב.',
        ingredients: ['כנפי עוף', 'מלח', 'פפריקה', 'שום', 'רוטב באפלו או דבש-סויה'],
        steps: ['לתבל', 'לבשל', 'לייבש היטב', 'לטגן/לצלות עד פריך', 'לגלגל ברוטב ולהגיש']
      }
    ]
  },
  {
    id: 'tilapia',
    name: 'אמנון',
    category: 'דגים',
    aliases: ['אמנון', 'מושט', 'אמנון מצוי', 'דג סנט פטר', 'tilapia'],
    availability: 'דג מים מתוקים נפוץ וזול בישראל, זמין טרי וכפילה.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש בעדינות לפני השקית.',
    options: [
      {
        id: 'tilapia-tender',
        label: 'עדין',
        temperatureC: 54,
        timeHours: 0.5,
        texture: 'לח, רך ומתפורר בעדינות',
        recommended: true,
        whenToChoose: 'לפילה אמנון עדין עם סיום קצר במחבת.',
        prep: ['מלח', 'שמן זית', 'לימון', 'אפשר שום'],
        finish: ['לייבש בעדינות', 'צריבה קצרה מאוד או הגשה ישר'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Sous Vide Fish', 'https://recipes.anovaculinary.com/recipe/sous-vide-fish'),
          baldwin
        ]
      }
    ],
    recommendations: [
      {
        id: 'tilapia-rec',
        title: 'אמנון לימון ושום',
        summary: 'דג מים מתוקים נקי ועדין, מצוין עם לימון.',
        ingredients: ['אמנון', 'מלח', 'שמן זית', 'לימון', 'שום'],
        steps: ['לתבל', 'לבשל קצר', 'לייבש', 'לצרוב קצר ולהגיש עם לימון']
      }
    ]
  },
  {
    id: 'cod',
    name: 'בקלה',
    category: 'דגים',
    aliases: ['בקלה', 'קוד', 'cod', 'מורן'],
    availability: 'זמין בישראל בעיקר קפוא וכפילה בחנויות דגים.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש בעדינות; לחות עודפת פוגעת בצריבה.',
    options: [
      {
        id: 'cod-flaky',
        label: 'פתיתי וחמאתי',
        temperatureC: 55,
        timeHours: 0.5,
        texture: 'פתיתים גדולים, לח וחמאתי',
        recommended: true,
        whenToChoose: 'לבקלה רך עם פתיתים יפים וסיום קצר.',
        prep: ['מלח', 'שמן זית או חמאה', 'לימון'],
        finish: ['לייבש בעדינות', 'צריבה קצרה מאוד על צד אחד'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Sous Vide Lemon Cod', 'https://recipes.anovaculinary.com/recipe/sous-vide-lemon-cod'),
          baldwin
        ]
      },
      {
        id: 'cod-firm',
        label: 'יציב יותר',
        temperatureC: 58,
        timeHours: 0.5,
        texture: 'פתיתים יציבים מעט יותר',
        whenToChoose: 'למי שמעדיף מרקם דג מבושל יותר.',
        prep: ['מלח', 'שמן זית'],
        finish: ['לייבש', 'צריבה קצרה'],
        confidence: 'בינונית',
        sources: [source('ChefSteps - Sous Vide Fish', 'https://www.chefsteps.com/activities/sous-vide-fish')]
      }
    ],
    recommendations: [
      {
        id: 'cod-rec',
        title: 'בקלה בחמאת לימון',
        summary: 'פתיתים גדולים ולחים עם חמאה ולימון.',
        ingredients: ['בקלה', 'מלח', 'חמאה', 'לימון', 'פטרוזיליה'],
        steps: ['לתבל', 'לבשל קצר', 'לייבש בעדינות', 'לצרוב קצר ולהגיש']
      }
    ]
  },
  {
    id: 'trout',
    name: 'פורל',
    category: 'דגים',
    aliases: ['פורל', 'טרוטה', 'trout', 'אלת המים'],
    availability: 'דג מים מתוקים זמין בישראל טרי וכפילה.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש בעדינות לפני השקית.',
    options: [
      {
        id: 'trout-delicate',
        label: 'עדין',
        temperatureC: 51,
        timeHours: 0.5,
        texture: 'עדין מאוד, לח ומתפורר בעדינות',
        recommended: true,
        whenToChoose: 'לפילה פורל עדין עם חמאה ושקדים.',
        prep: ['מלח', 'שמן זית או חמאה', 'לימון'],
        finish: ['לייבש בעדינות', 'צריבה קצרה מאוד על צד העור'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Sous Vide Ruby Trout', 'https://recipes.anovaculinary.com/recipe/sous-vide-ruby-trout'),
          baldwin
        ]
      }
    ],
    recommendations: [
      {
        id: 'trout-rec',
        title: 'פורל אלמונדין',
        summary: 'דג עדין עם חמאה חומה ושקדים קלויים.',
        ingredients: ['פורל', 'מלח', 'חמאה', 'שקדים פרוסים', 'פטרוזיליה'],
        steps: ['לתבל', 'לבשל קצר', 'להכין חמאה חומה עם שקדים', 'להגיש מעל הדג']
      }
    ]
  },
  {
    id: 'octopus',
    name: 'תמנון',
    category: 'פירות ים',
    aliases: ['תמנון', 'אוקטופוס', 'octopus'],
    availability: 'מיובא וקפוא ברובו בישראל (לא כשר), זמין בחנויות דגים ופירות ים.',
    frozenNote: 'קפוא: להפשיר במקרר; הקיפאון אף עוזר לריכוך הסיבים.',
    options: [
      {
        id: 'octopus-tender',
        label: 'רך נימוח',
        temperatureC: 77,
        timeHours: 5,
        texture: 'רך ונימוח, בלי תחושת גומי',
        recommended: true,
        whenToChoose: 'לתמנון רך באמת עם צריבה/גריל חזק בסיום.',
        prep: ['מלח', 'שמן זית', 'שום', 'אפשר עלה דפנה'],
        finish: ['לייבש היטב', 'לצרוב חזק במחבת או על הגריל עד שמשחים', 'להגיש עם לימון ושמן זית'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Sous Vide Octopus Guide', 'https://anovaculinary.com/blogs/blog/sous-vide-octopus'),
          source('Anova - Tender Octopus', 'https://recipes.anovaculinary.com/recipe/sous-vide-tender-octopus-in-mole-sauce')
        ]
      },
      {
        id: 'octopus-firm',
        label: 'נגיסה יציבה',
        temperatureC: 82,
        timeHours: 4,
        texture: 'רך עם נגיסה מעט יותר יציבה',
        whenToChoose: 'למי שאוהב מרקם תמנון מעט מוצק יותר.',
        prep: ['מלח', 'שמן זית', 'שום'],
        finish: ['לייבש', 'לצרוב חזק על הגריל'],
        confidence: 'בינונית',
        sources: [source('Anova - Grilled Octopus', 'https://recipes.anovaculinary.com/recipe/sous-vide-tender-octopus-in-mole-sauce')]
      }
    ],
    recommendations: [
      {
        id: 'octopus-rec',
        title: 'תמנון צרוב על הגריל',
        summary: 'בישול ארוך לרכות, וסיום חזק על הגריל עם לימון ושמן זית.',
        ingredients: ['תמנון', 'מלח', 'שמן זית', 'שום', 'לימון', 'פפריקה'],
        steps: ['לבשל ארוך לרכות', 'לייבש היטב', 'לצרוב חזק על הגריל', 'להגיש עם לימון ושמן זית']
      }
    ]
  },
  {
    id: 'lobster',
    name: 'לובסטר',
    category: 'פירות ים',
    aliases: ['לובסטר', 'לובסטר זנב', 'lobster', 'סרטן ים'],
    availability: 'מיובא וקפוא ברובו בישראל (לא כשר), זנבות זמינים בחנויות מתמחות.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש לפני הסגירה עם חמאה.',
    options: [
      {
        id: 'lobster-butter',
        label: 'חמאתי ורך',
        temperatureC: 56,
        timeHours: 0.75,
        texture: 'רך, עסיסי וחמאתי',
        recommended: true,
        whenToChoose: 'לזנב לובסטר נימוח שטעון בחמאה, לא גומי.',
        prep: ['להוציא מהקליפה', 'מלח', 'חמאה ועלי טרגון או שום בשקית'],
        finish: ['להגיש עם חמאת השקית', 'אפשר צריבה קצרה מאוד וקישוט בלימון'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Butter-Tarragon Lobster Tail', 'https://recipes.anovaculinary.com/recipe/sous-vide-butter-tarragon-lobster-tail'),
          source('Anova - The Food Lab Lobster Guide', 'https://anovaculinary.com/blogs/blog/sous-vide-lobster-guide')
        ]
      }
    ],
    recommendations: [
      {
        id: 'lobster-rec',
        title: 'זנב לובסטר בחמאת טרגון',
        summary: 'מנה חגיגית — לובסטר נימוח בחמאה ארומטית.',
        ingredients: ['זנב לובסטר', 'חמאה', 'טרגון', 'מלח', 'לימון'],
        steps: ['להוציא מהקליפה', 'לבשל עם חמאה וטרגון', 'להגיש עם חמאת השקית ולימון']
      }
    ]
  },
  {
    id: 'pork-tenderloin',
    name: 'פילה חזיר',
    category: 'חזיר',
    aliases: ['פילה חזיר', 'פילה מדומה', 'pork tenderloin', 'מותן חזיר'],
    availability: 'זמין בחנויות לא כשרות ובחלק מהקצביות המתמחות בישראל.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש לפני הצריבה.',
    thickNote: 'נתח עבה: להוסיף 20-30 דקות.',
    options: [
      {
        id: 'pork-tenderloin-juicy',
        label: 'עסיסי וורדרד',
        temperatureC: 59,
        timeHours: 1.5,
        texture: 'עסיסי, רך וורדרד קלות',
        recommended: true,
        whenToChoose: 'הקלאסי לפילה חזיר רך שלא יוצא יבש.',
        prep: ['מלח', 'פלפל', 'שום', 'טימין או מרווה'],
        finish: ['לייבש היטב', 'צריבה קצרה וחזקה לכל הצדדים'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Lime and Garlic Pork Tenderloin', 'https://recipes.anovaculinary.com/recipe/sous-vide-lime-and-garlic-pork-tenderloin'),
          baldwin
        ]
      },
      {
        id: 'pork-tenderloin-firm',
        label: 'יציב יותר',
        temperatureC: 62,
        timeHours: 1.5,
        texture: 'מעט יותר עשוי ויציב',
        whenToChoose: 'למי שמעדיף נתח פחות ורדרד.',
        prep: ['מלח', 'פלפל'],
        finish: ['לייבש', 'צריבה קצרה וחזקה'],
        confidence: 'גבוהה',
        sources: [source('Amazing Food Made Easy - Pork', 'https://www.amazingfoodmadeeasy.com/sous-vide-times-temperatures/how-to-sous-vide/pork')]
      }
    ],
    recommendations: [
      {
        id: 'pork-tenderloin-rec',
        title: 'פילה חזיר שום וטימין',
        summary: 'נתח רזה ורך שיוצא עסיסי עם סיום חזק.',
        ingredients: ['פילה חזיר', 'מלח', 'פלפל', 'שום', 'טימין'],
        steps: ['לתבל', 'לבשל', 'לייבש', 'לצרוב קצר ולפרוס']
      }
    ]
  },
  {
    id: 'pork-shoulder',
    name: 'כתף חזיר',
    category: 'חזיר',
    aliases: ['כתף חזיר', 'פולד פורק', 'pulled pork', 'pork shoulder', 'בוסטון בט'],
    availability: 'זמין בחנויות לא כשרות ובקצביות מתמחות בישראל, לרוב נתח גדול.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש לפני התיבול.',
    options: [
      {
        id: 'pork-shoulder-pulled',
        label: 'מתפרק',
        temperatureC: 74,
        timeHours: 20,
        texture: 'מתפרק בקלות לחוטים עסיסיים',
        recommended: true,
        whenToChoose: 'לפולד פורק לכריכים, טאקו או צלחת עם רוטב BBQ.',
        prep: ['מלח גס', 'פפריקה מעושנת', 'פלפל שחור', 'מעט סוכר חום'],
        finish: ['לפרק במזלגות', 'לערבב עם נוזלי השקית ורוטב BBQ', 'אפשר לקרמל קצר בתנור'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - BBQ Pork Shoulder', 'https://recipes.anovaculinary.com/recipe/sous-vide-bbq-pork-shoulder'),
          baldwin
        ]
      },
      {
        id: 'pork-shoulder-sliceable',
        label: 'פריס',
        temperatureC: 68,
        timeHours: 24,
        texture: 'רך וניתן לפריסה',
        whenToChoose: 'כשרוצים נתח פרוס ולא מפורק.',
        prep: ['מלח', 'פלפל', 'פפריקה'],
        finish: ['לייבש', 'צריבה או גריל קצר ולפרוס'],
        confidence: 'בינונית',
        sources: [source('Amazing Food Made Easy - Pork', 'https://www.amazingfoodmadeeasy.com/sous-vide-times-temperatures/how-to-sous-vide/pork')]
      }
    ],
    recommendations: [
      {
        id: 'pork-shoulder-rec',
        title: 'פולד פורק בסגנון BBQ',
        summary: 'בישול ארוך ומדויק שהופך נתח קשוח לבשר מתפרק עשיר.',
        ingredients: ['כתף חזיר', 'מלח גס', 'פפריקה מעושנת', 'פלפל', 'רוטב BBQ'],
        steps: ['לתבל יבש', 'לבשל ארוך', 'לפרק', 'לערבב עם רוטב ולהגיש']
      }
    ]
  },
  {
    id: 'lamb-shank',
    name: 'שוק טלה',
    category: 'טלה',
    aliases: ['שוק טלה', 'אוסובוקו טלה', 'lamb shank', 'שוקיים טלה'],
    availability: 'זמין אצל קצבים בישראל, לרוב טרי ולעיתים בהזמנה.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש לפני הצריבה.',
    options: [
      {
        id: 'lamb-shank-tender',
        label: 'נופל מהעצם',
        temperatureC: 68,
        timeHours: 24,
        texture: 'רך מאוד, נופל מהעצם',
        recommended: true,
        whenToChoose: 'לשוק טלה בסגנון תבשיל ארוך עם רוטב עשיר.',
        prep: ['מלח', 'פלפל שחור', 'שום', 'רוזמרין'],
        finish: ['לצרוב קצר', 'לצמצם את נוזלי השקית לרוטב ולצקת מעל'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Sous Vide Lamb Shank', 'https://recipes.anovaculinary.com/recipe/sous-vide-lamb-shank'),
          baldwin
        ]
      },
      {
        id: 'lamb-shank-firm',
        label: 'רך עם נגיסה',
        temperatureC: 64,
        timeHours: 24,
        texture: 'רך אך מחזיק צורה',
        whenToChoose: 'למי שמעדיף נתח שלם שמחזיק על העצם.',
        prep: ['מלח', 'פלפל', 'שום'],
        finish: ['לצרוב קצר', 'לצקת רוטב מצומצם'],
        confidence: 'בינונית',
        sources: [source('Amazing Food Made Easy - Lamb', 'https://www.amazingfoodmadeeasy.com/sous-vide-times-temperatures/how-to-sous-vide/lamb')]
      }
    ],
    recommendations: [
      {
        id: 'lamb-shank-rec',
        title: 'שוק טלה ברוזמרין ויין',
        summary: 'בישול ארוך ועדין עם רוטב עשיר מנוזלי השקית.',
        ingredients: ['שוק טלה', 'מלח', 'פלפל', 'שום', 'רוזמרין', 'יין אדום'],
        steps: ['לתבל', 'לבשל ארוך', 'לצמצם רוטב', 'לצרוב ולהגיש עם הרוטב']
      }
    ]
  },
  {
    id: 'lamb-shoulder',
    name: 'כתף טלה',
    category: 'טלה',
    aliases: ['כתף טלה', 'צלי טלה', 'lamb shoulder', 'כתף כבש'],
    availability: 'זמין אצל קצבים בישראל, מצוין לבישול ארוך.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש לפני התיבול.',
    options: [
      {
        id: 'lamb-shoulder-pulled',
        label: 'מתפרק',
        temperatureC: 70,
        timeHours: 24,
        texture: 'רך ומתפרק, עשיר בטעם',
        recommended: true,
        whenToChoose: 'לכתף טלה מתפרקת לפיתות, אורז או צלחת חג.',
        prep: ['מלח גס', 'פלפל שחור', 'שום', 'כמון', 'רוזמרין'],
        finish: ['לפרק', 'לקרמל קצר בתנור חזק או לצרוב'],
        confidence: 'גבוהה',
        sources: [
          source('Anova - Sous Vide Lamb Shoulder', 'https://recipes.anovaculinary.com/recipe/sous-vide-lamb-shoulder-2'),
          baldwin
        ]
      },
      {
        id: 'lamb-shoulder-sliceable',
        label: 'פריס',
        temperatureC: 65,
        timeHours: 24,
        texture: 'רך וניתן לפריסה',
        whenToChoose: 'כשרוצים נתח פרוס ולא מפורק.',
        prep: ['מלח', 'פלפל', 'שום'],
        finish: ['לייבש', 'צריבה חזקה ולפרוס'],
        confidence: 'בינונית',
        sources: [source('Amazing Food Made Easy - Lamb', 'https://www.amazingfoodmadeeasy.com/sous-vide-times-temperatures/how-to-sous-vide/lamb')]
      }
    ],
    recommendations: [
      {
        id: 'lamb-shoulder-rec',
        title: 'כתף טלה מתפרקת',
        summary: 'תיבול מזרחי, בישול ארוך וסיום מקרמל.',
        ingredients: ['כתף טלה', 'מלח גס', 'כמון', 'פלפל', 'שום', 'רוזמרין'],
        steps: ['לתבל', 'לבשל ארוך', 'לפרק', 'לקרמל ולהגיש']
      }
    ]
  },
  {
    id: 'cauliflower',
    name: 'כרובית',
    category: 'ירקות',
    aliases: ['כרובית', 'cauliflower', 'כרוביות'],
    availability: 'זמינה מאוד בישראל כל השנה.',
    options: [
      {
        id: 'cauliflower-tender',
        label: 'רכה ואחידה',
        temperatureC: 85,
        timeHours: 1,
        texture: 'רכה ואחידה, עם טעם מתקתק',
        recommended: true,
        whenToChoose: 'לכרובית לתוספת, למחית או לצריבה לקראמל.',
        prep: ['מלח', 'שמן זית', 'אפשר חמאה ושום בשקית'],
        finish: ['לצרוב במחבת או בתנור חזק לקראמל, או למעוך למחית'],
        confidence: 'גבוהה',
        sources: [
          source('ChefSteps - Vegetables', 'https://www.chefsteps.com/activities/sous-vide-vegetables'),
          source('Anova - Cauliflower', 'https://anovaculinary.com/blogs/blog/sous-vide-cauliflower-mashed-potatoes')
        ]
      }
    ],
    recommendations: [
      {
        id: 'cauliflower-rec',
        title: 'כרובית צרובה בחמאה ושום',
        summary: 'מרקם אחיד ומדויק עם קראמל וטעם עשיר.',
        ingredients: ['כרובית', 'מלח', 'חמאה', 'שום', 'שמן זית'],
        steps: ['לחתוך לפרחים אחידים', 'לבשל', 'לצרוב לקראמל ולהגיש']
      }
    ]
  },
  {
    id: 'beef-neck',
    name: 'צוואר בקר',
    category: 'בקר',
    aliases: ['צוואר', 'בשר צוואר', 'צוואר בקר', 'beef neck'],
    availability: 'נתח עבודה זול ועשיר בטעם, זמין אצל קצבים בישראל, לרוב לתבשילים.',
    thickNote: 'נתח עבה מאוד: אפשר להאריך עד 48 שעות לרכות מלאה.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש לפני התיבול.',
    options: [
      {
        id: 'beef-neck-tender',
        label: 'מומלץ',
        temperatureC: 68,
        timeHours: 36,
        texture: 'רך ועסיסי, נפרס יפה',
        recommended: true,
        whenToChoose: 'צוואר עשיר בקולגן — טמפרטורה מתונה וזמן ארוך הופכים אותו לרך ועסיסי בלי לייבש.',
        prep: ['מלח גס', 'פלפל שחור', 'שום', 'אפשר פפריקה מעושנת'],
        finish: ['לייבש היטב', 'לצרוב חזק במחבת או לקרמל ברוטב'],
        confidence: 'גבוהה',
        sources: [
          source('Amazing Food Made Easy - Beef', 'https://www.amazingfoodmadeeasy.com/sous-vide-times-temperatures/how-to-sous-vide/beef'),
          baldwin
        ]
      },
      {
        id: 'beef-neck-pulled',
        label: 'מתפרק',
        temperatureC: 74,
        timeHours: 24,
        texture: 'מתפרק בקלות, מתאים לתבשיל או מילוי',
        whenToChoose: 'כשרוצים בשר מתפרק לחמין, טאקו או צלחת עם רוטב.',
        prep: ['מלח', 'פלפל', 'שום', 'כמון אם אוהבים'],
        finish: ['לפרק במזלג', 'לערבב עם נוזלי השקית או רוטב ולחמם קצר'],
        confidence: 'בינונית',
        sources: [source('ChefSteps - Tough Cuts', 'https://www.chefsteps.com/activities/sous-vide-tough-cuts-of-beef')]
      }
    ],
    recommendations: [
      {
        id: 'beef-neck-rec',
        title: 'צוואר בקר בסגנון תבשיל',
        summary: 'נתח זול שיוצא עשיר ורך, עם רוטב מנוזלי השקית.',
        ingredients: ['צוואר בקר', 'מלח גס', 'פלפל', 'שום', 'פפריקה מעושנת'],
        steps: ['לתבל', 'לבשל ארוך', 'לצמצם את נוזלי השקית לרוטב', 'לצרוב או לפרק ולהגיש עם הרוטב']
      }
    ]
  },
  {
    id: 'beef-shin',
    name: 'שריר בקר',
    category: 'בקר',
    aliases: ['שריר', 'שריר בקר', 'שריר הזרוע', 'אוסובוקו', 'osso buco'],
    availability: 'נתח עבודה קלאסי לתבשילים, זמין אצל קצבים בישראל, לרוב פרוס עם עצם (אוסובוקו).',
    thickNote: 'פרוסות עבות עם עצם: אפשר להאריך עד 72 שעות לרכות מקסימלית.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש לפני התיבול.',
    options: [
      {
        id: 'beef-shin-tender',
        label: 'נימוח ועסיסי',
        temperatureC: 62,
        timeHours: 48,
        texture: 'נימוח, עסיסי ומלא ג׳לטין',
        recommended: true,
        whenToChoose: 'שריר מלא רקמות חיבור — בישול ארוך בטמפרטורה מתונה נותן אוסובוקו נימוח שלא יבש. דורש סבלנות של יומיים.',
        prep: ['מלח', 'פלפל שחור', 'שום', 'אפשר עלה דפנה בשקית'],
        finish: ['לייבש', 'לצרוב קצר', 'לצמצם את נוזלי השקית לרוטב עשיר'],
        confidence: 'בינונית',
        sources: [
          source('Summer Yule - Sous Vide Osso Buco', 'https://summeryule.com/osso-buco-sous-vide/'),
          source("Stefan's Gourmet - Ossobuco Time/Temp Experiment", 'https://stefangourmet.com/2022/12/18/ossobuco-sous-vide-time-and-temperature-experiment/')
        ]
      },
      {
        id: 'beef-shin-braise',
        label: 'מתפרק לתבשיל',
        temperatureC: 79,
        timeHours: 24,
        texture: 'מתפרק, כמו תבשיל ארוך קלאסי',
        whenToChoose: 'כשרוצים תוצאה של תבשיל תוך יממה, למשל לאוסובוקו ברוטב עגבניות.',
        prep: ['מלח', 'פלפל', 'שום'],
        finish: ['לחמם ברוטב תבשיל ולהגיש על העצם'],
        confidence: 'בינונית',
        sources: [source('Anova - Sous Vide Osso Buco', 'https://recipes.anovaculinary.com/recipe/sous-vide-osso-buco')]
      }
    ],
    recommendations: [
      {
        id: 'beef-shin-rec',
        title: 'אוסובוקו ברוטב יין ועגבניות',
        summary: 'בישול ארוך ומדויק, ואז רוטב עשיר מנוזלי השקית.',
        ingredients: ['שריר בקר', 'מלח', 'פלפל', 'שום', 'רסק עגבניות', 'יין אדום'],
        steps: ['לתבל', 'לבשל ארוך', 'לצמצם רוטב עם נוזלי השקית', 'לחמם ברוטב ולהגיש']
      }
    ]
  },
  {
    id: 'goose-breast',
    name: 'חזה אווז',
    category: 'אווז',
    aliases: ['חזה אווז', 'אווז', 'goose', 'goose breast'],
    availability: 'נתח פופולרי במסעדות בשרים בישראל, זמין אצל קצבים לרוב קפוא, עם שכבת שומן ועור.',
    frozenNote: 'קפוא: להפשיר במקרר ולייבש את העור היטב לפני הצריבה.',
    thickNote: 'חזה עבה במיוחד: להוסיף 30-45 דקות.',
    options: [
      {
        id: 'goose-breast-mr',
        label: 'ורוד ועסיסי',
        temperatureC: 55,
        timeHours: 2.5,
        texture: 'ורוד, עסיסי ורך עם עור פריך',
        recommended: true,
        whenToChoose: 'חזה אווז מתנהג כמו סטייק — ורוד ועסיסי עם עור מקורמל, לא אפור וקשה.',
        prep: ['לחרוץ את שכבת השומן ברשת', 'מלח', 'פלפל'],
        finish: ['להתחיל מצד העור במחבת קרה', 'לצרוב לאט עד שהעור פריך ומשחרר שומן', 'לפרוס נגד הסיבים'],
        confidence: 'בינונית',
        sources: [
          source('Anova - Orange Goose Sous Vide', 'https://recipes.anovaculinary.com/recipe/orange-goose-sous-vide'),
          source('Sousvideer - Goose Breast', 'https://www.sousvideer.com/post/goose-breast-juicy-rich-flavor')
        ]
      },
      {
        id: 'goose-breast-medium',
        label: 'מדיום',
        temperatureC: 58,
        timeHours: 2,
        texture: 'מדיום, יציב יותר',
        whenToChoose: 'למי שמעדיף פחות ורוד.',
        prep: ['לחרוץ עור', 'מלח', 'פלפל'],
        finish: ['לצרוב לאט על העור עד פריך'],
        confidence: 'בינונית',
        sources: [source('Sousvideer - Goose Breast', 'https://www.sousvideer.com/post/goose-breast-juicy-rich-flavor')]
      }
    ],
    recommendations: [
      {
        id: 'goose-breast-rec',
        title: 'חזה אווז עם עור פריך',
        summary: 'בישול מדויק וסיום איטי על העור, כמו במסעדות בשרים.',
        ingredients: ['חזה אווז', 'מלח', 'פלפל'],
        steps: ['לחרוץ עור ולתבל', 'לבשל', 'לייבש', 'לצרוב לאט מצד העור ולפרוס']
      }
    ]
  }
];

export const clarificationGroups: ClarificationGroup[] = [
  {
    query: 'צלעות',
    question: 'איזה סוג צלעות יש לך?',
    ingredientIds: ['asado', 'lamb-ribs', 'pork-ribs']
  },
  {
    query: 'סטייק',
    question: 'איזה סטייק יש לך?',
    ingredientIds: ['ribeye', 'sinta', 'picanha', 'beef-fillet']
  }
];
