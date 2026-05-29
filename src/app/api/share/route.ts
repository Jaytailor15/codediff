import { NextResponse } from "next/server";
import crypto from "crypto";
import { getKV, setKV } from "@/lib/kv-fallback";

function generateSlug(length = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const { payload } = (await request.json()) as { payload?: string };
    if (!payload || typeof payload !== "string") {
      return NextResponse.json(
        { error: "Valid payload string is required" },
        { status: 400 }
      );
    }

    const id = generateSlug(16);

    // Store the compressed LZW payload securely inside our key-value store
    await setKV(id, payload);

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Failed to save comparison to KV database:", error);
    return NextResponse.json(
      { error: "Failed to create share workspace" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || id.length !== 16) {
      return NextResponse.json(
        { error: "Invalid share identifier. Must be exactly 16 characters." },
        { status: 400 }
      );
    }

    const payload = await getKV(id);
    if (!payload) {
      return NextResponse.json(
        { error: "Shared comparison workspace not found or expired." },
        { status: 404 }
      );
    }

    return NextResponse.json({ payload });
  } catch (error) {
    console.error("Failed to read comparison from KV database:", error);
    return NextResponse.json(
      { error: "Failed to load shared workspace" },
      { status: 500 }
    );
  }
}
