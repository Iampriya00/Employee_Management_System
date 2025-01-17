import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";

const Sidebar = ({ sidebarOpen, toggleSidebar, handleLogout }) => {
  const location = useLocation();

  return (
    <div
      className={`col-auto col-md-3 col-xl-2 sidebar ${
        !sidebarOpen ? "sidebar-closed" : "sidebar-open"
      }`}
      style={{ backgroundColor: "#171f29" }}
    >
      <div
        className={`d-flex flex-column align-items-center align-items-sm-start ${
          sidebarOpen ? "px-3" : "px-1"
        } pt-2 text-white min-vh-100`}
      >
        <Link
          to="/dashboard"
          className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
        >
          <span className="fs-5 fw-bolder d-flex align-items-center justify-content-center">
            <img
              src="/images/worksuite_img.png"
              alt="Logo Image"
              style={{
                maxWidth: "40px",
                height: "auto",
                width: "40px !important",
              }}
            />
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "900",
                marginTop: "0px",
                marginBottom: "0px",
                fontFamily: "Quicksand",
              }}
            >
              {sidebarOpen ? "EMS" : ""}
            </h2>
          </span>
        </Link>
        <ul
          className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100"
          id="menu"
        >
          <li className="w-100">
            <Link
              to="/dashboard"
              className={`nav-link text-white ${
                sidebarOpen ? "px-3" : "px-1"
              } my-1 py-2 align-middle ${
                location.pathname === "/dashboard" ? "active" : ""
              }`}
            >
              <i className="fs-4 mx-2 bi bi-house"></i>
              <span
                className={`ms-2 d-none d-sm-inline ${
                  !sidebarOpen ? "hidden" : ""
                }`}
              >
                Dashboard
              </span>
            </Link>
          </li>
          <li className="w-100">
            <Link
              to="/dashboard/employee"
              className={`nav-link text-white ${
                sidebarOpen ? "px-3" : "px-1"
              } my-1 py-2 align-middle ${
                location.pathname === "/dashboard/employee" ? "active" : ""
              }`}
            >
              <i className="fs-4 mx-2 bi-people"></i>
              <span
                className={`ms-2 d-none d-sm-inline ${
                  !sidebarOpen ? "hidden" : ""
                }`}
              >
                Employees
              </span>
            </Link>
          </li>
          <li className="w-100">
            <Link
              to="/dashboard/category"
              className={`nav-link text-white ${
                sidebarOpen ? "px-3" : "px-1"
              } my-1 py-2 align-middle ${
                location.pathname === "/dashboard/category" ? "active" : ""
              }`}
            >
              <i className="fs-4 mx-2 bi bi-tags"></i>
              <span
                className={`ms-2 d-none d-sm-inline ${
                  !sidebarOpen ? "hidden" : ""
                }`}
              >
                Category
              </span>
            </Link>
          </li>
          <li className="w-100">
            <Link
              to="/dashboard/manageadmin"
              className={`nav-link text-white ${
                sidebarOpen ? "px-3" : "px-1"
              } my-1 py-2 align-middle ${
                location.pathname === "/dashboard/manageadmin" ? "active" : ""
              }`}
            >
              <i className="fs-4 mx-2 bi-person"></i>
              <span
                className={`ms-2 d-none d-sm-inline ${
                  !sidebarOpen ? "hidden" : ""
                }`}
              >
                Admins
              </span>
            </Link>
          </li>
          <li className="w-100">
            <Link
              to="/dashboard/leavereq"
              className={`nav-link text-white ${
                sidebarOpen ? "px-3" : "px-1"
              } my-1 py-2 align-middle ${
                location.pathname === "/dashboard/leavereq" ? "active" : ""
              }`}
            >
              <i className="fs-4 mx-2 bi bi-calendar2-check"></i>
              <span
                className={`ms-2 d-none d-sm-inline ${
                  !sidebarOpen ? "hidden" : ""
                }`}
              >
                Leave Requests
              </span>
            </Link>
          </li>
          <li className="w-100">
            <Link
              to="/dashboard/officeaddress"
              className={`nav-link text-white ${
                sidebarOpen ? "px-3" : "px-1"
              } my-1 py-2 align-middle ${
                location.pathname === "/dashboard/officeaddress" ? "active" : ""
              }`}
            >
              <i className="fs-4 mx-2 bi bi-geo-alt"></i>
              <span
                className={`ms-2 d-none d-sm-inline ${
                  !sidebarOpen ? "hidden" : ""
                }`}
              >
                Office
              </span>
            </Link>
          </li>
        </ul>

        <button
          type="button"
          onClick={handleLogout}
          className="logout-btn btn btn-outline-danger logout btn py-2 mt-1 mx-auto mb-3"
        >
          <i className="fs-5 bi bi-power"></i>{" "}
          <span
            className={`d-none d-sm-inline ${!sidebarOpen ? "hidden" : ""}`}
          >
            Logout
          </span>
        </button>
        <div
          className="d-flex justify-content-center align-items-center sidebarTogglerBox w-100 py-2"
          style={{ borderTop: "1px solid #333" }}
        >
          <button
            className="btn btn-outline-dark text-lightest font-weight-bold btn-sm"
            id="sidebarToggle"
            style={{
              // color: "#444",
              border: "1px solid #fff",
            }}
            onClick={toggleSidebar}
          >
            <i className="bi mx-2 bi-list fs-4 " style={{ color: "white" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
