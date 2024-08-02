import { useState } from "react";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { toast } from "react-toastify";

const AddLeave = () => {
  const { id } = useParams();

  const [leaveType, setLeaveType] = useState("");

  const [showModal, setShowModal] = useState(false);

  const handleLeaveSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
      leave_type: leaveType,
      description: formData.get("description"),
    };
    console.log(data);

    axios
      .post(`http://localhost:5000/employee/add_leave_record/${id}`, data)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setShowModal(false);
          toast.success("Leave taken");
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary d-flex align-items-center"
        onClick={() => setShowModal(true)}
      >
        <i style={{ marginRight: 5 }} className="fs-5 bi bi-calendar2-week"></i>
        Take Leave
      </button>

      {showModal && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Take Leave</h5>
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
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </span>
              </div>
              <form onSubmit={handleLeaveSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label
                      htmlFor="startDate"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "left",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      id="startDate"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="endDate"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "left",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      End Date
                    </label>

                    <input
                      type="date"
                      name="end_date"
                      id="endDate"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="desc"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "left",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="desc"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="leaveType"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "left",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      Leave Type
                    </label>
                    <select
                      className="form-control"
                      id="leaveType"
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                    >
                      <option defaultChecked>Open this select menu</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Medical Leave">Medical Leave</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger">
                    Leave
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddLeave;
