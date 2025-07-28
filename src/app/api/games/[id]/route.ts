import { getGameDetails } from "@/lib/igdb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: gameId } = await params;

  if (!gameId) {
    return NextResponse.json({ error: "Game ID is required" }, { status: 400 });
  }

  try {
    const game = await getGameDetails(parseInt(gameId));
    
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
