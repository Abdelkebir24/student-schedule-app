import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout";
import Dashboard from "../pages/dashboard";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/login";
import Courses from "../pages/Courses";
import Schedule from "../pages/Schedule";
import Register from "../pages/Register";

function Router() {

  const {token} = useAuth();

  return (
    <Routes>
      {/* public route  */}
      <Route 
          path="/login" 
          element={token ? <Navigate to="/dashboard" /> : <Login />} 
      />
      <Route path="/register" element={<Register />} />

      {/* protected routes  */}
      <Route element={ token ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/schedule" element={<Schedule />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default Router
