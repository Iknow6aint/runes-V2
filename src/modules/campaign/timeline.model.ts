import mongoose, { Schema, Types } from 'mongoose';

interface Stage {
    date: Date;
    name: string;
}

export interface TimelineDocument extends mongoose.Document {
    adminId: Types.ObjectId;
    stages: {
        research: Stage;
        preLaunch: Stage;
        launch: Stage;
        postLaunch: Stage;
        review: Stage;
        test: Stage;
    };
}

const stageSchema: Schema = new Schema({
    date: { type: Date, required: true },
    name: { type: String, required: true }
});

const timelineSchema: Schema = new Schema({
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    stages: {
        research: { type: stageSchema, required: true },
        preLaunch: { type: stageSchema, required: true },
        launch: { type: stageSchema, required: true },
        postLaunch: { type: stageSchema, required: true },
        review: { type: stageSchema, required: true },
        test: { type: stageSchema, required: true }
    }
});

export const TimelineModel = mongoose.model<TimelineDocument>('Timeline', timelineSchema);
