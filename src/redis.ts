"use server";
import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

export async function refreshAccessToken() {
  const client = await getRedisClient();
  const refreshToken = await client.get("spotify_refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  await client.set("spotify_access_token", data.access_token, {
    EX: data.expires_in,
  });

  return data.access_token;
}

export async function getRedisClient() {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL;

    redisClient = createClient({
      url: redisUrl,
    });

    redisClient.on("error", (err) => console.log("Redis Client Error", err));

    await redisClient.connect();

    console.log("Connected to Redis");
  }

  return redisClient;
}
