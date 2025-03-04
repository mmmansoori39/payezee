import { apiClient } from "../utils/apiUtil";

export const getAllDeposits = async ({ selectedDates = [], merchantId }) => {
  const queryParams = [];
  if (selectedDates[0] && selectedDates[1]) {
    const startDate = new Date(selectedDates[0]);
    const endDate = new Date(selectedDates[1]);
    startDate.setHours(0, 0, 0);
    endDate.setHours(23, 59, 59);
    queryParams.push(`created_at_gte=${startDate.toString()}`);
    queryParams.push(`created_at_lte=${endDate.toString()}`);
  }
  if (merchantId) {
    queryParams.push(`merchant_id=${merchantId}`);
  }
  const res = await apiClient.get(`/deposit?${queryParams.join("&")}`);
  if (res.status === 200) {
    return res.data.responseData || [];
  }
  return [];
};

export const getReportDownloadURL = async ({ selectedDates = [], transactionType = "deposit", merchantId = null }) => {
  const queryParams = [];
  if (selectedDates[0] && selectedDates[1]) {
    const startDate = new Date(selectedDates[0]);
    const endDate = new Date(selectedDates[1]);
    startDate.setHours(0, 0, 0);
    endDate.setHours(23, 59, 59);
    queryParams.push(`created_at_gte=${startDate.toString()}`);
    queryParams.push(`created_at_lte=${endDate.toString()}`);
  }
  if (transactionType) {
    queryParams.push(`transaction_type=${transactionType}`);
  }
  if (merchantId) {
    queryParams.push(`merchant_id=${merchantId}`);
  }
  const res = await apiClient.get(`/generate-report?${queryParams.join("&")}`);
  if (res.status === 200) {
    return res?.data?.responseData || null;
  }
  return null;
};

export const getDepositStats = async () => {
  const res = await apiClient.get("/deposit/stats");
  if (res.status === 200) {
    return res?.data?.responseData;
  }
};

export const getCashoutStats = async () => {
  const res = await apiClient.get("/cashout/stats");
  if (res.status === 200) {
    return res?.data?.responseData;
  }
};

export const getAllCashouts = async ({ selectedDates = [], merchantId }) => {
  const queryParams = [];
  if (selectedDates[0] && selectedDates[1]) {
    const startDate = new Date(selectedDates[0]);
    const endDate = new Date(selectedDates[1]);
    startDate.setHours(0, 0, 0);
    endDate.setHours(23, 59, 59);
    queryParams.push(`created_at_gte=${startDate.toString()}`);
    queryParams.push(`created_at_lte=${endDate.toString()}`);
  }
  if (merchantId) {
    queryParams.push(`merchant_id=${merchantId}`);
  }
  const res = await apiClient.get(`/cashout?${queryParams.join("&")}`);
  if (res.status === 200) {
    return res.data.responseData || [];
  }
  return [];
};

export const getPaymentsByCityAndStatus = async ({ selectedDates = [], merchantId = null }) => {
  const queryParams = [];
  if (selectedDates[0] && selectedDates[1]) {
    queryParams.push(`created_at_gte=${selectedDates[0]}`);
    queryParams.push(`created_at_lte=${selectedDates[1]}`);
  }
  if (merchantId) {
    queryParams.push(`merchant_id=${merchantId}`);
  }
  const res = await apiClient.get(`/getPaymentsByCityAndStatus?${queryParams.join("&")}`);
  if (res.status === 200) {
    return res.data.responseData || {};
  }
  return [];
};

export const updateDepositStatus = (depositId, status, comment) => {
  const payload = { status };
  if (comment) {
    payload.comment = comment;
  }
  return apiClient.put(`/deposit/${depositId}`, payload);
};

export const deleteCommentDeposit = (depositId, commentId) => {
  return apiClient.put(`/deposit/deleteComment/${depositId}/${commentId}`);
};

export const deleteCommentCashout = (depositId, commentId) => {
  return apiClient.put(`/cashout/deleteComment/${depositId}/${commentId}`);
};

export const updateCashoutStatus = (cashoutId, status, comment) => {
  const payload = { status };
  if (comment) {
    payload.comment = comment;
  }
  return apiClient.put(`/cashout/${cashoutId}`, payload);
};
