import { detectLanguageFromFileName } from "@/utils/language";
import type { EditorDocument } from "@/types/diff";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export async function readTextFile(file: File): Promise<EditorDocument> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      "Files larger than 2 MB are not supported in the browser editor."
    );
  }

  const content = await file.text();

  return {
    content,
    fileName: file.name,
    language: detectLanguageFromFileName(file.name)
  };
}
