import { model, Schema, Types } from "mongoose";

export const ServicesSchema = new Schema({
    userId: {
        type:Types.ObjectId,
        ref: "User",
    },

    providerId: {
        type:Types.ObjectId,
        ref: "User",
    },

        serviceType: {
        type: String,
        required: true,
        enum: [
            "grammarCheck",
            "paraphrase",
            "reference",
            "translation",
            "scientificIllustration",
            "powerPoint",
            "word",
            "researchGuidance",
            "academicWritingHelp",
            "softwareToolsAccess",
            "chemicalSuppliers",
            "printing"
        ]
    },

    //common fields
    requestName: { type: String, required: true },
    //uploadFile: { type: String ,required :true},
    description: { type: String},
    deadline: { type: Date, required: true },
    status: {
        type: String,
        enum:  ['new-request', 'provider-selection', 'in-progress', 'completed'],
        default: "new-request"
    },
    // dynamic details for each service type
    details: {
        type: Map,
        of: Schema.Types.Mixed
    },

    candidates: [{
        type:Types.ObjectId,
        ref: "User"
    }],
    selectedProvider: {
        type: Types.ObjectId,
        ref: "User"
    }

},
    {
        timestamps: true,
    });

export const Services = model('Services', ServicesSchema);