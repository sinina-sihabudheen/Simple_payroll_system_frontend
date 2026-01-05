
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function EmployeeAllowancePage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get("/api/employees/employee-allowances/");
        setEmployees(res.data);
      } catch (error) {
        toast.error("Failed to load employees");
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
    <div className="flex h-screen">
      <Sidebar />
      <div className="p-6 max-w-6xl mx-auto w-full">
        <Toaster />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700">Employee Allowances</h1>
        </div>

        {employees.length === 0 ? (
          <p className="text-gray-600">No employees found.</p>
        ) : (
          <table className="w-full border text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2">SL No.</th>
                <th className="border px-4 py-2">Allowance ID</th>
                <th className="border px-4 py-2">Employee Name</th>
                <th className="border px-4 py-2">Employee Code</th>
                <th className="border px-4 py-2">Allowance Name</th>
                <th className="border px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp.id} className="hover:bg-blue-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td
                    className="border px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/admin/employees/employee-allowances/${emp.id}`)}
                  >
                    {emp.id}
                  </td>
                  <td className="border px-4 py-2">{emp.employee_name}</td>
                  <td className="border px-4 py-2">{emp.employee_code}</td>
                  <td className="border px-4 py-2">{emp.allowance_name}</td>
                  <td className="border px-4 py-2">{emp.amount}</td>
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
