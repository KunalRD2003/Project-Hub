import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function AdminDashboard() {

    // =====================================================
    // STATE
    // =====================================================

    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [modules, setModules] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [taskFilter, setTaskFilter] = useState("All");

    const [responsibleFilter, setResponsibleFilter] =
        useState("All");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [period, setPeriod] = useState("30");

    const [progressFilter, setProgressFilter] =
        useState("All");


    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        loadDashboardData();

    }, []);


    const loadDashboardData = async () => {

        setLoading(true);

        const results = await Promise.allSettled([
            api.get("/tasks"),
            api.get("/projects"),
            api.get("/employees"),
            api.get("/modules")
        ]);

        const [
            taskResult,
            projectResult,
            employeeResult,
            moduleResult
        ] = results;


        // TASKS
        if (taskResult.status === "fulfilled") {

            setTasks(
                Array.isArray(taskResult.value.data)
                    ? taskResult.value.data
                    : []
            );

        } else {

            console.error(
                "Unable to load tasks:",
                taskResult.reason
            );

            setTasks([]);

        }


        // PROJECTS
        if (projectResult.status === "fulfilled") {

            setProjects(
                Array.isArray(projectResult.value.data)
                    ? projectResult.value.data
                    : []
            );

        } else {

            console.error(
                "Unable to load projects:",
                projectResult.reason
            );

            setProjects([]);

        }


        // EMPLOYEES
        if (employeeResult.status === "fulfilled") {

            setEmployees(
                Array.isArray(employeeResult.value.data)
                    ? employeeResult.value.data
                    : []
            );

        } else {

            console.error(
                "Unable to load employees:",
                employeeResult.reason
            );

            setEmployees([]);

        }


        // MODULES
        if (moduleResult.status === "fulfilled") {

            setModules(
                Array.isArray(moduleResult.value.data)
                    ? moduleResult.value.data
                    : []
            );

        } else {

            console.error(
                "Unable to load modules:",
                moduleResult.reason
            );

            setModules([]);

        }


        setLoading(false);

    };


    // =====================================================
    // PROJECT NAME
    // =====================================================

    const getProjectName = (task) => {

        if (task.project) {

            return (
                task.project.projectName ??
                task.project.name ??
                task.project.projectTitle ??
                task.project.title ??
                "Not assigned"
            );

        }


        if (task.projectName) {
            return task.projectName;
        }


        if (task.projectTitle) {
            return task.projectTitle;
        }


        if (task.requirement) {

            if (task.requirement.project) {

                return (
                    task.requirement.project.projectName ??
                    task.requirement.project.name ??
                    task.requirement.project.projectTitle ??
                    task.requirement.project.title ??
                    "Not assigned"
                );

            }


            if (task.requirement.projectName) {
                return task.requirement.projectName;
            }


            if (task.requirement.projectTitle) {
                return task.requirement.projectTitle;
            }

        }


        const projectId =
            task.projectId ??
            task.requirement?.projectId;


        if (projectId) {

            const project = projects.find(
                item =>
                    String(
                        item.projectId ??
                        item.id
                    ) === String(projectId)
            );


            if (project) {

                return (
                    project.projectName ??
                    project.name ??
                    project.projectTitle ??
                    project.title ??
                    "Not assigned"
                );

            }

        }


        return "Not assigned";

    };


    // =====================================================
    // RESPONSIBLE PERSON
    // =====================================================

    const getResponsiblePerson = (task) => {

        if (
            typeof task.taskAssignedTo === "string" &&
            task.taskAssignedTo.trim()
        ) {

            const username =
                task.taskAssignedTo.trim();


            const employee = employees.find(
                item =>
                    String(
                        item.employeeUsername
                    ).toLowerCase() ===
                    username.toLowerCase()
            );


            if (employee) {

                return (
                    employee.employeeName ??
                    employee.employeeUsername ??
                    username
                );

            }


            return username;

        }


        if (
            task.taskAssignedTo &&
            typeof task.taskAssignedTo === "object"
        ) {

            return (
                task.taskAssignedTo.employeeName ??
                task.taskAssignedTo.employeeUsername ??
                task.taskAssignedTo.name ??
                "Not assigned"
            );

        }


        if (task.assignedTo) {

            if (
                typeof task.assignedTo === "string"
            ) {

                return task.assignedTo;

            }


            return (
                task.assignedTo.employeeName ??
                task.assignedTo.employeeUsername ??
                task.assignedTo.name ??
                "Not assigned"
            );

        }


        if (task.employeeName) {
            return task.employeeName;
        }


        return "Not assigned";

    };


    // =====================================================
    // TASK STATUS
    // =====================================================

    const getStatusLabel = (status) => {

        switch (
            String(status || "").toUpperCase()
        ) {

            case "COMPLETED":
                return "Completed";

            case "INPROGRESS":
            case "IN_PROGRESS":
            case "IN PROGRESS":
                return "In Progress";

            case "PENDING":
                return "Pending";

            case "CANCELLED":
                return "Cancelled";

            default:
                return status || "Pending";

        }

    };


    // =====================================================
    // TASK PROGRESS
    // =====================================================

    const getTaskProgress = (task) => {

        const directProgress =
            task.taskProgress ??
            task.progress ??
            task.completionPercentage ??
            task.percentage;


        if (
            directProgress !== undefined &&
            directProgress !== null &&
            !Number.isNaN(Number(directProgress))
        ) {

            return Math.min(
                100,
                Math.max(
                    0,
                    Number(directProgress)
                )
            );

        }


        const status =
            String(
                task.taskStatus || ""
            ).toUpperCase();


        switch (status) {

            case "COMPLETED":
                return 100;

            case "INPROGRESS":
            case "IN_PROGRESS":
            case "IN PROGRESS":
                return 50;

            case "PENDING":
                return 0;

            case "CANCELLED":
                return 0;

            default:
                return 0;

        }

    };


    // =====================================================
    // TASK DATE
    // =====================================================
    // Priority:
    // 1. Created date
    // 2. Task date
    // 3. Due date
    //
    // This makes the Last 30 days filter work even when
    // your API does not have the same field names everywhere.
    // =====================================================

    const getTaskDate = (task) => {

        return (
            task.taskCreatedAt ??
            task.createdAt ??
            task.taskDate ??
            task.date ??
            task.taskDueDate ??
            task.dueDate ??
            null
        );

    };


    // =====================================================
    // NORMALIZED TASKS
    // =====================================================

    const dashboardTasks = useMemo(() => {

        return tasks.map(task => ({

            original: task,

            id:
                task.taskId ??
                task.id,

            title:
                task.taskTitle ??
                task.title ??
                "Untitled task",

            project:
                getProjectName(task),

            responsible:
                getResponsiblePerson(task),

            dueDate:
                task.taskDueDate ??
                task.dueDate ??
                null,

            taskDate:
                getTaskDate(task),

            status:
                getStatusLabel(
                    task.taskStatus
                ),

            progress:
                getTaskProgress(task)

        }));

    }, [
        tasks,
        projects,
        employees
    ]);


    // =====================================================
    // DATE PARSER
    // =====================================================

    const getDateOnly = (value) => {

        if (!value) {
            return null;
        }


        const date = new Date(value);


        if (Number.isNaN(date.getTime())) {
            return null;
        }


        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

    };


    // =====================================================
    // DAYS FILTER
    // =====================================================

    const dateFilteredTasks = useMemo(() => {

        // All dates
        if (period === "all") {

            return dashboardTasks;

        }


        const days = Number(period);

        const today = new Date();

        const endDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );


        const startDate = new Date(endDate);

        startDate.setDate(
            startDate.getDate() - days + 1
        );


        return dashboardTasks.filter(task => {

            const taskDate =
                getDateOnly(task.taskDate);


            if (!taskDate) {
                return false;
            }


            return (
                taskDate >= startDate &&
                taskDate <= endDate
            );

        });

    }, [
        dashboardTasks,
        period
    ]);


    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "—";
        }


        const date =
            new Date(dateValue);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(
                dateValue
            );

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // TOTAL COUNTS
    // =====================================================

    const totalModules =
        modules.length;

    const totalProjects =
        projects.length;

    // IMPORTANT:
    // This is now based on selected date range.
    const totalTasks =
        dateFilteredTasks.length;

    const totalEmployees =
        employees.length;


    // =====================================================
    // SEARCH + FILTER TASKS
    // =====================================================

    const filteredTasks = useMemo(() => {

        return dateFilteredTasks.filter(task => {

            const searchText =
                search.trim().toLowerCase();


            // SEARCH
            const searchMatch =
                !searchText ||

                task.title
                    .toLowerCase()
                    .includes(searchText) ||

                task.project
                    .toLowerCase()
                    .includes(searchText) ||

                task.responsible
                    .toLowerCase()
                    .includes(searchText) ||

                task.status
                    .toLowerCase()
                    .includes(searchText);


            // TASK FILTER
            const taskMatch =
                taskFilter === "All" ||
                task.title === taskFilter;


            // RESPONSIBLE FILTER
            const responsibleMatch =
                responsibleFilter === "All" ||
                task.responsible ===
                    responsibleFilter;


            // STATUS FILTER
            const statusMatch =
                statusFilter === "All" ||
                task.status === statusFilter;


            return (
                searchMatch &&
                taskMatch &&
                responsibleMatch &&
                statusMatch
            );

        });

    }, [
        dateFilteredTasks,
        search,
        taskFilter,
        responsibleFilter,
        statusFilter
    ]);


    // =====================================================
    // SHOW ONLY 5 TASKS
    // =====================================================

    const visibleTasks =
        filteredTasks.slice(0, 5);


    // =====================================================
    // STATUS OPTIONS
    // =====================================================

    const taskOptions = [
        ...new Set(
            dateFilteredTasks.map(
                task => task.title
            )
        )
    ];


    const responsibleOptions = [
        ...new Set(
            dateFilteredTasks.map(
                task => task.responsible
            )
        )
    ];


    const statusOptions = [
        ...new Set(
            dateFilteredTasks.map(
                task => task.status
            )
        )
    ];


    // =====================================================
    // STATUS STATISTICS
    // =====================================================

    const completedTasks =
        dateFilteredTasks.filter(
            task =>
                task.status === "Completed"
        ).length;


    const inProgressTasks =
        dateFilteredTasks.filter(
            task =>
                task.status === "In Progress"
        ).length;


    const pendingTasks =
        dateFilteredTasks.filter(
            task =>
                task.status === "Pending"
        ).length;


    // =====================================================
    // OVERALL PROGRESS
    // =====================================================

    const overallProgress =
        dateFilteredTasks.length > 0

            ? Math.round(
                dateFilteredTasks.reduce(
                    (total, task) =>
                        total + task.progress,
                    0
                ) /
                dateFilteredTasks.length
            )

            : 0;


    // =====================================================
    // SELECTED PROGRESS STATUS
    // =====================================================

    const progressTasks = useMemo(() => {

        if (progressFilter === "All") {
            return dateFilteredTasks;
        }


        return dateFilteredTasks.filter(
            task =>
                task.status ===
                progressFilter
        );

    }, [
        dateFilteredTasks,
        progressFilter
    ]);


    // =====================================================
    // SELECTED PROGRESS VALUE
    // =====================================================

    const selectedProgress = useMemo(() => {

        if (progressFilter === "All") {

            return overallProgress;

        }


        if (progressTasks.length === 0) {

            return 0;

        }


        return Math.round(
            progressTasks.reduce(
                (total, task) =>
                    total + task.progress,
                0
            ) /
            progressTasks.length
        );

    }, [
        progressFilter,
        progressTasks,
        overallProgress
    ]);


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="dashboard-page">


            {/* =================================================
                DASHBOARD TOP
            ================================================= */}

            <div className="dashboard-topbar">

                <h1>
                    Dashboard
                </h1>


                <div className="dashboard-top-actions">

                    <div className="dashboard-search">

                        <span>
                            ⌕
                        </span>

                        <input
                            type="text"
                            value={search}
                            onChange={event =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search for anything..."
                        />

                    </div>


                    <button
                        className="notification-button"
                        type="button"
                    >
                        ♧
                    </button>


                    <div className="admin-profile">

                        <div className="admin-avatar">
                            A
                        </div>

                        <div>

                            <strong>
                                System Admin
                            </strong>

                            <span>
                                Administrator
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                OVERVIEW
            ================================================= */}

            <div className="overview-row">

                <h2>
                    Overview
                </h2>


                <select
                    className="period-select"
                    value={period}
                    onChange={event => {

                        setPeriod(
                            event.target.value
                        );

                        // Reset task filters when
                        // date range changes.
                        setTaskFilter("All");
                        setResponsibleFilter("All");
                        setStatusFilter("All");

                    }}
                >

                    <option value="30">
                        Last 30 days
                    </option>

                    <option value="7">
                        Last 7 days
                    </option>

                    <option value="90">
                        Last 90 days
                    </option>

                    <option value="all">
                        All time
                    </option>

                </select>

            </div>


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="dashboard-stats">


                {/* MODULES */}

                <div className="dashboard-stat-card revenue-card">

                    <div className="stat-icon">
                        ▦
                    </div>


                    <div className="stat-card-content">

                        <span>
                            Modules
                        </span>

                        <strong>
                            {
                                loading
                                    ? "—"
                                    : totalModules
                            }
                        </strong>

                        <small>
                            Organization modules
                        </small>

                    </div>

                </div>


                {/* PROJECTS */}

                <div className="dashboard-stat-card projects-card">

                    <div className="stat-icon">
                        ▣
                    </div>


                    <div className="stat-card-content">

                        <span>
                            Projects
                        </span>

                        <strong>
                            {
                                loading
                                    ? "—"
                                    : totalProjects
                            }
                        </strong>

                        <small>
                            Organization projects
                        </small>

                    </div>

                </div>


                {/* TASKS */}

                <div className="dashboard-stat-card tasks-card">

                    <div className="stat-icon">
                        ◷
                    </div>


                    <div className="stat-card-content">

                        <span>
                            Tasks
                        </span>

                        <strong>
                            {
                                loading
                                    ? "—"
                                    : totalTasks
                            }
                        </strong>

                        <small>
                            {completedTasks} completed
                        </small>

                    </div>

                </div>


                {/* RESOURCES */}

                <div className="dashboard-stat-card resources-card">

                    <div className="stat-icon">
                        ♙
                    </div>


                    <div className="stat-card-content">

                        <span>
                            Resources
                        </span>

                        <strong>
                            {
                                loading
                                    ? "—"
                                    : totalEmployees
                            }
                        </strong>

                        <small>
                            Active resources
                        </small>

                    </div>

                </div>

            </div>


            {/* =================================================
                MAIN GRID
            ================================================= */}

            <div className="dashboard-content-grid">


                {/* =================================================
                    TASK SUMMARY
                ================================================= */}

                <div className="task-summary-card">


                    <div className="task-summary-heading">

                        <div>

                            <span className="section-label">
                                Task Summary
                            </span>

                            <h2>
                                Overview of assigned tasks
                            </h2>

                        </div>


                        <div className="task-filters">


                            {/* TASK FILTER */}

                            <select
                                value={taskFilter}
                                onChange={event =>
                                    setTaskFilter(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="All">
                                    Task
                                </option>

                                {taskOptions.map(task => (

                                    <option
                                        key={task}
                                        value={task}
                                    >
                                        {task}
                                    </option>

                                ))}

                            </select>


                            {/* RESPONSIBLE FILTER */}

                            <select
                                value={
                                    responsibleFilter
                                }
                                onChange={event =>
                                    setResponsibleFilter(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="All">
                                    Responsible person
                                </option>

                                {responsibleOptions.map(
                                    person => (

                                        <option
                                            key={person}
                                            value={person}
                                        >
                                            {person}
                                        </option>

                                    )
                                )}

                            </select>


                            {/* STATUS FILTER */}

                            <select
                                value={statusFilter}
                                onChange={event =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="All">
                                    Status
                                </option>

                                {statusOptions.map(
                                    status => (

                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="task-table-container">

                        {loading ? (

                            <div className="dashboard-loading">
                                Loading tasks...
                            </div>

                        ) : visibleTasks.length === 0 ? (

                            <div className="dashboard-loading">
                                No tasks found for the selected period.
                            </div>

                        ) : (

                            <table className="task-summary-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Task
                                        </th>

                                        <th>
                                            Responsible person
                                        </th>

                                        <th>
                                            Due date
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Progress
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {visibleTasks.map(task => (

                                        <tr
                                            key={task.id}
                                        >

                                            <td className="task-name-cell">
                                                {task.title}
                                            </td>


                                            <td>

                                                <div className="responsible-person">

                                                    <div className="person-avatar">

                                                        {
                                                            task.responsible !==
                                                            "Not assigned"
                                                                ? task.responsible
                                                                    .charAt(0)
                                                                    .toUpperCase()
                                                                : "?"
                                                        }

                                                    </div>

                                                    <span>
                                                        {task.responsible}
                                                    </span>

                                                </div>

                                            </td>


                                            <td>
                                                {
                                                    formatDate(
                                                        task.dueDate
                                                    )
                                                }
                                            </td>


                                            <td>

                                                <span
                                                    className={`task-status-badge ${
                                                        task.status
                                                            .toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "-"
                                                            )
                                                    }`}
                                                >
                                                    {task.status}
                                                </span>

                                            </td>


                                            <td>

                                                <div className="table-progress">

                                                    <div className="table-progress-track">

                                                        <div
                                                            className="table-progress-fill"
                                                            style={{
                                                                width:
                                                                    `${task.progress}%`
                                                            }}
                                                        />

                                                    </div>

                                                    <span>
                                                        {task.progress}%
                                                    </span>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        )}

                    </div>

                </div>


                {/* =================================================
                    OVERALL PROGRESS
                ================================================= */}

                <div className="overall-progress-card">


                    <div className="overall-progress-header">

                        <h3>
                            Overall Progress
                        </h3>


                        <select
                            value={progressFilter}
                            onChange={event =>
                                setProgressFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="All">
                                All
                            </option>

                            <option value="Completed">
                                Completed
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                        </select>

                    </div>


                    {/* GAUGE */}

                    <div className="gauge-container">

                        <svg
                            className="progress-gauge-svg"
                            viewBox="0 0 220 125"
                        >

                            <path
                                className="gauge-background"
                                d="M 25 110 A 85 85 0 0 1 195 110"
                                pathLength="100"
                            />


                            <path
                                className="gauge-progress"
                                d="M 25 110 A 85 85 0 0 1 195 110"
                                pathLength="100"
                                style={{
                                    strokeDasharray:
                                        `${selectedProgress} 100`
                                }}
                            />

                        </svg>


                        <div className="gauge-value">

                            <strong>
                                {
                                    loading
                                        ? "—"
                                        : `${selectedProgress}%`
                                }
                            </strong>

                            <span>
                                {
                                    progressFilter === "All"
                                        ? "Completed"
                                        : progressFilter
                                }
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        STATUS SUMMARY
                    ================================================= */}

                    <div className="progress-summary">


                        <div>

                            <strong>
                                {totalTasks}
                            </strong>

                            <span>
                                Total
                            </span>

                        </div>


                        <div>

                            <strong className="progress-green">
                                {completedTasks}
                            </strong>

                            <span>
                                Completed
                            </span>

                        </div>


                        <div>

                            <strong className="progress-yellow">
                                {inProgressTasks}
                            </strong>

                            <span>
                                In progress
                            </span>

                        </div>


                        <div>

                            <strong className="progress-red">
                                {pendingTasks}
                            </strong>

                            <span>
                                Pending
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;