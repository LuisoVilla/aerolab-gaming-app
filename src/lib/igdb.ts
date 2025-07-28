// src/lib/igdb.ts
const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const IGDB_API_URL = "https://api.igdb.com/v4/games";

let accessToken: string = "";

async function getAccessToken(): Promise<string> {
  if (accessToken) return accessToken;

  const res = await fetch(`${TWITCH_TOKEN_URL}?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`, {
    method: "POST",
  });

  const data = await res.json();

  if (!res.ok) throw new Error("Error getting Twitch access token: " + JSON.stringify(data));

  accessToken = data.access_token;
  return accessToken;
}

export async function searchGames(query: string) {
  const token = await getAccessToken();

  const response = await fetch(IGDB_API_URL, {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "text/plain",
    },
    body: `search "${query}"; fields id, name, summary, cover.url; limit 20;`,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`IGDB API error: ${error}`);
  }

  return await response.json();
}

export async function getPopularGames(limit: number = 20) {
  const token = await getAccessToken();

  const response = await fetch(IGDB_API_URL, {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "text/plain",
    },
    body: `fields id, name, summary, cover.url, rating, rating_count, popularity; 
           where rating >= 80 & rating_count >= 100 & cover != null; 
           sort popularity desc; 
           limit ${limit};`,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`IGDB API error: ${error}`);
  }

  return await response.json();
}

export async function getTrendingGames(limit: number = 20) {
  const token = await getAccessToken();

  const response = await fetch(IGDB_API_URL, {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "text/plain",
    },
    body: `fields id, name, summary, cover.url, rating, first_release_date; 
           where first_release_date >= 1640995200 & rating >= 75 & cover != null; 
           sort rating desc; 
           limit ${limit};`,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`IGDB API error: ${error}`);
  }

  return await response.json();
}

export async function getGameDetails(gameId: number) {
  const token = await getAccessToken();

  const response = await fetch(IGDB_API_URL, {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "text/plain",
    },
    body: `fields id, name, summary, cover.url, rating, rating_count, first_release_date, 
           involved_companies.company.name, genres.name, platforms.name, 
           screenshots.url, similar_games.name, similar_games.cover.url, similar_games.id; 
           where id = ${gameId};`,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`IGDB API error: ${error}`);
  }

  const games = await response.json();
  return games.length > 0 ? games[0] : null;
}
