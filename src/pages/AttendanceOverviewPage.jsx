import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AttendanceOverviewPage() {
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [editingId, setEditingId] = useState(null);
  const [presentEditingId, setPresentEditingId] = useState(null);

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

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
    <div className="flex h-screen bg-white">
      <Sidebar />

      <div className="p-6 flex-1 overflow-auto">
        <Toaster />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">
            Attendance - {selectedDate}
          </h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg shadow-sm">
            <thead className="bg-blue-100 text-black-700">
              <tr>
                <th className="border px-4 py-2">Employee</th>
                <th className="border px-4 py-2">Code</th>
                <th className="border px-4 py-2">In Time</th>
                <th className="border px-4 py-2">Out Time</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => {
                const att = rec.attendance;

                const isEditing = editingId === rec.employee_id;

                return (
                  <tr
                    key={rec.employee_id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="border px-4 py-2">{rec.employee_name}</td>
                    <td className="border px-4 py-2">{rec.employee_code}</td>
                    <td className="border px-4 py-2">
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
                          className="border border-blue-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      ) : (
                        att?.in_time || "-"
                      )}
                    </td>
                    <td className="border px-3 py-2">
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
                          className="border border-blue-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-28"
                        />
                      ) : (
                        att?.out_time || "-"
                      )}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {att
                        ? att.is_present
                          ? "✅ Present"
                          : "❌ Absent"
                        : "Not Marked"}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {!att ? (
                        presentEditingId === rec.employee_id ? (
                          <div className="flex items-center justify-center gap-2">
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
                              className="border border-blue-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-24"
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
                              className="border border-blue-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-24"
                            />
                            <button
                              onClick={() =>
                                markPresent(rec.employee_id, rec.inTime, rec.outTime)
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setPresentEditingId(null)}
                              className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => setPresentEditingId(rec.employee_id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                            >
                              Mark Present
                            </button>
                            <button
                              onClick={() => markAbsent(rec.employee_id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                            >
                              Mark Absent
                            </button>
                          </div>
                        )
                      ) : isEditing ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() =>
                              markPresent(rec.employee_id, rec.inTime, rec.outTime)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => markAbsent(rec.employee_id)}
                            className="bg-red-300 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Mark Absent
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-300 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingId(rec.employee_id)}
                          className="bg-blue-300 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}
