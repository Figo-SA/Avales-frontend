// src/lib/ui-utils.ts

// 1) Define tus breakpoints aquí, alineados con Tailwind
// Puedes ajustarlos a los que tenías en la plantilla (incluyendo xs: 480px)
const SCREENS: Record<string, number> = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const getBreakpointValue = (value: string): number => {
  return SCREENS[value] ?? 0;
};

export const getBreakpoint = () => {
  if (typeof window === "undefined") return undefined;

  let currentBreakpoint: string | undefined = undefined;
  let biggestBreakpointValue = 0;
  const windowWidth = window.innerWidth;

  for (const [breakpoint, px] of Object.entries(SCREENS)) {
    if (px > biggestBreakpointValue && windowWidth >= px) {
      biggestBreakpointValue = px;
      currentBreakpoint = breakpoint;
    }
  }

  return currentBreakpoint;
};

export const hexToRGB = (h: string): string => {
  let r = 0;
  let g = 0;
  let b = 0;

  if (h.length === 4) {
    r = parseInt(`0x${h[1]}${h[1]}`);
    g = parseInt(`0x${h[2]}${h[2]}`);
    b = parseInt(`0x${h[3]}${h[3]}`);
  } else if (h.length === 7) {
    r = parseInt(`0x${h[1]}${h[2]}`);
    g = parseInt(`0x${h[3]}${h[4]}`);
    b = parseInt(`0x${h[5]}${h[6]}`);
  }

  return `${r},${g},${b}`;
};

export const formatValue = (value: number): string =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

export const formatThousands = (value: number): string =>
  Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);
