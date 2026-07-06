import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/appointments";

export const getAppointments = async (date = null) => {
  const url = date ? `${BASE_URL}?date=${date}` : BASE_URL;
  const res = await axios.get(url);
  return res.data;
};

export const createAppointment = async (data) => {
  return await axios.post(BASE_URL, data);
};

export const cancelAppointment = async (id) => {
  return await axios.patch(`${BASE_URL}/cancel/${id}`);
};

export const completeAppointment = async (id) => {
  return await axios.patch(`${BASE_URL}/complete/${id}`);
};

export const getAvailableSlots = async (date, service, stylist) => {
  const res = await axios.get(
    `http://127.0.0.1:8000/appointments/available-slots`,
    {
      params: { date, service, stylist },
    }
  );
  return res.data;
};