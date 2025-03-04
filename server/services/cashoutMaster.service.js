import CashoutMaster from "../models/cashoutMaster.model.js";
import ApiError from "../utils/ApiError.js";
import { HTTPCode } from "../utils/config/app.config.js";

export const createCashout = async (body) => {
  return CashoutMaster.create(body);
};

export const getCashoutById = async (_id) => {
  return CashoutMaster.findOne({ _id }).populate("merchant");
};

export const getPaymentsCount = (queryParams = {}) => {
  return CashoutMaster.find({ ...queryParams }).countDocuments();
};

export const getCashoutByMerchantId = async (merchantId, queryParams) => {
  return CashoutMaster.find({ merchantId, ...queryParams }).populate("merchant");
};

export const updateCashoutById = async (_id, updateFields) => {
  return CashoutMaster.findOneAndUpdate({ _id }, { ...updateFields }).populate("merchant");
};

export const updateCashout = async (cashout, updateBody) => {
  Object.assign(cashout, updateBody);
  await cashout.save();
  return cashout;
};

export const getAllCashouts = async (queryParams = {}, sort = {}) => {
  return CashoutMaster.find({ ...queryParams })
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
  const result = await CashoutMaster.aggregate(pipeline);
  return result;
};

export const updateCashoutInfoById = async (cashoutId, updateBody, comments = []) => {
  const merchant = await CashoutMaster.findOne({ _id: cashoutId }).populate([
    "merchant",
    "comments.author"
  ]);

  if (!merchant) {
    throw new ApiError(HTTPCode.NOT_FOUND, "Cashout not found");
  }
  Object.assign(merchant, updateBody);
  merchant.comments.push(...comments);
  await merchant.save();
  return merchant;
};


export const deleteCommentById = async (depositID, commentId) => {
  const merchant = await CashoutMaster.findOne({ _id: depositID }).populate([
    "merchant"
  ]);
  if (!merchant) {
    throw new ApiError(HTTPCode.NOT_FOUND, "Cashout not found");
  }
  const comments = merchant.comments.filter((item) => item.id !== commentId);
  merchant.comments = comments;
  await merchant.save();
  return merchant;
};

