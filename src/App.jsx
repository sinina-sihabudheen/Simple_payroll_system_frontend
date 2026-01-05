
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AdminLoginPage from "./pages/AdminLoginPage";
// import AdminHomePage from "./pages/AdminHomePage";
// import DepartmentPage from "./pages/DepartmentPage";
// import CategoryPage from "./pages/CategoryPage";
// import AllowancePage from "./pages/AllowancePage";
// import EmployeeTypePage from "./pages/EmployeeTypePage";
// import EmployeePage from "./pages/EmployeePage";
// import EmployeeAllowancePage from "./pages/EmployeeAllowancePage";
// import EmployeeDeductionPage from "./pages/EmployeeDeductionPage";
// import SalaryPage from "./pages/SalaryPage";
// import EmployeeFormPage from "./pages/EmployeeFormPage";
// import SingleEmployeePage from "./pages/SingleEmployeePage";
// import DesignationPage from "./pages/DesignationPage";
// import AttendancePage from "./pages/AttendancePage";
// import AttendanceOverviewPage from "./pages/AttendanceOverviewPage";
// import EmployeeLeavesPage from "./pages/EmployeeLeavesPage";
// import LeaveTypePage from "./pages/LeaveTypePage";


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AdminLoginPage />} />
//         {/* <Route path="/login" element={<AdminLoginPage />} /> */}
//         <Route path="/admin/home" element={<AdminHomePage />} />
//         <Route path="/admin/departments" element={<DepartmentPage />} />
//         <Route path="/admin/designations" element={<DesignationPage />} />
//         <Route path="/admin/categories" element={<CategoryPage />} />
//         <Route path="/admin/allowances" element={<AllowancePage />} />
//         <Route path="/admin/employee-types" element={<EmployeeTypePage />} />
//         <Route path="/admin/employees/add" element={<EmployeeFormPage />} />
//         <Route path="/admin/employees/:id" element={<SingleEmployeePage />} />
//         <Route path="/admin/employees/edit/:id" element={<EmployeeFormPage />} />
//         <Route path="/admin/employees" element={<EmployeePage />} />
//         <Route path="/admin/employees-allowances" element={<EmployeeAllowancePage />} />        
//         <Route path="/admin/employees-deductions" element={<EmployeeDeductionPage />} />
//         <Route path="/admin/salaries" element={<SalaryPage />} />
//         <Route path="/admin/attendance" element={<AttendancePage />} />
//         <Route path="/admin/attendance-overview" element={<AttendanceOverviewPage />} />
//         <Route path="/admin/employees-leaves" element={<EmployeeLeavesPage />} />
//         <Route path="/admin/leave-types" element={<LeaveTypePage />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AdminLoginPage from "./pages/AdminLoginPage";
// import AdminHomePage from "./pages/AdminHomePage";
// import DepartmentPage from "./pages/DepartmentPage";
// import CategoryPage from "./pages/CategoryPage";
// import AllowancePage from "./pages/AllowancePage";
// import EmployeeTypePage from "./pages/EmployeeTypePage";
// import EmployeePage from "./pages/EmployeePage";
// import EmployeeAllowancePage from "./pages/EmployeeAllowancePage";
// import EmployeeDeductionPage from "./pages/EmployeeDeductionPage";
// import SalaryPage from "./pages/SalaryPage";
// import EmployeeFormPage from "./pages/EmployeeFormPage";
// import SingleEmployeePage from "./pages/SingleEmployeePage";
// import DesignationPage from "./pages/DesignationPage";
// import AttendancePage from "./pages/AttendancePage";
// import AttendanceOverviewPage from "./pages/AttendanceOverviewPage";
// import EmployeeLeavesPage from "./pages/EmployeeLeavesPage";
// import LeaveTypePage from "./pages/LeaveTypePage";
// import DeductionPage from "./pages/DeductionPage";
// import PrivateRoute from "./components/PrivateRoute";

// function App() {
//   return (
//     <Router>
//       <R>
//         <Route path="/" element={<AdminLoginPage />} />

//         <Route
//           path="/admin/home"
//           element={
//             <PrivateRoute>
//               <AdminHomePage />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/admin/departments"
//           element={
//             <PrivateRoute>
//               <DepartmentPage />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/admin/departments"
//           element={
//             <PrivateRoute>
//               <DepartmentPage />
//             </PrivateRoute>
//           }
//         />
//         <Route 
//           path="/admin/designations" 
//           element={
//             <PrivateRoute>
//               <DesignationPage />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/admin/categories" 
//           element={
//             <PrivateRoute>
//               <CategoryPage />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/admin/allowances" 
//           element={
//             <PrivateRoute>
//               <AllowancePage />
//             </PrivateRoute>

