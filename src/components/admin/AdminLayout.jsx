import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {

    const menuItems = [
        {
            section: "MAIN"
        },
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: "▦"
        },
        {
            name: "Employees",
            path: "/admin/employees",
            icon: "◉"
        },

        {
            section: "MANAGEMENT"
        },
        {
            name: "Clients",
            path: "/admin/clients",
            icon: "◈"
        },
        {
            name: "Projects",
            path: "/admin/projects",
            icon: "▣"
        },
        {
            name: "Modules",
            path: "/admin/modules",
            icon: "▤"
        },
        {
            name: "Requirements",
            path: "/admin/requirements",
            icon: "☷"
        },
        {
            name: "Tasks",
            path: "/admin/tasks",
            icon: "✓"
        },

        {
            section: "MASTER DATA"
        },
        {
            name: "Departments",
            path: "/admin/departments",
            icon: "◫"
        },
        {
            name: "Designations",
            path: "/admin/designations",
            icon: "◎"
        },
        {
            name: "States",
            path: "/admin/states",
            icon: "◇"
        },
        {
            name: "Cities",
            path: "/admin/cities",
            icon: "⌂"
        }
    ];


    return (

        <div className="admin-layout">

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="admin-sidebar">

                {/* LOGO */}

                <div className="sidebar-logo">

                    <h2>
                        PMS<span> PORTAL</span>
                    </h2>

                </div>


                {/* MENU */}

                <nav className="sidebar-menu">

                    {menuItems.map(
                        (item, index) => {

                            if (item.section) {

                                return (

                                    <div
                                        key={index}
                                        className="sidebar-section"
                                    >
                                        {item.section}
                                    </div>

                                );

                            }


                            return (

                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `sidebar-item ${
                                            isActive
                                                ? "active"
                                                : ""
                                        }`
                                    }
                                >

                                    <span className="sidebar-icon">
                                        {item.icon}
                                    </span>

                                    <span>
                                        {item.name}
                                    </span>

                                </NavLink>

                            );

                        }
                    )}

                </nav>


                {/* SIDEBAR FOOTER */}

                <div className="sidebar-footer">

                    <button
                        className="logout-btn"
                        onClick={() => {

                            localStorage.removeItem(
                                "admin"
                            );

                            window.location.href =
                                "/admin/login";

                        }}
                    >

                        ⇥ &nbsp; Logout

                    </button>

                </div>

            </aside>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="admin-main">

                <section className="admin-content">

                    <Outlet />

                </section>

            </main>

        </div>

    );

}

export default AdminLayout;