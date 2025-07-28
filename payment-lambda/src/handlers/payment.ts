import type { APIGatewayProxyEventV2 } from "aws-lambda";
import Stripe from "stripe";
import { createResponse, errorResponse } from "../utils/response";

// Initialize Stripe with error handling
const initializeStripe = () => {
    const secretKey = process.env.STRIPE_SK_TEST;
    if (!secretKey) {
        throw new Error("STRIPE_SK_TEST environment variable is required");
    }

    return new Stripe(secretKey, {
        apiVersion: "2023-10-16",
    });
};

// Lazy initialization of Stripe
let stripeInstance: Stripe | null = null;
const getStripe = () => {
    if (!stripeInstance) {
        stripeInstance = initializeStripe();
    }
    return stripeInstance;
};

export async function handleCreatePaymentIntent(event: APIGatewayProxyEventV2) {
    try {
        if (!event.body) {
            return errorResponse(400, "Request body is required");
        }

        const { amount, currency = "usd", metadata = {} } = JSON.parse(event.body);

        // Validate amount
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return errorResponse(400, "Valid amount (in cents) is required");
        }

        // Validate currency
        if (typeof currency !== "string" || currency.length !== 3) {
            return errorResponse(400, "Valid 3-letter currency code is required");
        }

        const stripe = getStripe();

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount),
            currency: currency.toLowerCase(),
            metadata: {
                ...metadata,
                created_at: new Date().toISOString(),
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return createResponse(200, {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error: any) {
        console.error("Payment intent creation error:", error);

        if (error.type === "StripePermissionError") {
            return errorResponse(403, "You are not authorized to create a payment intent");
        }

        if (error.type === "StripeCardError") {
            return errorResponse(400, error.message);
        }

        if (error.type === "StripeRateLimitError") {
            return errorResponse(429, "Too many requests. Please try again later.");
        }

        if (error.type === "StripeInvalidRequestError") {
            return errorResponse(400, "Invalid request parameters");
        }

        if (error.type === "StripeAPIError") {
            return errorResponse(502, "Payment service temporarily unavailable");
        }

        if (error.type === "StripeConnectionError") {
            return errorResponse(502, "Network error. Please try again.");
        }

        if (error.type === "StripeAuthenticationError") {
            return errorResponse(500, "Payment service configuration error");
        }

        return errorResponse(500, "Failed to create payment intent");
    }
}

export async function handleConfirmPayment(event: APIGatewayProxyEventV2) {
    try {
        if (!event.body) {
            return errorResponse(400, "Request body is required");
        }

        const { paymentIntentId } = JSON.parse(event.body);

        if (!paymentIntentId || typeof paymentIntentId !== "string") {
            return errorResponse(400, "Valid payment intent ID is required");
        }

        const stripe = getStripe();

        // Retrieve payment intent to check status
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        return createResponse(200, {
            paymentIntent: {
                id: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                metadata: paymentIntent.metadata,
                created: paymentIntent.created,
                client_secret: paymentIntent.client_secret,
            },
        });
    } catch (error: any) {
        console.error("Payment confirmation error:", error);

        if (error.type === "StripeInvalidRequestError") {
            return errorResponse(400, "Invalid payment intent ID");
        }

        if (error.type === "StripeAPIError") {
            return errorResponse(502, "Payment service temporarily unavailable");
        }

        return errorResponse(500, "Failed to confirm payment");
    }
}

export async function handleWebhook(event: APIGatewayProxyEventV2) {
    try {
        // const sig = event.headers["stripe-signature"];
        // const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        // if (!sig || !endpointSecret) {
        //     return errorResponse(400, "Missing webhook signature or endpoint secret");
        // }

        // if (!event.body) {
        //     return errorResponse(400, "Request body is required");
        // }

        // const stripe = getStripe();

        // // Verify webhook signature
        // const webhookEvent = stripe.webhooks.constructEvent(
        //     event.body,
        //     sig,
        //     endpointSecret
        // );

        // // Handle different webhook events
        // switch (webhookEvent.type) {
        //     case "payment_intent.succeeded":
        //         const paymentIntent = webhookEvent.data.object as Stripe.PaymentIntent;
        //         console.log("Payment succeeded:", paymentIntent.id);
        //         // Here you could update your database, send confirmation emails, etc.
        //         break;

        //     case "payment_intent.payment_failed":
        //         const failedPayment = webhookEvent.data.object as Stripe.PaymentIntent;
        //         console.log("Payment failed:", failedPayment.id);
        //         // Handle failed payment
        //         break;

        //     default:
        //         console.log(`Unhandled webhook event type: ${webhookEvent.type}`);
        // }

        return createResponse(200, { received: true });
    } catch (error: any) {
        console.error("Webhook error:", error);

        if (error.type === "StripeSignatureVerificationError") {
            return errorResponse(400, "Invalid webhook signature");
        }

        return errorResponse(500, "Webhook processing failed");
    }
} 