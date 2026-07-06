import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../config/firebase";

export default function ManageStylists() {
  const [stylists, setStylists] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadStylists();
  }, []);

  const loadStylists = async () => {
    const snapshot = await getDocs(
      collection(db, "stylists")
    );

    setStylists(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  };

  const addStylist = async () => {
    if (!name || !email) {
      alert("Enter name and email");
      return;
    }

    await addDoc(
      collection(db, "stylists"),
      {
        name,
        email,
        active: true,
      }
    );

    setName("");
    setEmail("");

    loadStylists();
  };

  const toggleActive = async (stylist) => {
    await updateDoc(
      doc(db, "stylists", stylist.id),
      {
        active: !stylist.active,
      }
    );

    loadStylists();
  };

  return (
    <div className="max-w-6xl mx-auto">

      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Manage Stylists
        </h1>

        <p className="text-gray-500 mt-2">
          Add, enable or disable salon staff.
        </p>
      </div>

      {/* Add Stylist Card */}

      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-8">

        <h2 className="text-2xl font-semibold mb-6">
          Add New Stylist
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Stylist Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="
              border
              rounded-xl
              px-4
              py-3
            "
          />

          <input
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="
              border
              rounded-xl
              px-4
              py-3
            "
          />
        </div>

        <button
          onClick={addStylist}
          className="
            mt-5
            bg-black
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
          "
        >
          Add Stylist
        </button>
      </div>

      {/* Stylist List */}

      <div className="grid md:grid-cols-2 gap-5">

        {stylists.map((stylist) => (
          <div
            key={stylist.id}
            className="
              bg-white/95
              backdrop-blur-md
              rounded-3xl
              shadow-xl
              p-6
            "
          >
            <div className="flex justify-between items-start">

              <div>
                <h3 className="text-xl font-bold">
                  {stylist.name}
                </h3>

                <p className="text-gray-500">
                  {stylist.email}
                </p>
              </div>

              <span
                className={`
                  px-3 py-1 rounded-full text-sm font-semibold
                  ${
                    stylist.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
              >
                {stylist.active
                  ? "Active"
                  : "Disabled"}
              </span>
            </div>

            <button
              onClick={() =>
                toggleActive(stylist)
              }
              className={`
                mt-5
                px-4
                py-2
                rounded-xl
                text-white
                font-semibold
                ${
                  stylist.active
                    ? "bg-red-600"
                    : "bg-green-600"
                }
              `}
            >
              {stylist.active
                ? "Disable"
                : "Enable"}
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}