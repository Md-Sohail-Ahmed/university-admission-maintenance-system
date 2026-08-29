import { useCallback, useEffect, useState } from "react";
import { getAdmissionByStudent, getLoggedInStudent } from "../services/api";

const badge = (status) => ({ APPROVED: "bg-green-100 text-green-700", REJECTED: "bg-red-100 text-red-700" }[status] || "bg-yellow-100 text-yellow-700");
const Field = ({ label, value }) => <div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 font-medium text-slate-900">{value || "—"}</p></div>;

function Admission() {
    const studentId = getLoggedInStudent()?.studentId;
    const [admission, setAdmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAdmission = useCallback(async () => {
        setLoading(true); setError("");
        try { setAdmission(await getAdmissionByStudent(studentId)); }
        catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }, [studentId]);

    useEffect(() => { loadAdmission(); }, [loadAdmission]);
    if (loading) return <div className="p-6 text-slate-500">Loading admission details...</div>;
    if (error) return <div className="p-6"><div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error} <button onClick={loadAdmission} className="ml-2 underline">Retry</button></div></div>;
    if (!admission) return <div className="p-6"><div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">No admission has been created for your account yet.</div></div>;

    const course = admission.course || {};
    return <div className="p-4 sm:p-6">
        <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Admission Details</h1><p className="mt-1 text-slate-500">Your application and course information.</p></div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div><p className="text-sm text-slate-500">Admission ID</p><p className="text-xl font-bold">#{admission.admissionId}</p></div><span className={`rounded-full px-3 py-1 text-sm font-semibold ${badge(admission.status)}`}>{admission.status}</span></div>
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b p-5"><h2 className="font-semibold text-slate-900">Course Information</h2></div><div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 lg:grid-cols-4"><Field label="Course" value={course.courseName}/><Field label="Department" value={course.department?.departmentName}/><Field label="Duration" value={course.duration}/><Field label="Course Fee" value={course.fees != null ? `₹${course.fees}` : null}/></div></section>
        <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b p-5"><h2 className="font-semibold text-slate-900">Application Information</h2></div><div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2"><Field label="Application Date" value={admission.applicationDate}/><Field label="Approved Date" value={admission.approvedDate}/><Field label="Remarks" value={admission.remarks}/></div></section>
    </div>;
}
export default Admission;
