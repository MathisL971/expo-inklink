import mongoose, { InferSchemaType, Schema } from "mongoose";

const disciplineSchema = new Schema(
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

export const DisciplineModel = mongoose.model("Discipline", disciplineSchema);

// Infer the type from schema
type Discipline = InferSchemaType<typeof disciplineSchema> & {
  _id: mongoose.Types.ObjectId;
};

export type { Discipline };
