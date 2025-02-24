"use client";
import React, { useEffect, useState } from "react";
import ColorPicker from "./components/color-picker";
import { generatePalette } from "@/helpers/color-helper";
import { ColorPalette, ColorMode } from "@/types/color";
import PaletteComponent from "./components/palette";
import { generateDesignSystemPaletteWithChroma } from "@/helpers/chroma";
import Switch from "@mui/material/Switch";
import { generatePaletteV2 } from "@/helpers/color-helper-v2";

export default function Home() {
  const defaultColor = "#ff0000";
  const [color, setColor] = useState(defaultColor);
  const [textInput, setTextInput] = useState("");
  const [palette, setPalette] = useState<ColorPalette[]>([]);
  const [palette2, setPalette2] = useState<ColorPalette[]>([]);
  const [chromaPalette, setChromaPalette] = useState<ColorPalette[]>([]);
  const [mode, setMode] = useState<ColorMode>(ColorMode.LIGHT);

  useEffect(() => {
    const newPalette = generatePalette(color, mode);
    const mapped: ColorPalette[] = [];
    Object.values(newPalette).forEach((k) => {
      mapped.push({
        // name: k,
        hex: k.hex,
      });
    });
    setPalette(mapped);
    const chroma = generateDesignSystemPaletteWithChroma(color, mode);
    setChromaPalette(chroma);
    setPalette2(generatePaletteV2(color, mode));
  }, [color, mode]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    setTextInput(newColor);
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTextInput(val);
    if (val.startsWith("#") && val.length == 7) {
      setColor(val);
    }
  };

  const handleModeToggle = (
    val: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    if (checked) {
      setMode(ColorMode.LIGHT);
    } else {
      setMode(ColorMode.DARK);
    }
  };

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-4">
          <span className="border-2 border-white rounded-lg p-2">
            Selected color:{" "}
            <p
              className="font-bold"
              style={{
                color: color,
              }}
            >
              {color}
            </p>
          </span>
          <ColorPicker onChange={handleColorChange} color={color} />
          <input
            type="text"
            onChange={handleTextInput}
            value={textInput}
            placeholder=""
            className="bg-white color-black border-red-400 border-2 text-black"
          />
          <div className="flex flex-row text-center justify-center items-center border-white border-2 rounded-lg">
            <p className="font-white">dark</p>
            <Switch
              onChange={handleModeToggle}
              checked={mode == ColorMode.LIGHT}
            />
            <p className="font-white">light</p>
          </div>
        </div>
        <div className="flex flex-row gap-12">
          <PaletteComponent
            palette={chromaPalette}
            title="Chroma JS"
            selectedColor={color}
          />
          <PaletteComponent
            palette={palette}
            title="Algorithm"
            selectedColor={color}
          />
          <PaletteComponent
            palette={palette2}
            title="Algorithm V2"
            selectedColor={color}
          />
        </div>
      </div>
    </div>
  );
}
