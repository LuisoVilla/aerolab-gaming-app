// src/app/api/games/route.ts
import { searchGames } from "@/lib/igdb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "zelda";

  try {
    const games = await searchGames(query);
    return NextResponse.json(games);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
