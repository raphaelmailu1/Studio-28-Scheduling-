import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BookAppointment from "../pages/BookAppointment";
import AppointmentsPage from "../pages/AppointmentsPage";

import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import ManageStylists from "../pages/ManageStylists";
import Profile from "../pages/Profile";
import Clients from "../pages/Clients";
import MyAppointments from "../pages/MyAppointments";

export default function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      <Route
        path="/clients"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Clients />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute
            allowedRoles={[
              "client",
              "stylist",
              "admin",
            ]}
          >
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/manage-stylists"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <Layout>
              <ManageStylists />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* CLIENT */}
      <Route
        path="/book"
        element={
          <ProtectedRoute allowedRoles={["client"]}>
            <Layout>
              <BookAppointment />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-appointments"
        element={
          <ProtectedRoute
            allowedRoles={["client"]}
          >
            <Layout>
              <MyAppointments />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <AppointmentsPage role="admin" />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* STYLIST */}
      <Route
        path="/stylist"
        element={
          <ProtectedRoute allowedRoles={["stylist"]}>
            <Layout>
              <AppointmentsPage
                role="stylist"
                stylistName={localStorage.getItem("stylistName")}
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* UNKNOWN ROUTES */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}