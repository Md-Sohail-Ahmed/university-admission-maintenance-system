function Sidebar() {

    return (
        <aside className="hidden md:flex w-64 min-h-screen bg-slate-900 text-white flex-col">

            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-700">
                <h1 className="text-xl font-bold">
                    UAMS
                </h1>
            </div>


            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">

                <a
                    href="#"
                    className="block px-4 py-3 rounded-lg bg-slate-700"
                >
                    Dashboard
                </a>

                <a
                    href="#"
                    className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                    Admission
                </a>

                <a
                    href="#"
                    className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                    Payments
                </a>

                <a
                    href="#"
                    className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                    Documents
                </a>

            </nav>


            {/* Bottom */}
            <div className="p-4 border-t border-slate-700">

                <button
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;