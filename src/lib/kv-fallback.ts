import fs from "fs";
import path from "path";
import { createClient } from "redis";

const STORE_FILE = path.join(process.cwd(), ".next", "kv-store.json");

let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  const url = process.env.REDIS_URL;
  if (!url) {
    return null;
  }

  if (redisClient?.isOpen) {
    return redisClient;
  }

  try {
    redisClient = createClient({
      url,
      socket: {
        reconnectStrategy: (retries: number) => Math.min(retries * 50, 1000),
      },
    });

    redisClient.on("error", (err: Error) => {
      console.error("Redis connection error:", err);
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error("Redis initialization failed:", error);
    return null;
  }
}

// Local file system fallback for development when REDIS_URL is not set
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
  const client = await getRedisClient();
  if (client) {
    try {
      return await client.get(key);
    } catch (err) {
      console.error("Redis get failed, falling back to local storage:", err);
    }
  }
  return localStoreGet(key);
}

export async function setKV(key: string, value: string): Promise<void> {
  const client = await getRedisClient();
  if (client) {
    try {
      // Store the payload securely with a generous 30-day automatic expiration (2592000 seconds)
      await client.set(key, value, { EX: 2592000 });
      return;
    } catch (err) {
      console.error("Redis set failed, falling back to local storage:", err);
    }
  }
  localStoreSet(key, value);
}
