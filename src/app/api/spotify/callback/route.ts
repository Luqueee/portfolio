import { getRedisClient } from "@/redis";
import { NextResponse } from "next/server";

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;

export async function GET(request: Request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  console.log("Spotify authorization code:", code);

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code not found in query parameters" },
      { status: 400 }
    );
  }
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    json: true,
  };

  const response = await fetch(authOptions.url, {
    method: "POST",
    headers: authOptions.headers,
    body: new URLSearchParams(authOptions.form),
  });
  const data = (await response.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
  };
  // console.log("Spotify token response:", data);

  const client = await getRedisClient();

  await client.set("spotify_access_token", data.access_token);
  await client.set("spotify_refresh_token", data.refresh_token);

  return NextResponse.json({ message: "Spotify callback received" });
}

// https://accounts.spotify.com/authorize?client_id=189c6ed998d442d3bca1578cef3f2a1c&response_type=code&redirect_uri=https://preview.luqueee.dev/api/spotify/callback&scope=user-read-currently-playing

// ip 207.180.214.117
