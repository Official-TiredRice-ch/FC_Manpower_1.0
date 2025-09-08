// pages/dashboard/EmployeeDashboard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeDashboard() {
  const { user, profile } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (user) {
      fetchSchedule();
      fetchAttendance();
    }
  }, [user]);

  const fetchSchedule = async () => {
    const { data, error } = await supabase
      .from("schedules")
      .select("date, shift")
      .eq("employee_id", user.id);
    if (!error) setSchedule(data);
  };


const handleSignOut = async () => {
  await supabase.auth.signOut();

}

  const fetchAttendance = async () => {
    const { data, error } = await supabase
      .from("attendance")
      .select("date, status, check_in, check_out")
      .eq("employee_id", user.id)
      .order("date", { ascending: false });
    if (!error) setAttendance(data);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {profile?.full_name || "Employee"} 👋
      </h1>

      {/* Schedule Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">My Schedule</h2>
        {schedule.length === 0 ? (
          <p>No schedules assigned yet.</p>
        ) : (
          <ul className="list-disc pl-5">
            {schedule.map((s, idx) => (
              <li key={idx}>
                {s.date} — {s.shift}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Attendance Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">My Attendance</h2>
        {attendance.length === 0 ? (
          <p>No attendance records yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Check-in</th>
                <th className="p-2 border">Check-out</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2 border">{a.date}</td>
                  <td className="p-2 border">{a.status}</td>
                  <td className="p-2 border">{a.check_in || "-"}</td>
                  <td className="p-2 border">{a.check_out || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
