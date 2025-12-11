// Script para limpar registos duplicados de maintenance_mode
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupMaintenance() {
  try {
    console.log("🧹 Limpando registos de maintenance_mode...");

    // Contar registos
    const count = await prisma.maintenanceMode.count();
    console.log(`📊 Total de registos: ${count}`);

    if (count > 1) {
      // Pegar o mais recente
      const latest = await prisma.maintenanceMode.findFirst({
        orderBy: { updatedAt: "desc" },
      });

      if (latest) {
        // Apagar todos exceto o mais recente
        const deleted = await prisma.maintenanceMode.deleteMany({
          where: {
            id: { not: latest.id },
          },
        });

        console.log(`🗑️  Removidos ${deleted.count} registos antigos`);
        console.log(`✅ Mantido registo mais recente:`);
        console.log(`   - ID: ${latest.id}`);
        console.log(`   - Enabled: ${latest.enabled}`);
        console.log(`   - Message: ${latest.message}`);
      }
    } else if (count === 0) {
      // Criar registo inicial
      const created = await prisma.maintenanceMode.create({
        data: {
          enabled: false,
          message:
            "Estamos a realizar melhorias na plataforma. Voltaremos em breve!",
        },
      });

      console.log(`✨ Criado registo inicial:`);
      console.log(`   - ID: ${created.id}`);
      console.log(`   - Enabled: ${created.enabled}`);
    } else {
      console.log(`✅ Apenas 1 registo encontrado - tudo ok!`);
    }

    // Mostrar registo final
    const final = await prisma.maintenanceMode.findFirst();
    console.log("\n📋 Estado final:");
    console.log(JSON.stringify(final, null, 2));
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupMaintenance();

