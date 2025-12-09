// Service de upload de arquivos para AWS S3
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_CONFIG } from "../config/s3";
import { BadRequestError } from "../utils/errors";
import { logger } from "../config/logger";
import crypto from "crypto";
import path from "path";

export class UploadService {
  /**
   * Gerar nome único para o arquivo
   */
  private static generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString("hex");
    const extension = path.extname(originalName);
    return `${timestamp}-${randomString}${extension}`;
  }

  /**
   * Upload de arquivo para S3
   */
  static async uploadFile(
    file: Express.Multer.File,
    folder: string = "uploads"
  ): Promise<string> {
    try {
      // Validar tipo de arquivo
      if (!S3_CONFIG.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestError(
          `Tipo de arquivo não permitido. Tipos aceites: ${S3_CONFIG.allowedMimeTypes.join(", ")}`,
          "INVALID_FILE_TYPE"
        );
      }

      // Validar tamanho
      if (file.size > S3_CONFIG.maxFileSize) {
        throw new BadRequestError(
          `Arquivo muito grande. Tamanho máximo: ${S3_CONFIG.maxFileSize / 1024 / 1024}MB`,
          "FILE_TOO_LARGE"
        );
      }

      // Gerar nome único
      const fileName = this.generateFileName(file.originalname);
      const key = `${folder}/${fileName}`;

      // Upload para S3
      const command = new PutObjectCommand({
        Bucket: S3_CONFIG.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read", // Tornar arquivo público
      });

      await s3Client.send(command);

      // Construir URL do arquivo
      const fileUrl = `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;

      logger.info(`Arquivo enviado para S3: ${fileUrl}`);
      return fileUrl;
    } catch (error) {
      logger.error("Erro ao enviar arquivo para S3:", error);
      throw error;
    }
  }

  /**
   * Deletar arquivo do S3
   */
  static async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extrair key do URL
      const urlParts = fileUrl.split(".amazonaws.com/");
      if (urlParts.length < 2) {
        throw new BadRequestError("URL inválida", "INVALID_URL");
      }

      const key = urlParts[1];

      const command = new DeleteObjectCommand({
        Bucket: S3_CONFIG.bucket,
        Key: key,
      });

      await s3Client.send(command);
      logger.info(`Arquivo removido do S3: ${key}`);
    } catch (error) {
      logger.error("Erro ao remover arquivo do S3:", error);
      throw error;
    }
  }

  /**
   * Upload de avatar
   */
  static async uploadAvatar(file: Express.Multer.File): Promise<string> {
    return this.uploadFile(file, "avatars");
  }

  /**
   * Upload de CV
   */
  static async uploadCV(file: Express.Multer.File): Promise<string> {
    return this.uploadFile(file, "cvs");
  }

  /**
   * Upload de logo de empresa
   */
  static async uploadLogo(file: Express.Multer.File): Promise<string> {
    return this.uploadFile(file, "logos");
  }
}

