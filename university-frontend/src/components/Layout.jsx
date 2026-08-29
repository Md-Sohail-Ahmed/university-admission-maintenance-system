import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100">

            <div className="flex">

                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                    <Sidebar />
                </div>


                {/* Mobile / Tablet Sidebar */}
                {sidebarOpen && (
                    <>
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 z-40 bg-black/40 md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />

                        {/* Sidebar */}
                        <div className="fixed left-0 top-0 z-50 h-screen md:hidden">
                            <Sidebar
                                onNavigate={() =>
                                    setSidebarOpen(false)
                                }
                            />
                        </div>
                    </>
                )}


                {/* Main Area */}
                <div className="flex-1 min-w-0">

                    <Navbar
                        onMenuClick={() =>
                            setSidebarOpen(!sidebarOpen)
                        }
                    />

                    <main>
                        {children}
                    </main>

                </div>

            </div>

        </div>
    );
}

export default Layout;