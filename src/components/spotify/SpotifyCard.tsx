"use client";
import { getSpotifySong, SpotifySong } from "@/actions/getSpotifySong";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
export const SpotifyCard: React.FC = () => {
  const [song, setSong] = useState<SpotifySong | null>(null);

  useEffect(() => {
    const fetchSong = async () => {
      const fetchedSong = await getSpotifySong();
      setSong(fetchedSong);
    };
    fetchSong();
    setInterval(fetchSong, 10000); // Refresh every 60 seconds
  }, []);

  if (!song) {
    return (
      <div className="grid relative min-h-15 min-w-15 items-center gap-4 transition-all duration-300 group animate-opacityPulse ">
        <div className="absolute z-[999999] left-2 rounded-full w-12 h-auto aspect-square bg-zinc-600 spotify-image " />
        <div className="relative w-40 overflow-hidden h-full group-hover:bg-zinc-800/90 md:lg:flex hidden items-center bg-zinc-800/80 backdrop-blur-md  rounded-full">
          <div className=" w-full h-full bg-zinc-500 object-center blur-[2px] object-cover absolute right-0 top-0 -z-10 opacity-20" />
        </div>
      </div>
    );
  }

  if (!song.isPlaying) {
    return <></>;
  }

  return (
    <Link href={song.songUrl} target="_blank" className="">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        key={song.title}
        className="grid relative min-h-15 min-w-15 items-center gap-4 transition-all duration-300 group "
      >
        <div className="absolute z-[999999] spotify-image">
          <Image
            src={song.albumImageUrl}
            alt={song.album}
            width={100}
            height={100}
            className="rounded-full w-16 h-auto "
          />
          <Image
            src={song.albumImageUrl}
            alt={song.album}
            width={100}
            height={100}
            className="absolute scale-105 inset-0 m-auto -z-[99] blur-xs rounded-full w-16 h-auto animate-pulse"
          />
        </div>
        <div className="relative overflow-hidden h-full group-hover:bg-zinc-800/90 md:lg:flex hidden items-center bg-zinc-800/80 backdrop-blur-md  rounded-full">
          <div className="px-3 py-2 pl-18 flex items-center">
            <p className="font-bold z-[99999]">{song.title}</p>
          </div>
          <Image
            src={song.albumImageUrl}
            alt={song.album}
            width={400}
            height={400}
            className=" w-full h-full object-center blur-[2px] object-cover absolute right-0 top-0 -z-10 opacity-20"
          />
        </div>
      </motion.div>
    </Link>
  );
};
