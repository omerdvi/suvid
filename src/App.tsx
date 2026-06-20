import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  adminListSuggestions,
  adminSetSuggestionStatus,
  getIngredient,
  getRatingSummaries,
  listCatalog,
  loadCommunity,
  searchIngredients,
  submitRating,
  submitSuggestion
} from './api';
import { PRIMARY_CATEGORIES } from './domain/catalog';
import {
  assessSafety,
  recommendedCookHours,
  referenceThicknessCm,
  searGuide,
  type SafetyAssessment
} from './domain/cooking';
import { calculateStartTime } from './domain/schedule';
import type {
  CatalogResponse,
  Ingredient,
  RatingSummary,
  ReviewStatus,
  SearchResult,
  SousVideOption,
  StoredSuggestion
} from './domain/types';

const statusLabels: Record<ReviewStatus, string> = {
  pending_review: 'ממתין',
  approved: 'אושר',
  rejected: 'נדחה'
};

const examples = ['אסאדו', 'חזה עוף', 'סלמון', 'ביצים', 'טופו', 'שרימפס'];

const targetDateForTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target;
};

const padTime = (value: number) => value.toString().padStart(2, '0');
const hours = Array.from({ length: 24 }, (_, index) => padTime(index));
const minutes = Array.from({ length: 12 }, (_, index) => padTime(index * 5));

const formatHours = (value: number) => {
  if (value < 1) return `${Math.round(value * 60)} דק׳`;
  const whole = Number.isInteger(value) ? `${value}` : value.toFixed(value % 1 === 0.5 ? 1 : 2);
  return `${whole} שעות`;
};

