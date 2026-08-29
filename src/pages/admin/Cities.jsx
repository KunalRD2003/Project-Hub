import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function Cities() {

    const [cities, setCities] = useState([]);

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
        cityName: "",
        stateId: "",
        cityStatus: "Active"
    });


    // =====================================================
    // LOAD CITIES + STATES
    // =====================================================

    useEffect(() => {

        loadCities();
        loadStates();

    }, []);


    // =====================================================
    // LOAD CITIES
    // =====================================================

    const loadCities = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/cities");

            console.log(
                "City API response:",
                response.data
            );

            setCities(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "City API error:",
                err
            );

            setError(
                err.response?.data ||
                "Unable to load cities."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD STATES
    // =====================================================

    const loadStates = async () => {

        try {

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

        }

    };


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    const filteredCities = useMemo(() => {

        return cities.filter((city) => {

            const name =
                city.cityName
                    ?.toLowerCase() || "";

            const stateName =
                city.state?.stateName
                    ?.toLowerCase() || "";

            const matchesSearch =
                name.includes(
                    search.toLowerCase()
                ) ||
                stateName.includes(
                    search.toLowerCase()
                );

            const matchesStatus =
                statusFilter === "" ||
                city.cityStatus === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        cities,
        search,
        statusFilter
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalCities =
        cities.length;


    const activeCities =
        cities.filter(
            city =>
                city.cityStatus === "Active"
        ).length;


    const inactiveCities =
        cities.filter(
            city =>
                city.cityStatus === "InActive"
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
    // ADD CITY
    // =====================================================

    const handleAdd = () => {

        setEditingId(null);

        setFormData({
            cityName: "",
            stateId: "",
            cityStatus: "Active"
        });

        setError("");

        setShowModal(true);

    };


    // =====================================================
    // EDIT CITY
    // =====================================================

    const handleEdit = (city) => {

        setEditingId(
            city.cityId
        );

        setFormData({

            cityName:
                city.cityName || "",

            stateId:
                city.state?.stateId || "",

            cityStatus:
                city.cityStatus || "Active"

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
            cityName: "",
            stateId: "",
            cityStatus: "Active"
        });

    };


    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!formData.cityName.trim()) {

            setError(
                "City name is required."
            );

            return;

        }


        if (!formData.stateId) {

            setError(
                "State is required."
            );

            return;

        }


        try {

            setSaving(true);

            setError("");

            setSuccess("");


            const requestData = {

                cityName:
                    formData.cityName.trim(),

                state: {
                    stateId:
                        Number(formData.stateId)
                },

                cityStatus:
                    formData.cityStatus

            };


            // UPDATE

            if (editingId) {

                await api.put(
                    `/cities/${editingId}`,
                    requestData
                );

                setSuccess(
                    "City updated successfully."
                );

            }


            // CREATE

            else {

                await api.post(
                    "/cities",
                    requestData
                );

                setSuccess(
                    "City created successfully."
                );

            }


            setShowModal(false);

            setEditingId(null);

            setFormData({
                cityName: "",
                stateId: "",
                cityStatus: "Active"
            });


            await loadCities();


        } catch (err) {

            console.error(
                "Save city error:",
                err
            );

            setError(
                err.response?.data ||
                "Unable to save city."
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
            "Are you sure you want to delete this city?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await api.delete(`/cities/${id}`);

            setCities(previousCities =>
                previousCities.filter(
                    city =>
                        Number(city.cityId) !== Number(id)
                )
            );

            setSuccess(
                "City deleted successfully."
            );

        } catch (err) {

            console.error(
                "Delete city error:",
                err
            );

            setError(
                err.response?.data ||
                "Unable to delete city."
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
                        City Management
                    </h2>

                    <p>
                        Manage cities and their status.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={handleAdd}
                >
                    + Add City
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
                            Total Cities
                        </span>

                        <strong>
                            {totalCities}
                        </strong>

                    </div>

                    <div className="management-stat-icon">
                        C
                    </div>

                </div>


                {/* ACTIVE */}

                <div className="management-stat-card">

                    <div>

                        <span>
                            Active Cities
                        </span>

                        <strong>
                            {activeCities}
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
                            Inactive Cities
                        </span>

                        <strong>
                            {inactiveCities}
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
                            placeholder="Search cities..."
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
                                    CITY
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
                                        colSpan="5"
                                        className="table-message"
                                    >
                                        Loading cities...
                                    </td>

                                </tr>

                            ) : filteredCities.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="table-message"
                                    >

                                        <div className="empty-state">

                                            <div>
                                                C
                                            </div>

                                            <strong>
                                                No cities found
                                            </strong>

                                            <span>
                                                Try changing your search or filter.
                                            </span>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredCities.map(
                                    (city, index) => (

                                        <tr
                                            key={
                                                city.cityId
                                            }
                                        >


                                            {/* NUMBER */}

                                            <td>
                                                {index + 1}
                                            </td>


                                            {/* CITY */}

                                            <td>

                                                <div className="department-name-cell">

                                                    <div className="department-avatar">

                                                        {
                                                            city.cityName
                                                                ?.charAt(0)
                                                                .toUpperCase()
                                                        }

                                                    </div>


                                                    <div>

                                                        <strong>

                                                            {
                                                                city.cityName
                                                            }

                                                        </strong>

                                                        <span>
                                                            City
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* STATE */}

                                            <td>

                                                {
                                                    city.state?.stateName ||
                                                    "-"
                                                }

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        city.cityStatus ===
                                                            "Active"

                                                            ? "status-badge status-active"

                                                            : "status-badge status-inactive"
                                                    }
                                                >

                                                    <span className="status-dot"></span>

                                                    {
                                                        city.cityStatus ===
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
                                                                city
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
                                                                city.cityId
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
                                        ? "Edit City"
                                        : "Add City"}

                                </h3>


                                <p>

                                    {editingId
                                        ? "Update city information."
                                        : "Create a new city."}

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


                                {/* CITY NAME */}

                                <div className="form-group">

                                    <label>

                                        City Name

                                        <span>
                                            *
                                        </span>

                                    </label>


                                    <input
                                        type="text"
                                        name="cityName"
                                        value={
                                            formData.cityName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter city name"
                                        autoFocus
                                    />

                                </div>


                                {/* STATE */}

                                <div className="form-group">

                                    <label>

                                        State

                                        <span>
                                            *
                                        </span>

                                    </label>


                                    <select
                                        name="stateId"
                                        value={
                                            formData.stateId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="">
                                            Select state
                                        </option>

                                        {states.map(
                                            (state) => (

                                                <option
                                                    key={
                                                        state.stateId
                                                    }
                                                    value={
                                                        state.stateId
                                                    }
                                                >

                                                    {
                                                        state.stateName
                                                    }

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* STATUS */}

                                <div className="form-group">

                                    <label>
                                        Status
                                    </label>


                                    <select
                                        name="cityStatus"
                                        value={
                                            formData.cityStatus
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
                                            ? "Update City"
                                            : "Create City"
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

export default Cities;