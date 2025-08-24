export function withAlpha(color: string, alpha: number) {
  const a = Math.max(0, Math.min(1, alpha));
  const aa = Math.round(a * 255)
    .toString(16)
    .padStart(2, '0');

  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3)
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    if (hex.length === 6) return `#${aa}${hex}`; // #AARRGGBB para RN
    if (hex.length === 8) return `#${aa}${hex.slice(2)}`; // reemplaza AA existente
  }

  const rgbMatch = color.match(
    /^rgba?\((\s*\d+\s*),(\s*\d+\s*),(\s*\d+\s*)(?:,\s*[\d.]+\s*)?\)$/i
  );
  if (rgbMatch) {
    const [_, r, g, b] = rgbMatch;
    return `rgba(${r.trim()}, ${g.trim()}, ${b.trim()}, ${a})`;
  }

  return color;
}
