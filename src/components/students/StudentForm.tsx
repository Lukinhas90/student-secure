import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface Student {
  id?: string;
  name: string;
  registration_number: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  enrollment_status: string;
}

interface StudentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (student: Student) => Promise<void>;
  student?: Student | null;
}

export const StudentForm = ({ open, onOpenChange, onSubmit, student }: StudentFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Student>({
    name: "",
    registration_number: "",
    email: "",
    phone: "",
    date_of_birth: "",
    enrollment_status: "Ativo",
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        name: "",
        registration_number: "",
        email: "",
        phone: "",
        date_of_birth: "",
        enrollment_status: "Ativo",
      });
    }
  }, [student, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{student ? "Editar Aluno" : "Novo Aluno"}</DialogTitle>
          <DialogDescription>
            {student ? "Atualize as informações do aluno" : "Adicione um novo aluno ao sistema"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration">Matrícula *</Label>
            <Input
              id="registration"
              value={formData.registration_number}
              onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birth">Data de Nascimento</Label>
            <Input
              id="birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.enrollment_status}
              onValueChange={(value) => setFormData({ ...formData, enrollment_status: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                student ? "Atualizar" : "Adicionar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
