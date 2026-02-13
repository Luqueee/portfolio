"use server";
import { getRedisClient, refreshAccessToken } from "@/redis";
import { SpotifyCurrentSong } from "@/types/spotify";
const SPOTIFY_API_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";

export interface SpotifySong {
  isPlaying: boolean;
  timestamp: number;
  progress_ms: number
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
}

export const getSpotifySong = async (): Promise<SpotifyCurrentSong | null> => {
  const client = await getRedisClient();

  const raw_cache_song = await client.get("spotify_current_song");

  if (raw_cache_song) {
    console.log("✅ Returning cached currently playing song from Redis");
    return JSON.parse(raw_cache_song) as SpotifyCurrentSong;
  }

  let ACCESS_TOKEN = await client.get("spotify_access_token");
  // console.log("Current Spotify access token:", ACCESS_TOKEN);
  if (!ACCESS_TOKEN) {
    ACCESS_TOKEN = await refreshAccessToken();
  }

  let response = await fetch(SPOTIFY_API_URL, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  // console.log("Fetching currently playing song from Spotify API");

  // console.log(
  //   "Spotify currently playing response status:",
  //   response.status,
  //   response.status === 204
  // );

  if (response.status === 401) {
    // Token expired, refresh it
    ACCESS_TOKEN = await refreshAccessToken();

    // Retry the request with the new token
    response = await fetch(SPOTIFY_API_URL, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
  }

  if (response.status === 204 || response.status > 400) {
    return null
  }

  console.log("✅ Fetched currently playing song from Spotify API");

  const data = (await response.json()) as SpotifyCurrentSong;

  // console.log("Spotify currently playing data:", data);

  await client.set("spotify_current_song", JSON.stringify(data), {
    EX: 30, // Cache for 30 seconds
  });

  return data;
};
