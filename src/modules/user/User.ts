import { Schema, InferSchemaType } from "mongoose";
import mongoose from "mongoose";

const schema = new Schema(
  {
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export type UserType = {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };

const User = mongoose.model("User", schema);
export default User;
