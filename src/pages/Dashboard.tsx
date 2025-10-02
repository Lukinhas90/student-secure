import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StudentCard } from "@/components/students/StudentCard";
import { StudentForm } from "@/components/students/StudentForm";
import { toast } from "@/hooks/use-toast";
import { 
  LogOut, 
  Plus, 
  Search, 
  GraduationCap,
  Loader2 
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Student {
  id: string;
  name: string;
  registration_number: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  enrollment_status: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar alunos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSubmitStudent = async (studentData: Student) => {
    try {
      if (editingStudent) {
        const { error } = await supabase
          .from("students")
          .update(studentData)
          .eq("id", editingStudent.id);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Aluno atualizado com sucesso",
        });
      } else {
        const { error } = await supabase
          .from("students")
          .insert([studentData]);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Aluno adicionado com sucesso",
        });
      }

      loadStudents();
      setEditingStudent(null);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setStudentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", studentToDelete);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Aluno removido com sucesso",
      });

      loadStudents();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleNewStudent = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Sistema de Gestão</h1>
                <p className="text-sm text-muted-foreground">Gerenciamento de Alunos</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, matrícula ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleNewStudent}
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Aluno
            </Button>
          </div>

          {/* Students Grid */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "Tente buscar com outros termos" 
                  : "Comece adicionando seu primeiro aluno"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleNewStudent}
                  className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Aluno
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Student Form Dialog */}
      <StudentForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingStudent(null);
        }}
        onSubmit={handleSubmitStudent}
        student={editingStudent}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
