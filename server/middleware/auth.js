import jwt from "jsonwebtoken";

const auth =
  (userType = []) =>
  (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const bearerToken = req.header("x-auth-token");
    const token = bearerToken?.split?.(" ")?.[1] || null;

    if (!token) {
      return res.status(401).json({ msg: "No Token, Authorization denied" });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!userType.includes(decoded?.type)) {
        return res.status(401).json({ msg: "Unauthorized user" });
      }
      console.log({decoded})
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ msg: "Token is not valid" });
    }
  };

export default auth;
