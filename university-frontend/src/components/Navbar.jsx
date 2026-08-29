function Navbar({ onMenuClick }) {

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">

            <button
                onClick={onMenuClick}
                className="md:hidden mr-4 p-2 rounded-lg hover:bg-slate-100"
                aria-label="Open menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>
            <div>
                <h2 className="text-lg font-semibold text-slate-800">
                    Student Dashboard
                </h2>
            </div>


            <div className="flex items-center gap-3">

                <div className="text-right hidden sm:block">

                    <p className="text-sm font-medium text-slate-800">
                        Test Student
                    </p>

                    <p className="text-xs text-slate-500">
                        Student
                    </p>

                </div>


                <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold">
                    TS
                </div>

            </div>

        </header>
    );
}

export default Navbar;