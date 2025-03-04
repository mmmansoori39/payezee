import { getMerchantByKeyAndPassphrase } from "../services/merchantMaster.service.js";
import { getMerchantKeyAndPassphrase, verifySignature } from "../utils/crypto.js";

export default async function merchantAuth(req, res, next) {
  const authorizationHash = req.header("Authorization");
  const signature = req.header("Signature");
  const { merchantKey, merchantPassphrase } = getMerchantKeyAndPassphrase(authorizationHash);
  console.log({ merchantKey, merchantPassphrase });
  if (!authorizationHash || !signature || !merchantKey || !merchantPassphrase) {
    return res.status(401).json({
      code: "401",
      description: "Invalid Headers",
      type: "InvalidHeader"
    });
  }
  try {
    const merchant = await getMerchantByKeyAndPassphrase(merchantKey, merchantPassphrase);
    console.log({ merchant });
    if (merchant) {
      const ApiKeyHash = merchant.apiKey;
      const isSignatureValid = verifySignature(signature, req.body, ApiKeyHash, merchantPassphrase);
      if (!isSignatureValid) {
        return res.status(401).json({
          code: "401",
          description: "Invalid Signature",
          type: "InvalidSignature"
        });
      }
      req.merchant = merchant;
      next();
      return;
    }
    return res.status(401).json({
      code: "401",
      description: "Unauthorized access error!",
      type: "UnauthorizedError"
    });
  } catch (error) {
    return res.status(501).json({
      code: "501",
      description: "Internal Server Error!",
      type: "ServerSideError"
    });
  }
}
