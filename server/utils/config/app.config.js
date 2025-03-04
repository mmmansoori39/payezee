export const routerInfo = {
  createUser: "/user",
  loginWithGoogle: "/auth/google",
  getUser: "/user",
  merchantLogin: "/merchant/login",

  createDeposit: "/transaction/deposit",
  createCashout: "/transaction/cashout",

  getAllCashouts: "/cashout",
  getCashoutsStats: "/cashout/stats",

  getAllDeposits: "/deposit",
  getDepositsStats: "/deposit/stats",
  
  deleteDepositComment: "/deposit/deleteComment/:depositId/:commentId",
  deleteCashoutComment: "/cashout/deleteComment/:depositId/:commentId",

  getDepositByMerchantId: "/payment/merchant/:merchantId",

  updateDeposit: "/deposit/:depositId",
  updateCashout: "/cashout/:cashoutId",

  createMerchant: "/merchant",
  getMerchant: "/merchant/:merchantId",
  getAllMerchant: "/merchant",
  updateMerchant: "/merchant/:merchantId",
  getPaymentsByCityAndStatus: "/getPaymentsByCityAndStatus",
  generateReport: "/generate-report",
  generateSignature: "/generate-signature"
};

export const rejectionReasons = [
  "Inactive number",
  "Incorrect number",
  "No response to call",
  "Client-initiated new request due to online deposit issue",
  "Client claims no request was made"
];

export const HTTPCode = {
  SUCCESSFUL: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  NOT_IMPLEMENTED: 501
};
