import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function EmployeeLeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editLeave, setEditLeave] = useState(null);

  // form state
  const [employeeId, setEmployeeId] = useState("");
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
    fetchLeaveTypes();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axiosInstance.get("/api/attendance/leaves/");
      setLeaves(res.data);
    } catch {
      toast.error("Failed to load leaves");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/api/employees/profiles/");
      setEmployees(res.data);
    } catch {
      toast.error("Failed to load employees");
    }
  };

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
      if (editLeave) {
        await axiosInstance.patch(`/api/attendance/leaves/${editLeave.id}/`, {
          employee: employeeId,
          date: leaveDate,
          leave_type: leaveTypeId,
          approved,
        });
        toast.success("Leave updated successfully");
      } else {
        await axiosInstance.post("/api/attendance/leaves/", {
          employee: employeeId,
          date: leaveDate,
          leave_type: leaveTypeId,
          approved,
        });
        toast.success("Leave added successfully");
      }

      // Reset form
      setShowForm(false);
      setEditLeave(null);
      setEmployeeId("");
      setLeaveDate("");
      setLeaveTypeId("");
      setApproved(false);
      fetchLeaves();
    } catch {
      toast.error("Failed to save leave");
    }
  };

  const handleEdit = (leave) => {
    setEditLeave(leave);
    setEmployeeId(leave.employee);
    setLeaveDate(leave.date);
    setLeaveTypeId(leave.leave_type);
    setApproved(leave.approved);
    setShowForm(true);
  };

  const handleApprove = async (leave) => {
    try {
      await axiosInstance.patch(`/api/attendance/leaves/${leave.id}/`, {
        approved: true,
      });
      toast.success("Leave approved");
      fetchLeaves();
    } catch {
      toast.error("Failed to approve leave");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
    <div className="flex h-screen">
      <Sidebar />
      <div className="p-6 max-w-6xl mx-auto w-full">
        <Toaster />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700">Employee Leaves</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Add Leave
          </button>
        </div>

        {/* Table */}
        {leaves.length === 0 ? (
          <p className="text-gray-600">No leaves found.</p>
        ) : (
          <table className="w-full border text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Employee</th>
                <th className="border px-4 py-2">Code</th>
                <th className="border px-4 py-2">Leave Type</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Approved</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, index) => (
                <tr key={leave.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{leave.employee_name}</td>
                  <td className="border px-4 py-2">{leave.employee_code}</td>
                  <td className="border px-4 py-2">{leave.leave_type_name}</td>
                  <td className="border px-4 py-2">{leave.date}</td>
                  <td className="border px-4 py-2">
                    {leave.approved ? "Approved" : "Not Approved"}
                  </td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(leave)}
                      className="bg-yellow-400 px-2 py-1 rounded text-white flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    {!leave.approved && (
                      <button
                        onClick={() => handleApprove(leave)}
                        className="bg-blue-600 px-2 py-1 rounded text-white flex items-center gap-1"
                      >
                        <FaCheck /> Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Add/Edit Leave Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">
                {editLeave ? "Edit Leave" : "Add Leave"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Employee Dropdown */}
                <div>
                  <label className="block text-gray-700 mb-1">Employee</label>
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                    disabled={!!editLeave} // can't change employee while editing
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.employee_code} - {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Leave Type */}
                <div>
                  <label className="block text-gray-700 mb-1">Leave Type</label>
                  <select
                    value={leaveTypeId}
                    onChange={(e) => setLeaveTypeId(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map((lt) => (
                      <option key={lt.id} value={lt.id}>
                        {lt.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Leave Date */}
                <div>
                  <label className="block text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={leaveDate}
                    onChange={(e) => setLeaveDate(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>

                {/* Approved */}
                {editLeave && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={approved}
                      onChange={(e) => setApproved(e.target.checked)}
                    />
                    <label>Approved</label>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditLeave(null);
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Save
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
