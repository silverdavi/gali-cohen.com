/** "20:00" + "23:00" -> "20:00–23:00". An empty end time leaves the start alone. */
export function formatTimeRange(time: string, endTime = ''): string {
  if (!time) return '';
  return endTime ? `${time}–${endTime}` : time;
}

/** YYYY-MM-DD -> "12 ביוני 2026" (or '' if empty/invalid) — used anywhere a
 * structured dateISO needs a human display label. */
export function formatDateHe(dateISO: string): string {
  if (!dateISO) return '';
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}
