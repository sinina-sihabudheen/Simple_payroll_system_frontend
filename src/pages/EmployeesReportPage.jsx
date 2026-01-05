import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function EmployeesReportPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get("/api/employees/reports/employees/");
        setData(res.data);
      } catch {
        toast.error("Failed to load employees report");
      }
    };
    load();
  }, []);

  const download = async (fmt) => {
    try {
      let url = "/api/employees/reports/employees.pdf";
      let mime = "application/pdf";
      if (fmt === "xlsx") {
        url = "/api/employees/reports/employees.xlsx";
        mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      }
      const res = await axiosInstance.get(url, { responseType: "blob" });
      const blob = new Blob([res.data], { type: mime });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const year = new Date().getFullYear();
      link.download = fmt === "xlsx" ? `employees_list_${year}.xlsx` : `employees_list_${year}.pdf`;
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
          <h1 className="text-2xl font-bold mb-4 text-blue-700">Employees Report</h1>
          <div className="flex gap-2 mb-4">
            <button onClick={() => download("pdf")} className="bg-purple-600 text-white px-3 py-2 rounded">Download PDF</button>
            <button onClick={() => download("xlsx")} className="bg-emerald-600 text-white px-3 py-2 rounded">Download Excel</button>
          </div>
          <table className="w-full border text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Code</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Designation</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Net Salary</th>
                <th className="border px-4 py-2">Date Of Joining</th>
              </tr>
            </thead>
            <tbody>
              {data.map((e) => (
                <tr key={e.id}>
                  <td className="border px-4 py-2">{e.id}</td>
                  <td className="border px-4 py-2">{e.name}</td>
                  <td className="border px-4 py-2">{e.employee_code}</td>
                  <td className="border px-4 py-2">{e.department || "-"}</td>
                  <td className="border px-4 py-2">{e.designation || "-"}</td>
                  <td className="border px-4 py-2">{e.status}</td>
                  <td className="border px-4 py-2">{e.net_salary}</td>
                  <td className="border px-4 py-2">{e.date_of_joining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
