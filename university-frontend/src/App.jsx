import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Admission from "./pages/Admission";
import AdminPortal from "./pages/AdminPortal";
import Apply from "./pages/Apply";
import CourseDetails from "./pages/CourseDetails";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

function App() {

    return (

        <BrowserRouter>

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<Navigate to="/login" replace />} />
                <Route path="/admin" element={<AdminPortal />} />
                <Route path="/register" element={<Register />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:courseId" element={<CourseDetails />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/admission" element={<Admission />} />
                        <Route path="/apply/:courseId" element={<Apply />} />
                        <Route path="/payments" element={<Payment />} />
                        <Route path="/documents" element={<Documents />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

        </BrowserRouter>

    );
}

export default App;
