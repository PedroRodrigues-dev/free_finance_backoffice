"use client";

import React, { useState, FormEvent, useEffect } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Switch,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { User } from "@/app/models/user";
import Loading from "../Loading/Loading";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createUser, updateUser } from "@/services/userService";

interface UserFormProps {
  user: User;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const [id, setId] = useState(user.id);
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [accessLevel, setAccessLevel] = useState(user.access_level || "NORMAL");
  const [active, setActive] = useState(user.active || false);
  const [newUser, setNewUser] = useState<User | null>(null);
  const { isAuthenticated, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (newUser) {
      try {
        if (id) {
          updateUser(newUser);
        } else {
          createUser(newUser);
        }
        onClose();
        router.push("/home");
      } catch (error: any) {
        setError(error.message);
      }
    }
  }, [newUser, router, onClose, id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setNewUser({
      id,
      username,
      email,
      password,
      access_level: accessLevel,
      active,
    });
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "400px",
        margin: "0 auto",
        padding: "32px",
        position: "relative",
      }}
    >
      <IconButton
        style={{ position: "absolute", top: "8px", right: "8px" }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h4" component="h1" textAlign="center">
        {id ? "Editar Usuário" : "Criar Usuário"}
      </Typography>
      <TextField
        label="Nome de usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        required={!id}
      />
      <FormControl component="fieldset">
        <FormLabel component="legend">Nível de acesso</FormLabel>
        <RadioGroup
          row
          value={accessLevel}
          onChange={(e) => setAccessLevel(e.target.value)}
        >
          <FormControlLabel value="NORMAL" control={<Radio />} label="Normal" />
          <FormControlLabel
            value="ADMIN"
            control={<Radio />}
            label="Administrador"
          />
        </RadioGroup>
      </FormControl>
      <FormControlLabel
        control={
          <Switch
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
        }
        label="Ativo"
      />
      <Button type="submit" variant="contained" color="primary">
        {id ? "Salvar" : "Criar"}
      </Button>
    </Paper>
  );
};

export default UserForm;
