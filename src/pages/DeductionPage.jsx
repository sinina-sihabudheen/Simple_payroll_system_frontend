import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash, FaPlus } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


export default function DeductionPage() {
  const [deductions, setDeductions] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchDeductions = async () => {
    try {
      const res = await axiosInstance.get("/api/salary/deductions/");
      setDeductions(res.data);
    } catch {
      toast.error("Failed to load deductions");
    }
  };

  useEffect(() => {
    fetchDeductions();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Name is required");
    try {
      await axiosInstance.post("/api/salary/deductions/", {
        name,
        description,
      });
      toast.success("Deduction added");
      setName("");
      setDescription("");
      setShowModal(false);
      fetchDeductions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create deduction");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/salary/deductions/${id}/`);
      toast.success("Deleted successfully");
      fetchDeductions();
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
                <h1 className="text-2xl font-bold text-blue-700">Deductions</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <FaPlus /> Add
                </button>
                </div>

                {deductions.length === 0 ? (
                <p className="text-gray-500">No deductions available.</p>
                ) : (
                <table className="w-full border text-left">
                    <thead className="bg-blue-100">
                    <tr>
                        <th className="border px-4 py-2">#</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Description</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {deductions.map((deduction, index) => (
                        <tr key={deduction.id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{deduction.name}</td>
                        <td className="border px-4 py-2">{deduction.description}</td>
                        <td className="border px-4 py-2">
                            <button
                            onClick={() => handleDelete(deduction.id)}
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
                    <h2 className="text-xl font-semibold mb-4">Add Deduction</h2>
                    <input
                        type="text"
                        placeholder="Deduction Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2 mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border p-2 mb-2"
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
