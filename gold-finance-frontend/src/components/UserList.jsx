import React, { useEffect, useState } from "react";
import { useToast } from "../components/ToastContext";

export default function PendingApprovals() {
  const [users, setUsers] = useState([]);
  const [roleSelections, setRoleSelections] = useState({});
  const [loadingIds, setLoadingIds] = useState([]); // track loading per user
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      // Fetch all users from your backend API
      const res = await fetch("http://localhost:5000/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const allUsers = await res.json();

      setUsers(allUsers);

      // Initialize role selections only for users pending approval
      const pending = allUsers.filter((u) => !u.approved);
      const roles = {};
      pending.forEach((u) => {
        roles[u.id] = u.role || "employee";
      });
      setRoleSelections(roles);
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("Failed to load users.", "error");
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setRoleSelections((prev) => ({
      ...prev,
      [userId]: newRole,
    }));
  };

  const handleApprove = async (userId) => {
    const selectedRole = roleSelections[userId] || "employee";
    setLoadingIds((ids) => [...ids, userId]);

    try {
      // Call backend API to approve user and set role
      const res = await fetch(
        `http://localhost:5000/api/admin/approve-user/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include auth token here if needed, e.g.
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: selectedRole }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to approve user");
      }

      showToast("User approved successfully!", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast(`Approval failed: ${err.message}`, "error");
    } finally {
      setLoadingIds((ids) => ids.filter((id) => id !== userId));
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    setLoadingIds((ids) => [...ids, userId]);
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/delete-user/${userId}`,
        {
          method: "DELETE",
          // Include auth token if needed
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete user");
      }

      showToast("User deleted", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("Delete failed: " + err.message, "error");
    } finally {
      setLoadingIds((ids) => ids.filter((id) => id !== userId));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const pendingUsers = users.filter((u) => !u.approved);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
      {pendingUsers.length === 0 ? (
        <p className="text-gray-600">No users pending approval.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => {
                const isLoading = loadingIds.includes(user.id);
                return (
                  <tr key={user.id} className="bg-white">
                    <td className="p-2 border">{user.email}</td>
                    <td className="p-2 border capitalize">
                      <select
                        value={roleSelections[user.id] || "employee"}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        disabled={isLoading}
                        className="border rounded px-2 py-1"
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                      </select>
                    </td>
                    <td className="p-2 border">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(user.id)}
                          disabled={isLoading}
                          className={`bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 ${
                            isLoading ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                        >
                          {isLoading ? "Approving..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={isLoading}
                          className={`bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 ${
                            isLoading ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
