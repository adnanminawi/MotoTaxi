"use client";
import { useEffect, useState } from "react";
import { getCustomers } from "@/services/admin";
import type { Customer } from "@/types";
import Link from "next/link";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data= await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all registered customers</p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white border border-gray-200 shadow-md rounded-xl p-5 overflow-x-auto">
          <table className="w-full bg-white border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left text-gray-800 font-semibold border-b">Name</th>
                <th className="p-3 text-left text-gray-800 font-semibold border-b">Phone</th>
                <th className="p-3 text-left text-gray-800 font-semibold border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 text-gray-700">{c.name}</td>
                  <td className="p-3 text-gray-700">{c.phone}</td>
                  <td className="p-3">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition"
                    >
                      View
                    </Link>
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
