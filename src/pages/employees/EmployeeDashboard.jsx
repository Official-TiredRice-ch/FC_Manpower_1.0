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
    <div className="employee-dashboard">
      <h1 className="dashboard-title">
        Welcome, {profile?.full_name || "Employee"} 👋
      </h1>

      {/* Schedule Section */}
      <div className="dashboard-section">
        <h2 className="section-title">My Schedule</h2>
        {schedule.length === 0 ? (
          <p className="empty-text">No schedules assigned yet.</p>
        ) : (
          <ul className="schedule-list">
            {schedule.map((s, idx) => (
              <li key={idx}>
                {s.date} — {s.shift}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Attendance Section */}
      <div className="dashboard-section">
        <h2 className="section-title">My Attendance</h2>
        {attendance.length === 0 ? (
          <p className="empty-text">No attendance records yet.</p>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check-in</th>
                <th>Check-out</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a, idx) => (
                <tr key={idx}>
                  <td>{a.date}</td>
                  <td>{a.status}</td>
                  <td>{a.check_in || "-"}</td>
                  <td>{a.check_out || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}