import mongoose, {Schema, Document, Model} from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    image?: string;
    clerkId: string;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        clerkId: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
)

UserSchema.index({clerk: 1});

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
