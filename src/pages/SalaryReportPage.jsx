import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function SalaryReportPage() {
  const now = new Date();
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [data, setData] = useState([]);

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const years = Array.from({ length: 10 }, (_, i) => String(now.getFullYear() - 5 + i));

  const load = async () => {
    try {
      const res = await axiosInstance.post("/api/salary/generate/", { year, month });
      setData(res.data);
    } catch {
      toast.error("Failed to load salary report");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const download = async (fmt) => {
    try {
      let url = "/api/salary/reports/salaries.csv";
      let mime = "text/csv";
      if (fmt === "pdf") {
        url = "/api/salary/reports/salaries.pdf";
        mime = "application/pdf";
      } else if (fmt === "xlsx") {
        url = "/api/salary/reports/salaries.xlsx";
        mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      }
      const res = await axiosInstance.get(url, {
        params: { year, month },
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: mime });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const mm = String(month).padStart(2, "0");
      const fname =
        fmt === "csv"
          ? `salary_report_${mm}_${year}.csv`
          : fmt === "pdf"
          ? `salary_report_${mm}_${year}.pdf`
          : `salary_report_${mm}_${year}.xlsx`;
      link.download = fname;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="p-6 flex-1 overflow-auto">
          <Toaster />
          <h1 className="text-2xl font-bold mb-4 text-blue-700">Salary Report</h1>
          <div className="flex items-center gap-3 mb-4">
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="border p-2 rounded">
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="border p-2 rounded">
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded">View</button>
            <button onClick={() => download("xlsx")} className="bg-emerald-600 text-white px-3 py-2 rounded">Download Excel</button>
            <button onClick={() => download("pdf")} className="bg-purple-600 text-white px-3 py-2 rounded">Download PDF</button>
          </div>
          {data.length > 0 && (
            <table className="w-full border text-left">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border px-4 py-2">Employee</th>
                  <th className="border px-4 py-2">Code</th>
                  <th className="border px-4 py-2">Present</th>
                  <th className="border px-4 py-2">Absent</th>
                  <th className="border px-4 py-2">Basic</th>
                  <th className="border px-4 py-2">HRA</th>
                  <th className="border px-4 py-2">Transport</th>
                  <th className="border px-4 py-2">COL</th>
                  <th className="border px-4 py-2">Total Allowance</th>
                  <th className="border px-4 py-2">Salary Attendance</th>
                  <th className="border px-4 py-2">Advance Deduction</th>
                  <th className="border px-4 py-2">Other Deductions</th>
                  <th className="border px-4 py-2">Total Deduction</th>
                  <th className="border px-4 py-2">Net Salary</th>
                  <th className="border px-4 py-2">Paid</th>
                  <th className="border px-4 py-2">Balance</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r, idx) => (
                  <tr key={`${r.employee_id}-${idx}`}>
                    <td className="border px-4 py-2">{r.employee_name}</td>
                    <td className="border px-4 py-2">{r.employee_number}</td>
                    <td className="border px-4 py-2">{r.present_days}</td>
                    <td className="border px-4 py-2">{r.absent_days}</td>
                    <td className="border px-4 py-2">{Number(r.basic_salary).toFixed(2)}</td>
                    <td className="border px-4 py-2">{Number(r.house_rent_allowance).toFixed(2)}</td>
                    <td className="border px-4 py-2">{Number(r.transportation_allowance).toFixed(2)}</td>
                    <td className="border px-4 py-2">{Number(r.cost_of_living_allowance).toFixed(2)}</td>
                    <td className="border px-4 py-2">{Number(r.total_allowance).toFixed(2)}</td>
                    <td className="border px-4 py-2">{Number(r.salary_on_attendance).toFixed(2)}</td>
                    <td className="border px-4 py-2">{Number(r.advance_deduction).toFixed(2)}</td>
                    <td className="border px-4 py-2">{Number(r.other_deductions).toFixed(2)}</td>
                    <td className="border px-4 py-2">{Number(r.total_deduction).toFixed(2)}</td>
                    <td className="border px-4 py-2">{Number(r.total_salary).toFixed(2)}</td>
                    <td className="border px-4 py-2">{Number(r.paid_amount || 0).toFixed(2)}</td>
                    <td className="border px-4 py-2">{Number(r.balance_amount || 0).toFixed(2)}</td>
                    <td className="border px-4 py-2">{r.status}</td>
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
