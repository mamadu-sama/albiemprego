// Testes de integração para endpoints de utilizador
import request from "supertest";
import app from "@/app";
import { prisma } from "../setup";
import { faker } from "@faker-js/faker";
import { hashPassword } from "@/utils/password";
import { generateTokens } from "@/utils/jwt";

describe("User API", () => {
  let candidateToken: string;
  let candidateId: string;
  let empresaToken: string;
  let empresaId: string;

  beforeAll(async () => {
    // Limpar dados anteriores para garantir NIF único
    await prisma.company.deleteMany({});
    await prisma.candidate.deleteMany({});
    await prisma.user.deleteMany({});

    // Criar candidato de teste
    const password = await hashPassword("Test123!");
    const candidate = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password,
        name: "Test Candidate",
        type: "CANDIDATO",
        status: "ACTIVE",
        emailVerified: true,
      },
    });
    candidateId = candidate.id;
    await prisma.candidate.create({
      data: {
        userId: candidate.id,
        profileCompleteness: 20,
      },
    });
    const tokens = generateTokens(candidate.id, candidate.type);
    candidateToken = tokens.accessToken;

    // Criar empresa de teste
    const empresa = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password,
        name: "Test Company Contact",
        type: "EMPRESA",
        status: "ACTIVE",
        emailVerified: true,
      },
    });
    empresaId = empresa.id;
    await prisma.company.create({
      data: {
        userId: empresa.id,
        name: "Test Company",
        nif: faker.string.numeric(9), // Gerar NIF único
      },
    });
    const empresaTokens = generateTokens(empresa.id, empresa.type);
    empresaToken = empresaTokens.accessToken;
  });

  describe("GET /api/v1/users/me", () => {
    it("should return candidate profile with token", async () => {
      const response = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("id", candidateId);
      expect(response.body).toHaveProperty("email");
      expect(response.body).toHaveProperty("name", "Test Candidate");
      expect(response.body).toHaveProperty("type", "CANDIDATO");
      expect(response.body).toHaveProperty("candidate");
      expect(response.body).not.toHaveProperty("password");
      expect(response.body).not.toHaveProperty("passwordResetToken");
    });

    it("should return empresa profile with token", async () => {
      const response = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", `Bearer ${empresaToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("id", empresaId);
      expect(response.body).toHaveProperty("type", "EMPRESA");
      expect(response.body).toHaveProperty("company");
      expect(response.body.company).toHaveProperty("name", "Test Company");
    });

    it("should return 401 without token", async () => {
      const response = await request(app)
        .get("/api/v1/users/me")
        .expect(401);

      expect(response.body.error).toBe("UNAUTHORIZED");
    });

    it("should return 401 with invalid token", async () => {
      const response = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body.error).toBe("INVALID_TOKEN");
    });
  });

  describe("PATCH /api/v1/users/me", () => {
    it("should update user profile", async () => {
      const updateData = {
        name: "Updated Name",
        phone: "+351912345678",
        location: "Castelo Branco",
        bio: "New bio text",
      };

      const response = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe("Updated Name");
      expect(response.body.phone).toBe("+351912345678");
      expect(response.body.location).toBe("Castelo Branco");
      expect(response.body.bio).toBe("New bio text");
      expect(response.body).not.toHaveProperty("password");
    });

    it("should validate phone format", async () => {
      const response = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({ phone: "invalid-phone" })
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
      expect(response.body.errors).toBeDefined();
    });

    it("should not allow updating with very long name", async () => {
      const response = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({ name: "a".repeat(101) })
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });

    it("should return 401 without token", async () => {
      await request(app)
        .patch("/api/v1/users/me")
        .send({ name: "Test" })
        .expect(401);
    });
  });

  describe("POST /api/v1/users/me/avatar", () => {
    it("should update user avatar", async () => {
      const avatarUrl = "https://example.com/avatar.jpg";

      const response = await request(app)
        .post("/api/v1/users/me/avatar")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({ avatarUrl })
        .expect(200);

      expect(response.body.avatar).toBe(avatarUrl);
    });

    it("should return 400 without avatarUrl", async () => {
      const response = await request(app)
        .post("/api/v1/users/me/avatar")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe("MISSING_AVATAR_URL");
    });

    it("should return 401 without token", async () => {
      await request(app)
        .post("/api/v1/users/me/avatar")
        .send({ avatarUrl: "test.jpg" })
        .expect(401);
    });
  });

  describe("DELETE /api/v1/users/me/avatar", () => {
    it("should delete user avatar", async () => {
      // Primeiro define um avatar
      await request(app)
        .post("/api/v1/users/me/avatar")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({ avatarUrl: "https://example.com/avatar.jpg" });

      // Depois remove
      const response = await request(app)
        .delete("/api/v1/users/me/avatar")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(response.body.avatar).toBeNull();
    });

    it("should return 401 without token", async () => {
      await request(app)
        .delete("/api/v1/users/me/avatar")
        .expect(401);
    });
  });

  describe("PATCH /api/v1/users/me/email", () => {
    it("should update email with valid password", async () => {
      const newEmail = faker.internet.email();

      const response = await request(app)
        .patch("/api/v1/users/me/email")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          newEmail,
          currentPassword: "Test123!",
        })
        .expect(200);

      expect(response.body.email).toBe(newEmail);
      expect(response.body).not.toHaveProperty("password");
    });

    it("should return 401 with wrong password", async () => {
      const response = await request(app)
        .patch("/api/v1/users/me/email")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          newEmail: faker.internet.email(),
          currentPassword: "WrongPassword123!",
        })
        .expect(401);

      expect(response.body.error).toBe("INVALID_PASSWORD");
    });

    it("should return 400 if email already exists", async () => {
      // Tentar usar o email da empresa
      const empresaUser = await prisma.user.findUnique({
        where: { id: empresaId },
      });

      const response = await request(app)
        .patch("/api/v1/users/me/email")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          newEmail: empresaUser!.email,
          currentPassword: "Test123!",
        })
        .expect(400);

      expect(response.body.error).toBe("EMAIL_EXISTS");
    });

    it("should return 400 with invalid email format", async () => {
      const response = await request(app)
        .patch("/api/v1/users/me/email")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          newEmail: "invalid-email",
          currentPassword: "Test123!",
        })
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });

    it("should return 401 without token", async () => {
      await request(app)
        .patch("/api/v1/users/me/email")
        .send({
          newEmail: faker.internet.email(),
          currentPassword: "Test123!",
        })
        .expect(401);
    });
  });

  describe("PATCH /api/v1/users/me/password", () => {
    it("should change password with valid current password", async () => {
      const response = await request(app)
        .patch("/api/v1/users/me/password")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          currentPassword: "Test123!",
          newPassword: "NewPassword123!",
        })
        .expect(200);

      expect(response.body.message).toBe("Password alterada com sucesso");
    });

    it("should return 401 with wrong current password", async () => {
      const response = await request(app)
        .patch("/api/v1/users/me/password")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          currentPassword: "WrongPassword123!",
          newPassword: "NewPassword123!",
        })
        .expect(401);

      expect(response.body.error).toBe("INVALID_PASSWORD");
    });

    it("should return 400 if new password is too short", async () => {
      const response = await request(app)
        .patch("/api/v1/users/me/password")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          currentPassword: "Test123!",
          newPassword: "Short1",
        })
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });

    it("should return 400 if new password does not meet requirements", async () => {
      const response = await request(app)
        .patch("/api/v1/users/me/password")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          currentPassword: "Test123!",
          newPassword: "onlylowercase",
        })
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });

    it("should return 401 without token", async () => {
      await request(app)
        .patch("/api/v1/users/me/password")
        .send({
          currentPassword: "Test123!",
          newPassword: "NewPassword123!",
        })
        .expect(401);
    });
  });

  describe("DELETE /api/v1/users/me", () => {
    it("should soft delete account with valid password", async () => {
      const response = await request(app)
        .delete("/api/v1/users/me")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          password: "Test123!",
        })
        .expect(200);

      expect(response.body.message).toBe("Conta eliminada com sucesso");

      // Verificar que o status foi alterado para SUSPENDED
      const user = await prisma.user.findUnique({
        where: { id: candidateId },
      });
      expect(user?.status).toBe("SUSPENDED");
    });

    it("should return 401 with wrong password", async () => {
      const response = await request(app)
        .delete("/api/v1/users/me")
        .set("Authorization", `Bearer ${empresaToken}`)
        .send({
          password: "WrongPassword123!",
        })
        .expect(401);

      expect(response.body.error).toBe("INVALID_PASSWORD");
    });

    it("should return 400 without password", async () => {
      const response = await request(app)
        .delete("/api/v1/users/me")
        .set("Authorization", `Bearer ${empresaToken}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });

    it("should return 401 without token", async () => {
      await request(app)
        .delete("/api/v1/users/me")
        .send({ password: "Test123!" })
        .expect(401);
    });
  });
});

