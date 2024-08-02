import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [showTimesheet, setShowTimesheet] = useState(false);
  const [showLeaves, setShowLeaves] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  const [leaveData, setLeaveData] = useState({});
  // const navigate = useNavigate();

  const fetchData = (id) => {
    axios
      .get(`http://localhost:5000/employee/calendar/${id}`)
      .then((result) => {
        if (result.data.success && Array.isArray(result.data.calendarData)) {
          setCalendarData(result.data.calendarData);
        } else {
          console.error("Invalid response format:", result.data);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchLeaves = (id) => {
    axios
      .get(`http://localhost:5000/employee/get_total_leave/${id}`)
      .then((result) => {
        if (result.data.success) {
          setLeaveData(result.data.data);
        } else {
          console.error("Invalid response format:", result.data);
        }
      })
      .catch((err) => console.error(err));
  };

  function ViewTimeSheet(id) {
    setShowTimesheet(true);
    fetchData(id);
  }
  function ViewLeaves(id) {
    setShowLeaves(true);
    fetchLeaves(id);
  }

  // Function to format timestamp strings

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/employee")
      .then((response) => {
        if (response.data.success) {
          setEmployees(response.data.Result);
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/auth/delete_employee/${id}`)
      .then((response) => {
        if (response.data.success) {
          // Refresh the employee list
          axios
            .get("http://localhost:5000/auth/employee")
            .then((response) => {
              if (response.data.success) {
                setEmployees(response.data.Result); // Update the state with the new list of employees
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
  };

  const formatLocation = (location) => {
    if (!location) return "N/A";
    try {
      const loc = JSON.parse(location);
      return `Lat: ${loc.userLatitude}, Long: ${loc.userLongitude}`;
    } catch (e) {
      return location;
    }
  };

  function getMonthYearFromDate(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  }

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success">
        Add Employee
      </Link>
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
                Image
              </th>
              <th colSpan={2}>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th colSpan={2} style={{ textAlign: "center" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>
                  <div>
                    {employee.image ? (
                      <img
                        src={`http://localhost:5000/Images/${employee.image}`}
                        alt={employee.name}
                        className="employee-image"
                        style={{
                          width: " 80px",
                          height: " 80px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "4px solid #24894e",
                        }}
                      />
                    ) : (
                      <div
                        className="bg-secondary text-center"
                        style={{
                          width: "100%",
                          height: "100%",
                          lineHeight: "100px",
                        }}
                      >
                        Placeholder
                      </div>
                    )}
                  </div>
                </td>
                <td colSpan={2}>{employee.email}</td>
                <td>{employee.address}</td>
                <td>{employee.salary}</td>
                <td colSpan={2} style={{ textAlign: "center" }}>
                  <Link
                    to={`/dashboard/edit_employee/${employee.id}`}
                    data-bs-toggle="tooltip"
                    title="Edit"
                    className="rounded-circle btn btn-success btn-sm me-2"
                  >
                    <i className="fs-6 bi bi-pencil-square"></i>
                  </Link>
                  <button
                    data-bs-toggle="tooltip"
                    title="Delete"
                    className="rounded-circle btn btn-danger btn-sm me-2"
                    onClick={() => handleDelete(employee.id)}
                  >
                    <i className="fs-6 bi bi-trash3"></i>
                  </button>
                  <button
                    data-bs-toggle="tooltip"
                    title="Timesheet"
                    className="rounded-circle btn btn-primary btn-sm me-2"
                    onClick={() => ViewTimeSheet(employee.id)}
                  >
                    <i className="fs-6 bi bi-clipboard-data"></i>
                  </button>
                  <button
                    data-bs-toggle="tooltip"
                    title="Leaves"
                    className="rounded-circle btn btn-dark btn-sm"
                    onClick={() => ViewLeaves(employee.id)}
                  >
                    <i className="fs-6 bi bi-box-arrow-right"></i>
                  </button>
                  {showTimesheet && (
                    <div
                      className="modal"
                      tabIndex="-1"
                      role="dialog"
                      style={{ display: "block" }}
                    >
                      <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">TimeSheet</h5>
                            <span
                              aria-hidden="true"
                              style={{
                                color: "#999",
                                fontSize: "24px",
                                position: "absolute",
                                top: "8px",
                                right: "12px",
                                cursor: "pointer",
                              }}
                              onClick={() => setShowTimesheet(false)}
                            >
                              &times;
                            </span>
                          </div>
                          <div className="modal-body">
                            <table className="table table-striped table-bordered">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Day</th>
                                  <th>Clock In</th>
                                  <th>Clock Out</th>
                                  <th>Location</th>
                                  <th>Work From</th>
                                </tr>
                              </thead>
                              <tbody>
                                {calendarData.length === 0 ? (
                                  <tr>
                                    <td colSpan="6" className="text-center">
                                      No data found.
                                    </td>
                                  </tr>
                                ) : (
                                  calendarData.map((entry, index) => (
                                    <tr key={index}>
                                      <td>{entry.date}</td>
                                      <td>{entry.dayName}</td>
                                      <td>
                                        {new Date(
                                          entry.clockIn
                                        ).toLocaleString()}
                                      </td>
                                      <td>
                                        {new Date(
                                          entry.clockOut
                                        ).toLocaleString()}
                                      </td>
                                      <td>{formatLocation(entry.location)}</td>
                                      <td>{entry.workFromType}</td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {showLeaves && (
                    <div
                      className="modal"
                      tabIndex="-1"
                      role="dialog"
                      style={{ display: "block" }}
                    >
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Leaves</h5>
                            <span
                              aria-hidden="true"
                              style={{
                                color: "#999",
                                fontSize: "24px",
                                position: "absolute",
                                top: "8px",
                                right: "12px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setShowLeaves(false);
                                setLeaveData({});
                              }}
                            >
                              &times;
                            </span>
                          </div>
                          <div className="modal-body">
                            <p>
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontSize: 30,
                                }}
                              >
                                Casual Leaves:
                              </span>{" "}
                              <span
                                style={{
                                  color: "#24894e",
                                  fontWeight: 700,
                                  fontSize: 30,
                                }}
                              >
                                {leaveData.leaveTypes
                                  ? leaveData.leaveTypes["Casual Leave"]
                                  : "NA"}
                              </span>
                            </p>

                            <p>
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontSize: 30,
                                }}
                              >
                                Medical Leaves:
                              </span>{" "}
                              <span
                                style={{
                                  color: "#24894e",
                                  fontWeight: 700,
                                  fontSize: 30,
                                }}
                              >
                                {leaveData.leaveTypes
                                  ? leaveData.leaveTypes["Medical Leave"]
                                  : "NA"}
                              </span>
                            </p>

                            <p>
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontSize: 30,
                                }}
                              >
                                Total Leaves:
                              </span>{" "}
                              <span
                                style={{
                                  color: "#24894e",
                                  fontWeight: 700,
                                  fontSize: 30,
                                }}
                              >
                                {leaveData.totalLeaves
                                  ? leaveData.totalLeaves
                                  : "NA"}
                              </span>
                            </p>

                            <span
                              style={{
                                color: "#24894e",
                                fontWeight: 700,
                                fontSize: 30,
                              }}
                            >
                              Leave By Months
                            </span>
                            {leaveData.leaveDaysPerMonth &&
                            Object.keys(leaveData.leaveDaysPerMonth).length >
                              0 ? (
                              Object.keys(leaveData.leaveDaysPerMonth).map(
                                (key) => {
                                  const leaveValue =
                                    leaveData.leaveDaysPerMonth[key];
                                  return (
                                    <p key={key}>
                                      <span
                                        style={{
                                          fontWeight: 600,
                                          fontSize: 22,
                                        }}
                                      >
                                        {getMonthYearFromDate(key)}:
                                      </span>{" "}
                                      <span
                                        style={{
                                          color: "#24894e",
                                          fontWeight: 500,
                                          fontSize: 22,
                                        }}
                                      >
                                        {leaveValue} days
                                      </span>
                                    </p>
                                  );
                                }
                              )
                            ) : (
                              <p>No leave data available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
