import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("admin_name");
    if (name) setAdminName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("admin_name");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="font-bold text-xl">Welcome..</h1>
      <div className="flex items-center gap-4">
        <span>Hello, {adminName}</span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [adminName, setAdminName] = useState("");

//   useEffect(() => {
//     const name = localStorage.getItem("admin_name");
//     if (name) setAdminName(name);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     localStorage.removeItem("admin_name");
//     navigate("/");
//   };

//   return (
//     <nav className="w-full bg-blue-600 text-white p-4 flex justify-between items-center shadow-md fixed top-0 left-0 z-50">
//       <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
//         <h1 className="font-bold text-xl">Welcome..</h1>
//         <div className="flex items-center gap-4">
//           <span>Hello, {adminName}</span>
//           <button
//             onClick={handleLogout}
//             className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }
