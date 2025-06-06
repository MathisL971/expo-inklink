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
  error?: unknown
): APIGatewayProxyResult {
  console.error(`Error ${statusCode}:`, message, error);

  const details =
    process.env.NODE_ENV === "development" && error
      ? { details: (error as Error).message }
      : {};

  return createResponse(statusCode, { error: message, ...details });
}
