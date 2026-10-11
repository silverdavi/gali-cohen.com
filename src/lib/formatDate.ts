/** "20:00" + "23:00" -> "20:00–23:00". An empty end time leaves the start alone.
 *  The range is wrapped in an LTR isolate so a Hebrew (RTL) page cannot
 *  display it backwards as 23:00–20:00. */
export function formatTimeRange(time: string, endTime = ''): string {
  if (!time) return '';
  const label = endTime ? `${time}–${endTime}` : time;
  return `\u2066${label}\u2069`;
}

/** YYYY-MM-DD -> "12 ביוני 2026" (or '' if empty/invalid) — used anywhere a
 * structured dateISO needs a human display label. */
export function formatDateHe(dateISO: string): string {
  if (!dateISO) return '';
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}
