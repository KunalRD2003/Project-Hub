import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Employees() {

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        employeeCode: "",
        employeeName: "",
        employeeUsername: "",
        employeePassword: "",
        employeeEmail: "",
        employeePhone: "",
        departmentId: "",
        designationId: ""
    });

    /* ==========================
       LOAD EMPLOYEES
    ========================== */

    const loadEmployees = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/employees");

            setEmployees(response.data);

        } catch (error) {

            console.error(
                "Unable to load employees",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    /* ==========================
       LOAD DEPARTMENTS
    ========================== */

    const loadDepartments = async () => {

        try {

            const response =
                await api.get("/departments/active");

            setDepartments(response.data);

        } catch (error) {

            console.error(
                "Unable to load departments",
                error
            );
        }
    };

    /* ==========================
       LOAD DESIGNATIONS
    ========================== */

    const loadDesignations = async () => {

        try {

            const response =
                await api.get("/designations/active");

            setDesignations(response.data);

        } catch (error) {

            console.error(
                "Unable to load designations",
                error
            );
        }
    };

    /* ==========================
       LOAD ALL DATA
    ========================== */

    useEffect(() => {

        loadEmployees();
        loadDepartments();
        loadDesignations();

    }, []);

    /* ==========================
       FORM CHANGE
    ========================== */

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

    /* ==========================
       CREATE EMPLOYEE
    ========================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setSaving(true);

        try {

            const employeeData = {

                employeeCode:
                    formData.employeeCode,

                employeeName:
                    formData.employeeName,

                employeeUsername:
                    formData.employeeUsername,

                employeePassword:
                    formData.employeePassword,

                employeeEmail:
                    formData.employeeEmail,

                employeePhone:
                    formData.employeePhone,

                department:
                    formData.departmentId
                        ? {
                            departmentId:
                                Number(formData.departmentId)
                        }
                        : null,

                designation:
                    formData.designationId
                        ? {
                            designationId:
                                Number(formData.designationId)
                        }
                        : null
            };

            await api.post(
                "/employees",
                employeeData
            );

            alert(
                "Employee account created successfully."
            );

            closeModal();

            await loadEmployees();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data ||
                "Unable to create employee."
            );

        } finally {

            setSaving(false);
        }
    };

    /* ==========================
       CLOSE MODAL
    ========================== */

    const closeModal = () => {

        setShowModal(false);

        setFormData({
            employeeCode: "",
            employeeName: "",
            employeeUsername: "",
            employeePassword: "",
            employeeEmail: "",
            employeePhone: "",
            departmentId: "",
            designationId: ""
        });
    };

    /* ==========================
       FILTER EMPLOYEES
    ========================== */

    const filteredEmployees = useMemo(() => {

        return employees.filter(employee => {

            const keyword =
                search.toLowerCase().trim();

            const matchesSearch =
                !keyword ||
                employee.employeeName
                    ?.toLowerCase()
                    .includes(keyword) ||
                employee.employeeCode
                    ?.toLowerCase()
                    .includes(keyword) ||
                employee.employeeUsername
                    ?.toLowerCase()
                    .includes(keyword) ||
                employee.employeeEmail
                    ?.toLowerCase()
                    .includes(keyword);

            const matchesStatus =
                statusFilter === "All" ||
                employee.employeeStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });

    }, [employees, search, statusFilter]);

    /* ==========================
       STATISTICS
    ========================== */

    const totalEmployees =
        employees.length;

    const activeEmployees =
        employees.filter(
            employee =>
                employee.employeeStatus === "Active"
        ).length;

    const inactiveEmployees =
        employees.filter(
            employee =>
                employee.employeeStatus === "InActive"
        ).length;

    return (
        <>

            {/* PAGE HEADER */}

            <div className="page-header">

                <div>

                    <h2>
                        Employee Management
                    </h2>

                    <p>
                        Manage employee accounts,
                        access and information.
                    </p>

                </div>

                <button
                    className="primary-btn"
                    onClick={() =>
                        setShowModal(true)
                    }
                >
                    + Add Employee
                </button>

            </div>


            {/* STATISTICS */}

            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-card-title">
                        Total Employees
                    </div>

                    <div className="stat-card-value">
                        {totalEmployees}
                    </div>

                    <div className="stat-card-footer">
                        All employee accounts
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-card-title">
                        Active Employees
                    </div>

                    <div className="stat-card-value">
                        {activeEmployees}
                    </div>

                    <div className="stat-card-footer">
                        Currently active
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-card-title">
                        Inactive Employees
                    </div>

                    <div className="stat-card-value">
                        {inactiveEmployees}
                    </div>

                    <div className="stat-card-footer">
                        Inactive accounts
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-card-title">
                        Departments
                    </div>

                    <div className="stat-card-value">
                        {departments.length}
                    </div>

                    <div className="stat-card-footer">
                        Active departments
                    </div>

                </div>

            </div>


            {/* TABLE */}

            <div className="table-card">

                <div className="table-toolbar">

                    <input
                        className="search-box"
                        type="text"
                        placeholder="Search employees..."
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
                        Loading employees...
                    </div>

                ) : filteredEmployees.length === 0 ? (

                    <div
                        style={{
                            padding: "50px",
                            textAlign: "center"
                        }}
                    >

                        <strong>
                            No employees found
                        </strong>

                        <p>
                            Try changing your search
                            or add a new employee.
                        </p>

                    </div>

                ) : (

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>
                                    Employee
                                </th>

                                <th>
                                    Code
                                </th>

                             
                                <th>
                                    Department
                                </th>

                                <th>
                                    Designation
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

                            {filteredEmployees.map(
                                employee => (

                                    <tr
                                        key={
                                            employee.employeeId
                                        }
                                    >

                                        <td>

                                            <strong>
                                                {
                                                    employee.employeeName
                                                }
                                            </strong>

                                        </td>

                                        <td>
                                            {
                                                employee.employeeCode
                                            }
                                        </td>

                                    

                                        <td>
                                            {
                                                employee.department
                                                    ?.departmentName ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                employee.designation
                                                    ?.designationName ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    employee.employeeStatus === "Active"
                                                        ? "status-active"
                                                        : "status-inactive"
                                                }
                                            >
                                                {employee.employeeStatus === "Active"
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>
                                        <td>

                                            <button
                                                onClick={() => navigate(`/admin/employees/${employee.employeeId}`)}
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>

            {/* ADD EMPLOYEE MODAL */}

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

                        <div className="modal-header">

                            <div>

                                <h3>
                                    Create Employee Account
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
                                    Create login credentials
                                    for a new employee.
                                </p>

                            </div>

                            <button
                                className="modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleSubmit}>

                            <div className="modal-body">

                                <div className="form-grid">

                                    <div className="form-group">

                                        <label>
                                            Employee Code *
                                        </label>

                                        <input
                                            name="employeeCode"
                                            value={
                                                formData.employeeCode
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. EMP001"
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Employee Name *
                                        </label>

                                        <input
                                            name="employeeName"
                                            value={
                                                formData.employeeName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter full name"
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Username *
                                        </label>

                                        <input
                                            name="employeeUsername"
                                            value={
                                                formData.employeeUsername
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Login username"
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Password *
                                        </label>

                                        <input
                                            type="password"
                                            name="employeePassword"
                                            value={
                                                formData.employeePassword
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Set password"
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Email *
                                        </label>

                                        <input
                                            type="email"
                                            name="employeeEmail"
                                            value={
                                                formData.employeeEmail
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="employee@company.com"
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Phone
                                        </label>

                                        <input
                                            name="employeePhone"
                                            value={
                                                formData.employeePhone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Phone number"
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Department *
                                        </label>

                                        <select
                                            name="departmentId"
                                            value={
                                                formData.departmentId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Select Department
                                            </option>

                                            {departments.map(
                                                department => (

                                                    <option
                                                        key={
                                                            department.departmentId
                                                        }
                                                        value={
                                                            department.departmentId
                                                        }
                                                    >
                                                        {
                                                            department.departmentName
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Designation *
                                        </label>

                                        <select
                                            name="designationId"
                                            value={
                                                formData.designationId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Select Designation
                                            </option>

                                            {designations.map(
                                                designation => (

                                                    <option
                                                        key={
                                                            designation.designationId
                                                        }
                                                        value={
                                                            designation.designationId
                                                        }
                                                    >
                                                        {
                                                            designation.designationName
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                </div>

                            </div>


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
                                        ? "Creating..."
                                        : "Create Employee"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </>
    );
}

export default Employees;