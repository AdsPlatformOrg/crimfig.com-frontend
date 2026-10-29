import type { Crop } from "./image-preparation";
export interface PercentSelection {
  unit: "%";
  x: number;
  y: number;
  width: number;
  height: number;
}
/** Independent of CSS/display pixels: map the approved selection into the oriented source. */
export function sourceCrop(
  selection: PercentSelection,
  width: number,
  height: number,
): Crop {
  if (
    ![width, height].every((v) => Number.isFinite(v) && v > 0) ||
    ![selection.x, selection.y, selection.width, selection.height].every(
      Number.isFinite,
    ) ||
    selection.x < 0 ||
    selection.y < 0 ||
    selection.width <= 0 ||
    selection.height <= 0 ||
    selection.x + selection.width > 100.001 ||
    selection.y + selection.height > 100.001
  )
    throw Error("Keep the crop within the image.");
  return {
    x: (width * selection.x) / 100,
    y: (height * selection.y) / 100,
    width: (width * selection.width) / 100,
    height: (height * selection.height) / 100,
  };
}
export function centeredSelection(
  width: number,
  height: number,
  ratio: number,
): PercentSelection {
  const w = Math.min(width, height * ratio) * 0.9,
    h = w / ratio;
  return {
    unit: "%",
    x: ((width - w) / width) * 50,
    y: ((height - h) / height) * 50,
    width: (w / width) * 100,
    height: (h / height) * 100,
  };
}
