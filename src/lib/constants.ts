import { env } from "./env";

export const DEFAULT_ORIGINAL = `function calculateInvoice(items) {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

console.log(calculateInvoice([{ price: 12, quantity: 2 }]));`;

export const DEFAULT_MODIFIED = `function calculateInvoice(items, taxRate = 0.08) {
  const subtotal = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return Number((subtotal * (1 + taxRate)).toFixed(2));
}

console.log(calculateInvoice([{ price: 12, quantity: 2 }], 0.1));`;

export const SUPPORTED_LANGUAGES = [
  { label: "Auto", value: "plaintext", extensions: ["txt", "log"] },
  {
    label: "JavaScript",
    value: "javascript",
    extensions: ["js", "mjs", "cjs", "jsx"]
  },
  { label: "TypeScript", value: "typescript", extensions: ["ts", "tsx"] },
  { label: "JSON", value: "json", extensions: ["json"] },
  { label: "HTML", value: "html", extensions: ["html", "htm"] },
  { label: "CSS", value: "css", extensions: ["css", "scss", "sass", "less"] },
  { label: "Python", value: "python", extensions: ["py"] },
  { label: "Java", value: "java", extensions: ["java"] },
  { label: "PHP", value: "php", extensions: ["php"] },
  { label: "SQL", value: "sql", extensions: ["sql"] },
  { label: "XML", value: "xml", extensions: ["xml", "svg"] },
  { label: "YAML", value: "yaml", extensions: ["yaml", "yml"] },
  { label: "Markdown", value: "markdown", extensions: ["md", "mdx"] },
  { label: "Go", value: "go", extensions: ["go"] },
  { label: "Rust", value: "rust", extensions: ["rs"] },
  { label: "C++", value: "cpp", extensions: ["cpp", "cc", "cxx", "hpp", "h"] },
  { label: "Shell", value: "shell", extensions: ["sh", "bash", "zsh"] }
] as const;

export const ACCEPTED_FILE_EXTENSIONS = SUPPORTED_LANGUAGES.flatMap(
  (language) => language.extensions
)
  .map((extension) => `.${extension}`)
  .join(",");

export const MAX_HISTORY_ITEMS = 8;

export const APP_VERSION = env.appVersion;

