"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRides } from "@/services/admin";
import { RideInfo } from "@/types";
export default function RidesPage() {
   const router = useRouter();
  const [rides, setRides] = useState<RideInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const data =await getRides();
        setRides(data);
      } catch (err) {
        console.log("Error fetching rides:", err);
        setRides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  // 🎯 LABEL (what user sees)
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";

      case "Searching":
      case "searching":
        return "Searching";

      case "assigned":
      case "accepted":
        return "Assigned";

      case "cancelled":
        return "Cancelled";

      default:
        return status;
    }
  };

  // 🎨 BADGE COLORS
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";

      case "Searching":
      case "searching":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "assigned":
      case "accepted":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Rides Management
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading rides...</p>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Driver</th>
                <th className="p-4">Pickup</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assign Driver</th>
              </tr>
            </thead>

            <tbody>
              {(rides ?? []).map((ride) => (
                <tr key={ride.id} className="border-t hover:bg-gray-50">

                  <td className="p-4 font-medium">
                    {ride.customer_name}
                  </td>

                  <td className="p-4 text-gray-600">
                    {ride.driver_name ?? "Not assigned"}
                  </td>

                  <td className="p-4 text-gray-600">
                    {ride.pickup_address}
                  </td>

                  <td className="p-4 text-gray-600">
                    {ride.destination_address}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                        ride.status
                      )}`}
                    >
                      {getStatusLabel(ride.status)}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <button onClick={() =>router.push(`/admin/rides/${ride.id}/assign`)}
                      className="px-4 py-2 text-sm font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition">
                      Assign Driver
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}
    </div>
  );
}