import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function TaskView() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [task, setTask] = useState(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        loadTask();

    }, [id]);


    const loadTask = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(`/tasks/${id}`);

            setTask(response.data);

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


    if (loading) {

        return (
            <div
                style={{
                    padding: "50px",
                    textAlign: "center"
                }}
            >
                Loading task details...
            </div>
        );
    }


    if (!task) {

        return (
            <div
                style={{
                    padding: "50px",
                    textAlign: "center"
                }}
            >
                <strong>
                    Task not found
                </strong>
            </div>
        );
    }


    return (
        <>

            {/* PAGE HEADER */}

            <div className="page-header">

                <div>

                    <h2>
                        Task Details
                    </h2>

                    <p>
                        View complete task information.
                    </p>

                </div>


                <button
                    className="secondary-btn"
                    onClick={() =>
                        navigate("/admin/tasks")
                    }
                >
                    ← Back
                </button>

            </div>


            {/* TASK CARD */}

            <div className="employee-details-card">


                {/* PROFILE HEADER */}

                <div className="employee-profile-header">

                    <div className="employee-avatar">

                        {task.taskTitle
                            ? task.taskTitle
                                .charAt(0)
                                .toUpperCase()
                            : "T"}

                    </div>


                    <div className="employee-profile-info">

                        <h2>
                            {task.taskTitle || "-"}
                        </h2>

                        <p>
                            Task #{task.taskId}
                        </p>

                    </div>


                    <div className="employee-profile-status">

                        <span className="status-badge status-active">

                            {getStatusLabel(
                                task.taskStatus
                            )}

                        </span>

                    </div>

                </div>


                {/* BASIC INFORMATION */}

                <div className="employee-section">

                    <h3>
                        Basic Information
                    </h3>


                    <div className="employee-info-grid">

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Task ID
                            </span>

                            <span className="employee-info-value">
                                {task.taskId || "-"}
                            </span>

                        </div>


                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Task Title
                            </span>

                            <span className="employee-info-value">
                                {task.taskTitle || "-"}
                            </span>

                        </div>


                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Requirement
                            </span>

                            <span className="employee-info-value">
                                {task.requirement
                                    ?.requirementTitle ||
                                    "-"}
                            </span>

                        </div>


                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Priority
                            </span>

                            <span className="employee-info-value">
                                {task.taskPriority || "-"}
                            </span>

                        </div>

                    </div>

                </div>


                {/* DESCRIPTION */}

                <div className="employee-section">

                    <h3>
                        Description
                    </h3>


                    <div className="employee-info-grid">

                        <div
                            className="employee-info-item"
                            style={{
                                gridColumn: "1 / -1"
                            }}
                        >

                            <span className="employee-info-label">
                                Task Description
                            </span>

                            <span className="employee-info-value">
                                {task.taskDescription || "-"}
                            </span>

                        </div>

                    </div>

                </div>


                {/* TASK INFORMATION */}

                <div className="employee-section">

                    <h3>
                        Task Information
                    </h3>


                    <div className="employee-info-grid">

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Status
                            </span>

                            <span className="employee-info-value">

                                {getStatusLabel(
                                    task.taskStatus
                                )}

                            </span>

                        </div>


                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Assigned To
                            </span>

                            <span className="employee-info-value">
                                {task.taskAssignedTo || "-"}
                            </span>

                        </div>


                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Start Date
                            </span>

                            <span className="employee-info-value">
                                {task.taskStartDate || "-"}
                            </span>

                        </div>


                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Due Date
                            </span>

                            <span className="employee-info-value">
                                {task.taskDueDate || "-"}
                            </span>

                        </div>


                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Completed Date
                            </span>

                            <span className="employee-info-value">
                                {task.taskCompletedDate || "-"}
                            </span>

                        </div>

                    </div>

                </div>


                {/* ACTIONS */}

                <div className="employee-section last-section">

                    <div
                        style={{
                            display: "flex",
                            gap: "10px"
                        }}
                    >

                        <button
                            className="secondary-btn"
                            onClick={() =>
                                navigate(
                                    `/admin/tasks/${task.taskId}/edit`
                                )
                            }
                        >
                            Edit Task
                        </button>

                    </div>

                </div>

            </div>

        </>
    );
}

export default TaskView;