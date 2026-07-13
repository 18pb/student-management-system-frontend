import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [major, setMajor] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(
        "[https://student-management-system-backend-15ie.onrender.com/api/auth/register](https://student-management-system-backend-15ie.onrender.com/api/auth/register)",
        {
          name,
          email,
          password,
          role,
          major: role === "student" ? major : undefined,
        },
      );
      setSuccess(
        response.data.message || "Registration successful! Redirecting...",
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 border border-slate-100">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
          Create Account
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">
            {success}
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200"
              placeholder="Alex Johnson"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200"
              placeholder="alex@school.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white"
            >
              <option value="student">Student Dashboard Access</option>
              <option value="admin">Administrator (Full Access)</option>
            </select>
          </div>
          {role === "student" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Major Specialization
              </label>
              <input
                type="text"
                required
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200"
                placeholder="Computer Science"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors mt-2"
          >
            Register Account
          </button>
        </form>
        <p className="text-sm text-center text-slate-500 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
