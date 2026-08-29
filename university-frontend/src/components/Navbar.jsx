import { getLoggedInStudent } from "../services/api";
import { Link } from "react-router-dom";

function Navbar({ onMenuClick }) {

    const student = getLoggedInStudent();
    const initials = student?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "ST";

    return (
        <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">

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


            <Link
                to="/profile"
                className="flex items-center gap-3 rounded-lg p-1 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                aria-label="View my profile"
            >

                <div className="text-right hidden sm:block">

                    <p className="text-sm font-medium text-slate-800">
                        {student?.name || "Student"}
                    </p>

                    <p className="text-xs text-slate-500">
                        Student
                    </p>

                </div>


                <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold">
                    {initials}
                </div>

            </Link>

        </header>
    );
}

export default Navbar;
