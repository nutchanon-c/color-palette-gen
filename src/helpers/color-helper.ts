import { ColorMode, ColorPalette } from "@/types/color";

function hexToHSL(hex: string): [number, number, number] {
  // Remove # if present
  hex = hex.replace("#", "");

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
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

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = h % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  const toHex = (n: number): string => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function generatePalette(
  baseColor: string,
  mode: ColorMode = ColorMode.LIGHT
): ColorPalette[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hue, saturation, lightness] = hexToHSL(baseColor);

  // Define lightness scales for both modes
  const lightnessScale =
    mode === ColorMode.LIGHT
      ? [98, 95, 90, 82, 72, 60, 45, 35, 25, 15] // Light mode
      : [95, 90, 82, 72, 60, 45, 35, 25, 15, 8]; // Dark mode

  // Define saturation adjustments
  const getSaturation = (index: number): number => {
    if (mode === ColorMode.LIGHT) {
      // Reduce saturation for very light colors, increase for darker ones
      if (index < 3) return Math.max(saturation * 0.8, 10);
      if (index > 6) return Math.min(saturation * 1.2, 100);
      return saturation;
    } else {
      // In dark mode, reduce saturation more dramatically for darker colors
      if (index > 6) return saturation * 0.7;
      if (index < 3) return Math.min(saturation * 1.1, 100);
      return saturation;
    }
  };

  // Define hue adjustments
  const getHue = (index: number): number => {
    const shift = ((index - 4) / 10) * 5; // Subtle hue shift based on position
    const adjustedHue = hue + shift;

    // Ensure hue stays within 0-360 range
    return (adjustedHue + 360) % 360;
  };

  // Generate colors
  const palette = lightnessScale.map((l, index) => {
    return hslToHex(getHue(index), getSaturation(index), l);
  });

  return mode === ColorMode.LIGHT
    ? palette.map((val) => {
        return {
          hex: val,
        };
      })
    : palette.reverse().map((val) => {
        return {
          hex: val,
        };
      });
}
