export const resDotSendInterceptor = (res, send) => (content) => {
  res.contentBody = content;
  res.send = send;
  res.send(content);
};

export const requestLoggerMiddleware =
  ({ logger }) =>
  (req, res, next) => {
    console.log("hello");
    const timestamp = new Date().getTime();
    let logStr = `${timestamp} REQUEST ${req.method} url:${req.url} hostname:${
      req.hostname
    } body:${JSON.stringify(req.body)}`;
    if (req.header("Signature")) {
      logStr += ` Signature:${req.header("Signature")}`;
    }
    if (req.header("Authorization")) {
      logStr += ` Authorization:${req.header("Authorization")}`;
    }
    const contentType = req.header("Content-Type") || req.header("content-type");
    if (contentType) {
      logStr += ` Content-Type:${contentType}`;
    }
    logger(logStr);
    res.send = resDotSendInterceptor(res, res.send);
    res.on("finish", () => {
      logger(`${timestamp} body:${JSON.stringify(res.contentBody)} status_code:${res.statusCode}`);
    });
    next();
  };
