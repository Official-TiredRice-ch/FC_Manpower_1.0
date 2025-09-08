import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser, setProfile } = useAuth();

  // ---------------------------
  // Handle OAuth redirect on page load
  // ---------------------------
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSessionFromUrl();
        if (sessionError) {
          console.error("OAuth session error:", sessionError.message);
          return;
        }
        const user = session?.user;
        if (user) await handlePostLogin(user);
      } catch (err) {
        console.error("OAuth redirect error:", err);
      }
    };

    handleOAuthRedirect();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user;
      if (user) await handlePostLogin(user);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ---------------------------
  // Email/password login
  // ---------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;
      if (!data.user) throw new Error("Login failed: User not found.");
      await handlePostLogin(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  // ---------------------------
  // OAuth login (Google/Facebook)
  // ---------------------------
  const handleSocialLogin = async (provider) => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.href,
          queryParams: provider === "google" ? { prompt: "select_account" } : {},
        },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // ---------------------------
  // After login: insert/check user
  // ---------------------------
  const handlePostLogin = async (user) => {
    setUser(user);

    if (!user.email) {
      setError("OAuth login did not return an email. Please use another method.");
      return;
    }

    // Check if employee exists
    let { data: profile, error: profileError } = await supabase
      .from("employees")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Profile fetch error:", profileError.message);
    }

    // If no employee, insert into profiles & employees
    if (!profile) {
      const full_name = user.user_metadata?.full_name || "No Name";

      const { error: profilesError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name,
        role: "employee",
      });
      if (profilesError) console.error("Profiles insert error:", profilesError.message);

      const { error: employeesError } = await supabase.from("employees").upsert({
        id: user.id,
        full_name,
        email: user.email,
        role: "employee",
        department: null,
        contact_number: null,
        salary: 0.0,
        status: "Active",
      });
      if (employeesError) console.error("Employees insert error:", employeesError.message);

      profile = { id: user.id, full_name, role: "employee" };
    }

    setProfile(profile);

    // Redirect based on role
    if (profile.role === "admin") navigate("/dashboard");
    else navigate("/employee-dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-2xl shadow-md w-96" onSubmit={handleLogin}>
        <h1 className="text-2xl font-bold text-center mb-4">FreshCut Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-3"
        >
          Login
        </button>

        <hr className="my-4" />

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="flex items-center gap-2 border p-2 rounded hover:bg-gray-200"
          >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("facebook")}
            className="flex items-center gap-2 border p-2 rounded hover:bg-gray-200"
          >
            <img src="/facebook-icon.svg" alt="Facebook" className="w-5 h-5" />
            Continue with Facebook
          </button>
        </div>
      </form>
    </div>
  );
}
