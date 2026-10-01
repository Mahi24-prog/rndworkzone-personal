import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SubmitRequirement from "./pages/SubmitRequirement";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ForcePasswordChange from "./pages/ForcePasswordChange";
import Dashboard from "./pages/Dashboard";
import MyRequirements from "./pages/MyRequirements";
import RequirementDetails from "./pages/RequirementDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import AdminRequirements from "./pages/admin/AdminRequirements";
import AdminRequirementDetails from "./pages/admin/AdminRequirementDetails";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/force-password-change" element={<ForcePasswordChange />} />

          {/* Protected Routes */}
          <Route
            path="/submit"
            element={<SubmitRequirement />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-requirements"
            element={
              <ProtectedRoute>
                <MyRequirements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requirements/:id"
            element={
              <ProtectedRoute>
                <RequirementDetails />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <AdminRoute>
                <AdminUserDetails />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/requirements"
            element={
              <AdminRoute>
                <AdminRequirements />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/requirements/:id"
            element={
              <AdminRoute>
                <AdminRequirementDetails />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
