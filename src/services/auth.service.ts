import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

export const authService = {
  register: (payload: IRegister) => api.post(`${endpoint.AUTH}/register`, payload),
  activation: (payload: { code: string }) => api.post(`${endpoint.AUTH}/activation`, payload),
  getProfileWithToken: (token: string) =>
    api.get(`${endpoint.USER}/me`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    }),
  login: (payload: ILogin) => api.post(`${endpoint.AUTH}/login`, payload),
  logout: () => api.delete(`${endpoint.AUTH}/logout`),
};
