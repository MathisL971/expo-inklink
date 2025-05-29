import type { APIGatewayProxyResult } from "aws-lambda";

// Response helpers
export function createResponse(
  statusCode: number,
  body: any
): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}

export function errorResponse(
  statusCode: number,
  message: string,
  error?: any
): APIGatewayProxyResult {
  console.error(`Error ${statusCode}:`, message, error);
  return createResponse(statusCode, {
    error: message,
    ...(process.env.NODE_ENV === "development" &&
      error && { details: error.message }),
  });
}
