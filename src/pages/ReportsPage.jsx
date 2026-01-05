import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function ReportsPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="p-6 flex-1 overflow-auto">
          <Toaster />
          <h1 className="text-2xl font-bold mb-4 text-blue-700">Reports</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <button onClick={() => navigate("/admin/reports/employees")} className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-600">Employees</button>
            <button onClick={() => navigate("/admin/reports/attendance")} className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-600">Attendance</button>
            <button onClick={() => navigate("/admin/reports/salary")} className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-600">Salary</button>
            <button onClick={() => navigate("/admin/reports/deductions")} className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-600">Employee Deductions</button>
          </div>
          <p className="text-gray-600">Select a report to view and download.</p>
        </div>
      </div>
    </div>
  );
}
