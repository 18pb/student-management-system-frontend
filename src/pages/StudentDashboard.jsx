import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const resCourses = await axios.get(
          "[https://student-management-system-backend-15ie.onrender.com/api/courses](https://student-management-system-backend-15ie.onrender.com/api/courses)",
          config,
        );
        setCourses(resCourses.data);
        const resProfile = await axios.get(
          "[https://student-management-system-backend-15ie.onrender.com/api/students/profile](https://student-management-system-backend-15ie.onrender.com/api/students/profile)",
          config,
        );
        setProfile(resProfile.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudentData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Menu Bar */}
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

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Academic Overview and Performance Logs */}
        <div className="lg:col-span-2 space-y-6">
          {profile && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {profile.user?.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {profile.user?.email}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-mono text-sm font-bold rounded-lg border border-blue-100">
                    {profile.studentId}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Major: {profile.major}
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">
                Verified Academic Performance Matrix
              </h3>
              {profile.academicPerformance?.length === 0 ? (
                <p className="text-sm text-slate-400 italic bg-slate-50 p-4 rounded-lg text-center border border-dashed">
                  No performance records or final grades logged for your account
                  yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {profile.academicPerformance.map((record, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-200/60"
                    >
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">
                          {record.course?.title}
                        </h4>
                        <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/50">
                          {record.course?.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <span className="block font-black text-lg text-slate-800">
                            {record.grade}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Grade
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="block font-mono font-bold text-sm text-slate-700">
                            {record.score}%
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Score
                          </span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                              record.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : record.status === "Failed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {record.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Global Catalog Sidebar */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Available Courses
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Read-only global systemic catalog sync
            </p>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 hover:border-slate-300 transition-colors"
                >
                  <span className="text-[10px] font-bold text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {course.code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 mt-2 mb-0.5">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {course.credits} Academic Credits
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
