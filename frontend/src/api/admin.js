import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const API_URL = `${API}/admin`;

export const createStylist = async (stylistData) => {
  const response = await axios.post(
    `${API_URL}/create-stylist`,
    stylistData
  );

  return response.data;
};