import { useEffect, useState } from "react";
import { getAppointments } from "../api/appointments";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  // Logged in user's email
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getAppointments();

      const mine = data.filter(
        (appt) =>
          appt.client_email?.toLowerCase() ===
          userEmail?.toLowerCase()
      );

      setAppointments(mine);
    } catch (err) {
      console.error(err);
    }
  };

  const upcoming = appointments.filter(
    (appt) => new Date(appt.start_time) > new Date()
  );

  const history = appointments.filter(
    (appt) => new Date(appt.start_time) <= new Date()
  );

  return (
    <div className="max-w-6xl mx-auto">

      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          My Appointments
        </h1>

        <p className="text-gray-500 mt-2">
          View your upcoming and past bookings
        </p>
      </div>

      {/* Upcoming */}

      <h2 className="text-2xl font-bold mb-5">
        Upcoming Appointments
      </h2>

      <div className="grid gap-4 mb-10">

        {upcoming.length === 0 && (
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            No upcoming appointments
          </div>
        )}

        {upcoming.map((appt) => (

          <div
            key={appt.id}
            className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl"
          >
            <h3 className="font-bold text-xl">
              {appt.service}
            </h3>

            <p className="text-gray-500">
              Stylist: {appt.stylist}
            </p>

            {appt.second_stylist && (
              <p className="text-gray-500">
                Second Stylist: {appt.second_stylist}
              </p>
            )}

            <p className="mt-3">
              {new Date(appt.start_time).toLocaleString()}
            </p>

            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
              {appt.status}
            </span>
          </div>

        ))}

      </div>

      {/* History */}

      <h2 className="text-2xl font-bold mb-5">
        Booking History
      </h2>

      <div className="grid gap-4">

        {history.length === 0 && (
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            No booking history
          </div>
        )}

        {history.map((appt) => (

          <div
            key={appt.id}
            className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl"
          >
            <h3 className="font-bold text-xl">
              {appt.service}
            </h3>

            <p className="text-gray-500">
              Stylist: {appt.stylist}
            </p>

            {appt.second_stylist && (
              <p className="text-gray-500">
                Second Stylist: {appt.second_stylist}
              </p>
            )}

            <p className="mt-3">
              {new Date(appt.start_time).toLocaleString()}
            </p>

            <span
              className={`
                inline-block
                mt-3
                px-3
                py-1
                rounded-full
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

        ))}

      </div>

    </div>
  );
}