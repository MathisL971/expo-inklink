import mongoose, { InferSchemaType, Schema } from "mongoose";

// Define ticket status enum values
const TicketStatusNames = [
    "purchased",
    "cancelled",
    "refunded",
    "used",
    "expired"
] as const;

// Define payment status enum values  
const PaymentStatusNames = [
    "pending",
    "completed",
    "failed",
    "refunded"
] as const;

const ticketSchema = new Schema(
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
        ticketTierId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true // Reference to the specific ticket tier
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0 // Price per individual ticket
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0 // Total amount paid (unitPrice * quantity)
        },
        status: {
            type: String,
            required: true,
            enum: TicketStatusNames,
            default: "purchased"
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: PaymentStatusNames,
            default: "completed"
        },
        purchaseDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        // Optional payment details
        paymentMethod: {
            type: String,
            required: false // e.g., "credit_card", "paypal", "bank_transfer"
        },
        paymentTransactionId: {
            type: String,
            required: false // External payment processor transaction ID
        },
        // Optional metadata
        notes: {
            type: String,
            required: false // Any additional notes about the ticket
        },
        // For event check-in functionality
        checkInDate: {
            type: Date,
            required: false // When the ticket was used/checked in
        },
        // Contact information (in case it differs from user profile)
        contactEmail: {
            type: String,
            required: false
        },
        contactPhone: {
            type: String,
            required: false
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
ticketSchema.index({ eventId: 1, userId: 1 }); // Tickets by user for specific event
ticketSchema.index({ userId: 1, status: 1 }); // User's tickets by status
ticketSchema.index({ eventId: 1, status: 1 }); // Event tickets by status

export const TicketModel = mongoose.model("Ticket", ticketSchema);

// Infer the type from schema
type Ticket = InferSchemaType<typeof ticketSchema> & {
    _id: mongoose.Types.ObjectId;
};

export type { Ticket };
