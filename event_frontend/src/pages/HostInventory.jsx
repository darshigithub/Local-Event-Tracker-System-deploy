// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import inventoryApi from "../inventoryApi";

// function HostInventory() {

//   const [inventory, setInventory] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     totalQuantity: "",
//     availableQuantity: "",
//     type: "FOOD",
//     status: "AVAILABLE",
//     eventId: ""
//   });

//   const [editingId, setEditingId] = useState(null);
//   const role = localStorage.getItem("role");

//   // 🔒 Restrict access
//   if (role !== "HOST") {
//     return <h3 className="text-center mt-5 text-danger">Access Denied</h3>;
//   }

//   // ---------------- FETCH INVENTORY ----------------
//   const fetchInventory = async () => {
//     try {
//       const res = await inventoryApi.get("");
//       setInventory(res.data);
//     } catch (err) {
//       console.error("Error fetching inventory", err);
//     }
//   };

//   useEffect(() => {
//     fetchInventory();
//   }, []);

//   // ---------------- HANDLE INPUT ----------------
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ---------------- ADD / UPDATE ----------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (editingId) {
//         await inventoryApi.put(`/${editingId}`, form);
//         alert("Inventory updated!");
//       } else {
//         await inventoryApi.post("", form);
//         alert("Inventory added!");
//       }

//       setForm({
//         name: "",
//         description: "",
//         totalQuantity: "",
//         availableQuantity: "",
//         type: "FOOD",
//         status: "AVAILABLE",
//         eventId: ""
//       });

//       setEditingId(null);
//       fetchInventory();

//     } catch (err) {
//       console.error(err);
//       alert("Error saving inventory");
//     }
//   };

//   // ---------------- EDIT ----------------
//   const handleEdit = (item) => {
//     setForm(item);
//     setEditingId(item.id);
//   };

//   // ---------------- DELETE ----------------
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this item?")) return;

//     try {
//       await inventoryApi.delete(`/${id}`);
//       fetchInventory();
//     } catch (err) {
//       console.error(err);
//       alert("Error deleting");
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="container my-5">

//         <h2 className="text-center mb-4 text-primary">
//           🎯 Manage Inventory
//         </h2>

//         {/* ================= FORM ================= */}
//         <div className="card shadow p-4 mb-5 rounded-4">
//           <h5>{editingId ? "✏️ Edit Inventory" : "➕ Add Inventory"}</h5>

//           <form onSubmit={handleSubmit} className="row g-3">

//             <div className="col-md-6">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Item Name"
//                 className="form-control"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="col-md-6">
//               <input
//                 type="text"
//                 name="description"
//                 placeholder="Description"
//                 className="form-control"
//                 value={form.description}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-4">
//               <input
//                 type="number"
//                 name="totalQuantity"
//                 placeholder="Total Qty"
//                 className="form-control"
//                 value={form.totalQuantity}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="col-md-4">
//               <input
//                 type="number"
//                 name="availableQuantity"
//                 placeholder="Available Qty"
//                 className="form-control"
//                 value={form.availableQuantity}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="col-md-4">
//               <input
//                 type="number"
//                 name="eventId"
//                 placeholder="Event ID"
//                 className="form-control"
//                 value={form.eventId}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="col-md-6">
//               <select
//                 name="type"
//                 className="form-control"
//                 value={form.type}
//                 onChange={handleChange}
//               >
//                 <option value="FOOD">FOOD</option>
//                 <option value="MERCH">MERCH</option>
//                 <option value="SERVICE">SERVICE</option>
//               </select>
//             </div>

//             <div className="col-md-6">
//               <select
//                 name="status"
//                 className="form-control"
//                 value={form.status}
//                 onChange={handleChange}
//               >
//                 <option value="AVAILABLE">AVAILABLE</option>
//                 <option value="OUT_OF_STOCK">OUT OF STOCK</option>
//               </select>
//             </div>

//             <div className="col-12">
//               <button className="btn btn-success w-100">
//                 {editingId ? "Update Inventory" : "Add Inventory"}
//               </button>
//             </div>

//           </form>
//         </div>

//         {/* ================= TABLE ================= */}
//         <div className="card shadow p-4 rounded-4">

//           <h5 className="mb-3">📦 Inventory List</h5>

//           <table className="table table-bordered text-center">
//             <thead className="table-dark">
//               <tr>
//                 <th>Name</th>
//                 <th>Qty</th>
//                 <th>Available</th>
//                 <th>Type</th>
//                 <th>Event</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {inventory.map((item) => (
//                 <tr key={item.id}>
//                   <td>{item.name}</td>
//                   <td>{item.totalQuantity}</td>
//                   <td>{item.availableQuantity}</td>
//                   <td>{item.type}</td>
//                   <td>{item.eventId}</td>
//                   <td>
//                     <button
//                       className="btn btn-warning btn-sm me-2"
//                       onClick={() => handleEdit(item)}
//                     >
//                       Edit
//                     </button>

//                     <button
//                       className="btn btn-danger btn-sm"
//                       onClick={() => handleDelete(item.id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//           </table>

//         </div>

//       </div>

//       <Footer />
//     </>
//   );
// }

// export default HostInventory;












