"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import RouteLine from "./RouteLine";
import type { RidePoint } from "@/types";

type DriverMapProps = {
  driverLocation: { lat?: number | string; lng?: number | string };
  target: RidePoint | null;
};

export default function DriverMap({ driverLocation, target }: DriverMapProps) {
  return (
    <div className="h-screen bg-[#f2f2f2] text-[#222] flex flex-col font-sans">
      <MapContainer center={[33.8938, 35.5018]} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <RouteLine from={driverLocation} to={target} showMarkers />
      </MapContainer>
    </div>
  );
}