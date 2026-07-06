import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
  
    localStorage.clear();
  
    navigate("/login");
  };
  
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName");

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
  
        <h1 className="font-bold text-xl">
          Studio 28
        </h1>
  
        <div className="flex items-center gap-6">
  
          {role === "admin" && (
            <Link to="/dashboard">
              Dashboard
            </Link>
          )}
  
          {role === "admin" && (
            <Link to="/manage-stylists">
              Stylists
            </Link>
          )}

          {role === "admin" && (
            <Link to="/clients">
              Clients
            </Link>
          )}
  
          <Link to="/book">
            Book
          </Link>

          {role === "client" && (
            <Link to="/my-appointments">
              My Appointments
            </Link>
          )}
  
          <Link to="/profile">
            Profile
          </Link>
  
          {userName ? (
            <>
              <span className="font-medium text-gray-600">
                Hi {userName}
              </span>
  
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-full"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-black text-white px-4 py-2 rounded-full"
            >
              Login
            </Link>
          )}
  
        </div>
      </div>
    </nav>
  );
}

const navLink = {
  textDecoration: "none",
  color: "#111",
  fontWeight: "600",
};

const loginBtn = {
  background: "#111",
  color: "white",
  padding: "10px 18px",
  borderRadius: "999px",
  textDecoration: "none",
  fontWeight: "600",
};

const logoutBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: "600",
};

