import { useEffect, useState } from "react";
import { getAdmission } from "../services/api";

function Admission() {

    const admissionId = 1;

    const [admission, setAdmission] = useState(null);
    const [error, setError] = useState("");


    useEffect(() => {

        const loadAdmission = async () => {

            try {

                const data =
                    await getAdmission(admissionId);

                setAdmission(data);

            } catch (error) {

                console.error(error);

                setError(error.message);
            }
        };

        loadAdmission();

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


    if (!admission) {

        return (
            <div className="p-6">

                <p className="text-slate-500">
                    Loading admission details...
                </p>

            </div>
        );
    }


    return (
        <div className="p-6">

            {/* Page Header */}
            <div className="mb-8">

                <h1 className="text-2xl font-bold text-slate-900">
                    Admission Details
                </h1>

                <p className="mt-1 text-slate-500">
                    View your complete admission information.
                </p>

            </div>


            {/* Status Banner */}
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-green-700">
                            Admission Status
                        </p>

                        <p className="mt-1 text-xl font-bold text-green-800">
                            {admission.status}
                        </p>

                    </div>

                    <div className="text-right">

                        <p className="text-sm text-green-700">
                            Admission ID
                        </p>

                        <p className="mt-1 font-bold text-green-800">
                            #{admission.admissionId}
                        </p>

                    </div>

                </div>

            </div>


            {/* Course Information */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="p-6 border-b border-slate-200">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Course Information
                    </h2>

                </div>


                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">

                    <div>

                        <p className="text-sm text-slate-500">
                            Course
                        </p>

                        <p className="mt-1 text-lg font-semibold text-slate-900">
                            {admission.course.courseName}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-slate-500">
                            Department
                        </p>

                        <p className="mt-1 font-medium text-slate-900">
                            {admission.course.department.departmentName}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-slate-500">
                            Duration
                        </p>

                        <p className="mt-1 font-medium text-slate-900">
                            {admission.course.duration}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-slate-500">
                            Course Fee
                        </p>

                        <p className="mt-1 text-lg font-semibold text-slate-900">
                            ₹{admission.course.fees}
                        </p>

                    </div>

                </div>

            </div>


            {/* Application Information */}
            <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="p-6 border-b border-slate-200">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Application Information
                    </h2>

                </div>


                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">

                    <div>

                        <p className="text-sm text-slate-500">
                            Application Date
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.applicationDate}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-slate-500">
                            Approved Date
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.approvedDate || "-"}
                        </p>

                    </div>


                    <div className="sm:col-span-2">

                        <p className="text-sm text-slate-500">
                            Remarks
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.remarks || "No remarks"}
                        </p>

                    </div>

                </div>

            </div>


            {/* Student Information */}
            <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="p-6 border-b border-slate-200">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Student Information
                    </h2>

                </div>


                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">

                    <div>

                        <p className="text-sm text-slate-500">
                            Name
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.student.name}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-slate-500">
                            Email
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.student.email}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-slate-500">
                            Phone
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.student.phone}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-slate-500">
                            Department
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.student.department.departmentName}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Admission;