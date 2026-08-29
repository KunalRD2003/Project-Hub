import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Tasks() {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);

    // =====================================================
    // EDIT MODE
    // =====================================================

    const [editingTaskId, setEditingTaskId] = useState(null);

    const isEditMode =
        editingTaskId !== null;


    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        requirementId: "",
        taskTitle: "",
        taskDescription: "",
        taskPriority: "MEDIUM",
        taskStatus: "PENDING",
        taskAssignedTo: "",
        taskDueDate: "",
        taskCompletedDate: ""
    });


    // =====================================================
    // LOAD TASKS
    // =====================================================

    const loadTasks = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/tasks");

            setTasks(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Unable to load tasks",
                error
            );

            alert(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Unable to load tasks."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD REQUIREMENTS
    // =====================================================

    const loadRequirements = async () => {

        try {

            const response =
                await api.get("/requirements");

            setRequirements(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Unable to load requirements",
                error
            );

            alert(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Unable to load requirements."
            );
        }
    };


    // =====================================================
    // LOAD EMPLOYEES
    // =====================================================

    const loadEmployees = async () => {

        try {

            const response =
                await api.get("/employees");

            setEmployees(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Unable to load employees",
                error
            );

            alert(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Unable to load employees."
            );
        }
    };


    // =====================================================
    // LOAD ALL DATA
    // =====================================================

    useEffect(() => {

        loadTasks();
        loadRequirements();
        loadEmployees();

    }, []);


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));
    };


    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const openAddModal = () => {

        setEditingTaskId(null);

        setFormData({
            requirementId: "",
            taskTitle: "",
            taskDescription: "",
            taskPriority: "MEDIUM",
            taskStatus: "PENDING",
            taskAssignedTo: "",
            taskDueDate: "",
            taskCompletedDate: ""
        });

        setShowModal(true);
    };


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (task) => {

        setEditingTaskId(task.taskId);

        setFormData({
            requirementId:
                task.requirement?.requirementId
                    ? String(
                        task.requirement.requirementId
                    )
                    : "",

            taskTitle:
                task.taskTitle || "",

            taskDescription:
                task.taskDescription || "",

            taskPriority:
                task.taskPriority || "MEDIUM",

            taskStatus:
                task.taskStatus || "PENDING",

            taskAssignedTo:
                task.taskAssignedTo || "",

            taskDueDate:
                task.taskDueDate
                    ? String(
                        task.taskDueDate
                    ).substring(0, 10)
                    : "",

            taskCompletedDate:
                task.taskCompletedDate
                    ? String(
                        task.taskCompletedDate
                    ).substring(0, 10)
                    : ""
        });

        setShowModal(true);
    };


    // =====================================================
    // SAVE TASK
    // CREATE + UPDATE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        // =================================================
        // VALIDATION
        // =================================================

        if (!formData.requirementId) {

            alert(
                "Please select a requirement."
            );

            return;
        }


        if (!formData.taskTitle.trim()) {

            alert(
                "Please enter task title."
            );

            return;
        }


        setSaving(true);


        try {

            const taskData = {

                requirementId:
                    Number(
                        formData.requirementId
                    ),

                taskTitle:
                    formData.taskTitle.trim(),

                taskDescription:
                    formData.taskDescription.trim(),

                taskPriority:
                    formData.taskPriority,

                taskStatus:
                    formData.taskStatus,

                taskAssignedTo:
                    formData.taskAssignedTo || null,

                taskDueDate:
                    formData.taskDueDate || null,

                taskCompletedDate:
                    formData.taskCompletedDate || null
            };


            // =================================================
            // EDIT
            // =================================================

            if (isEditMode) {

                console.log(
                    "Updating task:",
                    editingTaskId,
                    taskData
                );


                await api.put(
                    `/tasks/${editingTaskId}`,
                    taskData
                );


                alert(
                    "Task updated successfully."
                );

            }


            // =================================================
            // CREATE
            // =================================================

            else {

                console.log(
                    "Creating task:",
                    taskData
                );


                await api.post(
                    "/tasks",
                    taskData
                );


                alert(
                    "Task created successfully."
                );
            }


            // =================================================
            // CLOSE + RELOAD
            // =================================================

            closeModal();

            await loadTasks();

        } catch (error) {

            console.error(
                isEditMode
                    ? "Unable to update task"
                    : "Unable to create task",
                error
            );


            let message =
                isEditMode
                    ? "Unable to update task."
                    : "Unable to create task.";


            if (
                typeof error.response?.data ===
                "string"
            ) {

                message =
                    error.response.data;

            } else if (
                error.response?.data?.message
            ) {

                message =
                    error.response.data.message;

            } else if (
                error.message
            ) {

                message =
                    error.message;
            }


            alert(message);

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // DELETE TASK
    // =====================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this task?"
            );


        if (!confirmed) {

            return;
        }


        try {

            await api.delete(
                `/tasks/${id}`
            );


            alert(
                "Task deleted successfully."
            );


            await loadTasks();

        } catch (error) {

            console.error(
                "Unable to delete task",
                error
            );


            alert(
                typeof error.response?.data ===
                    "string"

                    ? error.response.data

                    : "Unable to delete task."
            );
        }
    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        setShowModal(false);

        setEditingTaskId(null);

        setFormData({
            requirementId: "",
            taskTitle: "",
            taskDescription: "",
            taskPriority: "MEDIUM",
            taskStatus: "PENDING",
            taskAssignedTo: "",
            taskDueDate: "",
            taskCompletedDate: ""
        });
    };


    // =====================================================
    // FILTER TASKS
    // =====================================================

    const filteredTasks = useMemo(() => {

        return tasks.filter(task => {

            const keyword =
                search
                    .toLowerCase()
                    .trim();


            const matchesSearch =
                !keyword ||

                task.taskTitle
                    ?.toLowerCase()
                    .includes(keyword) ||

                task.taskDescription
                    ?.toLowerCase()
                    .includes(keyword) ||

                task.taskAssignedTo
                    ?.toLowerCase()
                    .includes(keyword) ||

                task.requirement
                    ?.requirementTitle
                    ?.toLowerCase()
                    .includes(keyword);


            const matchesStatus =
                statusFilter === "All" ||
                task.taskStatus ===
                    statusFilter;


            const matchesPriority =
                priorityFilter === "All" ||
                task.taskPriority ===
                    priorityFilter;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );

        });

    }, [
        tasks,
        search,
        statusFilter,
        priorityFilter
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalTasks =
        tasks.length;


    const pendingTasks =
        tasks.filter(
            task =>
                task.taskStatus ===
                "PENDING"
        ).length;


    const inProgressTasks =
        tasks.filter(
            task =>
                task.taskStatus ===
                "INPROGRESS"
        ).length;


    const completedTasks =
        tasks.filter(
            task =>
                task.taskStatus ===
                "COMPLETED"
        ).length;


    const cancelledTasks =
        tasks.filter(
            task =>
                task.taskStatus ===
                "CANCELLED"
        ).length;


    // =====================================================
    // STATUS LABEL
    // =====================================================

    const getStatusLabel = (status) => {

        switch (status) {

            case "PENDING":
                return "Pending";

            case "INPROGRESS":
                return "In Progress";

            case "COMPLETED":
                return "Completed";

            case "CANCELLED":
                return "Cancelled";

            default:
                return status || "-";
        }
    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        switch (status) {

            case "COMPLETED":
                return "status-active";

            case "INPROGRESS":
                return "status-active";

            case "PENDING":
                return "status-inactive";

            case "CANCELLED":
                return "status-inactive";

            default:
                return "status-inactive";
        }
    };


    // =====================================================
    // PRIORITY CLASS
    // =====================================================

    const getPriorityClass = (priority) => {

        switch (priority) {

            case "CRITICAL":
                return "status-inactive";

            case "HIGH":
                return "status-inactive";

            case "MEDIUM":
                return "status-active";

            case "LOW":
                return "status-active";

            default:
                return "status-inactive";
        }
    };


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <>


            {/* =================================================
                        PAGE HEADER
                ================================================= */}

            <div className="page-header">

                <div>

                    <h2>
                        Task Management
                    </h2>

                    <p>
                        Manage project tasks,
                        assignments and progress.
                    </p>

                </div>


                <button
                    className="primary-btn"
                    onClick={openAddModal}
                >
                    + Add Task
                </button>

            </div>


            {/* =================================================
                        STATISTICS
                ================================================= */}

            <div className="stats-grid">


                {/* TOTAL */}

                <div className="stat-card">

                    <div className="stat-card-title">
                        Total Tasks
                    </div>

                    <div className="stat-card-value">
                        {totalTasks}
                    </div>

                    <div className="stat-card-footer">
                        All tasks
                    </div>

                </div>


                {/* PENDING */}

                <div className="stat-card">

                    <div className="stat-card-title">
                        Pending
                    </div>

                    <div className="stat-card-value">
                        {pendingTasks}
                    </div>

                    <div className="stat-card-footer">
                        Pending tasks
                    </div>

                </div>


                {/* IN PROGRESS */}

                <div className="stat-card">

                    <div className="stat-card-title">
                        In Progress
                    </div>

                    <div className="stat-card-value">
                        {inProgressTasks}
                    </div>

                    <div className="stat-card-footer">
                        Currently working
                    </div>

                </div>


                {/* COMPLETED */}

                <div className="stat-card">

                    <div className="stat-card-title">
                        Completed
                    </div>

                    <div className="stat-card-value">
                        {completedTasks}
                    </div>

                    <div className="stat-card-footer">
                        Completed tasks
                    </div>

                </div>


                {/* CANCELLED */}

                <div className="stat-card">

                    <div className="stat-card-title">
                        Cancelled
                    </div>

                    <div className="stat-card-value">
                        {cancelledTasks}
                    </div>

                    <div className="stat-card-footer">
                        Cancelled tasks
                    </div>

                </div>

            </div>


            {/* =================================================
                        TABLE
                ================================================= */}

            <div className="table-card">


                {/* TOOLBAR */}

                <div className="table-toolbar">


                    {/* SEARCH */}

                    <input
                        className="search-box"
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={event =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />


                    {/* STATUS */}

                    <select
                        className="search-box"
                        value={statusFilter}
                        onChange={event =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Status
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="INPROGRESS">
                            In Progress
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                        <option value="CANCELLED">
                            Cancelled
                        </option>

                    </select>


                    {/* PRIORITY */}

                    <select
                        className="search-box"
                        value={priorityFilter}
                        onChange={event =>
                            setPriorityFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="All">
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

                </div>


                {/* =================================================
                            LOADING
                    ================================================= */}

                {loading ? (

                    <div
                        style={{
                            padding: "50px",
                            textAlign: "center"
                        }}
                    >
                        Loading tasks...
                    </div>

                ) : filteredTasks.length === 0 ? (

                    <div
                        style={{
                            padding: "50px",
                            textAlign: "center"
                        }}
                    >

                        <strong>
                            No tasks found
                        </strong>

                        <p>
                            Try changing your
                            search or add a new task.
                        </p>

                    </div>

                ) : (

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>
                                    Task
                                </th>

                                <th>
                                    Requirement
                                </th>

                                <th>
                                    Priority
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Assigned To
                                </th>

                                <th>
                                    Due Date
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredTasks.map(
                                task => (

                                    <tr
                                        key={
                                            task.taskId
                                        }
                                    >


                                        {/* TASK */}

                                        <td>

                                            <strong>
                                                {
                                                    task.taskTitle
                                                }
                                            </strong>

                                        </td>


                                        {/* REQUIREMENT */}

                                        <td>

                                            {
                                                task.requirement
                                                    ?.requirementTitle ||
                                                "-"
                                            }

                                        </td>


                                        {/* PRIORITY */}

                                        <td>

                                            <span
                                                className={`status-badge ${getPriorityClass(
                                                    task.taskPriority
                                                )}`}
                                            >
                                                {
                                                    task.taskPriority ||
                                                    "-"
                                                }
                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`status-badge ${getStatusClass(
                                                    task.taskStatus
                                                )}`}
                                            >
                                                {
                                                    getStatusLabel(
                                                        task.taskStatus
                                                    )
                                                }
                                            </span>

                                        </td>


                                        {/* ASSIGNED TO */}

                                        <td>

                                            {
                                                task.taskAssignedTo ||
                                                "-"
                                            }

                                        </td>


                                        {/* DUE DATE */}

                                        <td>

                                            {
                                                task.taskDueDate ||
                                                "-"
                                            }

                                        </td>


                                        {/* ACTION */}

                                        <td>

                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    gap:
                                                        "8px"
                                                }}
                                            >

                                                {/* VIEW */}

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/tasks/${task.taskId}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>


                                                {/* EDIT */}

                                                <button
                                                    onClick={() =>
                                                        openEditModal(
                                                            task
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            task.taskId
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>


            {/* =================================================
                        ADD / EDIT MODAL
                ================================================= */}

            {showModal && (

                <div
                    className="modal-overlay"
                    onMouseDown={event => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {

                            closeModal();

                        }

                    }}
                >

                    <div className="modal">


                        {/* =================================================
                                    MODAL HEADER
                            ================================================= */}

                        <div className="modal-header">

                            <div>

                                <h3>

                                    {isEditMode
                                        ? "Edit Task"
                                        : "Create Task"}

                                </h3>

                                <p
                                    style={{
                                        margin:
                                            "5px 0 0",
                                        fontSize:
                                            "12px",
                                        color:
                                            "#6b7280"
                                    }}
                                >

                                    {isEditMode
                                        ? "Update task information."
                                        : "Add a new task to a requirement."}

                                </p>

                            </div>


                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>

                        </div>


                        {/* =================================================
                                    FORM
                            ================================================= */}

                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="modal-body">

                                <div className="form-grid">


                                    {/* REQUIREMENT */}

                                    <div className="form-group">

                                        <label>
                                            Requirement *
                                        </label>

                                        <select
                                            name="requirementId"
                                            value={
                                                formData.requirementId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Select Requirement
                                            </option>

                                            {requirements.map(
                                                requirement => (

                                                    <option
                                                        key={
                                                            requirement.requirementId
                                                        }
                                                        value={
                                                            requirement.requirementId
                                                        }
                                                    >
                                                        {
                                                            requirement.requirementTitle
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {/* TASK TITLE */}

                                    <div className="form-group">

                                        <label>
                                            Task Title *
                                        </label>

                                        <input
                                            type="text"
                                            name="taskTitle"
                                            value={
                                                formData.taskTitle
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter task title"
                                            required
                                        />

                                    </div>


                                    {/* PRIORITY */}

                                    <div className="form-group">

                                        <label>
                                            Priority *
                                        </label>

                                        <select
                                            name="taskPriority"
                                            value={
                                                formData.taskPriority
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

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

                                    </div>


                                    {/* STATUS */}

                                    <div className="form-group">

                                        <label>
                                            Status *
                                        </label>

                                        <select
                                            name="taskStatus"
                                            value={
                                                formData.taskStatus
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="PENDING">
                                                Pending
                                            </option>

                                            <option value="INPROGRESS">
                                                In Progress
                                            </option>

                                            <option value="COMPLETED">
                                                Completed
                                            </option>

                                            <option value="CANCELLED">
                                                Cancelled
                                            </option>

                                        </select>

                                    </div>


                                    {/* ASSIGNED TO */}

                                    <div className="form-group">

                                        <label>
                                            Assigned To
                                        </label>

                                        <select
                                            name="taskAssignedTo"
                                            value={
                                                formData.taskAssignedTo
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >

                                            <option value="">
                                                Select Employee
                                            </option>

                                            {employees.map(
                                                employee => (

                                                    <option
                                                        key={
                                                            employee.employeeId
                                                        }
                                                        value={
                                                            employee.employeeUsername
                                                        }
                                                    >
                                                        {
                                                            employee.employeeName
                                                        }
                                                        {" ("}
                                                        {
                                                            employee.employeeUsername
                                                        }
                                                        {")"}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                        <small
                                            style={{
                                                color:
                                                    "#6b7280",
                                                fontSize:
                                                    "11px"
                                            }}
                                        >
                                            Optional
                                        </small>

                                    </div>


                                    {/* DUE DATE */}

                                    <div className="form-group">

                                        <label>
                                            Due Date
                                        </label>

                                        <input
                                            type="date"
                                            name="taskDueDate"
                                            value={
                                                formData.taskDueDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            onClick={
                                                event => {
                                                    event.target
                                                        .showPicker?.();
                                                }
                                            }
                                        />

                                        <small
                                            style={{
                                                color:
                                                    "#6b7280",
                                                fontSize:
                                                    "11px"
                                            }}
                                        >
                                            Optional
                                        </small>

                                    </div>


                                    {/* COMPLETED DATE */}

                                    <div className="form-group">

                                        <label>
                                            Completed Date
                                        </label>

                                        <input
                                            type="date"
                                            name="taskCompletedDate"
                                            value={
                                                formData.taskCompletedDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            onClick={
                                                event => {
                                                    event.target
                                                        .showPicker?.();
                                                }
                                            }
                                        />

                                        <small
                                            style={{
                                                color:
                                                    "#6b7280",
                                                fontSize:
                                                    "11px"
                                            }}
                                        >
                                            Optional
                                        </small>

                                    </div>


                                    {/* DESCRIPTION */}

                                    <div
                                        className="form-group"
                                        style={{
                                            gridColumn:
                                                "1 / -1"
                                        }}
                                    >

                                        <label>
                                            Description
                                        </label>

                                        <textarea
                                            name="taskDescription"
                                            value={
                                                formData.taskDescription
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter task description"
                                            rows="4"
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                        MODAL FOOTER
                                ================================================= */}

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-btn"
                                    disabled={saving}
                                >

                                    {saving

                                        ? isEditMode
                                            ? "Updating..."
                                            : "Creating..."

                                        : isEditMode
                                            ? "Update Task"
                                            : "Create Task"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </>
    );
}

export default Tasks;