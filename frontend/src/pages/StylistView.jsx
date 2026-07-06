import { useEffect, useState } from "react";
import { getAppointments } from "../api/appointments";

export default function StylistView() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const data = await getAppointments();
    setAppointments(data);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Stylist Schedule</h1>

      {appointments.map((appt) => (
        <div key={appt.id} style={{
          background: "#fff",
          padding: "15px",
          margin: "10px 0",
          borderRadius: "10px"
        }}>
          <p><strong>{appt.client_name}</strong></p>
          <p>{appt.service}</p>
          <p>
            {new Date(appt.start_time).toLocaleString("en-KE", {
              timeZone: "Africa/Nairobi",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}