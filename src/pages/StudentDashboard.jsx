import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://student-management-system-backend-15ie.onrender.com/api/courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">
          🎓 Student Terminal
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600">
            Student: {username}
          </span>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Log Out
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-center justify-between">
          <p className="text-sm text-blue-800">
            ℹ️ You have <strong>Read-Only</strong> access to the current course
            catalog.
          </p>
        </div>

        <h2 className="text-xl font-bold mb-4 text-slate-900">
          Available Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow"
            >
              <span className="text-xs font-bold tracking-wider uppercase text-blue-600 font-mono bg-blue-50 px-2.5 py-1 rounded-md">
                {course.code}
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-3 mb-1">
                {course.title}
              </h3>
              <p className="text-sm text-slate-500">
                {course.credits} Credits required
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
