import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const BASE_URL = `${API}/appointments`;

export const getAppointments = async (date = null) => {
  const url = date ? `${BASE_URL}?date=${date}` : BASE_URL;
  const res = await axios.get(url);
  return res.data;
};

export const createAppointment = async (data) => {
  return axios.post(BASE_URL, data);
};

export const cancelAppointment = async (id) => {
  return axios.patch(`${BASE_URL}/cancel/${id}`);
};

export const completeAppointment = async (id) => {
  return axios.patch(`${BASE_URL}/complete/${id}`);
};

export const getAvailableSlots = async (
  date,
  service,
  stylist
) => {
  const res = await axios.get(
    `${BASE_URL}/available-slots`,
    {
      params: {
        date,
        service,
        stylist,
      },
    }
  );

  return res.data;
};