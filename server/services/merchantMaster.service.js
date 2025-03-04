import MerchantMaster from "../models/merchantMaster.model.js";
import ApiError from "../utils/ApiError.js";
import { HTTPCode } from "../utils/config/app.config.js";
import { ErrorMessage } from "../utils/messages/messages.js";

export const createMerchant = async (body) => {
  return MerchantMaster.create(body);
};

export const getMerchantByEmail = async (contactEmail) => {
  return MerchantMaster.findOne({ contactEmail });
};

export const getMerchantById = async (_id) => {
  return MerchantMaster.findOne({ _id });
};

export const getMerchantByApiKey = async (apiKey) => {
  return MerchantMaster.findOne({ apiKey });
};

export const getMerchantByKeyAndPassphrase = async (merchantKey = "", merchantPassphrase = "") => {
  return MerchantMaster.findOne({
    merchantKey: merchantKey.trim(),
    merchantPassphrase: merchantPassphrase.trim()
  });
};

export const getActiveMerchants = async () => {
  return MerchantMaster.find({ isActive: true });
};

export const updateUserByEmail = async (email, updateFields) => {
  return MerchantMaster.findOneAndUpdate({ email }, { ...updateFields });
};

export const updateMerchant = async (merchant, updateBody) => {
  Object.assign(merchant, updateBody);
  await merchant.save();
  return merchant;
};

export const getMerchants = async () => {
  return MerchantMaster.find();
};

export const updateMerchantInfoById = async (merchantId, updateBody) => {
  const merchant = await MerchantMaster.findOne({ _id: merchantId });
  if (!merchant) {
    throw new ApiError(HTTPCode.NOT_FOUND, ErrorMessage.merchantNotFound);
  }
  Object.assign(merchant, updateBody);
  await merchant.save();
  return merchant;
};
