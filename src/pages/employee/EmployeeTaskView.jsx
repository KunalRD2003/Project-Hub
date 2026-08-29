import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function EmployeeTaskView() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [task, setTask] = useState(null);

    const [status, setStatus] = useState("PENDING");

    const [completedDate, setCompletedDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    // =====================================================
    // GET TODAY'S DATE
    // =====================================================

    const getTodayDate = () => {

        const today = new Date();

        const year = today.getFullYear();

        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            today.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    // =====================================================
    // FORMAT DATE FOR INPUT
    // =====================================================

    const formatDateForInput = (date) => {

        if (!date) {
            return "";
        }

        // If backend already sends YYYY-MM-DD
        if (
            typeof date === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(date)
        ) {
            return date;
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "";
        }

        const year = parsedDate.getFullYear();

        const month = String(
            parsedDate.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            parsedDate.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    // =====================================================
    // LOAD TASK
    // =====================================================

    const loadTask = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(`/tasks/${id}`);

            const data = response.data;

            setTask(data);

            const currentStatus =
                data.taskStatus || "PENDING";

            setStatus(currentStatus);


            // ---------------------------------------------
            // COMPLETED DATE
            // ---------------------------------------------

            if (data.taskCompletedDate) {

                setCompletedDate(
                    formatDateForInput(
                        data.taskCompletedDate
                    )
                );

            } else if (
                currentStatus === "COMPLETED"
            ) {

                setCompletedDate(
                    getTodayDate()
                );

            } else {

                setCompletedDate("");

            }

        } catch (error) {

            console.error(
                "Unable to load task",
                error
            );

            alert(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Unable to load task."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadTask();

    }, [id]);


    // =====================================================
    // STATUS CHANGE
    // =====================================================

    const handleStatusChange = (event) => {

        const newStatus =
            event.target.value;


        // ---------------------------------------------
        // COMPLETED
        // ---------------------------------------------

        if (newStatus === "COMPLETED") {

            setStatus("COMPLETED");

            // Automatically set today's date
            if (!completedDate) {

                setCompletedDate(
                    getTodayDate()
                );

            }

            return;
        }


        // ---------------------------------------------
        // OTHER STATUS
        // ---------------------------------------------

        setStatus(newStatus);

        // Clear completed date if task
        // is no longer completed
        setCompletedDate("");
    };


    // =====================================================
    // COMPLETED DATE CHANGE
    // =====================================================

    const handleCompletedDateChange = (event) => {

        setCompletedDate(
            event.target.value
        );
    };


    // =====================================================
    // IS TASK ALREADY COMPLETED?
    // =====================================================

    const isTaskCompleted =
        task?.taskStatus === "COMPLETED";


    // =====================================================
    // UPDATE TASK
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setSaving(true);

        try {

            /*
             * If task was already completed,
             * status MUST remain COMPLETED.
             *
             * Employee can only change
             * completed date.
             */

            const finalStatus =
                isTaskCompleted
                    ? "COMPLETED"
                    : status;


            const taskData = {

                requirementId:
                    task.requirement?.requirementId ||
                    task.requirementId,

                taskTitle:
                    task.taskTitle,

                taskDescription:
                    task.taskDescription,

                taskPriority:
                    task.taskPriority,

                taskStatus:
                    finalStatus,

                taskAssignedTo:
                    task.taskAssignedTo || null,

                taskDueDate:
                    task.taskDueDate || null,

                taskCompletedDate:
                    finalStatus === "COMPLETED"
                        ? completedDate || null
                        : null
            };


            await api.put(
                `/tasks/${id}`,
                taskData
            );


            alert(
                finalStatus === "COMPLETED"
                    ? "Task completed successfully."
                    : "Task status updated successfully."
            );


            navigate(
                "/employee/dashboard"
            );

        } catch (error) {

            console.error(
                "Unable to update task",
                error
            );

            alert(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Unable to update task."
            );

        } finally {

            setSaving(false);

        }
    };


    // =====================================================
    // STATUS LABEL
    // =====================================================

    const getStatusLabel = (value) => {

        switch (value) {

            case "PENDING":
                return "Pending";

            case "INPROGRESS":
                return "In Progress";

            case "COMPLETED":
                return "Completed";

            case "CANCELLED":
                return "Cancelled";

            default:
                return value || "-";
        }
    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (value) => {

        switch (value) {

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

    const getPriorityClass = (value) => {

        switch (value) {

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
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="page-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading task...
                </p>

            </div>

        );
    }


    // =====================================================
    // TASK NOT FOUND
    // =====================================================

    if (!task) {

        return (

            <div className="empty-state">

                <h3>
                    Task not found
                </h3>

                <p>
                    The requested task could not be found.
                </p>

                <button
                    className="secondary-btn"
                    onClick={() =>
                        navigate(
                            "/employee/dashboard"
                        )
                    }
                >
                    ← Back to Tasks
                </button>

            </div>

        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="edit-page">


            {/* =================================================
                        PAGE HEADER
                ================================================= */}

            <div className="page-header">

                <div>

                    <h2>
                        Task Details
                    </h2>

                    <p>
                        Review your task and update its status.
                    </p>

                </div>


                <button
                    type="button"
                    className="secondary-btn"
                    onClick={() =>
                        navigate(
                            "/employee/dashboard"
                        )
                    }
                >
                    ← Back to Tasks
                </button>

            </div>


            {/* =================================================
                        EDIT CARD
                ================================================= */}

            <div className="edit-card">


                {/* =================================================
                            CARD HEADER
                    ================================================= */}

                <div className="edit-card-header">

                    <div>

                        <span className="edit-card-label">
                            TASK
                        </span>

                        <h3>
                            {task.taskTitle || "Task"}
                        </h3>

                        <p>
                            {task.requirement
                                ?.requirementTitle ||
                                task.requirementTitle ||
                                "Task Information"}
                        </p>

                    </div>


                    <div className="edit-card-header-right">

                        <span className="task-id-badge">
                            Task ID: {task.taskId}
                        </span>

                        <span
                            className={`status-badge ${getStatusClass(
                                task.taskStatus
                            )}`}
                        >
                            {getStatusLabel(
                                task.taskStatus
                            )}
                        </span>

                    </div>

                </div>


                {/* =================================================
                            FORM
                    ================================================= */}

                <form
                    onSubmit={handleSubmit}
                >


                    <div className="edit-card-body">


                        {/* =================================================
                                    SECTION HEADER
                            ================================================= */}

                        <div className="edit-section-header">

                            <h3>
                                Task Information
                            </h3>

                            <p>
                                Basic information about your assigned task.
                            </p>

                        </div>


                        <div className="form-grid">


                            {/* =================================================
                                        TASK ID
                                ================================================= */}

                            <div className="form-group">

                                <label>
                                    Task ID
                                </label>

                                <input
                                    type="text"
                                    value={
                                        task.taskId || ""
                                    }
                                    readOnly
                                />

                            </div>


                            {/* =================================================
                                        REQUIREMENT
                                ================================================= */}

                            <div className="form-group">

                                <label>
                                    Requirement
                                </label>

                                <input
                                    type="text"
                                    value={
                                        task.requirement
                                            ?.requirementTitle ||
                                        task.requirementTitle ||
                                        "-"
                                    }
                                    readOnly
                                />

                            </div>


                            {/* =================================================
                                        TASK TITLE
                                ================================================= */}

                            <div className="form-group">

                                <label>
                                    Task Title
                                </label>

                                <input
                                    type="text"
                                    value={
                                        task.taskTitle || ""
                                    }
                                    readOnly
                                />

                            </div>


                            {/* =================================================
                                        PRIORITY
                                ================================================= */}

                            <div className="form-group">

                                <label>
                                    Priority
                                </label>

                                <div className="priority-display">
                                    {task.taskPriority || "-"}
                                </div>

                            </div>

                            {/* =================================================
                                        ASSIGNED TO
                                ================================================= */}

                            <div className="form-group">

                                <label>
                                    Assigned To
                                </label>

                                <input
                                    type="text"
                                    value={
                                        task.taskAssignedTo || "-"
                                    }
                                    readOnly
                                />

                            </div>


                            {/* =================================================
                                        DUE DATE
                                ================================================= */}

                            <div className="form-group">

                                <label>
                                    Due Date
                                </label>

                                <input
                                    type="text"
                                    value={
                                        task.taskDueDate || "-"
                                    }
                                    readOnly
                                />

                            </div>


                            {/* =================================================
                                        STATUS
                                ================================================= */}

                            <div className="form-group">

                                <label>
                                    Status
                                    <span>*</span>
                                </label>

                                <select
                                    value={status}
                                    onChange={
                                        handleStatusChange
                                    }
                                    disabled={
                                        isTaskCompleted
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


                                {isTaskCompleted ? (

                                    <small className="completed-help">
                                        This task has been completed.
                                        Its status can no longer be changed.
                                    </small>

                                ) : (

                                    <small>
                                        Update the current task status.
                                    </small>

                                )}

                            </div>


                            {/* =================================================
                                        COMPLETED DATE
                                ================================================= */}

                            <div className="form-group">

                                <label>
                                    Completed Date

                                    {status === "COMPLETED" && (
                                        <span className="required-mark">*</span>
                                    )}
                                </label>

                                <div className="date-input-wrapper">

                                    <input
                                        type="date"
                                        value={completedDate}
                                        onChange={handleCompletedDateChange}
                                        disabled={status !== "COMPLETED"}
                                        required={status === "COMPLETED"}
                                        className="completed-date-input"
                                        onClick={(e) => {
                                            if (
                                                status === "COMPLETED" &&
                                                e.target.showPicker
                                            ) {
                                                e.target.showPicker();
                                            }
                                        }}
                                    />

                                </div>

                                {isTaskCompleted ? (

                                    <small>
                                        You can update the completed date.
                                    </small>

                                ) : status === "COMPLETED" ? (

                                    <small>
                                        Select the date when you completed the task.
                                    </small>

                                ) : (

                                    <small>
                                        Available after marking the task as completed.
                                    </small>

                                )}

                            </div>
                            {/* =================================================
                                        DESCRIPTION
                                ================================================= */}

                            <div className="form-group form-group-full">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={
                                        task.taskDescription || ""
                                    }
                                    readOnly
                                    rows="5"
                                />

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                                FOOTER
                        ================================================= */}

                    <div className="edit-card-footer">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() =>
                                navigate(
                                    "/employee/dashboard"
                                )
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : isTaskCompleted
                                    ? "Update Completed Date"
                                    : "Update Status"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EmployeeTaskView;