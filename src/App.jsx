import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


// =====================================================
// AUTH
// =====================================================

import Login from "./pages/auth/Login";


// =====================================================
// ADMIN LAYOUT
// =====================================================

import AdminLayout from "./components/admin/AdminLayout";


// =====================================================
// ADMIN DASHBOARD
// =====================================================

import AdminDashboard from "./pages/admin/AdminDashboard";


// =====================================================
// ADMIN PAGES
// =====================================================

import Employees from "./pages/admin/Employees";
import EmployeeView from "./pages/admin/EmployeeView";

import Departments from "./pages/admin/Departments";
import Designations from "./pages/admin/Designations";

import Clients from "./pages/admin/Clients";

import States from "./pages/admin/States";
import Cities from "./pages/admin/Cities";

import Projects from "./pages/admin/Projects";
import ProjectView from "./pages/admin/ProjectView";

import Modules from "./pages/admin/Modules";
import ModuleView from "./pages/admin/ModuleView";

import Requirements from "./pages/admin/Requirements";
import RequirementView from "./pages/admin/RequirementView";

import Tasks from "./pages/admin/Tasks";
import TaskView from "./pages/admin/TaskView";


// =====================================================
// EMPLOYEE PAGES
// =====================================================

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeTaskView from "./pages/employee/EmployeeTaskView";


// =====================================================
// APP
// =====================================================

function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* =================================================
                            LOGIN
                    ================================================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =================================================
                            ADMIN PANEL
                    ================================================= */}

                <Route
                    path="/admin"
                    element={<AdminLayout />}
                >

                    {/* =================================================
                                ADMIN DASHBOARD
                        ================================================= */}

                    <Route
                        path="dashboard"
                        element={<AdminDashboard />}
                    />


                    {/* =================================================
                                EMPLOYEES
                        ================================================= */}

                    <Route
                        path="employees"
                        element={<Employees />}
                    />

                    <Route
                        path="employees/:id"
                        element={<EmployeeView />}
                    />


                    {/* =================================================
                                DEPARTMENTS
                        ================================================= */}

                    <Route
                        path="departments"
                        element={<Departments />}
                    />


                    {/* =================================================
                                DESIGNATIONS
                        ================================================= */}

                    <Route
                        path="designations"
                        element={<Designations />}
                    />


                    {/* =================================================
                                CLIENTS
                        ================================================= */}

                    <Route
                        path="clients"
                        element={<Clients />}
                    />


                    {/* =================================================
                                STATES
                        ================================================= */}

                    <Route
                        path="states"
                        element={<States />}
                    />


                    {/* =================================================
                                CITIES
                        ================================================= */}

                    <Route
                        path="cities"
                        element={<Cities />}
                    />


                    {/* =================================================
                                PROJECTS
                        ================================================= */}

                    <Route
                        path="projects"
                        element={<Projects />}
                    />

                    <Route
                        path="projects/:id"
                        element={<ProjectView />}
                    />


                    {/* =================================================
                                MODULES
                        ================================================= */}

                    <Route
                        path="modules"
                        element={<Modules />}
                    />

                    <Route
                        path="modules/:id"
                        element={<ModuleView />}
                    />


                    {/* =================================================
                                REQUIREMENTS
                        ================================================= */}

                    <Route
                        path="requirements"
                        element={<Requirements />}
                    />

                    <Route
                        path="requirements/:id"
                        element={<RequirementView />}
                    />


                    {/* =================================================
                                TASKS
                        ================================================= */}

                    <Route
                        path="tasks"
                        element={<Tasks />}
                    />

                    <Route
                        path="tasks/:id"
                        element={<TaskView />}
                    />

                  
                </Route>


                {/* =================================================
                            EMPLOYEE PANEL
                    ================================================= */}

                <Route
                    path="/employee"
                >

                    {/* =================================================
                                EMPLOYEE DASHBOARD
                        ================================================= */}

                    <Route
                        path="dashboard"
                        element={<EmployeeDashboard />}
                    />


                    {/* =================================================
                                EMPLOYEE TASK VIEW
                        ================================================= */}

                    <Route
                        path="tasks/:id"
                        element={<EmployeeTaskView />}
                    />

                </Route>


                {/* =================================================
                            INVALID URL
                    ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;