import React, { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  // Show toast with optional duration
  const showToast = (message, type = "success", duration = 4000) => {
    setToast({ message, type });

    if (duration > 0) {
      setTimeout(() => {
        setToast(null);
      }, duration);
    }
  };

  // Manually dismiss toast
  const dismissToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast {...toast} onDismiss={dismissToast} />}
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type, onDismiss }) => {
  return (
    <div
      className={`fixed top-6 right-6 max-w-md w-full px-5 py-2 rounded shadow-lg text-white flex items-center gap-3 z-50
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
        animate-slideIn
      `}
      role="alert"
    >
      <span className="text-xl select-none">
        {type === "success" ? "✅" : "❌"}
      </span>
      <span className="text-sm font-medium flex-grow">{message}</span>
      <button
        onClick={onDismiss}
        className="text-white text-lg font-bold hover:text-gray-200 transition select-none"
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
};

export const useToast = () => useContext(ToastContext);
