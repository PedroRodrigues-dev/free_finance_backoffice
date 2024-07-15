"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import useAuth from "@/hooks/useAuth";
import Loading from "@/components/Loading/Loading";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/home");
    }
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { token } = await login(email, password);
      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/`;
      router.push("/home");
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Card sx={{ padding: "16px" }} variant="outlined">
        <CardHeader title="Free Finance Backoffice" />
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              required
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button variant="contained" type="submit">
              Entrar
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
