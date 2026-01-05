
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


export default function EmployeePage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get("/api/employees/profiles/");
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
      <div className="p-6 max-w-6xl mx-auto">
        <Toaster />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700">Employees</h1>
          <button
            onClick={() => navigate("/admin/employees/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Add Employee
          </button>
        </div>

        {employees.length === 0 ? (
          <p className="text-gray-600">No employees found.</p>
        ) : (
          <table className="w-full border text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2">SL No.</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Employee Code</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td
                    className="border px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/admin/employees/${emp.id}`)}
                  >
                    {emp.name}
                  </td>
                  <td className="border px-4 py-2">{emp.employee_code}</td>
                  <td className="border px-4 py-2">{emp.department?.name || "-"}</td>
                  <td className="border px-4 py-2 capitalize">{emp.status}</td>
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
