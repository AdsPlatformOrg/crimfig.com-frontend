import {
  encodeWithinBudget,
  type Crop,
  type ImageProfile,
} from "./image-preparation";
(globalThis as any).onmessage = async (
  event: MessageEvent<{
    bitmap: ImageBitmap;
    crop: Crop;
    profile: ImageProfile;
    maxWidth: number;
  }>,
) => {
  const { bitmap, crop, profile, maxWidth } = event.data;
  try {
    const result = await encodeWithinBudget(
      bitmap,
      crop,
      profile,
      maxWidth,
      undefined,
      (n) => (globalThis as any).postMessage({ progress: n }),
    );
    (globalThis as any).postMessage({ result });
  } catch (error) {
    (globalThis as any).postMessage({ error: (error as Error).message });
  } finally {
    bitmap.close();
  }
};
