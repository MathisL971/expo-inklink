import type { APIGatewayProxyResultV2 } from "aws-lambda";

export function createResponse(
    statusCode: number,
    data: any,
    headers?: Record<string, string>
): APIGatewayProxyResultV2 {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            ...headers,
        },
        body: JSON.stringify(data),
    };
}

export function errorResponse(
    statusCode: number,
    message: string,
    error?: any
): APIGatewayProxyResultV2 {
    console.error("Error:", message, error);
    return createResponse(statusCode, {
        error: message,
        ...(process.env.NODE_ENV === "development" && error && { details: error }),
    });
} 