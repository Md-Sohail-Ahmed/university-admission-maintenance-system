import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/api";

function AdminLogin() {
    const navigate = useNavigate(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
    const submit = async (event) => { event.preventDefault(); setError(""); setLoading(true); try { const admin = await loginAdmin(email, password); localStorage.setItem("admin", JSON.stringify(admin)); navigate("/admin", { replace: true }); } catch (e) { setError(e.message); } finally { setLoading(false); } };
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4"><form onSubmit={submit} className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm"><div className="mb-6"><p className="text-sm font-semibold text-blue-600">UAMS ADMIN</p><h1 className="mt-1 text-2xl font-bold">Admin sign in</h1></div>{error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}<label className="block text-sm font-medium">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><label className="mt-4 block text-sm font-medium">Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><button disabled={loading} className="mt-6 w-full rounded-lg bg-slate-900 py-3 font-medium text-white disabled:opacity-50">{loading ? "Signing in..." : "Sign in"}</button></form></div>;
}
export default AdminLogin;
