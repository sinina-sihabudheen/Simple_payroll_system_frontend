
import { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function LeaveTypePage() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [leaveTypeName, setLeaveTypeName] = useState("");

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const res = await axiosInstance.get("/api/attendance/leave-types/");
      setLeaveTypes(res.data);
    } catch {
      toast.error("Failed to load leave types");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/attendance/leave-types/", {
        name: leaveTypeName,
      });
      toast.success("Leave type added");
      setShowForm(false);
      setLeaveTypeName("");
      fetchLeaveTypes();
    } catch {
      toast.error("Failed to save leave type");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave type?")) return;
    try {
      await axiosInstance.delete(`/api/attendance/leave-types/${id}/`);
      toast.success("Leave type deleted");
      fetchLeaveTypes();
    } catch {
      toast.error("Failed to delete leave type");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
    <div className="flex h-screen">
      <Sidebar />
      <div className="p-6 max-w-4xl mx-auto w-full">
        <Toaster />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700">Leave Types</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Add Leave Type
          </button>
        </div>

        {leaveTypes.length === 0 ? (
          <p className="text-gray-600">No leave types found.</p>
        ) : (
          <table className="w-full border text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Leave Type</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveTypes.map((lt, index) => (
                <tr key={lt.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{lt.name}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(lt.id)}
                      className="bg-red-600 px-2 py-1 rounded text-white flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">
                Add Leave Type
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Leave Type Name</label>
                  <input
                    type="text"
                    value={leaveTypeName}
                    onChange={(e) => setLeaveTypeName(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="e.g., Sick Leave"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
