
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash, FaPlus } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function EmployeeTypePage() {
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchEmployeeTypes = async () => {
    try {
      const res = await axiosInstance.get("/api/employees/employee-types/");
      setEmployeeTypes(res.data);
    } catch {
      toast.error("Failed to load employee types");
    }
  };

  useEffect(() => {
    fetchEmployeeTypes();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Name is required");
    try {
      await axiosInstance.post("/api/employees/employee-types/", { name });
      toast.success("Employee type added");
      setName("");
      setShowModal(false);
      fetchEmployeeTypes();
    } catch {
      toast.error("Failed to create employee type");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/employees/employee-types/${id}/`);
      toast.success("Deleted successfully");
      fetchEmployeeTypes();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="p-6 max-w-2xl mx-auto relative">
        <Toaster />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700">Employee Types</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </div>

        {employeeTypes.length === 0 ? (
          <p className="text-gray-500">No employee types available.</p>
        ) : (
          <table className="w-full border text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeTypes.map((type, index) => (
                <tr key={type.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{type.name}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
              <h2 className="text-xl font-semibold mb-4">Add Employee Type</h2>
              <input
                type="text"
                placeholder="Employee Type Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
