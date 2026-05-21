import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const REQUIRED = ["NEXT_PUBLIC_SUPABASE_URL"];
const OPTIONAL_AUTH_KEYS = ["SUPABASE_ACCESS_TOKEN"];

function getEnv(name) {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : "";
}

async function loadEnvFile(filePath) {
  try {
    const raw = await readFile(filePath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx < 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      if (!key || process.env[key]) continue;
      let value = trimmed.slice(eqIdx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  } catch {
    // Ignore missing env files.
  }
}

function parseProjectRef(supabaseUrl) {
  try {
    const host = new URL(supabaseUrl).hostname;
    return host.split(".")[0] || "";
  } catch {
    return "";
  }
}

async function runQuery(projectRef, token, query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, read_only: false })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase API ${res.status}: ${text}`);
  }
}

async function main() {
  await loadEnvFile(resolve(process.cwd(), ".env.local"));
  await loadEnvFile(resolve(process.cwd(), ".env"));

  for (const key of REQUIRED) {
    if (!getEnv(key)) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }

  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const projectRef = parseProjectRef(supabaseUrl);
  if (!projectRef) {
    throw new Error("Could not parse project ref from NEXT_PUBLIC_SUPABASE_URL");
  }

  const token = getEnv("SUPABASE_ACCESS_TOKEN");

  if (!token) {
    throw new Error("Missing auth token. Set SUPABASE_ACCESS_TOKEN (Supabase personal access token).");
  }

  const schemaSqlPath = resolve(process.cwd(), "supabase", "schema.sql");
  const seedSqlPath = resolve(process.cwd(), "supabase", "seed.sql");
  const schemaSql = await readFile(schemaSqlPath, "utf8");
  const seedSql = await readFile(seedSqlPath, "utf8");

  console.log(`Applying schema to project ${projectRef}...`);
  await runQuery(projectRef, token, schemaSql);
  console.log("Schema applied.");

  console.log("Applying seed data...");
  await runQuery(projectRef, token, seedSql);
  console.log("Seed applied.");

  console.log("Done.");
}

main().catch((error) => {
  console.error("Seed failed.");
  console.error(error.message);
  console.error(
    `Tried auth env vars (in order): ${OPTIONAL_AUTH_KEYS.join(", ")}`
  );
  process.exit(1);
});
