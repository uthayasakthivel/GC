import React, { useState } from "react";
import axios from "../api/axiosInstance";
import { useToast } from "./ToastContext";

export default function PendingApprovals({ users, onActionComplete }) {
  const [selectedRoles, setSelectedRoles] = useState({});
  const { showToast } = useToast(); // ✅ use toast

  const handleRoleChange = (userId, role) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: role }));
  };

  const handleApprove = async (userId) => {
    const role = selectedRoles[userId];
    if (!role) {
      showToast("Please select a role before approving.", "error");
      return;
    }

    try {
      await axios.put(
        `/admin/approve/${userId}`,
        { role },
        { headers: { "Content-Type": "application/json" } }
      );
      showToast("User approved successfully.");
      onActionComplete();
    } catch (err) {
      showToast("Approval failed", "error");
      console.error(err);
    }
  };

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
        <h2 className="text-2xl font-bold mb-4">Pending Approvals</h2>
        <p className="text-gray-500">No pending users.</p>
      </section>
    );

  return (
    <section className="p-6 bg-white rounded shadow mb-8">
      <h2 className="text-2xl font-bold mb-4">Pending Approvals</h2>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center border p-4 rounded gap-3"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <select
                className="border px-3 py-1 rounded"
                value={selectedRoles[user._id] || ""}
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>

              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                onClick={() => handleApprove(user._id)}
              >
                Approve
              </button>

              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => handleDelete(user._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
