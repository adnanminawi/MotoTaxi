"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getOnlineDrivers } from "@/services/admin";
import type { OnlineDriver } from "@/types";

// point default icons at the CDN (bundlers break the default paths)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// fit the map to the drivers ONCE, so the admin can zoom freely afterwards
function FitDriversOnce({ drivers }: { drivers: OnlineDriver[] }) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (hasFitted.current || drivers.length === 0) return;
    const bounds = drivers.map(
      (d) => [Number(d.current_lat), Number(d.current_lng)] as [number, number]
    );
    map.fitBounds(bounds, { padding: [40, 40] });
    hasFitted.current = true;
  }, [drivers, map]);

  return null;
}

export default function LiveDriversMap() {
  const [drivers, setDrivers] = useState<OnlineDriver[]>([]);

  useEffect(() => {
    async function load() {
      try {
        setDrivers(await getOnlineDrivers());
      } catch (err) {
        console.error("Failed loading drivers:", err);
      }
    }
    load();
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <MapContainer center={[33.8938, 35.5018]} zoom={10} style={{ height: "100%", width: "100%" }}>
      <FitDriversOnce drivers={drivers} />
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {drivers.map((d) => (
        <Marker key={d.id} position={[Number(d.current_lat), Number(d.current_lng)]}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg">{d.name}</h3>
              <p>
                Status:
                <span className="text-green-600 ml-1 font-semibold">{d.status}</span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}