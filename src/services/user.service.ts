import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

const userService = {
  me: () => api.get(endpoint.USER + "/me"),
  update: (payload: IUpdateUser) => api.patch(endpoint.USER + "/me", payload),
  updatePassword: (payload: IUpdatePassword) => api.patch(endpoint.USER + "/update-password", payload),
};

export default userService;
