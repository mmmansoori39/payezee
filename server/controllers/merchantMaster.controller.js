import crypto from "crypto";
import omit from "lodash/omit.js";
import * as merchantMasterService from "../services/merchantMaster.service.js";
import { HTTPCode } from "../utils/config/app.config.js";
import { aesDecrypt, aesEncrypt, getUniquePassphrase } from "../utils/crypto.js";
import { commonResponse } from "../utils/helper/utility.helper.fn.js";
import { ErrorMessage, SuccessMessage } from "../utils/messages/messages.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const createMerchant = async (req, res) => {
  try {
    const apiKey = getUniquePassphrase();
    req.body.merchantPassphrase = getUniquePassphrase();
    req.body.apiKey = aesEncrypt(apiKey, req.body.merchantPassphrase);
    req.body.merchantKey = new ObjectId().toString();
    req.body.isActive = true;
    const password = crypto.randomBytes(5).toString("hex");
    req.body.password = password;
    const merchant = await merchantMasterService.createMerchant(req.body);
    const data = merchant.toJSON();
    return commonResponse(
      res,
      HTTPCode.SUCCESSFUL,
      SuccessMessage.success,
      SuccessMessage.createMerchantSuccess,
      { ...data, apiKey }
    );
  } catch (err) {
    console.log(err);
    return commonResponse(
      res,
      HTTPCode.INTERNAL_SERVER,
      ErrorMessage.error,
      ErrorMessage.internalServerError,
      null
    );
  }
};

export const getMerchantInfo = async (req, res) => {
  try {
    const result = await merchantMasterService.getMerchantById(req.params.merchantId);
    if (!result) {
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        ErrorMessage.error,
        ErrorMessage.merchantNotFound,
        null
      );
    } else {
      const data = result.toJSON();
      const apiKey = aesDecrypt(result.apiKey, result.merchantPassphrase);
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        SuccessMessage.success,
        SuccessMessage.fetchSuccess,
        { ...data, apiKey }
      );
    }
  } catch (err) {
    console.log(err);
    return commonResponse(
      res,
      HTTPCode.INTERNAL_SERVER,
      ErrorMessage.error,
      ErrorMessage.internalServerError,
      null
    );
  }
};

export const getAllMerchantInfo = async (req, res) => {
  try {
    const result = await merchantMasterService.getMerchants();
    if (!result) {
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        ErrorMessage.error,
        ErrorMessage.merchantNotFound,
        null
      );
    } else {
      const responseData = result.map((item) => {
        const data = item.toJSON();
        const apiKey = aesDecrypt(data.apiKey, item.merchantPassphrase);
        return { ...data, apiKey };
      });
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        SuccessMessage.success,
        SuccessMessage.fetchSuccess,
        responseData
      );
    }
  } catch (err) {
    console.log(err);
    return commonResponse(
      res,
      HTTPCode.INTERNAL_SERVER,
      ErrorMessage.error,
      ErrorMessage.internalServerError,
      null
    );
  }
};

export const updateMerchant = async (req, res) => {
  try {
    const body = omit(req.body, ["apiKey", "merchantPassphrase", "password"]);
    const result = await merchantMasterService.updateMerchantInfoById(req.params.merchantId, body);
    const data = result.toJSON();
    const apiKey = aesDecrypt(result.apiKey, result.merchantPassphrase);
    return commonResponse(
      res,
      HTTPCode.SUCCESSFUL,
      SuccessMessage.success,
      SuccessMessage.updateStoreSuccess,
      { ...data, apiKey }
    );
  } catch (err) {
    return commonResponse(
      res,
      HTTPCode.INTERNAL_SERVER,
      ErrorMessage.error,
      ErrorMessage.internalServerError,
      null
    );
  }
};
