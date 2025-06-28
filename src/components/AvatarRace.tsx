"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AvatarRace() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [userPosition, setUserPosition] = useState(0);
  const [botPosition, setBotPosition] = useState(0);
  const [winner, setWinner] = useState<"user" | "bot" | null>(null);
  const [finalProfileImage, setFinalProfileImage] = useState<string | null>(
    null
  );
  const [count, setCount] = useState<number>(3);

  const router = useRouter();

  const FLAG_POSITION = 80; // in percentage of container height

  useEffect(() => {
    let botInterval: NodeJS.Timeout;
    if (gameStarted && !winner) {
      botInterval = setInterval(() => {
        setBotPosition((prev) => {
          const next = prev + Math.random() * 3;
          if (next >= FLAG_POSITION) {
            setWinner("bot");
            return FLAG_POSITION;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(botInterval);
  }, [gameStarted, winner]);

  useEffect(() => {
    if (userPosition >= FLAG_POSITION && !winner) {
      setWinner("user");
    }
  }, [userPosition, winner]);

  useEffect(() => {
    if (winner) {
      setTimeout(() => {
        setFinalProfileImage(
          winner === "user" ? selectedImage : "/race/poop.png"
        );
      }, 1000);
    }
  }, [winner, selectedImage]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedAvatar");
    if (stored) {
      setSelectedImage(stored);
    }
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameStarted(true);
    }
  }, [count]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (finalProfileImage) {
      timeout = setTimeout(() => {
        localStorage.setItem("winnerAvatar", finalProfileImage);
        router.push("/");
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [finalProfileImage]);

  const handleTap = () => {
    if (gameStarted && !winner) {
      setUserPosition((prev) => Math.min(prev + 3, FLAG_POSITION));
    }
  };

  if (finalProfileImage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h2 className="text-2xl mb-4">Your Profile Image</h2>
        <Image
          src={finalProfileImage}
          alt="profile"
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>
    );
  } else {
    return (
      <div
        onClick={handleTap}
        className="relative min-h-screen bg-black text-white overflow-hidden "
      >
        <section className=" w-full text-center text-xl pt-4 space-y-10">
          <h2 className="text-3xl ">Shit to the flag</h2>
          <p className="text-base ">รูปที่ถึงธงก่อนจะถูกตั้งเป็นรูปโปรไฟล์</p>
          <p
            className="text-3xl select-none
"
          >
            🚩
          </p>
        </section>
        <div className="absolute left-1/4 w-1 h-full bg-slate-400"></div>
        <div className="absolute left-3/4 w-1 h-full bg-slate-400"></div>
        <div
          className="absolute left-1/4 transform -translate-x-1/2"
          style={{ bottom: `${userPosition}%` }}
        >
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="user"
              width={50}
              height={50}
              className="rounded-full"
            />
          )}
        </div>
        <div
          className="absolute left-3/4 transform -translate-x-1/2"
          style={{ bottom: `${botPosition}%` }}
        >
          <Image src="/race/poop.png" alt="bot" width={50} height={50} />
        </div>

        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center flex-col space-y-4">
            <p className="text-slate-400">กดรัวๆเพื่อวิ่งขึ้น</p>
            <h2 className="text-3xl">{count} </h2>
          </div>
        )}
      </div>
    );
  }
}
