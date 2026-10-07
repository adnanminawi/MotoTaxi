"use client";

import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, ResponsiveContainer } from "recharts";

type DriverChartProps = {
  online: number;
  busy: number;
  offline: number;
};

export default function DriverChart({ online, busy, offline }: DriverChartProps) {
  const data = [
    { status: "Online", value: online },
    { status: "Busy", value: busy },
    { status: "Offline", value: offline },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="font-bold text-xl mb-5">Driver Status</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 