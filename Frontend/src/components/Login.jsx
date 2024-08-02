import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if email or password is empty
    if (!values.email || !values.password) {
      toast.error("Email and password are required.");
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:5000/auth/adminlogin",
        values
      );
      if (result.data.loginStatus) {
        localStorage.setItem("valid", true);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        const errorMessage = result.data.error || "Invalid email or password.";
        toast.error(errorMessage);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Invalid email or password.");
      } else {
        console.error(error);
        toast.error("An error occurred.");
      }
    }
  };

  return (
    <div id="form-body">
      <div className="d-flex justify-content-center align-items-center vh-100 loginPage2">
        <ToastContainer position="bottom-right" />
        <div className="p-3 rounded border loginForm">
          <h2>Login Page</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <span className="bold-form-label ">Email:</span>
              </label>
              <input
                type="email"
                id="emailInput"
                name="email"
                autoComplete="off"
                placeholder="example@gmail.com"
                value={values.email}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                <span className="bold-form-label">Password:</span>
              </label>
              <div className="position-relative">
                <input
                  type={isVisible ? "text" : "password"}
                  name="password"
                  placeholder="Your password"
                  value={values.password}
                  onChange={handleInputChange}
                  className="form-control"
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "50%",
                    transform: "translateY(-50%)",
                    right: "15px",
                  }}
                >
                  <i
                    className={`bi bi-eye-slash ${isVisible ? "bi-eye" : ""}`}
                    id="togglePassword"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={toggleVisibility}
                  />
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                className="button-74"
                onClick={() => navigate("/")}
              >
                Back
              </button>
              <button type="submit" className="button-74">
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
