import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerStudent } from "../services/api";

const strongPassword = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "", dateOfBirth: "", gender: "", address: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (localStorage.getItem("student")) navigate("/", { replace: true }); }, [navigate]);
    const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
    const submit = async (event) => {
        event.preventDefault(); setError("");
        if (!strongPassword(form.password)) return setError("Use at least 8 characters with uppercase, lowercase, number, and symbol.");
        if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
        if (!/^\+[1-9]\d{6,14}$/.test(form.phone)) return setError("Enter an international number, for example +919876543210.");
        setLoading(true);
        try {
            const { confirmPassword, ...student } = form;
            await registerStudent(student);
            navigate("/login", { replace: true, state: { message: "Registration successful. Please sign in and choose a course to apply." } });
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    };

    return <div className="min-h-screen bg-slate-100 p-4 py-10"><div className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 shadow-sm sm:p-8"><h1 className="text-2xl font-bold">Create your student account</h1><p className="mt-1 text-slate-500">You will choose a course and department when you apply for admission.</p>{error && <div className="mt-5 rounded-lg bg-red-50 p-3 text-red-700">{error}</div>}<form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Full Name<input required name="name" value={form.name} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><label className="text-sm font-medium">Email<input required type="email" name="email" value={form.email} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><label className="text-sm font-medium">Password<input required type="password" name="password" value={form.password} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><label className="text-sm font-medium">Confirm Password<input required type="password" name="confirmPassword" value={form.confirmPassword} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><p className="-mt-2 text-xs text-slate-500 sm:col-span-2">Password must contain 8+ characters, uppercase and lowercase letters, a number, and a symbol.</p><label className="text-sm font-medium">Phone Number<input required type="tel" name="phone" value={form.phone} onChange={change} placeholder="+919876543210" className="mt-1 w-full rounded-lg border px-3 py-2.5" /><span className="mt-1 block text-xs font-normal text-slate-500">Use country code, e.g. +91, +1, or +44.</span></label><label className="text-sm font-medium">Date of Birth<input required type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><label className="text-sm font-medium">Gender<select required name="gender" value={form.gender} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5"><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select></label><label className="text-sm font-medium sm:col-span-2">Address<textarea required name="address" value={form.address} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><button disabled={loading} className="rounded-lg bg-slate-900 px-4 py-3 font-medium text-white disabled:opacity-50 sm:col-span-2">{loading ? "Creating account..." : "Register"}</button></form><p className="mt-5 text-center text-sm text-slate-600">Already registered? <Link to="/login" className="font-medium text-blue-600">Sign in</Link></p></div></div>;
}

export default Register;
