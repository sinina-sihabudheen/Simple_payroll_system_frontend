import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSummary, setSyncSummary] = useState(null);

  const fetchAttendance = async () => {
    try {
      const res = await axiosInstance.get("/api/attendance/attendance/");
      const punchMissed = res.data.filter(
        (att) => !att.in_time && !att.out_time && !att.marked_manually
      );
      setAttendance(punchMissed);
      return punchMissed;
    } catch {
      toast.error("Failed to fetch attendance");
      return [];
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const markAbsent = async (record) => {
    try {
      await axiosInstance.post("/api/attendance/", {
        employee: record.employee,
        date: record.date,
        in_time: null,
        out_time: null,
        is_present: false,
        marked_manually: true,
      });
      toast.success("Marked as Absent");
      fetchAttendance(); // refresh the list
    } catch (error) {
      toast.error("Failed to mark absent");
    }
  };

  const syncAttendance = async () => {
    setIsSyncing(true);
    try {
      const res = await axiosInstance.post("/api/attendance/sync-essl/");
      const processed = res?.data?.records_processed ?? 0;
      const missed = await fetchAttendance();
      const missedCount = missed.length;
      setSyncSummary({
        processed,
        missedCount,
        deviceStatus: res?.data?.device_status,
        at: new Date().toISOString(),
      });
      toast.success(`Synced ${processed} records. Missed: ${missedCount}`);
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.device_status ||
        "Failed to sync from device";
      toast.error(msg);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
    <div className="flex h-screen">
      <Sidebar />
      <div className="p-6 flex-1">
        <Toaster />
        <div className="mb-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-semibold flex-1">Missed Punch Attendance</h2>
            <div className="flex justify-end">
              <button
                onClick={syncAttendance}
                disabled={isSyncing}
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
                  isSyncing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSyncing ? "Syncing..." : "Sync from Device"}
              </button>
            </div>
          </div>
          {syncSummary && (
            <div className="mt-2 text-sm text-gray-700">
              <span className="font-medium">Last Sync:</span> {new Date(syncSummary.at).toLocaleString()} •{" "}
              <span className="font-medium">Processed:</span> {syncSummary.processed} •{" "}
              <span className="font-medium">Missed Remaining:</span> {syncSummary.missedCount}
              {syncSummary.deviceStatus ? ` • ${syncSummary.deviceStatus}` : ""}
            </div>
          )}
        </div>

        {attendance.length === 0 ? (
          <p className="text-gray-600">No punch-missed records found.</p>
        ) : (
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Employee ID</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((att) => (
                <tr key={`${att.employee}-${att.date}`} className="text-center">
                  <td className="p-2 border">{att.employee}</td>
                  <td className="p-2 border">{att.date}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => markAbsent(att)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Mark Absent
                    </button>
                  </td>
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
