import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminStores from "./pages/AdminStores.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminAddUser from "./pages/AdminAddUser.jsx";
import StoreDashboard from "./pages/StoreDashboard.jsx";
import StoreResetPassword from "./pages/StoreResetPassword.jsx";
import UserStores from "./pages/UserStores.jsx";
import UserResetPassword from "./pages/UserResetPassword.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useEffect } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  if (loc.pathname.startsWith("/login") || loc.pathname.startsWith("/register"))
    return null;

  const links = [];
  if (user?.role === "admin") {
    links.push(
      <Link key="a1" to="/admin" className="pill">
        Dashboard
      </Link>
    );
    links.push(
      <Link key="a2" to="/admin/stores" className="pill">
        Stores
      </Link>
    );
    links.push(
      <Link key="a3" to="/admin/users" className="pill">
        Users
      </Link>
    );
    links.push(
      <Link key="a4" to="/admin/adduser" className="pill">
        Add User
      </Link>
    );
  }
  if (user?.role === "store") {
    links.push(
      <Link key="s1" to="/store" className="pill">
        Dashboard
      </Link>
    );
  }
  if (user?.role === "user") {
    links.push(
      <Link key="u1" to="/user/stores" className="pill">
        Stores
      </Link>
    );
  }

  return (
    <div className="container nav">
      {links}
      <div style={{ flex: 1 }} />
      {user && (
        <>
          <span className="muted">
            Hello, <strong>{user.role}</strong>
          </span>
          <Link to={`/${user.role}/resetpassword`} className="pill">
            Reset Password
          </Link>
          <button style={{ marginLeft: 8 }} onClick={logout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    document.title = "Nest Client — Dashboard";
  }, []);
  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: 20 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/user/stores" replace />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          <Route
            path="/user/stores"
            element={
              <ProtectedRoute roles={["user", "store", "admin"]}>
                <UserStores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/resetpassword"
            element={
              <ProtectedRoute roles={["user"]}>
                <UserResetPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminStores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/adduser"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminAddUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/store"
            element={
              <ProtectedRoute roles={["store"]}>
                <StoreDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/resetpassword"
            element={
              <ProtectedRoute roles={["store"]}>
                <StoreResetPassword />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </div>
    </>
  );
}
