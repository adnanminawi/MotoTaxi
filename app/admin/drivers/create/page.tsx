"use client";

import { createDriver } from "@/services/admin";

import { useState } from "react";

export default function CreateDriver() {
  const [driver, setDriver] = useState({
    name: "",
    phone: "",
    password: "",
  });

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setDriver({
    ...driver,
    [e.target.name]: e.target.value,
  });
};

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const data = {name: driver.name , phone : driver.phone ,password: driver.password}
      try {
        await createDriver(data);
        alert("Driver added successfully.");
        setDriver({ name: "", phone: "", password: "" });
      } catch (error) {
        console.error(error);
        alert("Failed to create driver.");
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Add Driver
        </h1>

        <p className="text-center text-gray-500 text-sm mb-5">
          Create new driver account
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Driver Name"
            value={driver.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={driver.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={driver.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg text-sm transition"
          >
            Add Driver
          </button>
        </form>
      </div>
    </div>
  );
}