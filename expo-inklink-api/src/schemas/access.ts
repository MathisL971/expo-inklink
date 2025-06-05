import mongoose, { InferSchemaType, Schema } from "mongoose";

const accessSchema = new Schema(
  {
    // Remove the custom 'id' field - Mongoose creates _id automatically
    name: { type: String, required: true },
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

export const AccessModel = mongoose.model("Access", accessSchema);

// Infer the type from schema
type Access = InferSchemaType<typeof accessSchema> & {
  _id: mongoose.Types.ObjectId;
};

export type { Access };
