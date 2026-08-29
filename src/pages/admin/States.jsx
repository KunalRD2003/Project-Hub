import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function States() {

    const [states, setStates] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        stateName: "",
        stateStatus: "Active"
    });


    // =====================================================
    // LOAD STATES
    // =====================================================

    useEffect(() => {

        loadStates();

    }, []);


    const loadStates = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/states");

            console.log(
                "State API response:",
                response.data
            );

            setStates(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "State API error:",
                err
            );

            setError(
                err.response?.data ||
                "Unable to load states."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    const filteredStates = useMemo(() => {

        return states.filter((state) => {

            const name =
                state.stateName
                    ?.toLowerCase() || "";

            const matchesSearch =
                name.includes(
                    search.toLowerCase()
                );

            const matchesStatus =
                statusFilter === "" ||
                state.stateStatus === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        states,
        search,
        statusFilter
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalStates =
        states.length;


    const activeStates =
        states.filter(
            state =>
                state.stateStatus === "Active"
        ).length;


    const inactiveStates =
        states.filter(
            state =>
                state.stateStatus === "InActive"
        ).length;


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

    };


    // =====================================================
    // ADD STATE
    // =====================================================

    const handleAdd = () => {

        setEditingId(null);

        setFormData({
            stateName: "",
            stateStatus: "Active"
        });

        setError("");

        setShowModal(true);

    };


    // =====================================================
    // EDIT STATE
    // =====================================================

    const handleEdit = (state) => {

        setEditingId(
            state.stateId
        );

        setFormData({

            stateName:
                state.stateName || "",

            stateStatus:
                state.stateStatus || "Active"

        });

        setError("");

        setShowModal(true);

    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleCloseModal = () => {

        if (saving) {
            return;
        }

        setShowModal(false);

        setEditingId(null);

        setFormData({
            stateName: "",
            stateStatus: "Active"
        });

    };


    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!formData.stateName.trim()) {

            setError(
                "State name is required."
            );

            return;

        }


        try {

            setSaving(true);

            setError("");

            setSuccess("");


            const requestData = {

                stateName:
                    formData.stateName.trim(),

                stateStatus:
                    formData.stateStatus

            };


            // UPDATE

            if (editingId) {

                await api.put(
                    `/states/${editingId}`,
                    requestData
                );

                setSuccess(
                    "State updated successfully."
                );

            }


            // CREATE

            else {

                await api.post(
                    "/states",
                    requestData
                );

                setSuccess(
                    "State created successfully."
                );

            }


            setShowModal(false);

            setEditingId(null);

            setFormData({
                stateName: "",
                stateStatus: "Active"
            });


            await loadStates();


        } catch (err) {

            console.error(
                "Save state error:",
                err
            );

            setError(
                err.response?.data ||
                "Unable to save state."
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
            "Are you sure you want to delete this state?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await api.delete(`/states/${id}`);

            // Remove from UI
            setStates(previousStates =>
                previousStates.filter(
                    state =>
                        Number(state.stateId) !== Number(id)
                )
            );

            setSuccess(
                "State deleted successfully."
            );

        } catch (err) {

            console.error(
                "Delete state error:",
                err
            );

            setError(
                err.response?.data ||
                "Unable to delete state."
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
                        State Management
                    </h2>

                    <p>
                        Manage states and their status.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={handleAdd}
                >
                    + Add State
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
                        onClick={() =>
                            setSuccess("")
                        }
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
                        onClick={() =>
                            setError("")
                        }
                    >
                        ×
                    </button>

                </div>

            )}


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="management-stats">


                {/* TOTAL */}

                <div className="management-stat-card">

                    <div>

                        <span>
                            Total States
                        </span>

                        <strong>
                            {totalStates}
                        </strong>

                    </div>

                    <div className="management-stat-icon">
                        S
                    </div>

                </div>


                {/* ACTIVE */}

                <div className="management-stat-card">

                    <div>

                        <span>
                            Active States
                        </span>

                        <strong>
                            {activeStates}
                        </strong>

                    </div>

                    <div className="management-stat-icon active">
                        ✓
                    </div>

                </div>


                {/* INACTIVE */}

                <div className="management-stat-card">

                    <div>

                        <span>
                            Inactive States
                        </span>

                        <strong>
                            {inactiveStates}
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


                    {/* SEARCH */}

                    <div className="management-search">

                        <span>
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search states..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* STATUS */}

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
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


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="management-table-wrapper">

                    <table className="management-table">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    STATE
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


                            {/* LOADING */}

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="table-message"
                                    >
                                        Loading states...
                                    </td>

                                </tr>

                            ) : filteredStates.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="table-message"
                                    >

                                        <div className="empty-state">

                                            <div>
                                                S
                                            </div>

                                            <strong>
                                                No states found
                                            </strong>

                                            <span>
                                                Try changing your search or filter.
                                            </span>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredStates.map(
                                    (state, index) => (

                                        <tr
                                            key={
                                                state.stateId
                                            }
                                        >


                                            {/* NUMBER */}

                                            <td>
                                                {index + 1}
                                            </td>


                                            {/* STATE */}

                                            <td>

                                                <div className="department-name-cell">

                                                    <div className="department-avatar">

                                                        {
                                                            state.stateName
                                                                ?.charAt(0)
                                                                .toUpperCase()
                                                        }

                                                    </div>


                                                    <div>

                                                        <strong>

                                                            {
                                                                state.stateName
                                                            }

                                                        </strong>

                                                        <span>
                                                            State
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        state.stateStatus ===
                                                            "Active"

                                                            ? "status-badge status-active"

                                                            : "status-badge status-inactive"
                                                    }
                                                >

                                                    <span className="status-dot"></span>

                                                    {
                                                        state.stateStatus ===
                                                            "Active"
                                                            ? "Active"
                                                            : "Inactive"
                                                    }

                                                </span>

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                <div className="table-actions">


                                                    {/* EDIT */}

                                                    <button
                                                        className="icon-button"
                                                        title="Edit"
                                                        onClick={() =>
                                                            handleEdit(
                                                                state
                                                            )
                                                        }
                                                    >
                                                        ✎
                                                    </button>


                                                    {/* DELETE */}

                                                    <button
                                                        className="icon-button danger-action"
                                                        title="Delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                state.stateId
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


                        {/* MODAL HEADER */}

                        <div className="modal-header">

                            <div>

                                <h3>

                                    {editingId
                                        ? "Edit State"
                                        : "Add State"}

                                </h3>


                                <p>

                                    {editingId
                                        ? "Update state information."
                                        : "Create a new state."}

                                </p>

                            </div>


                            <button
                                className="modal-close"
                                onClick={
                                    handleCloseModal
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="modal-body">


                                {/* STATE NAME */}

                                <div className="form-group">

                                    <label>

                                        State Name

                                        <span>
                                            *
                                        </span>

                                    </label>


                                    <input
                                        type="text"
                                        name="stateName"
                                        value={
                                            formData.stateName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter state name"
                                        autoFocus
                                    />

                                </div>


                                {/* STATUS */}

                                <div className="form-group">

                                    <label>
                                        Status
                                    </label>


                                    <select
                                        name="stateStatus"
                                        value={
                                            formData.stateStatus
                                        }
                                        onChange={
                                            handleChange
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

                            </div>


                            {/* MODAL FOOTER */}

                            <div className="modal-footer">


                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={
                                        handleCloseModal
                                    }
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
                                            ? "Update State"
                                            : "Create State"
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

export default States;