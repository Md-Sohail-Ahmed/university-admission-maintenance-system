import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginStudent } from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const student =
                await loginStudent(
                    email,
                    password
                );

            // Save logged-in student
            localStorage.setItem(
                "student",
                JSON.stringify(student)
            );

            // Go to dashboard
            navigate("/");

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

            <div className="w-full max-w-md">

                {/* Logo */}

                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 text-white text-xl font-bold">
                        U
                    </div>

                    <h1 className="mt-4 text-2xl font-bold text-slate-900">
                        University Admission System
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Student Portal
                    </p>

                </div>


                {/* Login Card */}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

                    <h2 className="text-xl font-semibold text-slate-900">
                        Welcome back
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Sign in to access your admission portal.
                    </p>


                    {/* Error */}

                    {error && (

                        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>

                    )}


                    <form
                        onSubmit={handleLogin}
                        className="mt-6 space-y-5"
                    >

                        {/* Email */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Password */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Button */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"}
                        </button>

                    </form>

                </div>


                <p className="mt-6 text-center text-sm text-slate-500">
                    University Admission System
                </p>

            </div>

        </div>
    );
}

export default Login;