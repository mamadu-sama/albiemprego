import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Mail, Lock, Trash2, Loader2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ContaEmpresa() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, refreshUserProfile } = useAuth();

  // Estado para Alterar Email
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  // Estado para Alterar Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estado para Eliminar Conta
  const [deletePassword, setDeletePassword] = useState("");

  // Mutation para alterar email
  const updateEmailMutation = useMutation({
    mutationFn: (data: { newEmail: string; currentPassword: string }) =>
      userApi.updateEmail(data),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Email atualizado com sucesso!",
      });
      setNewEmail("");
      setEmailPassword("");
      refreshUserProfile();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao atualizar email",
        variant: "destructive",
      });
    },
  });

  // Mutation para alterar password
  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      userApi.changePassword(data),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Password alterada com sucesso!",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao alterar password",
        variant: "destructive",
      });
    },
  });

  // Mutation para eliminar conta
  const deleteAccountMutation = useMutation({
    mutationFn: (password: string) => userApi.deleteAccount(password),
    onSuccess: () => {
      toast({
        title: "Conta Eliminada",
        description: "A sua conta foi desativada com sucesso.",
      });
      logout();
      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao eliminar conta",
        variant: "destructive",
      });
    },
  });

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !emailPassword) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    updateEmailMutation.mutate({ newEmail, currentPassword: emailPassword });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As passwords não coincidem",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 8) {
      toast({
        title: "Erro",
        description: "A password deve ter no mínimo 8 caracteres",
        variant: "destructive",
      });
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      toast({
        title: "Erro",
        description: "Introduza a sua password para confirmar",
        variant: "destructive",
      });
      return;
    }
    deleteAccountMutation.mutate(deletePassword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Configurações da Conta
              </h1>
              <p className="text-muted-foreground">
                Gerir as suas definições de segurança
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/empresa/perfil/editar">Voltar ao Perfil</Link>
            </Button>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Alterar Email */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Alterar Email
                </CardTitle>
                <CardDescription>
                  Email atual: <strong>{user?.email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateEmail} className="space-y-4">
                  <div>
                    <Label htmlFor="newEmail">Novo Email</Label>
                    <Input
                      id="newEmail"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="seu.novo.email@exemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailPassword">Password Atual</Label>
                    <Input
                      id="emailPassword"
                      type="password"
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={updateEmailMutation.isPending}
                    className="w-full"
                  >
                    {updateEmailMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        A atualizar...
                      </>
                    ) : (
                      "Atualizar Email"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Alterar Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Alterar Password
                </CardTitle>
                <CardDescription>
                  Atualize a sua password para manter a conta segura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Password Atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Nova Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Mínimo 8 caracteres, com maiúsculas, minúsculas e números
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Nova Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="w-full"
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        A alterar...
                      </>
                    ) : (
                      "Alterar Password"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Eliminar Conta */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Zona de Perigo
                </CardTitle>
                <CardDescription>
                  Ações irreversíveis que afetam a sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <h4 className="font-semibold text-destructive mb-2">
                      Eliminar Conta
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Esta ação irá desativar permanentemente a sua conta. Todos
                      os seus dados serão mantidos, mas não poderá aceder à
                      plataforma.
                    </p>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar Conta
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Tem a certeza absoluta?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação irá desativar a sua conta permanentemente.
                            Não poderá aceder à plataforma após esta operação.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4">
                          <Label htmlFor="deletePassword">
                            Confirme a sua password
                          </Label>
                          <Input
                            id="deletePassword"
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="••••••••"
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setDeletePassword("")}
                          >
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={deleteAccountMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deleteAccountMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                A eliminar...
                              </>
                            ) : (
                              "Sim, eliminar conta"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
