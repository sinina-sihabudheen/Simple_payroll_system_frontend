import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DeviceSettingsPage() {
  const [deviceIp, setDeviceIp] = useState("");
  const [devicePort, setDevicePort] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/attendance/essl-config/");
      setDeviceIp(res.data.device_ip || "");
      setDevicePort(res.data.device_port?.toString() || "");
    } catch {
      toast.error("Failed to load device settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const saveConfig = async () => {
    if (!deviceIp) {
      toast.error("Device IP is required");
      return;
    }
    const portNum = Number(devicePort);
    if (!portNum || portNum <= 0) {
      toast.error("Device port must be a positive number");
      return;
    }
    setSaving(true);
    try {
      await axiosInstance.post("/api/attendance/essl-config/", {
        device_ip: deviceIp,
        device_port: portNum,
      });
      toast.success("Device settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="p-6 flex-1">
          <Toaster />
          <h2 className="text-2xl font-semibold mb-4">ESSL Device Settings</h2>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Device IP</label>
                <input
                  type="text"
                  value={deviceIp}
                  onChange={(e) => setDeviceIp(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="192.168.1.201"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Device Port</label>
                <input
                  type="number"
                  value={devicePort}
                  onChange={(e) => setDevicePort(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="4370"
                  min={1}
                />
              </div>
              <button
                onClick={saveConfig}
                disabled={saving}
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
