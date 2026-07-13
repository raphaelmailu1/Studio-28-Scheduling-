import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // GET USER DATA FROM FIRESTORE
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        toast.error("User profile not found in Firestore");
        return;
      }

      const userData = userSnap.data();

      // STORE GLOBAL USER INFO
      localStorage.setItem("role", userData.role);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("userEmail", user.email);

      // OPTIONAL FOR STYLIST FILTERING
      if (userData.role === "stylist") {
        localStorage.setItem("stylistName", userData.name);
        navigate("/stylist");
      }

      else if (userData.role === "admin") {
        navigate("/dashboard");
      }

      else {
        navigate("/book");
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8">
  
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Studio 28
          </h1>
  
          <p className="text-gray-500 mt-2">
            Sign in to manage your appointments
          </p>
        </div>
  
        <input
          type="email"
          placeholder="Email address"
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
          onClick={handleLogin}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold"
        >
          Sign In
        </button>
  
        <div className="text-center mt-6">
          <p className="text-gray-500">
            Don't have an account?
          </p>
  
          <button
            onClick={() => navigate("/register")}
            className="mt-2 text-black font-semibold"
          >
            Create Account
          </button>
        </div>
  
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#b30000",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "15px",
};