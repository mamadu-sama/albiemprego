// Testes de integração dos endpoints de autenticação
import request from "supertest";
import app from "../../src/app";
import { prisma } from "../setup";
import { faker } from "@faker-js/faker";

describe("Auth API Integration", () => {
  describe("POST /api/v1/auth/register", () => {
    it("deve registar um novo candidato", async () => {
      const userData = {
        email: faker.internet.email().toLowerCase(),
        password: "Password123!",
        name: faker.person.fullName(),
        type: "candidato",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
      expect(response.body).toHaveProperty("expiresIn", 900);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.type).toBe("CANDIDATO");
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("deve registar uma nova empresa com status PENDING", async () => {
      const userData = {
        email: faker.internet.email().toLowerCase(),
        password: "Password123!",
        name: faker.person.fullName(),
        type: "empresa",
        companyName: faker.company.name(),
        nif: "123456789",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.user.type).toBe("EMPRESA");
      expect(response.body.user.status).toBe("PENDING");
      expect(response.body.message).toContain("aprovação");
    });

    it("deve retornar 409 se email já existe", async () => {
      const email = faker.internet.email().toLowerCase();
      const userData = {
        email,
        password: "Password123!",
        name: faker.person.fullName(),
        type: "candidato",
      };

      // Primeiro registo
      await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(201);

      // Segundo registo (duplicado)
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(409);

      expect(response.body.error).toBe("EMAIL_EXISTS");
      expect(response.body.message).toContain("email já está registado");
    });

    it("deve validar formato de email", async () => {
      const userData = {
        email: "email-invalido",
        password: "Password123!",
        name: "Test User",
        type: "candidato",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });

    it("deve validar força da password", async () => {
      const userData = {
        email: faker.internet.email().toLowerCase(),
        password: "weak",
        name: "Test User",
        type: "candidato",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });

    it("deve validar campos obrigatórios para empresa", async () => {
      const userData = {
        email: faker.internet.email().toLowerCase(),
        password: "Password123!",
        name: "Test User",
        type: "empresa",
        // Faltam companyName e nif
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("deve fazer login com credenciais válidas", async () => {
      const password = "Password123!";
      const email = faker.internet.email().toLowerCase();

      // Criar utilizador
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          email,
          password,
          name: faker.person.fullName(),
          type: "candidato",
        });

      // Fazer login
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email,
          password,
        })
        .expect(200);

      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
      expect(response.body.user.email).toBe(email);
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("deve retornar 401 com email inválido", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "naoexiste@test.com",
          password: "Password123!",
        })
        .expect(401);

      expect(response.body.error).toBe("UNAUTHORIZED");
    });

    it("deve retornar 401 com password inválida", async () => {
      const email = faker.internet.email().toLowerCase();

      // Criar utilizador
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          email,
          password: "Password123!",
          name: faker.person.fullName(),
          type: "candidato",
        });

      // Login com password errada
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email,
          password: "WrongPassword123!",
        })
        .expect(401);

      expect(response.body.error).toBe("UNAUTHORIZED");
      expect(response.body.message).toContain("Email ou password incorretos");
    });

    // Teste desabilitado - rate limiting está desabilitado durante testes
    it.skip("deve aplicar rate limiting após 5 tentativas", async () => {
      const email = "test@example.com";
      const password = "WrongPassword123!";

      // Fazer 5 tentativas falhadas
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post("/api/v1/auth/login")
          .send({ email, password })
          .expect(401);
      }

      // 6ª tentativa deve ser bloqueada
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ email, password })
        .expect(429);

      expect(response.body.error).toBe("TOO_MANY_LOGIN_ATTEMPTS");
    }, 15000); // Timeout maior para este teste
  });

  describe("POST /api/v1/auth/forgot-password", () => {
    it("deve aceitar pedido para email válido", async () => {
      const email = faker.internet.email().toLowerCase();

      // Criar utilizador
      await request(app).post("/api/v1/auth/register").send({
        email,
        password: "Password123!",
        name: faker.person.fullName(),
        type: "candidato",
      });

      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email })
        .expect(200);

      expect(response.body.message).toContain("receberá instruções");
    });

    it("deve retornar mesma mensagem para email inexistente (segurança)", async () => {
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "naoexiste@test.com" })
        .expect(200);

      expect(response.body.message).toContain("receberá instruções");
    });

    it("deve validar formato de email", async () => {
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "email-invalido" })
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /api/v1/auth/reset-password", () => {
    it("deve resetar password com token válido", async () => {
      const email = faker.internet.email().toLowerCase();
      const oldPassword = "OldPassword123!";
      const newPassword = "NewPassword123!";

      // Criar utilizador
      await request(app).post("/api/v1/auth/register").send({
        email,
        password: oldPassword,
        name: faker.person.fullName(),
        type: "candidato",
      });

      // Solicitar reset
      await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email });

      // Obter token do BD
      const user = await prisma.user.findUnique({ where: { email } });
      const token = user!.passwordResetToken!;

      // Resetar password
      const response = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          token,
          password: newPassword,
        })
        .expect(200);

      expect(response.body.message).toContain("Password alterada");

      // Verificar que pode fazer login com nova password
      await request(app)
        .post("/api/v1/auth/login")
        .send({
          email,
          password: newPassword,
        })
        .expect(200);

      // Verificar que não pode fazer login com password antiga
      await request(app)
        .post("/api/v1/auth/login")
        .send({
          email,
          password: oldPassword,
        })
        .expect(401);
    });

    it("deve retornar 401 com token inválido", async () => {
      const response = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          token: "token_invalido",
          password: "NewPassword123!",
        })
        .expect(401);

      expect(response.body.error).toBe("UNAUTHORIZED");
    });

    it("deve validar força da nova password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          token: "some_token",
          password: "weak",
        })
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    it("deve renovar access token com refresh token válido", async () => {
      const email = faker.internet.email().toLowerCase();

      // Registar e obter tokens
      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email,
          password: "Password123!",
          name: faker.person.fullName(),
          type: "candidato",
        });

      const { refreshToken } = registerResponse.body;

      // Renovar token
      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("expiresIn", 900);
      expect(response.body.accessToken).toBeDefined();
    });

    it("deve retornar 401 com refresh token inválido", async () => {
      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: "token_invalido" })
        .expect(401);

      expect(response.body.error).toBe("UNAUTHORIZED");
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("deve fazer logout com sucesso", async () => {
      const email = faker.internet.email().toLowerCase();

      // Registar e obter token
      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email,
          password: "Password123!",
          name: faker.person.fullName(),
          type: "candidato",
        });

      const { accessToken } = registerResponse.body;

      // Logout
      await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(204);
    });

    it("deve retornar 401 sem token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/logout")
        .expect(401);

      expect(response.body.error).toBe("UNAUTHORIZED");
    });

    it("deve retornar 401 com token inválido", async () => {
      const response = await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", "Bearer token_invalido")
        .expect(401);

      expect(response.body.error).toBe("INVALID_TOKEN");
    });
  });
});

