import mongoose, {Schema, Document, Model} from "mongoose";

export interface IPlan extends Document {
    userId: string;
    name: string;
    workoutPlan: {
        schedule: string[];
        exercises: {
            day: string;
            routines: {
                name: string;
                sets?: number;
                reps?: number;
                youtube_link: string,
                duration?: string;
                description?: string;
                exercises?: string[];
            }[];
        }[];
    };
    dietPlan: {
        dailyCalories: number;
        meals: {
            name: string;
            foods: string[];
        }[];
    };
    isActive: boolean;
}

const PlansSchema = new Schema<IPlan>(
    {
        userId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },

        workoutPlan: {
            schedule: [{
                type: String,
                required: true
            }],
            exercises: [
                {
                    day: {
                        type: String,
                        required: true
                    },
                    routines: [
                        {
                            name: {
                                type: String,
                                required: true
                            },
                            sets: {
                                type: Number
                            },
                            reps: {
                                type: Number
                            },
                            youtube_link: {
                                type: String
                            },
                            duration: {
                                type: String
                            },
                            description: {
                                type: String
                            },
                            exercises: [{
                                type: String
                            }],
                        },
                    ],
                },
            ],
        },
        dietPlan: {
            dailyCalories: {
                type: Number,
                required: true
            },
            meals: [
                {
                    name: {
                        type: String,
                        required: true
                    },
                    foods: [{
                        type: String,
                        required: true
                    }],
                }
            ]
        },
        isActive: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const PlanModel: Model<IPlan> = mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlansSchema);

export default PlanModel;