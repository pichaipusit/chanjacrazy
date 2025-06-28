"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const PROFILE_OPTIONS = [
  "/race/pirate.png",
  "/race/cat-glasses.png",
  "/race/cool.png",
];
export default function RaceProfilePick() {
  const [finalProfileImage, setFinalProfileImage] = useState<string | null>(
    null
  );
  const [showSelection, setShowSelection] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("winnerAvatar");
      if (stored) {
        setFinalProfileImage(stored);
      }
    }
  }, []);

  const handleSelect = (src: string) => {
    localStorage.setItem("selectedAvatar", src);
    router.push("/shit-to-flag");
  };

  return (
    <div className="flex flex-col items-center w-full relative  text-white mb-4 ">
      {showSelection && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-50  p-4 rounded-xl">
          <div className="flex space-x-4">
            {PROFILE_OPTIONS.map((src) => (
              <Image
                key={src}
                src={src}
                alt="option"
                width={60}
                height={60}
                onClick={() => handleSelect(src)}
                className="cursor-pointer rounded-full border-2 border-white hover:scale-105 transition-transform"
              />
            ))}
          </div>
        </div>
      )}
      {finalProfileImage ? (
        <Image
          src={finalProfileImage}
          alt="avatar"
          width={50}
          height={50}
          className="rounded-full"
          onClick={() => setShowSelection(!showSelection)}
        />
      ) : (
        <div
          className="w-24 h-24 bg-gray-700 rounded-full"
          onClick={() => setShowSelection(!showSelection)}
        />
      )}
    </div>
  );
}
