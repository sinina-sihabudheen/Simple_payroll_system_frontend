import { useState } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../axiosInstance";

function PayModal({ salary, onClose, onPaid }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const balanceDue = salary.balance_amount ?? salary.total_salary;

  const handlePay = async () => {
    const amountToPay = parseFloat(amount);
    if (isNaN(amountToPay) || amountToPay <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.patch(`/api/salary/pay/${salary.id}/`, {
        paid_amount: amountToPay,
      });
      toast.success(`Paid ${res.data.paid_amount}`);
      onPaid(res.data);
      onClose();
    } catch {
      toast.error("Failed to pay salary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-blue-700 mb-1">Pay Salary</h2>
        <p className="text-sm text-gray-500 mb-4">
          {salary.employee_name} — {salary.employee_number}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
          <div className="bg-gray-50 rounded p-3">
            <p className="text-gray-400 text-xs mb-1">Net Salary</p>
            <p className="font-semibold">{parseFloat(salary.total_salary).toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-gray-400 text-xs mb-1">Already Paid</p>
            <p className="font-semibold">{parseFloat(salary.paid_amount || 0).toFixed(2)}</p>
          </div>
          <div className="bg-blue-50 rounded p-3 col-span-2">
            <p className="text-blue-400 text-xs mb-1">Balance Due</p>
            <p className="font-semibold text-blue-700">{parseFloat(balanceDue).toFixed(2)}</p>
          </div>
        </div>

        <label className="block text-sm text-gray-700 mb-1">Amount to pay now</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Paying..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SalaryPage() {
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("9");
  const [result, setResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [payTarget, setPayTarget] = useState(null); // salary row being paid

  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.post("/api/salary/generate/", { year, month });
      setResult(res.data);
      toast.success("Salaries fetched");
    } catch {
      toast.error("Failed to fetch salaries");
    }
  };

  const handlePaid = (updated) => {
    setResult((prev) =>
      prev.map((sal) => (sal.id === updated.id ? { ...sal, ...updated } : sal))
    );
  };

  const filteredSalaries = result.filter(sal =>
    sal.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sal.employee_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Generate Salary</h1>
        <div className="flex items-center gap-4">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64 shadow-sm"
            />
          </div> */}
          <div className="flex gap-2">
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border border-slate-200 rounded-lg p-2 text-sm w-24 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
              placeholder="Year"
            />
            <input
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-slate-200 rounded-lg p-2 text-sm w-20 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
              placeholder="Month"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* Salary Table */}
      {filteredSalaries.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
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
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">SL No.</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee Name</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">HRA</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transport</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">COLA</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Basic</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Present</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Attend. Sal</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Advance</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Other Ded.</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider font-bold">Total Ded.</th>
                <th className="px-4 py-4 text-xs font-bold text-indigo-600 uppercase tracking-wider">Net Salary</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Paid</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-blue-600">Balance</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSalaries.map((salary, index) => (
                <tr key={salary.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-slate-600">{index + 1}</td>
                  <td className="px-4 py-4 font-medium text-slate-900">{salary.employee_name}</td>
                  <td className="px-4 py-4 text-slate-600">{salary.employee_number}</td>
                  <td className="px-4 py-4 text-slate-600">{parseFloat(salary.house_rent_allowance).toFixed(2)}</td>
                  <td className="px-4 py-4 text-slate-600">{parseFloat(salary.transportation_allowance).toFixed(2)}</td>
                  <td className="px-4 py-4 text-slate-600">{parseFloat(salary.cost_of_living_allowance).toFixed(2)}</td>
                  <td className="px-4 py-4 text-slate-600">{parseFloat(salary.basic_salary).toFixed(2)}</td>
                  <td className="px-4 py-4 text-slate-600">{parseFloat(salary.gross_basic_salary).toFixed(2)}</td>
                  <td className="px-4 py-4 text-center text-slate-600 font-medium">{salary.present_days}</td>
                  <td className="px-4 py-4 text-slate-600">{parseFloat(salary.salary_on_attendance).toFixed(2)}</td>
                  <td className="px-4 py-4 text-red-500">{parseFloat(salary.advance_deduction).toFixed(2)}</td>
                  <td className="px-4 py-4 text-red-500">{parseFloat(salary.other_deductions).toFixed(2)}</td>
                  <td className="px-4 py-4 text-red-600 font-bold">{parseFloat(salary.total_deduction).toFixed(2)}</td>
                  <td className="px-4 py-4 text-indigo-600 font-bold">{parseFloat(salary.total_salary).toFixed(2)}</td>
                  <td className="px-4 py-4 text-green-600">{parseFloat(salary.paid_amount || 0).toFixed(2)}</td>
                  <td className="px-4 py-4 text-blue-600 font-semibold">{parseFloat(salary.balance_amount ?? salary.total_salary).toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${salary.status === 'paid' ? 'bg-green-100 text-green-800' :
                      salary.status === 'partially_paid' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                      {salary.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setPayTarget(salary)}
                      disabled={salary.status === "paid"}
                      className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      {salary.status === "paid" ? "Paid" : "Pay"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : result.length > 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500">No salaries found matching your search.</p>
        </div>
      )}

      {/* Pay Modal */}
      {payTarget && (
        <PayModal
          salary={payTarget}
          onClose={() => setPayTarget(null)}
          onPaid={handlePaid}
        />
      )}
    </div>
  );
}
