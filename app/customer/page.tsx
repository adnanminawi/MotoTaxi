"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { fetchRideLocation, createRide } from "@/services/customer";
import { DriverLocation } from "@/types";
const Map = dynamic(() => import("@/components/CustomerMap"), { ssr: false });

export default function Page() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [rideId, setRideId] = useState<number | null>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation| null>(null);
  const [driverInfo, setDriverInfo]= useState<{ Name: string; Phone: string }>({ Name: "", Phone: "" });
  const [noDriver, setNoDriver] = useState(false);

  useEffect(() => {
    if (!rideId) return;
    const id = rideId
    async function loadLocation (){
      const data = await fetchRideLocation(id);
      setDriverLocation(data);
      if (data) {
        setDriverInfo({ Name: data.name, Phone: data.phone });
      }   
      else {
        setDriverInfo({ Name: "", Phone: "" });  
      }
    };
    loadLocation();
    const interval = setInterval(loadLocation , 10000);
    return () => clearInterval(interval);
  }, [rideId]);



  function handleSubmit() {
    if (!pickup || !destination) return;

    const data ={
      name,
      phone,
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      destination_lat: destination.lat,
      destination_lng: destination.lng,
    };
    async function Submit(){
      try{
        const s = await createRide(data);
        setRideId(s.rideId);
        setNoDriver(s.assignedDriver === null);
      }catch (error){
        console.log(error);
        alert ("Failed to book");
      }
    }
    Submit();
  }

  function reset() {
    setPickup(null);
    setDestination(null);
    setDriverLocation(null);
    setRideId(null);
    setNoDriver(false);
  }

  return (
    <div className="flex h-screen font-sans text-[#222]">
      <div className="w-80 bg-white p-5 flex flex-col gap-4 border-r border-gray-300">
        <div className="bg-[#f7f7f7] p-4 rounded-[10px] border border-[#e3e3e3]">
          <h3 className="text-[13px] font-semibold text-gray-500 mb-1.5">Book a Ride</h3>
          <div className="flex flex-col gap-3">
            <input
              className="p-2.5 rounded-md border border-gray-300 outline-none focus:border-[#f4c542]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <input
              className="p-2.5 rounded-md border border-gray-300 outline-none focus:border-[#f4c542]"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
            />
          </div>
        </div>

        <div className="bg-[#f7f7f7] p-4 rounded-[10px] border border-[#e3e3e3]">
          <h3 className="text-[13px] font-semibold text-gray-500 mb-1.5">Trip</h3>
          <p className="text-sm text-gray-700 my-1">Pickup: {pickup ? "Selected" : "Click on map"}</p>
          <p className="text-sm text-gray-700 my-1">Destination: {destination ? "Selected" : "Click on map"}</p>
        </div>

        <button
          className="w-full py-2.5 bg-[#f4c542] hover:bg-[#e6b93c] font-semibold text-sm cursor-pointer rounded-md text-black transition"
          onClick={handleSubmit}
        >
          Request Ride
        </button>
        <button
          className="w-full py-2.5 bg-[#e0e0e0] font-semibold text-sm cursor-pointer rounded-md text-black"
          onClick={reset}
        >
          Reset
        </button>
        {noDriver && <p className="text-red-500 text-sm">No driver available, please try again.</p>}

        
{rideId && !noDriver && driverInfo.Name && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white p-4 rounded-xl w-[280px] z-[1000] shadow-lg border-l-4 border-[#f4c542]">
            <h3 className="text-[15px] font-bold mb-2">🚨 Driver Info</h3>
            <p className="text-[13px] text-gray-600 my-1">Driver Name: {driverInfo.Name} {}</p>
            <p className="text-[13px] text-gray-600 my-1">Phone: {driverInfo.Phone}</p>
      </div>)}
       </div>

      
           
      <div className="flex-1 h-full relative overflow-hidden bg-[#dcdcdc]">
        <Map
          setPickup={setPickup}
          setDestination={setDestination}
          pickup={pickup}
          destination={destination}
          driverLocation={
            driverLocation
              ? { lat: Number(driverLocation.current_lat), lng: Number(driverLocation.current_lng) }
              : null
          }
        />
      </div>
      
    </div>
  );
}