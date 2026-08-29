import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Modules() {

    const navigate = useNavigate();

    const [modules, setModules] = useState([]);
    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [projectFilter, setProjectFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);

    /*
     * null = ADD MODE
     * number = EDIT MODE
     */
    const [editingModuleId, setEditingModuleId] = useState(null);

    const [formData, setFormData] = useState({
        projectId: "",
        moduleName: "",
        moduleDescription: "",
        moduleStatus: "PENDING",
        moduleEndDate: ""
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
    // LOAD MODULES
    // =====================================================

    const loadModules = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/modules");

            setModules(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Unable to load modules",
                error
            );

            alert(
                getErrorMessage(
                    error,
                    "Unable to load modules."
                )
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD PROJECTS
    // =====================================================

    const loadProjects = async () => {

        try {

            const response =
                await api.get("/projects");

            setProjects(
                Array.isArray(response.data)
                    ? response.data
                    : []
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
        }
    };


    // =====================================================
    // LOAD ALL DATA
    // =====================================================

    useEffect(() => {

        loadModules();
        loadProjects();

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

        setEditingModuleId(null);

        setFormData({
            projectId: "",
            moduleName: "",
            moduleDescription: "",
            moduleStatus: "PENDING",
            moduleEndDate: ""
        });

        setShowModal(true);
    };


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (module) => {

        setEditingModuleId(
            module.moduleId
        );

        setFormData({

            projectId:
                module.project?.projectId
                    ? String(
                        module.project.projectId
                    )
                    : module.projectId
                        ? String(
                            module.projectId
                        )
                        : "",

            moduleName:
                module.moduleName || "",

            moduleDescription:
                module.moduleDescription || "",

            moduleStatus:
                module.moduleStatus ||
                "PENDING",

            moduleEndDate:
                module.moduleEndDate
                    ? String(
                        module.moduleEndDate
                    ).substring(0, 10)
                    : ""
        });

        setShowModal(true);
    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        setShowModal(false);

        setEditingModuleId(null);

        setFormData({
            projectId: "",
            moduleName: "",
            moduleDescription: "",
            moduleStatus: "PENDING",
            moduleEndDate: ""
        });
    };


    // =====================================================
    // CREATE / UPDATE MODULE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!formData.projectId) {

            alert(
                "Please select a project."
            );

            return;
        }


        if (!formData.moduleName.trim()) {

            alert(
                "Please enter module name."
            );

            return;
        }


        setSaving(true);


        try {

            const moduleData = {

                projectId:
                    Number(
                        formData.projectId
                    ),

                moduleName:
                    formData.moduleName.trim(),

                moduleDescription:
                    formData.moduleDescription.trim(),

                moduleStatus:
                    formData.moduleStatus,

                moduleEndDate:
                    formData.moduleEndDate
                        ? formData.moduleEndDate
                        : null
            };


            // =================================================
            // UPDATE
            // =================================================

            if (editingModuleId) {

                await api.put(
                    `/modules/${editingModuleId}`,
                    moduleData
                );

                alert(
                    "Module updated successfully."
                );

            }


            // =================================================
            // CREATE
            // =================================================

            else {

                await api.post(
                    "/modules",
                    moduleData
                );

                alert(
                    "Module created successfully."
                );
            }


            closeModal();

            await loadModules();

        } catch (error) {

            console.error(
                "Unable to save module",
                error
            );

            alert(
                getErrorMessage(
                    error,
                    editingModuleId
                        ? "Unable to update module."
                        : "Unable to create module."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // FILTER MODULES
    // =====================================================

    const filteredModules = useMemo(() => {

        return modules.filter(module => {

            const keyword =
                search
                    .toLowerCase()
                    .trim();


            const matchesSearch =
                !keyword ||

                module.moduleName
                    ?.toLowerCase()
                    .includes(keyword) ||

                module.moduleDescription
                    ?.toLowerCase()
                    .includes(keyword) ||

                module.project
                    ?.projectName
                    ?.toLowerCase()
                    .includes(keyword);


            const matchesStatus =
                statusFilter === "All" ||
                module.moduleStatus ===
                statusFilter;


            const matchesProject =
                projectFilter === "All" ||
                String(
                    module.project?.projectId
                ) === String(
                    projectFilter
                );


            return (
                matchesSearch &&
                matchesStatus &&
                matchesProject
            );

        });

    }, [
        modules,
        search,
        statusFilter,
        projectFilter
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalModules =
        modules.length;


    const pendingModules =
        modules.filter(
            module =>
                module.moduleStatus ===
                "PENDING"
        ).length;


    const inProgressModules =
        modules.filter(
            module =>
                module.moduleStatus ===
                "INPROGRESS"
        ).length;


    const completedModules =
        modules.filter(
            module =>
                module.moduleStatus ===
                "COMPLETED"
        ).length;


    const onHoldModules =
        modules.filter(
            module =>
                module.moduleStatus ===
                "ONHOLD"
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

            case "ONHOLD":
                return "On Hold";

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

            case "ONHOLD":
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
                        Module Management
                    </h2>

                    <p>
                        Manage project modules,
                        progress and information.
                    </p>

                </div>


                <button
                    className="primary-btn"
                    onClick={
                        openAddModal
                    }
                >
                    + Add Module
                </button>

            </div>


            {/* =================================================
                        STATISTICS
                ================================================= */}

            <div className="stats-grid">


                {/* TOTAL */}

                <div className="stat-card">

                    <div className="stat-card-title">
                        Total Modules
                    </div>

                    <div className="stat-card-value">
                        {totalModules}
                    </div>

                    <div className="stat-card-footer">
                        All project modules
                    </div>

                </div>


                {/* PENDING */}

                <div className="stat-card">

                    <div className="stat-card-title">
                        Pending
                    </div>

                    <div className="stat-card-value">
                        {pendingModules}
                    </div>

                    <div className="stat-card-footer">
                        Pending modules
                    </div>

                </div>


                {/* IN PROGRESS */}

                <div className="stat-card">

                    <div className="stat-card-title">
                        In Progress
                    </div>

                    <div className="stat-card-value">
                        {inProgressModules}
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
                        {completedModules}
                    </div>

                    <div className="stat-card-footer">
                        Completed modules
                    </div>

                </div>


                {/* ON HOLD */}

                <div className="stat-card">

                    <div className="stat-card-title">
                        On Hold
                    </div>

                    <div className="stat-card-value">
                        {onHoldModules}
                    </div>

                    <div className="stat-card-footer">
                        Modules on hold
                    </div>

                </div>

            </div>


            {/* =================================================
                        TABLE
                ================================================= */}

            <div className="table-card">


                {/* TOOLBAR */}

                <div className="table-toolbar">

                    <input
                        className="search-box"
                        type="text"
                        placeholder="Search modules..."
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

                    </select>


                    <select
                        className="search-box"
                        value={projectFilter}
                        onChange={event =>
                            setProjectFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Projects
                        </option>

                        {projects.map(
                            project => (

                                <option
                                    key={
                                        project.projectId
                                    }
                                    value={
                                        project.projectId
                                    }
                                >
                                    {
                                        project.projectName
                                    }
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* LOADING */}

                {loading ? (

                    <div
                        style={{
                            padding: "50px",
                            textAlign: "center"
                        }}
                    >
                        Loading modules...
                    </div>

                ) : filteredModules.length === 0 ? (

                    <div
                        style={{
                            padding: "50px",
                            textAlign: "center"
                        }}
                    >

                        <strong>
                            No modules found
                        </strong>

                        <p>
                            Try changing your search
                            or add a new module.
                        </p>

                    </div>

                ) : (

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>
                                    Module
                                </th>

                                <th>
                                    Project
                                </th>

                              
                                <th>
                                    Status
                                </th>

                                <th>
                                    End Date
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredModules.map(
                                module => (

                                    <tr
                                        key={
                                            module.moduleId
                                        }
                                    >

                                        {/* MODULE */}

                                        <td>

                                            <strong>
                                                {
                                                    module.moduleName
                                                }
                                            </strong>

                                        </td>


                                        {/* PROJECT */}

                                        <td>

                                            {
                                                module.project
                                                    ?.projectName ||
                                                "-"
                                            }

                                        </td>


                                      

                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`status-badge ${getStatusClass(
                                                    module.moduleStatus
                                                )}`}
                                            >

                                                {
                                                    getStatusLabel(
                                                        module.moduleStatus
                                                    )
                                                }

                                            </span>

                                        </td>


                                        {/* END DATE */}

                                        <td>

                                            {
                                                formatDate(
                                                    module.moduleEndDate
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

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/modules/${module.moduleId}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        openEditModal(
                                                            module
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
                        ADD / EDIT MODULE MODAL
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

                                    {editingModuleId
                                        ? "Edit Module"
                                        : "Create Module"}

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

                                    {editingModuleId
                                        ? "Update module information."
                                        : "Add a new module to a project."}

                                </p>

                            </div>


                            <button
                                type="button"
                                className="modal-close"
                                onClick={
                                    closeModal
                                }
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


                                    {/* PROJECT */}

                                    <div className="form-group">

                                        <label>
                                            Project *
                                        </label>

                                        <select
                                            name="projectId"
                                            value={
                                                formData.projectId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Select Project
                                            </option>

                                            {projects.map(
                                                project => (

                                                    <option
                                                        key={
                                                            project.projectId
                                                        }
                                                        value={
                                                            project.projectId
                                                        }
                                                    >
                                                        {
                                                            project.projectName
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {/* MODULE NAME */}

                                    <div className="form-group">

                                        <label>
                                            Module Name *
                                        </label>

                                        <input
                                            type="text"
                                            name="moduleName"
                                            value={
                                                formData.moduleName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter module name"
                                            required
                                        />

                                    </div>


                                    {/* STATUS */}

                                    <div className="form-group">

                                        <label>
                                            Status *
                                        </label>

                                        <select
                                            name="moduleStatus"
                                            value={
                                                formData.moduleStatus
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

                                            <option value="ONHOLD">
                                                On Hold
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
                                            name="moduleEndDate"
                                            value={
                                                formData.moduleEndDate
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
                                            Description
                                        </label>

                                        <textarea
                                            name="moduleDescription"
                                            value={
                                                formData.moduleDescription
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter module description"
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
                                    onClick={
                                        closeModal
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-btn"
                                    disabled={
                                        saving
                                    }
                                >

                                    {saving

                                        ? editingModuleId
                                            ? "Updating..."
                                            : "Creating..."

                                        : editingModuleId
                                            ? "Update Module"
                                            : "Create Module"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </>
    );
}

export default Modules;