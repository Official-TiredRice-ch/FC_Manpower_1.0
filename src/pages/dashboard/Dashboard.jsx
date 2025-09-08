import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AttendanceTrendsChart from "./AttendanceTrendsChart";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    
    const fetchEmployees = async () => {
      let { data: employees } = await supabase.from("employees").select("role");
      if (employees) {
        setTotalEmployees(employees.length);

        const grouped = employees.reduce((acc, emp) => {
          acc[emp.role] = (acc[emp.role] || 0) + 1;
          return acc;
        }, {});
        setData(
          Object.keys(grouped).map((role) => ({ role, count: grouped[role] }))
        );
      }
    };
    
    fetchEmployees();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 mb-6">
        Overview of manpower distribution and activity.
      </p>

      {/* GRID for dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* ✅ Card 1: Employees by Role */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Employees by Role</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ✅ Card 2: Attendance Trends (Pie Chart) */}
        <AttendanceTrendsChart />

        {/* ✅ Card 3: Total Employees (simple metric card) */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-center items-center">
          <h2 className="text-lg font-semibold mb-2">Total Employees</h2>
          <p className="text-4xl font-bold text-blue-600">{totalEmployees}</p>
        </div>

      </div>
    </div>
  );
}
