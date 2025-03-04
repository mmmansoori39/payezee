import { toast } from "react-toastify";

export const isValidEmail = (mail) => {
  if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(mail)) {
    return true;
  }
  return false;
};

export const validatePhoneNumber = (mobileNo) => {
  var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return re.test(mobileNo);
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(
    () => {
      toast.info(`Copied: ${text}`, { autoClose: 2000 });
    },
    () => {
      toast.warn("Failed to copy", { autoClose: 2000 });
    }
  );
};

export const toInr = (totalAmount, maximumFractionDigits = 2) => {
  return totalAmount
    ? Number(totalAmount).toLocaleString("en-IN", {
        maximumFractionDigits: maximumFractionDigits,
        style: "currency",
        currency: "INR"
      })
    : 0;
};

export const getUserFromLocalStorage = () => {
  let userData = {};
  try {
    userData = JSON.parse(localStorage.getItem("user-kosmossolution") || {}) || {};
  } catch (error) {
    console.error(error);
  }
  return userData;
};

export const downloadFile = (uri) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = uri;
  downloadLink.setAttribute("download", "");
  downloadLink.target = "downloadIframe";
  downloadLink.click();
};
