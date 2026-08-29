const API_BASE_URL = "http://localhost:8081";

export const getPaymentSummary = async (admissionId) => {

    const response = await fetch(
        `${API_BASE_URL}/api/payments/admission/${admissionId}/summary`
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(
            error || "Failed to fetch payment summary"
        );
    }

    return response.json();
};

export const getAdmission = async (admissionId) => {

    const response = await fetch(
        `${API_BASE_URL}/api/admissions/${admissionId}`
    );

    if (!response.ok) {
        const error = await response.text();

        throw new Error(
            error || "Failed to fetch admission"
        );
    }

    return response.json();
};

export const getStudentDocuments = async (studentId) => {

    const response = await fetch(
        `${API_BASE_URL}/api/documents/student/${studentId}`
    );

    if (!response.ok) {

        const error = await response.text();

        throw new Error(
            error || "Failed to fetch documents"
        );
    }

    return response.json();
};


export const uploadDocument = async (
    studentId,
    documentType,
    file
) => {

    const formData = new FormData();

    formData.append("studentId", studentId);
    formData.append("documentType", documentType);
    formData.append("file", file);


    const response = await fetch(
        `${API_BASE_URL}/api/documents/upload`,
        {
            method: "POST",
            body: formData
        }
    );


    if (!response.ok) {

        const error = await response.text();

        throw new Error(
            error || "Failed to upload document"
        );
    }


    return response.json();
};


export const deleteDocument = async (documentId) => {

    const response = await fetch(
        `${API_BASE_URL}/api/documents/${documentId}`,
        {
            method: "DELETE"
        }
    );


    if (!response.ok) {

        const error = await response.text();

        throw new Error(
            error || "Failed to delete document"
        );
    }


    return response.text();
};

export const downloadDocument = async (documentId) => {

    const response = await fetch(
        `${API_BASE_URL}/api/documents/${documentId}/download`
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(
            error || "Failed to download document"
        );
    }

    return response.blob();
};


export const getStudent = async (studentId) => {

    const response = await fetch(
        `${API_BASE_URL}/api/students/${studentId}`
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(
            error || "Failed to fetch student"
        );
    }

    return response.json();
};

export const loginStudent = async (email, password) => {

    const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    );

    if (!response.ok) {

        const message = await response.text();

        throw new Error(
            message || "Invalid email or password"
        );
    }

    return response.json();
};

export const getLoggedInStudent = () => {

    const student =
        localStorage.getItem("student");

    if (!student) {
        return null;
    }

    return JSON.parse(student);
};

const requestJson = async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Request failed");
    }
    return response.status === 204 ? null : response.json();
};

export const registerStudent = (data) => requestJson("/api/auth/register", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
});
export const getDepartments = () => requestJson("/api/departments");
export const getCourses = () => requestJson("/api/courses");
export const getCourse = (courseId) => requestJson(`/api/courses/${courseId}`);
export const createAdmission = (studentId, courseId) => requestJson("/api/admissions", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student: { studentId }, course: { courseId } })
});
export const updateAdmissionStatus = (id, status, remarks) => requestJson(`/api/admissions/${id}/status`, {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, remarks })
});
export const createDepartment = (department) => requestJson("/api/departments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(department) });
export const updateDepartment = (id, department) => requestJson(`/api/departments/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(department) });
export const deleteDepartment = (id) => requestJson(`/api/departments/${id}`, { method: "DELETE" });
export const createCourse = (course) => requestJson("/api/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(course) });
export const updateCourse = (id, course) => requestJson(`/api/courses/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(course) });
export const deleteCourse = (id) => requestJson(`/api/courses/${id}`, { method: "DELETE" });
export const loginAdmin = (email, password) => requestJson("/api/admin/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
export const getStudents = () => requestJson("/api/students");
export const getAdmissions = () => requestJson("/api/admissions");
export const getPayments = () => requestJson("/api/payments");
export const getDocuments = () => requestJson("/api/documents");

export const getAdmissionByStudent = async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/api/admissions/student/${studentId}`);

    if (response.status === 404) return null;
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to fetch admission");
    }
    return response.json();
};

export const createPaymentOrder = async (admissionId, amount) => {
    const response = await fetch(
        `${API_BASE_URL}/api/payments/create-order?admissionId=${admissionId}&amount=${amount}`,
        { method: "POST" }
    );
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to create payment order");
    }
    return response.json();
};

export const verifyPayment = async (paymentResponse) => {
    const response = await fetch(`${API_BASE_URL}/api/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpaySignature: paymentResponse.razorpay_signature
        })
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Payment verification failed");
    }
    return response.json();
};
