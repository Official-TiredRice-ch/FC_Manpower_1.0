import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "employee", // default role
    position: "",
    department: "",
    contact_number: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Check if email already exists in employees table
      const { data: existingEmployee, error: checkError } = await supabase
        .from("employees")
        .select("email")
        .eq("email", formData.email)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // Ignore "No rows found" error (PGRST116), handle other errors
        throw new Error(`Error checking email: ${checkError.message}`);
      }

      if (existingEmployee) {
        throw new Error("This email is already registered.");
      }

      // 1. Create user in Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            role: formData.role,
          },
        },
      });

      if (authError) throw authError;
      const user = data.user;
      if (!user) throw new Error("User not created.");

      // 2. Insert into profiles table
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id, // ✅ use the same UUID as auth.users
        full_name: formData.full_name,
        role: formData.role,
      });

      if (profileError) throw new Error(`Profiles insert failed: ${profileError.message}`);

      // 3. Insert into employees table
      const { error: empError } = await supabase.from("employees").insert({
        id: user.id, // ✅ ensure alignment
        full_name: formData.full_name,
        email: formData.email,
        role: formData.role === "employee" ? "Worker" : "Supervisor", // Map role to match database constraint
        department: formData.department || null,
        contact_number: formData.contact_number || null,
        salary: 0.0, // default
        status: "Active",
      });

      if (empError) throw new Error(`Employees insert failed: ${empError.message}`);

      alert(" Registration successful! Please verify your email before logging in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-2xl shadow-md w-96"
      >
        <h1 className="text-xl font-bold text-center mb-4">
          Employee Registration
        </h1>

        <input
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          name="contact_number"
          placeholder="Contact Number"
          value={formData.contact_number}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