//           } 
//         />
//         <Route 
//           path="/admin/employee-types" 
//           element={
//             <PrivateRoute>
//               <EmployeeTypePage />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/admin/employees/add" 
//           element={
//             <PrivateRoute>
//               <EmployeeFormPage />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/admin/employees/:id" 
//           element={
//             <PrivateRoute>
//               <SingleEmployeePage />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/admin/employees/edit/:id" 
//           element={
//             <PrivateRoute>
//               <EmployeeFormPage />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/admin/employees" 
//           element={
//             <PrivateRoute>
//               <EmployeePage />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/admin/employees-allowances" 
//           element={
//             <PrivateRoute>
//               <EmployeeAllowancePage />
//             </PrivateRoute>
//           } 
//         />        
//         <Route 
//           path="/admin/employees-deductions" 
//           element={
//             <PrivateRoute>
//               <EmployeeDeductionPage />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/admin/salaries" 
//           element={
//             <PrivateRoute>
//               <SalaryPage />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/admin/attendance" 
//           element={
//             <PrivateRoute>
//               <AttendancePage />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/admin/attendance-overview" 
//           element={
//             <PrivateRoute>
//               <AttendanceOverviewPage />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/admin/employees-leaves" 
//           element={
//             <PrivateRoute>
//               <EmployeeLeavesPage />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/admin/leave-types" 
//           element={
//             <PrivateRoute>
//               <LeaveTypePage />
//             </PrivateRoute>
//           } 
//         />
//       <Route 
//           path="/admin/deductions" 
//           element={
//             <PrivateRoute>
//               <DeductionPage />
//             </PrivateRoute>
//           } 
//         />
//       </Routes>

//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminHomePage from "./pages/AdminHomePage";
import DepartmentPage from "./pages/DepartmentPage";
import CategoryPage from "./pages/CategoryPage";
import AllowancePage from "./pages/AllowancePage";
import EmployeeTypePage from "./pages/EmployeeTypePage";
import EmployeePage from "./pages/EmployeePage";
import EmployeeAllowancePage from "./pages/EmployeeAllowancePage";
import EmployeeDeductionPage from "./pages/EmployeeDeductionPage";
import SalaryPage from "./pages/SalaryPage";
import EmployeeFormPage from "./pages/EmployeeFormPage";
import SingleEmployeePage from "./pages/SingleEmployeePage";
import DesignationPage from "./pages/DesignationPage";
import AttendancePage from "./pages/AttendancePage";
import AttendanceOverviewPage from "./pages/AttendanceOverviewPage";
import EmployeeLeavesPage from "./pages/EmployeeLeavesPage";
import LeaveTypePage from "./pages/LeaveTypePage";
import DeductionPage from "./pages/DeductionPage";
import PrivateRoute from "./components/PrivateRoute";
import DeviceSettingsPage from "./pages/DeviceSettingsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />

        <Route
          path="/admin/home"
          element={
            <PrivateRoute>
              <AdminHomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <PrivateRoute>
              <DepartmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/designations"
          element={
            <PrivateRoute>
              <DesignationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <PrivateRoute>
              <CategoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/allowances"
          element={
            <PrivateRoute>
              <AllowancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/employee-types"
          element={
            <PrivateRoute>
              <EmployeeTypePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/employees/add"
          element={
            <PrivateRoute>
              <EmployeeFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/employees/:id"
          element={
            <PrivateRoute>
              <SingleEmployeePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/employees/edit/:id"
          element={
            <PrivateRoute>
              <EmployeeFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <PrivateRoute>
              <EmployeePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/employees-allowances"
          element={
            <PrivateRoute>
              <EmployeeAllowancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/employees-deductions"
          element={
            <PrivateRoute>
              <EmployeeDeductionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/salaries"
          element={
            <PrivateRoute>
              <SalaryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <PrivateRoute>
              <AttendancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/attendance-overview"
          element={
            <PrivateRoute>
              <AttendanceOverviewPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/device-settings"
          element={
            <PrivateRoute>
              <DeviceSettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/employees-leaves"
          element={
            <PrivateRoute>
              <EmployeeLeavesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/leave-types"
          element={
            <PrivateRoute>
              <LeaveTypePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/deductions"
          element={
            <PrivateRoute>
              <DeductionPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
