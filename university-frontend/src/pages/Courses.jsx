import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses, getDepartments, getLoggedInStudent } from "../services/api";
import Layout from "../components/Layout";
function CoursesContent() {
    const [courses, setCourses] = useState([]); const [departments, setDepartments] = useState([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(true); useEffect(() => { Promise.all([getCourses(), getDepartments()]).then(([c, d]) => { setCourses(c); setDepartments(d); }).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []); if (loading) return <div className="p-6 text-slate-500">Loading courses...</div>; if (error) return <div className="p-6 text-red-700">Unable to load courses: {error}</div>; return <div className="p-4 sm:p-6"><h1 className="text-2xl font-bold">Explore Courses</h1><p className="mt-1 text-slate-500">Find the programme that suits your goals.</p><div className="mt-7 space-y-7">{departments.map((department) => { const available = courses.filter((course) => course.department?.departmentId === department.departmentId); return <section key={department.departmentId}><h2 className="text-lg font-semibold">{department.departmentName}</h2>{department.description && <p className="mt-1 text-sm text-slate-500">{department.description}</p>}<div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{available.map((course) => <Link to={`/courses/${course.courseId}`} key={course.courseId} className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-slate-400"><h3 className="font-semibold">{course.courseName}</h3><p className="mt-2 text-sm text-slate-500">Duration: {course.duration || "—"}</p><p className="mt-1 font-medium">₹{course.fees}</p><span className="mt-4 inline-block text-sm font-medium text-blue-600">View details →</span></Link>)}{!available.length && <p className="text-sm text-slate-500">No courses available.</p>}</div></section>; })}</div></div>; }
function Courses() {
    const content = <CoursesContent />;
    return getLoggedInStudent() ? <Layout>{content}</Layout> : content;
}

export default Courses;
