import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-4">
        <h1 className="text-xl font-bold mb-6">FreshCut</h1>
        <nav className="flex flex-col gap-2">
          {profile?.role === "admin" ? (
            <>
              <Link to="/dashboard" className="hover:bg-blue-600 p-2 rounded">
                Dashboard
              </Link>
              <Link to="/employees" className="hover:bg-blue-600 p-2 rounded">
                Employees
              </Link>
              <Link
                to="/pending-employees"
                className="hover:bg-blue-600 p-2 rounded"
              >
                Pending Employees
              </Link>
              <Link to="/schedules" className="hover:bg-blue-600 p-2 rounded">
                Schedules
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/employee-dashboard"
                className="hover:bg-blue-600 p-2 rounded"
              >
                My Dashboard
              </Link>
            </>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 px-3 py-2 rounded hover:bg-red-600"
        >
          Logout Now
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Welcome {user?.email || "Guest"}
          </h2>
        </div>
        {children}
      </main>
    </div>
  );
}
