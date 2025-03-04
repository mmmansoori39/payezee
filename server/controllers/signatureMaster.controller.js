import { HTTPCode } from "../utils/config/app.config.js";
import { aesEncrypt, generateSignatureHash, getAuthorizationHash } from "../utils/crypto.js";
import { commonResponse } from "../utils/helper/utility.helper.fn.js";
import { ErrorMessage, SuccessMessage } from "../utils/messages/messages.js";

export const createSignature = async (req, res) => {
  try {
    const apiKeyHash = aesEncrypt(req.body.apiKey, req.body.merchantPassphrase);
    const body = JSON.parse(req.body.jsonBody);
    const Signature = generateSignatureHash(apiKeyHash, req.body.merchantPassphrase, body);
    const Authorization = getAuthorizationHash(req.body.merchantKey, req.body.merchantPassphrase);
    const data = { Authorization, Signature };
    return commonResponse(
      res,
      HTTPCode.SUCCESSFUL,
      SuccessMessage.success,
      "Generated Signature Successfully",
      data
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
