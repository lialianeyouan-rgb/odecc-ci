require("./config/environment.js");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const globalLimiter = require("./middlewares/global.middleware.js");
const articleRoutes = require("./modules/articles/articles.routes.js");
const albumRoutes = require("./modules/albums/albums.routes.js");
const authRoutes = require("./modules/auth/auth.routes.js");
const aiRoutes = require("./modules/ai/ai.routes.js");
const contactRoutes = require("./modules/contact/contact.routes.js");
const statsRoutes = require("./modules/stats/stats.routes.js");
const { notFoundHandler } = require("./middlewares/notFoundMiddleware.js");
const { errorHandler } = require("./middlewares/errorMiddleware.js");
const { verifyDbConnection } = require("./config/db.js");

const app = express();
app.set("trust proxy", 1);

const isProd = process.env.NODE_ENV === "production";
app.use(morgan(isProd ? "combined" : "dev"));

const normalizeOrigin = (origin) =>
  String(origin || "")
    .trim()
    .replace(/\/+$/, "");

const envCorsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(normalizeOrigin).filter(Boolean)
  : [];

const fallbackCorsOrigins =
  process.env.NODE_ENV === "production"
    ? []
    : ["http://localhost:3000", "http://localhost:5173"].map(normalizeOrigin);

const allowedOrigins = new Set([...fallbackCorsOrigins, ...envCorsOrigins]);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalized = normalizeOrigin(origin);
    if (allowedOrigins.has(normalized)) return callback(null, true);
    return callback(new Error(`CORS: origine non autorisee (${normalized})`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "no-referrer" },
    xContentTypeOptions: true,
    xDnsPrefetchControl: { allow: false },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(globalLimiter);
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/articles", articleRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/ai", aiRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (_req, res) => {
  res.send("ODEC-CI API ONLINE");
});

app.use(notFoundHandler);
app.use(errorHandler);

(async () => {
  try {
    console.log("CORS origins autorisees:", Array.from(allowedOrigins));
    await verifyDbConnection();
    console.log("Base de donnees connectee ✅");
  } catch (error) {
    console.error("Erreur connexion DB :", error?.message || error);
  }
})();

module.exports = app;
