"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function ScheduleMeetingButton({ size = 50 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const btnSize = typeof size === "number" ? size : parseInt(size, 10);

  const handleSchedule = () => {
    // alert(`Meeting scheduled on ${date}`);
    setIsOpen(false);
  };

  return (
    <div className="fixed right-6 bottom-30 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Schedule a meeting"
        style={{ width: btnSize, height: btnSize }}
        className="relative flex items-center justify-center rounded-full shadow-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white focus:outline-none focus:ring-4 focus:ring-blue-300/40 transition-transform transform hover:-translate-y-0.5 active:translate-y-0.5"
      >
        {/* Calendar Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 text-white"
        >
          <path
            d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 
                   0-2 .9-2 2v14c0 1.1.9 2 
                   2 2h14c1.1 0 2-.9 
                   2-2V6c0-1.1-.9-2-2-2zm0 
                   16H5V9h14v11z"
          />
        </svg>
      </button>

      {isOpen && (
        // <div className="w-full  overflow-y-auto p-4">
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl relative max-h-[70vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Schedule a Meeting
            </h2>
            <div className="w-full  overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Picker */}
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
              />
              <form>
              <label className="block mb-2 text-sm text-gray-600">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-2 mb-4"
              />
              <label className="block mb-2 text-sm text-gray-600">
                Phone Number
              </label>
              <input
                type=""
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full border rounded-lg p-2 mb-4"
              />
              <label className="block mb-2 text-sm text-gray-600">E-mail</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-2 mb-4"
              />
              <label className="block mb-2 text-sm text-gray-600">
                Message
              </label>
              <input
                type="text-area"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-lg p-2 mb-4"
              />

              {/* Confirm Button */}
              <button
                onClick={handleSchedule}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Confirm
              </button>
              </form>
            </div>
            </div>
            
          </div>
        </div>
        //  </div>
        
      )}
    </div>
  );
}
