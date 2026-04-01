
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("admin_name");
    if (name) setAdminName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("admin_name");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav className="bg-white border-b border-slate-200 h-16 flex justify-between items-center px-8 sticky top-0 z-40 shadow-sm">
      <div className="flex-1"></div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none mb-1">{adminName || "Administrator"}</p>
            <p className="text-[11px] text-slate-500 font-medium">Platform Admin</p>
          </div>

          <div className="group relative">
            <button className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-200 transition-transform active:scale-95">
              {getInitials(adminName)}
            </button>

            {/* Simple Dropdown on hover/click can be added here later */}
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
