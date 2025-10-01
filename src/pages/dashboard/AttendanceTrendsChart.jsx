import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10B981", "#EF4444", "#F59E0B", "#3B82F6"]; 
// Green = Present, Red = Absent, Yellow = Late, Blue = On Leave

export default function AttendanceTrendsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      // get all attendance records for the last 30 days
      let { data: rows, error } = await supabase
        .from("attendance")
        .select("status, date")
        .gte(
          "date",
          new Date(new Date().setDate(new Date().getDate() - 30))
            .toISOString()
            .split("T")[0]
        );

      if (error) {
        console.error("Error fetching attendance:", error.message);
        return;
      }

      if (rows) {
        // group records by status
        const grouped = rows.reduce((acc, row) => {
          const existing = acc.find((item) => item.name === row.status);
          if (existing) {
            existing.value += 1;
          } else {
            acc.push({ name: row.status, value: 1 });
          }
          return acc;
        }, []);

        setData(grouped);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Attendance Trends (Last 30 Days)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
// Colors: Green = Present, Red = Absent, Yellow = Late, Blue = On Leave