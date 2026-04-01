
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  CalendarCheck,
  CircleDollarSign,
  History,
  Settings,
  FileText,
  Scissors,
  CalendarPlus,
  Type
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuGroups = [
    {
      title: "Overview",
      links: [
        { label: "Dashboard", path: "/admin/home", icon: LayoutDashboard },
      ]
    },
    {
      title: "Management",
      links: [
        { label: "Employees", path: "/admin/employees", icon: Users },
        { label: "Departments", path: "/admin/departments", icon: Building2 },
        { label: "Designations", path: "/admin/designations", icon: Briefcase },
      ]
    },
    {
      title: "Payroll & Attendance",
      links: [
        { label: "Attendance", path: "/admin/attendance", icon: CalendarCheck },
        { label: "Salaries", path: "/admin/salaries", icon: CircleDollarSign },
        { label: "Attendance Overview", path: "/admin/attendance-overview", icon: History },
        { label: "Employee Deductions", path: "/admin/employees-deductions", icon: Scissors },
        { label: "Employee Leaves", path: "/admin/employees-leaves", icon: CalendarPlus },
      ]
    },
    {
      title: "Configuration",
      links: [
        { label: "Leave Types", path: "/admin/leave-types", icon: Type },
        { label: "Deduction Types", path: "/admin/deductions", icon: Scissors },
        { label: "Device Settings", path: "/admin/device-settings", icon: Settings },
      ]
    },
    {
      title: "Analytics",
      links: [
        { label: "Reports", path: "/admin/reports", icon: FileText },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shadow-xl overflow-y-auto scrollbar-hide">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <CircleDollarSign className="text-white w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Payroll Pro</h2>
        </div>

        <nav className="flex flex-col gap-6">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-3 px-3">
                {group.title}
              </p>
              <div className="flex flex-col gap-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <button
                      key={link.label}
                      onClick={() => navigate(link.path)}
                      className={`group flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-200 ${isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-medium"
                          : "hover:bg-slate-800 hover:text-white"
                        }`}
                    >
                      <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                        }`} />
                      <span className="text-sm">{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Administrator</p>
            <p className="text-[10px] text-slate-500 truncate">admin@payrollpro.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
