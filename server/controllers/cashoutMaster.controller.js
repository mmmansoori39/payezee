import mongoose from "mongoose";
import { v4 as uuid4 } from "uuid";
import * as cashoutMasterService from "../services/cashoutMaster.service.js";
import { HTTPCode } from "../utils/config/app.config.js";
import { cashoutStatus, userTypes } from "../utils/constants/constants.js";
import { numberToText } from "../utils/helper/numberToText.js";
import {
  toAddressObj,
  toBankAccountObj,
  toPayerObj,
  toUrlObj
} from "../utils/helper/paymentsHelper.js";
import { commonResponse, omitNullish } from "../utils/helper/utility.helper.fn.js";
import { ErrorMessage, SuccessMessage } from "../utils/messages/messages.js";
import { notifyMerchant } from "../utils/notifyMerchant.js";
const ObjectId = mongoose.Types.ObjectId;

export const createCashout = async (req, res) => {
  try {
    const payerObj = req.body.payer || {};
    const bankObj = req.body.bank_account || {};
    const customerAddress = toAddressObj(
      payerObj.address.street,
      payerObj.address.city,
      payerObj.address.state,
      payerObj.address.zip_code
    );
    const cashoutTransactionData = omitNullish({
      country: req.body.country,
      amount: req.body.amount,
      currency: req.body.currency,
      invoiceId: req.body.invoice_id,
      payer: toPayerObj(
        payerObj.document,
        payerObj.id,
        payerObj.email,
        payerObj.first_name,
        payerObj.last_name,
        payerObj.phone,
        customerAddress
      ),
      bankAccount: toBankAccountObj(
        bankObj.bank_account,
        bankObj.bank_branch,
        bankObj.bank_beneficiary,
        bankObj.bank_account_type,
        bankObj.bank_code
      ),
      description: req.body.description,
      clientIp: req.body.client_ip,
      language: req.body.language,
      url: toUrlObj(
        req.body.url.back_url,
        req.body.url.success_url,
        req.body.url.error_url,
        req.body.url.callback_url
      ),
      test: req.body.test,
      logo: req.body.logo,
      providerComment: req.body.provider_comment,
      status: cashoutStatus.CREATED,
      transactionId: uuid4(),
      merchant: req.merchant._id.toString(),
      sequence: 10
    });
    const cashout = await cashoutMasterService.createCashout(cashoutTransactionData);
    const result = {
      transaction_id: cashout.transactionId,
      merchant_invoice_id: cashout.invoiceId
    };
    return res.status(200).send(result);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = {};

      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).send({ errors });
    }
    if (err?.name === "MongoServerError" && err.code === 11000) {
      return commonResponse(
        res,
        HTTPCode.BAD_REQUEST,
        ErrorMessage.error,
        "There was a duplicate key error",
        null
      );
    }
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

export const getPaymentById = async (req, res) => {
  try {
    const result = await cashoutMasterService.getCashoutById(req.params.paymentId);
    if (!result) {
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        ErrorMessage.error,
        ErrorMessage.merchantNotFound,
        null
      );
    } else {
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        SuccessMessage.success,
        SuccessMessage.fetchSuccess,
        result
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

export const getAllCashoutsInfo = async (req, res) => {
  const queryParams = {};
  if (req.query.created_at_gte && req.query.created_at_lte) {
    queryParams.createdAt = {
      $gte: req.query.created_at_gte,
      $lte: req.query.created_at_lte
    };
  }
  if (req.query.merchant_id) {
    queryParams.merchant = ObjectId(req.query.merchant_id);
  }
  if (req.user.type === userTypes.MERCHANT) {
    queryParams.merchant = req.user.merchantId;
  }
  try {
    const result = await cashoutMasterService.getAllCashouts(queryParams);
    if (!result) {
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        ErrorMessage.error,
        ErrorMessage.paymentNotFound,
        null
      );
    } else {
      const modifiedDocuments = result.map((doc) => {
        const data = doc.toObject();
        const amountInText = numberToText(data.amount);
        return { ...data, amountInText };
      });
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        SuccessMessage.success,
        SuccessMessage.fetchSuccess,
        modifiedDocuments
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

export const getAllCashoutsInfoByMerchantId = async (req, res) => {
  try {
    const queryParams = {};
    if (req.query.isCollected === true || req.query.isCollected === "true") {
      queryParams.isCollected = true;
    }
    if (req.query.isRejected === "true" || req.query.isRejected === true) {
      queryParams.isRejected = true;
    }
    const result = await cashoutMasterService.getCashoutByMerchantId(
      req.params.merchantId,
      queryParams
    );
    if (!result) {
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        ErrorMessage.error,
        ErrorMessage.merchantNotFound,
        null
      );
    } else {
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        SuccessMessage.success,
        SuccessMessage.fetchSuccess,
        result
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

export const updateCashout = async (req, res) => {
  try {
    const comments = []
    if(req.body.comment){
      comments.push({
        text: req.body.comment,
        author: req.user.id,
      })
    }
    delete req.body.comment;
    const result = await cashoutMasterService.updateCashoutInfoById(req.params.cashoutId, req.body, comments);  
    if (req.body.status && Object.values(cashoutStatus).includes(req.body.status)) {
      const isNotified = await notifyMerchant(result);
      if (!isNotified) {
        return commonResponse(
          res,
          HTTPCode.INTERNAL_SERVER,
          "failed",
          `failed to notify to merchant!`,
          result
        );
      }
    }
    return commonResponse(
      res,
      HTTPCode.SUCCESSFUL,
      SuccessMessage.success,
      SuccessMessage.updatedTransactionInfo,
      result
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

export const getAllCashoutsStats = async (req, res) => {
  try {
    const dispatched = await cashoutMasterService.getPaymentsCount({
      status: cashoutStatus.DISPATCHED
    });
    const completed = await cashoutMasterService.getPaymentsCount({
      status: cashoutStatus.COMPLETED
    });
    const rejected = await cashoutMasterService.getPaymentsCount({
      status: cashoutStatus.REJECTED
    });
    const total = await cashoutMasterService.getPaymentsCount();
    const result = {
      dispatched,
      completed,
      rejected,
      total
    };
    if (!result) {
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        ErrorMessage.error,
        ErrorMessage.merchantNotFound,
        null
      );
    } else {
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        SuccessMessage.success,
        SuccessMessage.fetchSuccess,
        result
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



export const deleteCashoutComment = async (req, res) => {
  try {
    const comments = []
    if(req.body.comment){
      comments.push({
        text: req.body.comment,
        author: req.user.id,
      })
    }
    delete req.body.comment;
    const result = await cashoutMasterService.deleteCommentById(req.params.depositId, req.params.commentId);
    return commonResponse(
      res,
      HTTPCode.SUCCESSFUL,
      SuccessMessage.success,
      SuccessMessage.updatedTransactionInfo,
      result
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

