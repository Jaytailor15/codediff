import { SUPPORTED_LANGUAGES } from "@/lib/constants";

export function getFileExtension(fileName: string) {
  const lastDot = fileName.lastIndexOf(".");
  return lastDot !== -1 ? fileName.slice(lastDot + 1).toLowerCase() : "";
}

export function detectLanguageFromFileName(fileName: string) {
  const extension = getFileExtension(fileName);
  return (
    SUPPORTED_LANGUAGES.find((language) =>
      (language.extensions as readonly string[]).includes(extension)
    )?.value ?? "plaintext"
  );
}

export function getLanguageLabel(value: string) {
  return (
    SUPPORTED_LANGUAGES.find((language) => language.value === value)?.label ??
    "Plain Text"
  );
}
