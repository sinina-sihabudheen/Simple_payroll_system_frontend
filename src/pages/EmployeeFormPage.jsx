
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../axiosInstance";

export default function EmployeeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    employee_code: "",
    department_id: "",
    designation_id: "",
    category: "",
    date_of_birth: "",
    date_of_joining: "",
    date_of_resignation: "",
    last_working_day: "",
    passport_number: "",
    passport_expiry_date: "",
    emirates_id_number: "",
    emirates_id_expiry_date: "",
    status: "working",
    basic_salary: "",
    house_rent_allowance: "",
    transportation_allowance: "",
    cost_of_living_allowance: "",
  });

  const [options, setOptions] = useState({
    departments: [],
    designations: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [departments, designations] = await Promise.all([
          axiosInstance.get("/api/employees/departments/"),
          axiosInstance.get("/api/employees/designations/"),
        ]);
        setOptions({
          departments: departments.data,
          designations: designations.data,
        });
      } catch {
        toast.error("Failed to load dropdown data");
      }
    };

    const fetchEmployee = async () => {
      try {
        const res = await axiosInstance.get(`/api/employees/profiles/${id}/`);
        setFormData({
          ...res.data,
          department_id: res.data.department?.id || "",
          designation_id: res.data.designation?.id || "",
        });
      } catch {
        toast.error("Failed to load employee");
      }
    };

    fetchOptions();
    if (isEdit) fetchEmployee();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };

      if (!payload.date_of_resignation) delete payload.date_of_resignation;
      if (!payload.last_working_day) delete payload.last_working_day;

      if (isEdit) {
        await axiosInstance.patch(`/api/employees/profiles/${id}/`, payload);
        toast.success("Employee updated");
      } else {
        await axiosInstance.post("/api/employees/profiles/", payload);
        toast.success("Employee created");
      }
      navigate("/admin/employees/");
    } catch {
      toast.error("Failed to submit form");
    }
  };

  const handleCancel = () => {
    navigate("/admin/employees/");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <Toaster />
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 border-b pb-2">
          {isEdit ? "Edit Employee" : "Add New Employee"}
        </h2>

        {/* Text/number/date inputs */}
        {[
          { name: "name", label: "Name" },
          { name: "employee_code", label: "Employee Code" },
          { name: "date_of_birth", label: "Date of Birth", type: "date" },
          { name: "date_of_joining", label: "Date of Joining", type: "date" },
          { name: "date_of_resignation", label: "Date of Resignation", type: "date" },
          { name: "last_working_day", label: "Last Working Day", type: "date" },
          { name: "passport_number", label: "Passport Number" },
          { name: "passport_expiry_date", label: "Passport Expiry Date", type: "date" },
          { name: "emirates_id_number", label: "Emirates ID Number" },
          { name: "emirates_id_expiry_date", label: "Emirates ID Expiry Date", type: "date" },
          { name: "basic_salary", label: "Basic Salary", type: "number" },
          { name: "house_rent_allowance", label: "House Rent Allowance", type: "number" },
          { name: "transportation_allowance", label: "Transportation Allowance", type: "number" },
          { name: "cost_of_living_allowance", label: "Cost of Living Allowance", type: "number" },
        ].map(({ name, label, type = "text" }) => (
          <div key={name} className="mb-4">
            <label className="block mb-1 text-gray-700 font-medium">{label}</label>
            <input
              name={name}
              type={type}
              value={formData[name] || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        {/* Status Dropdown */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="working">Working</option>
            <option value="resigned">Resigned</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>

        {/* Foreign Keys */}
        {[
          { name: "department_id", label: "Department", data: options.departments,  },
          { name: "designation_id", label: "Designation", data: options.designations },
        ].map(({ name, label, data }) => (
          <div key={name} className="mb-4">
            <label className="block mb-1 text-gray-700 font-medium">{label}</label>
            <select
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select {label}</option>
              {data.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}{item.title}
                </option>
              ))}
            </select>
          </div>
        ))}
        {/* Category Dropdown */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium">Category</label>
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Category</option>
            <option value="staff">Staff</option>
            <option value="labour">Labour</option>
          </select>
        </div>
        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full shadow"
          >
            {isEdit ? "Update" : "Submit"}
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg w-full shadow"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
