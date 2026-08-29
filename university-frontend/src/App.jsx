import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard"
import Admission from "./pages/Admission";
import Payment from "./pages/Payment";
import Documents from "./pages/Documents";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Profile from "./pages/Profile";

function App() {

    return (

        <BrowserRouter>

            <Layout>

                <Routes>

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/admission"
                        element={<Admission />}
                    />

                    <Route
                        path="/payments"
                        element={<Payment />}
                    />

                    <Route
                        path="/documents"
                        element={<Documents />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />} />

                </Routes>

            </Layout>

        </BrowserRouter>

    );
}

export default App;