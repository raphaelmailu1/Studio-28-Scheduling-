import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc
} from "firebase/firestore";

import { auth, db } from "../config/firebase";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        phone,
        role: "client",
        createdAt: new Date()
      });

      toast.success("Account created");

      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8">
  
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Create Account
          </h1>
  
          <p className="text-gray-500 mt-2">
            Book appointments online
          </p>
        </div>
  
        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-4"
        />
  
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-4"
        />
  
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-6"
        />
  
        <button
          onClick={handleRegister}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold"
        >
          Create Account
        </button>
  
      </div>
    </div>
  );
}