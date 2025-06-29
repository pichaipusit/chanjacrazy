"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import RaceProfilePick from "./RaceProfilePick";

const WORDS = [
  ["คูล", "ซุปเปอร์", "เมก้า", "ไฮเปอร์", "บ้าๆบอๆ"],
  ["แมว", "หมา", "หมี", "สุนัขจิ้งจอก", "เสือ"],
  ["ปรมาจารย์", "เจ้าชาย", "ฮีโร่", "พ่อมด", "ราชินี"],
  ["สายฟ้า", "จรวด", "หัวร้อน", "ไร้เทียมทาน", "มือโปร"],
];

export default function SlotMachine() {
  const [slots, setSlots] = useState(["", "", "", ""]);
  const [running, setRunning] = useState([true, true, true, true]);
  const [finalUsername, setFinalUsername] = useState("");
  const [stopCount, setStopCount] = useState(0);

  useEffect(() => {
    const intervals = running.map((isRunning, index) => {
      if (!isRunning) return null;
      return setInterval(() => {
        setSlots((prev) => {
          const next = [...prev];
          const words = WORDS[index];
          next[index] = words[Math.floor(Math.random() * words.length)];
          return next;
        });
      }, 100);
    });

    return () =>
      intervals.forEach((interval) => interval && clearInterval(interval));
  }, [running]);

  const handleStop = () => {
    if (stopCount < 4) {
      setRunning((prev) => {
        const next = [...prev];
        next[stopCount] = false;
        return next;
      });
      const nextCount = stopCount + 1;
      setStopCount(nextCount);
      if (nextCount === 4) {
        setTimeout(() => {
          setFinalUsername(slots.join(""));
        }, 200);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  min-h-screen bg-gray-900 text-white p-4">
      <RaceProfilePick />

      <div className="mb-8 text-xl ">
        {finalUsername ? (
          <span className="font-mono text-green-300">{finalUsername}</span>
        ) : (
          <span className="font-mono text-slate-400">no name</span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 text-2xl font-bold mb-8">
        {slots.map((word, i) => (
          <div
            key={i}
            className="text-base w-24 h-24 flex items-center justify-center bg-gray-800 rounded-xl shadow-md"
          >
            {word}
          </div>
        ))}
      </div>
      <Button onClick={handleStop} className="bg-pink-500 hover:bg-pink-600">
        Stop
      </Button>
    </div>
  );
}
