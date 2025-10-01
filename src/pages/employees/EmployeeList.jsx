// pages/dashboard/EmployeeList.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/employeelist.css";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      let { data, error } = await supabase
        .from("employees")
        .select(`
          id,
          full_name,
          email,
          role,
          salary,
          status,
          departments ( name ),
          schedules (
            temporary_department,
            departments!schedules_temporary_department_fkey ( name ),
            created_at
          )
        `);

      if (error) {
        console.error("Error fetching employees:", error.message);
        return;
      }

      // Process employees
      const processed = data.map((emp) => {
        let deptName = emp.departments?.name || null;

        // get latest schedule with temp dept
        let latestSchedule = null;
        if (emp.schedules?.length > 0) {
          latestSchedule = emp.schedules.reduce((latest, current) =>
            new Date(current.created_at) > new Date(latest?.created_at || 0)
              ? current
              : latest,
            null
          );
        }

        if (latestSchedule?.departments?.name) {
          deptName = `${latestSchedule.departments.name} (Temp Dept)`;
        }

        return { ...emp, departmentDisplay: deptName || "—" };
      });

      setEmployees(processed);
    };

    fetchEmployees();
  }, []);

  return (
    <div className="employee-container">
      <h1 className="employee-title">👥 Employee Management</h1>

      <div className="employee-card">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.full_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.role}</td>
                  <td>{emp.departmentDisplay}</td>
                  <td>₱{emp.salary}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        emp.status === "Active"
                          ? "status-active"
                          : emp.status === "Pending"
                          ? "status-pending"
                          : "status-inactive"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
