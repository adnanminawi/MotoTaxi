"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

// default Leaflet icons break under bundlers, so point them at the CDN
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Point = { lat?: number | string; lng?: number | string };

type RouteLineProps = {
  from: Point | null;        // where the driver is
  to: Point | null;          // where they're heading
  showMarkers?: boolean;     // routing pins on/off
};

export default function RouteLine({ from, to, showMarkers = false }: RouteLineProps) {
  const map = useMap();

  // depend on numbers, not object references (objects are recreated every render)
  const fLat = Number(from?.lat);
  const fLng = Number(from?.lng);
  const tLat = Number(to?.lat);
  const tLng = Number(to?.lng);

  useEffect(() => {
    if (!fLat || !fLng || !tLat || !tLng) return;

    const plan = L.Routing.plan([L.latLng(fLat, fLng), L.latLng(tLat, tLng)], {
      addWaypoints: false,
      draggableWaypoints: false,
      ...(showMarkers ? {} : { createMarker: (() => false) as any }),
    });

    const routingControl = L.Routing.control({
      plan,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      show: false,
    }).addTo(map);

    return () => {
      try {
        map.removeControl(routingControl);
      } catch {
        // ignore async cleanup race
      }
    };
  }, [map, fLat, fLng, tLat, tLng, showMarkers]);

  return null;
}