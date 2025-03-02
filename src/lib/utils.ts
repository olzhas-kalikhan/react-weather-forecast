import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const round = (value: number, decimals: number = 2) => {
  return parseFloat(value.toFixed(decimals));
};
