"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/services/admin";
import {
  LayoutDashboard,
  Users,
  CarTaxiFront,
  UserCircle,
  BarChart3,
  LogOut,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Drivers",
    icon: UserCircle,
    href: "/admin/drivers",
  },
  {
    title: "Customers",
    icon: Users,
    href: "/admin/customers",
  },
  {
    title: "Rides",
    icon: CarTaxiFront,
    href: "/admin/rides",
  },
  {
    title: "Statistics",
    icon: BarChart3,
    href: "/admin/statistics",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
  await logout();   // service function calling /api/admin/logout
  window.location.href = "/admin/login";
}

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800 flex flex-col">

      {/* HEADER */}
      <div className="p-8 border-b border-slate-800">

        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          🚖 Moto Admin
        </h1>

        <p className="text-slate-400 mt-2">
          Control Center
        </p>

      </div>

      {/* MENU */}
      <nav className="flex-1 p-5 space-y-2">

        {menu.map((item) => {

          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl p-4 transition-all duration-300
              ${
                active
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:translate-x-2"
              }`}
            >
              <Icon size={22} />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}

      </nav>

      {/* LOGOUT */}
      <div className="p-5">

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 py-3 text-white font-semibold hover:bg-red-600 transition"
        >
          <LogOut />
          Logout
        </button>

      </div>

    </aside>
  );
}