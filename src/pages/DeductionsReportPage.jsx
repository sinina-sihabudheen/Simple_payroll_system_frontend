import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DeductionsReportPage() {
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
      const res = await axiosInstance.get("/api/employees/reports/deductions/", {
        params: { year, month },
      });
      setData(res.data);
    } catch {
      toast.error("Failed to load deductions report");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const download = async (fmt) => {
    try {
      let url = "/api/employees/reports/deductions.pdf";
      let mime = "application/pdf";
      if (fmt === "xlsx") {
        url = "/api/employees/reports/deductions.xlsx";
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
      link.download = fmt === "xlsx" ? `employee_deductions_report_${mm}_${year}.xlsx` : `employee_deductions_report_${mm}_${year}.pdf`;
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
          <h1 className="text-2xl font-bold mb-4 text-blue-700">Employee Deductions Report</h1>
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
            <button onClick={() => download("pdf")} className="bg-purple-600 text-white px-3 py-2 rounded">Download PDF</button>
            <button onClick={() => download("xlsx")} className="bg-emerald-600 text-white px-3 py-2 rounded">Download Excel</button>
          </div>
          <table className="w-full border text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2">Employee</th>
                <th className="border px-4 py-2">Code</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Method</th>
                <th className="border px-4 py-2">Months</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Reimbursed</th>
                <th className="border px-4 py-2">Remaining</th>
                <th className="border px-4 py-2">Closed</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, idx) => (
                <tr key={`${d.id}-${idx}`}>
                  <td className="border px-4 py-2">{d.employee_name}</td>
                  <td className="border px-4 py-2">{d.employee_code}</td>
                  <td className="border px-4 py-2">{d.deduction_type}</td>
                  <td className="border px-4 py-2">{d.amount}</td>
                  <td className="border px-4 py-2">{d.method}</td>
                  <td className="border px-4 py-2">{d.months || "-"}</td>
                  <td className="border px-4 py-2">{d.date?.slice(0, 10) || "-"}</td>
                  <td className="border px-4 py-2">{d.reimbursed_amount}</td>
                  <td className="border px-4 py-2">{d.remaining_amount}</td>
                  <td className="border px-4 py-2">{d.is_closed ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
