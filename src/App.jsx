import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import EmployeeList from "./pages/employees/EmployeeList";
import PendingEmployees from "./pages/employees/PendingEmployees";
import EmployeeDashboard from "./pages/employees/EmployeeDashboard";
import ScheduleManagement from "./pages/dashboard/ScheduleManagement";
import DashboardLayout from "./layouts/DashboardLayout";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/login" : "/login"} replace />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin/HR routes */}
      <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
      <Route path="/employees" element={<DashboardLayout><EmployeeList /></DashboardLayout>} />
      <Route path="/pending-employees" element={<DashboardLayout><PendingEmployees /></DashboardLayout>} />
      <Route path="/schedules" element={<DashboardLayout><ScheduleManagement /></DashboardLayout>} />

      {/* Employee routes */}
      <Route path="/employee-dashboard" element={<DashboardLayout><EmployeeDashboard /></DashboardLayout>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
