export type QuietHours = { enabled: boolean; start: string; end: string };

/**
 * Determina si una fecha/hora está dentro del rango de horas silenciosas.
 * Soporta rangos que cruzan medianoche.
 */
export function isWithinQuietHours(now: Date, qh: QuietHours): boolean {
  if (!qh?.enabled) return false;
  const [sH, sM] = String(qh.start || '0:0')
    .split(':')
    .map((n) => parseInt(n, 10) || 0);
  const [eH, eM] = String(qh.end || '0:0')
    .split(':')
    .map((n) => parseInt(n, 10) || 0);
  const start = new Date(now);
  start.setHours(sH, sM, 0, 0);
  const end = new Date(now);
  end.setHours(eH, eM, 0, 0);
  if (end <= start) {
    // Cruza medianoche
    return now >= start || now <= end;
  }
  return now >= start && now <= end;
}
