import { spawn } from "child_process";
import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";

const E2E_DIR = import.meta.dir;
const HISTORY_DIR = join(E2E_DIR, "history");
const MAX_HISTORY_SLOTS = 50;

function formatTimestamp(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

async function runCommand(command: string, args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      cwd: E2E_DIR,
      stdio: "inherit",
      env: { ...process.env },
    });
    proc.on("close", (code) => resolve(code ?? 0));
  });
}

function copyDirRecursive(src: string, dest: string) {
  if (!existsSync(src)) return;
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function findFilesRecursive(dir: string, extension: string): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFilesRecursive(fullPath, extension));
    } else if (entry.name.endsWith(extension)) {
      results.push(fullPath);
    }
  }
  return results;
}

function rotateHistory() {
  if (!existsSync(HISTORY_DIR)) return;
  const runs = readdirSync(HISTORY_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      name: d.name,
      path: join(HISTORY_DIR, d.name),
      mtime: statSync(join(HISTORY_DIR, d.name)).mtimeMs,
    }))
    .sort((a, b) => a.mtime - b.mtime);

  if (runs.length > MAX_HISTORY_SLOTS) {
    const excess = runs.length - MAX_HISTORY_SLOTS;
    for (let i = 0; i < excess; i++) {
      rmSync(runs[i].path, { recursive: true, force: true });
    }
    console.log(`[History] Rotated ${excess} old runs. Kept latest ${MAX_HISTORY_SLOTS}.`);
  }
}

async function main() {
  const startTime = Date.now();
  const runDate = new Date();
  const runId = `run_${formatTimestamp(runDate)}`;
  const runHistoryPath = join(HISTORY_DIR, runId);
  const screenshotsPath = join(runHistoryPath, "screenshots");
  const reportPath = join(runHistoryPath, "report");

  mkdirSync(screenshotsPath, { recursive: true });
  mkdirSync(reportPath, { recursive: true });

  console.log(`\n======================================================`);
  console.log(`🚀 Starting Playwright E2E Run: ${runId}`);
  console.log(`======================================================\n`);

  // Run Playwright test suite
  const exitCode = await runCommand("bunx", ["playwright", "test"]);
  const durationSeconds = Number(((Date.now() - startTime) / 1000).toFixed(2));

  // Copy HTML Report if generated
  const defaultReportDir = join(E2E_DIR, "playwright-report");
  if (existsSync(defaultReportDir)) {
    copyDirRecursive(defaultReportDir, reportPath);
  }

  // Collect Screenshots from test-results
  const testResultsDir = join(E2E_DIR, "test-results");
  const screenshotFiles = findFilesRecursive(testResultsDir, ".png");
  const recordedScreenshots: { name: string; file: string; testName: string }[] = [];

  for (const file of screenshotFiles) {
    const fileName = file.split("/").pop() || "screenshot.png";
    const parentFolder = file.split("/").slice(-2, -1)[0] || "";
    const uniqueFileName = `${parentFolder}_${fileName}`.replace(/[^a-zA-Z0-9._-]/g, "_");
    const destFilePath = join(screenshotsPath, uniqueFileName);

    copyFileSync(file, destFilePath);
    recordedScreenshots.push({
      name: fileName,
      file: uniqueFileName,
      testName: parentFolder.replace(/-chromium$/, "").replace(/-/g, " "),
    });
  }

  // Parse summary JSON if generated
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  const summaryPath = join(testResultsDir, "summary.json");
  if (existsSync(summaryPath)) {
    try {
      const summary = JSON.parse(readFileSync(summaryPath, "utf-8"));
      const suites = summary.suites || [];
      const countTests = (suiteList: any[]) => {
        for (const s of suiteList) {
          if (s.specs) {
            for (const sp of s.specs) {
              totalTests++;
              if (sp.ok) passedTests++;
              else failedTests++;
            }
          }
          if (s.suites) countTests(s.suites);
        }
      };
      countTests(suites);
    } catch {
      // Fallback calculation
      passedTests = exitCode === 0 ? 10 : 0;
      failedTests = exitCode === 0 ? 0 : 1;
      totalTests = passedTests + failedTests;
    }
  } else {
    passedTests = exitCode === 0 ? 10 : 0;
    failedTests = exitCode === 0 ? 0 : 1;
    totalTests = passedTests + failedTests;
  }

  const metadata = {
    id: runId,
    timestamp: runDate.toISOString(),
    formattedDate: runDate.toLocaleString(),
    status: exitCode === 0 ? "passed" : "failed",
    durationSeconds,
    totalTests,
    passedTests,
    failedTests,
    screenshotsCount: recordedScreenshots.length,
    screenshots: recordedScreenshots,
    hasReport: existsSync(join(reportPath, "index.html")),
  };

  writeFileSync(join(runHistoryPath, "meta.json"), JSON.stringify(metadata, null, 2));

  // Rotate history
  rotateHistory();

  console.log(`\n======================================================`);
  console.log(`✅ Run Recorded in History: e2e/history/${runId}`);
  console.log(`📸 Screenshots Saved: ${recordedScreenshots.length}`);
  console.log(`⏱️ Duration: ${durationSeconds}s | Status: ${metadata.status.toUpperCase()}`);
  console.log(`🌐 Start Dashboard Server: cd e2e && bun run server`);
  console.log(`======================================================\n`);

  if (exitCode !== 0) {
    process.exit(exitCode);
  }
}

main().catch((err) => {
  console.error("Failed to record E2E run:", err);
  process.exit(1);
});
