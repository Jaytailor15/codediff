import { createTwoFilesPatch, diffLines, applyPatch } from "diff";
import type { DiffOptions, DiffStats } from "@/types/diff";

export function calculateDiffStats(
  original: string,
  modified: string
): DiffStats {
  const changes = diffLines(original, modified);

  return changes.reduce<DiffStats>(
    (stats, part) => {
      const lineCount = countMeaningfulLines(part.value);

      if (part.added) {
        stats.additions += lineCount;
        stats.changes += lineCount;
      } else if (part.removed) {
        stats.removals += lineCount;
        stats.changes += lineCount;
      }

      return stats;
    },
    {
      additions: 0,
      removals: 0,
      changes: 0,
      originalLines: countMeaningfulLines(original),
      modifiedLines: countMeaningfulLines(modified)
    }
  );
}

export function createUnifiedDiff(
  original: string,
  modified: string,
  originalName = "original",
  modifiedName = "modified"
) {
  return createTwoFilesPatch(
    originalName,
    modifiedName,
    original,
    modified,
    "",
    "",
    { context: 4 }
  );
}

export function prepareDiffContent(content: string, options: DiffOptions) {
  let nextContent = content;

  if (options.trimLines) {
    nextContent = nextContent
      .split(/\r?\n/)
      .map((line) => line.trim())
      .join("\n");
  }

  if (options.ignoreBlankLines) {
    nextContent = nextContent
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0)
      .join("\n");
  }

  if (options.ignoreWhitespace) {
    nextContent = nextContent
      .split(/\r?\n/)
      .map((line) => line.replace(/\s+/g, " ").trim())
      .join("\n");
  }

  if (options.ignoreCase) {
    nextContent = nextContent.toLowerCase();
  }

  if (options.sortLines) {
    nextContent = nextContent
      .split(/\r?\n/)
      .sort((left, right) => left.localeCompare(right))
      .join("\n");
  }

  return nextContent;
}

