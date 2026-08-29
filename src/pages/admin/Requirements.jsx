import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Requirements() {

    const navigate = useNavigate();

    const [requirements, setRequirements] = useState([]);
    const [modules, setModules] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [moduleFilter, setModuleFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);

    const [editingRequirementId, setEditingRequirementId] =
        useState(null);

    const [formData, setFormData] = useState({
        moduleId: "",
        requirementTitle: "",
        requirementDescription: "",
        requirementPriority: "MEDIUM",
        requirementStatus: "NEW"
    });


    // =====================================================
    // LOAD REQUIREMENTS
    // =====================================================

    const loadRequirements = async () => {

        try {

            setLoading(true);

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
                getErrorMessage(
                    error,
                    "Unable to load requirements."
                )
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD MODULES
    // =====================================================

    const loadModules = async () => {

        try {

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
        }
    };


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadRequirements();
        loadModules();

    }, []);


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

        setEditingRequirementId(null);

        setFormData({
            moduleId: "",
            requirementTitle: "",
            requirementDescription: "",
            requirementPriority: "MEDIUM",
            requirementStatus: "NEW"
        });

        setShowModal(true);
    };


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (requirement) => {

        setEditingRequirementId(
            requirement.requirementId
        );

        setFormData({

            moduleId:
                requirement.module?.moduleId
                    ? String(
                        requirement.module.moduleId
                    )
                    : requirement.moduleId
                        ? String(
                            requirement.moduleId
                        )
                        : "",

            requirementTitle:
                requirement.requirementTitle || "",

            requirementDescription:
                requirement.requirementDescription || "",

            requirementPriority:
                requirement.requirementPriority ||
                "MEDIUM",

            requirementStatus:
                requirement.requirementStatus ||
                "NEW"
        });

        setShowModal(true);
    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        setShowModal(false);

        setEditingRequirementId(null);

        setFormData({
            moduleId: "",
            requirementTitle: "",
            requirementDescription: "",
            requirementPriority: "MEDIUM",
            requirementStatus: "NEW"
        });
    };


    // =====================================================
    // CREATE / UPDATE REQUIREMENT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!formData.moduleId) {

            alert(
                "Please select a module."
            );

            return;
        }


        if (!formData.requirementTitle.trim()) {

            alert(
                "Please enter requirement title."
            );

            return;
        }


        setSaving(true);

        try {

            const requirementData = {

                moduleId:
                    Number(
                        formData.moduleId
                    ),

                requirementTitle:
                    formData.requirementTitle.trim(),

                requirementDescription:
                    formData.requirementDescription.trim(),

                requirementPriority:
                    formData.requirementPriority,

                requirementStatus:
                    formData.requirementStatus
            };


            // =================================================
            // UPDATE
            // =================================================

            if (editingRequirementId) {

                await api.put(
                    `/requirements/${editingRequirementId}`,
                    requirementData
                );

                alert(
                    "Requirement updated successfully."
                );

            }


            // =================================================
            // CREATE
            // =================================================

            else {

                await api.post(
                    "/requirements",
                    requirementData
                );

                alert(
                    "Requirement created successfully."
                );
            }


            closeModal();

            await loadRequirements();

        } catch (error) {

            console.error(
                "Unable to save requirement",
                error
            );

            alert(
                getErrorMessage(
                    error,
                    editingRequirementId
                        ? "Unable to update requirement."
                        : "Unable to create requirement."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // DELETE REQUIREMENT
    // =====================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this requirement?"
            );

        if (!confirmed) {

            return;
        }


        try {

            await api.delete(
                `/requirements/${id}`
            );

            alert(
                "Requirement deleted successfully."
            );

            await loadRequirements();

        } catch (error) {

            console.error(
                "Unable to delete requirement",
                error
            );

            alert(
                getErrorMessage(
                    error,
                    "Unable to delete requirement."
                )
            );
        }
    };


    // =====================================================
    // FILTER REQUIREMENTS
    // =====================================================

    const filteredRequirements = useMemo(() => {

        return requirements.filter(
            requirement => {

                const keyword =
                    search
                        .toLowerCase()
                        .trim();


                const matchesSearch =
                    !keyword ||

                    requirement.requirementTitle
                        ?.toLowerCase()
                        .includes(keyword) ||

                    requirement.requirementDescription
                        ?.toLowerCase()
                        .includes(keyword) ||

                    requirement.module
                        ?.moduleName
                        ?.toLowerCase()
                        .includes(keyword);


                const matchesStatus =
                    statusFilter === "All" ||
                    requirement.requirementStatus ===
                    statusFilter;


                const matchesPriority =
                    priorityFilter === "All" ||
                    requirement.requirementPriority ===
                    priorityFilter;


                const matchesModule =
                    moduleFilter === "All" ||
                    String(
                        requirement.module?.moduleId
                    ) === String(moduleFilter);


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority &&
                    matchesModule
                );
            }
        );

    }, [
        requirements,
        search,
        statusFilter,
        priorityFilter,
        moduleFilter
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalRequirements =
        requirements.length;


    const newRequirements =
        requirements.filter(
            requirement =>
                requirement.requirementStatus ===
                "NEW"
        ).length;


    const inProgressRequirements =
        requirements.filter(
            requirement =>
                requirement.requirementStatus ===
                "INPROGRESS"
        ).length;


    const completedRequirements =
        requirements.filter(
            requirement =>
                requirement.requirementStatus ===
                "COMPLETED"
        ).length;


    const rejectedRequirements =
        requirements.filter(
            requirement =>
                requirement.requirementStatus ===
                "REJECTED"
        ).length;


    // =====================================================
    // STATUS DISPLAY
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
    // PRIORITY DISPLAY
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
                        Requirement Management
                    </h2>

                    <p>
                        Manage project requirements,
                        priorities and progress.
                    </p>

                </div>


                <button
                    className="primary-btn"
                    onClick={openAddModal}
                >
                    + Add Requirement
                </button>

            </div>


            {/* =================================================
                        STATISTICS
                ================================================= */}

            <div className="stats-grid">


                <div className="stat-card">

                    <div className="stat-card-title">
                        Total Requirements
                    </div>

                    <div className="stat-card-value">
                        {totalRequirements}
                    </div>

                    <div className="stat-card-footer">
                        All requirements
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-card-title">
                        New
                    </div>

                    <div className="stat-card-value">
                        {newRequirements}
                    </div>

                    <div className="stat-card-footer">
                        New requirements
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-card-title">
                        In Progress
                    </div>

                    <div className="stat-card-value">
                        {inProgressRequirements}
                    </div>

                    <div className="stat-card-footer">
                        Currently working
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-card-title">
                        Completed
                    </div>

                    <div className="stat-card-value">
                        {completedRequirements}
                    </div>

                    <div className="stat-card-footer">
                        Completed requirements
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-card-title">
                        Rejected
                    </div>

                    <div className="stat-card-value">
                        {rejectedRequirements}
                    </div>

                    <div className="stat-card-footer">
                        Rejected requirements
                    </div>

                </div>

            </div>


            {/* =================================================
                        TABLE
                ================================================= */}

            <div className="table-card">


                <div className="table-toolbar">


                    <input
                        className="search-box"
                        type="text"
                        placeholder="Search requirements..."
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

                        <option value="NEW">
                            New
                        </option>

                        <option value="INPROGRESS">
                            In Progress
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                        <option value="REJECTED">
                            Rejected
                        </option>

                    </select>


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


                    <select
                        className="search-box"
                        value={moduleFilter}
                        onChange={event =>
                            setModuleFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Modules
                        </option>

                        {modules.map(
                            module => (

                                <option
                                    key={
                                        module.moduleId
                                    }
                                    value={
                                        module.moduleId
                                    }
                                >
                                    {
                                        module.moduleName
                                    }
                                </option>

                            )
                        )}

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
                        Loading requirements...
                    </div>


                ) : filteredRequirements.length === 0 ? (

                    <div
                        style={{
                            padding: "50px",
                            textAlign: "center"
                        }}
                    >

                        <strong>
                            No requirements found
                        </strong>

                        <p>
                            Try changing your search
                            or add a new requirement.
                        </p>

                    </div>


                ) : (

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>
                                    Requirement
                                </th>

                                <th>
                                    Module
                                </th>

                             
                                <th>
                                    Priority
                                </th>

                                <th>
                                    Status
                                </th>

                             

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredRequirements.map(
                                requirement => (

                                    <tr
                                        key={
                                            requirement.requirementId
                                        }
                                    >

                                        <td>

                                            <strong>
                                                {
                                                    requirement.requirementTitle
                                                }
                                            </strong>

                                        </td>


                                        <td>

                                            {
                                                requirement.module
                                                    ?.moduleName ||
                                                "-"
                                            }

                                        </td>


                                    


                                        <td>

                                            {
                                                getPriorityLabel(
                                                    requirement.requirementPriority
                                                )
                                            }

                                        </td>


                                        <td>

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

                                        </td>


                                     


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
                                                            `/admin/requirements/${requirement.requirementId}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>


                                                {/* EDIT */}

                                                <button
                                                    onClick={() =>
                                                        openEditModal(
                                                            requirement
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            requirement.requirementId
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
                        ADD / EDIT REQUIREMENT MODAL
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

                                    {editingRequirementId
                                        ? "Edit Requirement"
                                        : "Create Requirement"}

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

                                    {editingRequirementId
                                        ? "Update requirement information."
                                        : "Add a new requirement to a module."}

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


                                    {/* MODULE */}

                                    <div className="form-group">

                                        <label>
                                            Module *
                                        </label>

                                        <select
                                            name="moduleId"
                                            value={
                                                formData.moduleId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Select Module
                                            </option>

                                            {modules.map(
                                                module => (

                                                    <option
                                                        key={
                                                            module.moduleId
                                                        }
                                                        value={
                                                            module.moduleId
                                                        }
                                                    >
                                                        {
                                                            module.moduleName
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {/* REQUIREMENT TITLE */}

                                    <div className="form-group">

                                        <label>
                                            Requirement Title *
                                        </label>

                                        <input
                                            name="requirementTitle"
                                            value={
                                                formData.requirementTitle
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter requirement title"
                                            required
                                            maxLength="200"
                                        />

                                    </div>


                                    {/* PRIORITY */}

                                    <div className="form-group">

                                        <label>
                                            Priority *
                                        </label>

                                        <select
                                            name="requirementPriority"
                                            value={
                                                formData.requirementPriority
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
                                            name="requirementStatus"
                                            value={
                                                formData.requirementStatus
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="NEW">
                                                New
                                            </option>

                                            <option value="INPROGRESS">
                                                In Progress
                                            </option>

                                            <option value="COMPLETED">
                                                Completed
                                            </option>

                                            <option value="REJECTED">
                                                Rejected
                                            </option>

                                        </select>

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
                                            name="requirementDescription"
                                            value={
                                                formData.requirementDescription
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter requirement description"
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

                                        ? editingRequirementId
                                            ? "Updating..."
                                            : "Creating..."

                                        : editingRequirementId
                                            ? "Update Requirement"
                                            : "Create Requirement"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </>
    );
}

export default Requirements;