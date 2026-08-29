import {useCallback, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import StatCard from "../components/StatCard";
import {getAdmissionByStudent, getLoggedInStudent, getPaymentSummary, getStudent} from "../services/api";

const Field = ({label, value}) => <div><p className="text-sm text-slate-500">{label}</p><p
    className="mt-1 font-medium text-slate-900">{value || "—"}</p></div>;
const statusClass = (s) => ({
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700"
}[s] || "bg-yellow-100 text-yellow-700");

function Dashboard() {
    const studentId = getLoggedInStudent()?.studentId;
    const [student, setStudent] = useState(null);
    const [admission, setAdmission] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const currentStudent = await getStudent(studentId);
            const currentAdmission = await getAdmissionByStudent(studentId);
            setStudent(currentStudent);
            setAdmission(currentAdmission);
            setSummary(currentAdmission ? await getPaymentSummary(currentAdmission.admissionId) : null);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [studentId]);
    useEffect(() => {
        load();
    }, [load]);
    if (loading) return <div className="p-6 text-slate-500">Loading dashboard...</div>;
    if (error) return <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}
            <button onClick={load} className="underline">Retry</button>
        </div>
    </div>;
    const course = admission?.course || {};
    return <div className="p-4 sm:p-6">
        <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Welcome back, {student?.name} 👋</h1><p
            className="mt-1 text-slate-500">Here is an overview of your admission.</p></div>
        <section className="mb-7 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2
            className="font-semibold">Quick Actions</h2>
            <div className="mt-4 flex flex-wrap gap-3"><Link to="/courses"
                                                             className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">View
                Courses</Link>{!admission ?
                <Link to="/courses" className="rounded-lg border px-4 py-2 text-sm font-medium">Apply for
                    Admission</Link> : <><Link to="/admission"
                                               className="rounded-lg border px-4 py-2 text-sm font-medium">View
                    Admission</Link><Link to="/documents" className="rounded-lg border px-4 py-2 text-sm font-medium">Upload
                    Documents</Link>{admission.status === "APPROVED" &&
                    <Link to="/payments" className="rounded-lg border px-4 py-2 text-sm font-medium">Pay
                        Fees</Link>}</>}<Link to="/profile" className="rounded-lg border px-4 py-2 text-sm font-medium">View
                Profile</Link></div>
        </section>
        {summary ? <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3"><StatCard title="Course Fee"
                                                                                 value={`₹${summary.courseFee}`}
                                                                                 description="Total admission fee"/><StatCard
                    title="Total Paid" value={`₹${summary.totalPaid}`} description="Successfully paid"/><StatCard
                    title="Remaining" value={`₹${summary.remainingAmount}`} description="Amount remaining"/></div>
            </> :
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-slate-500">Payment details will appear
                once an admission is available.</div>}
        <section className="mt-7 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b p-5"><h2 className="font-semibold">Student Information</h2></div>
            <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3"><Field label="Student ID"
                                                                                             value={student?.studentId ? `#${student.studentId}` : null}/><Field
                label="Email" value={student?.email}/><Field label="Phone" value={student?.phone}/><Field label="Gender"
                                                                                                          value={student?.gender}/><Field
                label="Date of Birth" value={student?.dateOfBirth}/><Field label="Department"
                                                                           value={course.department?.departmentName || student?.department?.departmentName}/>
                <div className="sm:col-span-2 lg:col-span-3"><Field label="Address" value={student?.address}/></div>
            </div>
        </section>
        {admission ? <>
                <section className="mt-7 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b p-5"><h2 className="font-semibold">Admission Information</h2></div>
                    <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3"><Field label="Admission ID"
                                                                                                     value={`#${admission.admissionId}`}/><Field
                        label="Course" value={course.courseName}/><Field label="Course Duration"
                                                                         value={course.duration}/><Field label="Course Fee"
                                                                                                         value={course.fees != null ? `₹${course.fees}` : null}/><Field
                        label="Application Date" value={admission.applicationDate}/><Field label="Approved Date"
                                                                                           value={admission.approvedDate}/>
                        <div><p className="text-sm text-slate-500">Admission Status</p><span
                            className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${statusClass(admission.status)}`}>{admission.status}</span>
                        </div>
                        <Field label="Remarks" value={admission.remarks}/></div>
                </section>
                {summary && <section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b p-5"><h2 className="font-semibold">Payment History</h2></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                            <tr>
                                <th className="px-5 py-3">Payment ID</th>
                                <th className="px-5 py-3">Amount</th>
                                <th className="px-5 py-3">Mode</th>
                                <th className="px-5 py-3">Status</th>
                            </tr>
                            </thead>
                            <tbody>{summary.payments?.length ? summary.payments.map((p) => <tr key={p.paymentId}
                                                                                               className="border-t">
                                <td className="px-5 py-4">#{p.paymentId}</td>
                                <td className="px-5 py-4">₹{p.amount}</td>
                                <td className="px-5 py-4 capitalize">{p.paymentMode || "—"}</td>
                                <td className="px-5 py-4">{p.status}</td>
                            </tr>) : <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">No payments yet.</td>
                            </tr>}</tbody>
                        </table>
                    </div>
                </section>}</> :
            <div className="mt-7 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">No
                admission has been created for your account yet.</div>}
    </div>;
}

export default Dashboard;
