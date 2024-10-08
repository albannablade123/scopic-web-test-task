import { Tooltip } from "@nextui-org/react";
import { EyeIcon, EditIcon, DeleteIcon } from "./icons";
import { FormEvent, MouseEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const parseDateString = (dateString: string): Date => {
  // Create a Date object from the provided dateString
  return new Date(dateString);
};

interface CountdownTimerProps {
  start_time: string; // The start time of the auction
  time: string; // The end time of the auction
}

export default function CountdownTimer({
  start_time,
  time,
}: CountdownTimerProps) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [closingTime, setClosingTime] = useState(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const start = parseDateString(start_time);
      const end = parseDateString(time);
      if (now < start) {
        // Auction has not started yet
        const difference = start.getTime() - now.getTime();
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setDays(d);
        setHours(h);
        setMinutes(m);
        setSeconds(s);

        setStatus("Upcoming");
      } else if (now > end) {
        // Auction has ended
        setStatus("Closed");
      } else {
        setStatus("Ongoing");
      }
      const target = parseDateString(time);
      const difference = target.getTime() - now.getTime();

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      const s = Math.floor((difference % (1000 * 60)) / 1000);
      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);

      if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
        setClosingTime(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {status === "Upcoming" && (
        <div>
          <h1 className="font-semibold">Auction Starts In:</h1>
          <div className="flex justify-center items-center p-6 bg-beige rounded-lg shadow-md">
            <div className="flex space-x-4 mt-2">
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
                <span className="text-4xl font-bold text-gray-800">{days}</span>
                <span className="text-sm font-medium text-gray-600">Days</span>
              </div>
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
                <span className="text-4xl font-bold text-gray-800">
                  {hours}
                </span>
                <span className="text-sm font-medium text-gray-600">Hours</span>
              </div>
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
                <span className="text-4xl font-bold text-gray-800">
                  {minutes}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  Minutes
                </span>
              </div>
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
                <span className="text-4xl font-bold text-gray-800">
                  {seconds}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  Seconds
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {status === "Closed" && (
        <div className="flex justify-center items-center p-6 bg-beige rounded-lg shadow-md">
          <h1 className="font-semibold">This Auction is now Closed</h1>
        </div>
      )}
      {status === "Ongoing" && (
        <div className="flex justify-center items-center p-6 bg-beige rounded-lg shadow-md">
          <div className="flex space-x-4">
            <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
              <span className="text-4xl font-bold text-gray-800">{days}</span>
              <span className="text-sm font-medium text-gray-600">Days</span>
            </div>
            <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
              <span className="text-4xl font-bold text-gray-800">{hours}</span>
              <span className="text-sm font-medium text-gray-600">Hours</span>
            </div>
            <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
              <span className="text-4xl font-bold text-gray-800">
                {minutes}
              </span>
              <span className="text-sm font-medium text-gray-600">Minutes</span>
            </div>
            <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
              <span className="text-4xl font-bold text-gray-800">
                {seconds}
              </span>
              <span className="text-sm font-medium text-gray-600">Seconds</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
