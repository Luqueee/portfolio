"use server";
import { getRedisClient, refreshAccessToken } from "@/redis";
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
  return currentlyPlaying;
};
