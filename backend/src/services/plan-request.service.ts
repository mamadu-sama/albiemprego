import { PrismaClient, RequestType, RequestStatus } from "@prisma/client";
import { AppError } from "../utils/errors";

const prisma = new PrismaClient();

export class PlanRequestService {
  /**
   * Empresa solicita um plano
   */
  static async requestPlan(
    companyId: string,
    planId: string,
    message?: string
  ) {
    // Verificar se empresa existe
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new AppError("Empresa não encontrada", 404, "COMPANY_NOT_FOUND");
    }

    // Verificar se plano existe e está ativo
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new AppError("Plano não encontrado", 404, "PLAN_NOT_FOUND");
    }

    if (!plan.isActive) {
      throw new AppError(
        "Este plano não está disponível",
        400,
        "PLAN_NOT_AVAILABLE"
      );
    }

    // Verificar se já existe uma solicitação pendente para este plano
    const existingRequest = await prisma.planRequest.findFirst({
      where: {
        companyId,
        planId,
        status: RequestStatus.PENDING,
      },
    });

    if (existingRequest) {
      throw new AppError(
        "Já existe uma solicitação pendente para este plano",
        409,
        "REQUEST_ALREADY_EXISTS"
      );
    }

    // Criar solicitação
    const request = await prisma.planRequest.create({
      data: {
        companyId,
        planId,
        type: RequestType.PLAN_SUBSCRIPTION,
        message,
      },
      include: {
        plan: true,
        company: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Criar notificação para a empresa
    await prisma.companyNotification.create({
      data: {
        companyId,
        type: "REQUEST_SUBMITTED",
        priority: "NORMAL",
        title: "Solicitação enviada",
        message: `A sua solicitação do plano ${plan.name} foi enviada e está a aguardar aprovação.`,
      },
    });

    return request;
  }

  /**
   * Empresa solicita créditos
   */
  static async requestCredits(
    companyId: string,
    packageId: string,
    message?: string
  ) {
    // Verificar se empresa existe
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new AppError("Empresa não encontrada", 404, "COMPANY_NOT_FOUND");
    }

    // Verificar se pacote existe e está ativo
    const creditPackage = await prisma.creditPackage.findUnique({
      where: { id: packageId },
    });

    if (!creditPackage) {
      throw new AppError("Pacote não encontrado", 404, "PACKAGE_NOT_FOUND");
    }

    if (!creditPackage.isActive) {
      throw new AppError(
        "Este pacote não está disponível",
        400,
        "PACKAGE_NOT_AVAILABLE"
      );
    }

    // Verificar se já existe uma solicitação pendente para este pacote
    const existingRequest = await prisma.planRequest.findFirst({
      where: {
        companyId,
        packageId,
        status: RequestStatus.PENDING,
      },
    });

    if (existingRequest) {
      throw new AppError(
        "Já existe uma solicitação pendente para este pacote",
        409,
        "REQUEST_ALREADY_EXISTS"
      );
    }

    // Criar solicitação
    const request = await prisma.planRequest.create({
      data: {
        companyId,
        packageId,
        type: RequestType.CREDIT_PURCHASE,
        message,
      },
      include: {
        package: true,
        company: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Criar notificação para a empresa
    await prisma.companyNotification.create({
      data: {
        companyId,
        type: "REQUEST_SUBMITTED",
        priority: "NORMAL",
        title: "Solicitação enviada",
        message: `A sua solicitação do pacote ${creditPackage.name} foi enviada e está a aguardar aprovação.`,
      },
    });

    return request;
  }

  /**
   * Listar solicitações de uma empresa
   */
  static async getCompanyRequests(
    companyId: string,
    status?: RequestStatus
  ) {
    const where: any = { companyId };

    if (status) {
      where.status = status;
    }

    const requests = await prisma.planRequest.findMany({
      where,
      include: {
        plan: true,
        package: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return requests.map((request) => {
      if (request.plan && (request.plan as any).features) {
        (request.plan as any).features = JSON.parse(
          (request.plan as any).features as string
        );
      }
      return request;
    });
  }

  /**
   * Listar todas as solicitações (Admin)
   */
  static async getAllRequests(
    status?: RequestStatus,
    type?: RequestType,
    page: number = 1,
    limit: number = 20
  ) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      prisma.planRequest.findMany({
        where,
        include: {
          plan: true,
          package: true,
          company: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.planRequest.count({ where }),
    ]);

    return {
      requests: requests.map((request) => {
        if (request.plan && (request.plan as any).features) {
          (request.plan as any).features = JSON.parse(
            (request.plan as any).features as string
          );
        }
        return request;
      }),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obter detalhes de uma solicitação
   */
  static async getRequestById(requestId: string) {
    const request = await prisma.planRequest.findUnique({
      where: { id: requestId },
      include: {
        plan: true,
        package: true,
        company: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!request) {
      throw new AppError("Solicitação não encontrada", 404, "REQUEST_NOT_FOUND");
    }

    if (request.plan && (request.plan as any).features) {
      (request.plan as any).features = JSON.parse(
        (request.plan as any).features as string
      );
    }

    return request;
  }

  /**
   * Aprovar solicitação (Admin)
   */
  static async approveRequest(
    requestId: string,
    adminId: string,
    adminNotes?: string
  ) {
    const request = await this.getRequestById(requestId);

    if (request.status !== RequestStatus.PENDING) {
      throw new AppError(
        "Apenas solicitações pendentes podem ser aprovadas",
        400,
        "INVALID_STATUS"
      );
    }

    // Atualizar solicitação
    const updatedRequest = await prisma.planRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.APPROVED,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        adminNotes,
      },
      include: {
        plan: true,
        package: true,
        company: true,
      },
    });

    // Executar ação baseada no tipo
    if (request.type === RequestType.PLAN_SUBSCRIPTION && request.planId) {
      // Importar serviço de subscrição
      const { CompanySubscriptionService } = await import(
        "./company-subscription.service"
      );

      // Ativar plano
      await CompanySubscriptionService.assignPlan(
        request.companyId,
        request.planId,
        adminId
      );

      // Notificar empresa
      await prisma.companyNotification.create({
        data: {
          companyId: request.companyId,
          type: "REQUEST_APPROVED",
          priority: "HIGH",
          title: "Solicitação aprovada! 🎉",
          message: `O seu pedido do plano ${request.plan?.name} foi aprovado e está agora ativo!`,
        },
      });
    } else if (
      request.type === RequestType.CREDIT_PURCHASE &&
      request.packageId
    ) {
      // Importar serviço de crédito
      const { CreditService } = await import("./credit.service");

      // Adicionar créditos do pacote
      await CreditService.addCreditsFromPackage(
        request.companyId,
        request.packageId,
        adminId
      );

      // Notificar empresa
      await prisma.companyNotification.create({
        data: {
          companyId: request.companyId,
          type: "REQUEST_APPROVED",
          priority: "HIGH",
          title: "Solicitação aprovada! 🎉",
          message: `O seu pedido do pacote ${request.package?.name} foi aprovado e os créditos foram adicionados!`,
        },
      });
    }

    return updatedRequest;
  }

  /**
   * Rejeitar solicitação (Admin)
   */
  static async rejectRequest(
    requestId: string,
    adminId: string,
    adminNotes?: string
  ) {
    const request = await this.getRequestById(requestId);

    if (request.status !== RequestStatus.PENDING) {
      throw new AppError(
        "Apenas solicitações pendentes podem ser rejeitadas",
        400,
        "INVALID_STATUS"
      );
    }

    // Atualizar solicitação
    const updatedRequest = await prisma.planRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.REJECTED,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        adminNotes,
      },
      include: {
        plan: true,
        package: true,
      },
    });

    // Notificar empresa
    const itemName =
      request.type === RequestType.PLAN_SUBSCRIPTION
        ? request.plan?.name
        : request.package?.name;

    await prisma.companyNotification.create({
      data: {
        companyId: request.companyId,
        type: "REQUEST_REJECTED",
        priority: "NORMAL",
        title: "Solicitação rejeitada",
        message: `O seu pedido de ${itemName} foi rejeitado. ${adminNotes ? `Motivo: ${adminNotes}` : ""}`,
      },
    });

    return updatedRequest;
  }

  /**
   * Cancelar solicitação (Empresa)
   */
  static async cancelRequest(requestId: string, companyId: string) {
    const request = await this.getRequestById(requestId);

    if (request.companyId !== companyId) {
      throw new AppError(
        "Não tem permissão para cancelar esta solicitação",
        403,
        "FORBIDDEN"
      );
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new AppError(
        "Apenas solicitações pendentes podem ser canceladas",
        400,
        "INVALID_STATUS"
      );
    }

    // Atualizar status (reutilizando REJECTED para cancelamento)
    const updatedRequest = await prisma.planRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.REJECTED,
        adminNotes: "Cancelado pela empresa",
      },
    });

    return updatedRequest;
  }

  /**
   * Estatísticas de solicitações (Admin)
   */
  static async getRequestStats() {
    const [total, pending, approved, rejected, byType] = await Promise.all([
      prisma.planRequest.count(),
      prisma.planRequest.count({ where: { status: RequestStatus.PENDING } }),
      prisma.planRequest.count({ where: { status: RequestStatus.APPROVED } }),
      prisma.planRequest.count({ where: { status: RequestStatus.REJECTED } }),
      prisma.planRequest.groupBy({
        by: ["type", "status"],
        _count: true,
      }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
      byType,
    };
  }
}

