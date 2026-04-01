import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { Search } from "lucide-react";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";

export default function EmployeeLeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editLeave, setEditLeave] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // form state
  const [employeeId, setEmployeeId] = useState("");
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [status, setStatus] = useState("pending");

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
          status,
        });
        toast.success("Leave updated successfully");
      } else {
        await axiosInstance.post("/api/attendance/leaves/", {
          employee: employeeId,
          date: leaveDate,
          leave_type: leaveTypeId,
          status,
        });
        toast.success("Leave added successfully");
      }

      // Reset form
      setShowForm(false);
      setEditLeave(null);
      setEmployeeId("");
      setLeaveDate("");
      setLeaveTypeId("");
      setStatus("pending");
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
    setStatus(leave.status);
    setShowForm(true);
  };

  const updateStatus = async (leave, status) => {
    try {
      await axiosInstance.patch(`/api/attendance/leaves/${leave.id}/`, {
        status: status,
      });
      toast.success(`Leave ${status}`);
      fetchLeaves();
    } catch {
      toast.error(`Failed to ${status} leave`);
    }
  };

  const filteredLeaves = leaves.filter(leave =>
    leave.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.employee_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Employee Leaves</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64 shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FaPlus /> Add Leave
          </button>
        </div>
      </div>

      {filteredLeaves.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500">No leaves found matching your search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLeaves.map((leave, index) => (
                <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{leave.employee_name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{leave.employee_code}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{leave.leave_type_name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{leave.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                      leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {leave.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(leave, 'approved')}
                            className="text-green-600 hover:text-green-700 bg-green-50 p-2 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => updateStatus(leave, 'rejected')}
                            className="text-red-600 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEdit(leave)}
                        className="text-blue-600 hover:text-blue-700 bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Leave Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6 text-slate-900 border-b pb-4">
              {editLeave ? "Edit Leave Request" : "New Leave Request"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                    disabled={!!editLeave}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.employee_code} - {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                  <select
                    value={leaveTypeId}
                    onChange={(e) => setLeaveTypeId(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                  >
                    <option value="">Select Type</option>
                    {leaveTypes.map((lt) => (
                      <option key={lt.id} value={lt.id}>
                        {lt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {editLeave && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 mt-6 border-t font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditLeave(null);
                    setEmployeeId("");
                    setLeaveDate("");
                    setLeaveTypeId("");
                    setStatus("pending");
                  }}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
