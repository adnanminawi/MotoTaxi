"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/admin/StatCard";
import RideChart from "@/components/admin/RideChart";
import DriverChart from "@/components/admin/DriverChart";
import { Stats } from "@/types";
import { getStats } from "@/services/admin";

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.log("Error loading stats:", err);
    }
  }

if (!stats) return <p className="p-10">Loading...</p>;
  

return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-10">
        📊 Statistics Dashboard
      </h1>

      {/* STATS CARDS */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">

        <StatCard
          title="Customers"
          value={stats.total_customers}
          icon="👥"
          color="bg-blue-500"
        />

        <StatCard
          title="Drivers"
          value={stats.total_drivers}
          icon="🚗"
          color="bg-green-500"
        />

        <StatCard
          title="Total Rides"
          value={stats.total_rides}
          icon="🛵"
          color="bg-purple-500"
        />

        <StatCard
          title="Completed"
          value={stats.completed_rides}
          icon="✅"
          color="bg-emerald-500"
        />

        <StatCard
          title="Searching"
          value={stats.searching_rides}
          icon="🟡"
          color="bg-yellow-500"
        />

        <StatCard
          title="Cancelled"
          value={stats.cancelled_rides}
          icon="❌"
          color="bg-red-500"
        />

      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-8 mt-12">

        <RideChart
          completed={stats.completed_rides}
          searching={stats.searching_rides}
          cancelled={stats.cancelled_rides}
        />

        <DriverChart
          online={stats.online}
          busy={stats.busy}
          offline={stats.offline}
        />

      </div>

    </div>
  );
}