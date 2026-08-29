import { useEffect, useState } from "react";
import { getPaymentSummary } from "../services/api";

function Payment() {

    const admissionId = 1;

    const [summary, setSummary] = useState(null);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const loadPaymentSummary = async () => {

        try {

            setError("");

            const data =
                await getPaymentSummary(admissionId);

            setSummary(data);

        } catch (error) {

            console.error(error);

            setError(error.message);
        }
    };


    useEffect(() => {

        loadPaymentSummary();

    }, []);


    const loadRazorpayScript = () => {

        return new Promise((resolve) => {

            const script =
                document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);

            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };


    const handlePayment = async () => {

        setError("");
        setSuccess("");


        const paymentAmount =
            Number(amount);


        if (!paymentAmount || paymentAmount <= 0) {

            setError(
                "Please enter a valid payment amount."
            );

            return;
        }


        if (
            paymentAmount >
            Number(summary.remainingAmount)
        ) {

            setError(
                `You can pay maximum ₹${summary.remainingAmount}.`
            );

            return;
        }


        setLoading(true);


        try {

            const razorpayLoaded =
                await loadRazorpayScript();


            if (!razorpayLoaded) {

                throw new Error(
                    "Unable to load Razorpay."
                );
            }


            // Create Razorpay order

            const response = await fetch(
                `http://localhost:8081/api/payments/create-order?admissionId=${admissionId}&amount=${paymentAmount}`,
                {
                    method: "POST"
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to create payment order."
                );
            }


            const order =
                await response.json();


            // Razorpay Checkout

            const options = {

                key: order.keyId,

                amount: order.amount * 100,

                currency: order.currency,

                name: "University Admission System",

                description: "Admission Fee Payment",

                order_id: order.orderId,


                prefill: {

                    name: "Sohail Ahmed",

                    email: "sohail@gmail.com",

                    contact: "9876543201"
                },


                theme: {

                    color: "#0f172a"
                },


                handler: async function (
                    paymentResponse
                ) {

                    try {

                        const verifyResponse =
                            await fetch(
                                "http://localhost:8081/api/payments/verify",
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/x-www-form-urlencoded"
                                    },

                                    body:
                                        new URLSearchParams({

                                            razorpayOrderId:
                                            paymentResponse.razorpay_order_id,

                                            razorpayPaymentId:
                                            paymentResponse.razorpay_payment_id,

                                            razorpaySignature:
                                            paymentResponse.razorpay_signature
                                        })
                                }
                            );


                        if (!verifyResponse.ok) {

                            const errorText =
                                await verifyResponse.text();

                            throw new Error(
                                errorText ||
                                "Payment verification failed."
                            );
                        }


                        setSuccess(
                            "Payment successful!"
                        );

                        setAmount("");


                        // Reload payment data

                        await loadPaymentSummary();


                    } catch (error) {

                        console.error(error);

                        setError(
                            error.message
                        );
                    }
                }
            };


            const razorpay =
                new window.Razorpay(options);


            razorpay.open();


        } catch (error) {

            console.error(error);

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    if (!summary) {

        return (
            <div className="p-6">

                <p className="text-slate-500">
                    Loading payment details...
                </p>

            </div>
        );
    }


    return (

        <div className="p-6">

            {/* Header */}

            <div className="mb-8">

                <h1 className="text-2xl font-bold text-slate-900">
                    Payments
                </h1>

                <p className="mt-1 text-slate-500">
                    Manage your admission fee payments.
                </p>

            </div>


            {/* Error */}

            {error && (

                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>

            )}


            {/* Success */}

            {success && (

                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>

            )}


            {/* Payment Summary Cards */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

                    <p className="text-sm text-slate-500">
                        Total Course Fee
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        ₹{summary.courseFee}
                    </p>

                </div>


                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

                    <p className="text-sm text-slate-500">
                        Total Paid
                    </p>

                    <p className="mt-2 text-2xl font-bold text-green-600">
                        ₹{summary.totalPaid}
                    </p>

                </div>


                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

                    <p className="text-sm text-slate-500">
                        Remaining
                    </p>

                    <p className="mt-2 text-2xl font-bold text-orange-600">
                        ₹{summary.remainingAmount}
                    </p>

                </div>

            </div>


            {/* Make Payment */}

            {Number(summary.remainingAmount) > 0 && (

                <div className="mt-8 bg-white border border-slate-200 rounded-xl shadow-sm">

                    <div className="p-6 border-b border-slate-200">

                        <h2 className="text-lg font-semibold text-slate-900">
                            Make a Payment
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Pay any amount up to your remaining balance.
                        </p>

                    </div>


                    <div className="p-6">

                        <div className="max-w-md">

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Payment Amount
                            </label>


                            <div className="flex">

                                <span className="flex items-center px-4 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-slate-600">
                                    ₹
                                </span>


                                <input
                                    type="number"
                                    min="1"
                                    max={summary.remainingAmount}
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                    placeholder="Enter amount"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-r-lg outline-none focus:ring-2 focus:ring-slate-400"
                                />

                            </div>


                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="mt-4 w-full py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                                {loading
                                    ? "Processing..."
                                    : "Pay Now"}

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* Fully Paid */}

            {Number(summary.remainingAmount) <= 0 && (

                <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">

                    <h2 className="text-lg font-semibold text-green-800">
                        🎉 Admission Fee Fully Paid
                    </h2>

                    <p className="mt-1 text-sm text-green-700">
                        You have completed the payment for this admission.
                    </p>

                </div>

            )}


            {/* Payment History */}

            <div className="mt-8 bg-white border border-slate-200 rounded-xl shadow-sm">

                <div className="p-6 border-b border-slate-200">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Payment History
                    </h2>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-slate-50">

                        <tr>

                            <th className="text-left px-6 py-4 font-medium text-slate-500">
                                Amount
                            </th>

                            <th className="text-left px-6 py-4 font-medium text-slate-500">
                                Payment Mode
                            </th>

                            <th className="text-left px-6 py-4 font-medium text-slate-500">
                                Status
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {summary.payments.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="3"
                                    className="px-6 py-8 text-center text-slate-500"
                                >
                                    No payments yet.
                                </td>

                            </tr>

                        ) : (

                            summary.payments.map(
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
                            )

                        )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Payment;