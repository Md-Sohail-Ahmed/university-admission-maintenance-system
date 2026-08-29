function Navbar() {

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">

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