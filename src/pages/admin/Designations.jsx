import { useEffect, useMemo, useState } from "react";
import {
    getDesignations,
    createDesignation,
    updateDesignation,
    deleteDesignation
} from "../../services/designationService";

function Designations() {

    const [designations, setDesignations] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        designationName: "",
        designationStatus: "Active"
    });

    const [saving, setSaving] = useState(false);


    // =====================================================
    // LOAD DESIGNATIONS
    // =====================================================

    useEffect(() => {
        loadDesignations();
    }, []);


    const loadDesignations = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getDesignations();

            console.log("Designation API response:", data);

            setDesignations(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error("Designation API error:", err);

            setError(
                err.response?.data ||
                "Unable to load designations."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    const filteredDesignations = useMemo(() => {

        return designations.filter((designation) => {

            const name =
                designation.designationName
                    ?.toLowerCase() || "";

            const matchesSearch =
                name.includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "" ||
                designation.designationStatus === statusFilter;

            return matchesSearch && matchesStatus;

        });

    }, [designations, search, statusFilter]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalDesignations = designations.length;

    const activeDesignations =
        designations.filter(
            d => d.designationStatus === "Active"
        ).length;

    const inactiveDesignations =
        designations.filter(
            d => d.designationStatus === "InActive"
        ).length;


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };


    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const handleAdd = () => {

        setEditingId(null);

        setFormData({
            designationName: "",
            designationStatus: "Active"
        });

        setError("");

        setShowModal(true);
    };


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const handleEdit = (designation) => {

        setEditingId(designation.designationId);

        setFormData({
            designationName:
                designation.designationName || "",

            designationStatus:
                designation.designationStatus || "Active"
        });

        setError("");

        setShowModal(true);
    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleCloseModal = () => {

        if (saving) return;

        setShowModal(false);

        setEditingId(null);

        setFormData({
            designationName: "",
            designationStatus: "Active"
        });

    };


    // =====================================================
    // SAVE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.designationName.trim()) {

            setError("Designation name is required.");

            return;
        }

        try {

            setSaving(true);

            setError("");

            if (editingId) {

                await updateDesignation(
                    editingId,
                    formData
                );

                setSuccess(
                    "Designation updated successfully."
                );

            } else {

                await createDesignation(formData);

                setSuccess(
                    "Designation created successfully."
                );

            }

            setShowModal(false);

            setEditingId(null);

            setFormData({
                designationName: "",
                designationStatus: "Active"
            });

            await loadDesignations();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data ||
                "Unable to save designation."
            );

        } finally {

            setSaving(false);

        }
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this designation?"
        );

        if (!confirmed) return;

        try {

            setError("");

            await deleteDesignation(id);

            setSuccess(
                "Designation deleted successfully."
            );

            await loadDesignations();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data ||
                "Unable to delete designation."
            );

        }

    };


    return (

        <div className="management-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="management-header">

                <div>

                    <h2>
                        Designation Management
                    </h2>

                    <p>
                        Manage employee designations and their status.
                    </p>

                </div>

                <button
                    className="primary-button"
                    onClick={handleAdd}
                >
                    + Add Designation
                </button>

            </div>


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div className="alert alert-success">

                    <span>
                        {success}
                    </span>

                    <button
                        onClick={() => setSuccess("")}
                    >
                        ×
                    </button>

                </div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="alert alert-error">

                    <span>
                        {error}
                    </span>

                    <button
                        onClick={() => setError("")}
                    >
                        ×
                    </button>

                </div>

            )}


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="management-stats">

                <div className="management-stat-card">

                    <div>

                        <span>
                            Total Designations
                        </span>

                        <strong>
                            {totalDesignations}
                        </strong>

                    </div>

                    <div className="management-stat-icon">
                        D
                    </div>

                </div>


                <div className="management-stat-card">

                    <div>

                        <span>
                            Active Designations
                        </span>

                        <strong>
                            {activeDesignations}
                        </strong>

                    </div>

                    <div className="management-stat-icon active">
                        ✓
                    </div>

                </div>


                <div className="management-stat-card">

                    <div>

                        <span>
                            Inactive Designations
                        </span>

                        <strong>
                            {inactiveDesignations}
                        </strong>

                    </div>

                    <div className="management-stat-icon inactive">
                        !
                    </div>

                </div>

            </div>


            {/* =================================================
                TABLE PANEL
            ================================================= */}

            <div className="management-panel">

                {/* FILTER BAR */}

                <div className="management-filter-bar">

                    <div className="management-search">

                        <span>
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search designations..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="Active">
                            Active
                        </option>

                        <option value="InActive">
                            Inactive
                        </option>

                    </select>

                </div>


                {/* TABLE */}

                <div className="management-table-wrapper">

                    <table className="management-table">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    DESIGNATION
                                </th>

                                <th>
                                    DATE
                                </th>

                                <th>
                                    STATUS
                                </th>

                                <th className="action-column">
                                    ACTION
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="table-message"
                                    >
                                        Loading designations...
                                    </td>

                                </tr>

                            ) : filteredDesignations.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="table-message"
                                    >

                                        <div className="empty-state">

                                            <div>
                                                D
                                            </div>

                                            <strong>
                                                No designations found
                                            </strong>

                                            <span>
                                                Try changing your search or filter.
                                            </span>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredDesignations.map(
                                    (designation, index) => (

                                        <tr
                                            key={
                                                designation.designationId
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>


                                            <td>

                                                <div className="department-name-cell">

                                                    <div className="department-avatar">

                                                        {designation.designationName
                                                            ?.charAt(0)
                                                            .toUpperCase()}

                                                    </div>

                                                    <div>

                                                        <strong>

                                                            {
                                                                designation.designationName
                                                            }

                                                        </strong>

                                                        <span>
                                                            Employee Designation
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                {designation.designationOndate
                                                    ? new Date(
                                                        designation.designationOndate
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )
                                                    : "-"
                                                }

                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        designation.designationStatus ===
                                                        "Active"
                                                            ? "status-badge status-active"
                                                            : "status-badge status-inactive"
                                                    }
                                                >

                                                    <span className="status-dot"></span>

                                                    {
                                                        designation.designationStatus
                                                    }

                                                </span>

                                            </td>


                                            <td>

                                                <div className="table-actions">

                                                    <button
                                                        className="icon-button"
                                                        title="Edit"
                                                        onClick={() =>
                                                            handleEdit(
                                                                designation
                                                            )
                                                        }
                                                    >
                                                        ✎
                                                    </button>


                                                    <button
                                                        className="icon-button danger-action"
                                                        title="Delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                designation.designationId
                                                            )
                                                        }
                                                    >
                                                        🗑
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {showModal && (

                <div className="modal-overlay">

                    <div className="department-modal">

                        <div className="modal-header">

                            <div>

                                <h3>
                                    {editingId
                                        ? "Edit Designation"
                                        : "Add Designation"}
                                </h3>

                                <p>
                                    {editingId
                                        ? "Update designation information."
                                        : "Create a new employee designation."}
                                </p>

                            </div>


                            <button
                                className="modal-close"
                                onClick={handleCloseModal}
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleSubmit}>

                            <div className="modal-body">

                                <div className="form-group">

                                    <label>
                                        Designation Name
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="designationName"
                                        value={
                                            formData.designationName
                                        }
                                        onChange={handleChange}
                                        placeholder="Enter designation name"
                                        autoFocus
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="designationStatus"
                                        value={
                                            formData.designationStatus
                                        }
                                        onChange={handleChange}
                                    >

                                        <option value="Active">
                                            Active
                                        </option>

                                        <option value="InActive">
                                            Inactive
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={handleCloseModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Designation"
                                            : "Create Designation"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );
}

export default Designations;