import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";

export default function AttendanceOverviewPage() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [presentEditingId, setPresentEditingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get("/api/attendance/attendance-by-date/", {
        params: { date: selectedDate },
      });
      const dataWithTime = res.data.map((rec) => ({
        ...rec,
        inTime: rec.attendance?.in_time || "",
        outTime: rec.attendance?.out_time || "",
      }));
      setRecords(dataWithTime);
    } catch {
      toast.error("Failed to fetch attendance");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedDate]);

  const markAbsent = async (employee_id) => {
    try {
      await axiosInstance.post("/api/attendance/mark-attendance/", {
        employee: employee_id,
        date: selectedDate,
        in_time: null,
        out_time: null,
        is_present: false,
        marked_manually: true,
      });
      toast.success("Marked as Absent");
      fetchRecords();
      setEditingId(null);
    } catch {
      toast.error("Failed to mark absent");
    }
  };

  const markPresent = async (employee_id, in_time, out_time) => {
    if (!in_time) {
      toast.error("In time is required");
      return;
    }

    try {
      await axiosInstance.post("/api/attendance/mark-attendance/", {
        employee: employee_id,
        date: selectedDate,
        in_time,
        out_time: out_time || null,
        is_present: true,
      });
      toast.success("Saved successfully");
      fetchRecords();
      setEditingId(null);
    } catch {
      toast.error("Failed to save");
    }
  };

  const filteredRecords = records.filter(rec =>
    rec.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.employee_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 flex-1 overflow-auto">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Attendance - {selectedDate}
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64 shadow-sm"
            />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm bg-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">In Time</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Out Time</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">
                  No records found matching your search.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => {
                const att = rec.attendance;
                const isEditing = editingId === rec.employee_id;

                return (
                  <tr key={rec.employee_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{rec.employee_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{rec.employee_code}</td>
                    <td className="px-6 py-4 text-sm">
                      {isEditing ? (
                        <input
                          type="time"
                          value={rec.inTime}
                          onChange={(e) =>
                            setRecords((prev) =>
                              prev.map((r) =>
                                r.employee_id === rec.employee_id
                                  ? { ...r, inTime: e.target.value }
                                  : r
                              )
                            )
                          }
                          className="border border-slate-200 p-1.5 rounded text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      ) : (
                        att?.in_time || "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isEditing ? (
                        <input
                          type="time"
                          value={rec.outTime}
                          onChange={(e) =>
                            setRecords((prev) =>
                              prev.map((r) =>
                                r.employee_id === rec.employee_id
                                  ? { ...r, outTime: e.target.value }
                                  : r
                              )
                            )
                          }
                          className="border border-slate-200 p-1.5 rounded text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      ) : (
                        att?.out_time || "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${att ? (att.is_present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : 'bg-slate-100 text-slate-800'
                        }`}>
                        {att ? (att.is_present ? "Present" : "Absent") : "Not Marked"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {!att ? (
                          presentEditingId === rec.employee_id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={rec.inTime}
                                onChange={(e) =>
                                  setRecords((prev) =>
                                    prev.map((r) =>
                                      r.employee_id === rec.employee_id
                                        ? { ...r, inTime: e.target.value }
                                        : r
                                    )
                                  )
                                }
                                className="border border-slate-200 p-1 rounded text-xs w-24"
                              />
                              <input
                                type="time"
                                value={rec.outTime}
                                onChange={(e) =>
                                  setRecords((prev) =>
                                    prev.map((r) =>
                                      r.employee_id === rec.employee_id
                                        ? { ...r, outTime: e.target.value }
                                        : r
                                    )
                                  )
                                }
                                className="border border-slate-200 p-1 rounded text-xs w-24"
                              />
                              <button
                                onClick={() => markPresent(rec.employee_id, rec.inTime, rec.outTime)}
                                className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setPresentEditingId(null)}
                                className="bg-slate-400 text-white px-2 py-1 rounded text-xs hover:bg-slate-500"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => setPresentEditingId(rec.employee_id)}
                                className="text-blue-600 hover:text-blue-700 font-medium text-xs px-2 py-1 bg-blue-50 rounded"
                              >
                                Mark Present
                              </button>
                              <button
                                onClick={() => markAbsent(rec.employee_id)}
                                className="text-red-600 hover:text-red-700 font-medium text-xs px-2 py-1 bg-red-50 rounded"
                              >
                                Mark Absent
                              </button>
                            </>
                          )
                        ) : isEditing ? (
                          <>
                            <button
                              onClick={() => markPresent(rec.employee_id, rec.inTime, rec.outTime)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-slate-400 text-white px-3 py-1 rounded text-xs hover:bg-slate-500"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditingId(rec.employee_id)}
                            className="text-slate-600 hover:text-blue-600 font-medium text-xs px-2 py-1 bg-slate-100 rounded hover:bg-blue-50"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
