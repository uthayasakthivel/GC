import { useState } from "react";

export const useJewelleryData = () => {
  const [jewelleryDetails, setJewelleryDetails] = useState([]);

  const handleJewelleryChange = (data) => {
    setJewelleryDetails(data);
  };

  return { jewelleryDetails, handleJewelleryChange };
};
