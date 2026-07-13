import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://student-management-system-backend-15ie.onrender.com/api/courses",
        { title, code, credits: Number(credits) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTitle("");
      setCode("");
      setCredits("");
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create course");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://student-management-system-backend-15ie.onrender.com/api/courses/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">
          🛡️ Control Center (Admin)
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600">
            Active: {username}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Log Out
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-4 text-slate-900">
            Add New Course
          </h2>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Course Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Course Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="CS101"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Credits
              </label>
              <input
                type="number"
                required
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow"
            >
              Create Course
            </button>
          </form>
        </div>

        {/* Catalog Table */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-slate-900">
            Course Catalog ({courses.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                  <th className="p-3">Code</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Credits</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {courses.map((course) => (
                  <tr
                    key={course._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-3 font-mono font-semibold text-blue-600">
                      {course.code}
                    </td>
                    <td className="p-3 font-medium text-slate-700">
                      {course.title}
                    </td>
                    <td className="p-3 text-slate-500">
                      {course.credits} Credits
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="text-sm font-semibold text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
