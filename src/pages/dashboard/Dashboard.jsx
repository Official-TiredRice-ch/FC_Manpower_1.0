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
import "../../styles/dashboard.css";

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
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">
        Overview of manpower distribution and activity.
      </p>

      <div className="dashboard-grid">
        {/* ✅ Card 1: Employees by Role */}
        <div className="dashboard-card">
          <h2 className="card-title">Employees by Role</h2>
          <div className="chart-wrapper">
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

        {/* ✅ Card 2: Attendance Trends */}
        <AttendanceTrendsChart />

        {/* ✅ Card 3: Total Employees */}
        <div className="dashboard-card center">
          <h2 className="card-title">Total Employees</h2>
          <p className="metric">{totalEmployees}</p>
        </div>
      </div>
    </div>
  );
}