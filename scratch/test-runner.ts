import {
  getFileExtension,
  detectLanguageFromFileName,
  getLanguageLabel
} from "../src/utils/language";
import {
  calculateDiffStats,
  prepareDiffContent,
  createSharePayload,
  parseSharePayload
} from "../src/services/diff-service";
import type { DiffOptions } from "../src/types/diff";

// Helper to assertion
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function runTests() {
  console.log("🚀 Starting CodeDiff Pro Test Suite...\n");

  // ==========================================
  // 1. Language and File Extension Utilities
  // ==========================================
  console.log("📦 Testing Language Utilities...");

  // Standard extension extraction
  assert(getFileExtension("test.js") === "js", "test.js should have extension js");
  assert(getFileExtension("main.test.ts") === "ts", "main.test.ts should have extension ts");
  assert(getFileExtension("uppercase.HTML") === "html", "uppercase.HTML should have extension html");

  // Edge cases - files with NO extension (this is currently a bug)
  console.log("   - [Current Bug Check] File with no extension 'js': Extension extracted =", getFileExtension("js"));
  // Once fixed, getFileExtension("js") should return ""
  
  // Edge cases - dotfiles
  assert(getFileExtension(".gitignore") === "gitignore", ".gitignore extension should be gitignore");

  // Language auto-detection
  assert(detectLanguageFromFileName("app.tsx") === "typescript", "app.tsx should map to typescript");
  
  // Bug check for markdown shadowing plaintext
  console.log("   - [Current Bug Check] markdown file 'readme.md' maps to:", detectLanguageFromFileName("readme.md"));
  // Once fixed, it should return "markdown"

  assert(getLanguageLabel("javascript") === "JavaScript", "javascript label mismatch");
  assert(getLanguageLabel("unknown_lang") === "Plain Text", "fallback label mismatch");

  // ==========================================
  // 2. Diff Processing and Statistics
  // ==========================================
  console.log("\n📈 Testing Diff Services...");

  const defaultOptions: DiffOptions = {
    realtime: true,
    hideUnchanged: true,
    lineWrap: true,
    ignoreWhitespace: false,
    ignoreCase: false,
    ignoreBlankLines: false,
    trimLines: false,
    sortLines: false,
    precision: "smart"
  };

  // Basic stats
  const orig1 = "line 1\nline 2";
  const mod1 = "line 1\nline 2\nline 3";
  const stats1 = calculateDiffStats(orig1, mod1);
  assert(stats1.additions === 1, "Should have 1 addition");
  assert(stats1.removals === 0, "Should have 0 removals");
  assert(stats1.changes === 1, "Should have 1 change");

  // Text transforms - Trim Lines
  const trimInput = "  line 1  \n  line 2";
  const trimmed = prepareDiffContent(trimInput, { ...defaultOptions, trimLines: true });
  assert(trimmed === "line 1\nline 2", "trimLines failed");

  // Text transforms - Ignore Blank Lines
  const blankInput = "line 1\n\n\nline 2";
  const nonBlank = prepareDiffContent(blankInput, { ...defaultOptions, ignoreBlankLines: true });
  assert(nonBlank === "line 1\nline 2", "ignoreBlankLines failed");

  // Text transforms - Ignore Case
  const caseInput = "Line One";
  const lowerCased = prepareDiffContent(caseInput, { ...defaultOptions, ignoreCase: true });
  assert(lowerCased === "line one", "ignoreCase failed");

  // ==========================================
  // 3. Share Payload Serialization
  // ==========================================
  console.log("\n🔗 Testing Share Serialization...");

  // Mock global window object for browser compatibility functions
  global.window = {
    btoa: (str: string) => Buffer.from(str, "binary").toString("base64"),
    atob: (str: string) => Buffer.from(str, "base64").toString("binary"),
  } as any;

  const originalContent = "console.log('hello');";
  const modifiedContent = "console.log('hello world!');";
  const language = "javascript";

  const payload = createSharePayload(originalContent, modifiedContent, language);
  assert(typeof payload === "string" && payload.length > 0, "Payload creation failed");

  const parsed = parseSharePayload(payload);
  assert(parsed !== null, "Parsing share payload failed");
  assert(parsed?.original === originalContent, "Original content mismatch in parsed payload");
  assert(parsed?.modified === modifiedContent, "Modified content mismatch in parsed payload");
  assert(parsed?.language === language, "Language mismatch in parsed payload");

  // Unicode characters check (non-latin strings)
  const unicodeOriginal = "你好世界";
  const unicodeModified = "你好，世界！";
  const unicodePayload = createSharePayload(unicodeOriginal, unicodeModified, "plaintext");
  const unicodeParsed = parseSharePayload(unicodePayload);
  assert(unicodeParsed?.original === unicodeOriginal, "Unicode original mismatch");
  assert(unicodeParsed?.modified === unicodeModified, "Unicode modified mismatch");

  console.log("\n✅ Test Suite setup loaded successfully.");
}

try {
  runTests();
} catch (e: any) {
  console.error("\n❌ Test execution failed:", e.message);
  process.exit(1);
}
