import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { getPaymentSummary } from "../services/api";

function Dashboard() {

    const admissionId = 1;

    const [paymentSummary, setPaymentSummary] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadData = async () => {

            try {

                const data =
                    await getPaymentSummary(admissionId);

                setPaymentSummary(data);

            } catch (error) {

                console.error(error);

                setError(error.message);
            }
        };

        loadData();

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


    if (!paymentSummary) {

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
                    Welcome back, Test Student 👋
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