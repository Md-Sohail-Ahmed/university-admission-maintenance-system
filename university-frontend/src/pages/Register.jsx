import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerStudent } from "../services/api";

const strongPassword = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
const countryCodes = [
    ["+91", "India (+91)"], ["+1", "United States / Canada (+1)"], ["+44", "United Kingdom (+44)"],
    ["+61", "Australia (+61)"], ["+64", "New Zealand (+64)"], ["+971", "United Arab Emirates (+971)"],
    ["+966", "Saudi Arabia (+966)"], ["+65", "Singapore (+65)"], ["+60", "Malaysia (+60)"],
    ["+92", "Pakistan (+92)"], ["+880", "Bangladesh (+880)"], ["+977", "Nepal (+977)"],
    ["+94", "Sri Lanka (+94)"], ["+86", "China (+86)"], ["+81", "Japan (+81)"], ["+82", "South Korea (+82)"],
    ["+49", "Germany (+49)"], ["+33", "France (+33)"], ["+39", "Italy (+39)"], ["+34", "Spain (+34)"],
    ["+31", "Netherlands (+31)"], ["+41", "Switzerland (+41)"], ["+46", "Sweden (+46)"], ["+47", "Norway (+47)"],
    ["+45", "Denmark (+45)"], ["+358", "Finland (+358)"], ["+48", "Poland (+48)"], ["+55", "Brazil (+55)"],
    ["+52", "Mexico (+52)"], ["+27", "South Africa (+27)"], ["+234", "Nigeria (+234)"], ["+20", "Egypt (+20)"],
    ["+254", "Kenya (+254)"], ["+62", "Indonesia (+62)"], ["+63", "Philippines (+63)"], ["+66", "Thailand (+66)"],
    ["+84", "Vietnam (+84)"], ["+90", "Turkey (+90)"], ["+7", "Russia / Kazakhstan (+7)"]
];

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "", dateOfBirth: "", gender: "", address: "" });
    const [countryCode, setCountryCode] = useState("+91");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (localStorage.getItem("student")) navigate("/", { replace: true }); }, [navigate]);
    const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
    const submit = async (event) => {
        event.preventDefault(); setError("");
        if (!strongPassword(form.password)) return setError("Use at least 8 characters with uppercase, lowercase, number, and symbol.");
        if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
        const phone = `${countryCode}${form.phone.replace(/\D/g, "")}`;
        if (!/^\+[1-9]\d{6,14}$/.test(phone)) return setError("Enter a valid phone number.");
        setLoading(true);
        try {
            const { confirmPassword, ...student } = form;
            await registerStudent({ ...student, phone });
            navigate("/login", { replace: true, state: { message: "Registration successful. Please sign in and choose a course to apply." } });
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    };

    return <div className="min-h-screen bg-slate-100 p-4 py-10"><div className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 shadow-sm sm:p-8"><h1 className="text-2xl font-bold">Create your student account</h1><p className="mt-1 text-slate-500">You will choose a course and department when you apply for admission.</p>{error && <div className="mt-5 rounded-lg bg-red-50 p-3 text-red-700">{error}</div>}<form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Full Name<input required name="name" value={form.name} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><label className="text-sm font-medium">Email<input required type="email" name="email" value={form.email} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><label className="text-sm font-medium">Password<input required type="password" name="password" value={form.password} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><label className="text-sm font-medium">Confirm Password<input required type="password" name="confirmPassword" value={form.confirmPassword} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><p className="-mt-2 text-xs text-slate-500 sm:col-span-2">Password must contain 8+ characters, uppercase and lowercase letters, a number, and a symbol.</p><label className="text-sm font-medium">Phone Number<div className="mt-1 flex gap-2"><select value={countryCode} onChange={(event) => setCountryCode(event.target.value)} className="w-36 rounded-lg border bg-white px-2 py-2.5 text-sm">{countryCodes.map(([code, label]) => <option key={`${code}-${label}`} value={code}>{label}</option>)}</select><input required type="tel" inputMode="numeric" name="phone" value={form.phone} onChange={change} placeholder="9876543210" className="min-w-0 flex-1 rounded-lg border px-3 py-2.5" /></div><span className="mt-1 block text-xs font-normal text-slate-500">Select your country code, then enter your mobile number.</span></label><label className="text-sm font-medium">Date of Birth<input required type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><label className="text-sm font-medium">Gender<select required name="gender" value={form.gender} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5"><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select></label><label className="text-sm font-medium sm:col-span-2">Address<textarea required name="address" value={form.address} onChange={change} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label><button disabled={loading} className="rounded-lg bg-slate-900 px-4 py-3 font-medium text-white disabled:opacity-50 sm:col-span-2">{loading ? "Creating account..." : "Register"}</button></form><p className="mt-5 text-center text-sm text-slate-600">Already registered? <Link to="/login" className="font-medium text-blue-600">Sign in</Link></p></div></div>;
}

export default Register;
