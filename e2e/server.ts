import { readdirSync, existsSync, readFileSync, statSync } from "fs";
import { join, extname } from "path";

const E2E_DIR = import.meta.dir;
const HISTORY_DIR = join(E2E_DIR, "history");
const PORT = Number(process.env.E2E_PORT || 4040);

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

interface RunMeta {
  id: string;
  timestamp: string;
  formattedDate: string;
  status: "passed" | "failed";
  durationSeconds: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  screenshotsCount: number;
  screenshots: { name: string; file: string; testName: string }[];
  hasReport: boolean;
}

function getHistoricalRuns(): RunMeta[] {
  if (!existsSync(HISTORY_DIR)) return [];

  const runDirs = readdirSync(HISTORY_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      name: d.name,
      path: join(HISTORY_DIR, d.name),
      mtime: statSync(join(HISTORY_DIR, d.name)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime); // Latest first

  const runs: RunMeta[] = [];
  for (const dir of runDirs) {
    const metaPath = join(dir.path, "meta.json");
    if (existsSync(metaPath)) {
      try {
        const meta = JSON.parse(readFileSync(metaPath, "utf-8")) as RunMeta;
        runs.push(meta);
      } catch (err) {
        console.error(`Error reading ${metaPath}:`, err);
      }
    }
  }
  return runs;
}

function renderDashboardHtml(runs: RunMeta[], selectedRunId?: string): string {
  const selectedRun = (selectedRunId && runs.find((r) => r.id === selectedRunId)) || runs[0] || null;

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fortlio E2E Test History & Screenshots</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#f5f3ff',
              500: '#8b5cf6',
              600: '#7c3aed',
              700: '#6d28d9',
            }
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-thumb { background: #374151; border-radius: 9999px; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
  <!-- Top Navigation Header -->
  <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
    <div class="flex items-center gap-3">
      <div class="size-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-purple-600/30">
        F
      </div>
      <div>
        <h1 class="text-base font-bold text-white flex items-center gap-2">
          Fortlio E2E Test History
          <span class="text-xs px-2 py-0.5 rounded-full font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
            ${runs.length} Runs Recorded
          </span>
        </h1>
        <p class="text-xs text-slate-400">Playwright Visual Run Inspector & Screenshots Gallery</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button onclick="window.location.reload()" class="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        Refresh
      </button>
    </div>
  </header>

  <!-- Main Container -->
  <div class="flex-1 flex overflow-hidden">
    <!-- Left Sidebar: Historical Runs List -->
    <aside class="w-80 border-r border-slate-800 bg-slate-900/40 overflow-y-auto p-4 space-y-2 shrink-0">
      <div class="flex items-center justify-between pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <span>Test Executions</span>
        <span>${runs.length} / 35</span>
      </div>

      ${runs.length === 0 ? `
        <div class="text-center py-12 text-slate-500 text-xs">
          No test runs recorded yet.<br>Run <code>bun run test:record</code> to capture a run.
        </div>
      ` : runs.map((run) => {
    const isSelected = selectedRun && selectedRun.id === run.id;
    const isPassed = run.status === 'passed';
    return `
          <a href="/?run=${run.id}" class="block p-3 rounded-xl border transition-all ${isSelected
        ? 'bg-purple-950/40 border-purple-500/50 shadow-md ring-1 ring-purple-500/30'
        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
      }">
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isPassed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
      }">
                <span class="size-1.5 rounded-full ${isPassed ? 'bg-emerald-400' : 'bg-rose-400'}"></span>
                ${run.status}
              </span>
              <span class="text-[11px] font-mono text-slate-400">${run.durationSeconds}s</span>
            </div>

            <p class="text-xs font-semibold text-slate-200 truncate">${run.formattedDate}</p>
            <div class="flex items-center justify-between mt-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
              <span>Tests: <strong class="text-slate-300">${run.passedTests}/${run.totalTests}</strong></span>
              <span>📸 <strong class="text-slate-300">${run.screenshotsCount}</strong></span>
            </div>
          </a>
        `;
  }).join('')}
    </aside>

    <!-- Right Panel: Run Details & Screenshots -->
    <main class="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      ${!selectedRun ? `
        <div class="flex flex-col items-center justify-center h-96 text-slate-500 space-y-2">
          <p class="text-sm">Select a test execution from the sidebar to inspect screenshots and reports.</p>
        </div>
      ` : `
        <!-- Selected Run Banner Card -->
        <div class="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <div class="flex items-center gap-2.5 mb-1">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${selectedRun.status === 'passed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
    }">
                  ● ${selectedRun.status.toUpperCase()}
                </span>
                <h2 class="text-xl font-bold text-white font-mono">${selectedRun.id}</h2>
              </div>
              <p class="text-xs text-slate-400">${selectedRun.formattedDate}</p>
            </div>

            <div class="flex items-center gap-3">
              ${selectedRun.hasReport ? `
                <a href="/history/${selectedRun.id}/report/index.html" target="_blank" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all">
                  <span>Open Full HTML Report</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
              ` : ''}
            </div>
          </div>

          <!-- Quick Stat Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-center">
              <span class="text-xs text-slate-400">Total Scenarios</span>
              <p class="text-xl font-bold text-white mt-0.5">${selectedRun.totalTests}</p>
            </div>
            <div class="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-center">
              <span class="text-xs text-slate-400">Passed</span>
              <p class="text-xl font-bold text-emerald-400 mt-0.5">${selectedRun.passedTests}</p>
            </div>
            <div class="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-center">
              <span class="text-xs text-slate-400">Execution Time</span>
              <p class="text-xl font-bold text-white mt-0.5">${selectedRun.durationSeconds}s</p>
            </div>
            <div class="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-center">
              <span class="text-xs text-slate-400">Screenshots</span>
              <p class="text-xl font-bold text-purple-400 mt-0.5">${selectedRun.screenshotsCount}</p>
            </div>
          </div>
        </div>

        <!-- Screenshots Gallery -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              📸 Captured Screenshots Gallery
              <span class="text-xs font-mono text-slate-400">(${selectedRun.screenshots.length} captured)</span>
            </h3>
            <p class="text-xs text-slate-400">Click any screenshot to zoom in full resolution</p>
          </div>

          ${selectedRun.screenshots.length === 0 ? `
            <div class="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-500 text-xs">
              No screenshots captured during this run.
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              ${selectedRun.screenshots.map((s, idx) => `
                <div class="group rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm hover:border-purple-500/50 transition-all flex flex-col">
                  <div class="p-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
                    <p class="text-xs font-semibold text-slate-200 capitalize truncate" title="${s.testName}">
                      ${s.testName}
                    </p>
                    <span class="text-[10px] text-slate-500 font-mono">#${idx + 1}</span>
                  </div>

                  <div class="relative bg-slate-950 flex items-center justify-center p-2 cursor-pointer overflow-hidden aspect-video" onclick="openModal('/history/${selectedRun.id}/screenshots/${s.file}', '${s.testName}')">
                    <img src="/history/${selectedRun.id}/screenshots/${s.file}" alt="${s.name}" class="object-cover w-full h-full rounded border border-slate-800/50 group-hover:scale-102 transition-transform duration-200" loading="lazy" />
                    <div class="absolute inset-0 bg-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span class="px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-semibold shadow-lg">Zoom</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `}
    </main>
  </div>

  <!-- Zoom Lightbox Modal -->
  <div id="imageModal" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm hidden items-center justify-center p-4" onclick="closeModal()">
    <div class="relative max-w-6xl w-full max-h-[92vh] flex flex-col items-center" onclick="event.stopPropagation()">
      <div class="w-full flex items-center justify-between pb-3 text-white">
        <h4 id="modalTitle" class="text-sm font-semibold truncate">Screenshot</h4>
        <button onclick="closeModal()" class="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer">&times;</button>
      </div>
      <img id="modalImage" src="" alt="Full view" class="max-w-full max-h-[82vh] rounded-lg border border-slate-800 object-contain shadow-2xl" />
    </div>
  </div>

  <script>
    function openModal(src, title) {
      document.getElementById('modalImage').src = src;
      document.getElementById('modalTitle').textContent = title;
      const modal = document.getElementById('imageModal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
    function closeModal() {
      const modal = document.getElementById('imageModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  </script>
</body>
</html>`;
}

const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // API: List all historical runs
    if (pathname === "/api/runs") {
      const runs = getHistoricalRuns();
      return Response.json(runs);
    }

    // Serve History Screenshots: /history/:runId/screenshots/:file
    if (pathname.startsWith("/history/") && pathname.includes("/screenshots/")) {
      const parts = pathname.replace(/^\/history\//, "").split("/");
      const runId = parts[0];
      const filename = parts.slice(2).join("/");
      const filePath = join(HISTORY_DIR, runId, "screenshots", filename);

      if (existsSync(filePath)) {
        const file = Bun.file(filePath);
        return new Response(file, {
          headers: { "Content-Type": "image/png" },
        });
      }
      return new Response("Screenshot Not Found", { status: 404 });
    }

    // Serve Playwright HTML Report: /history/:runId/report/*
    if (pathname.startsWith("/history/") && pathname.includes("/report/")) {
      const parts = pathname.replace(/^\/history\//, "").split("/");
      const runId = parts[0];
      const subpath = parts.slice(2).join("/") || "index.html";
      const filePath = join(HISTORY_DIR, runId, "report", subpath);

      if (existsSync(filePath)) {
        const ext = extname(filePath);
        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        const file = Bun.file(filePath);
        return new Response(file, {
          headers: { "Content-Type": contentType },
        });
      }
      return new Response("Report Asset Not Found", { status: 404 });
    }

    // Default: Web Dashboard
    if (pathname === "/" || pathname === "/index.html") {
      const runIdParam = url.searchParams.get("run") || undefined;
      const runs = getHistoricalRuns();
      const html = renderDashboardHtml(runs, runIdParam);
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`\n======================================================`);
console.log(`🖼️  Fortlio E2E History & Screenshot Server Running!`);
console.log(`🔗 Dashboard: http://localhost:${server.port}`);
console.log(`📂 History Directory: ${HISTORY_DIR}`);
console.log(`======================================================\n`);
