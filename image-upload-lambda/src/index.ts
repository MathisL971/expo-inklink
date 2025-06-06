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

  const method = event.requestContext.http.method;
  let path = event.routeKey?.split(" ")[1]; // API Gateway sets routeKey as "METHOD /path"

  // Get rid of /S3 prefix
  if (path?.startsWith("/S3")) {
    path = path.slice(3);
  }

  const routeKey = `${method} ${path}`;
  const routeHandler = routes[routeKey];

  return routeHandler
    ? routeHandler(event)
    : {
        statusCode: 404,
        body: JSON.stringify({ error: "Route not found" }),
      };
};
