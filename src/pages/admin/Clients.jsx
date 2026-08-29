import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function Clients() {

    const [clients, setClients] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    const [formData, setFormData] = useState({
        clientName: "",
        clientAddress: "",
        clientStateId: "",
        clientCityId: "",
        clientStatus: "Active",
        clientOnDate: ""
    });


    /* ==========================
       LOAD CLIENTS
    ========================== */

    const loadClients = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/clients");

            setClients(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Unable to load clients",
                error
            );

            setClients([]);

        } finally {

            setLoading(false);

        }

    };


    /* ==========================
       LOAD STATES
    ========================== */

    const loadStates = async () => {

        try {

            const response =
                await api.get("/states/active");

            setStates(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Unable to load states",
                error
            );

            setStates([]);

        }

    };


    /* ==========================
       LOAD CITIES BY STATE
    ========================== */

    const loadCities = async (stateId) => {

        if (!stateId) {

            setCities([]);

            return;

        }


        try {

            console.log(
                "Loading cities for State ID:",
                stateId
            );


            const response =
                await api.get(
                    `/cities/state/${stateId}`
                );


            console.log(
                "Cities API Response:",
                response.data
            );


            if (Array.isArray(response.data)) {

                setCities(response.data);

            } else {

                setCities([]);

            }

        } catch (error) {

            console.error(
                "Unable to load cities",
                error
            );


            console.error(
                "City API Error Response:",
                error.response?.data
            );


            setCities([]);

        }

    };


    /* ==========================
       INITIAL LOAD
    ========================== */

    useEffect(() => {

        loadClients();

        loadStates();

    }, []);


    /* ==========================
       HANDLE FORM CHANGE
    ========================== */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        /* ==========================
           STATE CHANGE
        ========================== */

        if (name === "clientStateId") {

            setFormData(previous => ({

                ...previous,

                clientStateId: value,

                clientCityId: ""

            }));


            setCities([]);


            if (value) {

                loadCities(value);

            }


            return;

        }


        /* ==========================
           OTHER FIELDS
        ========================== */

        setFormData(previous => ({

            ...previous,

            [name]: value

        }));

    };


    /* ==========================
       OPEN ADD MODAL
    ========================== */

    const openAddModal = () => {

        setEditingClient(null);

        setCities([]);


        setFormData({

            clientName: "",

            clientAddress: "",

            clientStateId: "",

            clientCityId: "",

            clientStatus: "Active",

            clientOnDate: ""

        });


        setShowModal(true);

    };


    /* ==========================
       OPEN EDIT MODAL
    ========================== */

    const openEditModal = async (client) => {

        setEditingClient(client);


        const stateId =
            client.clientStateId ||
            client.stateId ||
            client.state?.stateId ||
            "";


        const cityId =
            client.clientCityId ||
            client.cityId ||
            client.city?.cityId ||
            "";


        setFormData({

            clientName:
                client.clientName || "",

            clientAddress:
                client.clientAddress || "",

            clientStateId:
                stateId
                    ? String(stateId)
                    : "",

            clientCityId:
                cityId
                    ? String(cityId)
                    : "",

            clientStatus:
                client.clientStatus || "Active",

            clientOnDate:
                client.clientOnDate
                    ? client.clientOnDate.substring(0, 10)
                    : ""

        });


        setCities([]);


        /*
         * First load cities according
         * to selected state.
         */

        if (stateId) {

            await loadCities(stateId);

        }


        setShowModal(true);

    };


    /* ==========================
       CREATE / UPDATE CLIENT
    ========================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setSaving(true);


        try {

            const requestData = {

                clientName:
                    formData.clientName,

                clientAddress:
                    formData.clientAddress,

                clientStateId:
                    formData.clientStateId
                        ? Number(
                            formData.clientStateId
                        )
                        : null,

                clientCityId:
                    formData.clientCityId
                        ? Number(
                            formData.clientCityId
                        )
                        : null,

                clientStatus:
                    formData.clientStatus,

                clientOnDate:
                    formData.clientOnDate
                        ? `${formData.clientOnDate}T00:00:00`
                        : null

            };


            console.log(
                "Client Request:",
                requestData
            );


            /* ==========================
               UPDATE
            ========================== */

            if (editingClient) {

                await api.put(

                    `/clients/${editingClient.clientId}`,

                    requestData

                );


                alert(
                    "Client updated successfully."
                );

            }


            /* ==========================
               CREATE
            ========================== */

            else {

                await api.post(

                    "/clients",

                    requestData

                );


                alert(
                    "Client created successfully."
                );

            }


            closeModal();

            await loadClients();

        } catch (error) {

            console.error(
                "Unable to save client",
                error
            );


            console.error(
                "Save Error Response:",
                error.response?.data
            );


            alert(
                error.response?.data ||
                "Unable to save client."
            );

        } finally {

            setSaving(false);

        }

    };


    /* ==========================
       DELETE CLIENT
    ========================== */

    const handleDelete = async (clientId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this client?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            await api.delete(
                `/clients/${clientId}`
            );


            alert(
                "Client deleted successfully."
            );


            await loadClients();

        } catch (error) {

            console.error(
                "Unable to delete client",
                error
            );


            alert(
                error.response?.data ||
                "Unable to delete client."
            );

        }

    };


    /* ==========================
       CLOSE MODAL
    ========================== */

    const closeModal = () => {

        setShowModal(false);

        setEditingClient(null);

        setCities([]);


        setFormData({

            clientName: "",

            clientAddress: "",

            clientStateId: "",

            clientCityId: "",

            clientStatus: "Active",

            clientOnDate: ""

        });

    };


    /* ==========================
       FILTER CLIENTS
    ========================== */

    const filteredClients = useMemo(() => {

        return clients.filter(client => {

            const keyword =
                search
                    .toLowerCase()
                    .trim();


            const matchesSearch =
                !keyword ||

                client.clientName
                    ?.toLowerCase()
                    .includes(keyword) ||

                client.clientCity
                    ?.toLowerCase()
                    .includes(keyword) ||

                client.clientState
                    ?.toLowerCase()
                    .includes(keyword);


            const matchesStatus =
                statusFilter === "All" ||

                client.clientStatus ===
                statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        clients,
        search,
        statusFilter
    ]);


    /* ==========================
       STATISTICS
    ========================== */

    const totalClients =
        clients.length;


    const activeClients =
        clients.filter(
            client =>
                client.clientStatus ===
                "Active"
        ).length;


    const inactiveClients =
        clients.filter(
            client =>
                client.clientStatus ===
                "InActive"
        ).length;


    const locationCount =
        new Set(

            clients
                .map(
                    client =>
                        client.clientState
                )
                .filter(Boolean)

        ).size;


    return (

        <>


            {/* ==========================
                PAGE HEADER
            ========================== */}

            <div className="page-header">

                <div>

                    <h2>
                        Client Management
                    </h2>

                    <p>
                        Manage client information,
                        status and details.
                    </p>

                </div>


                <button
                    className="primary-btn"
                    onClick={openAddModal}
                >

                    + Add Client

                </button>

            </div>


            {/* ==========================
                STATISTICS
            ========================== */}

            <div className="stats-grid">


                <div className="stat-card">

                    <div className="stat-card-title">
                        Total Clients
                    </div>

                    <div className="stat-card-value">
                        {totalClients}
                    </div>

                    <div className="stat-card-footer">
                        All client accounts
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-card-title">
                        Active Clients
                    </div>

                    <div className="stat-card-value">
                        {activeClients}
                    </div>

                    <div className="stat-card-footer">
                        Currently active
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-card-title">
                        Inactive Clients
                    </div>

                    <div className="stat-card-value">
                        {inactiveClients}
                    </div>

                    <div className="stat-card-footer">
                        Inactive clients
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-card-title">
                        Client Locations
                    </div>

                    <div className="stat-card-value">
                        {locationCount}
                    </div>

                    <div className="stat-card-footer">
                        States covered
                    </div>

                </div>

            </div>


            {/* ==========================
                TABLE
            ========================== */}

            <div className="table-card">


                <div className="table-toolbar">

                    <input
                        className="search-box"
                        type="text"
                        placeholder="Search clients..."
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

                        <option value="Active">
                            Active
                        </option>

                        <option value="InActive">
                            Inactive
                        </option>

                    </select>

                </div>


                {loading ? (

                    <div
                        style={{
                            padding: "50px",
                            textAlign: "center"
                        }}
                    >

                        Loading clients...

                    </div>

                ) : filteredClients.length === 0 ? (

                    <div
                        style={{
                            padding: "50px",
                            textAlign: "center"
                        }}
                    >

                        <strong>
                            No clients found
                        </strong>

                        <p>
                            Try changing your search
                            or add a new client.
                        </p>

                    </div>

                ) : (

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>
                                    Client
                                </th>


                                <th>
                                    City
                                </th>

                             
                                <th>
                                    Status
                                </th>

                                <th>
                                    On Date
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredClients.map(
                                client => (

                                    <tr
                                        key={
                                            client.clientId
                                        }
                                    >

                                        <td>

                                            <strong>
                                                {
                                                    client.clientName
                                                }
                                            </strong>

                                        </td>


                                      


                                        <td>

                                            {
                                                client.clientCity ||
                                                "-"
                                            }

                                        </td>


                                  

                                        <td>

                                            <span
                                                className={`status-badge ${client.clientStatus ===
                                                        "Active"
                                                        ? "status-active"
                                                        : "status-inactive"
                                                    }`}
                                            >

                                                {
                                                    client.clientStatus ===
                                                        "Active"
                                                        ? "Active"
                                                        : "Inactive"
                                                }

                                            </span>

                                        </td>


                                        <td>

                                            {
                                                client.clientOnDate

                                                    ? new Date(
                                                        client.clientOnDate
                                                    ).toLocaleDateString()

                                                    : "-"
                                            }

                                        </td>


                                        <td>

                                            <button
                                                className="secondary-btn"
                                                style={{
                                                    padding:
                                                        "5px 10px",
                                                    marginRight:
                                                        "5px"
                                                }}
                                                onClick={() =>
                                                    openEditModal(
                                                        client
                                                    )
                                                }
                                            >

                                                Edit

                                            </button>


                                            <button
                                                className="secondary-btn"
                                                style={{
                                                    padding:
                                                        "5px 10px"
                                                }}
                                                onClick={() =>
                                                    handleDelete(
                                                        client.clientId
                                                    )
                                                }
                                            >

                                                Delete

                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>


            {/* ==========================
                ADD / EDIT MODAL
            ========================== */}

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


                        {/* ==========================
                            MODAL HEADER
                        ========================== */}

                        <div className="modal-header">

                            <div>

                                <h3>

                                    {
                                        editingClient
                                            ? "Edit Client"
                                            : "Create Client"
                                    }

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

                                    {
                                        editingClient
                                            ? "Update client information."
                                            : "Add a new client to the system."
                                    }

                                </p>

                            </div>


                            <button
                                className="modal-close"
                                onClick={closeModal}
                            >

                                ×

                            </button>

                        </div>


                        {/* ==========================
                            FORM
                        ========================== */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="modal-body">

                                <div className="form-grid">


                                    {/* CLIENT NAME */}

                                    <div className="form-group">

                                        <label>
                                            Client Name *
                                        </label>

                                        <input
                                            name="clientName"
                                            value={
                                                formData.clientName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter client name"
                                            required
                                        />

                                    </div>


                                    {/* ADDRESS */}

                                    <div className="form-group">

                                        <label>
                                            Address
                                        </label>

                                        <input
                                            name="clientAddress"
                                            value={
                                                formData.clientAddress
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter client address"
                                        />

                                    </div>


                                    {/* STATE */}

                                    <div className="form-group">

                                        <label>
                                            State *
                                        </label>

                                        <select
                                            name="clientStateId"
                                            value={
                                                formData.clientStateId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Select State
                                            </option>


                                            {states.map(
                                                state => (

                                                    <option
                                                        key={
                                                            state.stateId
                                                        }
                                                        value={
                                                            String(
                                                                state.stateId
                                                            )
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


                                    {/* ==========================
                                        CITY
                                    ========================== */}

                                    <div className="form-group">

                                        <label>
                                            City *
                                        </label>


                                        <select
                                            name="clientCityId"
                                            value={
                                                formData.clientCityId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !formData.clientStateId
                                            }
                                            required
                                        >

                                            <option value="">

                                                {
                                                    !formData.clientStateId

                                                        ? "Select State First"

                                                        : cities.length === 0

                                                            ? "No Cities Available"

                                                            : "Select City"
                                                }

                                            </option>


                                            {cities.map(
                                                city => (

                                                    <option
                                                        key={
                                                            city.cityId
                                                        }
                                                        value={
                                                            String(
                                                                city.cityId
                                                            )
                                                        }
                                                    >

                                                        {
                                                            city.cityName
                                                        }

                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {/* STATUS */}

                                    <div className="form-group">

                                        <label>
                                            Status *
                                        </label>

                                        <select
                                            name="clientStatus"
                                            value={
                                                formData.clientStatus
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="Active">
                                                Active
                                            </option>

                                            <option value="InActive">
                                                Inactive
                                            </option>

                                        </select>

                                    </div>


                                    {/* DATE */}

                                    <div className="form-group">

                                        <label>
                                            Client On Date *
                                        </label>

                                        <input
                                            type="date"
                                            name="clientOnDate"
                                            value={formData.clientOnDate}
                                            onChange={handleChange}
                                            onClick={(event) => {
                                                event.target.showPicker?.();
                                            }}
                                            style={{
                                                cursor: "pointer"
                                            }}
                                            required
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* ==========================
                                FOOTER
                            ========================== */}

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

                                    {
                                        saving

                                            ? "Saving..."

                                            : editingClient

                                                ? "Update Client"

                                                : "Create Client"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </>

    );

}

export default Clients;