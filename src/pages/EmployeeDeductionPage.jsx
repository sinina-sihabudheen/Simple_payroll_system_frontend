
import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function EmployeeDeductionPage() {
  const [deductions, setDeductions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [deductionTypes, setDeductionTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editDeduction, setEditDeduction] = useState(null);

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

      // Reset form
      setShowForm(false);
      setEditDeduction(null);
      setEmployeeId("");
      setDeductionType("");
      setDeductionAmount("");
      setDeductionDate("");
      setMethod("next_month");
      setMonths(1);

      fetchDeductions();
    } catch (error) {
      console.error(error);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this deduction?")) return;
    try {
      await axiosInstance.delete(`/api/employees/employee-deductions/${id}/`);
      toast.success("Deduction deleted successfully");
      fetchDeductions();
    } catch {
      toast.error("Failed to delete deduction");
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
            <h1 className="text-2xl font-bold text-blue-700">Employee Deductions</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaPlus /> Add Deduction
            </button>
          </div>

          {/* Table */}
          {deductions.length === 0 ? (
            <p className="text-gray-600">No deductions found.</p>
          ) : (
            <table className="w-full border text-left">
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
                  <tr key={ded.id}>
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
                      {ded.updated_at ? new Date(ded.updated_at).toLocaleDateString() : "not updated"}
                    </td>
                    <td className="border px-4 py-2">{ded.is_closed ? "Yes" : "No"}</td>
                    <td className="border px-4 py-2">{ded.remaining_amount}</td>
                    <td className="border px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(ded)}
                        className="bg-yellow-400 px-2 py-1 rounded text-white flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ded.id)}
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

          {/* Add/Edit Form */}
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
                      onClick={() => {
                        setShowForm(false);
                        setEditDeduction(null);
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
