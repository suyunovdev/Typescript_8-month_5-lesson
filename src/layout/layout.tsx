import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu, Space, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { HiChartPie } from "react-icons/hi";
import { FaUsers, FaUserCircle } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import { Link } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const menuItems = [
    {
      key: "1",
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: "2",
      label: <Button onClick={handleLogout}>Logout</Button>,
    },
  ];

  return (
    <Layout className="h-[100vh] ">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Link
          to="/"
          className={`demo-logo-vertical flex items-center justify-center ${
            collapsed ? "p-2" : "p-5"
          }`}>
          <h1 className={`${collapsed ? "text-xl" : "text-3xl"} text-white`}>
            LOGO
          </h1>
        </Link>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <HiChartPie size={20} />,
              label: <Link to="/">Dashboard</Link>,
            },
            {
              key: "2",
              icon: <FaUsers size={20} />,
              label: <Link to="/users">Users</Link>,
            },
            {
              key: "3",
              icon: <AiOutlineProduct size={20} />,
              label: <Link to="/products">Products</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className="flex justify-between">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            className="mr-5">
            <Space className="cursor-pointer">
              <FaUserCircle size={24} />
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 0,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
