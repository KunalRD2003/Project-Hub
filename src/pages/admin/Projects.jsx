import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Projects() {

    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);

    // null = Add
    // ID = Edit
    const [editingProjectId, setEditingProjectId] =
        useState(null);

    const [formData, setFormData] = useState({
        clientId: "",
        projectName: "",
        projectDescription: "",
        projectStatus: "PENDING",
        projectEndDate: ""
    });


    // =====================================================
    // ERROR MESSAGE
    // =====================================================

    const getErrorMessage = (
        error,
        defaultMessage
    ) => {

        const data =
            error.response?.data;

        if (typeof data === "string") {
            return data;
        }

        if (data?.message) {
            return data.message;
        }

        if (data?.error) {
            return data.error;
        }

        if (data?.errors) {
            return JSON.stringify(
                data.errors
            );
        }

        return defaultMessage;
    };


    // =====================================================
    // LOAD PROJECTS
    // =====================================================

    const loadProjects = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/projects");

            setProjects(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Unable to load projects",
                error
            );

            alert(
                getErrorMessage(
                    error,
                    "Unable to load projects."
                )
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD CLIENTS
    // =====================================================

    const loadClients = async () => {

        try {

            const response =
                await api.get("/clients");

            setClients(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Unable to load clients",
                error
            );

            alert(
                getErrorMessage(
                    error,
                    "Unable to load clients."
                )
            );
        }
    };


    // =====================================================
    // LOAD ALL DATA
    // =====================================================

    useEffect(() => {

        loadProjects();
        loadClients();

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

        setEditingProjectId(null);

        setFormData({
            clientId: "",
            projectName: "",
            projectDescription: "",
            projectStatus: "PENDING",
            projectEndDate: ""
        });

        setShowModal(true);
    };


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (project) => {

        setEditingProjectId(
            project.projectId
        );

        setFormData({

            clientId:
                project.client?.clientId
                    ? String(
                        project.client.clientId
                    )
                    : project.clientId
                        ? String(
                            project.clientId
                        )
                        : "",

            projectName:
                project.projectName || "",

            projectDescription:
                project.projectDescription || "",

            projectStatus:
                project.projectStatus ||
                "PENDING",

            projectEndDate:
                project.projectEndDate
                    ? project.projectEndDate.substring(
                        0,
                        10
                    )
                    : ""
        });

        setShowModal(true);
    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        setShowModal(false);

        setEditingProjectId(null);

        setFormData({
            clientId: "",
            projectName: "",
            projectDescription: "",
            projectStatus: "PENDING",
            projectEndDate: ""
        });
    };


    // =====================================================
    // CREATE / UPDATE PROJECT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setSaving(true);

        try {

            const projectData = {

                clientId:
                    formData.clientId
                        ? Number(
                            formData.clientId
                        )
                        : null,

                projectName:
                    formData.projectName,

                projectDescription:
                    formData.projectDescription,

                projectStatus:
                    formData.projectStatus,

                projectEndDate:
                    formData.projectEndDate
                        ? formData.projectEndDate
                        : null
            };


            // =================================================
            // UPDATE
            // =================================================

            if (editingProjectId) {

                await api.put(
                    `/projects/${editingProjectId}`,
                    projectData
                );

                alert(
                    "Project updated successfully."
                );

            }


            // =================================================
            // CREATE
            // =================================================

            else {

                await api.post(
                    "/projects",
                    projectData
                );

                alert(
                    "Project created successfully."
                );
            }


            closeModal();

            await loadProjects();

        } catch (error) {

            console.error(
                "Project save error",
                error
            );

            alert(
                getErrorMessage(
                    error,
                    editingProjectId
                        ? "Unable to update project."
                        : "Unable to create project."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // FILTER PROJECTS
    // =====================================================

    const filteredProjects = useMemo(() => {

        return projects.filter(project => {

            const keyword =
                search
                    .toLowerCase()
                    .trim();


            const projectName =
                project.projectName
                    ?.toLowerCase() || "";


            const clientName =
                project.client
                    ?.clientName
                    ?.toLowerCase() || "";


            const description =
                project.projectDescription
                    ?.toLowerCase() || "";


            const matchesSearch =
                !keyword ||

                projectName.includes(
                    keyword
                ) ||

                clientName.includes(
                    keyword
                ) ||

                description.includes(
                    keyword
                );


            const matchesStatus =
                statusFilter === "All" ||

                project.projectStatus ===
                statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );
        });

    }, [
        projects,
        search,
        statusFilter
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalProjects =
        projects.length;


    const activeProjects =
        projects.filter(
            project =>
                project.projectStatus ===
                "ACTIVE"
        ).length;


    const pendingProjects =
        projects.filter(
            project =>
                project.projectStatus ===
                "PENDING"
        ).length;


    const completedProjects =
        projects.filter(
            project =>
                project.projectStatus ===
                "COMPLETED"
        ).length;


    // =====================================================
    // STATUS LABEL
    // =====================================================

    const getStatusLabel = (status) => {

        switch (status) {

            case "ACTIVE":
                return "Active";

            case "PENDING":
                return "Pending";

            case "INPROGRESS":
                return "In Progress";

            case "COMPLETED":
                return "Completed";

            case "ONHOLD":
                return "On Hold";

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

            case "ACTIVE":
                return "status-active";

            case "COMPLETED":
                return "status-active";

            case "PENDING":
                return "status-inactive";

            case "INPROGRESS":
                return "status-inactive";

            case "ONHOLD":
                return "status-inactive";

            case "CANCELLED":
                return "status-inactive";

            default:
                return "status-inactive";
        }
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(
            date
        ).toLocaleDateString();
    };


    // =====================================================
    // FORMAT DATE TIME
    // =====================================================

    const formatDateTime = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(
            date
        ).toLocaleString();
    };


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
                        Project Management
                    </h2>

                    <p>
                        Manage projects,
                        clients and project information.
                    </p>

                </div>


                <button
                    className="primary-btn"
                    onClick={openAddModal}
                >
                    + Add Project
                </button>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="stats-grid">


                {/* TOTAL */}

                <div className="stat-card">

                    <div className="stat-card-title">
                        Total Projects
                    </div>

                    <div className="stat-card-value">
                        {totalProjects}
                    </div>

                    <div className="stat-card-footer">
                        All projects
                    </div>

                </div>


                {/* ACTIVE */}

                <div className="stat-card">

                    <div className="stat-card-title">
                        Active Projects
                    </div>

                    <div className="stat-card-value">
                        {activeProjects}
                    </div>

                    <div className="stat-card-footer">
                        Currently active
                    </div>

                </div>


                {/* PENDING */}

                <div className="stat-card">

                    <div className="stat-card-title">
                        Pending Projects
                    </div>

                    <div className="stat-card-value">
                        {pendingProjects}
                    </div>

                    <div className="stat-card-footer">
                        Projects pending
                    </div>

                </div>


                {/* COMPLETED */}

                <div className="stat-card">

                    <div className="stat-card-title">
                        Completed Projects
                    </div>

                    <div className="stat-card-value">
                        {completedProjects}
                    </div>

                    <div className="stat-card-footer">
                        Successfully completed
                    </div>

                </div>

            </div>


            {/* =================================================
                PROJECT TABLE
            ================================================= */}

            <div className="table-card">


                {/* TOOLBAR */}

                <div className="table-toolbar">

                    <input
                        className="search-box"
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={event =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />


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

                        <option value="ACTIVE">
                            Active
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

                        <option value="ONHOLD">
                            On Hold
                        </option>

                        <option value="CANCELLED">
                            Cancelled
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
                        Loading projects...
                    </div>

                ) : filteredProjects.length === 0 ? (

                    /* =================================================
                        NO DATA
                    ================================================= */

                    <div
                        style={{
                            padding: "50px",
                            textAlign: "center"
                        }}
                    >

                        <strong>
                            No projects found
                        </strong>

                        <p>
                            Try changing your search
                            or add a new project.
                        </p>

                    </div>

                ) : (

                    /* =================================================
                        TABLE
                    ================================================= */

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>
                                    Project
                                </th>

                                <th>
                                    Client
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Start Date
                                </th>

                           

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredProjects.map(
                                project => (

                                    <tr
                                        key={
                                            project.projectId
                                        }
                                    >


                                        {/* PROJECT */}

                                        <td>

                                            <strong>
                                                {
                                                    project.projectName
                                                }
                                            </strong>


                                            

                                        </td>


                                        {/* CLIENT */}

                                        <td>

                                            {
                                                project.client
                                                    ?.clientName ||
                                                "-"
                                            }

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`status-badge ${getStatusClass(
                                                    project.projectStatus
                                                )}`}
                                            >

                                                {
                                                    getStatusLabel(
                                                        project.projectStatus
                                                    )
                                                }

                                            </span>

                                        </td>


                                        {/* START DATE */}

                                        <td>

                                            {
                                                formatDateTime(
                                                    project.projectStartDate
                                                )
                                            }

                                        </td>


                                     

                                        {/* ACTION */}

                                        <td>

                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    gap:
                                                        "8px",
                                                    alignItems:
                                                        "center"
                                                }}
                                            >

                                                {/* VIEW */}

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/projects/${project.projectId}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>


                                                {/* EDIT */}

                                                <button
                                                    onClick={() =>
                                                        openEditModal(
                                                            project
                                                        )
                                                    }
                                                >
                                                    Edit
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

                                    {editingProjectId
                                        ? "Edit Project"
                                        : "Create Project"}

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

                                    {editingProjectId
                                        ? "Update project information."
                                        : "Create a new project."}

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
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="modal-body">

                                <div className="form-grid">


                                    {/* CLIENT */}

                                    <div className="form-group">

                                        <label>
                                            Client *
                                        </label>

                                        <select
                                            name="clientId"
                                            value={
                                                formData.clientId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Select Client
                                            </option>

                                            {clients.map(
                                                client => (

                                                    <option
                                                        key={
                                                            client.clientId
                                                        }
                                                        value={
                                                            client.clientId
                                                        }
                                                    >

                                                        {
                                                            client.clientName
                                                        }

                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {/* PROJECT NAME */}

                                    <div className="form-group">

                                        <label>
                                            Project Name *
                                        </label>

                                        <input
                                            name="projectName"
                                            value={
                                                formData.projectName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter project name"
                                            required
                                        />

                                    </div>


                                    {/* STATUS */}

                                    <div className="form-group">

                                        <label>
                                            Project Status *
                                        </label>

                                        <select
                                            name="projectStatus"
                                            value={
                                                formData.projectStatus
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="PENDING">
                                                PENDING
                                            </option>

                                            <option value="ACTIVE">
                                                ACTIVE
                                            </option>

                                            <option value="INPROGRESS">
                                                IN PROGRESS
                                            </option>

                                            <option value="COMPLETED">
                                                COMPLETED
                                            </option>

                                            <option value="ONHOLD">
                                                ON HOLD
                                            </option>

                                            <option value="CANCELLED">
                                                CANCELLED
                                            </option>

                                        </select>

                                    </div>


                                    {/* END DATE */}

                                    <div className="form-group">

                                        <label>
                                            End Date
                                        </label>

                                        <input
                                            type="date"
                                            name="projectEndDate"
                                            value={
                                                formData.projectEndDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            onClick={(event) => {
                                                event.target.showPicker?.();
                                            }}
                                            style={{
                                                cursor:
                                                    "pointer"
                                            }}
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
                                            Project Description
                                        </label>

                                        <textarea
                                            name="projectDescription"
                                            value={
                                                formData.projectDescription
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter project description"
                                            rows="5"
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

                                        ? editingProjectId
                                            ? "Updating..."
                                            : "Creating..."

                                        : editingProjectId
                                            ? "Update Project"
                                            : "Create Project"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </>
    );
}

export default Projects;