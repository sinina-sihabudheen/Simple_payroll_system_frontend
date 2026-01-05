
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axiosInstance from "../axiosInstance";
// import toast, { Toaster } from "react-hot-toast";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

// export default function SingleEmployeePage() {
//   const { id } = useParams();
//   const [employee, setEmployee] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchEmployee = async () => {
//       try {
//         const res = await axiosInstance.get(`/api/employees/profiles/${id}/`);
//         setEmployee(res.data);
//       } catch {
//         toast.error("Failed to fetch employee details");
//       }
//     };

//     fetchEmployee();
//   }, [id]);

//   if (!employee) {
//     return (
//       <div className="p-6">
//         <Toaster />
//         <p className="text-gray-600">Loading employee details...</p>
//       </div>
//     );
//   }

//   const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "-");

//   return (
//     <div className="flex flex-col h-screen">
//       <Navbar />
//       <div className="flex h-screen">
//         <Sidebar />
//         <div className="p-6 flex-1 overflow-auto">
//           <Toaster />
//           <h1 className="text-2xl font-bold mb-6 text-blue-700">Employee Details</h1>

//           {/* Basic & Employment Info */}
//           <Section title="Basic & Employment Info">
//             <InfoRow label="Name" value={employee.name} />
//             <InfoRow label="Employee Code" value={employee.employee_code} />
//             <InfoRow label="Department" value={employee.department?.name} />
//             <InfoRow label="Designation" value={employee.designation?.title} />
//             <InfoRow label="Category" value={employee.category} />
//             <InfoRow label="Date of Birth" value={formatDate(employee.date_of_birth)} />
//             <InfoRow label="Date of Joining" value={formatDate(employee.date_of_joining)} />
//             <InfoRow label="Last Working Day" value={formatDate(employee.last_working_day)} />
//             <InfoRow label="Status" value={employee.status} />
//             {employee.date_of_resignation && (
//               <InfoRow label="Date of Resignation" value={formatDate(employee.date_of_resignation)} />
//             )}
//           </Section>

//           {/* Salary Info */}
//           <Section title="Salary Details">
//             <InfoRow
//               label="Basic Salary"
//               value={employee.basic_salary ? `₹${Number(employee.basic_salary).toFixed(2)}` : "-"}
//             />
//             <InfoRow
//               label="House Rent Allowance"
//               value={employee.house_rent_allowance ? `₹${Number(employee.house_rent_allowance).toFixed(2)}` : "-"}
//             />
//             <InfoRow
//               label="Transportation Allowance"
//               value={employee.transportation_allowance ? `₹${Number(employee.transportation_allowance).toFixed(2)}` : "-"}
//             />
//             <InfoRow
//               label="Cost of Living Allowance"
//               value={employee.cost_of_living_allowance ? `₹${Number(employee.cost_of_living_allowance).toFixed(2)}` : "-"}
//             />
//             <InfoRow
//               label="Net Salary"
//               value={employee.net_salary ? `₹${Number(employee.net_salary).toFixed(2)}` : "-"}
//             />
//           </Section>

//           {/* Documents */}
//           <Section title="Passport & Emirates Info">
//             <InfoRow label="Passport Number" value={employee.passport_number} />
//             <InfoRow label="Passport Expiry Date" value={formatDate(employee.passport_expiry_date)} />
//             <InfoRow label="Emirates ID Number" value={employee.emirates_id_number} />
//             <InfoRow label="Emirates ID Expiry Date" value={formatDate(employee.emirates_id_expiry_date)} />
//           </Section>

//           {/* Allowances */}
//           <Section title="Allowances">
//             {employee.allowances && employee.allowances.length > 0 ? (
//               <table className="min-w-full border border-gray-200 text-sm">
//                 <thead className="bg-blue-50 text-blue-700">
//                   <tr>
//                     <th className="border px-4 py-2 text-left">Allowance</th>
//                     <th className="border px-4 py-2 text-left">Amount (₹)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {employee.allowances.map((a) => (
//                     <tr key={a.id} className="hover:bg-blue-50">
//                       <td className="border px-4 py-2">{a.allowance_name || "Unnamed Allowance"}</td>
//                       <td className="border px-4 py-2">
//                         {a.amount ? Number(a.amount).toFixed(2) : "-"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-gray-600">No allowances assigned</p>
//             )}
//           </Section>

