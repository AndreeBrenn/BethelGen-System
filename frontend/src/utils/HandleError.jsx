export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const data = error.response.data;

    if (data.errors && data.errors.length > 0) {
      // Multiple validation errors
      const errorMessages = data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join("\n");
      alert(errorMessages);
    } else {
      // Single error message
      alert(data.message || "Something went wrong");
    }
  } else if (error.request) {
    // Request made but no response
    alert("Network error. Please check your connection.");
  } else {
    // Something else happened
    alert("An error occurred. Please try again.");
  }
};
