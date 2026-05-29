import fs from "fs";
import path from "path";

const STORE_FILE = path.join(process.cwd(), ".next", "kv-store.json");

// Direct fetch calls to Vercel KV REST API to maintain a completely dependency-free architecture
async function upstashCall(
  command: "get" | "set",
  key: string,
  value?: string
): Promise<string | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    if (command === "set") {
      const response = await fetch(`${url}/set/${key}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: value,
      });
      if (!response.ok) {
        throw new Error(`Vercel KV set failed: ${response.statusText}`);
      }
      return "OK";
    } else {
      const response = await fetch(`${url}/get/${key}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Vercel KV get failed: ${response.statusText}`);
      }
      const data = await response.json();
      return data.result || null;
    }
  } catch (error) {
    console.error("Vercel KV API error:", error);
    return null;
  }
}

// Local file system fallback for development on localhost
function localStoreGet(key: string): string | null {
  try {
    if (!fs.existsSync(STORE_FILE)) {
      return null;
    }
    const content = fs.readFileSync(STORE_FILE, "utf-8");
    const data = JSON.parse(content);
    return data[key] || null;
  } catch (error) {
    console.error("Local KV get fallback failed:", error);
    return null;
  }
}

function localStoreSet(key: string, value: string): void {
  try {
    const dir = path.dirname(STORE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let data: Record<string, string> = {};
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, "utf-8");
      try {
        data = JSON.parse(content);
      } catch {
        data = {};
      }
    }
    data[key] = value;
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Local KV set fallback failed:", error);
  }
}

export async function getKV(key: string): Promise<string | null> {
  const isProd = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  if (isProd) {
    return await upstashCall("get", key);
  }
  return localStoreGet(key);
}

export async function setKV(key: string, value: string): Promise<void> {
  const isProd = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  if (isProd) {
    await upstashCall("set", key, value);
    return;
  }
  localStoreSet(key, value);
}
