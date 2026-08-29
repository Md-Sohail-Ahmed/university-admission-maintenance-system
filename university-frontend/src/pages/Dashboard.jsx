import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import {
    getPaymentSummary,
    getStudent,
    getAdmission
} from "../services/api";

function Dashboard() {

    const studentId = 1;
    const admissionId = 1;

    const [student, setStudent] = useState(null);
    const [paymentSummary, setPaymentSummary] = useState(null);
    const [admission, setAdmission] = useState(null);

    const [error, setError] = useState("");


    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const studentData =
                    await getStudent(studentId);

                const paymentData =
                    await getPaymentSummary(admissionId);

                const admissionData =
                    await getAdmission(admissionId);

                setStudent(studentData);
                setPaymentSummary(paymentData);
                setAdmission(admissionData);

            } catch (error) {

                console.error(error);

                setError(error.message);
            }
        };

        loadDashboard();

    }, []);


    if (error) {

        return (
            <div className="p-6">

                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>

            </div>
        );
    }


    if (!student || !paymentSummary || !admission) {

        return (
            <div className="p-6">

                <p className="text-slate-500">
                    Loading dashboard...
                </p>

            </div>
        );
    }


    return (
        <div className="p-6">

            {/* Welcome */}
            <div className="mb-8">

                <h1 className="text-2xl font-bold text-slate-900">
                    Welcome back, {student.name} 👋
                </h1>

                <p className="mt-1 text-slate-500">
                    Here's an overview of your admission.
                </p>

            </div>


            {/* Payment Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                <StatCard
                    title="Course Fee"
                    value={`₹${paymentSummary.courseFee}`}
                    description="Total admission fee"
                />

                <StatCard
                    title="Total Paid"
                    value={`₹${paymentSummary.totalPaid}`}
                    description="Successfully paid"
                />

                <StatCard
                    title="Remaining"
                    value={`₹${paymentSummary.remainingAmount}`}
                    description="Amount remaining"
                />

            </div>


            {/* Student Information */}
            <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="p-6 border-b border-slate-200">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Student Information
                    </h2>

                </div>


                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div>
                        <p className="text-sm text-slate-500">
                            Student ID
                        </p>

                        <p className="mt-1 font-medium">
                            #{student.studentId}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-slate-500">
                            Full Name
                        </p>

                        <p className="mt-1 font-medium">
                            {student.name}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-slate-500">
                            Email
                        </p>

                        <p className="mt-1 font-medium">
                            {student.email}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-slate-500">
                            Phone
                        </p>

                        <p className="mt-1 font-medium">
                            {student.phone}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-slate-500">
                            Gender
                        </p>

                        <p className="mt-1 font-medium">
                            {student.gender}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-slate-500">
                            Date of Birth
                        </p>

                        <p className="mt-1 font-medium">
                            {student.dateOfBirth}
                        </p>
                    </div>


                    <div className="sm:col-span-2 lg:col-span-3">

                        <p className="text-sm text-slate-500">
                            Address
                        </p>

                        <p className="mt-1 font-medium">
                            {student.address}
                        </p>

                    </div>

                </div>

            </div>


            {/* Admission Details */}
            <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="p-6 border-b border-slate-200">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Admission Details
                    </h2>

                </div>


                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Admission ID */}
                    <div>

                        <p className="text-sm text-slate-500">
                            Admission ID
                        </p>

                        <p className="mt-1 font-medium">
                            #{admission.admissionId}
                        </p>

                    </div>


                    {/* Course */}
                    <div>

                        <p className="text-sm text-slate-500">
                            Course
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.course.courseName}
                        </p>

                    </div>


                    {/* Duration */}
                    <div>

                        <p className="text-sm text-slate-500">
                            Duration
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.course.duration}
                        </p>

                    </div>


                    {/* Department */}
                    <div>

                        <p className="text-sm text-slate-500">
                            Department
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.course.department.departmentName}
                        </p>

                    </div>


                    {/* Course Fee */}
                    <div>

                        <p className="text-sm text-slate-500">
                            Course Fee
                        </p>

                        <p className="mt-1 font-medium">
                            ₹{admission.course.fees}
                        </p>

                    </div>


                    {/* Application Date */}
                    <div>

                        <p className="text-sm text-slate-500">
                            Application Date
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.applicationDate}
                        </p>

                    </div>


                    {/* Approved Date */}
                    <div>

                        <p className="text-sm text-slate-500">
                            Approved Date
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.approvedDate || "-"}
                        </p>

                    </div>


                    {/* Status */}
                    <div>

                        <p className="text-sm text-slate-500">
                            Status
                        </p>

                        <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {admission.status}
                        </span>

                    </div>


                    {/* Remarks */}
                    <div className="sm:col-span-2 lg:col-span-3">

                        <p className="text-sm text-slate-500">
                            Remarks
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.remarks || "-"}
                        </p>

                    </div>

                </div>

            </div>


            {/* Payment History */}
            <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="p-6 border-b border-slate-200">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Payment History
                    </h2>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-slate-50">

                        <tr>

                            <th className="text-left px-6 py-3 font-medium text-slate-500">
                                Amount
                            </th>

                            <th className="text-left px-6 py-3 font-medium text-slate-500">
                                Payment Mode
                            </th>

                            <th className="text-left px-6 py-3 font-medium text-slate-500">
                                Status
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {paymentSummary.payments.map(
                            (payment) => (

                                <tr
                                    key={payment.paymentId}
                                    className="border-t border-slate-100"
                                >

                                    <td className="px-6 py-4 font-medium">
                                        ₹{payment.amount}
                                    </td>

                                    <td className="px-6 py-4 capitalize">
                                        {payment.paymentMode || "-"}
                                    </td>

                                    <td className="px-6 py-4">

                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                {payment.status}
                                            </span>

                                    </td>

                                </tr>

                            )
                        )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;