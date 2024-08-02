import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LeaveStatus } from "../utils/status";
import { toast } from "react-toastify";

const LeaveReq = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  // const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/employee/all_leave_record")
      .then((response) => {
        if (response.data.success) {
          setEmployees(response.data.leaveRecord);
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  function getTotalLeaveDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return totalDays;
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  function handleApproveLeave(id, status) {
    axios
      .post(`http://localhost:5000/employee/update_leave_status/${id}`, {
        status,
      })
      .then((response) => {
        if (response.data.success) {
          // Refresh the employee list
          axios
            .get("http://localhost:5000/employee/all_leave_record")
            .then((response) => {
              if (response.data.success) {
                setEmployees(response.data.leaveRecord);
                toast.success("Leave Approved");
              } else {
                alert(response.data.message);
              }
            })
            .catch((error) => console.log(error));
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => console.log(error));
  }

  function handleRejectLeave(id, status) {
    axios
      .post(`http://localhost:5000/employee/delete_leave_record/${id}`, {
        status,
      })
      .then((response) => {
        if (response.data.success) {
          axios
            .get("http://localhost:5000/employee/all_leave_record")
            .then((response) => {
              if (response.data.success) {
                setEmployees(response.data.leaveRecord);
                toast.success("Leave Rejected");
              } else {
                alert(response.data.message);
              }
            })
            .catch((error) => console.log(error));
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Leave Requests</h3>
      </div>

      <div className="mt-3">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th
                style={{
                  textAlign: "center",
                }}
              >
                Leave Type
              </th>
              <th>Start Date</th>
              <th>End Date</th>
              <th style={{ textAlign: "center" }}>Leave Days</th>
              <th colSpan={2}>Leave Details</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees
              .sort((a, b) => a.id - b.id)
              .map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.employee_name}</td>
                  <td>{employee.leave_type}</td>
                  <td>{formatDate(employee.leave_start_date)}</td>
                  <td>{formatDate(employee.leave_end_date)}</td>
                  <td style={{ textAlign: "center" }}>
                    {getTotalLeaveDays(
                      employee.leave_start_date,
                      employee.leave_end_date
                    )}
                  </td>
                  <td colSpan={2}>{employee.description}</td>
                  <td style={{ textAlign: "center" }}>
                    {employee.status === LeaveStatus["Pending"] ? (
                      <span
                        style={{
                          color: "#f5a524",
                          fontWeight: 600,
                        }}
                      >
                        <i class="fs-5 bi bi-exclamation-circle-fill" />
                        <p>Pending</p>
                      </span>
                    ) : employee.status === LeaveStatus["Approved"] ? (
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#24894e",
                        }}
                      >
                        <i class="fs-5 bi bi-check-circle-fill"></i>
                        <p>Approved</p>
                      </span>
                    ) : (
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#dc2828",
                        }}
                      >
                        <i class="fs-5 bi bi-x-circle-fill" />
                        <p>Rejected</p>
                      </span>
                    )}
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleApproveLeave(
                            employee.id,
                            LeaveStatus["Approved"]
                          )
                        }
                        class="icon-button approve"
                        data-bs-toggle="tooltip"
                        title="Approve"
                        disabled={
                          employee.status === LeaveStatus["Rejected"] ||
                          employee.status === LeaveStatus["Approved"]
                        }
                      >
                        <i class="fs-4 bi bi-check-circle-fill"></i>
                      </button>
                      <button
                        type="button"
                        data-bs-toggle="tooltip"
                        title="Reject"
                        class="icon-button reject"
                        onClick={() =>
                          handleRejectLeave(
                            employee.id,
                            LeaveStatus["Rejected"]
                          )
                        }
                        disabled={
                          employee.status === LeaveStatus["Approved"] ||
                          employee.is_active === false
                        }
                      >
                        <i class=" fs-4 bi bi-x-circle-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveReq;
