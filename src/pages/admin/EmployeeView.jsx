import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function EmployeeView() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEmployee();
    }, [id]);

    const loadEmployee = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(`/employees/${id}`);

            setEmployee(response.data);

        } catch (error) {

            console.error(
                "Unable to load employee",
                error
            );

            alert(
                error.response?.data ||
                "Unable to load employee."
            );

        } finally {

            setLoading(false);

        }

    };


    /* ==========================
       PRINT
    ========================== */

    const handlePrint = () => {
        window.print();
    };


    /* ==========================
       LOADING
    ========================== */

    if (loading) {

        return (
            <div className="employee-view-message">
                Loading employee details...
            </div>
        );

    }


    /* ==========================
       NOT FOUND
    ========================== */

    if (!employee) {

        return (
            <div className="employee-view-message">

                <strong>
                    Employee not found
                </strong>

                <button
                    className="secondary-btn"
                    onClick={() =>
                        navigate("/admin/employees")
                    }
                >
                    ← Back to Employees
                </button>

            </div>
        );

    }


    return (

        <div className="employee-print-page">


            {/* =====================================
                ACTION BAR
            ===================================== */}

            <div className="employee-action-bar no-print">

                <button
                    className="secondary-btn"
                    onClick={() =>
                        navigate("/admin/employees")
                    }
                >
                    ← Back
                </button>

                <button
                    className="primary-btn"
                    onClick={handlePrint}
                >
                    🖨 Print
                </button>

            </div>


            {/* =====================================
                PRINTABLE DOCUMENT
            ===================================== */}

            <div className="employee-document">


                {/* =================================
                    DOCUMENT HEADER
                ================================= */}

                <div className="employee-document-header">

                    <div>

                        <h1>
                            EMPLOYEE INFORMATION
                        </h1>

                        <p>
                            Employee Details
                        </p>

                    </div>


                    <div
                        className={
                            employee.employeeStatus === "Active"
                                ? "employee-status active"
                                : "employee-status inactive"
                        }
                    >
                        {employee.employeeStatus === "Active"
                            ? "ACTIVE"
                            : "INACTIVE"}
                    </div>

                </div>


                {/* =================================
                    EMPLOYEE SUMMARY
                ================================= */}

                <table className="employee-table employee-summary-table">

                    <tbody>

                        <tr>

                            <td
                                className="employee-photo-cell"
                            >

                                <div className="employee-avatar-print">

                                    {employee.employeeName
                                        ? employee.employeeName
                                            .charAt(0)
                                            .toUpperCase()
                                        : "E"}

                                </div>

                            </td>


                            <td
                                className="employee-summary-info"
                            >

                                <strong>
                                    {
                                        employee.employeeName ||
                                        "-"
                                    }
                                </strong>

                                <span>
                                    Employee Code:{" "}
                                    {
                                        employee.employeeCode ||
                                        "-"
                                    }
                                </span>

                            </td>

                        </tr>

                    </tbody>

                </table>


                {/* =================================
                    BASIC INFORMATION
                ================================= */}

                <table className="employee-table">

                    <thead>

                        <tr>

                            <th
                                colSpan="4"
                                className="employee-section-title"
                            >
                                BASIC INFORMATION
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr>

                            <td className="employee-label">
                                Employee ID
                            </td>

                            <td className="employee-value">
                                {
                                    employee.employeeId ||
                                    "-"
                                }
                            </td>

                            <td className="employee-label">
                                Employee Code
                            </td>

                            <td className="employee-value">
                                {
                                    employee.employeeCode ||
                                    "-"
                                }
                            </td>

                        </tr>


                        <tr>

                            <td className="employee-label">
                                Employee Name
                            </td>

                            <td className="employee-value">
                                {
                                    employee.employeeName ||
                                    "-"
                                }
                            </td>

                            <td className="employee-label">
                                Username
                            </td>

                            <td className="employee-value">
                                {
                                    employee.employeeUsername ||
                                    "-"
                                }
                            </td>

                        </tr>

                    </tbody>

                </table>


                {/* =================================
                    CONTACT INFORMATION
                ================================= */}

                <table className="employee-table">

                    <thead>

                        <tr>

                            <th
                                colSpan="4"
                                className="employee-section-title"
                            >
                                CONTACT INFORMATION
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr>

                            <td className="employee-label">
                                Email
                            </td>

                            <td
                                className="employee-value"
                                colSpan="3"
                            >
                                {
                                    employee.employeeEmail ||
                                    "-"
                                }
                            </td>

                        </tr>


                        <tr>

                            <td className="employee-label">
                                Phone
                            </td>

                            <td
                                className="employee-value"
                                colSpan="3"
                            >
                                {
                                    employee.employeePhone ||
                                    "-"
                                }
                            </td>

                        </tr>

                    </tbody>

                </table>


                {/* =================================
                    JOB INFORMATION
                ================================= */}

                <table className="employee-table">

                    <thead>

                        <tr>

                            <th
                                colSpan="4"
                                className="employee-section-title"
                            >
                                JOB INFORMATION
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr>

                            <td className="employee-label">
                                Department
                            </td>

                            <td className="employee-value">
                                {
                                    employee.department
                                        ?.departmentName ||
                                    "-"
                                }
                            </td>

                            <td className="employee-label">
                                Designation
                            </td>

                            <td className="employee-value">
                                {
                                    employee.designation
                                        ?.designationName ||
                                    "-"
                                }
                            </td>

                        </tr>


                        <tr>

                            <td className="employee-label">
                                Status
                            </td>

                            <td className="employee-value">

                                <span
                                    className={
                                        employee.employeeStatus === "Active"
                                            ? "print-status active"
                                            : "print-status inactive"
                                    }
                                >
                                    {
                                        employee.employeeStatus === "Active"
                                            ? "Active"
                                            : "Inactive"
                                    }
                                </span>

                            </td>


                            <td className="employee-label">
                                Employee On Date
                            </td>

                            <td className="employee-value">

                                {
                                    employee.employeeOndate
                                        ? new Date(
                                            employee.employeeOndate
                                        ).toLocaleDateString()
                                        : "-"
                                }

                            </td>

                        </tr>

                    </tbody>

                </table>


                {/* =================================
                    SYSTEM INFORMATION
                ================================= */}

                <table className="employee-table">

                    <thead>

                        <tr>

                            <th
                                colSpan="4"
                                className="employee-section-title"
                            >
                                SYSTEM INFORMATION
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr>

                            <td className="employee-label">
                                Employee ID
                            </td>

                            <td className="employee-value">
                                {
                                    employee.employeeId ||
                                    "-"
                                }
                            </td>

                            <td className="employee-label">
                                Updated At
                            </td>

                            <td className="employee-value">
                                {
                                    employee.updatedAt
                                        ? new Date(
                                            employee.updatedAt
                                        ).toLocaleString()
                                        : "-"
                                }
                            </td>

                        </tr>

                    </tbody>

                </table>


                {/* =================================
                    SIGNATURE AREA
                ================================= */}

                <div className="employee-signature-area">

                    <div className="signature-box">

                        <div className="signature-line"></div>

                        <span>
                            Employee Signature
                        </span>

                    </div>


                    <div className="signature-box">

                        <div className="signature-line"></div>

                        <span>
                            Authorized Signature
                        </span>

                    </div>

                </div>


                {/* =================================
                    FOOTER
                ================================= */}

                <div className="employee-document-footer">

                    <span>
                        PMS Portal
                    </span>

                    <span>
                        Employee Information
                    </span>

                </div>

            </div>

        </div>
    );
}

export default EmployeeView;