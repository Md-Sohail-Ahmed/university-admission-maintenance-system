import { useCallback, useEffect, useState } from "react";
import { getAdmissionByStudent, getLoggedInStudent, getStudent } from "../services/api";

const Field = ({ label, value }) => <div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 font-medium text-slate-900">{value || "—"}</p></div>;

function Profile() {
    const studentId = getLoggedInStudent()?.studentId;
    const [student, setStudent] = useState(null); const [admission, setAdmission] = useState(null);
    const [loading, setLoading] = useState(true); const [error, setError] = useState("");
    const load = useCallback(async () => { setLoading(true); setError(""); try { const [s, a] = await Promise.all([getStudent(studentId), getAdmissionByStudent(studentId)]); setStudent(s); setAdmission(a); } catch (e) { setError(e.message); } finally { setLoading(false); } }, [studentId]);
    useEffect(() => { load(); }, [load]);
    if (loading) return <div className="p-6 text-slate-500">Loading profile...</div>;
    if (error) return <div className="p-6"><div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error} <button onClick={load} className="underline">Retry</button></div></div>;
    const course = admission?.course || {};
    return <div className="p-4 sm:p-6"><div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">My Profile</h1><p className="mt-1 text-slate-500">Your personal and academic information.</p></div>
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b p-5"><h2 className="font-semibold">Personal Information</h2></div><div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3"><Field label="Name" value={student?.name}/><Field label="Student ID" value={student?.studentId ? `#${student.studentId}` : null}/><Field label="Email" value={student?.email}/><Field label="Phone" value={student?.phone}/><Field label="Gender" value={student?.gender}/><Field label="Date of Birth" value={student?.dateOfBirth}/><div className="sm:col-span-2 lg:col-span-3"><Field label="Address" value={student?.address}/></div></div></section>
        <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b p-5"><h2 className="font-semibold">Academic Information</h2></div><div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 lg:grid-cols-4"><Field label="Department" value={course.department?.departmentName || student?.department?.departmentName}/><Field label="Course" value={course.courseName}/><Field label="Duration" value={course.duration}/><Field label="Admission Status" value={admission?.status}/></div></section>
    </div>;
}
export default Profile;
