import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function tryCatch<T, E = Error>(
  fn: () => Promise<T> | T,
): Promise<[T | null, E | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (e: unknown) {
    return [null, e as E];
  }
}
