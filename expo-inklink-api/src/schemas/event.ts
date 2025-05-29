import mongoose, { InferSchemaType, Schema } from "mongoose";

const eventSchema = new Schema(
  {
    // Remove the custom 'id' field - Mongoose creates _id automatically
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false },
    date: { type: String, required: true },
    location: { type: String, required: true },
    link: { type: String, required: true },
  },
  {
    // Optional: Add timestamps
    timestamps: true,
    // Optional: Transform _id to id in JSON output
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const EventModel = mongoose.model("Event", eventSchema);

// Infer the type from schema
type Event = InferSchemaType<typeof eventSchema> & {
  _id: mongoose.Types.ObjectId;
};

export type { Event };
