
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
// import dotenv from 'dotenv';
import { connect, model } from 'mongoose';
import { eventSchema } from './schemas/event';

// dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('Please add your Mongo URI to .env.local');
  throw new Error('Please add your Mongo URI to .env.local');
}

let isConnected = false;

async function connectToDB() {
  if (isConnected) return;
  await connect(process.env.MONGODB_URI!, { dbName: process.env.DATABASE_NAME });
  isConnected = true;
  console.log('Connected to MongoDB');
}

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  /* By default, the callback waits until the runtime event loop is empty before freezing the process and returning the results to the caller. Setting this property to false requests that AWS Lambda freeze the process soon after the callback is invoked, even if there are events in the event loop. AWS Lambda will freeze the process, any state data, and the events in the event loop. Any remaining events in the event loop are processed when the Lambda function is next invoked, if AWS Lambda chooses to use the frozen process. */
  context.callbackWaitsForEmptyEventLoop = false;

  await connectToDB();

  const Event = model('Event', eventSchema);

  // Make a MongoDB MQL Query to go into the movies collection and return the first 20 movies.
  const events = await Event.find({});

  const response = {
    statusCode: 200,
    body: JSON.stringify(events),
  };

  return response;
}