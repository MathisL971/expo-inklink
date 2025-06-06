import type { S3Event, S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";
import Sharp from "sharp"; // Ensure Sharp is packaged with the Lambda layer or deployment

const s3 = new S3();

// Environment variables validation at startup for image processing
const PROCESSED_BUCKET_NAME =
  process.env.PROCESSED_BUCKET_NAME || process.env.BUCKET_NAME;
if (!PROCESSED_BUCKET_NAME) {
  console.error(
    "Target bucket environment variable (PROCESSED_BUCKET_NAME or BUCKET_NAME) is not set for image processor."
  );
  throw new Error(
    "Target bucket environment variable is not set for image processor."
  );
}

/**
 * @description Processes an image uploaded to S3, creating resized versions.
 * Triggered by an S3 event (e.g., object creation).
 * @param {S3Event} event - The S3 event trigger.
 * @param {Context} context - Lambda runtime context.
 */
export const processImage: S3Handler = async (
  event: S3Event
): Promise<void> => {
  // Log the entire event for debugging if needed, but be mindful of PII in production logs
  // console.log('Received S3 event:', JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const sourceBucket = record.s3.bucket.name;
    // Object key may have spaces or special characters, needs decoding.
    const sourceKey = decodeURIComponent(
      record.s3.object.key.replace(/\+/g, " ")
    );

    console.log(`Processing image: s3://${sourceBucket}/${sourceKey}`);

    // Prevent recursive triggers if writing to the same bucket with a different prefix/suffix
    // This basic check assumes processed images have a recognizable pattern (e.g., _thumbnail.jpg)
    if (sourceKey.match(/_(thumbnail|medium|large)\.(jpg|jpeg|png|webp)$/i)) {
      console.log(`Skipping already processed image: ${sourceKey}`);
      continue;
    }

    // Prevent processing if the file is not an image based on extension
    const imageTypeMatch = sourceKey.match(/\.(jpe?g|png|webp|gif)$/i);
    if (!imageTypeMatch) {
      console.log(`Skipping non-image file: ${sourceKey}`);
      continue;
    }
    const originalImageType =
      imageTypeMatch[1].toLowerCase() === "jpg"
        ? "jpeg"
        : imageTypeMatch[1].toLowerCase();

    try {
      // Get original image from S3
      const originalImage = await s3
        .getObject({ Bucket: sourceBucket, Key: sourceKey })
        .promise();

      if (!originalImage.Body) {
        throw new Error(
          `Image body is empty for key: ${sourceKey} in bucket: ${sourceBucket}`
        );
      }

      // Define image sizes for processing
      const sizes = [
        { name: "thumbnail", width: 150, height: 150, format: "jpeg" }, // always convert thumbnails to jpeg for consistency
        { name: "medium", width: 800, height: 600, format: originalImageType },
        // { name: 'large', width: 1200, height: 900, format: originalImageType } // Example: keeping original format for larger
      ];

      // Process and upload resized images
      const processingPromises = sizes.map(async (size) => {
        let sharpInstance = Sharp(originalImage.Body as Buffer).resize(
          size.width,
          size.height,
          { fit: "cover", position: Sharp.strategy.entropy }
        ); // 'entropy' for better focus

        let targetContentType: string;
        let targetExtension: string;

        // Handle format conversion
        if (size.format === "jpeg") {
          sharpInstance = sharpInstance.jpeg({
            quality: 80,
            progressive: true,
          });
          targetContentType = "image/jpeg";
          targetExtension = "jpg";
        } else if (size.format === "png") {
          sharpInstance = sharpInstance.png({ quality: 80 }); // Adjust quality as needed
          targetContentType = "image/png";
          targetExtension = "png";
        } else if (size.format === "webp") {
          sharpInstance = sharpInstance.webp({ quality: 75 });
          targetContentType = "image/webp";
          targetExtension = "webp";
        } else {
          // Default to JPEG if original format is not web-friendly for resizing (e.g. gif)
          console.warn(
            `Unsupported format ${size.format} for direct conversion, defaulting to JPEG for ${size.name}`
          );
          sharpInstance = sharpInstance.jpeg({
            quality: 80,
            progressive: true,
          });
          targetContentType = "image/jpeg";
          targetExtension = "jpg";
        }

        const resizedImageBuffer = await sharpInstance.toBuffer();

        // Construct the new key for the resized image.
        // Example: 'events/some-event-id/original.png' -> 'events/some-event-id/original_thumbnail.jpg'
        const baseName = sourceKey.substring(0, sourceKey.lastIndexOf("."));
        const newKey = `${baseName}_${size.name}.${targetExtension}`;

        console.log(
          `Uploading processed image: s3://${PROCESSED_BUCKET_NAME}/${newKey}`
        );
        return s3
          .putObject({
            Bucket: PROCESSED_BUCKET_NAME as string, // Use the PROCESSED_BUCKET_NAME
            Key: newKey,
            Body: resizedImageBuffer,
            ContentType: targetContentType,
            // ACL: "public-read", // Or 'private' depending on your needs
          })
          .promise();
      });

      await Promise.all(processingPromises);
      console.log(
        `Successfully processed and uploaded derivatives for ${sourceKey}`
      );
    } catch (error: any) {
      console.error(
        `Error processing image ${sourceKey} from bucket ${sourceBucket}:`,
        error
      );
      // Decide if a single record failure should cause the whole Lambda invocation to fail.
      // For S3 events, it's often better to log and continue, so other records can be processed.
      // However, re-throwing will mark the specific batch record as failed for SQS DLQ etc.
      // throw error; // Uncomment if you want to signal failure for this specific record
    }
  }
};
