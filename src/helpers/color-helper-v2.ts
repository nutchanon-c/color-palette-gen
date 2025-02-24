import { ColorMode, ColorPalette } from "@/types/color";

// Convert HEX to HSL
function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

// Convert HSL to HEX (Fixed Version)
function HSLToHex(h: number, s: number, l: number): string {
  // Ensure values are within valid ranges
  h = ((h % 360) + 360) % 360; // Normalize hue (0-360)
  s = Math.max(0, Math.min(100, s)); // Clamp saturation (0-100)
  l = Math.max(0, Math.min(100, l)); // Clamp lightness (0-100)

  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const rgb = [f(0), f(8), f(4)];
  const toHex = (x: number) => {
    const hex = Math.round(x * 255)
      .toString(16)
      .padStart(2, "0"); // Ensure 2-digit hex
    return hex;
  };

  return `#${rgb.map(toHex).join("")}`.toUpperCase();
}

// Generate a color palette (Fixed Version)
export function generatePaletteV2(
  baseColor: string,
  mode = ColorMode.LIGHT
): ColorPalette[] {
  const [hue, saturation, lightness] = hexToHSL(baseColor);

  const lightModePalette = [
    HSLToHex(hue, saturation * 0.9, lightness * 0.25),
    HSLToHex(hue, saturation * 0.95, lightness * 0.4),
    HSLToHex(hue, saturation, lightness * 0.6),
    baseColor, // Base color included correctly
    HSLToHex(hue, saturation * 0.9, Math.min(100, lightness * 1.1)), // Fix overflow
    HSLToHex(hue, saturation * 0.8, Math.min(100, lightness * 1.2)),
    HSLToHex(hue, saturation * 0.7, Math.min(100, lightness * 1.3)),
    HSLToHex(hue, saturation * 0.6, Math.min(100, lightness * 1.4)),
    HSLToHex(hue, saturation * 0.5, Math.min(100, lightness * 1.5)),
    HSLToHex(hue, saturation * 0.4, Math.min(100, lightness * 1.6)),
  ];

  const darkModePalette = [
    ...lightModePalette.slice(0, 6).reverse(),
    HSLToHex(hue, saturation * 0.4, lightness * 0.4),
    HSLToHex(hue, saturation * 0.3, lightness * 0.3),
    HSLToHex(hue, saturation * 0.25, lightness * 0.25),
    HSLToHex(hue, saturation * 0.2, lightness * 0.15),
  ];

  return (mode === ColorMode.LIGHT ? lightModePalette : darkModePalette).map(
    (hex) => ({
      hex,
    })
  );
}
