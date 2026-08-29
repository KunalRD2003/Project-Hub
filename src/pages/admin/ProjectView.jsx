import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function ProjectView() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [project, setProject] = useState(null);

    const [loading, setLoading] = useState(true);


    /* ==========================
       LOAD PROJECT
    ========================== */

    useEffect(() => {

        loadProject();

    }, [id]);


    const loadProject = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(`/projects/${id}`);

            setProject(response.data);

        } catch (error) {

            console.error(
                "Unable to load project",
                error
            );

            alert(
                error.response?.data ||
                "Unable to load project."
            );

        } finally {

            setLoading(false);
        }
    };


    /* ==========================
       FORMAT DATE
    ========================== */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        try {

            return new Date(date).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        } catch {

            return date;
        }
    };


    /* ==========================
       FORMAT STATUS
    ========================== */

    const formatStatus = (status) => {

        if (!status) {
            return "Unknown";
        }

        return status
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                char => char.toUpperCase()
            );
    };


    /* ==========================
       LOADING
    ========================== */

    if (loading) {

        return (

            <div
                style={{
                    padding: "50px",
                    textAlign: "center"
                }}
            >
                Loading project details...
            </div>

        );
    }


    /* ==========================
       PROJECT NOT FOUND
    ========================== */

    if (!project) {

        return (

            <div
                style={{
                    padding: "50px",
                    textAlign: "center"
                }}
            >

                <strong>
                    Project not found
                </strong>

            </div>

        );
    }


    return (
        <>

            {/* ==========================
                PAGE HEADER
            ========================== */}

            <div className="page-header">

                <div>

                    <h2>
                        Project Details
                    </h2>

                    <p>
                        View complete project information.
                    </p>

                </div>


                <button
                    className="secondary-btn"
                    onClick={() =>
                        navigate("/admin/projects")
                    }
                >
                    ← Back
                </button>

            </div>


            {/* ==========================
                PROJECT PROFILE CARD
            ========================== */}

            <div className="employee-details-card">


                {/* ==========================
                    PROFILE HEADER
                ========================== */}

                <div className="employee-profile-header">


                    {/* PROJECT AVATAR */}

                    <div className="employee-avatar">

                        {project.projectName
                            ? project.projectName
                                .charAt(0)
                                .toUpperCase()
                            : "P"}

                    </div>


                    {/* PROJECT INFO */}

                    <div className="employee-profile-info">

                        <h2>
                            {project.projectName || "-"}
                        </h2>

                        <p>
                            Project #{project.projectId || "-"}
                        </p>

                    </div>


                    {/* STATUS */}

                    <div className="employee-profile-status">

                        <span
                            className={
                                project.projectStatus === "ACTIVE" ||
                                project.projectStatus === "COMPLETED"
                                    ? "status-badge active"
                                    : "status-badge inactive"
                            }
                        >

                            {formatStatus(
                                project.projectStatus
                            )}

                        </span>

                    </div>

                </div>


                {/* ==========================
                    BASIC INFORMATION
                ========================== */}

                <div className="employee-section">

                    <h3>
                        Basic Information
                    </h3>


                    <div className="employee-info-grid">


                        {/* PROJECT ID */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Project ID
                            </span>

                            <span className="employee-info-value">
                                {project.projectId || "-"}
                            </span>

                        </div>


                        {/* PROJECT NAME */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Project Name
                            </span>

                            <span className="employee-info-value">
                                {project.projectName || "-"}
                            </span>

                        </div>


                        {/* STATUS */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Status
                            </span>

                            <span className="employee-info-value">

                                <span
                                    className={
                                        project.projectStatus === "ACTIVE" ||
                                        project.projectStatus === "COMPLETED"
                                            ? "status-badge active"
                                            : "status-badge inactive"
                                    }
                                >

                                    {formatStatus(
                                        project.projectStatus
                                    )}

                                </span>

                            </span>

                        </div>


                        {/* CLIENT */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Client
                            </span>

                            <span className="employee-info-value">
                                {
                                    project.client
                                        ?.clientName || "-"
                                }
                            </span>

                        </div>

                    </div>

                </div>


                {/* ==========================
                    CLIENT INFORMATION
                ========================== */}

                <div className="employee-section">

                    <h3>
                        Client Information
                    </h3>


                    <div className="employee-info-grid">


                        {/* CLIENT ID */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Client ID
                            </span>

                            <span className="employee-info-value">
                                {
                                    project.client
                                        ?.clientId || "-"
                                }
                            </span>

                        </div>


                        {/* CLIENT NAME */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Client Name
                            </span>

                            <span className="employee-info-value">
                                {
                                    project.client
                                        ?.clientName || "-"
                                }
                            </span>

                        </div>

                    </div>

                </div>


                {/* ==========================
                    PROJECT TIMELINE
                ========================== */}

                <div className="employee-section">

                    <h3>
                        Project Timeline
                    </h3>


                    <div className="employee-info-grid">


                        {/* START DATE */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Project Start Date
                            </span>

                            <span className="employee-info-value">
                                {
                                    formatDate(
                                        project.projectStartDate
                                    )
                                }
                            </span>

                        </div>


                        {/* END DATE */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Project End Date
                            </span>

                            <span className="employee-info-value">
                                {
                                    formatDate(
                                        project.projectEndDate
                                    )
                                }
                            </span>

                        </div>

                    </div>

                </div>


                {/* ==========================
                    PROJECT DESCRIPTION
                ========================== */}

                <div className="employee-section">

                    <h3>
                        Project Description
                    </h3>


                    <div
                        style={{
                            marginTop: "15px"
                        }}
                    >

                        <p
                            style={{
                                margin: 0,
                                lineHeight: "1.7",
                                color: "#4b5563",
                                whiteSpace: "pre-wrap"
                            }}
                        >

                            {project.projectDescription ||
                                "No project description available."}

                        </p>

                    </div>

                </div>


                {/* ==========================
                    SYSTEM INFORMATION
                ========================== */}

                <div className="employee-section last-section">

                    <h3>
                        System Information
                    </h3>


                    <div className="employee-info-grid">


                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Project ID
                            </span>

                            <span className="employee-info-value">
                                {project.projectId || "-"}
                            </span>

                        </div>


                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Current Status
                            </span>

                            <span className="employee-info-value">

                                {formatStatus(
                                    project.projectStatus
                                )}

                            </span>

                        </div>

                    </div>

                </div>


            </div>

        </>
    );
}

export default ProjectView;