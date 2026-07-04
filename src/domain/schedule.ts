interface StartTimeInput {
  readyAt: string;
  cookHours: number;
  warmupMinutes: number;
  finishingMinutes: number;
  /** Injectable for tests; defaults to the real current time. */
  now?: string;
}

const formatDateKey = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);

const formatHour = (date: Date) =>
  date.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jerusalem'
  });

const formatWeekday = (date: Date) =>
  new Intl.DateTimeFormat('he-IL', { timeZone: 'Asia/Jerusalem', weekday: 'long' }).format(date);

const relativeStartLabel = (start: Date, readyAt: Date) => {
  const dayDiff = Math.round(
    (Date.parse(formatDateKey(readyAt)) - Date.parse(formatDateKey(start))) / 86_400_000
  );
  if (dayDiff >= 2) {
    const daysText = dayDiff === 2 ? 'יומיים' : `${dayDiff} ימים`;
    return `${daysText} לפני, ב${formatWeekday(start)}`;
  }
  if (dayDiff === 1) return 'ביום שלפני';

  const startHour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jerusalem',
      hour: '2-digit',
      hour12: false
    }).format(start)
  );
  if (startHour < 12) return 'באותו הבוקר';
  return 'באותו היום';
};

export function calculateStartTime(input: StartTimeInput) {
  const readyAt = new Date(input.readyAt);
  const now = input.now ? new Date(input.now) : new Date();
  const totalMinutes = input.cookHours * 60 + input.warmupMinutes + input.finishingMinutes;
  const start = new Date(readyAt.getTime() - totalMinutes * 60_000);

  // The required start can be before "now" (a 36h asado, or a serving hour that is
  // simply too soon) — instead of a start time in the past, tell the user when it
  // would be ready if they start now.
  if (start.getTime() <= now.getTime()) {
    const earliestReady = new Date(now.getTime() + totalMinutes * 60_000);
    const dayDiff = Math.round(
      (Date.parse(formatDateKey(earliestReady)) - Date.parse(formatDateKey(now))) / 86_400_000
    );
    const dayText =
      dayDiff === 0 ? 'היום' : dayDiff === 1 ? 'מחר' : `ב${formatWeekday(earliestReady)}`;
    return {
      iso: start.toISOString(),
      startInPast: true,
      hebrewSummary: `אי אפשר להספיק לשעת ההגשה שנבחרה — אם מתחילים עכשיו, יהיה מוכן בערך ${dayText} בשעה ${formatHour(earliestReady)}`
    };
  }

  return {
    iso: start.toISOString(),
    startInPast: false,
    hebrewSummary: `להתחיל בערך ${relativeStartLabel(start, readyAt)} בשעה ${formatHour(start)}`
  };
}
