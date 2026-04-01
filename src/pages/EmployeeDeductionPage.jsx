

import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Search } from "lucide-react";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";

// Reusable confirm modal — used for delete
function ConfirmModal({ message, detail, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{message}</h2>
        {detail && <p className="text-sm text-gray-500 mb-5">{detail}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeDeductionPage() {
  const [deductions, setDeductions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [deductionTypes, setDeductionTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editDeduction, setEditDeduction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // deduction to confirm-delete
  const [searchTerm, setSearchTerm] = useState("");

  // form state
  const [employeeId, setEmployeeId] = useState("");
  const [deductionType, setDeductionType] = useState("");
  const [deductionAmount, setDeductionAmount] = useState("");
  const [deductionDate, setDeductionDate] = useState("");
  const [method, setMethod] = useState("next_month");
  const [months, setMonths] = useState(1);

  useEffect(() => {
    fetchDeductions();
    fetchEmployees();
    fetchDeductionTypes();
  }, []);

  const fetchDeductions = async () => {
    try {
      const res = await axiosInstance.get("/api/employees/employee-deductions/");
      setDeductions(res.data);
    } catch {
      toast.error("Failed to load deductions");
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

  const fetchDeductionTypes = async () => {
    try {
      const res = await axiosInstance.get("/api/salary/deductions/");
      setDeductionTypes(res.data);
    } catch {
      toast.error("Failed to load deduction types");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        deduction_type: deductionType,
        amount: deductionAmount,
        date: deductionDate,
        method,
        months: method === "installments" ? months : null,
      };
      if (!editDeduction) payload.employee = employeeId;

      if (editDeduction) {
        await axiosInstance.patch(
          `/api/employees/employee-deductions/${editDeduction.id}/`,
          payload
        );
        toast.success("Deduction updated successfully");
      } else {
        await axiosInstance.post("/api/employees/employee-deductions/", payload);
        toast.success("Deduction added successfully");
      }

      closeForm();
      fetchDeductions();
    } catch {
      toast.error("Failed to save deduction");
    }
  };

  const handleEdit = (ded) => {
    setEditDeduction(ded);
    setEmployeeId(ded.employee || "");
    setDeductionType(ded.deduction_type || "");
    setDeductionAmount(ded.amount);
    setDeductionDate(ded.date);
    setMethod(ded.method || "next_month");
    setMonths(ded.months || 1);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditDeduction(null);
    setEmployeeId("");
    setDeductionType("");
    setDeductionAmount("");
    setDeductionDate("");
    setMethod("next_month");
    setMonths(1);
  };

  // Called when user clicks Delete — opens confirm modal
  const handleDeleteClick = (ded) => setDeleteTarget(ded);

  // Called when user confirms in the modal
  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/employees/employee-deductions/${deleteTarget.id}/`);
      toast.success("Deduction deleted successfully");
      fetchDeductions();
    } catch {
      toast.error("Failed to delete deduction");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredDeductions = deductions.filter(ded =>
    ded.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ded.employee_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Employee Deductions</h1>
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
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            <FaPlus /> Add Deduction
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredDeductions.length === 0 ? (
        <p className="text-gray-600">No deductions found.</p>
      ) : (
        <table className="w-full border text-left text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Employee</th>
              <th className="border px-4 py-2">Code</th>
              <th className="border px-4 py-2">Deduction</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Method</th>
              <th className="border px-4 py-2">Months</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Created</th>
              <th className="border px-4 py-2">Updated</th>
              <th className="border px-4 py-2">Closed</th>
              <th className="border px-4 py-2">Balance To Close</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deductions.map((ded, index) => (
              <tr key={ded.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{ded.employee_name}</td>
                <td className="border px-4 py-2">{ded.employee_code}</td>
                <td className="border px-4 py-2">{ded.deduction_type_name}</td>
                <td className="border px-4 py-2">{ded.amount}</td>
                <td className="border px-4 py-2">{ded.method}</td>
                <td className="border px-4 py-2">{ded.months || "-"}</td>
                <td className="border px-4 py-2">{new Date(ded.date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(ded.created_at).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  {ded.updated_at ? new Date(ded.updated_at).toLocaleDateString() : "—"}
                </td>
                <td className="border px-4 py-2">{ded.is_closed ? "Yes" : "No"}</td>
                <td className="border px-4 py-2">{ded.remaining_amount}</td>
                <td className="border px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(ded)}
                      className="bg-yellow-400 px-2 py-1 rounded text-white flex items-center gap-1 hover:bg-yellow-500"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(ded)}
                      className="bg-red-600 px-2 py-1 rounded text-white flex items-center gap-1 hover:bg-red-700"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add / Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              {editDeduction ? "Edit Deduction" : "Add Deduction"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editDeduction && (
                <div>
                  <label className="block text-gray-700 mb-1">Employee</label>
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.employee_code} - {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-1">Deduction Type</label>
                <select
                  value={deductionType}
                  onChange={(e) => setDeductionType(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select Deduction</option>
                  {deductionTypes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={deductionAmount}
                  onChange={(e) => setDeductionAmount(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="next_month">Next Month Salary</option>
                  <option value="installments">Installment</option>
                  <option value="annual_leave">Deduction from Annual Leave Salary</option>
                </select>
              </div>

              {method === "installments" && (
                <div>
                  <label className="block text-gray-700 mb-1">Months</label>
                  <input
                    type="number"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    className="w-full border p-2 rounded"
                    min={1}
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={deductionDate}
                  onChange={(e) => setDeductionDate(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <ConfirmModal
          message="Delete this deduction?"
          detail={`${deleteTarget.employee_name} — ${deleteTarget.deduction_type_name} (${deleteTarget.amount})`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
