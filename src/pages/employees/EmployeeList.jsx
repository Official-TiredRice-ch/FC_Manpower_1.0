import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      let { data, error } = await supabase.from("employees").select("*");
      if (error) console.error("Error fetching employees:", error.message);
      else setEmployees(data);
    };
    fetchEmployees();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>
      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Department</th>
            <th className="py-2 px-4 border">Salary</th>
            <th className="py-2 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border">{emp.full_name}</td>
              <td className="py-2 px-4 border">{emp.email}</td>
              <td className="py-2 px-4 border">{emp.role}</td>
              <td className="py-2 px-4 border">{emp.department}</td>
              <td className="py-2 px-4 border">₱{emp.salary}</td>
              <td className="py-2 px-4 border">{emp.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
