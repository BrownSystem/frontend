import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsersApi,
  loginApi,
  registerApi,
  updateUserApi,
} from "./auth.api";
import { useAuthStore } from "./auth.store";

export const useGetAllUsers = (branchId) => {
  return useQuery({
    queryKey: ["users", branchId],
    queryFn: getAllUsersApi,
    enabled: !!branchId, // solo ejecuta si hay un branchId
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

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

export const useVerifyPassword = () => {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await loginApi({ email, password });
      return res.data; // si no tira error, es correcto
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); // ¡Actualiza los usuarios!
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); // Refresca tabla
    },
  });
};
