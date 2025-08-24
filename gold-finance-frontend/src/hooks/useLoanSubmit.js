import axiosInstance from "../api/axiosInstance";

export const useLoanSubmit = (generateFormData) => {
  const handleSubmit = async () => {
    try {
      const formData = generateFormData();
      const response = await axiosInstance.post("/loan/create-loan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert("Loan Submitted Successfully!");
      } else {
        alert(response.data.message || "Failed to submit loan.");
      }
    } catch (error) {
      console.error("Error submitting loan:", error.response?.data || error);
      alert("Something went wrong. Check console for details.");
    }
  };

  return { handleSubmit };
};
