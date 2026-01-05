import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AdminHomePage = () => {
  const navigate = useNavigate();

  const links = [
    { label: "Employees", path: "/admin/employees" },
    { label: "Departments", path: "/admin/departments" },
    { label: "Designations", path: "/admin/designations" }, 
    // { label: "Categories", path: "/admin/categories" },
    // { label: "Allowances", path: "/admin/allowances" },
    // { label: "Employee Types", path: "/admin/employee-types" },
    // { label: "Attendance", path: "/admin/attendance" },
    { label: "Salary", path: "/admin/salaries" },
    { label: "Attendance Overview", path: "/admin/attendance-overview" },
    // { label: "Employee Allowances", path: "/admin/employees-allowances" },
    { label: "Employee Deductions", path: "/admin/employees-deductions" },
    { label: "Employee Leaves", path: "/admin/employees-leaves" },
    { label: "Leave Types", path: "/admin/leave-types" },
    { label: "Deduction Types", path: "/admin/deductions" },


  ];

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-2 gap-4">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="bg-gray-800 text-white py-3 px-6 rounded hover:bg-gray-600"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;

