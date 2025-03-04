import { omitNullish } from "./utility.helper.fn.js";

export const toAddressObj = (street, city, state, zipCode) =>
  omitNullish({
    street,
    city,
    state,
    zipCode
  });

export const toPayerObj = (document, userId, email, firstName, lastName, phone, address) =>
  omitNullish({
    document,
    userId,
    email,
    firstName,
    lastName,
    address,
    phone
  });

export const toBankAccountObj = (
  bankAccount,
  bankBranch,
  bankBeneficiary,
  bankAccountType,
  bankCode
) =>
  omitNullish({
    bankAccount,
    bankBranch,
    bankBeneficiary,
    bankAccountType,
    bankCode
  });

export const toUrlObj = (backUrl, successUrl, errorUrl, callbackUrl, pendingUrl) =>
  omitNullish({
    backUrl,
    successUrl,
    errorUrl,
    callbackUrl,
    pendingUrl
  });
