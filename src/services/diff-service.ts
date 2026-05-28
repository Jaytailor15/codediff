import { createTwoFilesPatch, diffLines } from "diff";
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
) {
  const payload = JSON.stringify({ original, modified, language });
  return typeof window === "undefined"
    ? ""
    : window.btoa(unescape(encodeURIComponent(payload)));
}

export function parseSharePayload(payload: string | null) {
  if (!payload || typeof window === "undefined") return null;

  try {
    return JSON.parse(decodeURIComponent(escape(window.atob(payload)))) as {
      original: string;
      modified: string;
      language: string;
    };
  } catch {
    return null;
  }
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

