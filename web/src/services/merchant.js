import { apiClient } from "../utils/apiUtil";

export const getAllMerchants = async () => {
  const res = await apiClient.get("/merchant");
  if (res.status === 200) {
    return res.data.responseData || [];
  }
  return [];
};

export const registerMerchant = (payload) => {
  return apiClient.post("/merchant", payload);
};

export const updateMerchant = (id, payload) => {
  return apiClient.put(`/merchant/${id}`, payload);
};
