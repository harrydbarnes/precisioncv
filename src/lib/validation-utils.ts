import { IndustryUpdate } from "./types";

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

export const isQnaArray = (
  value: unknown
): value is Array<{ question: string; answer: string }> =>
  Array.isArray(value) &&
  value.every(
    (item: unknown) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).question === "string" &&
      typeof (item as Record<string, unknown>).answer === "string"
  );

export const isIndustryUpdateArray = (
  value: unknown
): value is IndustryUpdate[] =>
  Array.isArray(value) &&
  value.every(
    (item: unknown) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).update === "string"
  );
