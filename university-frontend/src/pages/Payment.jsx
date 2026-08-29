import { useCallback, useEffect, useState } from "react";
import { createPaymentOrder, getAdmissionByStudent, getLoggedInStudent, getPaymentSummary, verifyPayment } from "../services/api";

const statusClass = (s) => s === "SUCCESS" ? "bg-green-100 text-green-700" : s === "FAILED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700";
const Card = ({ label, value, color = "text-slate-900" }) => <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className={`mt-2 text-2xl font-bold ${color}`}>₹{value}</p></div>;

function Payment() {
    const student = getLoggedInStudent(); const studentId = student?.studentId;
    const [admission, setAdmission] = useState(null); const [summary, setSummary] = useState(null); const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true); const [paying, setPaying] = useState(false); const [error, setError] = useState(""); const [success, setSuccess] = useState("");
    const load = useCallback(async () => { setLoading(true); setError(""); try { const a = await getAdmissionByStudent(studentId); setAdmission(a); setSummary(a ? await getPaymentSummary(a.admissionId) : null); } catch (e) { setError(e.message); } finally { setLoading(false); } }, [studentId]);
    useEffect(() => { load(); }, [load]);
    const loadRazorpay = () => new Promise((resolve) => { if (window.Razorpay) return resolve(true); const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.onload = () => resolve(true); script.onerror = () => resolve(false); document.body.appendChild(script); });
    const pay = async () => {
        const paymentAmount = Number(amount); const remaining = Number(summary?.remainingAmount);
        setError(""); setSuccess("");
        if (!paymentAmount || paymentAmount <= 0) return setError("Enter a valid payment amount.");
        if (paymentAmount > remaining) return setError(`You can pay up to ₹${summary.remainingAmount}.`);
        setPaying(true);
        try { if (!await loadRazorpay()) throw new Error("Unable to load Razorpay."); const order = await createPaymentOrder(admission.admissionId, paymentAmount);
            const razorpay = new window.Razorpay({ key: order.keyId, amount: Number(order.amount) * 100, currency: order.currency, name: "University Admission System", description: "Admission Fee Payment", order_id: order.orderId, prefill: { name: student?.name, email: student?.email, contact: student?.phone }, theme: { color: "#0f172a" }, handler: async (response) => { try { await verifyPayment(response); setSuccess("Payment successful."); setAmount(""); await load(); } catch (e) { setError(e.message); } } }); razorpay.open();
        } catch (e) { setError(e.message); } finally { setPaying(false); }
    };
    if (loading) return <div className="p-6 text-slate-500">Loading payment details...</div>;
    if (error && !summary) return <div className="p-6"><div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error} <button onClick={load} className="underline">Retry</button></div></div>;
    if (!admission) return <div className="p-6"><div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">No admission is available for payment yet.</div></div>;
    return <div className="p-4 sm:p-6"><div className="mb-8"><h1 className="text-2xl font-bold">Payments</h1><p className="mt-1 text-slate-500">Manage your admission fee payments.</p></div>{error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}{success && <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">{success}</div>}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3"><Card label="Course Fee" value={summary.courseFee}/><Card label="Paid Amount" value={summary.totalPaid} color="text-green-600"/><Card label="Remaining Amount" value={summary.remainingAmount} color="text-orange-600"/></div>
        {Number(summary.remainingAmount) > 0 && admission.status === "APPROVED" ? <section className="mt-7 rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b p-5"><h2 className="font-semibold">Demo Payment</h2><p className="mt-1 text-sm text-slate-500">Training payment only. Pay any amount up to ₹{summary.remainingAmount}.</p></div><div className="max-w-md p-5"><input type="number" min="1" max={summary.remainingAmount} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Payment amount" className="w-full rounded-lg border border-slate-300 px-4 py-3"/><button onClick={pay} disabled={paying} className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white disabled:opacity-50">{paying ? "Processing..." : "Pay Remaining Fee"}</button></div></section> : Number(summary.remainingAmount) <= 0 ? <div className="mt-7 rounded-xl border border-green-200 bg-green-50 p-5 text-green-800"><h2 className="font-semibold">Fully Paid</h2><p className="mt-1 text-sm">Your admission fee has been paid in full.</p></div> : <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-800"><h2 className="font-semibold">Payment unavailable</h2><p className="mt-1 text-sm">Fee payment will be enabled after your admission is approved.</p></div>}
        <section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b p-5"><h2 className="font-semibold">Payment History</h2></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr><th className="px-5 py-3">Payment ID</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Mode</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{summary.payments?.length ? summary.payments.map((p) => <tr key={p.paymentId} className="border-t"><td className="px-5 py-4">#{p.paymentId}</td><td className="px-5 py-4">₹{p.amount}</td><td className="px-5 py-4 capitalize">{p.paymentMode || "—"}</td><td className="px-5 py-4">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "—"}</td><td className="px-5 py-4"><span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass(p.status)}`}>{p.status}</span></td></tr>) : <tr><td colSpan="5" className="p-8 text-center text-slate-500">No payments yet.</td></tr>}</tbody></table></div></section>
    </div>;
}
export default Payment;
