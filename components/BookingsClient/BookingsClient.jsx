"use client";

import { useState } from "react";
import { pullAllBookings, refreshBookings } from "@/lib/actions";
import AllBookings from "@/components/allBookings/allBookings";
import { Hotel, TrendingUp, Refresh } from "@mui/icons-material";

export default function BookingsClient({ initialBookings, user }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.firstNight) > new Date()
  ).length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshBookings(user.teamId);
      const updatedBookings = await pullAllBookings(user.teamId);
      setBookings(updatedBookings);
      window.location.reload();
    } catch (error) {
      console.error("Error refreshing bookings:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="p-0 sm:p-6 pb-2">
      <div className="mx-auto">
        <header className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
            <button
              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-base rounded-lg flex items-center transition duration-300 ${
                isRefreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <Refresh
                className={`mr-1 sm:mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                fontSize="small"
              />
              <span className="hidden sm:inline">
                {isRefreshing ? "Refreshing..." : "Pull Bookings"}
              </span>
              <span className="sm:hidden">{isRefreshing ? "..." : "Pull"}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center">
              <Hotel className="text-blue-500 mr-4" style={{ fontSize: 40 }} />
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-semibold">{totalBookings}</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 flex items-center">
              <TrendingUp
                className="text-green-500 mr-4"
                style={{ fontSize: 40 }}
              />
              <div>
                <p className="text-sm text-gray-500">Upcoming Bookings</p>
                <p className="text-2xl font-semibold">{upcomingBookings}</p>
              </div>
            </div>
          </div>
        </header>

        <AllBookings bookings={bookings} />
      </div>
    </div>
  );
}
