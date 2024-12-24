import mongoose, { Schema, Types } from 'mongoose';

export interface AdminDocument extends mongoose.Document {
    _id: Types.ObjectId;
    userId: string;
    name?: string;
    email: string;
    password: string;
    avatar?: string;
    isVerified?: boolean;
    token?: string;
    resetPasswordToken?: string;
    resetPasswordTokenExpiry?: Date;
    verificationToken?: string;
    verificationTokenExpiry?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    socials?: {
        facebook?: string;
        twitter?: string;
        discord?: string;
        tiktok?: string;
        youtube?: string;
        instagram?: string;
    };
    whitePaper?: string;
    footerAddress?: string[];
    timeline?: Types.ObjectId;
    tasks?: Types.ObjectId
}

const adminSchema = new mongoose.Schema<AdminDocument>({
    userId: { type: Schema.Types.String, unique: true, index: true },
    email: { type: Schema.Types.String, required: true, trim: true, index: true },
    password: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: true },
    avatar: { type: Schema.Types.String },
    verificationToken: { type: Schema.Types.String },
    isVerified: { type: Schema.Types.Boolean },
    token: { type: Schema.Types.String },
    resetPasswordToken: { type: Schema.Types.String, default: '' },
    resetPasswordTokenExpiry: { type: Schema.Types.Date, default: Date.now },
    verificationTokenExpiry: { type: Schema.Types.Date },
    createdAt: { type: Schema.Types.Date, default: Date.now() },
    updatedAt: { type: Schema.Types.Date },
    socials: {
        facebook: { type: Schema.Types.String },
        twitter: { type: Schema.Types.String },
        discord: { type: Schema.Types.String },
        tiktok: { type: Schema.Types.String },
        youtube: { type: Schema.Types.String },
        instagram: { type: Schema.Types.String },
    },
    whitePaper: { type: Schema.Types.String },
    footerAddress: [{ type: Schema.Types.String }],
    timeline: { type: Schema.Types.ObjectId, ref: 'Timeline' },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Tasks' }]
});

export const AdminModel = mongoose.model<AdminDocument>('Admin', adminSchema);
