import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton as MuiIconButton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  avatar: string;
  [key: string]: string | number; // Boshqa ma'lumotlar uchun
}

const Profile: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    avatar: "",
  });

  // Modal oyna holatlari
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  // Parolni ko'rsatish holati
  const [showPassword, setShowPassword] = useState<number | null>(null);

  useEffect(() => {
    // Foydalanuvchilar ro'yxatini olish
    axios.get("http://localhost:3000/users").then(response => {
      setUsers(response.data);
    });
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile && selectedUser) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      axios
        .post("http://localhost:3000/upload-avatar", formData)
        .then(response => {
          const updatedUser = {
            ...selectedUser,
            avatar: response.data.avatarUrl,
          };
          setUsers(
            users.map(user =>
              user.id === selectedUser.id ? updatedUser : user
            )
          );
          setSelectedUser(updatedUser);
          alert("Avatar yuklandi!");
          setOpenUploadModal(false);
        })
        .catch(error => {
          console.error("Avatar yuklashda xatolik yuz berdi", error);
        });
    }
  };

  const handleAddUser = () => {
    axios.post("http://localhost:3000/users", newUser).then(response => {
      setUsers([...users, response.data]);
      setNewUser({
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        avatar: "",
      });
      setOpenAddModal(false);
    });
  };

  const handleUpdateUser = () => {
    if (selectedUser) {
      axios
        .put(`http://localhost:3000/users/${selectedUser.id}`, newUser)
        .then(response => {
          setUsers(
            users.map(user =>
              user.id === selectedUser.id ? response.data : user
            )
          );
          setSelectedUser(null);
          setNewUser({
            id: 0,
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            avatar: "",
          });
          setOpenEditModal(false);
        });
    }
  };

  const handleDeleteUser = (id: number) => {
    axios.delete(`http://localhost:3000/users/${id}`).then(() => {
      setUsers(users.filter(user => user.id !== id));
    });
  };

  const handleShowPassword = (userId: number) => {
    setShowPassword(prev => (prev === userId ? null : userId));
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Typography component="h1" variant="h5">
          Profile
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Foydalanuvchilar ro'yxati</Typography>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar
                        alt={user.firstName}
                        src={user.avatar || "/default-avatar.png"}
                        sx={{ width: 60, height: 60 }}
                      />
                    </TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      {showPassword === user.id ? user.password : "*****"}
                      <InputAdornment position="end">
                        <MuiIconButton
                          onClick={() => handleShowPassword(user.id)}>
                          {showPassword === user.id ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </MuiIconButton>
                      </InputAdornment>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenEditModal(true);
                        }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteUser(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenUploadModal(true);
                        }}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add User Modal */}
          <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
            <DialogTitle>Add User</DialogTitle>
            <DialogContent>
              <TextField
                margin="normal"
                fullWidth
                label="First Name"
                value={newUser.firstName}
                onChange={e =>
                  setNewUser({ ...newUser, firstName: e.target.value })
                }
              />
              <TextField
                margin="normal"
                fullWidth
                label="Last Name"
                value={newUser.lastName}
                onChange={e =>
                  setNewUser({ ...newUser, lastName: e.target.value })
                }
              />
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                value={newUser.email}
                onChange={e =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <TextField
                margin="normal"
                fullWidth
                label="Phone"
                value={newUser.phone}
                onChange={e =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
              />
              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type={showPassword === newUser.id ? "text" : "password"}
                value={newUser.password}
                onChange={e =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <MuiIconButton
                        onClick={() =>
                          setShowPassword(prev =>
                            prev === newUser.id ? null : newUser.id
                          )
                        }>
                        {showPassword === newUser.id ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </MuiIconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddModal(false)}>Cancel</Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogActions>
          </Dialog>

          {/* Edit User Modal */}
          <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
              {selectedUser && (
                <>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="First Name"
                    value={newUser.firstName}
                    onChange={e =>
                      setNewUser({ ...newUser, firstName: e.target.value })
                    }
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Last Name"
                    value={newUser.lastName}
                    onChange={e =>
                      setNewUser({ ...newUser, lastName: e.target.value })
                    }
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Email"
                    value={newUser.email}
                    onChange={e =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Phone"
                    value={newUser.phone}
                    onChange={e =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Password"
                    type={
                      showPassword === selectedUser.id ? "text" : "password"
                    }
                    value={newUser.password}
                    onChange={e =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <MuiIconButton
                            onClick={() => handleShowPassword(selectedUser.id)}>
                            {showPassword === selectedUser.id ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </MuiIconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
              <Button onClick={handleUpdateUser}>Update User</Button>
            </DialogActions>
          </Dialog>

          {/* Upload Avatar Modal */}
          <Dialog
            open={openUploadModal}
            onClose={() => setOpenUploadModal(false)}>
            <DialogTitle>Upload Avatar</DialogTitle>
            <DialogContent>
              <TextField type="file" onChange={handleFileChange} fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenUploadModal(false)}>Cancel</Button>
              <Button onClick={handleFileUpload}>Upload Avatar</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
