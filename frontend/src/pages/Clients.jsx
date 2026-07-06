import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export default function Clients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const snapshot = await getDocs(
      collection(db, "users")
    );

    const users = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(user => user.role === "client");

    setClients(users);
  };

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-4xl font-bold mb-8">
        Clients
      </h1>

      <div className="grid md:grid-cols-3 gap-5">

        {clients.map(client => (
          <div
            key={client.id}
            className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl"
          >
            <h2 className="font-bold text-xl">
              {client.name}
            </h2>

            <p className="text-gray-500">
              {client.email}
            </p>

            <span className="inline-block mt-4 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
              Client
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}