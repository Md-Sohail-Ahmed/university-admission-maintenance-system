import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    getStudentDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument
} from "../services/api";
import ConfirmationModal from "../components/ConfirmationModal";
import { getCourse } from "../services/api";
import { getDocumentRequirements } from "../utils/documentRequirements";

function Documents() {

    const studentId = JSON.parse(localStorage.getItem("student") || "null")?.studentId;
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId");
    const [course, setCourse] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);


    const [documents, setDocuments] = useState([]);

    const [documentType, setDocumentType] =
        useState("");

    const [file, setFile] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");
    const [documentToDelete, setDocumentToDelete] = useState(null);

    const requiredDocuments = getDocumentRequirements(course?.courseName);


    const loadDocuments = useCallback(async () => {

        try {

            setError("");

            const data =
                await getStudentDocuments(studentId);

            setDocuments(data);

        } catch (error) {
            setError(error.message);
        } finally {
            setInitialLoading(false);
        }
    }, [studentId]);


    useEffect(() => {

        loadDocuments();

    }, [loadDocuments]);

    useEffect(() => {
        if (courseId) {
            getCourse(courseId).then(setCourse).catch((loadError) => setError(loadError.message));
        }
    }, [courseId]);


    const handleUpload = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!documentType) {

            setError(
                "Please select a document type."
            );

            return;
        }


        if (!file) {

            setError(
                "Please select a file."
            );

            return;
        }


        setLoading(true);


        try {

            await uploadDocument(
                studentId,
                documentType,
                file
            );


            setSuccess(
                "Document uploaded successfully."
            );


            setDocumentType("");

            setFile(null);


            // Reset file input
            event.target.reset();


            await loadDocuments();


        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    const handleDelete = async () => {

        if (!documentToDelete) return;
        try {

            setError("");
            setSuccess("");


            await deleteDocument(documentToDelete);


            setSuccess(
                "Document deleted successfully."
            );


            await loadDocuments();
            setDocumentToDelete(null);


        } catch (error) {

            setError(error.message);
        }
    };

    const handleDownload = async (documentId, fileName) => {

        try {

            setError("");

            const blob =
                await downloadDocument(documentId);

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download = fileName || "document";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            setError(error.message);
        }
    };

    const handleView = async (documentId, fileName) => {

        try {

            setError("");

            const blob =
                await downloadDocument(documentId);

            let mimeType = "application/octet-stream";

            const extension =
                fileName
                    ?.split(".")
                    .pop()
                    ?.toLowerCase();

            if (extension === "pdf") {
                mimeType = "application/pdf";
            } else if (extension === "jpg" || extension === "jpeg") {
                mimeType = "image/jpeg";
            } else if (extension === "png") {
                mimeType = "image/png";
            }

            const viewBlob =
                new Blob([blob], {
                    type: mimeType
                });

            const url =
                window.URL.createObjectURL(viewBlob);

            window.open(url, "_blank");

        } catch (error) {

            setError(error.message);
        }
    };

    return (

        <div className="p-6">
            <ConfirmationModal
                open={Boolean(documentToDelete)}
                title="Delete document?"
                message="This removes the uploaded document from your application. This action cannot be undone."
                confirmLabel="Delete document"
                onCancel={() => setDocumentToDelete(null)}
                onConfirm={handleDelete}
            />

            {/* Header */}

            <div className="mb-8">

                <h1 className="text-2xl font-bold text-slate-900">
                    Documents
                </h1>

                <p className="mt-1 text-slate-500">
                    {course ? `Upload the mandatory documents for ${course.courseName}.` : "Upload and manage your admission documents."}
                </p>

            </div>


            {/* Messages */}

            {error && (

                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>

            )}


            {success && (

                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>

            )}


            {/* Upload Form */}

            <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Required Documents</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {requiredDocuments.map(([type, label]) => {
                        const uploaded = documents.some((document) => document.documentType === type);
                        return <div key={type} className={`rounded-lg px-4 py-3 text-sm ${uploaded ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                            {uploaded ? "✓" : "○"} {label} — {uploaded ? "Uploaded" : "Missing"}
                        </div>;
                    })}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="p-6 border-b border-slate-200">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Upload Document
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Upload documents required for your admission.
                    </p>

                </div>


                <form
                    onSubmit={handleUpload}
                    className="p-6"
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                        {/* Document Type */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Document Type
                            </label>


                            <select
                                value={documentType}
                                onChange={(e) =>
                                    setDocumentType(
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-slate-400"
                            >

                                <option value="">
                                    Select document
                                </option>

                                <option value="AADHAAR">
                                    Aadhaar Card
                                </option>

                                <option value="TENTH_MARKSHEET">
                                    10th Marksheet
                                </option>

                                <option value="TWELFTH_MARKSHEET">
                                    12th Marksheet
                                </option>

                                <option value="BTECH_DEGREE">
                                    B.Tech Degree Certificate
                                </option>

                                <option value="MTECH_DEGREE">
                                    M.Tech Degree Certificate
                                </option>

                                <option value="RESEARCH_PROPOSAL">
                                    Research Proposal
                                </option>

                                <option value="TRANSFER_CERTIFICATE">
                                    Transfer Certificate
                                </option>

                                <option value="PHOTO">
                                    Passport Photo
                                </option>

                                <option value="OTHER">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* File */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Select File
                            </label>


                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) =>
                                    setFile(
                                        e.target.files[0]
                                    )
                                }
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white"
                            />

                            <p className="mt-2 text-xs text-slate-500">
                                Maximum file size: 5 MB
                            </p>

                        </div>

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 px-6 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                        {loading
                            ? "Uploading..."
                            : "Upload Document"}

                    </button>

                </form>

            </div>


            {/* Documents List */}

            <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="p-6 border-b border-slate-200">

                    <h2 className="text-lg font-semibold text-slate-900">
                        My Documents
                    </h2>

                </div>


                {initialLoading ? (
                    <div className="p-8 text-center text-slate-500">Loading documents...</div>
                ) : documents.length === 0 ? (

                    <div className="p-8 text-center">

                        <p className="text-slate-500">
                            No documents uploaded yet.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead className="bg-slate-50">

                            <tr>

                                <th className="text-left px-6 py-4 font-medium text-slate-500">
                                    Document Type
                                </th>

                                <th className="text-left px-6 py-4 font-medium text-slate-500">
                                    File Name
                                </th>

                                <th className="text-left px-6 py-4 font-medium text-slate-500">
                                    Uploaded
                                </th>

                                <th className="text-left px-6 py-4 font-medium text-slate-500">
                                    Action
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {documents.map(
                                (document) => (

                                    <tr
                                        key={document.documentId}
                                        className="border-t border-slate-100"
                                    >

                                        <td className="px-6 py-4 font-medium">
                                            {document.documentType}
                                        </td>


                                        <td className="px-6 py-4 text-slate-600">
                                            {document.fileName || "-"}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : "-"}
                                        </td>


                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleView(
                                                            document.documentId,
                                                            document.fileName
                                                        )
                                                    }
                                                    className="px-3 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50"
                                                >
                                                    View
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        handleDownload(
                                                            document.documentId,
                                                            document.fileName
                                                        )
                                                    }
                                                    className="px-3 py-2 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50"
                                                >
                                                    Download
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        setDocumentToDelete(document.documentId)
                                                    }
                                                    className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>
                                    </tr>

                                )
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Documents;
