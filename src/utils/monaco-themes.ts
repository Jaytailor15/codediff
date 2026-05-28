/**
 * Premium custom Monaco editor themes.
 * These are drop-in theme definitions registered via monaco.editor.defineTheme.
 */

export const CUSTOM_THEMES: Record<string, { label: string; theme: any }> = {
  dracula: {
    label: "Dracula",
    theme: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6272a4", fontStyle: "italic" },
        { token: "keyword", foreground: "ff79c6" },
        { token: "identifier", foreground: "f8f8f2" },
        { token: "string", foreground: "f1fa8c" },
        { token: "number", foreground: "bd93f9" },
        { token: "regexp", foreground: "ffb86c" },
        { token: "type", foreground: "8be9fd" },
        { token: "class", foreground: "50fa7b" },
        { token: "function", foreground: "50fa7b" },
        { token: "operator", foreground: "ff79c6" }
      ],
      colors: {
        "editor.background": "#282a36",
        "editor.foreground": "#f8f8f2",
        "editor.lineHighlightBackground": "#44475a33",
        "editorLineNumber.foreground": "#6272a4",
        "editorLineNumber.activeForeground": "#ff79c6",
        "editor.selectionBackground": "#44475a88",
        "editor.inactiveSelectionBackground": "#44475a44",
        "editorCursor.foreground": "#f8f8f0",
        "editorWhitespace.foreground": "#6272a444"
      }
    }
  },
  "one-dark": {
    label: "One Dark Pro",
    theme: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "5c6370", fontStyle: "italic" },
        { token: "keyword", foreground: "c678dd" },
        { token: "identifier", foreground: "abb2bf" },
        { token: "string", foreground: "98c379" },
        { token: "number", foreground: "d19a66" },
        { token: "regexp", foreground: "56b6c2" },
        { token: "type", foreground: "e5c07b" },
        { token: "class", foreground: "e5c07b" },
        { token: "function", foreground: "61afef" },
        { token: "operator", foreground: "56b6c2" }
      ],
      colors: {
        "editor.background": "#282c34",
        "editor.foreground": "#abb2bf",
        "editor.lineHighlightBackground": "#2c313c",
        "editorLineNumber.foreground": "#4b5263",
        "editorLineNumber.activeForeground": "#61afef",
        "editor.selectionBackground": "#3e4451",
        "editorCursor.foreground": "#528bff",
        "editorWhitespace.foreground": "#3b4048"
      }
    }
  },
  nord: {
    label: "Nord Ice",
    theme: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "4c566a", fontStyle: "italic" },
        { token: "keyword", foreground: "81a1c1" },
        { token: "identifier", foreground: "d8dee9" },
        { token: "string", foreground: "a3be8c" },
        { token: "number", foreground: "b48ead" },
        { token: "regexp", foreground: "ebcb8b" },
        { token: "type", foreground: "8fbcbb" },
        { token: "class", foreground: "8fbcbb" },
        { token: "function", foreground: "88c0d0" },
        { token: "operator", foreground: "81a1c1" }
      ],
      colors: {
        "editor.background": "#2e3440",
        "editor.foreground": "#d8dee9",
        "editor.lineHighlightBackground": "#3b4252",
        "editorLineNumber.foreground": "#4c566a",
        "editorLineNumber.activeForeground": "#88c0d0",
        "editor.selectionBackground": "#434c5e",
        "editorCursor.foreground": "#d8dee9",
        "editorWhitespace.foreground": "#434c5e88"
      }
    }
  },
  monokai: {
    label: "Classic Monokai",
    theme: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "75715e", fontStyle: "italic" },
        { token: "keyword", foreground: "f92672" },
        { token: "identifier", foreground: "f8f8f2" },
        { token: "string", foreground: "e6db74" },
        { token: "number", foreground: "ae81ff" },
        { token: "regexp", foreground: "ae81ff" },
        { token: "type", foreground: "66d9ef" },
        { token: "class", foreground: "a6e22e" },
        { token: "function", foreground: "a6e22e" },
        { token: "operator", foreground: "f92672" }
      ],
      colors: {
        "editor.background": "#272822",
        "editor.foreground": "#f8f8f2",
        "editor.lineHighlightBackground": "#3e3d32",
        "editorLineNumber.foreground": "#75715e",
        "editorLineNumber.activeForeground": "#a6e22e",
        "editor.selectionBackground": "#49483e",
        "editorCursor.foreground": "#f8f8f0",
        "editorWhitespace.foreground": "#3b3a32"
      }
    }
  },
  "night-owl": {
    label: "Night Owl",
    theme: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "637777", fontStyle: "italic" },
        { token: "keyword", foreground: "c792ea" },
        { token: "identifier", foreground: "d6deeb" },
        { token: "string", foreground: "ecc48d" },
        { token: "number", foreground: "f78c6c" },
        { token: "regexp", foreground: "ecc48d" },
        { token: "type", foreground: "82aaff" },
        { token: "class", foreground: "ffcb8b" },
        { token: "function", foreground: "82aaff" },
        { token: "operator", foreground: "c792ea" }
      ],
      colors: {
        "editor.background": "#011627",
        "editor.foreground": "#d6deeb",
        "editor.lineHighlightBackground": "#00030a66",
        "editorLineNumber.foreground": "#4b6479",
        "editorLineNumber.activeForeground": "#c792ea",
        "editor.selectionBackground": "#1d3b53",
        "editorCursor.foreground": "#80a4c2",
        "editorWhitespace.foreground": "#1d3b5388"
      }
    }
  },
  "one-light": {
    label: "One Light",
    theme: {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "a0a1a7", fontStyle: "italic" },
        { token: "keyword", foreground: "a626a4" },
        { token: "identifier", foreground: "383a42" },
        { token: "string", foreground: "50a14f" },
        { token: "number", foreground: "986801" },
        { token: "regexp", foreground: "0184bc" },
        { token: "type", foreground: "c18401" },
        { token: "class", foreground: "c18401" },
        { token: "function", foreground: "4078f2" },
        { token: "operator", foreground: "0184bc" }
      ],
      colors: {
        "editor.background": "#fafafa",
        "editor.foreground": "#383a42",
        "editor.lineHighlightBackground": "#f0f0f0",
        "editorLineNumber.foreground": "#9d9d9f",
        "editorLineNumber.activeForeground": "#4078f2",
        "editor.selectionBackground": "#e5e5e6",
        "editorCursor.foreground": "#526fff",
        "editorWhitespace.foreground": "#d0d0d0"
      }
    }
  },
  "synthwave-84": {
    label: "Synthwave '84",
    theme: {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "848bb3", fontStyle: "italic" },
        { token: "keyword", foreground: "fede5d" },
        { token: "identifier", foreground: "f0eff1" },
        { token: "string", foreground: "ff7edb" },
        { token: "number", foreground: "f97e72" },
        { token: "regexp", foreground: "36f9f6" },
        { token: "type", foreground: "fe4450" },
        { token: "class", foreground: "36f9f6" },
        { token: "function", foreground: "36f9f6" },
        { token: "operator", foreground: "fede5d" }
      ],
      colors: {
        "editor.background": "#2b213a",
        "editor.foreground": "#f0eff1",
        "editor.lineHighlightBackground": "#37294d",
        "editorLineNumber.foreground": "#715b9b",
        "editorLineNumber.activeForeground": "#fede5d",
        "editor.selectionBackground": "#513a7588",
        "editorCursor.foreground": "#fede5d",
        "editorWhitespace.foreground": "#513a75"
      }
    }
  }
};

/**
 * Registers all custom themes with the Monaco Editor instance.
 */
export function registerCustomThemes(monaco: any) {
  Object.entries(CUSTOM_THEMES).forEach(([key, value]) => {
    monaco.editor.defineTheme(key, value.theme);
  });
}
