import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { DisciplineModel } from "../schemas/discipline";
import { createResponse, errorResponse } from "../utils/response";

export async function handleDisciplinesGET(event: APIGatewayProxyEventV2) {
  const { pathParameters, queryStringParameters } = event;
  const disciplineId = pathParameters?.id;

  if (disciplineId) {
    // Get single discipline
    const singleDiscipline = await DisciplineModel.findById(disciplineId);
    if (!singleDiscipline) {
      return errorResponse(404, "Discipline not found");
    }
    return createResponse(200, singleDiscipline);
  } else {
    // Get all disciplines with optional query parameters
    const limit = queryStringParameters?.limit
      ? parseInt(queryStringParameters.limit)
      : 20;
    const skip = queryStringParameters?.skip
      ? parseInt(queryStringParameters.skip)
      : 0;

    const disciplines = await DisciplineModel.find({})
      .limit(limit)
      .skip(skip);
    
    return createResponse(200, { disciplines, count: disciplines.length });
  }
}