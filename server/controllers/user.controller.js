import * as userService from "../services/user.service.js";
import { HTTPCode } from "../utils/config/app.config.js";
import * as merchantMasterService from "../services/merchantMaster.service.js";
import { userTypes } from "../utils/constants/constants.js";
import { commonResponse } from "../utils/helper/utility.helper.fn.js";
import { ErrorMessage, SuccessMessage } from "../utils/messages/messages.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
const googleClient = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);

export const createUser = async (req, res, type, email, merchantId, password, name, data = {}) => {
  if (!Object.values(userTypes).includes(type)) {
    return commonResponse(res, HTTPCode.BAD_REQUEST, ErrorMessage.error, "Invalid User type", null);
  }
  let user = null;
  if (email) {
    user = await userService.getUser({ email });
  } else {
    return commonResponse(res, HTTPCode.BAD_REQUEST, ErrorMessage.error, "Email is missing", null);
  }
  const updatedBody = { email, name, type };
  if (type === userTypes.MERCHANT) {
    updatedBody.merchantId = merchantId;
    updatedBody.password = password;
  }
  if (!user) {
    user = await userService.createUser(updatedBody);
  } else {
    user = await userService.updateUser(user, updatedBody);
  }
  user.password = undefined;
  return commonResponse(
    res,
    HTTPCode.SUCCESSFUL,
    SuccessMessage.success,
    SuccessMessage.registerUserSuccess,
    { ...user, ...data }
  );
};

export const register = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const merchantId = req.body.merchantId;
    const password = req.body.password;
    const type = req.body.type;
    return createUser(req, res, type, email, merchantId, password, name);
  } catch (err) {
    console.log(err);
    return commonResponse(
      res,
      HTTPCode.INTERNAL_SERVER,
      ErrorMessage.error,
      ErrorMessage.internalServerError,
      null
    );
  }
};

export const loginWithGoogle = async (req, res) => {
  try {
    const token = req.body.token;
    
    if (!token) {
      return commonResponse(
        res,
        HTTPCode.UNAUTHORIZED,
        ErrorMessage.error,
        "Please login with google",
        null
      );
    }
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID
    });
    const { name, email, picture } = ticket.getPayload();

    let user = null;
    if (email) {
      user = await userService.getUser({ email, type: userTypes.ADMIN });
    } else {
      return commonResponse(
        res,
        HTTPCode.BAD_REQUEST,
        ErrorMessage.error,
        "Email is missing",
        null
      );
    }

    console.log(user);
    

    if (!user) {
      return commonResponse(
        res,
        HTTPCode.UNAUTHORIZED,
        ErrorMessage.error,
        "Wrong Login Credentials!",
        null
      );
      // user = await userService.createUser({ email, name });
    } else {
      const updatedBody = { email, name, picture };
      user = await userService.updateUser(user, updatedBody);
    }

    jwt.sign(
      { email, type: userTypes.ADMIN, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "60d" },
      (err, token) => {
        if (err) throw err;

        return commonResponse(
          res,
          HTTPCode.SUCCESSFUL,
          SuccessMessage.success,
          SuccessMessage.loginSuccess,
          { token, name, email, picture, type: userTypes.ADMIN }
        );
      }
    );
  } catch (error) {
    console.log(error);
    return commonResponse(
      res,
      HTTPCode.INTERNAL_SERVER,
      ErrorMessage.error,
      ErrorMessage.internalServerError,
      null
    );
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const email = req?.user?.email;
    const type = req?.user?.type;
    const merchantId = req?.user?.merchantId;
    let result = null;
    console.log("req?.user", req?.user);
    if (type === userTypes.MERCHANT) {
      result = await merchantMasterService.getMerchantById(merchantId);
      if (result) {
        result = {
          ...result.toJSON(),
          password: undefined,
          apiKey: undefined,
          merchantPassphrase: undefined
        };
      }
    }
    if (type === userTypes.ADMIN) {
      result = await userService.getUser({ email, type });
    }
    if (result) {
      return commonResponse(
        res,
        HTTPCode.SUCCESSFUL,
        SuccessMessage.success,
        SuccessMessage.fetchSuccess,
        result
      );
    }
    return commonResponse(
      res,
      HTTPCode.UNAUTHORIZED,
      ErrorMessage.error,
      "Wrong Login Credentials!",
      null
    );
  } catch (err) {
    console.log(err);
    return commonResponse(
      res,
      HTTPCode.INTERNAL_SERVER,
      ErrorMessage.error,
      ErrorMessage.internalServerError,
      null
    );
  }
};

export const merchantLogin = async (req, res) => {
  try {
    const contactEmail = req.body.email;
    const password = req.body.password;
    
    const user = await merchantMasterService.getMerchantByEmail(contactEmail);
    console.log({ user });
    if (user && password === user.password) {
      return jwt.sign(
        {
          email: contactEmail,
          type: userTypes.MERCHANT,
          merchantId: user._id
        },
        process.env.JWT_SECRET,
        { expiresIn: "60d" },
        (err, token) => {
          if (err) throw err;
          return commonResponse(
            res,
            HTTPCode.SUCCESSFUL,
            SuccessMessage.success,
            SuccessMessage.loginSuccess,
            {
              token,
              name: user.name,
              email: contactEmail,
              type: userTypes.MERCHANT,
              merchantId: user._id.toString()
            }
          );
        }
      );
    }
    return commonResponse(
      res,
      HTTPCode.UNAUTHORIZED,
      ErrorMessage.error,
      "Wrong Login Credentials!",
      null
    );
  } catch (err) {
    console.log(err);
    return commonResponse(
      res,
      HTTPCode.INTERNAL_SERVER,
      ErrorMessage.error,
      ErrorMessage.internalServerError,
      null
    );
  }
};
