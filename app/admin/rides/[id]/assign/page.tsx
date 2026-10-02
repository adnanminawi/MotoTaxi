"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { assignDriver, getDrivers } from "@/services/admin";
import { Driver } from "@/types";
export default function AssignRide() {

  const params = useParams();

  const rideId = params.id;

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverId, setDriverId] = useState("");
  const [updated, setUpdated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDrivers = async () =>{
      try{
        const data = await getDrivers();
        setDrivers(data);
      }catch(err){
        console.log("Error fetching drivers.");
        setDrivers([]);
      }
    };
    fetchDrivers();
  },[]);


const handleAssign = async () => {
  const data = { rideId: Number(rideId), driverId: Number(driverId) };
  try{
  await assignDriver(data);
  setUpdated(true);
  setTimeout(() => {
    router.push("/admin/rides");
  }, 1500);
  }catch(err){
  alert("Cannt assign driver");
  }};

  return (
    <div className="bg-white p-6 rounded-xl shadow">

{updated && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">

    <div className="bg-white px-8 py-6 rounded-2xl shadow-xl text-center animate-bounce">

      <div className="text-5xl mb-3">
        ⚡
      </div>

      <h2 className="text-xl font-bold text-green-600">
        Driver Updated!
      </h2>

      <p className="text-gray-500 mt-1">
        Ride assigned successfully
      </p>

    </div>

  </div>
)}
      <h2 className="text-xl font-bold mb-4">
        Assign Ride #{rideId}
      </h2>


      <select
        value={driverId}
        onChange={(e) => setDriverId(e.target.value)}
        className="border p-3 rounded w-full"
      >

        <option value="">
          Select Driver
        </option>


        {drivers.map((driver)=>(
          <option
            key={driver.id}
            value={driver.id}
          >
            {driver.name}
          </option>
        ))}

      </select>


      <button
        onClick={handleAssign}
        className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded"
      >
        Assign Driver
      </button>


    </div>
  );
}