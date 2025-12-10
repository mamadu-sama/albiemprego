import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { adminRequestApi } from "@/lib/api";
import {
  Check,
  X,
  Loader2,
  Eye,
  Package,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  FileText
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

export default function GerirSolicitacoes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");
  const [adminNotes, setAdminNotes] = useState("");

  // Buscar estatísticas
  const { data: stats } = useQuery({
    queryKey: ["requestStats"],
    queryFn: () => adminRequestApi.getRequestStats(),
  });

  // Buscar solicitações
  const { data: requestsData, isLoading } = useQuery({
    queryKey: ["requests", activeTab],
    queryFn: () => adminRequestApi.getAllRequests({
      status: activeTab === "all" ? undefined : activeTab.toUpperCase(),
    }),
  });

  // Mutation para aprovar
  const approveMutation = useMutation({
    mutationFn: ({ requestId, notes }: { requestId: string; notes?: string }) =>
      adminRequestApi.approveRequest(requestId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["requestStats"] });
      toast({
        title: "✅ Solicitação aprovada!",
        description: "O plano/créditos foram ativados para a empresa.",
      });
      setReviewDialogOpen(false);
      setAdminNotes("");
    },
    onError: (error: any) => {
      console.error("Erro ao aprovar:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
      toast({
        title: "Erro ao aprovar",
        description: error.response?.data?.message || error.message || "Erro desconhecido ao aprovar solicitação",
        variant: "destructive",
      });
    },
  });

  // Mutation para rejeitar
  const rejectMutation = useMutation({
    mutationFn: ({ requestId, notes }: { requestId: string; notes?: string }) =>
      adminRequestApi.rejectRequest(requestId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["requestStats"] });
      toast({
        title: "Solicitação rejeitada",
        description: "A empresa foi notificada.",
      });
      setReviewDialogOpen(false);
      setAdminNotes("");
    },
    onError: (error: any) => {
      console.error("Erro ao rejeitar:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
      toast({
        title: "Erro ao rejeitar",
        description: error.response?.data?.message || error.message || "Erro desconhecido ao rejeitar solicitação",
        variant: "destructive",
      });
    },
  });

  const handleReview = (request: any, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setReviewAction(action);
    setReviewDialogOpen(true);
  };

  const handleConfirmReview = () => {
    if (!selectedRequest) return;

    if (reviewAction === "approve") {
      approveMutation.mutate({
        requestId: selectedRequest.id,
        notes: adminNotes || undefined,
      });
    } else {
      rejectMutation.mutate({
        requestId: selectedRequest.id,
        notes: adminNotes || undefined,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      PENDING: { variant: "secondary", icon: Clock, label: "Pendente" },
      APPROVED: { variant: "default", icon: CheckCircle2, label: "Aprovado" },
      REJECTED: { variant: "destructive", icon: XCircle, label: "Rejeitado" },
    };
    const config = variants[status] || variants.PENDING;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    if (type === "PLAN_SUBSCRIPTION") {
      return (
        <Badge variant="outline">
          <Star className="h-3 w-3 mr-1" />
          Plano
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        <Package className="h-3 w-3 mr-1" />
        Créditos
      </Badge>
    );
  };

  const requests = requestsData?.requests || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Gerir Solicitações
            </h1>
            <p className="text-muted-foreground">
              Aprove ou rejeite solicitações de planos e créditos das empresas
            </p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pendentes</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Aprovadas</p>
                      <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Rejeitadas</p>
                      <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="approved">Aprovadas</TabsTrigger>
              <TabsTrigger value="rejected">Rejeitadas</TabsTrigger>
              <TabsTrigger value="all">Todas</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === "pending" && "Solicitações Pendentes"}
                    {activeTab === "approved" && "Solicitações Aprovadas"}
                    {activeTab === "rejected" && "Solicitações Rejeitadas"}
                    {activeTab === "all" && "Todas as Solicitações"}
                  </CardTitle>
                  <CardDescription>
                    {requests.length} {requests.length === 1 ? "solicitação" : "solicitações"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : requests.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Nenhuma solicitação encontrada
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((request: any) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{request.company.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {request.company.user.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{getTypeBadge(request.type)}</TableCell>
                            <TableCell>
                              {request.type === "PLAN_SUBSCRIPTION"
                                ? request.plan?.name
                                : request.package?.name}
                            </TableCell>
                            <TableCell>
                              €
                              {request.type === "PLAN_SUBSCRIPTION"
                                ? request.plan?.price
                                : request.package?.price}
                            </TableCell>
                            <TableCell>
                              {formatDistanceToNow(new Date(request.createdAt), {
                                addSuffix: true,
                                locale: pt,
                              })}
                            </TableCell>
                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                            <TableCell className="text-right">
                              {request.status === "PENDING" ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleReview(request, "approve")}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Aprovar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleReview(request, "reject")}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Rejeitar
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  {request.reviewedAt &&
                                    `Revisado ${formatDistanceToNow(new Date(request.reviewedAt), {
                                      addSuffix: true,
                                      locale: pt,
                                    })}`}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve" ? "Aprovar Solicitação" : "Rejeitar Solicitação"}
            </DialogTitle>
            <DialogDescription asChild>
              <div>
                {selectedRequest && (
                  <>
                    <div className="mb-2">
                      Empresa: <strong>{selectedRequest.company.name}</strong>
                    </div>
                    <div className="mb-2">
                      Item:{" "}
                      <strong>
                        {selectedRequest.type === "PLAN_SUBSCRIPTION"
                          ? selectedRequest.plan?.name
                          : selectedRequest.package?.name}
                      </strong>
                    </div>
                    {selectedRequest.message && (
                      <div className="text-sm mt-2">
                        <strong>Mensagem da empresa:</strong> {selectedRequest.message}
                      </div>
                    )}
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Notas (opcional)
            </label>
            <Textarea
              placeholder={
                reviewAction === "approve"
                  ? "Adicione notas sobre a aprovação..."
                  : "Explique o motivo da rejeição..."
              }
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant={reviewAction === "approve" ? "default" : "destructive"}
              onClick={handleConfirmReview}
              disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              {approveMutation.isPending || rejectMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  A processar...
                </>
              ) : reviewAction === "approve" ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirmar Aprovação
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Confirmar Rejeição
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

