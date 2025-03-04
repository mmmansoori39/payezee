import mongoose from "mongoose";
import { v4 as uuid4 } from "uuid";
import * as depositMasterService from "../services/depositMaster.service.js";
import { HTTPCode } from "../utils/config/app.config.js";
import { depositStatus, userTypes } from "../utils/constants/constants.js";
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

export const createDeposit = async (req, res) => {
  try {
    const payerObj = req.body.payer || {};
    const bankObj = req.body.bank_account || {};
    const customerAddress = toAddressObj(
      payerObj.address.street,
      payerObj.address.city,
      payerObj.address.state,
      payerObj.address.zip_code
    );
    const depositTransactionData = omitNullish({
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
      paymentTypes: req.body.payment_types,
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
        req.body.url.callback_url,
        req.body.url.pending_url
      ),
      test: req.body.test,
      logo: req.body.logo,
      providerComment: req.body.provider_comment,
      status: depositStatus.CREATED,
      transactionId: uuid4(),
      merchant: req.merchant._id.toString(),
      sequence: 10
    });
    const deposit = await depositMasterService.createPayment(depositTransactionData);
    const result = {
      transaction_id: deposit.transactionId,
      merchant_invoice_id: deposit.invoiceId,
      redirect_url: req.body.url.pending_url
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
    const result = await depositMasterService.getMerchantById(req.params.paymentId);
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

export const getAllDepositsInfo = async (req, res) => {
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
  console.log({ queryParams });
  try {
    const result = await depositMasterService.getAllPayments(queryParams);
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
        const data = doc.toObject()
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

export const getAllDepositsInfoByMerchantId = async (req, res) => {
  try {
    const queryParams = {};
    if (req.query.isCollected === true || req.query.isCollected === "true") {
      queryParams.isCollected = true;
    }
    if (req.query.isRejected === "true" || req.query.isRejected === true) {
      queryParams.isRejected = true;
    }
    const result = await depositMasterService.getPaymentsByMerchantId(
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

export const getAllPaymentsStats = async (req, res) => {
  try {
    const dispatched = await depositMasterService.getPaymentsCount({
      status: depositStatus.PENDING
    });
    const completed = await depositMasterService.getPaymentsCount({
      status: depositStatus.COMPLETED
    });
    const rejected = await depositMasterService.getPaymentsCount({
      status: depositStatus.REJECTED
    });
    const total = await depositMasterService.getPaymentsCount();
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

export const updateDeposit = async (req, res) => {
  try {
    const comments = []
    if(req.body.comment){
      comments.push({
        text: req.body.comment,
        author: req.user.id,
      })
    }
    delete req.body.comment;
    const result = await depositMasterService.updateDepositInfoById(req.params.depositId, req.body, comments);
    if (req.body.status && Object.values(depositStatus).includes(req.body.status)) {
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

export const deleteDepositComment = async (req, res) => {
  try {
    const comments = []
    if(req.body.comment){
      comments.push({
        text: req.body.comment,
        author: req.user.id,
      })
    }
    delete req.body.comment;
    const result = await depositMasterService.deleteCommentById(req.params.depositId, req.params.commentId);
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
