import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

export const formatBytes = (bytes: number | null | undefined): string => {
  const safeBytes =
    typeof bytes === "number" && Number.isFinite(bytes) ? bytes : 0;
  let value = safeBytes;
  let index = 0;
  while (value >= 1024 && index < BYTE_UNITS.length - 1) {
    value /= 1024;
    index += 1;
  }
  const precision = value >= 10 || index === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${BYTE_UNITS[index]}`;
};
