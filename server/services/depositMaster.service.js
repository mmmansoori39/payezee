import DepositMaster from "../models/depositMaster.model.js";
import ApiError from "../utils/ApiError.js";
import { HTTPCode } from "../utils/config/app.config.js";
import { ErrorMessage } from "../utils/messages/messages.js";

export const createPayment = async (body) => {
  return DepositMaster.create(body);
};

export const getPaymentById = async (_id) => {
  return DepositMaster.findOne({ _id }).populate("merchant");
};

export const getPaymentsByMerchantId = async (merchantId, queryParams) => {
  return DepositMaster.find({ merchantId, ...queryParams }).populate("merchant");
};

export const getPaymentsCount = (queryParams = {}) => {
  return DepositMaster.find({ ...queryParams }).countDocuments();
};

export const updatePaymentById = async (_id, updateFields) => {
  return DepositMaster.findOneAndUpdate({ _id }, { ...updateFields }).populate("merchant");
};

export const updatePayment = async (payment, updateBody) => {
  Object.assign(payment, updateBody);
  await payment.save();
  return payment;
};

export const getAllPayments = async (queryParams = {}, sort = {}) => {
  return DepositMaster.find({ ...queryParams })
    .sort({ createdAt: -1, ...sort })
    .populate(["merchant", "comments.author"]);
};

export const getPaymentsByCityAndStatus = async (filter = {}) => {
  const pipeline = [
    {
      $match: filter
    },
    {
      $group: {
        _id: {
          city: "$payer.address.city",
          status: "$status"
        },
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.city",
        statuses: {
          $push: {
            k: { $toLower: "$_id.status" },
            v: {
              totalAmount: "$totalAmount",
              count: "$count"
            }
          }
        },
        totalCount: { $sum: "$count" }
      }
    },
    {
      $addFields: {
        statuses: { $arrayToObject: "$statuses" }
      }
    },
    {
      $project: {
        city: "$_id",
        statuses: 1,
        totalCount: 1,
        _id: 0
      }
    }
  ];
  const result = await DepositMaster.aggregate(pipeline);
  return result;
};

export const updateDepositInfoById = async (merchantId, updateBody, comments = []) => {
  const merchant = await DepositMaster.findOne({ _id: merchantId }).populate([
    "merchant",
    "comments.author"
  ]);
  if (!merchant) {
    throw new ApiError(HTTPCode.NOT_FOUND, ErrorMessage.merchantNotFound);
  }
  Object.assign(merchant, updateBody);
  console.log({comments})
  merchant.comments.push(...comments);
  await merchant.save();
  return merchant;
};

export const deleteCommentById = async (depositID, commentId) => {
  const merchant = await DepositMaster.findOne({ _id: depositID }).populate([
    "merchant"
  ]);
  if (!merchant) {
    throw new ApiError(HTTPCode.NOT_FOUND, ErrorMessage.merchantNotFound);
  }
  console.log('merchant.comments', merchant.comments.length)
  const comments = merchant.comments.filter((item) => item.id !== commentId);
  console.log('merchant.comments', comments.length)
  merchant.comments = comments;
  await merchant.save();
  return merchant;
};
