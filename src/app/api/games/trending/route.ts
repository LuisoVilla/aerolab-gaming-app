import { NextRequest, NextResponse } from "next/server";
import { getTrendingGames } from "../../../../lib/igdb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const games = await getTrendingGames(limit);
    
    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching trending games:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending games" },
      { status: 500 }
    );
  }
}
