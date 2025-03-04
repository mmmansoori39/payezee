export const GOOGLE_AUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID;
export const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
export const commonSliceName = "commonSlice";

export const userTypes = {
  ADMIN: "ADMIN",
  MERCHANT: "MERCHANT"
};

export const depositStatus = {
  CREATED: "created",
  PENDING: "pending",
  COMPLETED: "completed",
  REJECTED: "rejected"
};

export const cashoutStatus = {
  CREATED: "created",
  PENDING: "pending",
  COMPLETED: "completed",
  REJECTED: "rejected"
};

export const rejectionReasons = [
  "No response to call",
  "Inactive number",
  "Incorrect number",
  "Client-initiated new request due to online deposit issue",
  "Client claims no request was made",
  "Other"
];
