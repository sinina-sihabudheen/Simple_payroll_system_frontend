
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../axiosInstance";

// function AdminLoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosInstance.post("/api/employees/admin-login/", {
//         username,
//         password,
//       });

//       // Save tokens
//       localStorage.setItem("access", response.data.access);
//       localStorage.setItem("refresh", response.data.refresh);

//       // Save admin username for navbar
//       localStorage.setItem("admin_name", username);


//       navigate("/admin/home");
//     } catch (err) {
//       setError(
//         err.response?.data?.detail || "Login failed. Invalid credentials."
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-100">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white p-8 rounded shadow-md w-80"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
//         {error && <p className="text-red-600 mb-2">{error}</p>}
//         <input
//           type="text"
//           placeholder="Username"
//           className="w-full mb-3 p-2 border rounded"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full mb-4 p-2 border rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AdminLoginPage;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/employees/admin-login/", {
        username,
        password,
      });

      // Save tokens
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // Save admin username for navbar
      localStorage.setItem("admin_name", username);

      navigate("/admin/home");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Login failed. Invalid credentials."
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* Password with toggle */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Submit */}
        <button className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLoginPage;
