import mongoose, { Document } from "mongoose";

interface UserDetails extends Document {
  username: string;
  email: string;
  password: string;
  picture: string;
  // saveCode: mongoose.Types.ObjectId[];
  saveCode: Array<mongoose.Types.ObjectId>;
}

const userSchema = new mongoose.Schema<UserDetails>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg",
    },
    saveCode: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Code' // Reference to the SaveCode model
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDetails>("User", userSchema);
