"use server";
import { getRedisClient, refreshAccessToken } from "@/redis";
import { RedirectStatusCode } from "next/dist/client/components/redirect-status-code";
const SPOTIFY_API_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";

export interface SpotifySong {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
}

export const getSpotifySong = async (): Promise<SpotifySong> => {
  const client = await getRedisClient();

  const raw_cache_song = await client.get("spotify_current_song");

  if (raw_cache_song) {
    console.log("✅ Returning cached currently playing song from Redis");
    return JSON.parse(raw_cache_song) as SpotifySong;
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

  console.log("Fetching currently playing song from Spotify API");

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
    return {
      isPlaying: false,
      title: "",
      artist: "",
      album: "",
      albumImageUrl: "",
      songUrl: "",
    };
  }

  const data = (await response.json()) as {
    is_playing: boolean;
    item: {
      name: string;
      artists: { name: string }[];
      album: {
        name: string;
        images: { url: string }[];
      };
      external_urls: {
        spotify: string;
      };
    };
  };
  const currentlyPlaying = {
    isPlaying: data.is_playing,
    title: data.item?.name,
    artist: data.item?.artists.map((artist: any) => artist.name).join(", "),
    album: data.item?.album?.name,
    albumImageUrl: data.item?.album?.images[0]?.url,
    songUrl: data.item?.external_urls?.spotify,
  };

  await client.set("spotify_current_song", JSON.stringify(currentlyPlaying), {
    EX: 30, // Cache for 30 seconds
  });

  return currentlyPlaying;
};
