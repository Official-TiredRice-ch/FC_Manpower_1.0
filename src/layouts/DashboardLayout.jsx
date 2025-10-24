import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiLogOut } from "react-icons/fi";
import "../styles/DashboardLayout.css";

export default function DashboardLayout({ children }) {
  const { user, profile, setUser } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false); // 👈 new state

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className={`dashboard-layout ${isCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">
            {isCollapsed ? "✂️" : "FreshCut"}
          </h1>
          <button
            className="toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <FiMenu size={22} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {profile?.role === "admin" ? (
            <>
              <Link to="/dashboard" className="sidebar-link">
                <i className="icon">📊</i>
                {!isCollapsed && <span>Dashboard</span>}
              </Link>
              <Link to="/employees" className="sidebar-link">
                <i className="icon">👥</i>
                {!isCollapsed && <span>Employees</span>}
              </Link>
              <Link to="/pending-employees" className="sidebar-link">
                <i className="icon">🕓</i>
                {!isCollapsed && <span>Pending Employees</span>}
              </Link>
              <Link to="/schedules" className="sidebar-link">
                <i className="icon">📅</i>
                {!isCollapsed && <span>Schedules</span>}
              </Link>
              <Link to="/departments" className="sidebar-link">
                <i className="icon">🏢</i>
                {!isCollapsed && <span>Departments</span>}
              </Link>
            </>
          ) : (
            <Link to="/employee-dashboard" className="sidebar-link">
              <i className="icon">💼</i>
              {!isCollapsed && <span>My Dashboard</span>}
            </Link>
          )}
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          <FiLogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="welcome-box">
          <h2 className="welcome-text">Welcome {user?.email || "Guest"}</h2>
        </div>
        {children}
      </main>
    </div>
  );
}
