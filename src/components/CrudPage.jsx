
// import { useEffect, useState } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

// const CrudPage = ({ endpoint, fields, title }) => {
//   const [items, setItems] = useState([]);
//   const [formData, setFormData] = useState({});
//   const [editId, setEditId] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const token = localStorage.getItem("access");

//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

//   const fetchItems = async () => {
//     try {
//       const res = await axios.get(endpoint, { headers });
//       setItems(res.data);
//     } catch (err) {
//       toast.error("Failed to fetch items");
//     }
//   };

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       if (editId) {
//         await axios.put(`${endpoint}${editId}/`, formData, { headers });
//         toast.success("Updated successfully");
//       } else {
//         await axios.post(endpoint, formData, { headers });
//         toast.success("Created successfully");
//       }
//       setFormData({});
//       setEditId(null);
//       setShowForm(false);
//       fetchItems();
//     } catch (err) {
//       toast.error("Failed to submit data");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${endpoint}${id}/`, { headers });
//       toast.success("Deleted successfully");
//       fetchItems();
//     } catch (err) {
//       toast.error("Failed to delete");
//     }
//   };

//   const handleEdit = (item) => {
//     setFormData(item);
//     setEditId(item.id);
//     setShowForm(true);
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <Toaster />
//       <h2 className="text-2xl font-bold mb-4">{title}</h2>

//       {!showForm && (
//         <div>
//           {items.length === 0 ? (
//             <div className="text-center text-gray-500 my-10">
//               <p>No data available.</p>
//               <FaPlus
//                 onClick={() => setShowForm(true)}
//                 className="text-4xl mx-auto cursor-pointer mt-4 text-green-600"
//               />
//               <p className="text-sm">Click to create new</p>
//             </div>
//           ) : (
//             <>
//               <button
//                 className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
//                 onClick={() => {
//                   setFormData({});
//                   setEditId(null);
//                   setShowForm(true);
//                 }}
//               >
//                 + Add New
//               </button>

//               <ul className="space-y-2">
//                 {items.map((item) => (
//                   <li
//                     key={item.id}
//                     className="border p-3 rounded flex justify-between items-center"
//                   >
//                     <span>{JSON.stringify(item)}</span>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleEdit(item)}
//                         className="text-blue-600"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(item.id)}
//                         className="text-red-600"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}
//         </div>
//       )}

//       {showForm && (
//         <div className="mt-6 space-y-2">
//           {fields.map((field) => (
//             <input
//               key={field}
//               name={field}
//               value={formData[field] || ""}
//               onChange={handleChange}
//               placeholder={field}
//               className="border p-2 w-full rounded"
//             />
//           ))}
//           <div className="flex justify-between">
//             <button
//               onClick={handleSubmit}
//               className="bg-green-600 text-white px-4 py-2 rounded"
//             >
//               {editId ? "Update" : "Create"}
//             </button>
//             <button
//               onClick={() => {
//                 setShowForm(false);
//                 setFormData({});
//                 setEditId(null);
//               }}
//               className="text-gray-600 border px-4 py-2 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CrudPage;
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const CrudPage = ({ endpoint, fields, title, dropdowns = {} }) => {
  const [items, setItems] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("access");

  const fetchItems = async () => {
    try {
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`${title} created`);
      setFormData({});
      setFormVisible(false);
      fetchItems();
    } catch {
      toast.error("Creation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${endpoint}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully");
      fetchItems();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6">
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title} Management</h2>
        <button
          onClick={() => setFormVisible(!formVisible)}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> {formVisible ? "Cancel" : `Add ${title}`}
        </button>
      </div>

      {formVisible && (
        <div className="space-y-2 mb-4">
          {fields.map((field) => {
            if (dropdowns[field]) {
              return (
                <select
                  key={field}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="border p-2 w-full"
                >
                  <option value="">Select {field}</option>
                  {dropdowns[field].map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name || option.username || option.title}
                    </option>
                  ))}
                </select>
              );
            }
            return (
              <input
                key={field}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                placeholder={field}
                className="border p-2 w-full"
              />
            );
          })}
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>No {title.toLowerCase()} data found</p>
          <FaPlus className="mx-auto mt-2 text-3xl" />
        </div>
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{JSON.stringify(item)}</span>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CrudPage;
