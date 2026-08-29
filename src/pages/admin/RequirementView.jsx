import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function RequirementView() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [requirement, setRequirement] = useState(null);

    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD REQUIREMENT
    // =====================================================

    const loadRequirement = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(`/requirements/${id}`);

            setRequirement(response.data);

        } catch (error) {

            console.error(
                "Unable to load requirement",
                error
            );

            alert(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Unable to load requirement."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadRequirement();

    }, [id]);


    // =====================================================
    // STATUS LABEL
    // =====================================================

    const getStatusLabel = (status) => {

        switch (status) {

            case "NEW":
                return "New";

            case "INPROGRESS":
                return "In Progress";

            case "COMPLETED":
                return "Completed";

            case "REJECTED":
                return "Rejected";

            default:
                return status || "-";
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
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        switch (status) {

            case "COMPLETED":
                return "status-active";

            case "INPROGRESS":
                return "status-active";

            case "NEW":
                return "status-inactive";

            case "REJECTED":
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
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div
                style={{
                    padding: "50px",
                    textAlign: "center"
                }}
            >

                Loading requirement details...

            </div>

        );
    }


    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!requirement) {

        return (

            <div
                style={{
                    padding: "50px",
                    textAlign: "center"
                }}
            >

                <strong>
                    Requirement not found
                </strong>

            </div>

        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <>

            {/* =================================================
                        PAGE HEADER
                ================================================= */}

            <div className="page-header">

                <div>

                    <h2>
                        Requirement Details
                    </h2>

                    <p>
                        View complete requirement information.
                    </p>

                </div>


                <div
                    style={{
                        display: "flex",
                        gap: "8px"
                    }}
                >

                    <button
                        className="secondary-btn"
                        onClick={() =>
                            navigate("/admin/requirements")
                        }
                    >
                        ← Back
                    </button>


                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate(
                                `/admin/requirements/${id}/edit`
                            )
                        }
                    >
                        Edit
                    </button>

                </div>

            </div>


            {/* =================================================
                        REQUIREMENT CARD
                ================================================= */}

            <div className="employee-details-card">


                {/* =================================================
                            PROFILE HEADER
                    ================================================= */}

                <div className="employee-profile-header">

                    <div className="employee-avatar">

                        {requirement.requirementTitle
                            ? requirement.requirementTitle
                                .charAt(0)
                                .toUpperCase()
                            : "R"}

                    </div>


                    <div className="employee-profile-info">

                        <h2>

                            {
                                requirement.requirementTitle ||
                                "-"
                            }

                        </h2>

                        <p>

                            Requirement #
                            {
                                requirement.requirementId ||
                                "-"
                            }

                        </p>

                    </div>


                    <div
                        className="employee-profile-status"
                    >

                        <span
                            className={`status-badge ${getStatusClass(
                                requirement.requirementStatus
                            )}`}
                        >

                            {
                                getStatusLabel(
                                    requirement.requirementStatus
                                )
                            }

                        </span>

                    </div>

                </div>


                {/* =================================================
                            BASIC INFORMATION
                    ================================================= */}

                <div className="employee-section">

                    <h3>
                        Basic Information
                    </h3>


                    <div className="employee-info-grid">


                        {/* REQUIREMENT ID */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Requirement ID
                            </span>

                            <span className="employee-info-value">

                                {
                                    requirement.requirementId ||
                                    "-"
                                }

                            </span>

                        </div>


                        {/* TITLE */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Requirement Title
                            </span>

                            <span className="employee-info-value">

                                {
                                    requirement.requirementTitle ||
                                    "-"
                                }

                            </span>

                        </div>


                        {/* PRIORITY */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Priority
                            </span>

                            <span className="employee-info-value">

                                <span
                                    className={`status-badge ${getPriorityClass(
                                        requirement.requirementPriority
                                    )}`}
                                >

                                    {
                                        getPriorityLabel(
                                            requirement.requirementPriority
                                        )
                                    }

                                </span>

                            </span>

                        </div>


                        {/* STATUS */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Status
                            </span>

                            <span className="employee-info-value">

                                <span
                                    className={`status-badge ${getStatusClass(
                                        requirement.requirementStatus
                                    )}`}
                                >

                                    {
                                        getStatusLabel(
                                            requirement.requirementStatus
                                        )
                                    }

                                </span>

                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                            MODULE INFORMATION
                    ================================================= */}

                <div className="employee-section">

                    <h3>
                        Module Information
                    </h3>


                    <div className="employee-info-grid">


                        {/* MODULE ID */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Module ID
                            </span>

                            <span className="employee-info-value">

                                {
                                    requirement.module?.moduleId ||
                                    requirement.moduleId ||
                                    "-"
                                }

                            </span>

                        </div>


                        {/* MODULE NAME */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Module Name
                            </span>

                            <span className="employee-info-value">

                                {
                                    requirement.module?.moduleName ||
                                    "-"
                                }

                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                            DESCRIPTION
                    ================================================= */}

                <div className="employee-section">

                    <h3>
                        Requirement Description
                    </h3>


                    <div
                        style={{
                            padding: "15px",
                            background: "#f9fafb",
                            borderRadius: "8px",
                            lineHeight: "1.6",
                            whiteSpace: "pre-wrap"
                        }}
                    >

                        {
                            requirement.requirementDescription ||
                            "No description provided."
                        }

                    </div>

                </div>


                {/* =================================================
                            DATE INFORMATION
                    ================================================= */}

                <div className="employee-section last-section">

                    <h3>
                        System Information
                    </h3>


                    <div className="employee-info-grid">


                        {/* ON DATE */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Requirement On Date
                            </span>

                            <span className="employee-info-value">

                                {
                                    requirement.requirementOndate ||
                                    "-"
                                }

                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );
}

export default RequirementView;