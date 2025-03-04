import mongoose from "mongoose";
import validator from "validator";
import { ErrorMessage } from "../utils/messages/messages.js";

const merchantMasterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (value?.length > 0 && !validator.isEmail(value)) {
          throw new Error(ErrorMessage.invalidEmail);
        }
      },
      unique: true
    },
    contactMobileNumber: {
      type: String
    },
    password: {
      required: false,
      type: String,
      trim: true
    },
    contactPersonName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxLength: 500
    },
    isActive: {
      type: Boolean,
      default: true
    },
    apiKey: {
      type: String,
      unique: true,
      required: true
    },
    merchantKey: {
      type: String,
      unique: true,
      required: true
    },
    merchantPassphrase: {
      type: String,
      unique: true,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const MerchantMaster = mongoose.model("MerchantMaster", merchantMasterSchema, "merchantmaster");

export default MerchantMaster;
