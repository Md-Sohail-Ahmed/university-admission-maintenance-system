import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

function Layout({ children }) {

    return (
        <div className="min-h-screen bg-slate-50 flex">

            <Sidebar />

            <div className="flex-1 min-w-0">

                <Navbar />

                <main>
                    {children}
                </main>

            </div>

        </div>
    );
}

export default Layout;