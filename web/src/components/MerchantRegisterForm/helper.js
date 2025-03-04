// import isURL from "is-url";
import { isValidEmail } from "../../utils/common";
export const validate = (values = {}) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Please enter merchant's name";
  }
  if (!values.contactEmail || !isValidEmail(values.contactEmail)) {
    errors.contactEmail = "Please enter a valid Email!";
  }
  if (!values.contactMobileNumber) {
    errors.contactMobileNumber = "Please enter valid mobile number!";
  }
  if (!values.contactPersonName) {
    errors.contactPersonName = "Please enter name of merchant's representative!";
  }
  // if (values.website && !isURL(values.website)) {
  //   errors.website = "Please enter a valid URL!";
  // }
  if (values.description && values.description.length > 500) {
    errors.description = "Description should be less than 500 characters!";
  }
  return errors;
};
