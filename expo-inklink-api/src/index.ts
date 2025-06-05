import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { connect } from "mongoose";
import { handleAccessesGET } from "./handlers/access";
import { handleDisciplinesGET } from "./handlers/discipline";
import {
  handleEventsDELETE,
  handleEventsGET,
  handleEventsPOST,
  handleEventsPUT,
} from "./handlers/event";
import { handleFormatsGET } from "./handlers/format";
import { AccessModel } from "./schemas/access";
import { DisciplineModel } from "./schemas/discipline";
import { EventModel } from "./schemas/event";
import { FormatModel } from "./schemas/format";
import { createResponse, errorResponse } from "./utils/response";
// Import other models as needed

// Environment validation
if (!process.env.MONGODB_URI) {
  console.error("Please add your Mongo URI to .env.local");
  throw new Error("Please add your Mongo URI to .env.local");
}

// Database connection management
let isConnected = false;

async function connectToDB() {
  if (isConnected) return;
  await connect(process.env.MONGODB_URI!, {
    dbName: process.env.DATABASE_NAME,
  });
  isConnected = true;
  console.log("Connected to MongoDB");
}

// Resource configuration - easily extensible
const RESOURCE_CONFIG = {
  events: {
    model: EventModel,
    allowedMethods: ["GET", "POST", "PUT", "DELETE"],
  },
  formats: {
    model: FormatModel,
    allowedMethods: ["GET"]
  },
  disciplines: {
    model: DisciplineModel,
    allowedMethods: ["GET"] 
  },
  accesses: {
    model: AccessModel,
    allowedMethods: ["GET"]
  }
  // Add more resources here
} as const;

// Generic resource handler factory
function createResourceHandler(resourceName: string) {
  const handlers = {
    events: {
      GET: handleEventsGET,
      POST: handleEventsPOST,
      PUT: handleEventsPUT,
      DELETE: handleEventsDELETE,
    },
    formats: {
      GET: handleFormatsGET
    },
    disciplines: {
      GET: handleDisciplinesGET
    },
    accesses: {
      GET: handleAccessesGET
    }
    // Add more resource handlers here
  };

  return handlers[resourceName as keyof typeof handlers];
}

// Route parser
function parseRoute(event: APIGatewayProxyEventV2): {
  resource: string;
  id?: string;
} {
  const path = event.rawPath || event.requestContext.http.path || "";
  const pathParts = path.split("/").filter(Boolean);

  // Get rid of api prefix
  if (pathParts[0] === "api") {
    pathParts.shift();
  }

  // Assumes routes like: /events, /events/{id}, /users, /users/{id}
  const resource = pathParts[0];
  const id = pathParts[1] !== undefined ? pathParts[1] : undefined;

  return { resource, id };
}

// Main handler
export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    if (!event.requestContext.http.method) {
      return errorResponse(400, "Missing HTTP method");
    }

    // Handle CORS preflight
    if (event.requestContext.http.method === "OPTIONS") {
      return createResponse(200, {});
    }

    // Connect to database
    await connectToDB();

    // Parse route
    const { resource } = parseRoute(event);

    // Validate resource
    if (!resource || !(resource in RESOURCE_CONFIG)) {
      return errorResponse(404, `Resource '${resource}' not found`);
    }

    const resourceConfig =
      RESOURCE_CONFIG[resource as keyof typeof RESOURCE_CONFIG];

    // Validate HTTP method
    if (
      !resourceConfig.allowedMethods.includes(
        event.requestContext.http.method as any
      )
    ) {
      return errorResponse(
        405,
        `Method ${event.requestContext.http.method} not allowed for resource ${resource}`
      );
    }

    // Get resource handler
    const resourceHandlers = createResourceHandler(resource);

    if (!resourceHandlers) {
      return errorResponse(500, `No handlers found for resource: ${resource}`);
    }

    const methodHandler =
      resourceHandlers[
        event.requestContext.http.method as keyof typeof resourceHandlers
      ];

    if (!methodHandler) {
      return errorResponse(
        405,
        `Handler for ${event.requestContext.http.method} not implemented for ${resource}`
      );
    }

    // Execute handler
    return await methodHandler(event);
  } catch (error: any) {
    console.error("Unhandled error:", error);
    return errorResponse(500, "Internal server error", error);
  }
}
