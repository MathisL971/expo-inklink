import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import {
  deleteImage,
  generatePresignedUrl,
  getUploadStatus,
} from "./handlers/s3-handler";
import { createResponse, errorResponse } from "./utils/response";

const routes: {
  [key: string]: (
    event: APIGatewayProxyEventV2
  ) => Promise<APIGatewayProxyResultV2>;
} = {
  "POST /upload-url": generatePresignedUrl,
  "DELETE /image/events/{key}": deleteImage,
  "GET /image/{key}": getUploadStatus,
};

export const handler = async (event: APIGatewayProxyEventV2) => {
  if (!event.requestContext.http.method) {
    return errorResponse(400, "Missing HTTP method");
  }

  // Handle CORS preflight
  if (event.requestContext.http.method === "OPTIONS") {
    return createResponse(200, {});
  }

  const { method, path: rawPath } = event.requestContext.http;
  const path = rawPath.replace(/^\/S3/, ""); // strip optional prefix

  const routeKey = `${method} ${path}`;
  const routeHandler = routes[routeKey];

  return routeHandler
    ? routeHandler(event)
    : createResponse(404, { error: "Route not found" });
};
