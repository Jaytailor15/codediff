import { NextResponse } from "next/server";

// URL shortening has been upgraded to a 100% secure, private, client-side delta-patch LZW compression engine.
// This route is deprecated to guarantee that user source code never leaves the browser.
export async function POST() {
  return NextResponse.json(
    { error: "Deprecated. Sharing is now securely computed client-side." },
    { status: 410 }
  );
}
