import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  [key: string]: string | number; // Boshqa ma'lumotlar uchun
}

const Profile: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    name: "",
    email: "",
    avatar: "",
  });

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
          // Yuklangan faylning yangi URL manzilini yangilash
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
        })
        .catch(error => {
          console.error("Avatar yuklashda xatolik yuz berdi", error);
        });
    }
  };

  const handleAddUser = () => {
    axios.post("http://localhost:3000/users", newUser).then(response => {
      setUsers([...users, response.data]);
      setNewUser({ id: 0, name: "", email: "", avatar: "" });
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setNewUser({ ...user });
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
          setNewUser({ id: 0, name: "", email: "", avatar: "" });
        });
    }
  };

  const handleDeleteUser = (id: number) => {
    axios.delete(`http://localhost:3000/users/${id}`).then(() => {
      setUsers(users.filter(user => user.id !== id));
    });
  };

  return (
    <Container component="main" maxWidth="sm">
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
          <List>
            {users.map(user => (
              <ListItem key={user.id}>
                <ListItemText primary={user.name} secondary={user.email} />
                <IconButton onClick={() => handleEditUser(user)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteUser(user.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <TextField
              margin="normal"
              fullWidth
              label="Name"
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={selectedUser ? handleUpdateUser : handleAddUser}
              sx={{ mt: 2 }}>
              {selectedUser ? "Update User" : "Add User"}
            </Button>
          </Box>
        </Box>

        {selectedUser && (
          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <Avatar
              alt={selectedUser.name}
              src={selectedUser.avatar || "/default-avatar.png"}
              sx={{ width: 120, height: 120 }}
            />
            <TextField type="file" onChange={handleFileChange} sx={{ mt: 3 }} />
            <Button
              variant="contained"
              color="primary"
              onClick={handleFileUpload}
              sx={{ mt: 2 }}>
              Upload Avatar
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
