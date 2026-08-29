import { useEffect, useState } from "react";
import api from "../../services/api";

function Departments() {

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);

    const [editingDepartment, setEditingDepartment] =
        useState(null);

    const [departmentName, setDepartmentName] =
        useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    useEffect(() => {

        loadDepartments();

    }, []);


    const loadDepartments = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/departments");

            setDepartments(response.data);

        } catch (err) {

            console.error(err);

            setError(
                "Unable to load departments."
            );

        } finally {

            setLoading(false);
        }
    };


    const openAddModal = () => {

        setEditingDepartment(null);
        setDepartmentName("");
        setError("");
        setShowModal(true);
    };


    const openEditModal = (department) => {

        setEditingDepartment(department);

        setDepartmentName(
            department.departmentName
        );

        setError("");
        setShowModal(true);
    };


    const closeModal = () => {

        if (saving) return;

        setShowModal(false);
        setEditingDepartment(null);
        setDepartmentName("");
        setError("");
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        const trimmedName =
            departmentName.trim();

        if (!trimmedName) {

            setError(
                "Department name is required."
            );

            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            if (editingDepartment) {

                await api.put(
                    `/departments/${editingDepartment.departmentId}`,
                    {
                        departmentName:
                            trimmedName,

                        departmentStatus:
                            editingDepartment.departmentStatus
                    }
                );

                setSuccess(
                    "Department updated successfully."
                );

            } else {

                await api.post(
                    "/departments",
                    {
                        departmentName:
                            trimmedName,

                        departmentStatus:
                            "Active"
                    }
                );

                setSuccess(
                    "Department created successfully."
                );
            }

            await loadDepartments();

            setShowModal(false);

            setEditingDepartment(null);

            setDepartmentName("");

        } catch (err) {

            console.error(err);

            const message =
                err?.response?.data;

            setError(
                typeof message === "string"
                    ? message
                    : "Unable to save department."
            );

        } finally {

            setSaving(false);
        }
    };


    const toggleStatus = async (department) => {

        const newStatus =
            department.departmentStatus ===
            "Active"
                ? "InActive"
                : "Active";

        const confirmMessage =
            newStatus === "Active"
                ? `Activate ${department.departmentName}?`
                : `Deactivate ${department.departmentName}?`;

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await api.put(
                `/departments/${department.departmentId}`,
                {
                    departmentName:
                        department.departmentName,

                    departmentStatus:
                        newStatus
                }
            );

            setSuccess(
                `Department ${
                    newStatus === "Active"
                        ? "activated"
                        : "deactivated"
                } successfully.`
            );

            await loadDepartments();

        } catch (err) {

            console.error(err);

            const message =
                err?.response?.data;

            setError(
                typeof message === "string"
                    ? message
                    : "Unable to update department status."
            );
        }
    };


    const filteredDepartments =
        departments.filter((department) => {

            const matchesSearch =
                department.departmentName
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesStatus =
                statusFilter === "All" ||
                department.departmentStatus ===
                    statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });


    const totalDepartments =
        departments.length;

    const activeDepartments =
        departments.filter(
            department =>
                department.departmentStatus ===
                "Active"
        ).length;

    const inactiveDepartments =
        departments.filter(
            department =>
                department.departmentStatus ===
                "InActive"
        ).length;


    return (
        <div className="management-page">

            {/* PAGE HEADER */}

            <div className="management-header">

                <div>

                    <h2>
                        Department Management
                    </h2>

                    <p>
                        Manage organization departments
                        and their status.
                    </p>

                </div>

                <button
                    className="primary-button"
                    onClick={openAddModal}
                >
                    <span>+</span>
                    Add Department
                </button>

            </div>


            {/* ALERTS */}

            {success && (

                <div className="alert alert-success">
                    {success}

                    <button
                        onClick={() =>
                            setSuccess("")
                        }
                    >
                        ×
                    </button>
                </div>

            )}


            {error && !showModal && (

                <div className="alert alert-error">
                    {error}

                    <button
                        onClick={() =>
                            setError("")
                        }
                    >
                        ×
                    </button>
                </div>

            )}


            {/* STATISTICS */}

            <div className="management-stats">

                <div className="management-stat-card">

                    <div>
                        <span>
                            Total Departments
                        </span>

                        <strong>
                            {totalDepartments}
                        </strong>
                    </div>

                    <div className="management-stat-icon">
                        ▦
                    </div>

                </div>


                <div className="management-stat-card">

                    <div>
                        <span>
                            Active Departments
                        </span>

                        <strong>
                            {activeDepartments}
                        </strong>
                    </div>

                    <div className="management-stat-icon active">
                        ✓
                    </div>

                </div>


                <div className="management-stat-card">

                    <div>
                        <span>
                            Inactive Departments
                        </span>

                        <strong>
                            {inactiveDepartments}
                        </strong>
                    </div>

                    <div className="management-stat-icon inactive">
                        !
                    </div>

                </div>

            </div>


            {/* TABLE PANEL */}

            <div className="management-panel">

                {/* FILTER BAR */}

                <div className="management-filter-bar">

                    <div className="management-search">

                        <span>
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search departments..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
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
                                    Department
                                </th>

                                <th>
                                    Created Date
                                </th>

                                <th>
                                    Status
                                </th>

                                <th className="action-column">
                                    Action
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
                                        Loading departments...
                                    </td>

                                </tr>

                            ) : filteredDepartments.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="table-message"
                                    >
                                        <div className="empty-state">

                                            <div>
                                                ▦
                                            </div>

                                            <strong>
                                                No departments found
                                            </strong>

                                            <span>
                                                Try changing your
                                                search or filter.
                                            </span>

                                        </div>
                                    </td>

                                </tr>

                            ) : (

                                filteredDepartments.map(
                                    (department, index) => (

                                        <tr
                                            key={
                                                department.departmentId
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>


                                            <td>

                                                <div className="department-name-cell">

                                                    <div className="department-avatar">
                                                        {department.departmentName
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                department.departmentName
                                                            }
                                                        </strong>

                                                        <span>
                                                            ID:{" "}
                                                            {
                                                                department.departmentId
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                {department.departmentOndate
                                                    ? new Date(
                                                          department.departmentOndate
                                                      ).toLocaleDateString(
                                                          "en-IN",
                                                          {
                                                              day: "2-digit",
                                                              month: "short",
                                                              year: "numeric"
                                                          }
                                                      )
                                                    : "—"}

                                            </td>


                                            <td>

                                                <span
                                                    className={`status-badge ${
                                                        department.departmentStatus ===
                                                        "Active"
                                                            ? "status-active"
                                                            : "status-inactive"
                                                    }`}
                                                >

                                                    <span className="status-dot">
                                                    </span>

                                                    {department.departmentStatus ===
                                                    "Active"
                                                        ? "Active"
                                                        : "Inactive"}

                                                </span>

                                            </td>


                                            <td>

                                                <div className="table-actions">

                                                    <button
                                                        className="icon-button"
                                                        title="Edit"
                                                        onClick={() =>
                                                            openEditModal(
                                                                department
                                                            )
                                                        }
                                                    >
                                                        ✎
                                                    </button>


                                                    <button
                                                        className={`icon-button ${
                                                            department.departmentStatus ===
                                                            "Active"
                                                                ? "danger-action"
                                                                : "success-action"
                                                        }`}
                                                        title={
                                                            department.departmentStatus ===
                                                            "Active"
                                                                ? "Deactivate"
                                                                : "Activate"
                                                        }
                                                        onClick={() =>
                                                            toggleStatus(
                                                                department
                                                            )
                                                        }
                                                    >
                                                        {department.departmentStatus ===
                                                        "Active"
                                                            ? "−"
                                                            : "✓"}
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


            {/* ADD / EDIT MODAL */}

            {showModal && (

                <div
                    className="modal-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div
                        className="department-modal"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <h3>
                                    {editingDepartment
                                        ? "Edit Department"
                                        : "Add Department"}
                                </h3>

                                <p>
                                    {editingDepartment
                                        ? "Update department information."
                                        : "Create a new organization department."}
                                </p>

                            </div>

                            <button
                                className="modal-close"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="modal-body">

                                {error && (

                                    <div className="modal-error">
                                        {error}
                                    </div>

                                )}


                                <div className="form-group">

                                    <label>
                                        Department Name
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter department name"
                                        value={
                                            departmentName
                                        }
                                        onChange={(e) =>
                                            setDepartmentName(
                                                e.target.value
                                            )
                                        }
                                        autoFocus
                                        maxLength="100"
                                    />

                                </div>


                                {editingDepartment && (

                                    <div className="form-group">

                                        <label>
                                            Status
                                        </label>

                                        <select
                                            value={
                                                editingDepartment.departmentStatus
                                            }
                                            onChange={(e) =>
                                                setEditingDepartment(
                                                    {
                                                        ...editingDepartment,
                                                        departmentStatus:
                                                            e.target.value
                                                    }
                                                )
                                            }
                                        >

                                            <option value="Active">
                                                Active
                                            </option>

                                            <option value="InActive">
                                                Inactive
                                            </option>

                                        </select>

                                    </div>

                                )}

                            </div>


                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={closeModal}
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
                                        : editingDepartment
                                        ? "Update Department"
                                        : "Create Department"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Departments;