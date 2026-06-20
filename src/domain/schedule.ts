interface StartTimeInput {
  readyAt: string;
  cookHours: number;
  warmupMinutes: number;
  finishingMinutes: number;
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

const relativeStartLabel = (start: Date, readyAt: Date) => {
  const startKey = formatDateKey(start);
  const readyKey = formatDateKey(readyAt);
  const startHour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jerusalem',
      hour: '2-digit',
      hour12: false
    }).format(start)
  );

  if (startKey !== readyKey) return 'ביום שלפני';
  if (startHour < 12) return 'באותו הבוקר';
  return 'באותו היום';
};

export function calculateStartTime(input: StartTimeInput) {
  const readyAt = new Date(input.readyAt);
  const totalMinutes = input.cookHours * 60 + input.warmupMinutes + input.finishingMinutes;
  const start = new Date(readyAt.getTime() - totalMinutes * 60_000);
  const relativeLabel = relativeStartLabel(start, readyAt);

  return {
    iso: start.toISOString(),
    hebrewSummary: `להתחיל בערך ${relativeLabel} בשעה ${formatHour(start)}`
  };
}
