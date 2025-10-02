import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Student {
  id: string;
  name: string;
  registration_number: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  enrollment_status: string;
}

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentCard = ({ student, onEdit, onDelete }: StudentCardProps) => {
  return (
    <Card className="group hover:shadow-[var(--shadow-hover)] transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-card-foreground">{student.name}</h3>
            <p className="text-sm text-muted-foreground">Matrícula: {student.registration_number}</p>
          </div>
          <Badge
            variant={student.enrollment_status === "Ativo" ? "default" : "secondary"}
            className={student.enrollment_status === "Ativo" ? "bg-gradient-to-r from-primary to-primary-glow" : ""}
          >
            {student.enrollment_status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{student.email}</span>
          </div>
          {student.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{student.phone}</span>
            </div>
          )}
          {student.date_of_birth && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(student.date_of_birth), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(student)}
            className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(student.id)}
            className="flex-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
