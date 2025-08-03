import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

export default function BranchManagement({ onBranchesUpdated }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", location: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/config/branches");
      setBranches(res.data);
      setError(null);
    } catch {
      setError("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update
        await axios.put(`/admin/config/branches/${editId}`, form);
      } else {
        // Create
        await axios.post("/admin/config/branches", form);
      }
      setForm({ name: "", location: "" });
      setEditId(null);
      fetchBranches();
      onBranchesUpdated?.();
    } catch {
      setError("Failed to save branch");
    }
  };

  const handleEdit = (branch) => {
    setForm({ name: branch.name, location: branch.location });
    setEditId(branch._id);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this branch?")) {
      try {
        await axios.delete(`/admin/config/branches/${id}`);
        fetchBranches();
        onBranchesUpdated?.();
      } catch {
        setError("Failed to delete branch");
      }
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Branch Management</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2 max-w-md">
        <input
          type="text"
          placeholder="Branch Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="input"
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
          className="input"
        />
        <button type="submit" className="btn btn-primary">
          {editId ? "Update Branch" : "Add Branch"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", location: "" });
              setEditId(null);
            }}
            className="btn btn-secondary ml-2"
          >
            Cancel
          </button>
        )}
      </form>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {loading ? (
        <p>Loading branches...</p>
      ) : (
        <ul>
          {branches.map((b) => (
            <li key={b._id} className="flex justify-between mb-1">
              <span>
                {b.name} — {b.location}
              </span>
              <div>
                <button
                  onClick={() => handleEdit(b)}
                  className="btn btn-sm btn-info mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
