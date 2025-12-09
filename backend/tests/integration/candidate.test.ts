// Testes de integração para rotas de candidato
import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/database";
import { hashPassword } from "../../src/utils/password";
import { generateTokens } from "../../src/utils/jwt";

describe("Candidate API", () => {
  let candidateToken: string;
  let candidateId: string;
  let candidateUserId: string;
  let companyToken: string;

  beforeAll(async () => {
    // Criar candidato de teste
    const candidateUser = await prisma.user.create({
      data: {
        email: "candidate.test@example.com",
        password: await hashPassword("Candidate123!"),
        name: "Candidato Teste",
        type: "CANDIDATO",
        status: "ACTIVE",
        emailVerified: true,
        candidate: {
          create: {
            skills: ["JavaScript", "React"],
            experienceYears: 3,
            currentPosition: "Developer",
            profileCompleteness: 50,
          },
        },
      },
      include: { candidate: true },
    });

    candidateUserId = candidateUser.id;
    candidateId = candidateUser.candidate!.id;
    const tokens = generateTokens(candidateUser.id, candidateUser.type);
    candidateToken = tokens.accessToken;

    // Criar empresa de teste
    const companyUser = await prisma.user.create({
      data: {
        email: "company.test@example.com",
        password: await hashPassword("Company123!"),
        name: "Empresa Teste",
        type: "EMPRESA",
        status: "ACTIVE",
        emailVerified: true,
        company: {
          create: {
            name: "Empresa Teste Lda",
            nif: "999999999",
          },
        },
      },
    });

    const companyTokens = generateTokens(companyUser.id, companyUser.type);
    companyToken = companyTokens.accessToken;
  });

  afterEach(async () => {
    // Limpar apenas experiências, educação e idiomas entre testes
    await prisma.experience.deleteMany({ where: { candidateId } });
    await prisma.education.deleteMany({ where: { candidateId } });
    await prisma.language.deleteMany({ where: { candidateId } });
  });

  afterAll(async () => {
    // Limpar utilizadores no final de todos os testes
    await prisma.candidate.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["candidate.test@example.com", "company.test@example.com"],
        },
      },
    });
  });

  // ==========================================
  // PERFIL
  // ==========================================

  describe("GET /api/v1/candidates/me", () => {
    it("should get candidate profile successfully", async () => {
      const response = await request(app)
        .get("/api/v1/candidates/me")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe("candidate.test@example.com");
      expect(response.body).toHaveProperty("experiences");
      expect(response.body).toHaveProperty("educations");
      expect(response.body).toHaveProperty("languages");
    });

    it("should return 401 without token", async () => {
      await request(app)
        .get("/api/v1/candidates/me")
        .expect(401);
    });

    it("should return 403 for company user", async () => {
      await request(app)
        .get("/api/v1/candidates/me")
        .set("Authorization", `Bearer ${companyToken}`)
        .expect(403);
    });
  });

  describe("PATCH /api/v1/candidates/me", () => {
    it("should update candidate profile successfully", async () => {
      const response = await request(app)
        .patch("/api/v1/candidates/me")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          skills: ["JavaScript", "React", "TypeScript"],
          experienceYears: 5,
          currentPosition: "Senior Developer",
        })
        .expect(200);

      expect(response.body.skills).toContain("TypeScript");
      expect(response.body.experienceYears).toBe(5);
      expect(response.body.currentPosition).toBe("Senior Developer");
    });

    it("should validate skills as array", async () => {
      const response = await request(app)
        .patch("/api/v1/candidates/me")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          skills: "not-an-array",
        })
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });
  });

  // ==========================================
  // EXPERIÊNCIAS
  // ==========================================

  describe("POST /api/v1/candidates/me/experiences", () => {
    it("should create experience successfully", async () => {
      const response = await request(app)
        .post("/api/v1/candidates/me/experiences")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          company: "Tech Solutions",
          position: "Frontend Developer",
          startDate: "2022-01-01",
          current: true,
          description: "Developing web applications",
        })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.company).toBe("Tech Solutions");
      expect(response.body.position).toBe("Frontend Developer");
      expect(response.body.current).toBe(true);
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/v1/candidates/me/experiences")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          position: "Developer",
          // Missing company and startDate
        })
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });
  });

  describe("PATCH /api/v1/candidates/me/experiences/:id", () => {
    let experienceId: string;

    beforeEach(async () => {
      const experience = await prisma.experience.create({
        data: {
          candidateId,
          company: "Old Company",
          position: "Junior Developer",
          startDate: new Date("2020-01-01"),
          current: false,
        },
      });
      experienceId = experience.id;
    });

    it("should update experience successfully", async () => {
      const response = await request(app)
        .patch(`/api/v1/candidates/me/experiences/${experienceId}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          company: "New Company",
          position: "Senior Developer",
        })
        .expect(200);

      expect(response.body.company).toBe("New Company");
      expect(response.body.position).toBe("Senior Developer");
    });

    it("should return 404 for non-existent experience", async () => {
      await request(app)
        .patch(`/api/v1/candidates/me/experiences/invalid-id`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          company: "Test",
        })
        .expect(404);
    });
  });

  describe("DELETE /api/v1/candidates/me/experiences/:id", () => {
    let experienceId: string;

    beforeEach(async () => {
      const experience = await prisma.experience.create({
        data: {
          candidateId,
          company: "To Delete",
          position: "Developer",
          startDate: new Date("2020-01-01"),
          current: false,
        },
      });
      experienceId = experience.id;
    });

    it("should delete experience successfully", async () => {
      await request(app)
        .delete(`/api/v1/candidates/me/experiences/${experienceId}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(204);

      // Verificar que foi removida
      const deleted = await prisma.experience.findUnique({
        where: { id: experienceId },
      });
      expect(deleted).toBeNull();
    });
  });

  // ==========================================
  // EDUCAÇÃO
  // ==========================================

  describe("POST /api/v1/candidates/me/education", () => {
    it("should create education successfully", async () => {
      const response = await request(app)
        .post("/api/v1/candidates/me/education")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          institution: "Universidade de Coimbra",
          degree: "Licenciatura",
          field: "Engenharia Informática",
          startDate: "2015-09-01",
          endDate: "2018-07-01",
          current: false,
        })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.institution).toBe("Universidade de Coimbra");
      expect(response.body.degree).toBe("Licenciatura");
      expect(response.body.field).toBe("Engenharia Informática");
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/v1/candidates/me/education")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          institution: "Test University",
          // Missing degree, field, startDate
        })
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });
  });

  describe("PATCH /api/v1/candidates/me/education/:id", () => {
    let educationId: string;

    beforeEach(async () => {
      const education = await prisma.education.create({
        data: {
          candidateId,
          institution: "Old University",
          degree: "Bachelor",
          field: "Computer Science",
          startDate: new Date("2015-09-01"),
          current: false,
        },
      });
      educationId = education.id;
    });

    it("should update education successfully", async () => {
      const response = await request(app)
        .patch(`/api/v1/candidates/me/education/${educationId}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          degree: "Master",
        })
        .expect(200);

      expect(response.body.degree).toBe("Master");
    });
  });

  describe("DELETE /api/v1/candidates/me/education/:id", () => {
    let educationId: string;

    beforeEach(async () => {
      const education = await prisma.education.create({
        data: {
          candidateId,
          institution: "To Delete",
          degree: "Bachelor",
          field: "CS",
          startDate: new Date("2015-09-01"),
          current: false,
        },
      });
      educationId = education.id;
    });

    it("should delete education successfully", async () => {
      await request(app)
        .delete(`/api/v1/candidates/me/education/${educationId}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(204);

      const deleted = await prisma.education.findUnique({
        where: { id: educationId },
      });
      expect(deleted).toBeNull();
    });
  });

  // ==========================================
  // IDIOMAS
  // ==========================================

  describe("POST /api/v1/candidates/me/languages", () => {
    it("should create language successfully", async () => {
      const response = await request(app)
        .post("/api/v1/candidates/me/languages")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          language: "Português",
          level: "NATIVE",
        })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.language).toBe("Português");
      expect(response.body.level).toBe("NATIVE");
    });

    it("should not allow duplicate languages", async () => {
      await prisma.language.create({
        data: {
          candidateId,
          language: "Inglês",
          level: "ADVANCED",
        },
      });

      const response = await request(app)
        .post("/api/v1/candidates/me/languages")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          language: "Inglês",
          level: "NATIVE",
        })
        .expect(400);

      expect(response.body.error).toBe("LANGUAGE_EXISTS");
    });

    it("should validate language level", async () => {
      const response = await request(app)
        .post("/api/v1/candidates/me/languages")
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          language: "Espanhol",
          level: "INVALID_LEVEL",
        })
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });
  });

  describe("PATCH /api/v1/candidates/me/languages/:id", () => {
    let languageId: string;

    beforeEach(async () => {
      const language = await prisma.language.create({
        data: {
          candidateId,
          language: "Francês",
          level: "BASIC",
        },
      });
      languageId = language.id;
    });

    it("should update language level successfully", async () => {
      const response = await request(app)
        .patch(`/api/v1/candidates/me/languages/${languageId}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .send({
          level: "INTERMEDIATE",
        })
        .expect(200);

      expect(response.body.level).toBe("INTERMEDIATE");
    });
  });

  describe("DELETE /api/v1/candidates/me/languages/:id", () => {
    let languageId: string;

    beforeEach(async () => {
      const language = await prisma.language.create({
        data: {
          candidateId,
          language: "Alemão",
          level: "BASIC",
        },
      });
      languageId = language.id;
    });

    it("should delete language successfully", async () => {
      await request(app)
        .delete(`/api/v1/candidates/me/languages/${languageId}`)
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(204);

      const deleted = await prisma.language.findUnique({
        where: { id: languageId },
      });
      expect(deleted).toBeNull();
    });
  });
});

