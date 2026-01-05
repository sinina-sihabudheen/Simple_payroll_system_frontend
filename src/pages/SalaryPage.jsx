
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../axiosInstance";

export default function SalaryPage() {
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("9");
  const [result, setResult] = useState([]); // Array of salaries

  // Generate salaries
  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.post("/api/salary/generate/", { year, month });
      console.log("Salary response:", res.data);
      setResult(res.data); // set array of salaries
      toast.success("Salaries fetched");
    } catch (err) {
      console.error("Fetch salaries error:", err);
      toast.error("Failed to fetch salaries");
    }
  };

  // Pay salary
  const handlePaySalary = async (salaryId, employeeName, employeeNumber) => {
    const amountStr = prompt(`Enter amount to pay for ${employeeName}-${employeeNumber}:`);
    if (!amountStr) return; // Cancelled
    const amountToPay = parseFloat(amountStr);
    if (isNaN(amountToPay) || amountToPay <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      const res = await axiosInstance.patch(`/api/salary/pay/${salaryId}/`, {
        paid_amount: amountToPay,
      });

      toast.success(`Salary paid: ${res.data.paid_amount}`);

      // Update table state with new salary info
      setResult((prev) =>
        prev.map((sal) =>
          sal.employee_id === salaryId ? { ...sal, ...res.data } : sal
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to pay salary");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <Toaster />
          <h1 className="text-2xl font-bold mb-4 text-blue-700">Generate Salary</h1>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Generate
            </button>
          </div>

          {/* Salary Table */}
          {result.length > 0 && (
            <table className="min-w-full border border-gray-300 mt-4">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border px-4 py-2">SL No.</th>
                  <th className="border px-4 py-2">Employee Name</th>
                  <th className="border px-4 py-2">Employee Number</th>
                  <th className="border px-4 py-2">House Rent Allowance</th>
                  <th className="border px-4 py-2">Transport Allowance</th>
                  <th className="border px-4 py-2">Cost of Living Allowance</th>
                  <th className="border px-4 py-2">Basic Salary</th>
                  <th className="border px-4 py-2">Gross Salary</th>
                  <th className="border px-4 py-2">Present</th>
                  <th className="border px-4 py-2">Salary on Attendance</th>
                  <th className="border px-4 py-2">Advance Deduction</th>
                  <th className="border px-4 py-2">Other Deductions</th>
                  <th className="border px-4 py-2">Total Deduction</th>
                  <th className="border px-4 py-2">Net Salary</th>
                  <th className="border px-4 py-2">Paid Amount</th>
                  <th className="border px-4 py-2">Balance Amount</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {result.map((salary, index) => (
                  <tr key={salary.employee_id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{salary.employee_name}</td>
                    <td className="border px-4 py-2">{salary.employee_number}</td>
                    <td className="border px-4 py-2">{salary.house_rent_allowance.toFixed(2)}</td>
                    <td className="border px-4 py-2">{salary.transportation_allowance.toFixed(2)}</td>
                    <td className="border px-4 py-2">{salary.cost_of_living_allowance.toFixed(2)}</td>
                    <td className="border px-4 py-2">{salary.basic_salary.toFixed(2)}</td>
                    <td className="border px-4 py-2">{salary.gross_basic_salary.toFixed(2)}</td>
                    <td className="border px-4 py-2">{salary.present_days}</td>
                    <td className="border px-4 py-2">{salary.salary_on_attendance.toFixed(2)}</td>
                    <td className="border px-4 py-2">{salary.advance_deduction.toFixed(2)}</td>
                    <td className="border px-4 py-2">{salary.other_deductions.toFixed(2)}</td>
                    <td className="border px-4 py-2">{salary.total_deduction.toFixed(2)}</td>
                    <td className="border px-4 py-2">{salary.total_salary.toFixed(2)}</td>
                    <td className="border px-4 py-2">{salary.paid_amount?.toFixed(2) || "0.00"}</td>
                    <td className="border px-4 py-2">{salary.balance_amount?.toFixed(2) || salary.total_salary.toFixed(2)}</td>
                    <td className="border px-4 py-2">{salary.status}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handlePaySalary(salary.id, salary.employee_name, salary.employee_number)}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Pay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
