import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpen, BarChart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário já está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-lg">
            <GraduationCap className="h-10 w-10 text-primary-foreground" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              Sistema de Gestão de Alunos
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gerencie seus alunos de forma simples, rápida e eficiente. 
              Controle completo de matrículas, dados e status em um só lugar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity text-lg px-8"
            >
              Acessar Sistema
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl bg-card border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Gestão Completa</h3>
            <p className="text-muted-foreground text-sm">
              Cadastre, edite e gerencie todos os dados dos seus alunos em uma interface intuitiva
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Busca Inteligente</h3>
            <p className="text-muted-foreground text-sm">
              Encontre rapidamente qualquer aluno por nome, matrícula ou e-mail
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Controle de Status</h3>
            <p className="text-muted-foreground text-sm">
              Acompanhe o status de matrícula de cada aluno: ativo ou inativo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
