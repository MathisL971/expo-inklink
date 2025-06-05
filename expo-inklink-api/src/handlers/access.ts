import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { AccessModel } from "../schemas/access";
import { createResponse, errorResponse } from "../utils/response";

export async function handleAccessesGET(event: APIGatewayProxyEventV2) {
  const { pathParameters, queryStringParameters } = event;
  const accessId = pathParameters?.id;

  if (accessId) {
    // Get single event
    const singleAccess = await AccessModel.findById(accessId);
    if (!singleAccess) {
      return errorResponse(404, "Access not found");
    }
    return createResponse(200, singleAccess);
  } else {
    // Get all events with optional query parameters
    const limit = queryStringParameters?.limit
      ? parseInt(queryStringParameters.limit)
      : 20;
    const skip = queryStringParameters?.skip
      ? parseInt(queryStringParameters.skip)
      : 0;

    const accesses = await AccessModel.find({})
      .limit(limit)
      .skip(skip);
    
    return createResponse(200, { accesses, count: accesses.length });
  }
}