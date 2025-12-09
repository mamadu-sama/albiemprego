// Middleware de upload de arquivos
import multer from "multer";
import { Request } from "express";
import { S3_CONFIG } from "../config/s3";

// Configurar multer para usar memória (buffer)
const storage = multer.memoryStorage();

// Filtro de arquivos
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (S3_CONFIG.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Tipo de arquivo não permitido. Aceites: ${S3_CONFIG.allowedMimeTypes.join(", ")}`
      )
    );
  }
};

// Configuração do multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: S3_CONFIG.maxFileSize,
  },
});

// Middleware específicos
export const uploadAvatar = upload.single("avatar");
export const uploadCV = upload.single("cv");
export const uploadLogo = upload.single("logo");

