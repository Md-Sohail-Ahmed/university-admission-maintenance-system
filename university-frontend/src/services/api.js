const API_BASE_URL = "http://localhost:8081";

export const getPaymentSummary = async (admissionId) => {

    const response = await fetch(
        `${API_BASE_URL}/api/payments/admission/${admissionId}/summary`
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to fetch payment summary");
    }

    return response.json();
};