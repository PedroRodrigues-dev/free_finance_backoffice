import { API_BASE_URL } from "@/config/env";
import { logout } from "./authService";
import { User } from "@/app/models/user";

export const findLoggedUser = async (): Promise<User> => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = token ? { Authorization: token } : {};

  const response = await fetch(`${API_BASE_URL}/api/v1/users/logged`, {
    method: "GET",
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error("Sessão expirada");
  }

  if (!response.ok) {
    logout();
    throw new Error("Houve um erro no servidor");
  }

  const data = await response.json();

  return data as User;
};

export const findAllUsers = async (
  page: number,
  limit: number
): Promise<User[]> => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = token ? { Authorization: token } : {};
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/users?${queryParams.toString()}`,
    {
      method: "GET",
      headers,
    }
  );

  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error("Sessão expirada");
  }

  if (!response.ok) {
    logout();
    throw new Error("Houve um erro no servidor");
  }

  const data = await response.json();

  return data as User[];
};

export const createUser = async (user: User) => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = token ? { Authorization: token } : {};

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers,
    body: JSON.stringify(user),
  });

  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error("Sessão expirada");
  }

  if (!response.ok) {
    logout();
    throw new Error("Houve um erro no servidor");
  }
};

export const updateUser = async (user: User) => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = token ? { Authorization: token } : {};

  const response = await fetch(`${API_BASE_URL}/api/v1/users/${user.id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(user),
  });

  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error("Sessão expirada");
  }

  if (!response.ok) {
    logout();
    throw new Error("Houve um erro no servidor");
  }
};

export const deleteUser = async (userId: Number) => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = token ? { Authorization: token } : {};

  const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
    method: "DELETE",
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error("Sessão expirada");
  }

  if (!response.ok) {
    logout();
    throw new Error("Houve um erro no servidor");
  }
};
