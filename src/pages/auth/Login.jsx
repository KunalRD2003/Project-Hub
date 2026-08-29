import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

    const [loginType, setLoginType] = useState("admin");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = async (event) => {

        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            const endpoint =
                loginType === "admin"
                    ? "/admin/login"
                    : "/employees/login";


            const response = await api.post(
                endpoint,
                {
                    username: username.trim(),
                    password: password
                }
            );


            // =================================================
            // LOGIN SUCCESS
            // =================================================

            if (response.data.success) {

                if (loginType === "admin") {

                    // Store admin information
                    localStorage.setItem(
                        "admin",
                        JSON.stringify(response.data)
                    );

                    // Remove employee login
                    localStorage.removeItem(
                        "employee"
                    );

                    // Go to admin dashboard
                    navigate("/admin/dashboard");

                } else {

                    // Store employee information
                    localStorage.setItem(
                        "employee",
                        JSON.stringify(response.data)
                    );

                    // Remove admin login
                    localStorage.removeItem(
                        "admin"
                    );

                    // Go to employee dashboard
                    navigate("/employee/dashboard");
                }

            } else {

                setMessage(
                    response.data.message ||
                    "Invalid username or password."
                );
            }


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            if (error.response) {

                setMessage(
                    error.response.data?.message ||
                    "Invalid username or password."
                );

            } else {

                setMessage(
                    "Unable to connect to server."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // CHANGE LOGIN TYPE
    // =====================================================

    const handleLoginTypeChange = (type) => {

        setLoginType(type);

        setMessage("");

        setUsername("");

        setPassword("");
    };


    return (

        <div className="admin-login-page">

            <div className="admin-login-container">


                {/* =================================================
                            HEADER
                    ================================================= */}

                <div className="admin-login-header">

                    <div className="admin-login-logo">
                        PMS
                    </div>

                    <h1>
                        Project Management System
                    </h1>

                    <p>
                        {loginType === "admin"
                            ? "Admin Portal"
                            : "Employee Portal"}
                    </p>

                </div>


                {/* =================================================
                            LOGIN CARD
                    ================================================= */}

                <div className="admin-login-card">


                    <div className="admin-login-card-header">

                        <h2>
                            Login
                        </h2>

                        <p>
                            Select your account type
                        </p>

                    </div>


                    {/* =================================================
                                LOGIN TYPE
                        ================================================= */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "10px",
                            marginBottom: "20px"
                        }}
                    >

                        {/* ADMIN */}

                        <button
                            type="button"
                            onClick={() =>
                                handleLoginTypeChange("admin")
                            }
                            disabled={loading}
                            style={{
                                padding: "12px",
                                borderRadius: "8px",
                                border:
                                    loginType === "admin"
                                        ? "2px solid #2563eb"
                                        : "1px solid #d1d5db",
                                background:
                                    loginType === "admin"
                                        ? "#eff6ff"
                                        : "#ffffff",
                                color:
                                    loginType === "admin"
                                        ? "#2563eb"
                                        : "#374151",
                                fontWeight: "600",
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer"
                            }}
                        >
                            Admin
                        </button>


                        {/* EMPLOYEE */}

                        <button
                            type="button"
                            onClick={() =>
                                handleLoginTypeChange("employee")
                            }
                            disabled={loading}
                            style={{
                                padding: "12px",
                                borderRadius: "8px",
                                border:
                                    loginType === "employee"
                                        ? "2px solid #2563eb"
                                        : "1px solid #d1d5db",
                                background:
                                    loginType === "employee"
                                        ? "#eff6ff"
                                        : "#ffffff",
                                color:
                                    loginType === "employee"
                                        ? "#2563eb"
                                        : "#374151",
                                fontWeight: "600",
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer"
                            }}
                        >
                            Employee
                        </button>

                    </div>


                    {/* =================================================
                                ERROR MESSAGE
                        ================================================= */}

                    {message && (

                        <div className="admin-login-error">

                            <span>
                                !
                            </span>

                            <p>
                                {message}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setMessage("")
                                }
                            >
                                ×
                            </button>

                        </div>

                    )}


                    {/* =================================================
                                LOGIN FORM
                        ================================================= */}

                    <form
                        onSubmit={handleLogin}
                        className="admin-login-form"
                    >


                        {/* USERNAME */}

                        <div className="admin-login-form-group">

                            <label>
                                Username
                                <span>*</span>
                            </label>

                            <input
                                type="text"
                                placeholder={
                                    loginType === "admin"
                                        ? "Enter admin username"
                                        : "Enter employee username"
                                }
                                value={username}
                                onChange={(event) =>
                                    setUsername(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                                autoComplete="username"
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="admin-login-form-group">

                            <label>
                                Password
                                <span>*</span>
                            </label>

                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                                autoComplete="current-password"
                                required
                            />

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="admin-login-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Logging in..."
                                : `Login as ${
                                    loginType === "admin"
                                        ? "Admin"
                                        : "Employee"
                                }`
                            }

                        </button>

                    </form>


                    {/* =================================================
                                CURRENT LOGIN TYPE
                        ================================================= */}

                    <div
                        style={{
                            marginTop: "20px",
                            textAlign: "center",
                            fontSize: "13px",
                            color: "#6b7280"
                        }}
                    >

                        You are logging in as{" "}

                        <strong
                            style={{
                                color: "#2563eb"
                            }}
                        >
                            {loginType === "admin"
                                ? "Admin"
                                : "Employee"}
                        </strong>

                    </div>

                </div>


                {/* =================================================
                            FOOTER
                    ================================================= */}

                <div className="admin-login-footer">

                    <p>
                        © {new Date().getFullYear()} Project
                        Management System
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;