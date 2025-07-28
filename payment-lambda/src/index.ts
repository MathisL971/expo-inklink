import type {
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2,
} from "aws-lambda";
import { handleConfirmPayment, handleCreatePaymentIntent, handleWebhook } from "./handlers/payment";
import { createResponse, errorResponse } from "./utils/response";

// Environment validation
if (!process.env.STRIPE_SK_TEST) {
    console.error("STRIPE_SK_TEST environment variable is required");
    throw new Error("STRIPE_SK_TEST environment variable is required");
}

// Route parser
function parseRoute(event: APIGatewayProxyEventV2): {
    resource: string;
    method: string;
} {
    const path = event.rawPath || event.requestContext.http.path || "";
    const pathParts = path.split("/").filter(Boolean);

    if (pathParts[0] === "payment") {
        pathParts.shift();
    }

    const resource = pathParts.join("/") || "unknown";
    const method = event.requestContext.http.method || "GET";

    return { resource, method };
}

// Main handler
export async function handler(
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
    try {
        const { resource, method } = parseRoute(event);

        console.log(`Processing ${method} request for resource: ${resource}`);

        // Handle CORS preflight
        if (method === "OPTIONS") {
            return createResponse(200, { message: "CORS preflight handled" });
        }

        // Route handling
        switch (resource) {
            case "create-payment-intent":
                if (method === "POST") {
                    return await handleCreatePaymentIntent(event);
                }
                break;

            case "confirm-payment":
                if (method === "POST") {
                    return await handleConfirmPayment(event);
                }
                break;

            case "webhook":
                if (method === "POST") {
                    return await handleWebhook(event);
                }
                break;

            default:
                return errorResponse(404, `Resource '${resource}' not found`);
        }

        return errorResponse(405, `Method ${method} not allowed for resource ${resource}`);
    } catch (error: any) {
        console.error("Unhandled error:", error);
        return errorResponse(500, "Internal server error", {
            message: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
    }
} 