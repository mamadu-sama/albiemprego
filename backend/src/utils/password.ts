// Utilitários para hashing e validação de passwords
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * Hash de password usando bcrypt com cost factor 12
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Comparar password plain text com hash
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Validar força de password
 * Deve conter: minúsculas, maiúsculas, números e mínimo 8 caracteres
 */
export const validatePasswordStrength = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return (
    password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers
  );
};

