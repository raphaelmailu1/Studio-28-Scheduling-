import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser({
      name: localStorage.getItem("name"),
      role: localStorage.getItem("role"),
      email: localStorage.getItem("userEmail"),
    });
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">

      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-8">

        <div className="flex justify-between items-center mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              {user.name}
            </h1>

            <p className="text-gray-500">
              {user.email}
            </p>
          </div>

          <span className="bg-black text-white px-4 py-2 rounded-full">
            {user.role}
          </span>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow">
            <h3 className="font-semibold mb-2">
              Account Type
            </h3>

            <p>{user.role}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <h3 className="font-semibold mb-2">
              Email
            </h3>

            <p>{user.email}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <h3 className="font-semibold mb-2">
              Status
            </h3>

            <p>Active</p>
          </div>

        </div>
      </div>
    </div>
  );
}