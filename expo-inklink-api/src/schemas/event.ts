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
  "Philosophy",
] as const;

const AccessNames = ["Public", "Private", "Invitation Only"] as const;

const EventTypeNames = ["In-Person", "Online", "Hybrid"] as const;

const VideoConferencePlatformNames = ["Zoom", "Teams", "Google Meet", "WebEx", "GoToMeeting", "Other"] as const;

const LanguageNames = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Chinese (Mandarin)",
  "Chinese (Cantonese)",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Bengali",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Polish",
  "Czech",
  "Hungarian",
  "Greek",
  "Hebrew",
  "Turkish",
  "Persian (Farsi)",
  "Urdu",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Thai",
  "Vietnamese",
  "Indonesian",
  "Malay",
  "Tagalog",
  "Swahili",
  "Amharic",
  "Yoruba",
  "Hausa",
  "Igbo",
  "Zulu",
  "Afrikaans",
  "Romanian",
  "Bulgarian",
  "Serbian",
  "Croatian",
  "Bosnian",
  "Slovenian",
  "Slovak",
  "Lithuanian",
  "Latvian",
  "Estonian",
  "Ukrainian",
  "Belarusian",
  "Georgian",
  "Armenian",
  "Azerbaijani",
  "Kazakh",
  "Uzbek",
  "Kyrgyz",
  "Tajik",
  "Turkmen",
  "Mongolian",
  "Tibetan",
  "Burmese",
  "Khmer",
  "Lao",
  "Sinhala",
  "Nepali",
  "Pashto",
  "Dari",
  "Kurdish",
  "Maltese",
  "Basque",
  "Catalan",
  "Galician",
  "Welsh",
  "Irish",
  "Scottish Gaelic",
  "Breton",
  "Luxembourgish",
  "Frisian",
  "Icelandic",
  "Faroese",
  "Albanian",
  "Macedonian",
  "Montenegrin",
  "Esperanto",
  "Latin",
  "Sanskrit",
  "Other"
] as const;

// Define the address schema
const addressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  venue: { type: String, required: false }, // Optional venue name
  parkingAvailable: { type: String, required: false }, // "Yes", "No", or "Limited"
  parkingDetails: { type: String, required: false }, // Description of parking options
  parkingInstructions: { type: String, required: false }, // Instructions for parking
  parkingCost: { type: String, required: false }, // Cost information for parking
}, { _id: false }); // Don't create separate _id for subdocument

// Define the video conference schema
const videoConferenceSchema = new Schema({
  platform: {
    type: String,
    required: true,
    enum: VideoConferencePlatformNames
  },
  link: { type: String, required: true },
  meetingId: { type: String, required: false },
  passcode: { type: String, required: false },
  instructions: { type: String, required: false },
}, { _id: false }); // Don't create separate _id for subdocument

// Define the ticket tier schema
const ticketTierSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  description: { type: String, required: false },
}, { _id: true }); // Allow MongoDB to generate _id for each ticket tier

// Define the featured guest schema
const featuredGuestSchema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: false },
  bio: { type: String, required: false },
  image: { type: String, required: false },
  organization: { type: String, required: false },
  website: { type: String, required: false },
  socialMedia: {
    twitter: { type: String, required: false },
    linkedin: { type: String, required: false },
    instagram: { type: String, required: false },
  },
}, { _id: true }); // Allow MongoDB to generate _id for each featured guest

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    note: { type: String, required: false },
    image: { type: String, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    timezone: { type: String, required: true, default: "UTC" }, // IANA timezone name
    eventType: {
      type: String,
      required: true,
      enum: EventTypeNames,
    },
    address: {
      type: addressSchema,
      required: false, // Optional for online events
      validate: {
        validator: function (this: any) {
          // Address is required for In-Person and Hybrid events
          return this.eventType === "Online" || this.address;
        },
        message: "Address is required for In-Person and Hybrid events"
      }
    },
    videoConference: {
      type: videoConferenceSchema,
      required: false, // Optional for in-person events
      validate: {
        validator: function (this: any) {
          // Video conference is required for Online and Hybrid events
          return this.eventType === "In-Person" || this.videoConference;
        },
        message: "Video conference information is required for Online and Hybrid events"
      }
    },
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
    languages: [
      {
        type: String,
        enum: LanguageNames,
        required: true,
      },
    ],
    access: {
      type: String,
      required: true,
      enum: AccessNames,
    },
    ticketTiers: [ticketTierSchema],
    featuredGuests: [featuredGuestSchema],
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

