import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import "../../styles/EmployeeDashboard.css";

export default function EmployeeDashboard() {
  const { user, profile } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    if (user) {
      fetchSchedule();
      fetchAttendance();
    }
  }, [user]);

  const fetchSchedule = async () => {
    const { data, error } = await supabase
      .from("schedules")
      .select("id, shift_date, shift, shift_start, shift_end, project, status")
      .eq("employee_id", user.id);

    if (error) console.error("Error fetching schedule:", error.message);
    else setSchedule(data);
  };

  const fetchAttendance = async () => {
    const { data, error } = await supabase
      .from("attendance")
      .select("date, status, check_in, check_out")
      .eq("employee_id", user.id)
      .order("date", { ascending: false });
    if (!error) setAttendance(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="employee-dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {profile?.full_name || "Employee"} 👋</h1>
        <button onClick={handleSignOut} className="signout-btn">
          Sign Out
        </button>
      </header>

      {/* Schedule Section */}
      <section className="dashboard-section">
        <h2>My Schedule</h2>
        {schedule.length === 0 ? (
          <p className="empty-text">No schedules assigned yet.</p>
        ) : (
          <ul className="schedule-list">
            {schedule.map((s, idx) => (
              <li
                key={idx}
                className="schedule-item"
                onClick={() => setSelectedSchedule(s)}
              >
                <span className="schedule-date">
                  {new Date(s.shift_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="schedule-shift">{s.shift}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Schedule Details Modal */}
        {selectedSchedule && (
          <div className="modal-overlay" onClick={() => setSelectedSchedule(null)}>
            <div
              className="modal-content fancy-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setSelectedSchedule(null)}
              >
                ×
              </button>

              <h3 className="modal-title">🗓 Schedule Overview</h3>

              <div className="modal-body modern-details">
                <div className="detail-row">
                  <span className="icon">📅</span>
                  <div>
                    <p className="label">Date</p>
                    <p className="value">
                    {new Date(selectedSchedule.shift_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="icon">💼</span>
                  <div>
                    <p className="label">Shift</p>
                    <p className="value">{selectedSchedule.shift}</p>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="icon">🕐</span>
                  <div>
                    <p className="label">Start Time</p>
                    <p className="value">
                      {new Date(`1970-01-01T${selectedSchedule.shift_start}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}
                    </p>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="icon">🕔</span>
                  <div>
                    <p className="label">End Time</p>
                    <p className="value">
                      {new Date(`1970-01-01T${selectedSchedule.shift_end}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}
                    </p>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="icon">📂</span>
                  <div>
                    <p className="label">Project</p>
                    <p className="value">{selectedSchedule.project || "N/A"}</p>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="icon">🎯</span>
                  <div>
                    <p className="label">Status</p>
                    <span
                      className={`status-chip ${
                        selectedSchedule.status?.toLowerCase() || "default"
                      }`}
                    >
                      {selectedSchedule.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="modal-button"
                  onClick={() => setSelectedSchedule(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}


      </section>

      {/* Attendance Section */}
      <section className="dashboard-section">
        <h2>My Attendance</h2>
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
                  <td
                    className={`status ${
                      a.status === "Present"
                        ? "present"
                        : a.status === "Absent"
                        ? "absent"
                        : "pending"
                    }`}
                  >
                    {a.status}
                  </td>
                  <td>{a.check_in || "-"}</td>
                  <td>{a.check_out || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <footer className="dashboard-footer">
        Employee Dashboard © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
