import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MessageSquare, 
  Eye,
  Loader2,
  Info,
  ArrowLeft
} from "lucide-react";
import { categories } from "@/data/mockCommunity";
import { CategoryBadge } from "@/components/comunidade/CategoryBadge";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock auth - in real app, redirect if not authenticated
const isAuthenticated = true;

export default function NovaDiscussao() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");

  const maxTitleLength = 200;
  const minContentLength = 50;
  const maxContentLength = 5000;

  const selectedCategory = categories.find(c => c.id === categoryId);
  const isValid = 
    title.trim().length > 0 && 
    title.length <= maxTitleLength &&
    categoryId &&
    content.trim().length >= minContentLength &&
    content.length <= maxContentLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Discussão publicada!",
      description: "A sua discussão foi publicada com sucesso.",
    });
    
    // In real app, navigate to the new discussion
    navigate("/comunidade/discussoes");
  };

  if (!isAuthenticated) {
    navigate("/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container-custom max-w-3xl">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Início</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/comunidade">Comunidade</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/comunidade/discussoes">Discussões</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Nova Discussão</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Nova Discussão
              </CardTitle>
              <CardDescription>
                Inicie uma nova conversa na comunidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Título <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Escreva um título claro e descritivo..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={maxTitleLength}
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-end">
                    <span className={cn(
                      "text-xs",
                      title.length > maxTitleLength * 0.9 ? "text-amber-600" : "text-muted-foreground"
                    )}>
                      {title.length}/{maxTitleLength}
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Categoria <span className="text-destructive">*</span>
                  </Label>
                  <Select value={categoryId} onValueChange={setCategoryId} disabled={isSubmitting}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content">
                      Conteúdo <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="preview" className="text-sm text-muted-foreground cursor-pointer">
                        Pré-visualizar
                      </Label>
                      <Switch
                        id="preview"
                        checked={showPreview}
                        onCheckedChange={setShowPreview}
                        disabled={isSubmitting}
                      />
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  {showPreview ? (
                    <Card className="min-h-[200px] bg-muted/50">
                      <CardContent className="pt-4 prose prose-sm max-w-none dark:prose-invert">
                        {content ? (
                          content.split('\n').map((paragraph, i) => (
                            <p key={i}>{paragraph || <br />}</p>
                          ))
                        ) : (
                          <p className="text-muted-foreground italic">
                            O conteúdo aparecerá aqui...
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Textarea
                      id="content"
                      placeholder="Escreva o conteúdo da sua discussão. Seja claro e respeitoso..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px] resize-y"
                      disabled={isSubmitting}
                    />
                  )}
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      Mínimo {minContentLength} caracteres
                    </span>
                    <span className={cn(
                      content.length < minContentLength ? "text-amber-600" :
                      content.length > maxContentLength * 0.9 ? "text-amber-600" : 
                      "text-muted-foreground"
                    )}>
                      {content.length}/{maxContentLength}
                    </span>
                  </div>
                </div>

                {/* Tips */}
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-300 text-sm">
                    <strong>Dicas para uma boa discussão:</strong>
                    <ul className="list-disc ml-4 mt-1 space-y-1">
                      <li>Use um título claro que descreva o tópico</li>
                      <li>Seja respeitoso e construtivo</li>
                      <li>Forneça contexto suficiente</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                {/* Preview Card */}
                {title && selectedCategory && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Como ficará:</Label>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{title}</span>
                        </div>
                        <CategoryBadge category={selectedCategory} />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => navigate("/comunidade/discussoes")}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  
                  <Button type="submit" disabled={!isValid || isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Publicar Discussão
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
