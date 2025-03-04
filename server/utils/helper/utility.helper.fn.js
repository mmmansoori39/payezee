import crypto from "crypto";
import isEmpty from "lodash/isEmpty.js";
import isNil from "lodash/isNil.js";
import omitBy from "lodash/omitBy.js";
import currencyCodes from "./countryCodes.js";

export const generateUID = () => {
  crypto.randomUUID({ disableEntropyCache: true });
  const uid = `${crypto.randomBytes(8).toString("hex")}-${Math.ceil(
    Math.random() * new Date().getTime() * 1000
  ).toString(36)}`;
  return uid;
};

export const isValidValue = (value) => {
  let isValid = true;
  if (value === "0" || value === "" || value === undefined) isValid = false;
  return isValid;
};

export const convertDateStringToUnixTimestamp = (dateString) => {
  const dateObj = new Date(dateString);
  return Math.floor(dateObj.getTime() / 1000);
};

export const convertContractTimeToJsTime = (timestamp) => {
  return timestamp * 1000;
};

export const isSameDate = (startDate, endDate) => {
  const startTime = new Date(convertContractTimeToJsTime(startDate));
  const endTime = new Date(convertContractTimeToJsTime(endDate));
  if (
    startTime.getUTCFullYear() === endTime.getUTCFullYear() &&
    startTime.getUTCMonth() === endTime.getUTCMonth() &&
    startTime.getUTCDate() === endTime.getUTCDate()
  ) {
    return true;
  } else {
    return false;
  }
};

export const formatDate = (timestamp) => {
  const timeInMil = convertContractTimeToJsTime(timestamp);
  const day = getDay(timeInMil, "utc");
  const month = getMonth(timeInMil, "utc");
  const year = getYear(timeInMil, "utc");
  return day + " " + month + " " + year;
};

export const formatTiming = (startTime, endTime) => {
  return (
    "from " +
    getTime(convertContractTimeToJsTime(startTime), "utc") +
    " (UTC) to " +
    getTime(convertContractTimeToJsTime(endTime), "utc") +
    " (UTC)"
  );
};

export const formatFullDate = (timestamp) => {
  return (
    formatDate(timestamp) +
    " | " +
    getTime(convertContractTimeToJsTime(timestamp), "utc") +
    " (UTC)"
  );
};

// get UTC day
export const getUTCDay = (timestamp) => {
  const date = new Date(timestamp);
  return date.getUTCDate();
};

// get local day
export const getLocalDay = (timestamp) => {
  const date = new Date(timestamp);
  return date.getDate();
};

export const getDay = (timestamp, timezone = "utc") => {
  if (timezone.toLowerCase() === "local") {
    return getLocalDay(timestamp);
  } else if (timezone.toLowerCase() === "utc") {
    return getUTCDay(timestamp);
  }
};

// get UTC year
export const getUTCYear = (timestamp) => {
  const date = new Date(timestamp);
  return date.getUTCFullYear();
};

// get local year
export const getLocalYear = (timestamp) => {
  const date = new Date(timestamp);
  return date.getFullYear();
};

export const getYear = (timestamp, timezone = "utc") => {
  if (timezone.toLowerCase() === "local") {
    return getLocalYear(timestamp);
  } else if (timezone.toLowerCase() === "utc") {
    return getUTCYear(timestamp);
  }
};

// get UTC month
export const getUTCMonth = (timestamp) => {
  const date = new Date(timestamp);
  return monthList[date.getUTCMonth()];
};

// get local month
export const getLocalMonth = (timestamp) => {
  const date = new Date(timestamp);
  return monthList[date.getMonth()];
};

export const getMonth = (timestamp, timezone = "utc") => {
  if (timezone.toLowerCase() === "local") {
    return getLocalMonth(timestamp);
  } else if (timezone.toLowerCase() === "utc") {
    return getUTCMonth(timestamp);
  }
};

export const getLocalDayOfTheWeek = (timestamp) => {
  const date = new Date(timestamp);
  return dayList[date.getDay()];
};

export const getUTCDayOfTheWeek = (timestamp) => {
  const date = new Date(timestamp);
  return dayList[date.getUTCDay()];
};

export const getDayOfTheWeek = (timestamp, timezone = "utc") => {
  if (timezone.toLowerCase() === "local") {
    return getLocalDayOfTheWeek(timestamp);
  } else if (timezone.toLowerCase() === "utc") {
    return getUTCDayOfTheWeek(timestamp);
  }
};

export const addLeadingZeros = (num, totalLength) => {
  return String(num).padStart(totalLength, "0");
};

export const getLocalTime = (timestamp) => {
  const date = new Date(timestamp);
  let hour = date.getHours();
  let min = date.getMinutes();
  // let surfix = hour >= 12 ? ' PM' : ' AM'
  // hour = hour % 12
  if (hour < 10) {
    hour = addLeadingZeros(hour, 2);
  }
  if (min < 10) min = addLeadingZeros(min, 2);
  return hour + ":" + min;
};

export const getUTCTime = (timestamp) => {
  const date = new Date(timestamp);
  let hour = date.getUTCHours();
  let min = date.getUTCMinutes();
  // let surfix = hour >= 12 ? ' PM' : ' AM'
  // hour = hour % 12
  if (hour < 10) {
    hour = addLeadingZeros(hour, 2);
  }
  if (min < 10) min = addLeadingZeros(min, 2);
  return hour + ":" + min;
};

export const getTime = (timestamp, timezone = "utc") => {
  if (timezone.toLowerCase() === "local") {
    return getLocalTime(timestamp);
  } else if (timezone.toLowerCase() === "utc") {
    return getUTCTime(timestamp);
  }
};

export const getTimezoneOffset = () => {
  const date = new Date();
  const diff = -1 * date.getTimezoneOffset();
  const hour = Math.trunc(diff / 60);
  let min = diff % 60;
  const surfix = hour > 0 ? "+" : "";
  if (min < 10) min = addLeadingZeros(min, 2);

  return surfix + hour + ":" + min;
};

export const monthList = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const dayList = [
  "Sunday",
  "Monday",
  "Tuseday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const commonResponse = (response, httpCode, responseCode, responseMessage, responseData) => {
  if (response) {
    return response.status(httpCode).send({
      response_code: responseCode,
      response_message: responseMessage,
      response_data: responseData
    });
  } else {
    return {
      response_code: responseCode,
      response_message: responseMessage,
      response_data: responseData
    };
  }
};

export function isCountryCode(name) {
  return currencyCodes.indexOf(String(name).toUpperCase()) > 0;
}

/**
 * Omits keys with value as `null`, `undefined`, empty string `""`, empty object `{}`, empty array `[]` from `obj`.
 *
 * @param obj a obj.
 * @returns Returns new object.
 * @example
 *
 * omitNullish({a:"", b:0, c:null, d:undefined, e:{}, f:[], g:'hello'});
 * => {b:0, g:'hello'}
 */
export const omitNullish = (obj) =>
  omitBy(obj, (v) => isNil(v) || v === "" || (typeof v === "object" && isEmpty(v)));
