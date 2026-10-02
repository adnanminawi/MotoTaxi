"use client";
import { use, useEffect, useState } from "react";
import { oneCustomer, updateCustomer } from "@/services/admin";
import { Customer } from "@/types";
  export default function CustomerProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [customer, setCustomer] = useState<Customer>();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");

  useEffect(() => {
    async function getCustomer() {
      try {
        const profile = await oneCustomer(Number(id));
        setCustomer(profile);
        setName(profile.name);
        setPhone(profile.phone);
      } catch (error) {
        console.log(error);
      }
    }
    getCustomer();
  }, [id]);

  async function handleSave() {
   const data = {name: name, phone: phone};
   try{
    const res =await updateCustomer(Number(id),data);
    setCustomer((prev) => prev ? { ...prev, name, phone } : prev);;
    setIsEditing(false);
    setMessage("Customer updated successfully");
    }catch(err) {
      setMessage("Failed to update customer");
    }
  }

  function handleCancel() {
    setIsEditing(false);
    setName(customer?.name ?? "");
    setPhone(customer?.phone ?? "");
  }

  if (!customer) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-md">
            {name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">{customer.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Customer Profile</p>
        </div>

        {message && (
          <p className="mt-4 p-3 rounded-lg bg-blue-100 text-blue-800 text-center font-semibold">
            {message}
          </p>
        )}

        <div className="mt-8 space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <label className="text-xs text-gray-500">Full Name</label>
            {isEditing ? (
              <input
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <p className="mt-2 text-base font-semibold text-gray-900">{customer.name}</p>
            )}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <label className="text-xs text-gray-500">Phone Number</label>
            {isEditing ? (
              <input
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 outline-none focus:border-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            ) : (
              <p className="mt-2 text-base font-semibold text-gray-900">{customer.phone}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {isEditing ? (
            <>
              <button
                className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}