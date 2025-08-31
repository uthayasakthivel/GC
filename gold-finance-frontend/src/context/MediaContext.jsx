import { createContext, useContext, useState } from "react";

const MediaContext = createContext();

export const MediaProvider = ({ children }) => {
  const [customerPhoto, setCustomerPhoto] = useState(null);
  const [jewelPhoto, setJewelPhoto] = useState(null);
  const [aadharPhoto, setAadharPhoto] = useState(null);
  const [declarationPhoto, setDeclarationPhoto] = useState(null);
  const [otherPhoto, setOtherPhoto] = useState(null);
  const [sheetPreparedBy, setSheetPreparedBy] = useState("");

  const value = {
    customerPhoto,
    setCustomerPhoto,
    jewelPhoto,
    setJewelPhoto,
    aadharPhoto,
    setAadharPhoto,
    declarationPhoto,
    setDeclarationPhoto,
    otherPhoto,
    setOtherPhoto,
    sheetPreparedBy,
    setSheetPreparedBy,
  };

  return (
    <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
  );
};

export const useMediaContext = () => {
  const context = useContext(MediaContext);
  if (!context) throw new Error("useMedia must be used within MediaProvider");
  return context;
};
