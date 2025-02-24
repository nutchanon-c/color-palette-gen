"use client";

import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (newColor: string) => void;
}

export default function ColorPicker({ onChange, color }: ColorPickerProps) {
  return <HexColorPicker color={color} onChange={onChange} />;
}
