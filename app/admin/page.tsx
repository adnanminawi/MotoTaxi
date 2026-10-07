"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getStats } from "@/services/admin";
import type { Stats } from "@/types";
import RideChart from "@/components/admin/RideChart";
import { Users, UserRound, CarTaxiFront, CheckCircle, Clock, XCircle } from "lucide-react";

const LiveMap = dynamic(() => import("@/components/admin/LiveDriversMap"), {
  ssr: false,
});

export default function AdminDashboard() {
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getStats();
        setData(stats);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  const stats = [
    { title: "Total Drivers", value: data?.total_drivers ?? 0, icon: <CarTaxiFront /> },
    { title: "Total Customers", value: data?.total_customers ?? 0, icon: <Users /> },
    { title: "Total Rides", value: data?.total_rides ?? 0, icon: <UserRound /> },
    { title: "Completed", value: data?.completed_rides ?? 0, icon: <CheckCircle /> },
    { title: "Searching", value: data?.searching_rides ?? 0, icon: <Clock /> },
    { title: "Cancelled", value: data?.cancelled_rides ?? 0, icon: <XCircle /> },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded-xl shadow h-[320px]">
          <h2 className="font-semibold mb-2 text-sm">Live Drivers Map</h2>
          <div className="h-[260px] w-full rounded-lg overflow-hidden">
            <LiveMap />
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
          {stats.map((item) => (
            <div
              key={item.title}
              className="bg-white shadow rounded-xl p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-gray-500 text-xs">{item.title}</p>
                <h2 className="text-lg font-bold">{item.value}</h2>
              </div>
              <div className="text-blue-500 text-sm">{item.icon}</div>
            </div>
          ))}
        </div>
      </div>

      <RideChart
        completed={data?.completed_rides ?? 0}
        searching={data?.searching_rides ?? 0}
        cancelled={data?.cancelled_rides ?? 0}
      />
    </div>
  );
}