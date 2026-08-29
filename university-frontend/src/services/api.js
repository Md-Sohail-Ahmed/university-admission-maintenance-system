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