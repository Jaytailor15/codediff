import type { DiffStats } from "@/types/diff";

export function downloadTextFile(
  fileName: string,
  content: string,
  type = "text/plain;charset=utf-8"
) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function buildHtmlReport(params: {
  title: string;
  originalName: string;
  modifiedName: string;
  unifiedDiff: string;
  stats: DiffStats;
}) {
  const escapedDiff = escapeHtml(params.unifiedDiff);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(params.title)}</title>
  <style>
    body { margin: 0; background: #111318; color: #e5edf3; font-family: Inter, system-ui, sans-serif; }
    main { max-width: 1120px; margin: 0 auto; padding: 32px; }
    pre { overflow: auto; padding: 20px; border: 1px solid #2b313b; border-radius: 8px; background: #151922; line-height: 1.55; }
    .stats { display: flex; gap: 12px; flex-wrap: wrap; margin: 16px 0 24px; }
    .stat { border: 1px solid #2b313b; border-radius: 8px; padding: 10px 12px; background: #171c25; }
  </style>
</head>
<body>
  <main>
    <h1>${escapeHtml(params.title)}</h1>
    <p>${escapeHtml(params.originalName)} compared with ${escapeHtml(params.modifiedName)}</p>
    <section class="stats">
      <div class="stat">+${params.stats.additions} additions</div>
      <div class="stat">-${params.stats.removals} removals</div>
      <div class="stat">${params.stats.changes} changed lines</div>
    </section>
    <pre>${escapedDiff}</pre>
  </main>
</body>
</html>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[character];
  });
}
