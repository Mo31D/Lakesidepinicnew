// Derived from the retained original shop photograph; no product assets are replaced.
export const responsiveImages: Record<string, {
  fallback: string;
  candidates: readonly [string, number][];
  sizes: string;
}> = {
  "/optimized/images/Today.webp": {
    fallback: "/optimized/responsive/Today-1600.webp",
    candidates: [
      ["/optimized/responsive/Today-640.webp", 640],
      ["/optimized/responsive/Today-960.webp", 960],
      ["/optimized/responsive/Today-1600.webp", 1600],
    ],
    sizes: "(max-width: 760px) 100vw, (max-width: 1440px) 50vw, 720px",
  },
};
