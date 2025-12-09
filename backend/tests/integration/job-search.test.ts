// Testes de integração para busca de vagas e Match Score
import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/database";
import { hashPassword } from "../../src/utils/password";

describe("Job Search API", () => {
  let candidateToken: string;
  let candidateUserId: string;
  let companyToken: string;
  let activeJobId: string;

  beforeAll(async () => {
    // Criar candidato
    const candidateUser = await prisma.user.create({
      data: {
        email: "candidato.search@test.com",
        password: await hashPassword("Password123!"),
        name: "Candidato Search Test",
        type: "CANDIDATO",
        status: "ACTIVE",
        location: "Castelo Branco",
        candidate: {
          create: {
            skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
            experienceYears: 4,
          },
        },
      },
    });
    candidateUserId = candidateUser.id;

    // Login candidato
    const candidateLoginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "candidato.search@test.com",
        password: "Password123!",
      });
    candidateToken = candidateLoginRes.body.accessToken;

    // Criar empresa
    const companyUser = await prisma.user.create({
      data: {
        email: "empresa.search@test.com",
        password: await hashPassword("Password123!"),
        name: "Empresa Search Test",
        type: "EMPRESA",
        status: "ACTIVE",
        company: {
          create: {
            name: "Test Company Search",
            nif: "999888777",
            approvedAt: new Date(),
          },
        },
      },
      include: { company: true },
    });

    // Login empresa
    const companyLoginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "empresa.search@test.com",
        password: "Password123!",
      });
    companyToken = companyLoginRes.body.accessToken;

    // Criar vagas de teste
    const job1 = await prisma.job.create({
      data: {
        companyId: companyUser.company!.id,
        title: "Desenvolvedor React Senior",
        description:
          "Procuramos desenvolvedor React experiente para projetos desafiantes. Trabalho em equipa dinâmica.",
        requirements: [
          "5+ anos de experiência com React",
          "TypeScript avançado",
        ],
        responsibilities: ["Desenvolver componentes", "Code reviews"],
        benefits: ["Seguro de saúde", "Trabalho remoto"],
        skills: ["React", "TypeScript", "Node.js"],
        location: "Castelo Branco",
        type: "FULL_TIME",
        workMode: "HIBRIDO",
        salaryMin: 2000,
        salaryMax: 3000,
        showSalary: true,
        sector: "Tecnologia",
        experienceLevel: "senior",
        status: "ACTIVE",
        publishedAt: new Date(),
        approvedAt: new Date(),
        viewsCount: 50,
      },
    });
    activeJobId = job1.id;

    await prisma.job.create({
      data: {
        companyId: companyUser.company!.id,
        title: "Designer UI/UX",
        description:
          "Procuramos designer criativo para criar experiências incríveis.",
        requirements: ["Experiência com Figma", "Portfolio"],
        responsibilities: ["Design de interfaces"],
        benefits: ["Horário flexível"],
        skills: ["Figma", "Photoshop"],
        location: "Covilhã",
        type: "FULL_TIME",
        workMode: "REMOTO",
        salaryMin: 1500,
        salaryMax: 2000,
        showSalary: true,
        sector: "Design",
        experienceLevel: "mid",
        status: "ACTIVE",
        publishedAt: new Date(),
        approvedAt: new Date(),
        viewsCount: 20,
      },
    });

    await prisma.job.create({
      data: {
        companyId: companyUser.company!.id,
        title: "Backend Developer Node.js",
        description: "Desenvolvedor backend para APIs RESTful escaláveis.",
        requirements: ["Node.js", "Express", "PostgreSQL"],
        responsibilities: ["Desenvolver APIs"],
        benefits: ["Formação contínua"],
        skills: ["Node.js", "PostgreSQL", "TypeScript"],
        location: "Castelo Branco",
        type: "FULL_TIME",
        workMode: "PRESENCIAL",
        salaryMin: 1800,
        salaryMax: 2500,
        showSalary: false, // Sem salário visível
        sector: "Tecnologia",
        experienceLevel: "mid",
        status: "ACTIVE",
        publishedAt: new Date(),
        approvedAt: new Date(),
        viewsCount: 30,
      },
    });

    // Vaga em rascunho (não deve aparecer)
    await prisma.job.create({
      data: {
        companyId: companyUser.company!.id,
        title: "Vaga em Rascunho",
        description: "Esta vaga não deve aparecer na busca pública.",
        requirements: ["Teste"],
        responsibilities: ["Teste"],
        benefits: [],
        skills: [],
        location: "Fundão",
        type: "PART_TIME",
        workMode: "REMOTO",
        sector: "Teste",
        status: "DRAFT", // Rascunho
      },
    });
  });

  afterAll(async () => {
    // Limpar dados de teste
    await prisma.application.deleteMany({
      where: {
        candidate: {
          user: { email: { contains: "search@test.com" } },
        },
      },
    });

    await prisma.job.deleteMany({
      where: {
        company: {
          user: { email: { contains: "search@test.com" } },
        },
      },
    });

    await prisma.candidate.deleteMany({
      where: { user: { email: { contains: "search@test.com" } } },
    });

    await prisma.company.deleteMany({
      where: { user: { email: { contains: "search@test.com" } } },
    });

    await prisma.user.deleteMany({
      where: { email: { contains: "search@test.com" } },
    });
  });

  describe("GET /api/v1/jobs/search", () => {
    it("should return all active jobs without filters", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search")
        .expect(200);

      expect(response.body).toHaveProperty("jobs");
      expect(response.body).toHaveProperty("pagination");
      expect(response.body.jobs.length).toBeGreaterThanOrEqual(3);
      expect(response.body.pagination.total).toBeGreaterThanOrEqual(3);

      // Não deve incluir vagas em DRAFT
      const draftJobs = response.body.jobs.filter(
        (j: any) => j.status === "DRAFT"
      );
      expect(draftJobs.length).toBe(0);
    });

    it("should filter by search text (title)", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?search=React")
        .expect(200);

      expect(response.body.jobs.length).toBeGreaterThanOrEqual(1);
      const reactJob = response.body.jobs.find((j: any) =>
        j.title.includes("React")
      );
      expect(reactJob).toBeDefined();
    });

    it("should filter by location", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?location=Castelo Branco")
        .expect(200);

      expect(response.body.jobs.length).toBeGreaterThanOrEqual(2);
      response.body.jobs.forEach((job: any) => {
        expect(job.location).toBe("Castelo Branco");
      });
    });

    it("should filter by job type", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?type=FULL_TIME")
        .expect(200);

      response.body.jobs.forEach((job: any) => {
        expect(job.type).toBe("FULL_TIME");
      });
    });

    it("should filter by work mode", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?workMode=REMOTO")
        .expect(200);

      response.body.jobs.forEach((job: any) => {
        expect(job.workMode).toBe("REMOTO");
      });
    });

    it("should filter by salary range", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?salaryMin=1500&salaryMax=2500")
        .expect(200);

      response.body.jobs.forEach((job: any) => {
        if (job.salaryMin) {
          expect(job.salaryMin).toBeGreaterThanOrEqual(1500);
        }
        if (job.salaryMax) {
          expect(job.salaryMax).toBeLessThanOrEqual(2500);
        }
      });
    });

    it("should filter by showSalaryOnly", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?showSalaryOnly=true")
        .expect(200);

      response.body.jobs.forEach((job: any) => {
        expect(job.showSalary).toBe(true);
        expect(job.salaryMin).not.toBeNull();
      });
    });

    it("should sort by recent (default)", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?sortBy=recent")
        .expect(200);

      expect(response.body.jobs.length).toBeGreaterThan(0);
      // Verificar que está ordenado por data (mais recente primeiro)
      for (let i = 1; i < response.body.jobs.length; i++) {
        const prev = new Date(response.body.jobs[i - 1].publishedAt);
        const curr = new Date(response.body.jobs[i].publishedAt);
        expect(prev.getTime()).toBeGreaterThanOrEqual(curr.getTime());
      }
    });

    it("should sort by salary (high to low)", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?sortBy=salary-high&showSalaryOnly=true")
        .expect(200);

      expect(response.body.jobs.length).toBeGreaterThan(0);
      // Verificar ordenação decrescente
      for (let i = 1; i < response.body.jobs.length; i++) {
        const prevSalary = response.body.jobs[i - 1].salaryMax || 0;
        const currSalary = response.body.jobs[i].salaryMax || 0;
        expect(prevSalary).toBeGreaterThanOrEqual(currSalary);
      }
    });

    it("should paginate results", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?page=1&limit=2")
        .expect(200);

      expect(response.body.jobs.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination).toHaveProperty("totalPages");
    });

    it("should calculate match scores for authenticated candidates", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("matchScores");
      expect(typeof response.body.matchScores).toBe("object");

      // Verificar que tem scores para as vagas
      const jobIds = response.body.jobs.map((j: any) => j.id);
      jobIds.forEach((jobId: string) => {
        expect(response.body.matchScores[jobId]).toBeDefined();
        expect(response.body.matchScores[jobId]).toBeGreaterThanOrEqual(0);
        expect(response.body.matchScores[jobId]).toBeLessThanOrEqual(100);
      });
    });

    it("should NOT calculate match scores for non-candidates", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search")
        .set("Authorization", `Bearer ${companyToken}`)
        .expect(200);

      expect(response.body.matchScores).toBeUndefined();
    });

    it("should filter by goodMatchesOnly for candidates", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?goodMatchesOnly=true")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("matchScores");

      // Todas as vagas devem ter match >= 70%
      response.body.jobs.forEach((job: any) => {
        const score = response.body.matchScores[job.id];
        expect(score).toBeGreaterThanOrEqual(70);
      });
    });

    it("should return 400 for invalid filters", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?salaryMin=abc")
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });

    it("should return 400 if salaryMax < salaryMin", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?salaryMin=3000&salaryMax=2000")
        .expect(400);

      expect(response.body.error).toBe("VALIDATION_ERROR");
    });

    it("should limit results to max 50 per page", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?limit=100")
        .expect(200);

      expect(response.body.jobs.length).toBeLessThanOrEqual(50);
    });

    it("should combine multiple filters", async () => {
      const response = await request(app)
        .get(
          "/api/v1/jobs/search?location=Castelo Branco&type=FULL_TIME&workMode=HIBRIDO&showSalaryOnly=true"
        )
        .expect(200);

      response.body.jobs.forEach((job: any) => {
        expect(job.location).toBe("Castelo Branco");
        expect(job.type).toBe("FULL_TIME");
        expect(job.workMode).toBe("HIBRIDO");
        expect(job.showSalary).toBe(true);
      });
    });

    it("should return empty array if no matches", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?search=XYZ_NONEXISTENT_TERM_12345")
        .expect(200);

      expect(response.body.jobs).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });
  });

  describe("Match Score Calculation", () => {
    it("should calculate higher score for matching skills", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      const reactJob = response.body.jobs.find((j: any) =>
        j.title.includes("React")
      );
      expect(reactJob).toBeDefined();

      const reactScore = response.body.matchScores[reactJob.id];

      // Candidato tem React, Node.js, TypeScript - deve ter score alto
      expect(reactScore).toBeGreaterThan(60);
    });

    it("should calculate lower score for non-matching skills", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      const designJob = response.body.jobs.find((j: any) =>
        j.title.includes("Designer")
      );

      if (designJob) {
        const designScore = response.body.matchScores[designJob.id];
        // Candidato não tem skills de design - score deve ser menor
        expect(designScore).toBeLessThan(70);
      }
    });

    it("should give bonus for same location", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/search?location=Castelo Branco")
        .set("Authorization", `Bearer ${candidateToken}`)
        .expect(200);

      // Candidato está em Castelo Branco
      response.body.jobs.forEach((job: any) => {
        const score = response.body.matchScores[job.id];
        // Score de localização deve ser alto
        expect(score).toBeGreaterThan(0);
      });
    });
  });
});

