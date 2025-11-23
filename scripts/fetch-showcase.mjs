// #!/usr/bin/env node
// import { promises as fs } from "node:fs";
// import path from "node:path";
// import { fileURLToPath } from "node:url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const projectRoot = path.join(__dirname, "..");
// const configPath = path.join(__dirname, "showcase.config.json");
// const outputPath = path.join(projectRoot, "src/data/showcase.json");

// async function readConfig() {
//     const raw = await fs.readFile(configPath, "utf8");
//     return JSON.parse(raw);
// }

// function stripQuotes(value) {
//     const trimmed = value.trim();
//     if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("\'") && trimmed.endsWith("\'"))) {
//         return trimmed.slice(1, -1);
//     }
//     return trimmed;
// }

// async function readTokenFromEnvFile(filePath) {
//     try {
//         const raw = await fs.readFile(filePath, "utf8");
//         const lines = raw.split(/\r?\n/);
//         for (const line of lines) {
//             const trimmed = line.trim();
//             if (!trimmed || trimmed.startsWith("#")) continue;
//             const match = trimmed.match(/^GITHUB_TOKEN\s*=\s*(.+)$/);
//             if (match) {
//                 return stripQuotes(match[1]);
//             }
//         }
//     } catch (error) {
//         if (error.code !== "ENOENT") {
//             throw error;
//         }
//     }
//     return null;
// }

// async function loadTokenFromFiles() {
//     const candidates = [
//         path.join(projectRoot, ".env.local"),
//         path.join(projectRoot, ".env"),
//         path.join(projectRoot, ".env.production"),
//         path.join(projectRoot, ".env.development"),
//     ];

//     for (const candidate of candidates) {
//         const token = await readTokenFromEnvFile(candidate);
//         if (token) return token;
//     }

//     return null;
// }

// async function ensureToken() {
//     const envToken = process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim();
//     if (envToken) return envToken;

//     if (process.env.GITHUB_TOKEN_FILE) {
//         const fileToken = stripQuotes(await fs.readFile(process.env.GITHUB_TOKEN_FILE, "utf8"));
//         if (fileToken) return fileToken;
//     }

//     const fileToken = await loadTokenFromFiles();
//     if (fileToken) return fileToken.trim();

//     throw new Error(
//         "GITHUB_TOKEN is required. Export it (export GITHUB_TOKEN=xxx) or add it to a .env/.env.local file before running this script."
//     );
// }

// async function fetchFile({ repo, ref, file }, token) {
//     const url = `https://raw.githubusercontent.com/${repo}/${ref}/${file}`;
//     const res = await fetch(url, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "User-Agent": "showcase-fetcher"
//         }
//     });

//     if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Failed to fetch ${repo} ${file}@${ref}: ${res.status} ${res.statusText}\n${text}`);
//     }

//     return res.text();
// }

// function normaliseRanges(ranges = []) {
//     return ranges.map(([start, end]) => {
//         const safeStart = Math.max(1, Number(start));
//         const safeEnd = Math.max(safeStart, Number(end ?? start));
//         return [safeStart, safeEnd];
//     });
// }

// async function writeOutput(items) {
//     const dir = path.dirname(outputPath);
//     await fs.mkdir(dir, { recursive: true });
//     const payload = JSON.stringify(items, null, 2);
//     await fs.writeFile(outputPath, `${payload}\n`, "utf8");
// }

// async function run() {
//     const token = await ensureToken();
//     const config = await readConfig();

//     const strictMode = ["1", "true", "yes"].includes(String(process.env.SHOWCASE_STRICT ?? "").toLowerCase());
//     const enriched = [];
//     const failures = [];

//     for (const entry of config) {
//         let code = "";
//         let error = null;

//         try {
//             code = await fetchFile(entry, token);
//             console.log(`✅ fetched ${entry.repo}/${entry.file}`);
//         } catch (err) {
//             error = err;
//             failures.push({ entry, error });
//             console.warn(`⚠️  skipped ${entry.repo}/${entry.file}: ${err.message || err}`);
//         }

//         enriched.push({
//             ...entry,
//             code,
//             fetchError: error ? (error.message || String(error)) : undefined
//         });
//     }

//     await writeOutput(enriched);
//     console.log(`\n✨ Saved ${enriched.length} showcase entries to ${path.relative(process.cwd(), outputPath)}`);

//     if (failures.length > 0) {
//         console.warn("\nSome entries could not be fetched:");
//         for (const { entry, error } of failures) {
//             console.warn(`• ${entry.repo}/${entry.file}@${entry.ref}: ${error.message || error}`);
//         }
//         if (strictMode) {
//             throw new Error(`${failures.length} showcase source${failures.length === 1 ? "" : "s"} failed`);
//         }
//     }
// }

// run().catch((error) => {
//     console.error("\n❌ Showcase fetch failed:");
//     console.error(error.message || error);
//     process.exitCode = 1;
// });
