import mongoose, { InferSchemaType, Schema } from "mongoose";

// Define the ticket selection subdocument schema
const ticketSelectionSchema = new Schema({
    tierId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    name: {
        type: String,
        required: true
    }
}, { _id: false }); // Don't create separate _id for subdocument

const reservationSchema = new Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true // For efficient queries by event
        },
        userId: {
            type: String,
            required: true,
            index: true // For efficient queries by user (Clerk user ID)
        },
        tickets: {
            type: [ticketSelectionSchema],
            required: true,
            validate: {
                validator: function(tickets: any[]) {
                    return tickets && tickets.length > 0;
                },
                message: "At least one ticket selection is required"
            }
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true // For efficient cleanup of expired reservations
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "paid", "expired", "cancelled"],
            default: "pending",
            index: true
        }
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

// Create compound indexes for efficient queries
reservationSchema.index({ userId: 1, eventId: 1 }); // User's reservations for specific event
reservationSchema.index({ status: 1, expiresAt: 1 });

export const ReservationModel = mongoose.model("Reservation", reservationSchema);

// Infer the type from schema
type Reservation = InferSchemaType<typeof reservationSchema> & {
    _id: mongoose.Types.ObjectId;
};

export type { Reservation };

