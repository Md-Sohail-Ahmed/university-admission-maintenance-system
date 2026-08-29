import { useState } from "react";

function Payment() {

    const [loading, setLoading] = useState(false);

    // Temporary values for testing
    const admissionId = 1;
    const amount = 100;

    const loadRazorpayScript = () => {

        return new Promise((resolve) => {

            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };


    const handlePayment = async () => {

        setLoading(true);

        try {

            // 1. Load Razorpay Checkout
            const loaded = await loadRazorpayScript();

            if (!loaded) {
                alert("Razorpay SDK failed to load");
                return;
            }


            // 2. Create Razorpay order
            const response = await fetch(
                `http://localhost:8081/api/payments/create-order?admissionId=${admissionId}&amount=${amount}`,
                {
                    method: "POST"
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                console.error("Backend error:", errorText);

                throw new Error(errorText);
            }

            const order = await response.json();


            // 3. Razorpay Checkout configuration
            const options = {

                key: order.keyId,

                amount: order.amount * 100,

                currency: order.currency,

                name: "University Admission System",

                description: "Admission Fee",

                order_id: order.orderId,

                handler: async function (paymentResponse) {

                    console.log(
                        "Razorpay Response:",
                        paymentResponse
                    );

                    // 4. Verify payment with backend
                    const verifyResponse = await fetch(
                        "http://localhost:8081/api/payments/verify",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded"
                            },

                            body: new URLSearchParams({

                                razorpayOrderId:
                                paymentResponse
                                    .razorpay_order_id,

                                razorpayPaymentId:
                                paymentResponse
                                    .razorpay_payment_id,

                                razorpaySignature:
                                paymentResponse
                                    .razorpay_signature
                            })
                        }
                    );


                    if (!verifyResponse.ok) {

                        alert(
                            "Payment verification failed"
                        );

                        return;
                    }


                    const verifiedPayment =
                        await verifyResponse.json();

                    console.log(
                        "Verified Payment:",
                        verifiedPayment
                    );

                    alert(
                        "Payment successful!"
                    );
                },


                prefill: {
                    name: "Test Student",
                    email: "student@example.com",
                    contact: "9999999999"
                },


                theme: {
                    color: "#3399cc"
                }
            };


            // 5. Open Razorpay Checkout
            const razorpay =
                new window.Razorpay(options);

            razorpay.open();


        } catch (error) {

            console.error(error);

            alert(error.message);

        } finally {

            setLoading(false);
        }
    };


    return (
        <div>

            <h1>
                University Admission System
            </h1>

            <h2>
                Admission Fee: ₹{amount}
            </h2>

            <button
                onClick={handlePayment}
                disabled={loading}
            >
                {loading
                    ? "Processing..."
                    : "Pay Now"}
            </button>

        </div>
    );
}

export default Payment;