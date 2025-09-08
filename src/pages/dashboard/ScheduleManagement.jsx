// pages/dashboard/ScheduleManagement.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ScheduleManagement() {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    employee_id: "",
    date: "",
    shift: "",
  });

  const [editing, setEditing] = useState(null); // track editing row

  useEffect(() => {
    fetchEmployees();
    fetchSchedules();
  }, []);

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("role", "employee");
    if (!error) setEmployees(data);
  };

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from("schedules")
      .select("id, date, shift, employee_id, profiles(full_name)")
      .order("date", { ascending: true });
    if (!error) setSchedules(data);
  };

  // Add new schedule
  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!newSchedule.employee_id || !newSchedule.date || !newSchedule.shift) {
      alert("Please fill all fields");
      return;
    }

    const { error } = await supabase.from("schedules").insert([newSchedule]);

    if (!error) {
      setNewSchedule({ employee_id: "", date: "", shift: "" });
      fetchSchedules();
    }
  };

  // Delete schedule
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;
    const { error } = await supabase.from("schedules").delete().eq("id", id);
    if (!error) fetchSchedules();
  };

  // Start editing
  const startEdit = (schedule) => {
    setEditing(schedule.id);
    setNewSchedule({
      employee_id: schedule.employee_id,
      date: schedule.date,
      shift: schedule.shift,
    });
  };

  // Save edit
  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    if (!newSchedule.employee_id || !newSchedule.date || !newSchedule.shift) {
      alert("Please fill all fields");
      return;
    }

    const { error } = await supabase
      .from("schedules")
      .update({
        employee_id: newSchedule.employee_id,
        date: newSchedule.date,
        shift: newSchedule.shift,
      })
      .eq("id", editing);

    if (!error) {
      setEditing(null);
      setNewSchedule({ employee_id: "", date: "", shift: "" });
      fetchSchedules();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Schedule Management 📅</h1>

      {/* Add or Edit Form */}
      <form
        onSubmit={editing ? handleUpdateSchedule : handleAddSchedule}
        className="flex gap-4 mb-6"
      >
        <select
          value={newSchedule.employee_id}
          onChange={(e) =>
            setNewSchedule({ ...newSchedule, employee_id: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={newSchedule.date}
          onChange={(e) =>
            setNewSchedule({ ...newSchedule, date: e.target.value })
          }
          className="border p-2 rounded"
        />

        <select
          value={newSchedule.shift}
          onChange={(e) =>
            setNewSchedule({ ...newSchedule, shift: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="">Select Shift</option>
          <option value="Morning">Morning (8AM - 12PM)</option>
          <option value="Afternoon">Afternoon (1PM - 5PM)</option>
          <option value="Evening">Evening (6PM - 10PM)</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editing ? "Update" : "Assign"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setNewSchedule({ employee_id: "", date: "", shift: "" });
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Schedule List */}
      <h2 className="text-lg font-semibold mb-2">All Schedules</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Shift</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id} className="border-b">
              <td className="p-2 border">{s.profiles.full_name}</td>
              <td className="p-2 border">{s.date}</td>
              <td className="p-2 border">{s.shift}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => startEdit(s)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
