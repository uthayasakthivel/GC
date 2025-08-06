// src/components/JewelleryManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

export default function JewelleryManagement({ onJewelleryUpdated }) {
  const [jewelleryList, setJewelleryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ jewelleryName: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  const fetchJewellery = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/config/jewellery");
      setJewelleryList(res.data);
      setError(null);
    } catch {
      setError("Failed to load jewellery types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJewellery();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update
        await axios.put(`/admin/config/jewellery/${editId}`, form);
      } else {
        // Create
        await axios.post("/admin/config/jewellery/add", form);
      }
      setForm({ jewelleryName: "" });
      setEditId(null);
      fetchJewellery();
      onJewelleryUpdated?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save jewellery");
    }
  };

  const handleEdit = (item) => {
    setForm({ jewelleryName: item.jewelleryName });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this jewellery type?")) {
      try {
        await axios.delete(`/admin/config/jewellery/${id}`);
        fetchJewellery();
        onJewelleryUpdated?.();
      } catch {
        setError("Failed to delete jewellery");
      }
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Jewellery Management</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2 max-w-md">
        <input
          type="text"
          placeholder="Jewellery Name"
          value={form.jewelleryName}
          onChange={(e) => setForm({ ...form, jewelleryName: e.target.value })}
          required
          className="input"
        />
        <button type="submit" className="btn btn-primary">
          {editId ? "Update Jewellery" : "Add Jewellery"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setForm({ jewelleryName: "" });
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
        <p>Loading jewellery types...</p>
      ) : jewelleryList.length === 0 ? (
        <p className="text-gray-600">No jewellery types found.</p>
      ) : (
        <ul>
          {jewelleryList.map((item) => (
            <li key={item._id} className="flex justify-between mb-1">
              <span>{item.jewelleryName}</span>
              {jewelleryList.length > 0 && (
                <div>
                  <button
                    onClick={() => handleEdit(item)}
                    className="btn btn-sm btn-info mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
