import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  CircleDollarSign,
  CalendarCheck,
  ArrowRight,
  Plus,
  FilePieChart,
  Clock,
  TrendingUp,
  History,
  Briefcase,
  FileX,
  UserPlus,
  Scissors,
  CalendarPlus,
  X
} from "lucide-react";
import axiosInstance from "../axiosInstance";

export default function AdminHomePage() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    designations: 0,
    presentToday: 0,
    pendingLeaves: 0,
    attendanceRate: "0"
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const name = localStorage.getItem("admin_name");
    if (name) setAdminName(name);

    const fetchData = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];

        const [empRes, deptRes, desigRes, attendanceRes, leaveRes, dedRes, salaryRes] = await Promise.all([
          axiosInstance.get("/api/employees/profiles/"),
          axiosInstance.get("/api/employees/departments/"),
          axiosInstance.get("/api/employees/designations/"),
          axiosInstance.get(`/api/attendance/attendance-by-date/?date=${today}`),
          axiosInstance.get("/api/attendance/leaves/"),
          axiosInstance.get("/api/employees/employee-deductions/"),
          axiosInstance.get("/api/salary/records/")
        ]);

        const presentCount = attendanceRes.data.filter(a => a.attendance?.is_present).length;
        const totalEligible = attendanceRes.data.length;
        const pendingLeavesSet = leaveRes.data.filter(l => l.status === "pending");

        setStats({
          employees: empRes.data.length || 0,
          departments: deptRes.data.length || 0,
          designations: desigRes.data.length || 0,
          presentToday: presentCount,
          pendingLeaves: pendingLeavesSet.length,
          attendanceRate: totalEligible > 0 ? `${Math.round((presentCount / totalEligible) * 100)}%` : "0%"
        });

        // Dynamic Activities (Filter: Last 3 days including today)
        const now = new Date();
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(now.getDate() - 3);
        threeDaysAgo.setHours(0, 0, 0, 0);
        const cutoffTime = threeDaysAgo.getTime();

        const recentActivities = [
          ...empRes.data.map(e => ({
            user: e.name,
            action: `Joined as ${e.designation?.title || "Staff"}`,
            time: formatTime(e.created_at || e.date_of_joining),
            icon: UserPlus,
            timestamp: new Date(e.created_at || e.date_of_joining).getTime()
          })),
          ...dedRes.data.map(d => ({
            user: d.employee_name,
            action: `New deduction: ${d.deduction_type_name} (₹${d.amount})`,
            time: formatTime(d.created_at || d.date),
            icon: Scissors,
            timestamp: new Date(d.created_at || d.date).getTime()
          })),
          ...leaveRes.data.map(l => ({
            user: l.employee_name,
            action: l.status === 'approved' ? "Leave approved" :
              l.status === 'rejected' ? "Leave rejected" : "Leave applied",
            time: formatTime(l.updated_at || l.created_at || l.date),
            icon: CalendarPlus,
            timestamp: new Date(l.updated_at || l.created_at || l.date).getTime()
          })),
          ...salaryRes.data.filter(s => s.status === "paid" || s.status === "partially_paid").map(s => ({
            user: s.employee_name,
            action: s.status === "paid" ? `Salary Paid (₹${s.paid_amount})` : `Partial Payment (₹${s.paid_amount})`,
            time: formatTime(s.paid_date || s.generated_on),
            icon: CircleDollarSign,
            timestamp: new Date(s.paid_date || s.generated_on).getTime()
          }))
        ]
          .filter(act => act.timestamp >= cutoffTime && !isNaN(act.timestamp))
          .sort((a, b) => b.timestamp - a.timestamp);

        setActivities(recentActivities);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTime = (ts) => {
    if (!ts) return "Recently";
    const date = new Date(ts);
    const now = new Date();

    // Check if it's just a Date (no time part) or if time is midnight
    const hasTime = ts.includes('T') || ts.includes(':');

    if (!hasTime) {
      // Local date handling
      const dDate = new Date(date.toDateString());
      const dNow = new Date(now.toDateString());
      const diffDays = Math.round((dNow - dDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 0) return "Upcoming";
      return `${diffDays} days ago`;
    }

    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);

    if (diffMins < 1 && diffMins >= 0) return "Just now";
    if (diffMins < 60 && diffMins > 0) return `${diffMins} min ago`;
    if (diffHours < 24 && diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 0) return "Upcoming";
    return `${diffDays} days ago`;
  };

  const statCards = [
    { label: "Total Employees", value: stats.employees, icon: Users, color: "bg-blue-500", trend: "Staff Members", path: "/admin/employees" },
    { label: "Present Today", value: stats.presentToday, subValue: stats.attendanceRate, icon: CalendarCheck, color: "bg-emerald-500", trend: "Today's Attendance", path: "/admin/attendance-overview" },
    { label: "Pending Leaves", value: stats.pendingLeaves, icon: FileX, color: "bg-amber-500", trend: "Requires Review", path: "/admin/employees-leaves" },
    { label: "Designations", value: stats.designations, icon: Briefcase, color: "bg-indigo-500", trend: "Role Types", path: "/admin/designations" },
  ];

  const quickActions = [
    { label: "Add New Employee", path: "/admin/employees/add", icon: Plus, desc: "Onboard new staff member", color: "text-blue-600 bg-blue-50" },
    { label: "Process Salary", path: "/admin/salaries", icon: FilePieChart, desc: "Generate monthly payroll", color: "text-indigo-600 bg-indigo-50" },
    { label: "Attendance Log", path: "/admin/attendance-overview", icon: Clock, desc: "Review shift logs", color: "text-emerald-600 bg-emerald-50" },
    { label: "Generate Reports", path: "/admin/reports", icon: TrendingUp, desc: "Export system analytics", color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, <span className="font-semibold text-indigo-600">{adminName || "Admin"}</span>! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg">Overview</button>
          <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700" onClick={() => navigate("/admin/reports")}>Analytics</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => navigate(card.path)}
              className="bg-white text-left rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${card.color} opacity-5 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-110`}></div>
              <div className="flex flex-col gap-4">
                <div className={`${card.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-current/10`}>
                  <Icon className="text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-2xl font-bold text-slate-900">{loading ? "..." : card.value}</h3>
                    {card.subValue && <span className="text-sm font-semibold text-emerald-600">{card.subValue}</span>}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-medium flex items-center gap-1">
                    {card.trend}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 px-1 flex items-center gap-2">
            Quick Operations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/5 transition-all text-left group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${action.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{action.label}</p>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{action.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Activity List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 px-1">
            Recent Activity
          </h2>
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm divide-y divide-slate-50 min-h-[400px]">
            {activities.length > 0 ? activities.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0 group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{item.user}</p>
                  <p className="text-xs text-slate-500">{item.action}</p>
                </div>
                <span className="text-[10px] font-medium text-slate-400">{item.time}</span>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <History className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
            {activities.length > 0 && (
              <button
                className="w-full mt-6 text-sm font-bold text-indigo-600 hover:text-indigo-700 py-2 border-t border-slate-50"
                onClick={() => setIsModalOpen(true)}
              >
                View all logs
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Activity Logs Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl shadow-indigo-500/10 flex flex-col max-h-[85vh] overflow-hidden border border-white/20">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Activity Logs</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Last 3 days of operations</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white rounded-2xl transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {activities.length > 0 ? activities.map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:scale-105 transition-all">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.user}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{item.action}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">{item.time}</span>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                  <History className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">No activity records found</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-50 bg-slate-50/30">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
