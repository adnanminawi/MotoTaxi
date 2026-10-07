"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDriverRides } from "@/services/admin";
import type { DriverRide } from "@/types";

export default function DriverRidesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [rides, setRides] = useState<DriverRide[]>([]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const data = await getDriverRides(Number(id));
        setRides(data);
      } catch (err) {
        console.error("Error fetching driver rides:", err);
        setRides([]);
      }
    };
    fetchRides();
  }, [id]);

  const getStatusStyle = (status: DriverRide["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "searching":
        return "bg-yellow-100 text-yellow-700";
      case "assigned":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      {/* 🔙 BACK (previous page) */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black transition text-lg font-medium"
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Driver #{id}</h1>
        <p className="text-gray-500 text-lg mt-2">
          All rides history & assignments
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">

        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Rides List</h2>
          <span className="text-lg text-gray-500">
            Total: <b>{rides.length}</b>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-5 text-lg">Customer</th>
                <th className="text-left p-5 text-lg">Pickup</th>
                <th className="text-left p-5 text-lg">Dropoff</th>
                <th className="text-left p-5 text-lg">Status</th>
              </tr>
            </thead>

            <tbody>
              {rides.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-5 text-xl font-semibold">{r.customer_name}</td>
                  <td className="p-5 text-lg text-gray-700">{r.pickup_address}</td>
                  <td className="p-5 text-lg text-gray-700">{r.destination_address}</td>
                  <td className="p-5">
                    <span className={`px-4 py-2 rounded-full text-base font-semibold ${getStatusStyle(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}