import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import "../styles/DashboardLayout.css";

export default function DashboardLayout({ children }) {
  const { user, profile, setUser } = useAuth(); // ✅ include setUser

  const handleLogout = async () => {
  try {
    // 1️⃣ Sign out from Supabase
    await supabase.auth.signOut();

   

    // 3️⃣ Optional: clear Facebook session
    if (user?.app_metadata?.provider === "facebook") {
      window.open(
        `https://www.facebook.com/logout.php?next=${encodeURIComponent(
          window.location.origin + "/login"
        )}&access_token=${user?.access_token}`,
        "_self"
      );
      return; // stop here, redirect handles it
    }

    // 4️⃣ Default: redirect to login
    setUser(null);
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout error:", err);
  }
};


   return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="sidebar-title">FreshCut</h1>
        <nav className="sidebar-nav">
          {profile?.role === "admin" ? (
            <>
              <Link to="/dashboard" className="sidebar-link">
                Dashboard
              </Link>
              <Link to="/employees" className="sidebar-link">
                Employees
              </Link>
              <Link to="/pending-employees" className="sidebar-link">
                Pending Employees
              </Link>
              <Link to="/schedules" className="sidebar-link">
                Schedules
              </Link>
            </>
          ) : (
            <Link to="/employee-dashboard" className="sidebar-link">
              My Dashboard
            </Link>
          )}
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          Logout Now
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="welcome-box">
          <h2 className="welcome-text">
            Welcome {user?.email || "Guest"}
          </h2>
        </div>
        {children}
      </main>
    </div>
  );
}