import { toast } from "react-toastify";

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const data = error.response.data;

    if (data.errors && data.errors.length > 0) {
      // Multiple validation errors
      data.errors.forEach((e) => {
        toast.error(`${e.field}: ${e.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
    } else {
      // Single error message
      toast.error(data.message || "Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  } else if (error.request) {
    // Request made but no response
    toast.error("Network error. Please check your connection.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  } else {
    // Something else happened
    toast.error("An error occurred. Please try again.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
};
