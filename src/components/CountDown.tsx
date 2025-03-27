"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
interface CountDownProps {
  banUntil: Date;
}

export default function CountDown({ banUntil }: CountDownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const _banUntil = new Date(banUntil);
      const difference = _banUntil.getTime() - now.getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
      setLoading(false);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit: React.FC<{ value: number; label: string }> = ({
    value,
    label,
  }) => (
    <div className="flex flex-col items-center">
      <div className="text-4xl font-bold text-indigo-600">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-xs uppercase text-gray-500">{label}</div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
      {loading ? (
        <>
          <div className="flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-indigo-500 animate-spin-slow mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Tiempo restante de ban
            </h2>
          </div>
          <CountdownSkeleton />
        </>
      ) : (
        <>
          <div className="flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-indigo-500 animate-spin-slow mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Tiempo restante de ban
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <TimeUnit value={timeLeft.days} label="Días" />
            <TimeUnit value={timeLeft.hours} label="Horas" />
            <TimeUnit value={timeLeft.minutes} label="Minutos" />
            <TimeUnit value={timeLeft.seconds} label="Segundos" />
          </div>
        </>
      )}
    </div>
  );
}

const CountdownSkeleton = () => {
  return (
    <div className="flex items-center justify-center gap-8">
      {/* Days */}
      <div className="flex flex-col items-center">
        <Skeleton className="h-12 w-14 bg-purple-100/50" />
        <Skeleton className="mt-1 h-4 w-8" />
      </div>

      {/* Hours */}
      <div className="flex flex-col items-center">
        <Skeleton className="h-12 w-14 bg-purple-100/50" />
        <Skeleton className="mt-1 h-4 w-10" />
      </div>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <Skeleton className="h-12 w-14 bg-purple-100/50" />
        <Skeleton className="mt-1 h-4 w-12" />
      </div>

      {/* Seconds */}
      <div className="flex flex-col items-center">
        <Skeleton className="h-12 w-14 bg-purple-100/50" />
        <Skeleton className="mt-1 h-4 w-14" />
      </div>
    </div>
  );
};
