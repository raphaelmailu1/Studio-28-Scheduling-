import { useEffect, useState } from "react"
import { getAppointments } from "../api/appointments"


function Appointments() {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    const res = await getAppointments()
    setAppointments(res.data)
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Appointments</h2>

      {appointments.map((appt, index) => (
        <div key={index}>
          <p>{appt.name}</p>
          <p>{appt.service}</p>
          <p>{appt.start_time}</p>
          <hr />
        </div>
      ))}
    </div>
  )
}

export default Appointments