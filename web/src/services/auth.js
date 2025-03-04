import { apiClient } from "../utils/apiUtil";
import store from "../redux/store/store";
import { setIsLoggedIn } from "../redux/slices/CommonSlice";
import { toast } from "react-toastify";
import { getUserFromLocalStorage } from "../utils/common";

export const loginUser = async (tokenCred) => {
  const res = await apiClient.post("/auth/google", { token: tokenCred });
  const token = res?.data?.responseData?.token;
  if (token) {
    const { name, email, picture, type } = res.data.responseData;
    localStorage.setItem("user-kosmossolution", JSON.stringify({ token, name, email, picture, type }));
    store.dispatch(
      setIsLoggedIn({
        isLoggedIn: true,
        authToken: token,
        user: { name, email, picture, type }
      })
    );
    return true;
  }
  toast.error(res.data.response_message || "Something Went Wrong!");
  return false;
};

export const loginMerchant = async (email, password) => {
  const res = await apiClient.post("/merchant/login", { email, password });
  const token = res?.data?.responseData?.token;
  if (token) {
    const { name, email, type } = res.data.responseData;
    localStorage.setItem("user-kosmossolution", JSON.stringify({ token, name, email, type }));
    store.dispatch(
      setIsLoggedIn({
        isLoggedIn: true,
        authToken: token,
        user: { name, email, type }
      })
    );
    return true;
  }
  toast.error(res.data.response_message || "Something Went Wrong!");
  return false;
};

export const getUser = async () => {
  const res = await apiClient.get("/user");
  if (res.data.responseData?.email) {
    const { name, email, picture, type } = res.data.responseData;
    const userData = getUserFromLocalStorage();
    localStorage.setItem("user-kosmossolution", JSON.stringify({ token: userData.token, name, email, picture, type }));
  }
  return res;
};
