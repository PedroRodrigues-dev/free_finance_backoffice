"use client";

import CustomPagination from "@/components/CustomPagination/CustomPagination";
import Loading from "@/components/Loading/Loading";
import useAuth from "@/hooks/useAuth";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Container,
  Toolbar,
  Box,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
  findAllUsers,
  deleteUser,
  findLoggedUser,
} from "@/services/userService";
import { User } from "../models/user";
import AddIcon from "@mui/icons-material/Add";
import UserForm from "@/components/UserForm/UserForm";
import PersonIcon from "@mui/icons-material/Person";
import { logout } from "@/services/authService";

const HomePage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [page, setPage] = useState(1);
  const [loggedUser, setLoggedUser] = useState<User>();
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchLoggedUser = async () => {
      try {
        const user = await findLoggedUser();
        setLoggedUser(user);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchLoggedUser();
  }, [loggedUser]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const fetchUsers = async (page: number, limitPerPage: number) => {
    try {
      const users = await findAllUsers(page, limitPerPage);
      setUsers(users);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchUsers(page, limitPerPage);
  }, [page, limitPerPage]);

  const handleDelete = async () => {
    if (selectedUser && confirmationEmail === selectedUser.email) {
      try {
        await deleteUser(selectedUser.id);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        setConfirmationEmail("");
        await fetchUsers(page, limitPerPage);
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  const handleUserFormClose = () => {
    setIsEditModalOpen(false);
    fetchUsers(page, limitPerPage);
  };

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: "16px",
        textAlign: "center",
      }}
    >
      <div>
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Free Finance Backoffice
              </Typography>

              <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                <p style={{ marginRight: "16px" }}>{loggedUser?.username}</p>
                <IconButton
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                >
                  <PersonIcon sx={{ color: "white" }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem
                    onClick={() => {
                      loggedUser ? setSelectedUser(loggedUser) : "";
                      setIsEditModalOpen(true);
                    }}
                  >
                    Editar
                  </MenuItem>
                  <MenuItem onClick={() => logout()}>Sair</MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <h1>Usuários</h1>
        <Button
          variant="contained"
          sx={{ marginBottom: "16px" }}
          onClick={() => {
            setSelectedUser({
              id: 0,
              username: "",
              email: "",
              password: "",
              access_level: "NORMAL",
              active: false,
            });
            setIsEditModalOpen(true);
          }}
        >
          <AddIcon /> Adicionar
        </Button>
      </div>
      <Paper
        sx={{
          marginLeft: "10vw",
          marginRight: "10vw",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Usuário</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nível de acesso</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell
                  style={
                    user.access_level === "ADMIN"
                      ? { color: "blueviolet" }
                      : { color: "blue" }
                  }
                >
                  {user.access_level === "ADMIN" ? "Administrador" : "Normal"}
                </TableCell>
                <TableCell
                  style={user.active ? { color: "green" } : { color: "red" }}
                >
                  {user.active ? "Ativo" : "Inativo"}
                </TableCell>
                <TableCell style={{ display: "flex", gap: "8px" }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <ModeEditIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <CustomPagination
          page={page}
          setPage={setPage}
          limitPerPage={limitPerPage}
          setLimitPerPage={setLimitPerPage}
        />
      </Paper>

      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Para confirmar a exclusão, digite o e-mail do usuário abaixo:
          </Typography>
          <Typography>{selectedUser?.email}</Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={confirmationEmail}
            onChange={(e) => setConfirmationEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {selectedUser && (
          <UserForm user={selectedUser} onClose={handleUserFormClose} />
        )}
      </Dialog>
    </div>
  );
};

export default HomePage;
