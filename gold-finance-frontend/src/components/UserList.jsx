import React from "react";
import axios from "../api/axiosInstance";
import { useToast } from "./ToastContext";

export default function UserList({ users, title, onActionComplete }) {
  const { showToast } = useToast();

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/admin/delete/${userId}`);
      showToast("User deleted successfully.");
      onActionComplete();
    } catch (err) {
      showToast("Delete failed", "error");
      console.error(err);
    }
  };

  if (users.length === 0)
    return (
      <section className="p-6 bg-white rounded shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-500">No users found.</p>
      </section>
    );

  return (
    <section className="p-6 bg-white rounded shadow mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center border p-4 rounded"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm italic">{user.role}</p>
            </div>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              onClick={() => handleDelete(user._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
