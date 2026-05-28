import { NextResponse } from "next/server";
import { structuredPatch } from "diff";
import type { DiffApiRequest, DiffApiResponse } from "@/types/diff";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<DiffApiRequest>;

    if (
      typeof payload.original !== "string" ||
      typeof payload.modified !== "string"
    ) {
      return NextResponse.json(
        { error: "Both original and modified content are required." },
        { status: 400 }
      );
    }

    const patch = structuredPatch(
      payload.originalFileName ?? "original",
      payload.modifiedFileName ?? "modified",
      payload.original,
      payload.modified,
      "",
      "",
      { context: 4 }
    );

    const response: DiffApiResponse = {
      patch,
      changedLines: patch.hunks.reduce(
        (total, hunk) =>
          total + hunk.lines.filter((line) => /^[+-]/.test(line)).length,
        0
      )
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Unable to generate diff." },
      { status: 500 }
    );
  }
}
