import bodyParser from "body-parser";
import cors from "cors";
import env from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler.js";
import router from "./routes/web.js";
import * as script from "./controllers/addSequenceToAllRecords.js";
import { addAdminUser } from "./controllers/addAdminUser.js";

env.config();
const app = express();
const httpServer = http.Server(app);
const allowedAppOrigin = process.env.ALLOWED_APP_ORIGIN;

app.use(cors({ origin: allowedAppOrigin }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
app.use(
  cors({
    origin: "https://api.indipayments.in",
    credentials: true
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});


// Add headers
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", allowedAppOrigin);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,Origin,X-Requested-With,Content-Type,Accept,x-socket-id"
  );
  res.setHeader("access-control-allow-methods", "GET");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("Cache-Control", "max-age=0, must-revalidate");
  res.setHeader("referrer-policy", "origin");
  res.setHeader("x-xss-protection", "1");
  res.setHeader("Pragma", "no-cache");
  next();
});

// Loading Routes
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(router);
app.use("/static", express.static("public"));
app.use(errorHandler);

mongoose.set("strictQuery", false); // NOTE - strictQuery

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    const port = process.env.PORT || 8080;

    if (process.env.RUN_ADMIN_SETUP === "1") {
      await addAdminUser();
    }

    httpServer.listen(port, (error) => {
      if (!error) {
        if (process.env.RUN_MIGRATION === "1") {
          script.fetchAllAndUpdate();
        }
        console.log("🚀 Server is running on port " + port);
      } else {
        console.error("❌ Error starting server:", error);
      }
    });
  });
