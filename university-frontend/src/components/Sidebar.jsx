import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ onNavigate }) {

    const navigate = useNavigate();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/"
        },
        {
            name: "Courses",
            path: "/courses"
        },
        {
            name: "Admission",
            path: "/admission"
        },
        {
            name: "Payments",
            path: "/payments"
        },
        // {
        //     name: "Documents",
        //     path: "/documents"
        // },
        {
            name: "Profile",
            path: "/profile"
        }
    ];


    return (

        <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">

            {/* Logo */}

            <div className="h-16 flex items-center px-6 border-b border-slate-700">

                <h1 className="text-xl font-bold">
                    UAMS
                </h1>

            </div>


            {/* Navigation */}

            <nav className="flex-1 p-4 space-y-2">

                {menuItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg transition ${
                                isActive
                                    ? "bg-slate-700"
                                    : "hover:bg-slate-800"
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>

                ))}

            </nav>


            {/* Logout */}

            <div className="p-4 border-t border-slate-700">

                <button
                    onClick={() => {
                        localStorage.removeItem("student");
                        onNavigate?.();
                        navigate("/login", { replace: true });
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;
