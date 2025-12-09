// Testes unitários do AuthService
import { AuthService, RegisterDTO } from "../../src/services/auth.service";
import { prisma } from "../setup";
import { faker } from "@faker-js/faker";
import { comparePassword } from "../../src/utils/password";
import { ConflictError, UnauthorizedError } from "../../src/utils/errors";

describe("AuthService", () => {
  describe("register", () => {
    it("deve criar um candidato com sucesso", async () => {
      const userData: RegisterDTO = {
        email: faker.internet.email().toLowerCase(),
        password: "Password123!",
        name: faker.person.fullName(),
        type: "candidato",
      };

      const result = await AuthService.register(userData);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.user.type).toBe("CANDIDATO");
      expect(result.user.status).toBe("ACTIVE");
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.expiresIn).toBe(900);

      // Verificar que password não está no retorno
      expect((result.user as any).password).toBeUndefined();

      // Verificar que perfil de candidato foi criado
      const candidate = await prisma.candidate.findUnique({
        where: { userId: result.user.id },
      });
      expect(candidate).toBeDefined();
      expect(candidate?.profileCompleteness).toBe(20);
    });

    it("deve criar uma empresa com sucesso e status PENDING", async () => {
      const userData: RegisterDTO = {
        email: faker.internet.email().toLowerCase(),
        password: "Password123!",
        name: faker.person.fullName(),
        type: "empresa",
        companyName: faker.company.name(),
        nif: "123456789",
        phone: "+351912345678",
      };

      const result = await AuthService.register(userData);

      expect(result).toBeDefined();
      expect(result.user.type).toBe("EMPRESA");
      expect(result.user.status).toBe("PENDING");
      expect(result.message).toContain("aprovação");

      // Verificar que perfil de empresa foi criado
      const company = await prisma.company.findUnique({
        where: { userId: result.user.id },
      });
      expect(company).toBeDefined();
      expect(company?.name).toBe(userData.companyName);
      expect(company?.nif).toBe(userData.nif);
    });

    it("deve fazer hash da password antes de salvar", async () => {
      const userData: RegisterDTO = {
        email: faker.internet.email().toLowerCase(),
        password: "Password123!",
        name: faker.person.fullName(),
        type: "candidato",
      };

      const result = await AuthService.register(userData);

      const userFromDb = await prisma.user.findUnique({
        where: { id: result.user.id },
      });

      expect(userFromDb?.password).not.toBe(userData.password);
      expect(userFromDb?.password.length).toBeGreaterThan(50);

      // Verificar que a password hasheada é válida
      const isValid = await comparePassword(
        userData.password,
        userFromDb!.password
      );
      expect(isValid).toBe(true);
    });

    it("deve lançar erro se email já existe", async () => {
      const email = faker.internet.email().toLowerCase();

      const userData: RegisterDTO = {
        email,
        password: "Password123!",
        name: faker.person.fullName(),
        type: "candidato",
      };

      await AuthService.register(userData);

      await expect(AuthService.register(userData)).rejects.toThrow(
        ConflictError
      );
      await expect(AuthService.register(userData)).rejects.toThrow(
        "Este email já está registado."
      );
    });

    it("deve lançar erro se NIF já existe (empresa)", async () => {
      const nif = "123456789";

      const userData1: RegisterDTO = {
        email: faker.internet.email().toLowerCase(),
        password: "Password123!",
        name: faker.person.fullName(),
        type: "empresa",
        companyName: faker.company.name(),
        nif,
      };

      const userData2: RegisterDTO = {
        email: faker.internet.email().toLowerCase(),
        password: "Password123!",
        name: faker.person.fullName(),
        type: "empresa",
        companyName: faker.company.name(),
        nif,
      };

      await AuthService.register(userData1);

      await expect(AuthService.register(userData2)).rejects.toThrow(
        ConflictError
      );
      await expect(AuthService.register(userData2)).rejects.toThrow(
        "Este NIF já está registado."
      );
    });
  });

  describe("login", () => {
    it("deve fazer login com credenciais válidas", async () => {
      const password = "Password123!";
      const email = faker.internet.email().toLowerCase();

      // Criar utilizador primeiro
      await AuthService.register({
        email,
        password,
        name: faker.person.fullName(),
        type: "candidato",
      });

      // Fazer login
      const result = await AuthService.login({
        email,
        password,
      });

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(email);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();

      // Verificar que password não está no retorno
      expect((result.user as any).password).toBeUndefined();
    });

    it("deve lançar erro com email inválido", async () => {
      await expect(
        AuthService.login({
          email: "naoexiste@test.com",
          password: "Password123!",
        })
      ).rejects.toThrow(UnauthorizedError);
    });

    it("deve lançar erro com password inválida", async () => {
      const email = faker.internet.email().toLowerCase();

      await AuthService.register({
        email,
        password: "Password123!",
        name: faker.person.fullName(),
        type: "candidato",
      });

      await expect(
        AuthService.login({
          email,
          password: "WrongPassword123!",
        })
      ).rejects.toThrow(UnauthorizedError);
      await expect(
        AuthService.login({
          email,
          password: "WrongPassword123!",
        })
      ).rejects.toThrow("Email ou password incorretos.");
    });

    it("deve lançar erro se conta está suspensa", async () => {
      const email = faker.internet.email().toLowerCase();
      const password = "Password123!";

      const registerResult = await AuthService.register({
        email,
        password,
        name: faker.person.fullName(),
        type: "candidato",
      });

      // Suspender conta
      await prisma.user.update({
        where: { id: registerResult.user.id },
        data: { status: "SUSPENDED" },
      });

      await expect(
        AuthService.login({
          email,
          password,
        })
      ).rejects.toThrow("A sua conta foi suspensa");
    });

    it("deve atualizar lastLoginAt", async () => {
      const email = faker.internet.email().toLowerCase();
      const password = "Password123!";

      await AuthService.register({
        email,
        password,
        name: faker.person.fullName(),
        type: "candidato",
      });

      const result = await AuthService.login({
        email,
        password,
      });

      const user = await prisma.user.findUnique({
        where: { id: result.user.id },
      });

      expect(user?.lastLoginAt).toBeDefined();
      expect(user?.lastLoginAt).toBeInstanceOf(Date);
    });
  });

  describe("forgotPassword", () => {
    it("deve gerar token de reset para email válido", async () => {
      const email = faker.internet.email().toLowerCase();

      await AuthService.register({
        email,
        password: "Password123!",
        name: faker.person.fullName(),
        type: "candidato",
      });

      const result = await AuthService.forgotPassword(email);

      expect(result.message).toContain("receberá instruções");

      const user = await prisma.user.findUnique({
        where: { email },
      });

      expect(user?.passwordResetToken).toBeDefined();
      expect(user?.passwordResetExpires).toBeDefined();
      expect(user?.passwordResetExpires).toBeInstanceOf(Date);
    });

    it("não deve revelar se email não existe", async () => {
      const result = await AuthService.forgotPassword(
        "naoexiste@test.com"
      );

      expect(result.message).toContain("receberá instruções");
    });
  });

  describe("resetPassword", () => {
    it("deve resetar password com token válido", async () => {
      const email = faker.internet.email().toLowerCase();
      const oldPassword = "OldPassword123!";
      const newPassword = "NewPassword123!";

      // Registar e solicitar reset
      await AuthService.register({
        email,
        password: oldPassword,
        name: faker.person.fullName(),
        type: "candidato",
      });

      await AuthService.forgotPassword(email);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Resetar password
      const result = await AuthService.resetPassword(
        user!.passwordResetToken!,
        newPassword
      );

      expect(result.message).toContain("Password alterada");

      // Verificar que pode fazer login com nova password
      const loginResult = await AuthService.login({
        email,
        password: newPassword,
      });

      expect(loginResult).toBeDefined();

      // Verificar que não pode fazer login com password antiga
      await expect(
        AuthService.login({
          email,
          password: oldPassword,
        })
      ).rejects.toThrow();
    });

    it("deve lançar erro com token inválido", async () => {
      await expect(
        AuthService.resetPassword("token_invalido", "NewPassword123!")
      ).rejects.toThrow(UnauthorizedError);
    });

    it("deve lançar erro com token expirado", async () => {
      const email = faker.internet.email().toLowerCase();

      await AuthService.register({
        email,
        password: "Password123!",
        name: faker.person.fullName(),
        type: "candidato",
      });

      await AuthService.forgotPassword(email);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Expirar token manualmente
      await prisma.user.update({
        where: { id: user!.id },
        data: {
          passwordResetExpires: new Date(Date.now() - 1000),
        },
      });

      await expect(
        AuthService.resetPassword(
          user!.passwordResetToken!,
          "NewPassword123!"
        )
      ).rejects.toThrow("Token inválido ou expirado");
    });
  });
});

