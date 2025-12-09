// Configuração AWS S3
import { S3Client } from "@aws-sdk/client-s3";

if (
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_REGION ||
  !process.env.AWS_BUCKET_NAME
) {
  throw new Error("AWS credentials not configured");
}

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const S3_CONFIG = {
  bucket: process.env.AWS_BUCKET_NAME,
  region: process.env.AWS_REGION, // ✅ Corrigido: era AWS_REGION_NAME
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880"), // 5MB
  allowedMimeTypes: (
    process.env.ALLOWED_FILE_TYPES || "image/jpeg,image/png,application/pdf"
  ).split(","),
};
