"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import type { Dispatch, SetStateAction } from "react";
import L from "leaflet";
import RouteLine from "./RouteLine";

type LatLng = { lat: number; lng: number };
type SetLatLng = Dispatch<SetStateAction<LatLng | null>>;

// default Leaflet icons break under bundlers, so set them explicitly
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 35],
  iconAnchor: [10, 35],
});

const driverIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 35],
  iconAnchor: [10, 35],
});

type ClickHandlerProps = {
  pickup: LatLng | null;
  destination: LatLng | null;
  setPickup: SetLatLng;
  setDestination: SetLatLng;
};

function ClickHandler({ pickup, destination, setPickup, setDestination }: ClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      if (!pickup) {
        setPickup(e.latlng);
      } else if (!destination) {
        setDestination(e.latlng);
      }
    },
  });
  return null;
}

type CustomerMapProps = ClickHandlerProps & {
  driverLocation: LatLng | null;
};

export default function CustomerMap({
  driverLocation,
  pickup,
  destination,
  setPickup,
  setDestination,
}: CustomerMapProps) {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer center={[33.8938, 35.5018]} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler
          pickup={pickup}
          destination={destination}
          setPickup={setPickup}
          setDestination={setDestination}
        />
        {pickup && <Marker position={pickup} icon={icon} />}
        {destination && <Marker position={destination} icon={icon} />}
        {pickup && driverLocation && <RouteLine from={driverLocation} to={pickup} />}
        {driverLocation && <Marker position={driverLocation} icon={driverIcon} />}
      </MapContainer>
    </div>
  );
}