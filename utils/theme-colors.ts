export function resolveCssColor(value: string): string {
  if (typeof window === "undefined") return "#000000";
  try {
    const el = document.createElement("span");
    el.style.color = value;
    el.style.display = "none";
    document.body.appendChild(el);
    const comp = getComputedStyle(el).color;
    document.body.removeChild(el);
    const m = comp.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return "#000000";
    const r = parseInt(m[1], 10);
    const g = parseInt(m[2], 10);
    const b = parseInt(m[3], 10);
    return (
      "#" +
      [r, g, b]
        .map((n) => n.toString(16).padStart(2, "0"))
        .join("")
    );
  } catch (e) {
    return "#000000";
  }
}

export function colorToRgbArrayNormalized(colorStr: string): [number, number, number] {
  // Accepts hex (#rrggbb) or any CSS color string (resolved via resolveCssColor)
  const s = colorStr.trim();
  const hex = s.startsWith("#") ? s : resolveCssColor(s);
  const h = hex.replace('#', '');
  const num = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return [r / 255, g / 255, b / 255];
}
