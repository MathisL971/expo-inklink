import mongoose, { InferSchemaType, Schema } from "mongoose";

// Define the enum values
const FormatNames = [
  "Lecture",
  "Conference",
  "Seminar",
  "Colloquium",
  "Symposium",
  "Panel",
  "Roundtable",
  "Workshop",
  "Webinar",
  "Discussion",
  "Debate",
  "Book Talk",
  "Poster Session",
  "Networking Event",
  "Training Session",
  "Keynote",
  "Town Hall",
  "Fireside Chat",
] as const;

const DisciplineNames = [
  "Political Science",
  "Economics",
  "History",
  "Sociology",
  "Anthropology",
  "Psychology",
  "Human Geography",
  "Linguistics",
  "Archaeology",
  "Law",
  "Education",
  "Communication Studies",
  "Development Studies",
  "International Relations",
  "Criminology",
  "Demography",
  "Social Work",
  "Cultural Studies",
] as const;

const AccessNames = ["Public", "Private", "Invitation Only"] as const;

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    note: { type: String, required: false },
    image: { type: String, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    source: { type: String, required: false },
    format: {
      type: String,
      required: true,
      enum: FormatNames,
    },
    disciplines: [
      {
        type: String,
        enum: DisciplineNames,
        required: true,
      },
    ],
    access: {
      type: String,
      required: true,
      enum: AccessNames,
    },
    organizerId: { type: String, required: false },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
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
