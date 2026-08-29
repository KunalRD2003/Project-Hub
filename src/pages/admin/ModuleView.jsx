import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function ModuleView() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [module, setModule] = useState(null);

    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD MODULE
    // =====================================================

    const loadModule = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(`/modules/${id}`);

            setModule(response.data);

        } catch (error) {

            console.error(
                "Unable to load module",
                error
            );

            alert(
                error.response?.data ||
                "Unable to load module."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadModule();

    }, [id]);


    // =====================================================
    // FORMAT STATUS
    // =====================================================

    const getStatusText = (status) => {

        if (status === "INPROGRESS") {
            return "In Progress";
        }

        if (status === "ONHOLD") {
            return "On Hold";
        }

        if (status === "COMPLETED") {
            return "Completed";
        }

        return "Pending";
    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        if (status === "COMPLETED") {
            return "status-active";
        }

        if (status === "INPROGRESS") {
            return "status-active";
        }

        if (status === "ONHOLD") {
            return "status-inactive";
        }

        return "status-inactive";
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

                Loading module details...

            </div>

        );
    }


    // =====================================================
    // MODULE NOT FOUND
    // =====================================================

    if (!module) {

        return (

            <div
                style={{
                    padding: "50px",
                    textAlign: "center"
                }}
            >

                <strong>
                    Module not found
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
                        Module Details
                    </h2>

                    <p>
                        View complete module information.
                    </p>

                </div>


                <div
                    style={{
                        display: "flex",
                        gap: "8px"
                    }}
                >

                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate(
                                `/admin/modules/${module.moduleId}/edit`
                            )
                        }
                    >

                        Edit

                    </button>


                    <button
                        className="secondary-btn"
                        onClick={() =>
                            navigate(
                                "/admin/modules"
                            )
                        }
                    >

                        ← Back

                    </button>

                </div>

            </div>


            {/* =================================================
                        MODULE DETAILS CARD
                ================================================= */}

            <div className="employee-details-card">


                {/* =================================================
                            PROFILE HEADER
                    ================================================= */}

                <div className="employee-profile-header">


                    {/* MODULE AVATAR */}

                    <div className="employee-avatar">

                        {module.moduleName
                            ? module.moduleName
                                .charAt(0)
                                .toUpperCase()
                            : "M"}

                    </div>


                    {/* MODULE INFO */}

                    <div className="employee-profile-info">

                        <h2>

                            {
                                module.moduleName ||
                                "-"
                            }

                        </h2>

                        <p>

                            Module ID:{" "}

                            {
                                module.moduleId ||
                                "-"
                            }

                        </p>

                    </div>


                    {/* STATUS */}

                    <div className="employee-profile-status">

                        <span
                            className={`status-badge ${getStatusClass(
                                module.moduleStatus
                            )}`}
                        >

                            {
                                getStatusText(
                                    module.moduleStatus
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


                        {/* MODULE ID */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Module ID
                            </span>

                            <span className="employee-info-value">

                                {
                                    module.moduleId ||
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
                                    module.moduleName ||
                                    "-"
                                }

                            </span>

                        </div>


                        {/* PROJECT */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Project
                            </span>

                            <span className="employee-info-value">

                                {
                                    module.project
                                        ?.projectName ||
                                    "-"
                                }

                            </span>

                        </div>


                        {/* PROJECT ID */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Project ID
                            </span>

                            <span className="employee-info-value">

                                {
                                    module.project
                                        ?.projectId ||
                                    module.projectId ||
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
                        Module Description
                    </h3>


                    <div
                        style={{
                            paddingTop: "5px",
                            lineHeight: "1.7",
                            color: "#374151"
                        }}
                    >

                        {
                            module.moduleDescription ||
                            "No description available."
                        }

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


                        {/* STATUS */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Status
                            </span>

                            <span className="employee-info-value">

                                <span
                                    className={`status-badge ${getStatusClass(
                                        module.moduleStatus
                                    )}`}
                                >

                                    {
                                        getStatusText(
                                            module.moduleStatus
                                        )
                                    }

                                </span>

                            </span>

                        </div>


                        {/* START DATE */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Start Date
                            </span>

                            <span className="employee-info-value">

                                {
                                    module.moduleStartDate ||
                                    "-"
                                }

                            </span>

                        </div>


                        {/* END DATE */}

                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                End Date
                            </span>

                            <span className="employee-info-value">

                                {
                                    module.moduleEndDate ||
                                    "-"
                                }

                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                            PROJECT INFORMATION
                    ================================================= */}

                <div className="employee-section last-section">

                    <h3>
                        Project Information
                    </h3>


                    <div className="employee-info-grid">


                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Project Name
                            </span>

                            <span className="employee-info-value">

                                {
                                    module.project
                                        ?.projectName ||
                                    "-"
                                }

                            </span>

                        </div>


                        <div className="employee-info-item">

                            <span className="employee-info-label">
                                Project ID
                            </span>

                            <span className="employee-info-value">

                                {
                                    module.project
                                        ?.projectId ||
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

export default ModuleView;