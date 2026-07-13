import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState("");

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [grade, setGrade] = useState("");
  const [score, setScore] = useState("");
  const [status, setStatus] = useState("Enrolled");

  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const resCourses = await axios.get(
        "https://student-management-system-backend-15ie.onrender.com/api/courses",
        config,
      );
      setCourses(resCourses.data);
      const resStudents = await axios.get(
        "https://student-management-system-backend-15ie.onrender.com/api/students",
        config,
      );
      setStudents(resStudents.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://student-management-system-backend-15ie.onrender.com/api/courses",
        { title, code, credits: Number(credits) },
        config,
      );
      setTitle("");
      setCode("");
      setCredits("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create course");
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(
        `https://student-management-system-backend-15ie.onrender.com/api/courses/${id}`,
        config,
      );
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://student-management-system-backend-15ie.onrender.com/api/students/${selectedStudent}/grade`,
        {
          courseId: selectedCourse,
          grade,
          score: Number(score),
          status,
        },
        config,
      );
      setGrade("");
      setScore("");
      fetchData();
      alert("Academic performance record updated.");
    } catch (err) {
      alert("Failed to submit performance updates.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
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

      <main className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Course Generation Panel */}
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

          {/* Academic Performance Matrix Configuration Panel */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h2 className="text-lg font-bold mb-4 text-slate-900">
              Update Student Grades
            </h2>
            <form onSubmit={handleGradeSubmission} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Select Student
                </label>
                <select
                  required
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none"
                >
                  <option value="">-- Choose Student --</option>
                  {(students || []).map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.user?.name} ({s.studentId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Select Course
                </label>
                <select
                  required
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none"
                >
                  <option value="">-- Choose Course --</option>
                  {(courses || []).map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Letter Grade
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="A+"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Score (0-100)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="95"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Academic Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none"
                >
                  <option value="Enrolled">Enrolled</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow"
              >
                Commit Performance Update
              </button>
            </form>
          </div>

          {/* Mini Course Catalog Lookup */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-h-[420px] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 text-slate-900">
              Course Catalog ({courses?.length || 0})
            </h2>
            <div className="space-y-2">
              {(courses || []).map((course) => (
                <div
                  key={course._id}
                  className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-600">
                      {course.code}
                    </span>
                    <h4 className="text-sm font-medium text-slate-700 max-w-[150px] truncate">
                      {course.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="text-xs font-semibold text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Student Roster & Academic Performance Readout */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-slate-900">
            Student Profiles & Performance Logs
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Major</th>
                  <th className="p-3">
                    Performance Matrix (Course | Grade | Score | Status)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {(students || []).map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-3 font-mono font-bold text-slate-600">
                      {student.studentId}
                    </td>
                    <td className="p-3 font-medium text-slate-900">
                      {student.user?.name}
                    </td>
                    <td className="p-3 text-slate-600">{student.major}</td>
                    <td className="p-3">
                      {student.academicPerformance?.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">
                          No academic performance history log initialized.
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(student.academicPerformance || []).map(
                            (record, i) => (
                              <span
                                key={i}
                                className="text-xs px-2.5 py-1 rounded border bg-white shadow-2xs font-medium"
                              >
                                <strong className="text-blue-600">
                                  {record.course?.code || "Deleted"}
                                </strong>
                                : {record.grade} ({record.score}%) -
                                <span
                                  className={`ml-1 font-bold ${record.status === "Completed" ? "text-green-600" : record.status === "Failed" ? "text-red-600" : "text-amber-500"}`}
                                >
                                  {" "}
                                  {record.status}
                                </span>
                              </span>
                            ),
                          )}
                        </div>
                      )}
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
