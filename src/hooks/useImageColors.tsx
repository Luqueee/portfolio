import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";

export const useImageColors = (imageUrl: string) => {
  const [backgroundColor, setBackgroundColor] = useState<string>("transparent");

  useEffect(() => {
    Vibrant.from(imageUrl)
      .getPalette()
      .then((palette) => {
        console.log(palette);
        if (palette.Vibrant) {
          const hex = palette.Vibrant.hex;
          const rgb = parseInt(hex.slice(1), 16);
          const r = (rgb >> 16) & 255;
          const g = (rgb >> 8) & 255;
          const b = rgb & 255;
          setBackgroundColor(`rgba(${r}, ${g}, ${b}, 0.15)`);
        }
      });
  }, []);

  return { backgroundColor };
};
