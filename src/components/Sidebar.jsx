import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const links = [
    { label: "Dashboard", path: "/admin/home" }, 
    { label: "Employees", path: "/admin/employees" },
    { label: "Departments", path: "/admin/departments" },
    { label: "Designations", path: "/admin/designations" },
    // { label: "Categories", path: "/admin/categories" },
    // { label: "Allowances", path: "/admin/allowances" },
    // { label: "Employee Types", path: "/admin/employee-types" },
    { label: "Attendance", path: "/admin/attendance" },
    { label: "Salaries", path: "/admin/salaries" },
    { label: "Attendance Overview", path: "/admin/attendance-overview" },
    // { label: "Employee Allowances", path: "/admin/employees-allowances" },
    { label: "Employee Deductions", path: "/admin/employees-deductions" },
    { label: "Employee Leaves", path: "/admin/employees-leaves" },
    { label: "Leave Types", path: "/admin/leave-types" },
    { label: "Deduction Types", path: "/admin/deductions" },


  ];

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <button
            key={link.label}
            onClick={() => navigate(link.path)}
            className={`text-left py-2 px-3 rounded hover:bg-gray-700 ${
              location.pathname === link.path ? "bg-gray-700" : ""
            }`}
          >
            {link.label}
          </button>
        ))}
      </nav>
     
    </aside>
  );
};

export default Sidebar;
