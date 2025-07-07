import { AxiosInitializer } from "..";

export const loginApi = async ({ email, password }) => {
  const response = await AxiosInitializer.post("/auth/login", {
    email,
    password,
  });
  return response.data; // { data: { user, token } }
};

export const registerApi = async (data) => {
  const response = await AxiosInitializer.post("/auth/register", data);
  return response.data;
};

export const verifyToken = async () => {
  const token = localStorage.getItem("token");
  const response = await AxiosInitializer.get("/auth/verify", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // espera { user: {...} }
};
