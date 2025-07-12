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

  let routeKey = `${method} ${path}`;
  let routeHandler = routes[routeKey];

  // Pattern match for /image/events/{key}
  if (!routeHandler) {
    const deleteImageMatch = path.match(/^\/image\/events\/(.+)$/);
    if (method === "DELETE" && deleteImageMatch) {
      routeHandler = routes["DELETE /image/events/{key}"];
      event.pathParameters = event.pathParameters || {};
      event.pathParameters.key = deleteImageMatch[1];
    }
  }

  return routeHandler
    ? routeHandler(event)
    : createResponse(404, { error: "Route not found" });
};
