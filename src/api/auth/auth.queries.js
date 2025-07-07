import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi, registerApi } from "./auth.api";
import { useAuthStore } from "./auth.store";

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      const user = data.data.user;
      const token = data.data.token;

      setUser(user);
      localStorage.setItem("token", token);

      queryClient.invalidateQueries(); // opcional
    },
    onError: (error) => {},
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};
