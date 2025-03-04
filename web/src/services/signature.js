import { apiClient } from "../utils/apiUtil";

export const getSignature = async (body) => {
  return await apiClient.post("/generate-signature", body);
};
