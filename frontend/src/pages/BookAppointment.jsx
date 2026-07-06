import { useState, useEffect } from "react";

import { getStylists } from "../api/stylists";
import {
  createAppointment,
  getAvailableSlots,
} from "../api/appointments";

import { formatToKenyaTime } from "../utils/time";
import Button from "../components/Button";

export default function BookAppointment() {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] =
  useState(
    localStorage.getItem("userEmail") || ""
  );
  const [service, setService] = useState("");
  const [stylist, setStylist] = useState("");
  const [secondStylist, setSecondStylist] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [stylists, setStylists] = useState([]);
  
  const duoServices = [
    "Retight 2hr - 3hrs duo",
    "Braiding",
    "Color",
    "Two strand",
    "Installation",
    "Beauty ManiPedi"
  ];

  const services = [
    "Retight 2hr - 3hrs duo",
    "Retight 3hrs - 4hrs solo",
    "Braiding",
    "Color",
    "Two strand",
    "Installation",
    "Undo",
    "Beauty ManiPedi",
  ];

  // ✅ Load stylists on mount
  useEffect(() => {
    const loadStylists = async () => {
      try {
        const data = await getStylists();
        setStylists(data);
      } catch (err) {
        console.error("Failed to load stylists:", err);
      }
    };

    loadStylists();
  }, []);

  // Fetch available slots
  const fetchSlots = async () => {
    if (!date || !service || !stylist) {
      alert("Select date, service and stylist first");
      return;
    }

    try {
      const data = await getAvailableSlots(date, service, stylist);

      if (data.multi_day) {
        alert(data.message);
        setSlots([]);
        return;
      }

      setSlots(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch slots");
    }
  };

  // Book appointment
  const handleBooking = async () => {
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }
  
    try {
      await createAppointment({
        client_name: clientName,
        client_phone: clientPhone,
        client_email: clientEmail,
        service,
        stylist,
        second_stylist: secondStylist || null,
        start_time: selectedSlot,
      });
  
      alert("Appointment booked successfully!");
  
      setClientName("");
      setClientPhone("");
      setService("");
      setStylist("");
      setSecondStylist("");
      setDate("");
      setSlots([]);
      setSelectedSlot(null);
  
    } catch (err) {
      console.error(err);
  
      alert(
        err?.response?.data?.detail ||
        err?.message ||
        "Booking failed"
      );
    }
  };

return (
  <div className="max-w-4xl mx-auto py-8 px-4">
    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Book Appointment
        </h1>

        <p className="text-gray-500 mt-2">
          Select your service, stylist and preferred time
        </p>
      </div>

      <div className="space-y-4">

        <input
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        />

        <input
          placeholder="Phone Number"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        />

        <input
          value={clientEmail}
          disabled
          className="
            w-full
            border
            rounded-xl
            px-4
            py-3
            bg-gray-100
          "
        />

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        >
          <option value="">Select Service</option>

          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={stylist}
          onChange={(e) => setStylist(e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        >
          <option value="">Select Stylist</option>

          {stylists.map((stylist) => (
            <option
              key={stylist.id}
              value={stylist.name}
            >
              {stylist.name}
            </option>
          ))}
        </select>
        {
          duoServices.includes(service) && (
            <select
              value={secondStylist}
              onChange={(e) =>
                setSecondStylist(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="">
                Select Second Stylist (Optional)
              </option>

              {stylists
                .filter(
                  (s) => s.name !== stylist
                )
                .map((stylist) => (
                  <option
                    key={stylist.id}
                    value={stylist.name}
                  >
                    {stylist.name}
                  </option>
                ))}
            </select>
          )
        }

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        />

        <button
          onClick={fetchSlots}
          className="bg-black text-white px-6 py-3 rounded-xl font-semibold"
        >
          Check Available Slots
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">
          Available Slots
        </h3>

        <p className="text-gray-500 text-sm">
          Select a time slot below
        </p>

        <div className="flex flex-wrap gap-3 mt-4">
          {slots.map((slot, index) => {
            const isSelected =
              selectedSlot === slot.time;

            return (
              <button
                key={index}
                disabled={!slot.available}
                onClick={() =>
                  setSelectedSlot(slot.time)
                }
                className={`
                  px-5 py-3 rounded-full border
                  transition
                  ${
                    isSelected
                      ? "bg-black text-white border-black"
                      : "bg-white hover:bg-gray-100"
                  }
                  ${
                    !slot.available
                      ? "opacity-40 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                <div>
                  {formatToKenyaTime(slot.time)}
                </div>

                {!slot.available && (
                  <div className="text-xs">
                    Booked
                  </div>
                )}

                {slot.invalid &&
                  slot.available && (
                    <div className="text-xs">
                      Too late
                    </div>
                  )}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleBooking}
        className="
          w-full
          mt-8
          bg-black
          text-white
          py-4
          rounded-xl
          font-semibold
        "
      >
        Confirm Booking
      </button>

    </div>
  </div>
);
}