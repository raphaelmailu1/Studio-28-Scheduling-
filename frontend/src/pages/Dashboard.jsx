import { useEffect, useState } from "react";
import {
  getAppointments,
  cancelAppointment,
  completeAppointment,
} from "../api/appointments";

import Button from "../components/Button";
import Card from "../components/Card";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const data = await getAppointments();
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    await cancelAppointment(id);
    fetchAppointments();
  };

  const handleComplete = async (id) => {
    await completeAppointment(id);
    fetchAppointments();
  };

  // Sort latest first
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.start_time) - new Date(a.start_time)
  );

  // Group by stylist
  const grouped = sortedAppointments.reduce((acc, appt) => {
    const stylist = appt.stylist || "Unassigned";
    if (!acc[stylist]) acc[stylist] = [];
    acc[stylist].push(appt);
    return acc;
  }, {});

  return (
    <div style={{ padding: "30px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#b30000", marginBottom: "30px" }}>
        Studio 28 Dashboard
      </h1>

      {Object.entries(grouped).map(([stylist, appts]) => (
        <div key={stylist} style={{ marginBottom: "30px" }}>
          <h2 style={{ color: "#b30000", marginBottom: "15px" }}>
            {stylist}
          </h2>

          {appts.map((appt) => {
            const formatted = new Date(appt.start_time).toLocaleString("en-KE", {
              timeZone: "Africa/Nairobi",
              weekday: "short",
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Card key={appt.id}>
                <h3 style={{ margin: 0 }}>{appt.client_name}</h3>

                <p>
                  <strong>Stylist:</strong> {appt.stylist}
                </p>

                <p>{appt.service}</p>

                <p style={{ fontWeight: "bold" }}>
                  {formatted}
                </p>

                <p style={getStatusStyle(appt.status)}>
                  {appt.status}
                </p>

                {appt.status === "booked" && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button onClick={() => handleComplete(appt.id)}>
                      Complete
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => handleCancel(appt.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// =====================
// STATUS COLORS
// =====================
const getStatusStyle = (status) => {
  switch (status) {
    case "completed":
      return { color: "green", fontWeight: "bold" };
    case "cancelled":
      return { color: "red", fontWeight: "bold" };
    default:
      return { color: "#555", fontWeight: "bold" };
  }
};