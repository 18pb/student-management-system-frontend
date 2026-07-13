import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Core Fallback Path */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Authentication Channels */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Administrative View Component */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Student Catalog View Component */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student", "admin"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Unauthorized State Route */}
        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
              <h1 className="text-4xl font-black text-slate-800 mb-2">
                403 - Forbidden
              </h1>
              <p className="text-slate-500 mb-4">
                You do not have the required administrative clearance to view
                this dashboard.
              </p>
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Return to Login Screen
              </Link>
            </div>
          }
        />

        {/* Standard 404 Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
