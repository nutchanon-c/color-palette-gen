import { ColorMode, ColorPalette } from "@/types/color";
import chroma from "chroma-js";

export function generateDesignSystemPaletteWithChroma(
  baseColor: string,
  mode: ColorMode = ColorMode.LIGHT
): ColorPalette[] {
  // Get the base color's HSL values
  const baseHsl = chroma(baseColor).hsl();

  // Define lightness values ensuring baseColor (600) is included
  const lightModeLuminance = [
    0.1,
    0.2,
    0.3,
    0.4,
    0.5,
    baseHsl[2],
    0.7,
    0.8,
    0.85,
    0.95,
  ];
  const darkModeLuminance = [
    0.95,
    0.85,
    0.8,
    0.7,
    baseHsl[2],
    0.5,
    0.35,
    0.25,
    0.2,
    0.1,
  ];

  // Choose the luminance steps based on mode
  const luminanceSteps =
    mode === ColorMode.LIGHT ? lightModeLuminance : darkModeLuminance;

  // Generate the palette
  const palette = luminanceSteps.map((luminance, index) => {
    let color = chroma(baseColor);

    // Adjust saturation progressively
    let saturationMultiplier;
    if (mode === ColorMode.LIGHT) {
      saturationMultiplier = index < 5 ? 1 : 1 - (index - 4) * 0.1;
    } else {
      saturationMultiplier = index > 4 ? 0.9 : 1 - (4 - index) * 0.1;
    }

    // Apply the calculated lightness and saturation
    color = chroma.hsl(
      baseHsl[0],
      baseHsl[1] * saturationMultiplier,
      luminance
    );

    return {
      hex: color.hex().toUpperCase(),
    };
  });

  return palette;
}

export function getContrastTextColor(backgroundColor: string): string {
  // Calculate the relative luminance
  const luminance = chroma(backgroundColor).luminance();

  // If luminance is lower than 0.5, use white text; otherwise, use black text
  return luminance < 0.5 ? "#FFFFFF" : "#000000";
}
