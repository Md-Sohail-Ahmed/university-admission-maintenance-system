import { useEffect, useState } from "react";
import { getStudent, getAdmission } from "../services/api";

function Profile() {

    const studentId = 1;
    const admissionId = 1;

    const [student, setStudent] = useState(null);
    const [admission, setAdmission] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const studentData =
                    await getStudent(studentId);

                const admissionData =
                    await getAdmission(admissionId);

                setStudent(studentData);
                setAdmission(admissionData);

            } catch (error) {

                console.error(error);
                setError(error.message);
            }
        };

        loadProfile();

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

    if (!student || !admission) {

        return (
            <div className="p-6">
                <p className="text-slate-500">
                    Loading profile...
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    My Profile
                </h1>

                <p className="mt-1 text-slate-500">
                    View your personal and academic information.
                </p>
            </div>


            {/* Personal Information */}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="p-6 border-b border-slate-200">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Personal Information
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


            {/* Academic Information */}

            <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="p-6 border-b border-slate-200">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Academic Information
                    </h2>

                </div>


                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">

                    <div>
                        <p className="text-sm text-slate-500">
                            Department
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.course.department.departmentName}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-slate-500">
                            Course
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.course.courseName}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-slate-500">
                            Duration
                        </p>

                        <p className="mt-1 font-medium">
                            {admission.course.duration}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-slate-500">
                            Admission Status
                        </p>

                        <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            {admission.status}
                        </span>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;