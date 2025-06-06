import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { createResponse } from "../utils/response";
// Note: Sharp would be used in the image processing lambda, not directly here unless requirements change.

// Initialize AWS S3 client
const s3 = new S3();

// Environment variables validation at startup
const BUCKET_NAME = process.env.BUCKET_NAME;
if (!BUCKET_NAME) {
  console.error("BUCKET_NAME environment variable is not set.");
  throw new Error("BUCKET_NAME environment variable is not set.");
}

const CDN_URL = process.env.CLOUDFRONT_URL; // Optional
const AWS_REGION = process.env.AWS_REGION;
if (!AWS_REGION && !CDN_URL) {
  console.warn(
    "AWS_REGION is not set and CDN_URL is not set. imageUrl might be incomplete for S3 direct links."
  );
}
const STAGE = process.env.STAGE || "prod"; // Default to 'prod' if not set

// Type definitions for request bodies
interface GeneratePresignedUrlBody {
  fileName: string;
  fileType: string;
  userId?: string;
}

/**
 * @description Generates a pre-signed URL for uploading a file to S3.
 * @param {APIGatewayProxyEventV2} event - The API Gateway V2 event with file details in the body.
 * @returns {Promise<APIGatewayProxyResultV2>} - The API Gateway V2 response with the upload URL.
 */
export const generatePresignedUrl = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!event.body) {
      return createResponse(400, { error: "Request body is missing" });
    }

    // Parse the body safely
    let parsedBody: GeneratePresignedUrlBody;
    try {
      parsedBody = JSON.parse(event.body) as GeneratePresignedUrlBody;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return createResponse(400, {
        error: "Invalid JSON format in request body",
      });
    }

    const { fileName, fileType, userId } = parsedBody;

    // Validate input
    if (!fileName || !fileType) {
      return createResponse(400, {
        error: "fileName and fileType are required in the request body",
      });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(fileType)) {
      return createResponse(400, {
        error: `Invalid file type: ${fileType}. Only JPEG, PNG, WEBP, and GIF are allowed.`,
      });
    }

    // File size limit check (e.g., 10MB)
    // Note: event.body.length refers to the string length of the JSON payload,
    // not the actual file size. True file size validation should happen
    // client-side or via S3 policy/event after upload if strictly needed pre-presigned URL.
    // This check is a basic safeguard for the payload itself.
    const maxPayloadSize = 10 * 1024 * 1024; // 10MB for the JSON payload
    if (event.body.length > maxPayloadSize) {
      return createResponse(400, {
        error: "Request payload too large. Maximum size is 10MB.",
      });
    }

    // Generate unique key
    const folder = "events";
    const ext = (() => {
      const parts = fileName.split(".");
      return parts.length > 1 ? `.${parts.pop()}` : "";
    })();
    const uniqueKey = `${folder}/${uuidv4()}${ext}`;

    // S3 parameters for putObject presigned URL
    const s3PutParams = {
      Bucket: BUCKET_NAME,
      Key: uniqueKey,
      ContentType: fileType,
      Expires: 300, // 5 minutes
      // ACL: "public-read", // Consider 'private' if CDN serves private content or further processing is needed
      Metadata: {
        "uploaded-by": userId || "anonymous",
        "upload-timestamp": new Date().toISOString(),
        "original-filename": fileName,
      },
    };

    // Generate pre-signed URL
    const uploadUrl = await s3.getSignedUrlPromise("putObject", s3PutParams);

    // Construct final image URL
    let imageUrl: string;
    if (CDN_URL) {
      imageUrl = `${CDN_URL}/${uniqueKey}`;
    } else if (AWS_REGION) {
      imageUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uniqueKey}`;
    } else {
      // Fallback or warning if no region or CDN is configured
      imageUrl = `s3://${BUCKET_NAME}/${uniqueKey}`; // This is not a web-accessible URL
      console.warn(
        `Cannot construct full S3 HTTPS URL for ${uniqueKey} as AWS_REGION is not set and CDN_URL is not available.`
      );
    }

    return createResponse(200, {
      uploadUrl,
      imageUrl,
      key: uniqueKey,
      expiresIn: 300, // Corresponds to S3 presigned URL expiry
      uploadedAt: new Date().toISOString(), // Timestamp of URL generation
    });
  } catch (error: any) {
    console.error("Presigned URL generation error:", error);
    return createResponse(500, {
      error: "Failed to generate upload URL",
      message: STAGE === "dev" ? error.message : "Internal server error",
    });
  }
};

/**
 * @description Deletes an image from the S3 bucket.
 * @param {APIGatewayProxyEventV2} event - The API Gateway V2 event with the object key in pathParameters.
 * @returns {Promise<APIGatewayProxyResultV2>} - A confirmation or error message.
 */
export const deleteImage = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const key = event.pathParameters?.key;
    if (!key) {
      return createResponse(400, {
        error: "Image key is missing in path parameters",
      });
    }

    const decodedKey = decodeURIComponent(key);

    // Allow only keys in the expected folder or matching a known pattern
    const keyPattern = /^events\/[0-9a-f]+\.(jpg|png|webp|gif)$/i;
    if (!keyPattern.test(decodedKey)) {
      console.warn(`Blocked deletion of invalid key: ${decodedKey}`);
      return createResponse(403, {
        error: "Unauthorized deletion attempt: Invalid or disallowed key.",
      });
    }

    await s3
      .deleteObject({
        Bucket: BUCKET_NAME,
        Key: "events/" + decodedKey,
      })
      .promise();

    return createResponse(200, {
      message: "Image deleted successfully",
      key: decodedKey,
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    if (error.code === "NoSuchKey") {
      return createResponse(404, { error: "Image not found" });
    }
    return createResponse(500, {
      error: "Failed to delete image",
      message: STAGE === "dev" ? error.message : "Internal server error",
    });
  }
};

/**
 * @description Retrieves the status (metadata) of an uploaded file from S3.
 * @param {APIGatewayProxyEventV2} event - The API Gateway V2 event with the object key in pathParameters.
 * @returns {Promise<APIGatewayProxyResultV2>} - The file status or an error message.
 */
export const getUploadStatus = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const key = event.pathParameters?.key;
    if (!key) {
      return createResponse(400, {
        error: "Image key is missing in path parameters",
      });
    }
    const decodedKey = decodeURIComponent(key);

    const headObject = await s3
      .headObject({
        Bucket: BUCKET_NAME,
        Key: decodedKey,
      })
      .promise();

    return createResponse(200, {
      exists: true,
      key: decodedKey,
      size: headObject.ContentLength,
      lastModified: headObject.LastModified?.toISOString(), // Ensure ISO string format
      contentType: headObject.ContentType,
      metadata: headObject.Metadata,
      eTag: headObject.ETag,
      versionId: headObject.VersionId, // if versioning is enabled
    });
  } catch (error: any) {
    console.error("Status check error:", error);
    // AWS SDK S3 headObject throws an error with statusCode 404 if not found,
    // error.code might be 'NotFound' or specific to S3 'NoSuchKey' can also occur
    // depending on how S3 is configured or if it's a different kind of error.
    // For V2, a more robust check could involve checking error.name or error.$metadata.httpStatusCode
    if (
      error.name === "NotFound" ||
      (error.$metadata && error.$metadata.httpStatusCode === 404) ||
      error.code === "NoSuchKey"
    ) {
      return createResponse(404, {
        exists: false,
        key: decodeURIComponent(event.pathParameters?.key || ""),
      });
    }
    return createResponse(500, {
      error: "Failed to check file status",
      message: STAGE === "dev" ? error.message : "Internal server error",
    });
  }
};
