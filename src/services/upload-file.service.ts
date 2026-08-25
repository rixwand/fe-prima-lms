import axios from "axios";

export default {
  uploadImages: (formData: FormData) =>
    axios.post("/api/upload", formData, {
      withCredentials: true,
    }),
};
