import mongoose from "mongoose";
import * as cashoutMasterService from "../services/cashoutMaster.service.js";
import * as depositMasterService from "../services/depositMaster.service.js";
import { HTTPCode } from "../utils/config/app.config.js";
import { userTypes } from "../utils/constants/constants.js";
import { commonResponse } from "../utils/helper/utility.helper.fn.js";
import { ErrorMessage, SuccessMessage } from "../utils/messages/messages.js";
const ObjectId = mongoose.Types.ObjectId;

export const getPaymentsByCityAndStatus = async (req, res) => {
  const queryParams = {};
  if (req.query.created_at_gte && req.query.created_at_lte) {
    queryParams.createdAt = {
      $gte: new Date(req.query.created_at_gte),
      $lte: new Date((new Date(req.query.created_at_lte).setHours(23, 59, 59)))
    };
  }
  if (req.query.merchant_id) {
    queryParams.merchant = ObjectId(req.query.merchant_id);
  }
  if (req.user.type === userTypes.MERCHANT) {
    queryParams.merchant = ObjectId(req.user.merchantId);
  }
  console.log({ queryParams });
  try {
    const response = {};
    response.deposit = await depositMasterService.getPaymentsByCityAndStatus(queryParams);
    response.cashout = await cashoutMasterService.getPaymentsByCityAndStatus(queryParams);
    if (!response) {
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        ErrorMessage.error,
        ErrorMessage.paymentNotFound,
        null
      );
    } else {
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        SuccessMessage.success,
        SuccessMessage.fetchSuccess,
        response
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
