import { useEffect, useState } from "react";
import {
  getAppointments,
  cancelAppointment,
  completeAppointment,
} from "../api/appointments";

import Card from "../components/Card";
import Button from "../components/Button";
import { theme } from "../styles/theme";

export default function AppointmentsPage({
  role,
  stylistName,
}) {
  const [appointments, setAppointments] = useState([]);

  const userName = localStorage.getItem("userName");

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // =========================
  // FILTER APPOINTMENTS
  // =========================
  const filteredAppointments =
  role === "stylist"
    ? appointments.filter(
        (appt) =>
          appt.stylist?.toLowerCase() ===
            stylistName?.toLowerCase() ||
          appt.second_stylist?.toLowerCase() ===
            stylistName?.toLowerCase()
      )
    : appointments;

  // =========================
  // SORT BY DATE
  // =========================
  const sortedAppointments = [...filteredAppointments].sort(
    (a, b) =>
      new Date(a.start_time) - new Date(b.start_time)
  );

  const today = new Date().toDateString();

  const todaysBookings =
    appointments.filter(
      appt =>
        new Date(
          appt.start_time
        ).toDateString() === today
    ).length;

  const activeStylists =
    new Set(
      appointments.map(
        appt => appt.stylist
      )
    ).size;

  const completedBookings =
    appointments.filter(
      appt =>
        appt.status === "completed"
    ).length;

  // =========================
  // ACTIONS
  // =========================
  const handleComplete = async (id) => {
    await completeAppointment(id);
    fetchAppointments();
  };

  const handleCancel = async (id) => {
    await cancelAppointment(id);
    fetchAppointments();
  };

  // =========================
  // PAGE TITLE
  // =========================
  const pageTitle =
    role === "admin"
      ? "Studio Dashboard"
      : `${stylistName}'s Schedule`;

      return (
        <div className="max-w-6xl mx-auto">
      
          <div className="mb-10">
            <h1 className="text-4xl font-bold">
              {pageTitle}
            </h1>
      
            <p className="text-gray-500 mt-2">
              Welcome back {userName}
            </p>

            {
              role === "admin" && (
                <div className="grid md:grid-cols-3 gap-5 mt-8">

                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <p className="text-gray-500">
                      Today's Bookings
                    </p>

                    <h2 className="text-4xl font-bold">
                      {todaysBookings}
                    </h2>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <p className="text-gray-500">
                      Active Stylists
                    </p>

                    <h2 className="text-4xl font-bold">
                      {activeStylists}
                    </h2>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <p className="text-gray-500">
                      Completed
                    </p>

                    <h2 className="text-4xl font-bold">
                      {completedBookings}
                    </h2>
                  </div>

                </div>
              )
            }
          </div>
      
          {sortedAppointments.length === 0 && (
            <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
              <h2 className="text-2xl font-semibold">
                No appointments found
              </h2>
      
              <p className="text-gray-500 mt-2">
                New bookings will appear here.
              </p>
            </div>
          )}
      
          <div className="grid gap-5">
      
            {sortedAppointments.map((appt) => {
      
              const formattedDate =
                new Date(
                  appt.start_time
                ).toLocaleString("en-KE", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                });
      
              return (
                <div
                  key={appt.id}
                  className="
                    bg-white
                    rounded-2xl
                    p-6
                    shadow-sm
                    flex
                    justify-between
                    items-center
                    flex-wrap
                    gap-4
                  "
                >
                  <div>
      
                    <h2 className="text-xl font-bold">
                      {appt.client_name}
                    </h2>
      
                    <p className="text-gray-500">
                      Stylist: {appt.stylist}
                    </p>

                    {
                      appt.second_stylist && (
                        <p className="text-gray-500">
                          Second Stylist: {appt.second_stylist}
                        </p>
                      )
                    }
      
                    <p className="text-gray-500">
                      {appt.service}
                    </p>
      
                    <p className="font-medium mt-2">
                      {formattedDate}
                    </p>
      
                    <span
                      className={`
                        inline-block
                        mt-3
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-semibold
                        ${
                          appt.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : appt.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >
                      {appt.status}
                    </span>
      
                  </div>
      
                  {role !== "client" &&
                    appt.status === "booked" && (
                      <div className="flex gap-3">
      
                        <button
                          onClick={() =>
                            handleComplete(appt.id)
                          }
                          className="
                            bg-green-600
                            text-white
                            px-4
                            py-2
                            rounded-xl
                          "
                        >
                          Complete
                        </button>
      
                        <button
                          onClick={() =>
                            handleCancel(appt.id)
                          }
                          className="
                            bg-red-600
                            text-white
                            px-4
                            py-2
                            rounded-xl
                          "
                        >
                          Cancel
                        </button>
      
                      </div>
                    )}
                </div>
              );
            })}
          </div>
      
        </div>
      );
}