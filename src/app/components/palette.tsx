import { getContrastTextColor } from "@/helpers/chroma";
import { ColorPalette } from "@/types/color";

interface PaletteProps {
  palette: ColorPalette[];
  title?: string;
  selectedColor: string;
}

export default function PaletteComponent({
  palette,
  title,
  selectedColor,
}: PaletteProps) {
  return (
    <div className="flex flex-col gap-[1]">
      {title && <p className="font-bold">{title}</p>}
      {palette.map((col, idx) => {
        // console.log(`${title}: ${col.hex}`);
        return (
          <div
            key={idx}
            style={{
              background: col.hex,
              color: getContrastTextColor(col.hex),
              borderWidth: 3,
              borderColor: selectedColor == col.hex ? "white" : "#0a0a0a",
            }}
            className="block w-32 text-center py-2 rounded-lg"
          >
            <p>{col.hex}</p>
          </div>
        );
      })}
    </div>
  );
}
