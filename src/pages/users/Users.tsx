import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Input, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css"; // Import Ant Design styles

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
  });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>("http://localhost:3000/users");
        setUsers(response.data);
        toast.success("Users loaded successfully!");
      } catch (err: unknown) {
        setError("Failed to fetch users");
        toast.error("Failed to fetch users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await axios.post<User>(
        "http://localhost:3000/users",
        newUser
      );
      setUsers([...users, response.data]);
      closeModal();
      toast.success("User created successfully!");
    } catch (err: unknown) {
      setError("Failed to create user");
      toast.error("Failed to create user");
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    try {
      const response = await axios.put<User>(
        `http://localhost:3000/users/${editUser.id}`,
        editUser
      );
      setUsers(
        users.map(user => (user.id === editUser.id ? response.data : user))
      );
      closeModal();
      toast.success("User updated successfully!");
    } catch (err) {
      setError("Failed to update user");
      toast.error("Failed to update user");
      console.log(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      setError("Failed to delete user");
      toast.error("Failed to delete user");
      console.log(err);
    }
  };

  const openCreateModal = () => {
    setModalType("create");
    setModalIsOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setModalType("edit");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      phone: "",
    });
    setEditUser(null);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, user: User) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(user)}
            type="primary">
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(user.id)}
            type="primary"
            danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <ToastContainer />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <Button
        onClick={openCreateModal}
        type="primary"
        icon={<PlusOutlined />}
        className="mb-4">
        Add New User
      </Button>
      <div className="overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto">
          <Table<User>
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
          />
        </div>
      </div>
      <Modal
        title={modalType === "create" ? "Add New User" : "Edit User"}
        visible={modalIsOpen}
        onCancel={closeModal}
        onOk={() => (modalType === "create" ? handleCreate() : handleUpdate())}>
        {modalType === "edit" && (
          <Input
            placeholder="ID"
            value={editUser?.id || ""}
            disabled
            className="mb-2"
          />
        )}
        <Input
          placeholder="First Name"
          value={
            modalType === "create"
              ? newUser.firstName
              : editUser?.firstName || ""
          }
          onChange={e =>
            modalType === "create"
              ? setNewUser({ ...newUser, firstName: e.target.value })
              : editUser &&
                setEditUser({ ...editUser, firstName: e.target.value })
          }
          className="mb-2"
        />
        <Input
          placeholder="Last Name"
          value={
            modalType === "create" ? newUser.lastName : editUser?.lastName || ""
          }
          onChange={e =>
            modalType === "create"
              ? setNewUser({ ...newUser, lastName: e.target.value })
              : editUser &&
                setEditUser({ ...editUser, lastName: e.target.value })
          }
          className="mb-2"
        />
        <Input
          placeholder="Email"
          value={modalType === "create" ? newUser.email : editUser?.email || ""}
          onChange={e =>
            modalType === "create"
              ? setNewUser({ ...newUser, email: e.target.value })
              : editUser && setEditUser({ ...editUser, email: e.target.value })
          }
          className="mb-2"
        />
        <Input
          placeholder="Username"
          value={
            modalType === "create" ? newUser.username : editUser?.username || ""
          }
          onChange={e =>
            modalType === "create"
              ? setNewUser({ ...newUser, username: e.target.value })
              : editUser &&
                setEditUser({ ...editUser, username: e.target.value })
          }
          className="mb-2"
        />
        <Input
          placeholder="Phone"
          value={modalType === "create" ? newUser.phone : editUser?.phone || ""}
          onChange={e =>
            modalType === "create"
              ? setNewUser({ ...newUser, phone: e.target.value })
              : editUser && setEditUser({ ...editUser, phone: e.target.value })
          }
          className="mb-2"
        />
      </Modal>
    </div>
  );
};

export default Users;