export function createSharePayload(
  original: string,
  modified: string,
  language: string
): string {
  if (typeof window === "undefined") return "";

  try {
    let payloadStr = "";

    // Try delta patch encoding to dramatically reduce size for typical edits
    try {
      const patch = createTwoFilesPatch("original", "modified", original, modified, "", "", { context: 3 });
      
      // Safety check: ensure applying the patch perfectly reconstructs the modified content
      const testReconstruct = applyPatch(original, patch);
      if (typeof testReconstruct === "string" && testReconstruct === modified) {
        // Delimiter-based serialization for delta patch (no JSON escaping overhead)
        const patchPayload = `p\u0001${language}\u0001${original.length}\u0001${original}${patch}`;
        const fullPayload = `f\u0001${language}\u0001${original.length}\u0001${original}${modified}`;

        // Use whichever representation is shorter (patch is usually 50%-90% smaller)
        payloadStr = patchPayload.length < fullPayload.length ? patchPayload : fullPayload;
      }
    } catch {
      // Fallback to full encoding if patching fails
    }

    if (!payloadStr) {
      payloadStr = `f\u0001${language}\u0001${original.length}\u0001${original}${modified}`;
    }

    const encoder = new TextEncoder();
    const bytes = encoder.encode(payloadStr);

    // Synchronous LZW compression over UTF-8 bytes to support all Unicode/Emojis perfectly
    const dictionary: Map<string, number> = new Map();
    for (let i = 0; i < 256; i++) {
      dictionary.set(String.fromCharCode(i), i);
    }

    let word = "";
    const codes: number[] = [];
    let dictSize = 256;

    for (let i = 0; i < bytes.length; i++) {
      const char = String.fromCharCode(bytes[i]);
      const joined = word + char;
      if (dictionary.has(joined)) {
        word = joined;
      } else {
        codes.push(dictionary.get(word)!);
        dictionary.set(joined, dictSize++);
        word = char;
      }
    }
    if (word !== "") {
      codes.push(dictionary.get(word)!);
    }

    // Convert codes to a Varint byte stream to remove 16-bit code doubling null-byte overhead
    const byteList: number[] = [];
    for (let i = 0; i < codes.length; i++) {
      let v = codes[i];
      while (v >= 0x80) {
        byteList.push((v & 0x7f) | 0x80);
        v >>>= 7;
      }
      byteList.push(v & 0x7f);
    }

    const buffer = new Uint8Array(byteList);

    // Convert Uint8Array buffer to Base64 in batches
    let binary = "";
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(buffer[i]);
    }

    // Output dynamic URL-Safe Base64 (RFC 4648) with padding stripped
    return window.btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch (error) {
    console.error("Compression failed, falling back to legacy base64", error);
    try {
      const fallback = JSON.stringify({ original, modified, language });
      return window.btoa(unescape(encodeURIComponent(fallback)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    } catch {
      return "";
    }
  }
}

export function parseSharePayload(payload: string | null) {
  if (!payload || typeof window === "undefined") return null;

  try {
    // Restore standard Base64 from URL-safe Base64 representation
    let base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    
    while (base64.length % 4) {
      base64 += "=";
    }
    
    const binary = window.atob(base64);
    
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }

    // Decode Varint byte stream back to LZW codes
    const codes: number[] = [];
    let idx = 0;
    while (idx < buffer.length) {
      let value = 0;
      let shift = 0;
      while (idx < buffer.length) {
        const byte = buffer[idx++];
        value |= (byte & 0x7f) << shift;
        if (!(byte & 0x80)) {
          break;
        }
        shift += 7;
      }
      codes.push(value);
    }

    if (codes.length === 0) return null;
    
    // LZW decompression dictionaries
    const dictionary: Map<number, Uint8Array> = new Map();
    for (let i = 0; i < 256; i++) {
      dictionary.set(i, new Uint8Array([i]));
    }
    
    let dictSize = 256;
    let currCode = codes[0];
    
    if (!dictionary.has(currCode)) {
      // Fallback: try parsing directly as legacy uncompressed JSON
      const parsed = JSON.parse(decodeURIComponent(escape(binary)));
      return normalizeParsedPayload(parsed);
    }
    
    let val = dictionary.get(currCode)!;
    const outBytes: number[] = Array.from(val);
    let oldVal = val;
    
    for (let i = 1; i < codes.length; i++) {
      const nextCode = codes[i];
      let s: Uint8Array;
      if (dictionary.has(nextCode)) {
        s = dictionary.get(nextCode)!;
      } else if (nextCode === dictSize) {
        s = new Uint8Array([...oldVal, oldVal[0]]);
      } else {
        throw new Error("Invalid LZW sequence");
      }
      
      outBytes.push(...s);
      dictionary.set(dictSize++, new Uint8Array([...oldVal, s[0]]));
      oldVal = s;
    }
    
    const decodedPayload = new TextDecoder().decode(new Uint8Array(outBytes));

    // Try parsing as delimiter-separated values first (new highly compressed format)
    if (decodedPayload.includes("\u0001")) {
      const parts = decodedPayload.split("\u0001");
      if (parts.length >= 4) {
        const type = parts[0];
        const lang = parts[1];
        const originalLengthStr = parts[2];
        const originalLength = parseInt(originalLengthStr, 10);
        
        if (!isNaN(originalLength)) {
          const headerLength = type.length + 1 + lang.length + 1 + originalLengthStr.length + 1;
          const orig = decodedPayload.substring(headerLength, headerLength + originalLength);
          const modifiedOrPatch = decodedPayload.substring(headerLength + originalLength);

          if (type === "p") {
            const reconstructed = applyPatch(orig, modifiedOrPatch);
            if (typeof reconstructed === "string") {
              return {
                original: orig,
                modified: reconstructed,
                language: lang
              };
            }
          } else if (type === "f") {
            return {
              original: orig,
              modified: modifiedOrPatch,
              language: lang
            };
          }
        }
      }
    }

    // Fallback: Parse as JSON representation (new and legacy fallback formats)
    const parsed = JSON.parse(decodedPayload);
    return normalizeParsedPayload(parsed);
  } catch (error) {
    // Fallback: parse as legacy uncompressed JSON Base64 string
    try {
      let base64 = payload
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      while (base64.length % 4) {
        base64 += "=";
      }
      const raw = decodeURIComponent(escape(window.atob(base64)));

      if (raw.includes("\u0001")) {
        const parts = raw.split("\u0001");
        if (parts.length >= 4) {
          const type = parts[0];
          const lang = parts[1];
          const originalLengthStr = parts[2];
          const originalLength = parseInt(originalLengthStr, 10);
          
          if (!isNaN(originalLength)) {
            const headerLength = type.length + 1 + lang.length + 1 + originalLengthStr.length + 1;
            const orig = raw.substring(headerLength, headerLength + originalLength);
            const modifiedOrPatch = raw.substring(headerLength + originalLength);

            if (type === "p") {
              const reconstructed = applyPatch(orig, modifiedOrPatch);
              if (typeof reconstructed === "string") {
                return {
                  original: orig,
                  modified: reconstructed,
                  language: lang
                };
              }
            } else if (type === "f") {
              return {
                original: orig,
                modified: modifiedOrPatch,
                language: lang
              };
            }
          }
        }
      }

      const parsed = JSON.parse(raw);
      return normalizeParsedPayload(parsed);
    } catch {
      return null;
    }
  }
}

// Helper to normalize the parsed payload from either the new format (patch or full) or legacy formats
function normalizeParsedPayload(parsed: any) {
  if (!parsed || typeof parsed !== "object") return null;

  // New compressed format with single character keys
  if (parsed.t === "p") {
    // Patch type: reconstruct modified content
    const reconstructed = applyPatch(parsed.o, parsed.p);
    if (typeof reconstructed === "string") {
      return {
        original: parsed.o,
        modified: reconstructed,
        language: parsed.l
      };
    }
  } else if (parsed.t === "f") {
    // Full type
    return {
      original: parsed.o,
      modified: parsed.m,
      language: parsed.l
    };
  }

  // Legacy format check (original, modified, language)
  if ("original" in parsed && "modified" in parsed) {
    return {
      original: parsed.original as string,
      modified: parsed.modified as string,
      language: (parsed.language as string) || "plaintext"
    };
  }

  return null;
}

function countMeaningfulLines(value: string) {
  if (!value) return 0;
  const lines = value.split(/\r?\n/);
  return lines.at(-1) === "" ? lines.length - 1 : lines.length;
}

export interface CodeInsights {
  characters: number;
  words: number;
  longestLine: number;
  mixedIndentation: boolean;
  trailingWhitespace: number;
  emptyLines: number;
}

export function analyzeCodeQuality(content: string): CodeInsights {
  if (!content) {
    return { characters: 0, words: 0, longestLine: 0, mixedIndentation: false, trailingWhitespace: 0, emptyLines: 0 };
  }

  const lines = content.split(/\r?\n/);
  const characters = content.length;
  const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  let longestLine = 0;
  let hasTabs = false;
  let hasSpaces = false;
  let mixedIndentation = false;
  let trailingWhitespace = 0;
  let emptyLines = 0;

  lines.forEach((line) => {
    if (line.length > longestLine) {
      longestLine = line.length;
    }
    const leadingWhitespace = line.match(/^[ \t]+/)?.[0] || "";
    if (leadingWhitespace.includes(" ")) hasSpaces = true;
    if (leadingWhitespace.includes("\t")) hasTabs = true;

    if (/\s+$/.test(line) && line.trim().length > 0) {
      trailingWhitespace++;
    }
    if (line.trim().length === 0) {
      emptyLines++;
    }
  });

  if (hasSpaces && hasTabs) {
    mixedIndentation = true;
  }

  return {
    characters,
    words,
    longestLine,
    mixedIndentation,
    trailingWhitespace,
    emptyLines
  };
}

export interface RichDiffAnalysis {
  additionsCount: number;
  deletionsCount: number;
  updatesCount: number;
  movesCount: number;
  copiesCount: number;
  findReplacesCount: number;
  moves: Array<{ from: string; to: string; count: number; text: string }>;
  copies: Array<{ text: string; locations: number[] }>;
  findReplaces: Array<{ from: string; to: string; occurrences: number }>;
}

export function analyzeRichDiff(original: string, modified: string): RichDiffAnalysis {
  const origLines = original.split(/\r?\n/);
  const modLines = modified.split(/\r?\n/);

  const matchedOriginal = new Set<number>();
  const matchedModified = new Set<number>();

  // 1. Exact matches at the same positions
  const minLines = Math.min(origLines.length, modLines.length);
  for (let i = 0; i < minLines; i++) {
    if (origLines[i] === modLines[i]) {
      matchedOriginal.add(i);
      matchedModified.add(i);
    }
  }

  // 2. Move Detection
  const moves: Array<{ from: string; to: string; count: number; text: string }> = [];
  const tempMoveOriginals = new Set<number>();
  const tempMoveModifieds = new Set<number>();

  for (let i = 0; i < origLines.length; i++) {
    if (matchedOriginal.has(i) || origLines[i].trim() === "") continue;

    for (let j = 0; j < modLines.length; j++) {
      if (j === i || matchedModified.has(j) || tempMoveModifieds.has(j) || modLines[j].trim() === "") continue;

      if (origLines[i].trim() === modLines[j].trim()) {
        tempMoveOriginals.add(i);
        tempMoveModifieds.add(j);
        moves.push({
          from: `L${i + 1}`,
          to: `L${j + 1}`,
          count: 1,
          text: origLines[i].trim()
        });
        break;
      }
    }
  }

  // 3. Update Detection (partly changed or tweaked lines)
  let updatesCount = 0;
  for (let i = 0; i < minLines; i++) {
    if (matchedOriginal.has(i)) continue;
    const orig = origLines[i].trim();
    const mod = modLines[i].trim();
    if (orig === "" || mod === "") continue;

    const words1 = new Set(orig.split(/\s+/));
    const words2 = new Set(mod.split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    const similarity = intersection.size / union.size;

    if (similarity >= 0.4 && similarity < 1.0) {
      updatesCount++;
      matchedOriginal.add(i);
      matchedModified.add(i);
    }
  }

  // 4. Copy/Paste Detection
  const copies: Array<{ text: string; locations: number[] }> = [];
  const modLineCounts = new Map<string, number[]>();

  modLines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.length > 10) {
      if (!modLineCounts.has(trimmed)) {
        modLineCounts.set(trimmed, []);
      }
      modLineCounts.get(trimmed)!.push(idx + 1);
    }
  });

  modLineCounts.forEach((locations, text) => {
    if (locations.length >= 2) {
      const existsInOriginal = origLines.some(l => l.trim() === text);
      if (existsInOriginal) {
        copies.push({
          text: text.length > 32 ? text.substring(0, 32) + "..." : text,
          locations
        });
      }
    }
  });

  // 5. Bulk Find/Replace Detection
  const findReplaces: Array<{ from: string; to: string; occurrences: number }> = [];
  const replacementsMap = new Map<string, number>();

  for (let i = 0; i < minLines; i++) {
    const orig = origLines[i].trim();
    const mod = modLines[i].trim();
    if (orig === "" || mod === "" || orig === mod) continue;

    const words1 = orig.split(/[^a-zA-Z0-9_]+/);
    const words2 = mod.split(/[^a-zA-Z0-9_]+/);

    if (words1.length === words2.length) {
      let diffIndex = -1;
      let diffs = 0;
      for (let w = 0; w < words1.length; w++) {
        if (words1[w] !== words2[w]) {
          diffs++;
          diffIndex = w;
        }
      }
      if (diffs === 1 && words1[diffIndex] && words2[diffIndex]) {
        const key = `${words1[diffIndex]} → ${words2[diffIndex]}`;
        replacementsMap.set(key, (replacementsMap.get(key) || 0) + 1);
      }
    }
  }

  replacementsMap.forEach((occurrences, key) => {
    if (occurrences >= 3) {
      const [from, to] = key.split(" → ");
      findReplaces.push({ from, to, occurrences });
    }
  });

  // 6. Addition and Deletion counts adjustments
  let additionsCount = 0;
  for (let j = 0; j < modLines.length; j++) {
    if (!matchedModified.has(j) && !tempMoveModifieds.has(j) && modLines[j].trim() !== "") {
      additionsCount++;
    }
  }

  let deletionsCount = 0;
  for (let i = 0; i < origLines.length; i++) {
    if (!matchedOriginal.has(i) && !tempMoveOriginals.has(i) && origLines[i].trim() !== "") {
      deletionsCount++;
    }
  }

  return {
    additionsCount,
    deletionsCount,
    updatesCount,
    movesCount: moves.length,
    copiesCount: copies.length,
    findReplacesCount: findReplaces.length,
    moves,
    copies,
    findReplaces
  };
}

