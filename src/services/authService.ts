import { API_BASE_URL } from "@/config/env";

interface LoginResponse {
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const responsePost = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password } as LoginRequest),
  });

  if (responsePost.status === 401) {
    throw new Error("Usuário ou senha incorretos");
  }

  if (responsePost.status === 403) {
    throw new Error("Usuário inativo");
  }

  if (!responsePost.ok) {
    throw new Error("Houve um erro ao tentar entrar");
  }

  const dataPost = await responsePost.json();

  const responseGet = await fetch(`${API_BASE_URL}/api/v1/users/logged`, {
    method: "GET",
    headers: {
      Authorization: dataPost.token,
    },
  });

  if (responseGet.status === 401) {
    throw new Error("Falha ao validar dados de usuário");
  }

  if (!responseGet.ok) {
    throw new Error("Houve um erro ao tentar validar dados de usuário");
  }

  const dataGet = await responseGet.json();

  if (dataGet.access_level != "ADMIN") {
    throw new Error(
      "Somente usuários administradores podem acessar este sistema"
    );
  }

  return dataPost as LoginResponse;
};

export const logout = () => {
  localStorage.removeItem("token");

  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

  window.location.href = "/login";
};
