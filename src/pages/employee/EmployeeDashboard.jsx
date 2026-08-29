import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {
    const navigate = useNavigate();

    const [employee, setEmployee] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("ALL");

    // =====================================================
    // LOAD EMPLOYEE
    // =====================================================

    useEffect(() => {
        const storedEmployee = localStorage.getItem("employee");

        if (!storedEmployee) {
            navigate("/employee/login");
            return;
        }

        try {
            const employeeData = JSON.parse(storedEmployee);
            setEmployee(employeeData);
        } catch (error) {
            console.error(
                "Unable to read employee information",
                error
            );

            localStorage.removeItem("employee");
            navigate("/employee/login");
        }
    }, [navigate]);

    // =====================================================
    // LOAD EMPLOYEE TASKS
    // =====================================================

    useEffect(() => {
        if (!employee?.employeeUsername) {
            return;
        }

        loadTasks();
    }, [employee]);

    // =====================================================
    // GET TASKS
    // =====================================================

    const loadTasks = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                `/tasks/assigned/${encodeURIComponent(
                    employee.employeeUsername
                )}`
            );

            setTasks(response.data || []);
        } catch (error) {
            console.error(
                "Unable to load employee tasks",
                error
            );

            alert(
                error.response?.data ||
                    "Unable to load tasks."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        localStorage.removeItem("employee");
        navigate("/employee/login");
    };

    // =====================================================
    // STATUS CONFIG
    // =====================================================

    const columns = [
        {
            status: "PENDING",
            title: "Pending",
            color: "orange",
        },
        {
            status: "INPROGRESS",
            title: "In Progress",
            color: "blue",
        },
        {
            status: "COMPLETED",
            title: "Completed",
            color: "green",
        },
        {
            status: "CANCELLED",
            title: "Cancelled",
            color: "red",
        },
    ];

    // =====================================================
    // FILTER TASKS
    // =====================================================

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const searchText = search
                .trim()
                .toLowerCase();

            const matchesSearch =
                !searchText ||
                task.taskTitle
                    ?.toLowerCase()
                    .includes(searchText) ||
                task.taskDescription
                    ?.toLowerCase()
                    .includes(searchText) ||
                String(task.taskId)
                    .toLowerCase()
                    .includes(searchText);

            const matchesPriority =
                priorityFilter === "ALL" ||
                task.taskPriority === priorityFilter;

            return (
                matchesSearch &&
                matchesPriority
            );
        });
    }, [tasks, search, priorityFilter]);

    // =====================================================
    // GET COLUMN TASKS
    // =====================================================

    const getColumnTasks = (status) => {
        return filteredTasks.filter(
            (task) => task.taskStatus === status
        );
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        try {
            return new Date(date).toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );
        } catch {
            return date;
        }
    };

    // =====================================================
    // PRIORITY CLASS
    // =====================================================

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "LOW":
                return "priority-low";

            case "MEDIUM":
                return "priority-medium";

            case "HIGH":
                return "priority-high";

            case "CRITICAL":
                return "priority-critical";

            default:
                return "";
        }
    };

    // =====================================================
    // PRIORITY LABEL
    // =====================================================

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case "LOW":
                return "Low";

            case "MEDIUM":
                return "Medium";

            case "HIGH":
                return "High";

            case "CRITICAL":
                return "Critical";

            default:
                return priority || "-";
        }
    };

    // =====================================================
    // VIEW TASK
    // =====================================================

    const handleViewTask = (task) => {
        navigate(`/employee/tasks/${task.taskId}`);
    };

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalTasks = tasks.length;

    const pendingTasks = tasks.filter(
        (task) => task.taskStatus === "PENDING"
    ).length;

    const inProgressTasks = tasks.filter(
        (task) => task.taskStatus === "INPROGRESS"
    ).length;

    const completedTasks = tasks.filter(
        (task) => task.taskStatus === "COMPLETED"
    ).length;

    const cancelledTasks = tasks.filter(
        (task) => task.taskStatus === "CANCELLED"
    ).length;

    // =====================================================
    // LOADING
    // =====================================================

    if (!employee) {
        return (
            <div className="employee-page-loading">
                Loading employee information...
            </div>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="employee-dashboard">

            {/* =================================================
                TOP HEADER
            ================================================= */}

            <header className="employee-header">

                <div className="employee-header-left">

                    <div className="employee-logo">
                        <span className="logo-mark">
                            P
                        </span>

                        <span className="logo-text">
                            ProjectFlow
                        </span>
                    </div>

                    <div className="header-divider"></div>

                    <div className="page-heading">
                        <h1>
                            My Tasks
                        </h1>

                        <span>
                            Employee Workspace
                        </span>
                    </div>

                </div>


                <div className="employee-header-right">

                    <div className="employee-profile">

                        <div className="profile-avatar">
                            {employee.employeeName
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div className="profile-info">

                            <strong>
                                {employee.employeeName}
                            </strong>

                            <span>
                                {employee.employeeUsername}
                            </span>

                        </div>

                    </div>


                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="employee-main">

                {/* =================================================
                    WELCOME
                ================================================= */}

                <section className="welcome-section">

                    <div>
                        <h2>
                            Welcome back,{" "}
                            <span>
                                {employee.employeeName}
                            </span>
                        </h2>

                        <p>
                            Manage and track the tasks assigned
                            to you.
                        </p>
                    </div>

                </section>


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <section className="task-stats">

                    <div className="task-stat-card">

                        <div className="stat-icon total">
                            <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <rect
                                    x="4"
                                    y="4"
                                    width="16"
                                    height="16"
                                    rx="2"
                                />
                                <path d="M8 9h8M8 13h8M8 17h5" />
                            </svg>
                        </div>

                        <div>
                            <span>
                                Total Tasks
                            </span>

                            <strong>
                                {totalTasks}
                            </strong>
                        </div>

                    </div>


                    <div className="task-stat-card">

                        <div className="stat-icon pending">
                            <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="8"
                                />
                                <path d="M12 8v5l3 2" />
                            </svg>
                        </div>

                        <div>
                            <span>
                                Pending
                            </span>

                            <strong>
                                {pendingTasks}
                            </strong>
                        </div>

                    </div>


                    <div className="task-stat-card">

                        <div className="stat-icon progress">
                            <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path d="M5 12h14" />
                                <path d="m13 6 6 6-6 6" />
                            </svg>
                        </div>

                        <div>
                            <span>
                                In Progress
                            </span>

                            <strong>
                                {inProgressTasks}
                            </strong>
                        </div>

                    </div>


                    <div className="task-stat-card">

                        <div className="stat-icon completed">
                            <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="8"
                                />
                                <path d="m8.5 12 2.3 2.3 4.8-5" />
                            </svg>
                        </div>

                        <div>
                            <span>
                                Completed
                            </span>

                            <strong>
                                {completedTasks}
                            </strong>
                        </div>

                    </div>


                    <div className="task-stat-card">

                        <div className="stat-icon cancelled">
                            <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="8"
                                />
                                <path d="m9 9 6 6M15 9l-6 6" />
                            </svg>
                        </div>

                        <div>
                            <span>
                                Cancelled
                            </span>

                            <strong>
                                {cancelledTasks}
                            </strong>
                        </div>

                    </div>

                </section>


                {/* =================================================
                    TASK AREA
                ================================================= */}

                <section className="task-section">

                    {/* TASK SECTION HEADER */}

                    <div className="task-section-header">

                        <div>

                            <h2>
                                My Assigned Tasks
                            </h2>

                            <p>
                                Tasks assigned to your employee
                                account
                            </p>

                        </div>


                        <button
                            className="refresh-button"
                            onClick={loadTasks}
                            title="Refresh tasks"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                width="15"
                                height="15"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M20 11a8 8 0 0 0-15.5-2" />
                                <path d="M4 5v4h4" />
                                <path d="M4 13a8 8 0 0 0 15.5 2" />
                                <path d="M20 19v-4h-4" />
                            </svg>

                            Refresh

                        </button>

                    </div>


                    {/* =================================================
                        FILTER BAR
                    ================================================= */}

                    <div className="task-filter-bar">

                        <div className="task-search">

                            <svg
                                viewBox="0 0 24 24"
                                width="15"
                                height="15"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle
                                    cx="11"
                                    cy="11"
                                    r="7"
                                />

                                <path d="m20 20-4-4" />
                            </svg>

                            <input
                                type="text"
                                placeholder="Search your tasks..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>


                        <select
                            value={priorityFilter}
                            onChange={(e) =>
                                setPriorityFilter(
                                    e.target.value
                                )
                            }
                            className="priority-filter"
                        >

                            <option value="ALL">
                                All Priority
                            </option>

                            <option value="LOW">
                                Low
                            </option>

                            <option value="MEDIUM">
                                Medium
                            </option>

                            <option value="HIGH">
                                High
                            </option>

                            <option value="CRITICAL">
                                Critical
                            </option>

                        </select>


                        <div className="task-count">
                            {filteredTasks.length}{" "}
                            {filteredTasks.length === 1
                                ? "task"
                                : "tasks"}
                        </div>

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading ? (

                        <div className="task-loading">

                            <div className="loading-spinner"></div>

                            <span>
                                Loading your tasks...
                            </span>

                        </div>

                    ) : tasks.length === 0 ? (

                        /* =================================================
                           NO TASKS
                        ================================================= */

                        <div className="no-tasks">

                            <div className="no-task-icon">

                                <svg
                                    viewBox="0 0 24 24"
                                    width="26"
                                    height="26"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <rect
                                        x="4"
                                        y="4"
                                        width="16"
                                        height="16"
                                        rx="2"
                                    />

                                    <path d="M8 9h8M8 13h5" />
                                </svg>

                            </div>

                            <h3>
                                No tasks assigned
                            </h3>

                            <p>
                                You currently have no tasks
                                assigned to you.
                            </p>

                        </div>

                    ) : (

                        /* =================================================
                           KANBAN
                        ================================================= */

                        <div className="kanban-board">

                            {columns.map((column) => {

                                const columnTasks =
                                    getColumnTasks(
                                        column.status
                                    );

                                return (

                                    <div
                                        className={`kanban-column ${column.color}`}
                                        key={column.status}
                                    >

                                        {/* COLUMN HEADER */}

                                        <div className="kanban-column-header">

                                            <div className="column-name">

                                                <span className="column-dot"></span>

                                                <strong>
                                                    {column.title}
                                                </strong>

                                                <span className="column-count">
                                                    {columnTasks.length}
                                                </span>

                                            </div>

                                        </div>


                                        {/* CARDS */}

                                        <div className="kanban-cards">

                                            {columnTasks.length === 0 ? (

                                                <div className="empty-column">
                                                    No tasks
                                                </div>

                                            ) : (

                                                columnTasks.map(
                                                    (task) => (

                                                        <article
                                                            className="kanban-task-card"
                                                            key={task.taskId}
                                                            onClick={() =>
                                                                handleViewTask(
                                                                    task
                                                                )
                                                            }
                                                        >

                                                            {/* TASK CODE */}

                                                            <div className="task-card-top">

                                                                <span className="task-code">
                                                                    TASK-
                                                                    {String(
                                                                        task.taskId
                                                                    ).padStart(
                                                                        3,
                                                                        "0"
                                                                    )}
                                                                </span>


                                                                <span
                                                                    className={`priority-tag ${getPriorityClass(
                                                                        task.taskPriority
                                                                    )}`}
                                                                >
                                                                    {getPriorityLabel(
                                                                        task.taskPriority
                                                                    )}
                                                                </span>

                                                            </div>


                                                            {/* TITLE */}

                                                            <h3>
                                                                {
                                                                    task.taskTitle
                                                                }
                                                            </h3>


                                                            {/* DESCRIPTION */}

                                                            {task.taskDescription && (

                                                                <p>
                                                                    {
                                                                        task.taskDescription
                                                                    }
                                                                </p>

                                                            )}


                                                            {/* REQUIREMENT */}

                                                            {task.requirement
                                                                ?.requirementTitle && (

                                                                <div className="requirement-row">

                                                                    <span>
                                                                        Requirement
                                                                    </span>

                                                                    <strong>
                                                                        {
                                                                            task
                                                                                .requirement
                                                                                .requirementTitle
                                                                        }
                                                                    </strong>

                                                                </div>

                                                            )}


                                                            {/* CARD FOOTER */}

                                                            <div className="task-card-footer">

                                                                <div className="due-date">

                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        width="14"
                                                                        height="14"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="1.8"
                                                                    >
                                                                        <rect
                                                                            x="3"
                                                                            y="4"
                                                                            width="18"
                                                                            height="17"
                                                                            rx="2"
                                                                        />

                                                                        <path d="M16 2v4M8 2v4M3 9h18" />

                                                                    </svg>

                                                                    <span>
                                                                        Due{" "}
                                                                        {formatDate(
                                                                            task.taskDueDate
                                                                        )}
                                                                    </span>

                                                                </div>


                                                                <button
                                                                    className="view-task-button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleViewTask(
                                                                            task
                                                                        );
                                                                    }}
                                                                    title="View task"
                                                                >

                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        width="15"
                                                                        height="15"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="1.8"
                                                                    >
                                                                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />

                                                                        <circle
                                                                            cx="12"
                                                                            cy="12"
                                                                            r="3"
                                                                        />

                                                                    </svg>

                                                                </button>

                                                            </div>

                                                        </article>

                                                    )
                                                )

                                            )}

                                        </div>

                                    </div>

                                );
                            })}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default EmployeeDashboard;