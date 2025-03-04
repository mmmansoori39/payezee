import express from "express";
import {
  createMerchant,
  getAllMerchantInfo,
  getMerchantInfo,
  updateMerchant
} from "../controllers/merchantMaster.controller.js";
import {
  createDeposit,
  deleteDepositComment,
  getAllDepositsInfo,
  getAllDepositsInfoByMerchantId,
  getAllPaymentsStats,
  updateDeposit
} from "../controllers/depositMaster.controller.js";
import {
  createCashout,
  deleteCashoutComment,
  getAllCashoutsInfo,
  getAllCashoutsStats,
  updateCashout
} from "../controllers/cashoutMaster.controller.js";
import {
  getUserDetails,
  loginWithGoogle,
  merchantLogin,
  register
} from "../controllers/user.controller.js";
import merchantAuth from "../middleware/merchantAuth.js";
import { routerInfo } from "../utils/config/app.config.js";
import auth from "../middleware/auth.js";
import { createSignature } from "../controllers/signatureMaster.controller.js";
import { requestLoggerMiddleware } from "../middleware/logger.js";
import { userTypes } from "../utils/constants/constants.js";
import { getExcelFile } from "../controllers/exportExcel.controller.js";
import { getPaymentsByCityAndStatus } from "../controllers/common.controller.js";

const router = express.Router();

// User
router.post(routerInfo.createUser, register);
router.post(routerInfo.loginWithGoogle, loginWithGoogle);
router.get(routerInfo.getUser, auth([userTypes.MERCHANT, userTypes.ADMIN]), getUserDetails);

// Deposit
router.post(
  routerInfo.createDeposit,
  requestLoggerMiddleware({ logger: console.log }),
  merchantAuth,
  createDeposit
);

router.put(routerInfo.updateDeposit, auth([userTypes.ADMIN]), updateDeposit);
router.put(routerInfo.deleteDepositComment, auth([userTypes.ADMIN]), deleteDepositComment);
router.get(
  routerInfo.getAllDeposits,
  auth([userTypes.MERCHANT, userTypes.ADMIN]),
  getAllDepositsInfo
);
router.get(
  routerInfo.getDepositByMerchantId,
  auth([userTypes.MERCHANT, userTypes.ADMIN]),
  getAllDepositsInfoByMerchantId
);

// Cashouts
router.put(routerInfo.deleteCashoutComment, auth([userTypes.ADMIN]), deleteCashoutComment);
router.post(
  routerInfo.createCashout,
  requestLoggerMiddleware({ logger: console.log }),
  merchantAuth,
  createCashout
);
router.get(
  routerInfo.getAllCashouts,
  auth([userTypes.MERCHANT, userTypes.ADMIN]),
  getAllCashoutsInfo
);
router.put(routerInfo.updateCashout, auth([userTypes.ADMIN]), updateCashout);

// Stats
router.get(routerInfo.getDepositsStats, auth([userTypes.ADMIN]), getAllPaymentsStats);
router.get(routerInfo.getCashoutsStats, auth([userTypes.ADMIN]), getAllCashoutsStats);

// Merchant
router.post(routerInfo.merchantLogin, merchantLogin);
router.post(routerInfo.createMerchant, auth([userTypes.ADMIN]), createMerchant);
router.put(routerInfo.updateMerchant, auth([userTypes.ADMIN]), updateMerchant);
router.get(routerInfo.getMerchant, auth([userTypes.MERCHANT, userTypes.ADMIN]), getMerchantInfo);
router.get(
  routerInfo.getPaymentsByCityAndStatus,
  auth([userTypes.MERCHANT, userTypes.ADMIN]),
  getPaymentsByCityAndStatus
);
router.get(
  routerInfo.getAllMerchant,
  auth([userTypes.MERCHANT, userTypes.ADMIN]),
  getAllMerchantInfo
);

router.get(routerInfo.generateReport, auth([userTypes.MERCHANT, userTypes.ADMIN]), getExcelFile);

router.post(routerInfo.generateSignature, createSignature);

export default router;
