import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden bg-slate-100">

            <div className="h-full">

                {/* Desktop Sidebar */}
                <div className="fixed inset-y-0 left-0 z-30 hidden md:block">
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
                <div className="flex h-full min-w-0 flex-col md:ml-64">

                    <Navbar
                        onMenuClick={() =>
                            setSidebarOpen(!sidebarOpen)
                        }
                    />

                    <main className="min-h-0 flex-1 overflow-y-auto">
                        {children || <Outlet />}
                    </main>

                </div>

            </div>

        </div>
    );
}

export default Layout;
