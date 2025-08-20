import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

const LoanNumberSelector = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/admin/config/interest-rates");
        setItems(response.data);
        if (response.data.length > 0) setSelected(response.data[0]._id);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };
    fetchItems();
  }, []);

  const handleChange = (e) => setSelected(e.target.value);

  return (
    <div>
      <select value={selected} onChange={handleChange} className="input">
        {items.length === 0 ? (
          <option disabled>No interest rates available</option>
        ) : (
          items.map((item) => (
            <option key={item._id} value={item._id}>
              {/* Display price and percentage for clarity */}
              Price: {item.price} | Percentage: {item.percentage}%
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default LoanNumberSelector;
