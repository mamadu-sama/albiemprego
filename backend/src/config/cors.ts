// Configuração CORS
import { CorsOptions } from "cors";

const allowedOrigins = [
  "https://albiemprego.pt",
  "https://www.albiemprego.pt",
  "https://app.albiemprego.pt",
  ...(process.env.NODE_ENV === "development"
    ? [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        process.env.FRONTEND_URL,
      ].filter(Boolean)
    : []),
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Em desenvolvimento, permitir todas as origens
    if (process.env.NODE_ENV === "development") {
      callback(null, true);
      return;
    }

    // Em produção, verificar lista de origens permitidas
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept-Language",
    "X-Requested-With",
  ],
  maxAge: 86400, // 24 horas para cache de preflight
};

export default corsOptions;