//           {/* Update Button */}
//           <div className="mt-6">
//             <button
//               onClick={() => navigate(`/admin/employees/edit/${employee.id}`)}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
//             >
//               Update Employee
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function InfoRow({ label, value }) {
//   return (
//     <tr className="hover:bg-blue-50">
//       <td className="border px-4 py-2 font-medium text-blue-900 w-48">{label}</td>
//       <td className="border px-4 py-2 text-gray-800">{value || "-"}</td>
//     </tr>
//   );
// }

// function Section({ title, children }) {
//   return (
//     <div className="mt-6 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
//       <h2 className="text-lg font-semibold bg-blue-100 text-blue-800 px-4 py-2">{title}</h2>
//       <div className="p-4">
//         <table className="min-w-full text-sm text-left">
//           <tbody>{children}</tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function SingleEmployeePage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axiosInstance.get(`/api/employees/profiles/${id}/`);
        setEmployee(res.data);
      } catch {
        toast.error("Failed to fetch employee details");
      }
    };

    fetchEmployee();
  }, [id]);

  if (!employee) {
    return (
      <div className="p-6">
        <Toaster />
        <p className="text-gray-600">Loading employee details...</p>
      </div>
    );
  }

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "-");

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="p-6 flex-1 overflow-auto">
          <Toaster />
          <h1 className="text-2xl font-bold mb-6 text-blue-700">Employee Details</h1>

          {/* Basic & Employment Info */}
          <Section title="Basic & Employment Info">
            <InfoRow label="Name" value={employee.name} />
            <InfoRow label="Employee Code" value={employee.employee_code} />
            <InfoRow label="Department" value={employee.department?.name} />
            <InfoRow label="Designation" value={employee.designation?.title} />
            <InfoRow label="Category" value={employee.category} />
            <InfoRow label="Date of Birth" value={formatDate(employee.date_of_birth)} />
            <InfoRow label="Date of Joining" value={formatDate(employee.date_of_joining)} />
            <InfoRow label="Last Working Day" value={formatDate(employee.last_working_day)} />
            <InfoRow label="Status" value={employee.status} />
            {employee.date_of_resignation && (
              <InfoRow label="Date of Resignation" value={formatDate(employee.date_of_resignation)} />
            )}
          </Section>

          {/* Salary Info */}
          <Section title="Salary Details">
            <InfoRow
              label="Basic Salary"
              value={employee.basic_salary ? `₹${Number(employee.basic_salary).toFixed(2)}` : "-"}
            />
            <InfoRow
              label="House Rent Allowance"
              value={employee.house_rent_allowance ? `₹${Number(employee.house_rent_allowance).toFixed(2)}` : "-"}
            />
            <InfoRow
              label="Transportation Allowance"
              value={employee.transportation_allowance ? `₹${Number(employee.transportation_allowance).toFixed(2)}` : "-"}
            />
            <InfoRow
              label="Cost of Living Allowance"
              value={employee.cost_of_living_allowance ? `₹${Number(employee.cost_of_living_allowance).toFixed(2)}` : "-"}
            />
            <InfoRow
              label="Net Salary"
              value={employee.net_salary ? `₹${Number(employee.net_salary).toFixed(2)}` : "-"}
            />
          </Section>

          {/* Documents */}
          <Section title="Passport & Emirates Info">
            <InfoRow label="Passport Number" value={employee.passport_number} />
            <InfoRow label="Passport Expiry Date" value={formatDate(employee.passport_expiry_date)} />
            <InfoRow label="Emirates ID Number" value={employee.emirates_id_number} />
            <InfoRow label="Emirates ID Expiry Date" value={formatDate(employee.emirates_id_expiry_date)} />
          </Section>

          {/* Update Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate(`/admin/employees/edit/${employee.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              Update Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <tr className="hover:bg-blue-50">
      <td className="border px-4 py-2 font-medium text-blue-900 w-48">{label}</td>
      <td className="border px-4 py-2 text-gray-800">{value || "-"}</td>
    </tr>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-6 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <h2 className="text-lg font-semibold bg-blue-100 text-blue-800 px-4 py-2">{title}</h2>
      <div className="p-4">
        <table className="min-w-full text-sm text-left">
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}
