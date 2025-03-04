import mongoose, { model, Schema } from "mongoose";
import { cashoutStatus } from "../utils/constants/constants.js";
import ModelIncrement from "../controllers/sequenceIncrement.model.js";

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const cashoutMasterSchema = Schema(
  {
    sequence: {
      type: Number,
      required: true
    },
    country: {
      type: String,
      required: true,
      maxLength: 3,
      trim: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      maxLength: 3,
      required: true
    },
    invoiceId: {
      type: String,
      maxLength: 128,
      required: true,
      unique: true
    },
    payer: {
      document: {
        type: String,
        maxLength: 32
      },
      userId: {
        type: String,
        maxLength: 32,
        required: true
      },
      email: {
        required: true,
        type: String,
        maxLength: 500
      },
      firstName: {
        type: String,
        maxLength: 100,
        required: true
      },
      lastName: {
        type: String,
        maxLength: 100
      },
      phone: {
        type: String,
        maxLength: 16
      },
      address: {
        street: {
          type: String,
          maxLength: 255
        },
        city: {
          type: String,
          maxLength: 100
        },
        state: {
          type: String,
          maxLength: 100
        },
        zipCode: {
          type: String,
          maxLength: 16
        }
      }
    },
    bankAccount: {
      bankAccount: {
        type: String,
        maxLength: 64
      },
      bankBranch: {
        type: String,
        maxLength: 64
      },
      bankBeneficiary: {
        type: String,
        maxLength: 64
      },
      bankAccountType: {
        type: String,
        maxLength: 64
      },
      bankCode: {
        type: String,
        maxLength: 64
      }
    },
    description: {
      type: String,
      maxLength: 128
    },
    clientIp: {
      type: String,
      maxLength: 64
    },
    language: {
      type: String,
      maxLength: 2
    },
    url: {
      backUrl: {
        type: String,
        maxLength: 255
      },
      successUrl: {
        type: String,
        maxLength: 255
      },
      errorUrl: {
        type: String,
        maxLength: 255
      },
      callbackUrl: {
        type: String,
        maxLength: 255,
        required: true
      }
    },
    test: {
      type: Boolean
    },
    logo: {
      type: String,
      maxLength: 2048
    },
    providerComment: {
      type: String,
      maxLength: 1000
    },
    status: {
      type: String,
      enum: Object.values(cashoutStatus),
      default: cashoutStatus.CREATED
    },
    transactionId: {
      required: true,
      type: String,
      maxLength: 128,
      unique: true
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "MerchantMaster",
      required: true
    },
    comment: {
      type: String
    },
    comments: [commentSchema]
  },
  {
    timestamps: true
  }
);

cashoutMasterSchema.pre("save", async function (next) {
  if (this.isNew) {
    const sequence = await ModelIncrement.getNextId("CashoutMaster", "sequence");
    this.sequence = sequence; // Incremented
    next();
  } else {
    next();
  }
});

/**
 * @typedef Store
 */
const cashoutMaster = model("CashoutMaster", cashoutMasterSchema, "cashoutmaster");

export default cashoutMaster;
