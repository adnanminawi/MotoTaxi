"use client";

import { useEffect } from "react";
import { updateLocation } from "@/services/driver";

type GPSStreamProps = {
  driverId?: number;
  isActive: boolean;
};

export default function GPSStream({ driverId, isActive }: GPSStreamProps) {
  useEffect(() => {
    if (!isActive || !driverId) return;

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await updateLocation(latitude, longitude);
          } catch (err) {
            console.error("Failed to send location:", err);
          }
        },
        (err) => {
          console.error("Geolocation error:", err.message);
        }
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isActive, driverId]);

  return null;
}