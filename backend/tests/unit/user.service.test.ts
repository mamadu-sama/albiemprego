// Testes unitários para UserService
import { UserService } from "@/services/user.service";
import { prisma } from "../setup";
import { faker } from "@faker-js/faker";
import { hashPassword } from "@/utils/password";

describe("UserService", () => {
  describe("getProfile", () => {
    it("should return user profile with candidate data", async () => {
      // Criar candidato de teste
      const password = await hashPassword("Test123!");
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          password,
          name: faker.person.fullName(),
          type: "CANDIDATO",
          status: "ACTIVE",
          emailVerified: true,
        },
      });

      await prisma.candidate.create({
        data: {
          userId: user.id,
          skills: ["JavaScript", "React"],
          experienceYears: 3,
          profileCompleteness: 60,
        },
      });

      const profile = await UserService.getProfile(user.id);

      expect(profile).toBeDefined();
      expect(profile.id).toBe(user.id);
      expect(profile.email).toBe(user.email);
      expect(profile).not.toHaveProperty("password");
      expect(profile.candidate).toBeDefined();
      expect(profile.candidate?.skills).toEqual(["JavaScript", "React"]);
    });

    it("should return user profile with company data", async () => {
      const password = await hashPassword("Test123!");
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          password,
          name: faker.person.fullName(),
          type: "EMPRESA",
          status: "ACTIVE",
          emailVerified: true,
        },
      });

      await prisma.company.create({
        data: {
          userId: user.id,
          name: "Test Company",
          nif: "123456789",
        },
      });

      const profile = await UserService.getProfile(user.id);

      expect(profile).toBeDefined();
      expect(profile.company).toBeDefined();
      expect(profile.company?.name).toBe("Test Company");
    });

    it("should throw error if user not found", async () => {
      await expect(
        UserService.getProfile("non-existent-id")
      ).rejects.toThrow("Utilizador não encontrado");
    });
  });

  describe("updateProfile", () => {
    it("should update user basic information", async () => {
      const password = await hashPassword("Test123!");
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          password,
          name: "Original Name",
          type: "CANDIDATO",
          status: "ACTIVE",
        },
      });

      await prisma.candidate.create({
        data: {
          userId: user.id,
          profileCompleteness: 20,
        },
      });

      const updateData = {
        name: "Updated Name",
        phone: "+351912345678",
        location: "Castelo Branco",
        bio: "New bio",
      };

      const updated = await UserService.updateProfile(user.id, updateData);

      expect(updated.name).toBe("Updated Name");
      expect(updated.phone).toBe("+351912345678");
      expect(updated.location).toBe("Castelo Branco");
      expect(updated.bio).toBe("New bio");
      expect(updated).not.toHaveProperty("password");
    });

    it("should not allow updating email", async () => {
      const password = await hashPassword("Test123!");
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          password,
          name: "Test User",
          type: "CANDIDATO",
          status: "ACTIVE",
        },
      });

      const updateData = {
        email: "newemail@example.com", // Não deve ser atualizado
        name: "Updated Name",
      };

      const updated = await UserService.updateProfile(user.id, updateData as any);

      expect(updated.email).toBe(user.email); // Email não mudou
      expect(updated.name).toBe("Updated Name");
    });

    it("should throw error if user not found", async () => {
      await expect(
        UserService.updateProfile("non-existent-id", { name: "Test" })
      ).rejects.toThrow("Utilizador não encontrado");
    });

    it("should validate phone format", async () => {
      const password = await hashPassword("Test123!");
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          password,
          name: "Test User",
          type: "CANDIDATO",
          status: "ACTIVE",
        },
      });

      await expect(
        UserService.updateProfile(user.id, { phone: "invalid-phone" })
      ).rejects.toThrow("Telefone inválido");
    });
  });

  describe("updateAvatar", () => {
    it("should update user avatar URL", async () => {
      const password = await hashPassword("Test123!");
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          password,
          name: "Test User",
          type: "CANDIDATO",
          status: "ACTIVE",
        },
      });

      const avatarUrl = "https://example.com/avatar.jpg";
      const updated = await UserService.updateAvatar(user.id, avatarUrl);

      expect(updated.avatar).toBe(avatarUrl);
    });

    it("should throw error if user not found", async () => {
      await expect(
        UserService.updateAvatar("non-existent-id", "url")
      ).rejects.toThrow("Utilizador não encontrado");
    });
  });

  describe("deleteAvatar", () => {
    it("should remove user avatar", async () => {
      const password = await hashPassword("Test123!");
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          password,
          name: "Test User",
          type: "CANDIDATO",
          status: "ACTIVE",
          avatar: "https://example.com/avatar.jpg",
        },
      });

      const updated = await UserService.deleteAvatar(user.id);

      expect(updated.avatar).toBeNull();
    });
  });
});

