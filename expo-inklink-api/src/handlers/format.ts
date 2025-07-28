import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { FormatModel } from "../schemas/format";
import { createResponse, errorResponse } from "../utils/response";

export async function handleFormatsGET(event: APIGatewayProxyEventV2) {
  const { pathParameters, queryStringParameters } = event;
  const formatId = pathParameters?.id;

  if (formatId) {
    // Get single format
    const singleFormat = await FormatModel.findById(formatId);
    if (!singleFormat) {
      return errorResponse(404, "Format not found");
    }
    return createResponse(200, singleFormat);
  } else {
    // Get all formats with optional query parameters
    const limit = queryStringParameters?.limit
      ? parseInt(queryStringParameters.limit)
      : 20;
    const skip = queryStringParameters?.skip
      ? parseInt(queryStringParameters.skip)
      : 0;

    const formats = await FormatModel.find({})
      .limit(limit)
      .skip(skip);
    
    return createResponse(200, { formats, count: formats.length });
  }
}