function TimePicker24({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [selectedHour, selectedMinute] = value ? value.split(':') : ['20', '00'];

  const changeHour = (hour: string) => {
    onChange(`${hour}:${selectedMinute}`);
  };

  const changeMinute = (minute: string) => {
    onChange(`${selectedHour}:${minute}`);
  };

  return (
    <div className="time-picker">
      <span className="time-label">שעת הגשה</span>
      <div className="compact-time-row">
        <label>
          שעה
          <select value={selectedHour} aria-label="שעה" onChange={(event) => changeHour(event.target.value)}>
            {hours.map((hour) => (
              <option value={hour} key={hour}>
                {hour}
              </option>
            ))}
          </select>
        </label>
        <span className="time-separator">:</span>
        <label>
          דקות
          <select value={selectedMinute} aria-label="דקות" onChange={(event) => changeMinute(event.target.value)}>
            {minutes.map((minute) => (
              <option value={minute} key={minute}>
                {minute}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="selected-time-text">שעת הגשה: {value || `${selectedHour}:${selectedMinute}`}</p>
    </div>
  );
}

const safetyToneClass: Record<SafetyAssessment['level'], string> = {
  pasteurized: 'safety-good',
  cooked: 'safety-good',
  immediate: 'safety-warn',
  raw: 'safety-warn'
};

function OptionPanel({
  option,
  summary,
  cookHours,
  thicknessCm,
  safety,
  searTip
}: {
  option: SousVideOption;
  summary?: RatingSummary;
  cookHours: number;
  thicknessCm: number;
  safety: SafetyAssessment;
  searTip: string;
}) {
  const adjusted = Math.abs(cookHours - option.timeHours) >= 0.05;
  return (
    <article className={option.recommended ? 'option-card recommended' : 'option-card'}>
      <div className="option-topline">
        <p className="texture">{option.texture}</p>
        <span className={option.community ? 'confidence community-tag' : 'confidence'}>
          {option.community ? 'מהקהילה' : `ביטחון ${option.confidence}`}
        </span>
      </div>

      <div className="metrics">
        <div className="stat">
          <strong>{option.temperatureC}°C</strong>
          <span>טמפרטורה</span>
        </div>
        <div className="stat">
          <strong>{formatHours(cookHours)}</strong>
          <span>זמן בישול · {thicknessCm} ס״מ</span>
        </div>
      </div>

      {adjusted && (
        <p className="time-note">
          מותאם לעובי {thicknessCm} ס״מ (זמן בסיס: {formatHours(option.timeHours)}).
        </p>
      )}

      <div className={`safety ${safetyToneClass[safety.level]}`}>
        <span className="safety-label">{safety.level === 'immediate' || safety.level === 'raw' ? '⚠️' : '✓'} {safety.label}</span>
        <span className="safety-note">{safety.note}</span>
      </div>

      {summary && (
        <div className="rating-block">
          <p className="rating-summary">
            ★ {summary.averageStars.toFixed(1)} · דירוג משתמשים: {summary.count} דירוגים
          </p>
          {summary.insight && <p className="rating-insight">💡 {summary.insight}</p>}
        </div>
      )}

      <p className="when">{option.whenToChoose}</p>

      <div className="detail-grid">
        <section className="detail-block">
          <h3>הכנה לפני שקית</h3>
          <ul>
            {option.prep.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="detail-block">
          <h3>סיום אחרי סו־ויד</h3>
          <ul>
            {option.finish.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="sear-tip">{searTip}</p>
        </section>
      </div>

      {option.sources.length > 0 && (
        <div className="sources">
          <span className="sources-label">מקורות</span>
          {option.sources.map((source) => (
            <a href={source.url} key={source.url} target="_blank" rel="noreferrer">
              {source.title}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

function RatingForm({ targetId, onRated }: { targetId: string; onRated: () => Promise<void> }) {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy(true);
    setError('');
    setStatus('');
    try {
      await submitRating({
        targetId,
        stars: Number(form.get('stars')),
        note: String(form.get('note') ?? ''),
        textureFeedback: String(form.get('textureFeedback') ?? ''),
        nextTime: String(form.get('nextTime') ?? '')
      });
      await onRated();
      formElement.reset();
      setStatus('הדירוג נשמר');
    } catch {
      setError('שמירת הדירוג נכשלה. בדקו את החיבור ונסו שוב.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="panel compact-form" onSubmit={onSubmit}>
      <h2>דירוג התוצאה</h2>
      <p className="panel-sub">המאגר לומד מכל דירוג. ספרו איך יצא כדי לשפר את ההמלצה לכולם.</p>
      <label>
        דירוג
        <select name="stars" defaultValue="5" aria-label="דירוג">
          <option value="5">5 כוכבים</option>
          <option value="4">4 כוכבים</option>
          <option value="3">3 כוכבים</option>
          <option value="2">2 כוכבים</option>
          <option value="1">1 כוכב</option>
        </select>
      </label>
      <label>
        הערה
        <input name="note" aria-label="הערה" placeholder="איך יצא?" />
      </label>
      <label>
        מרקם
        <input name="textureFeedback" aria-label="מרקם" placeholder="רך מדי, מדויק, יבש..." />
      </label>
      <label>
        בפעם הבאה
        <input name="nextTime" aria-label="בפעם הבאה" placeholder="יותר צריבה, פחות מלח..." />
      </label>
      <button type="submit" disabled={busy}>
        {busy ? 'שולח…' : 'שלח דירוג'}
      </button>
      {status && <p className="success">{status}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}

function SuggestionForm() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy(true);
    setError('');
    setStatus('');
    try {
      await submitSuggestion({
        ingredientName: String(form.get('ingredientName') ?? ''),
        temperatureC: Number(form.get('temperatureC')) || undefined,
        timeHours: Number(form.get('timeHours')) || undefined,
        prep: String(form.get('prep') ?? ''),
        finish: String(form.get('finish') ?? ''),
        notes: String(form.get('notes') ?? ''),
        sourceUrl: String(form.get('sourceUrl') ?? '') || undefined
      });
      formElement.reset();
      setStatus('ההצעה נשמרה לבדיקה');
    } catch {
      setError('שליחת ההצעה נכשלה. בדקו את החיבור ונסו שוב.');
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button className="secondary-action" type="button" onClick={() => setOpen(true)}>
        יש לכם מתכון טוב? הצע מתכון למאגר
      </button>
    );
  }

  return (
    <form className="panel compact-form" onSubmit={onSubmit}>
      <h2>הצעת מתכון</h2>
      <p className="panel-sub">נבדוק ונוסיף למאגר אם זה מדויק ושימושי.</p>
      <label>
        שם חומר גלם
        <input name="ingredientName" aria-label="שם חומר גלם" required />
      </label>
      <div className="two-columns">
        <label>
          טמפרטורה
          <input name="temperatureC" type="number" inputMode="decimal" />
        </label>
        <label>
          זמן בשעות
          <input name="timeHours" type="number" inputMode="decimal" />
        </label>
      </div>
      <label>
        הכנות
        <input name="prep" aria-label="הכנות" required />
      </label>
      <label>
        סיום
        <input name="finish" aria-label="סיום" required />
      </label>
      <label>
        הערות להצעה
        <textarea name="notes" aria-label="הערות להצעה" required />
      </label>
      <label>
        קישור מקור
        <input name="sourceUrl" type="url" placeholder="https://" />
      </label>
      <div className="form-actions">
        <button type="submit" disabled={busy}>
          {busy ? 'שולח…' : 'שלח הצעה'}
        </button>
        <button type="button" className="ghost" onClick={() => setOpen(false)}>
          ביטול
        </button>
      </div>
      {status && <p className="success">{status}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}

function AdminPanel() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem('suvid-admin-key') ?? '');
  const [suggestions, setSuggestions] = useState<StoredSuggestion[] | null>(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const load = async (key = adminKey) => {
    setError('');
    try {
      const response = await adminListSuggestions(key);
      setSuggestions(response.suggestions);
      localStorage.setItem('suvid-admin-key', key);
    } catch {
      setSuggestions(null);
      setError('מפתח ניהול שגוי או שהניהול לא מופעל.');
    }
  };

  const setStatus = async (id: string, status: ReviewStatus) => {
    setBusyId(id);
    setError('');
    try {
      await adminSetSuggestionStatus(id, status, adminKey);
      await load();
    } catch {
      setError('לא הצלחתי לעדכן את ההצעה.');
    } finally {
      setBusyId('');
    }
  };

  const pending = suggestions?.filter((item) => item.status === 'pending_review').length ?? 0;

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="wordmark">
            <span className="logo" aria-hidden="true" />
            SuVid · ניהול
          </div>
          <a className="topbar-tag" href="#">
            חזרה לאפליקציה →
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <h1>ניהול הצעות מתכון</h1>
          <p className="hero-sub">אישור או דחייה של הצעות שנשלחו על ידי משתמשים.</p>
          <form
            className="panel compact-form"
            onSubmit={(event) => {
              event.preventDefault();
              load();
            }}
          >
            <label>
              מפתח ניהול
              <input
                type="password"
                value={adminKey}
                aria-label="מפתח ניהול"
                onChange={(event) => setAdminKey(event.target.value)}
                placeholder="הזן מפתח כדי לטעון הצעות"
              />
            </label>
            <button type="submit">טען הצעות</button>
            {error && <p className="error">{error}</p>}
          </form>
        </section>

        {suggestions && (
          <section className="recommendations">
            <h2>
              הצעות ({suggestions.length}) · ממתינות: {pending}
            </h2>
            {suggestions.length === 0 && <p className="panel">אין הצעות עדיין.</p>}
            {suggestions.map((suggestion) => (
              <article className="panel suggestion-card" key={suggestion.id}>
                <div className="suggestion-top">
                  <h3>{suggestion.ingredientName}</h3>
                  <div className="suggestion-badges">
                    {suggestion.status === 'approved' && suggestion.temperatureC && suggestion.timeHours && (
                      <span className="status status-live">חי במחשבון</span>
                    )}
                    <span className={`status status-${suggestion.status}`}>{statusLabels[suggestion.status]}</span>
                  </div>
                </div>
                {suggestion.status === 'approved' && (!suggestion.temperatureC || !suggestion.timeHours) && (
                  <p className="muted">כדי שההצעה תופיע במחשבון צריך שתכלול טמפרטורה וזמן.</p>
                )}
                {(suggestion.temperatureC || suggestion.timeHours) && (
                  <p className="muted">
                    {suggestion.temperatureC ? `${suggestion.temperatureC}°C` : ''}
                    {suggestion.temperatureC && suggestion.timeHours ? ' · ' : ''}
                    {suggestion.timeHours ? `${suggestion.timeHours} שעות` : ''}
                  </p>
                )}
                <p>
                  <strong>הכנה:</strong> {suggestion.prep}
                </p>
                <p>
                  <strong>סיום:</strong> {suggestion.finish}
                </p>
                <p>
                  <strong>הערות:</strong> {suggestion.notes}
                </p>
                {suggestion.sourceUrl && (
                  <a href={suggestion.sourceUrl} target="_blank" rel="noreferrer">
                    מקור
                  </a>
                )}
                <div className="suggestion-actions">
                  <button type="button" onClick={() => setStatus(suggestion.id, 'approved')} disabled={busyId === suggestion.id}>
                    אשר
                  </button>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => setStatus(suggestion.id, 'rejected')}
                    disabled={busyId === suggestion.id}
                  >
                    דחה
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [selected, setSelected] = useState<Ingredient | null>(null);
  const [activeOptionId, setActiveOptionId] = useState('');
  const [activeDirectionId, setActiveDirectionId] = useState('');
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [showCatalogMore, setShowCatalogMore] = useState(false);
  const [ratingSummaries, setRatingSummaries] = useState<Record<string, RatingSummary>>({});
  const [thicknessCm, setThicknessCm] = useState(2.5);
  const [frozen, setFrozen] = useState(false);
  const [readyAt, setReadyAt] = useState('');
  const [startSummary, setStartSummary] = useState('');
  const [error, setError] = useState('');

  const options = useMemo(() => selected?.options.slice(0, 3) ?? [], [selected]);
  const activeOption = useMemo(
    () => options.find((option) => option.id === activeOptionId) ?? options[0],
    [options, activeOptionId]
  );

  const directions = selected?.recommendations ?? [];
  const activeDirection = directions.find((item) => item.id === activeDirectionId) ?? directions[0];

  const referenceCm = selected ? referenceThicknessCm(selected.category) : 2.5;
  const cookHours = activeOption
    ? recommendedCookHours(activeOption, thicknessCm, referenceCm, frozen)
    : 0;
  const safety = activeOption && selected
    ? assessSafety(selected.category, activeOption.temperatureC, cookHours)
    : null;

  const refreshRatingSummaries = async () => {
    const response = await getRatingSummaries();
    setRatingSummaries(response.summaries);
  };

  useEffect(() => {
    loadCommunity().finally(() => {
      listCatalog().then(setCatalog).catch(() => undefined);
    });
    refreshRatingSummaries().catch(() => undefined);
  }, []);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Keep an entry in the browser history when we open a result view, so the
  // device/browser BACK button returns to the catalog instead of leaving SuVid.
  const pushResultHistory = () => {
    if (window.history.state?.suvidView !== 'result') {
      window.history.pushState({ suvidView: 'result' }, '');
    }
  };

  const goHome = () => {
    setResult(null);
    setSelected(null);
    setActiveOptionId('');
    setStartSummary('');
    setError('');
    window.scrollTo({ top: 0 });
  };

  const goBack = () => {
    if (window.history.state?.suvidView === 'result') {
      window.history.back();
    } else {
      goHome();
    }
  };

  useEffect(() => {
    const onPopState = () => goHome();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const chooseIngredient = (ingredient: Ingredient) => {
    pushResultHistory();
    setSelected(ingredient);
    setResult({ kind: 'match', ingredient });
    const recommended = ingredient.options.find((option) => option.recommended) ?? ingredient.options[0];
    setActiveOptionId(recommended?.id ?? '');
    setActiveDirectionId(ingredient.recommendations[0]?.id ?? '');
    setThicknessCm(referenceThicknessCm(ingredient.category));
    setFrozen(false);
    setStartSummary('');
    setError('');
    window.scrollTo({ top: 0 });
  };

  const chooseIngredientById = async (id: string) => {
    setError('');
    try {
      const ingredient = await getIngredient(id);
      chooseIngredient(ingredient);
      setQuery(ingredient.name);
    } catch {
      setError('לא הצלחתי לפתוח את חומר הגלם כרגע.');
    }
  };

  const applyResult = (searchResult: SearchResult) => {
    pushResultHistory();
    setResult(searchResult);
    if (searchResult.kind === 'match') {
      chooseIngredient(searchResult.ingredient);
    } else {
      setSelected(null);
    }
  };

  const onSearch = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setError('');
    try {
      applyResult(await searchIngredients(query));
    } catch {
      setError('לא הצלחתי לחפש כרגע. נסה שוב.');
    }
  };

  const runExample = (example: string) => {
    setQuery(example);
    searchIngredients(example).then(applyResult).catch(() => undefined);
  };

  const calculateReadyAt = () => {
    if (!readyAt || !activeOption) return;
    const start = calculateStartTime({
      readyAt: targetDateForTime(readyAt).toISOString(),
      cookHours,
      warmupMinutes: 25,
      finishingMinutes: 15
    });
    setStartSummary(start.hebrewSummary);
  };

  const isThick = selected ? thicknessCm >= referenceCm + 1.5 : false;
  const adjustmentNote = isThick
    ? selected?.thickNote ?? ''
    : frozen
      ? selected?.frozenNote ?? 'מומלץ להפשיר ולייבש לפני השקית; קפוא מאריך את זמן החימום.'
      : '';

  if (route === '#admin') {
    return <AdminPanel />;
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <button type="button" className="wordmark" onClick={goHome} aria-label="חזרה לדף הבית">
            <span className="logo" aria-hidden="true" />
            SuVid
          </button>
          <span className="topbar-tag">מחשבון סו־ויד בעברית</span>
        </div>
      </header>

      <main>
        <section className="hero">
          <h1>מה יש לך להכין?</h1>
          <p className="hero-sub">חומר גלם אחד, וקיבלת טמפרטורה, זמן, הכנה וסיום מדויקים.</p>
          <form className="search" onSubmit={onSearch}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="לדוגמה: אסאדו, סלמון, טופו"
              aria-label="חיפוש חומר גלם"
              autoFocus
            />
            <button type="submit">חפש</button>
          </form>
          <div className="chips" aria-label="דוגמאות">
            {examples.map((example) => (
              <button type="button" key={example} onClick={() => runExample(example)}>
                {example}
              </button>
            ))}
          </div>
          {error && <p className="error">{error}</p>}
        </section>

        {catalog && !selected && result?.kind !== 'clarify' && result?.kind !== 'none' && (
          <section className="catalog-panel">
            <div className="catalog-title">
              <h2>כל חומרי הגלם</h2>
              <span>{catalog.totalIngredients} במאגר הפתיחה</span>
            </div>
            <div className="catalog-groups">
              {catalog.categories
                .filter(
                  (category) => PRIMARY_CATEGORIES.includes(category.name) || showCatalogMore
                )
                .map((category) => (
                  <details key={category.name}>
                    <summary>
                      <span>{category.name}</span>
                      <span className="count">{category.ingredients.length}</span>
                    </summary>
                    <div className="catalog-items">
                      {category.ingredients.map((ingredient) => (
                        <button type="button" key={ingredient.id} onClick={() => chooseIngredientById(ingredient.id)}>
                          {ingredient.name}
                        </button>
                      ))}
                    </div>
                  </details>
                ))}
              {!showCatalogMore &&
                catalog.categories.some((category) => !PRIMARY_CATEGORIES.includes(category.name)) && (
                  <button type="button" className="catalog-more" onClick={() => setShowCatalogMore(true)}>
                    עוד…
                  </button>
                )}
            </div>
          </section>
        )}

        {(selected || result?.kind === 'clarify' || result?.kind === 'none') && (
          <button type="button" className="back-bar" onClick={goBack}>
            <span className="back-arrow" aria-hidden="true">→</span>
            חזרה לכל חומרי הגלם
          </button>
        )}

        {result?.kind === 'clarify' && (
          <section className="panel">
            <h2>{result.question}</h2>
            <p className="panel-sub">בחרו את הנתח המדויק כדי לקבל המלצה נכונה.</p>
            <div className="choice-list">
              {result.choices.map((choice) => (
                <button type="button" key={choice.id} onClick={() => chooseIngredient(choice)}>
                  <span>{choice.name}</span>
                  <span className="choice-tag">{choice.category}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {result?.kind === 'none' && (
          <section className="panel">
            <h2>לא מצאתי התאמה טובה</h2>
            <p className="panel-sub">אפשר לבחור הצעה קרובה או לשלוח חומר גלם לבדיקה.</p>
            <div className="choice-list">
              {result.suggestions.map((choice) => (
                <button type="button" key={choice.id} onClick={() => chooseIngredient(choice)}>
                  <span>{choice.name}</span>
                  <span className="choice-tag">{choice.category}</span>
                </button>
              ))}
            </div>
            <SuggestionForm />
          </section>
        )}

        {selected && activeOption && (
          <div className="detail-layout">
            <div className="detail-main">
            <section className="result-header">
              <div className="result-id">
                <p className="eyebrow">{selected.category}</p>
                <h2>{selected.name}</h2>
                <p className="availability">{selected.availability}</p>
              </div>
              <div className="adjustment-box">
                <label className="thickness-field">
                  <span>עובי הנתח (ס״מ)</span>
                  <input
                    type="number"
                    aria-label="עובי הנתח (ס״מ)"
                    min={0.5}
                    max={12}
                    step={0.5}
                    value={thicknessCm}
                    onChange={(event) => setThicknessCm(Math.max(0.5, Number(event.target.value) || referenceCm))}
                  />
                </label>
                <label className="frozen-field">
                  <input
                    type="checkbox"
                    aria-label="מהקפאה"
                    checked={frozen}
                    onChange={(event) => setFrozen(event.target.checked)}
                  />
                  <span>מהקפאה</span>
                </label>
                {adjustmentNote && <span className="adjustment-note">{adjustmentNote}</span>}
              </div>
            </section>

            <section className="options">
              {options.length > 1 && (
                <div className="option-tabs" role="tablist" aria-label="אפשרויות בישול">
                  {options.map((option) => (
                    <button
                      type="button"
                      role="tab"
                      key={option.id}
                      aria-selected={option.id === activeOption.id}
                      className={option.id === activeOption.id ? 'tab active' : 'tab'}
                      onClick={() => setActiveOptionId(option.id)}
                    >
                      {option.recommended && <span className="star" aria-hidden="true">★</span>}
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              {safety && (
                <OptionPanel
                  option={activeOption}
                  summary={ratingSummaries[activeOption.id]}
                  cookHours={cookHours}
                  thicknessCm={thicknessCm}
                  safety={safety}
                  searTip={searGuide(selected.category)}
                />
              )}
            </section>

            {directions.length > 0 && activeDirection && (
              <section className="recommendations">
                <h2>כיווני הכנה</h2>
                {directions.length > 1 && (
                  <div className="direction-tabs" role="tablist" aria-label="כיווני הכנה">
                    {directions.map((direction) => (
                      <button
                        type="button"
                        role="tab"
                        key={direction.id}
                        aria-selected={direction.id === activeDirection.id}
                        className={direction.id === activeDirection.id ? 'dir-tab active' : 'dir-tab'}
                        onClick={() => setActiveDirectionId(direction.id)}
                      >
                        {direction.title}
                      </button>
                    ))}
                  </div>
                )}
                <article className="panel" key={activeDirection.id}>
                  <h3>{activeDirection.title}</h3>
                  <p>{activeDirection.summary}</p>
                  <p className="muted">{activeDirection.ingredients.join(' · ')}</p>
                  <ol>
                    {activeDirection.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </article>
              </section>
            )}
            </div>

            <aside className="detail-side">
              <section className="panel ready-panel">
                <h2>רוצה לאכול בשעה...</h2>
                <p className="panel-sub">נחשב מתי להתחיל לפי האפשרות שבחרת, כולל חימום וסיום.</p>
                <TimePicker24 value={readyAt} onChange={setReadyAt} />
                <button type="button" onClick={calculateReadyAt}>
                  חשב מתי להתחיל
                </button>
                {startSummary && <p className="success big">{startSummary}</p>}
              </section>

              {!activeOption.community && <RatingForm targetId={activeOption.id} onRated={refreshRatingSummaries} />}
              <SuggestionForm />
            </aside>
          </div>
        )}
      </main>

      <footer className="footer">
        SuVid · מחשבון סו־ויד · נבנה לשימוש מהמטבח ·{' '}
        <a href="#admin">ניהול</a>
      </footer>
    </div>
  );
}
